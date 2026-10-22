import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { crearJuego, etapa, moverBolti, paso, puntajeFinal, multiplicadorRacha } from '../src/logic/huesitos.js'
import { monedasPorPuntaje, monedasPorRecord } from '../src/logic/puntaje.js'
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

test('empezar gasta 10 de energía; terminar convierte el puntaje en monedas, cariño y festejo', () => {
  let e = empezarPartida(estado({ energia: 50, carino: 60 }), TARDE)
  assert.equal(e.perrita.energia, 40)
  const r = terminarPartida(e, 'huesitos', 850)
  assert.equal(r.monedas, 25 + 10, '850 puntos = 25 monedas, +10 por ser récord de más de 500')
  assert.equal(r.nuevoRecord, true)
  assert.equal(r.estado.monedas, 35)
  assert.equal(r.estado.perrita.carino, 68)
  assert.equal(r.estado.records.huesitos, 850)
  assert.ok(r.estado.perrita.festejo.juegos > 0)
})

test('récord: solo da el premio si supera el anterior', () => {
  const e = { ...estado(), records: { huesitos: 900 } }
  const peor = terminarPartida(e, 'huesitos', 850)
  assert.equal(peor.nuevoRecord, false)
  assert.equal(peor.monedas, 25)
  assert.equal(peor.estado.records.huesitos, 900)
})

test('tabla puntaje → monedas, sin tope', () => {
  const casos = [[0, 5], [199, 5], [200, 10], [650, 20], [999, 25], [1000, 30], [1599, 35], [1600, 40], [1899, 40], [1900, 45], [3100, 65]]
  for (const [puntaje, monedas] of casos) assert.equal(monedasPorPuntaje(puntaje), monedas, `${puntaje} puntos`)
})

test('atrapar suma puntos; el chocolate saca una vida y corta la racha sin restar puntos', () => {
  let j = { ...crearJuego(), proximaCosa: 999, items: [{ id: 1, tipo: 'hueso', x: 0.5, y: 0.78, vy: 0.3 }] }
  j = paso(j, 0.01)
  assert.equal(j.puntos, 10)
  assert.equal(j.racha, 1)
  j = { ...j, items: [{ id: 2, tipo: 'dorado', x: 0.5, y: 0.78, vy: 0.3 }] }
  j = paso(j, 0.01)
  assert.equal(j.puntos, 40)
  j = { ...j, items: [{ id: 3, tipo: 'chocolate', x: 0.5, y: 0.78, vy: 0.3 }] }
  j = paso(j, 0.01)
  assert.equal(j.vidas, 2)
  assert.equal(j.racha, 0)
  assert.equal(j.puntos, 40, 'el chocolate no resta puntos')
})

test('racha: ×2 desde 10 seguidos y ×3 desde 25; corazones al final suman 100 c/u', () => {
  assert.deepEqual([1, 9, 10, 24, 25, 40].map(multiplicadorRacha), [1, 1, 2, 2, 3, 3])
  let j = { ...crearJuego(), proximaCosa: 999, racha: 9, items: [{ id: 1, tipo: 'hueso', x: 0.5, y: 0.78, vy: 0.3 }] }
  j = paso(j, 0.01)
  assert.equal(j.puntos, 20, 'el décimo seguido ya vale doble')
  assert.equal(puntajeFinal({ ...j, vidas: 2 }), 220)
})

test('si no está debajo, se le escapa', () => {
  let j = { ...crearJuego(), proximaCosa: 999, boltiX: 0.1, items: [{ id: 1, tipo: 'hueso', x: 0.8, y: 0.75, vy: 0.3 }] }
  j = jugar(j, 2, Math.random)
  assert.equal(j.puntos, 0)
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

test('balance: jugando perfecto da un puntaje alto (más de 1.600 → 40 monedas o más)', () => {
  let semilla = 7
  const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647)
  const j = jugar(crearJuego(), 41, azar, true)
  assert.ok(monedasPorPuntaje(puntajeFinal(j)) >= 40, `puntaje: ${puntajeFinal(j)}`)
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
  assert.equal(caeA(0.55).puntos, 10, 'en la cabeza sí')
  assert.equal(caeA(0.6).puntos, 0, 'al costado no')
})

test('cae bastante cantidad: más de 120 cosas por partida y varios dorados', () => {
  let semilla = 11
  const azar = () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647)
  let j = { ...crearJuego(), vidas: 999 }
  let vistos = new Set(), dorados = 0
  for (let t = 0; t < 40; t += 1 / 60) {
    j = paso(j, 1 / 60, azar)
    for (const it of j.items) if (!vistos.has(it.id)) { vistos.add(it.id); if (it.tipo === 'dorado') dorados++ }
  }
  assert.ok(vistos.size > 120, `cosas: ${vistos.size}`)
  assert.ok(dorados >= 10, `dorados: ${dorados}`)
})

test('el premio por récord crece con el puntaje: 500 → +10, 1.000 → +20, mínimo 5', () => {
  assert.deepEqual([100, 499, 500, 999, 1000, 1500, 2300].map(monedasPorRecord), [5, 5, 10, 10, 20, 30, 40])
})
