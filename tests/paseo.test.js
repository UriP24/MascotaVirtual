import { test } from 'node:test'
import assert from 'node:assert/strict'
import { JUEGOS } from '../src/config.js'
import {
  X_BOLTI,
  crearJuego,
  enElPiso,
  esTareaDePaseo,
  invencible,
  paso,
  puntajeFinal,
  saltar,
} from '../src/logic/paseo.js'

const DT = 1 / 60
const nunca = () => 0.99 // azar que no crea cosas raras (sin caballo, tandas de huesos en el aire)

// Juego sin cosas que aparezcan solas: así cada test pone lo que quiere probar
function juegoVacio() {
  return { ...crearJuego(nunca), proximo: 999, caballoEn: null }
}

function correr(juego, segundos, { saltarCuando } = {}) {
  let j = juego
  for (let i = 0; i < segundos / DT; i++) {
    if (saltarCuando?.(j)) j = saltar(j)
    j = paso(j, DT, nunca)
  }
  return j
}

test('saltar solo desde el piso, y vuelve a caer', () => {
  let j = saltar(juegoVacio())
  assert.ok(j.vy > 0)
  j = paso(j, 0.1, nunca)
  assert.ok(j.y > 0)
  assert.equal(saltar(j).vy, j.vy, 'en el aire no vuelve a saltar')
  j = correr(j, 1)
  assert.ok(enElPiso(j))
})

test('chocar un obstáculo saca una vida; saltarlo da puntos', () => {
  const conGato = { ...juegoVacio(), items: [{ id: 1, tipo: 'gato', x: 0.6, altura: 0 }] }
  const choca = correr(conGato, 1.5)
  assert.equal(choca.vidas, JUEGOS.PASEO_VIDAS - 1)
  const salta = correr(conGato, 1.5, { saltarCuando: (j) => j.items[0] && j.items[0].x - X_BOLTI < 0.2 })
  assert.equal(salta.vidas, JUEGOS.PASEO_VIDAS)
  assert.equal(salta.saltados, 1)
})

test('los huesitos se juntan pasando por encima (o saltando si están en el aire)', () => {
  const conHueso = { ...juegoVacio(), items: [{ id: 1, tipo: 'hueso', x: 0.5, altura: 0.02 }] }
  const j = correr(conHueso, 1)
  assert.equal(j.huesos, 1)
  const enElAire = { ...juegoVacio(), items: [{ id: 1, tipo: 'dorado', x: 0.5, altura: 0.24 }] }
  assert.equal(correr(enElAire, 1).huesos, 0, 'sin saltar no lo alcanza')
})

test('si el caballo la agarra en el piso, la patea: no pierde vidas y queda invencible', () => {
  const conCaballo = {
    ...juegoVacio(),
    items: [
      { id: 1, tipo: 'caballo', x: 0.45, altura: 0 },
      { id: 2, tipo: 'bici', x: 0.9, altura: 0 },
    ],
  }
  let j = correr(conCaballo, 0.4)
  assert.equal(j.patadas, 1)
  assert.ok(invencible(j))
  j = correr(j, 2)
  assert.equal(j.vidas, JUEGOS.PASEO_VIDAS, 'invencible: la bici no la frena')
})

test('si salta justo cuando el caballo patea, lo esquiva y gana puntos', () => {
  const conCaballo = { ...juegoVacio(), items: [{ id: 1, tipo: 'caballo', x: 0.6, altura: 0 }] }
  const j = correr(conCaballo, 1.5, { saltarCuando: (jj) => jj.items[0] && jj.items[0].x - X_BOLTI < 0.2 })
  assert.equal(j.patadas, 0)
  assert.equal(j.esquivas, 1)
  assert.equal(invencible(j), false)
})

test('invencible, los puntos valen doble', () => {
  const normal = correr(juegoVacio(), 1)
  const doble = correr({ ...juegoVacio(), invencibleHasta: 99 }, 1)
  assert.ok(doble.puntos > normal.puntos * 1.9)
})

test('el caballo sale una sola vez y alrededor suyo no aparecen obstáculos', () => {
  let j = { ...crearJuego(() => 0.2, true), proximo: 0, invencibleHasta: 99 } // sin perder vidas en el camino
  let caballos = 0
  for (let i = 0; i < 12 / DT; i++) {
    j = paso(j, DT, () => 0.2)
    caballos = Math.max(caballos, j.items.filter((it) => it.tipo === 'caballo').length)
    if (j.t > j.caballoEn - 1.5 && j.t < j.caballoEn + 2.5) {
      assert.ok(!j.items.some((it) => it.tipo !== 'caballo' && it.x > 1.05), 'no salen cosas nuevas cerca del caballo')
    }
  }
  assert.equal(caballos, 1)
})

test('el caballo aparece una vez por paseo si toca (o seguro, en modo prueba)', () => {
  assert.equal(crearJuego(() => 0.9).caballoEn, null)
  assert.ok(crearJuego(() => 0.1).caballoEn >= JUEGOS.PASEO_CABALLO_DESDE)
  assert.ok(crearJuego(() => 0.9, true).caballoEn !== null)
})

test('termina al acabarse el tiempo o las vidas; el puntaje suma las vidas que quedan', () => {
  const j = correr(juegoVacio(), JUEGOS.PASEO_DURACION_SEGUNDOS + 0.1)
  assert.equal(j.terminado, true)
  assert.equal(puntajeFinal(j), Math.round(j.puntos) + JUEGOS.PASEO_VIDAS * JUEGOS.PASEO_PUNTOS_POR_VIDA)
  assert.equal(paso({ ...juegoVacio(), vidas: 0 }, DT, nunca).terminado, true)
})

test('la tarea "pasear a Bolti", sin importar mayúsculas ni tildes', () => {
  assert.equal(esTareaDePaseo('Pasear a Bolti'), true)
  assert.equal(esTareaDePaseo('sacar a PASEAR a bolti 🐶'), true)
  assert.equal(esTareaDePaseo('Paseo con Bolti'), true)
  assert.equal(esTareaDePaseo('Pasear al perro'), false)
  assert.equal(esTareaDePaseo('Estudiar'), false)
})

test('cada obstáculo se puede saltar a tiempo, aun a la velocidad más alta', () => {
  const rapido = JUEGOS.PASEO_ETAPAS.at(-1).desde + 1
  for (const tipo of ['charco', 'gato', 'bici']) {
    const conObstaculo = { ...juegoVacio(), t: rapido, items: [{ id: 1, tipo, x: 0.8, altura: 0 }] }
    // Salta un poquito antes de que el obstáculo llegue a su cabeza
    const j = correr(conObstaculo, 1.5, { saltarCuando: (jj) => jj.items[0] && jj.items[0].x - X_BOLTI < 0.24 })
    assert.equal(j.vidas, JUEGOS.PASEO_VIDAS, tipo)
    assert.equal(j.saltados, 1, tipo)
  }
})

test('los huesitos se agarran tocándolos con cualquier parte (también con la cabeza al saltar)', () => {
  const enElAire = { ...juegoVacio(), items: [{ id: 1, tipo: 'hueso', x: 0.6, altura: 0.22 }] }
  const j = correr(enElAire, 1.5, { saltarCuando: (jj) => jj.items[0] && jj.items[0].x - X_BOLTI < 0.3 })
  assert.equal(j.huesos, 1)
})
