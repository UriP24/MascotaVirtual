import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { crearJuego, moverBolti, paso } from '../src/logic/huesitos.js'
import { empezarPartida, puedeJugar, terminarPartida } from '../src/logic/juegos.js'

const TARDE = new Date('2026-10-25T16:00:00').getTime()

function estado(perrita = {}) {
  const e = crearEstadoInicial()
  return { ...e, monedas: 0, perrita: { ...e.perrita, durmiendo: false, forzado: null, actualizadaEn: TARDE, ...perrita } }
}

// Azar predecible: devuelve los valores de la lista en orden, en bucle
function azarFijo(valores) {
  let i = 0
  return () => valores[i++ % valores.length]
}

function jugar(juego, segundos, azar, seguir = false) {
  let j = juego
  for (let t = 0; t < segundos && !j.terminado; t += 1 / 60) {
    if (seguir) {
      const proximo = j.items.filter((it) => it.tipo !== 'chocolate').sort((a, b) => b.y - a.y)[0]
      if (proximo) j = moverBolti(j, proximo.x)
    }
    j = paso(j, 1 / 60, azar)
  }
  return j
}

test('puede jugar despierta y con energía; no dormida ni cansada', () => {
  assert.equal(puedeJugar(estado(), TARDE).ok, true)
  assert.equal(puedeJugar(estado({ durmiendo: true, forzado: { durmiendo: true, hasta: TARDE + 3600e3 } }), TARDE).motivo, 'durmiendo')
  assert.equal(puedeJugar(estado({ energia: 5 }), TARDE).motivo, 'cansada')
})

test('empezar gasta 10 de energía; terminar da monedas, cariño y festejo', () => {
  let e = empezarPartida(estado({ energia: 50, carino: 60 }), TARDE)
  assert.equal(e.perrita.energia, 40)
  e = terminarPartida(e, 23)
  assert.equal(e.monedas, 23)
  assert.equal(e.perrita.carino, 68)
  assert.ok(e.perrita.festejo.juegos > 0)
})

test('nunca da más de 40 monedas por partida', () => {
  assert.equal(terminarPartida(estado(), 99).monedas, 40)
})

test('Bolti atrapa lo que le cae en la boca; el chocolate saca una vida', () => {
  let j = { ...crearJuego(), proximaCosa: 999, items: [{ id: 1, tipo: 'hueso', x: 0.5, y: 0.75, vy: 0.3 }] }
  j = paso(j, 0.1)
  assert.equal(j.monedas, 1)
  assert.equal(j.items.length, 0)
  j = { ...j, items: [{ id: 2, tipo: 'chocolate', x: 0.5, y: 0.75, vy: 0.3 }] }
  j = paso(j, 0.1)
  assert.equal(j.vidas, 2)
  assert.equal(j.monedas, 1, 'el chocolate no resta monedas')
})

test('si no está debajo, se le escapa', () => {
  let j = { ...crearJuego(), proximaCosa: 999, boltiX: 0.1, items: [{ id: 1, tipo: 'hueso', x: 0.8, y: 0.75, vy: 0.3 }] }
  j = jugar(j, 2, Math.random)
  assert.equal(j.monedas, 0)
  assert.equal(j.items.length, 0, 'se cayó de la pantalla')
})

test('termina a los 45 segundos o sin vidas', () => {
  const quieta = jugar(crearJuego(), 60, azarFijo([0.5, 0.5]))
  assert.equal(quieta.terminado, true)
  assert.ok(quieta.t <= 45.05)
  const conChocolates = jugar(moverBolti(crearJuego(), 0.5), 60, azarFijo([0.01, 0.5]))
  assert.equal(conChocolates.vidas, 0)
  assert.ok(conChocolates.t < 45, 'terminó antes por perder las vidas')
})

test('balance: jugando bien da cerca del tope, sin pasar de 40', () => {
  let semilla = 7
  const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647)
  const j = jugar(crearJuego(), 46, azar, true)
  assert.ok(j.monedas >= 25 && j.monedas <= 40, `monedas: ${j.monedas}`)
})
