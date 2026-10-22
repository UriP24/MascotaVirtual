import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { crearJuego, etapa, moverBolti, paso } from '../src/logic/huesitos.js'
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

test('termina a los 40 segundos o sin vidas', () => {
  const quieta = jugar(crearJuego(), 60, azarFijo([0.5, 0.5]))
  assert.equal(quieta.terminado, true)
  assert.ok(quieta.t <= 40.05)
  const conChocolates = jugar(moverBolti(crearJuego(), 0.5), 60, azarFijo([0.01, 0.5]))
  assert.equal(conChocolates.vidas, 0)
  assert.ok(conChocolates.t < 40, 'terminó antes por perder las vidas')
})

test('balance: jugando bien da cerca del tope, sin pasar de 40', () => {
  let semilla = 7
  const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647)
  const j = jugar(crearJuego(), 41, azar, true)
  assert.ok(j.monedas >= 25 && j.monedas <= 40, `monedas: ${j.monedas}`)
})

test('la velocidad sube por escalones: 5 s lenta, cada 10 s más, últimos 15 s mucho más rápida', () => {
  assert.deepEqual([0, 4.9, 5, 14.9, 15, 24.9, 25, 39].map(etapa), [0, 0, 1, 1, 2, 2, 3, 3])
  const velocidad = (t) => {
    const j = paso({ ...crearJuego(), t, proximaCosa: t }, 0.001, () => 0.5)
    return j.items.at(-1).vy
  }
  assert.ok(velocidad(1) < velocidad(10) && velocidad(10) < velocidad(20) && velocidad(20) < velocidad(30))
  assert.ok(velocidad(30) > velocidad(1) * 2, 'al final, más del doble de rápido')
})

test('el área de Bolti es chica: lo que cae al costado de la cabeza no cuenta', () => {
  const caeA = (x) => paso({ ...crearJuego(), proximaCosa: 999, boltiX: 0.5, items: [{ id: 1, tipo: 'hueso', x, y: 0.8, vy: 0.3 }] }, 0.01)
  assert.equal(caeA(0.55).monedas, 1, 'en la cabeza sí')
  assert.equal(caeA(0.6).monedas, 0, 'al costado no')
})

test('cae bastante cantidad: más de 60 cosas por partida y varios dorados', () => {
  let semilla = 11
  const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647)
  let j = { ...crearJuego(), vidas: 999 }
  let vistos = new Set(), dorados = 0
  for (let t = 0; t < 40; t += 1 / 60) {
    j = paso(j, 1 / 60, azar)
    for (const it of j.items) if (!vistos.has(it.id)) { vistos.add(it.id); if (it.tipo === 'dorado') dorados++ }
  }
  assert.ok(vistos.size > 60, `cosas: ${vistos.size}`)
  assert.ok(dorados >= 4, `dorados: ${dorados}`)
})
