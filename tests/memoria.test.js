import { test } from 'node:test'
import assert from 'node:assert/strict'
import { avanzar, crearPartida, tocarCarta } from '../src/logic/memoria.js'

// Azar con semilla, para que las cartas salgan siempre igual
function azarSemilla(semilla) {
  return () => ((semilla = (semilla * 16807) % 2147483647) / 2147483647)
}

function sinVistazo(p) {
  return p // ya no hay vistazo: las cartas arrancan tapadas
}

function indicesDe(p, simbolo) {
  return p.cartas.map((c, i) => (c.simbolo === simbolo ? i : -1)).filter((i) => i >= 0)
}

test('el nivel 1 tiene 3 pares bien mezclados y arrancan tapadas', () => {
  const p = crearPartida(azarSemilla(3))
  assert.equal(p.cartas.length, 6)
  const simbolos = p.cartas.map((c) => c.simbolo)
  for (const s of simbolos) assert.equal(simbolos.filter((x) => x === s).length, 2)
  assert.ok(p.cartas.every((c) => c.estado === 'oculta'))
  assert.notEqual(tocarCarta(p, 0), p, 'se puede tocar enseguida')
})

test('par a la primera: 30 puntos; después de equivocarse: 20; equivocarse no resta tiempo', () => {
  let p = sinVistazo(crearPartida(azarSemilla(5)))
  const [a, b] = indicesDe(p, p.cartas[0].simbolo)
  const otra = p.cartas.findIndex((c) => c.simbolo !== p.cartas[0].simbolo)
  p = tocarCarta(p, a)
  p = tocarCarta(p, otra)
  assert.equal(p.evento, 'error')
  assert.equal(tocarCarta(p, b), p, 'mientras se muestran las dos, no se puede tocar otra')
  const tiempoAntes = p.tiempo
  p = avanzar(p, 1)
  assert.ok(p.cartas.every((c) => c.estado === 'oculta'))
  assert.equal(p.tiempo, tiempoAntes - 1, 'solo corre el reloj, sin castigo')
  p = tocarCarta(tocarCarta(p, a), b)
  assert.equal(p.evento, 'par')
  assert.equal(p.puntos, 20, 'no fue a la primera')
  assert.equal(p.seEquivoco, false)
})

test('completar el nivel suma tiempo, +50 × nivel y pasa a 4 pares', () => {
  const azar = azarSemilla(9)
  let p = sinVistazo(crearPartida(azar))
  const tiempoAntes = p.tiempo
  for (const simbolo of [...new Set(p.cartas.map((c) => c.simbolo))]) {
    const [a, b] = indicesDe(p, simbolo)
    p = tocarCarta(tocarCarta(p, a, azar), b, azar)
  }
  assert.equal(p.evento, 'nivel')
  assert.equal(p.nivel, 2)
  assert.equal(p.cartas.length, 8)
  assert.equal(p.puntos, 3 * 30 + 50, '3 pares a la primera + bonus del nivel 1')
  assert.equal(p.tiempo, tiempoAntes + 10)
})

test('del nivel 4 en adelante son 8 pares', () => {
  const azar = azarSemilla(13)
  let p = crearPartida(azar)
  for (let n = 1; n <= 4; n++) {
    p = sinVistazo(p)
    for (const simbolo of [...new Set(p.cartas.map((c) => c.simbolo))]) {
      const [a, b] = indicesDe(p, simbolo)
      p = tocarCarta(tocarCarta(p, a, azar), b, azar)
    }
  }
  assert.equal(p.nivel, 5)
  assert.equal(p.cartas.length, 16)
})

test('termina cuando se acaba el tiempo', () => {
  let p = crearPartida(azarSemilla(2))
  p = avanzar(p, 100)
  assert.equal(p.terminado, true)
})
