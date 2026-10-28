import { test, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import { cargarEstado, crearEstadoInicial, guardarEstado, importarProgreso } from '../src/storage.js'

// localStorage de mentira (en Node no existe)
function crearAlmacen() {
  const datos = new Map()
  return {
    getItem: (k) => (datos.has(k) ? datos.get(k) : null),
    setItem: (k, v) => datos.set(k, String(v)),
    removeItem: (k) => datos.delete(k),
    datos,
  }
}

beforeEach(() => {
  globalThis.localStorage = crearAlmacen()
})

const LUNES = new Date('2026-11-02T12:00:00')
const MARTES = new Date('2026-11-03T12:00:00')

function conMonedas(monedas) {
  return { ...crearEstadoInicial(), monedas }
}

test('guarda y vuelve a cargar el progreso', () => {
  assert.equal(guardarEstado(conMonedas(77), LUNES), true)
  assert.equal(cargarEstado().monedas, 77)
})

test('copia de hoy (siempre al día) más las de los 6 días anteriores', () => {
  for (let d = 0; d < 10; d++) {
    const dia = new Date(2026, 10, 1 + d, 12)
    guardarEstado(conMonedas(d), dia)
    guardarEstado(conMonedas(d + 100), dia) // la copia de hoy queda con lo último del día
  }
  const hoy = JSON.parse(localStorage.getItem('patitas:copia-hoy'))
  assert.equal(hoy.fecha, '2026-11-10')
  assert.equal(hoy.datos.monedas, 109)
  const anteriores = JSON.parse(localStorage.getItem('patitas:copias'))
  assert.equal(anteriores.length, 6)
  assert.equal(anteriores[0].fecha, '2026-11-09')
  assert.equal(anteriores[0].datos.monedas, 108, 'cada día anterior queda con su último guardado')
})

test('si el guardado se rompe a la tarde, no se pierde lo del día', () => {
  guardarEstado(conMonedas(10), new Date('2026-11-03T09:00:00'))
  guardarEstado(conMonedas(4321), new Date('2026-11-03T18:00:00'))
  localStorage.setItem('patitas:estado', '{roto')
  assert.equal(cargarEstado().monedas, 4321)
})

test('si el guardado principal está roto, recupera la última copia buena', () => {
  guardarEstado(conMonedas(10), LUNES)
  guardarEstado(conMonedas(20), MARTES)
  localStorage.setItem('patitas:estado', '{esto no es JSON')
  assert.equal(cargarEstado().monedas, 20)
  localStorage.setItem('patitas:estado', JSON.stringify({ cualquier: 'cosa' }))
  assert.equal(cargarEstado().monedas, 20)
})

test('si se borró el guardado principal pero quedó una copia, la usa', () => {
  guardarEstado(conMonedas(33), LUNES)
  localStorage.removeItem('patitas:estado')
  assert.equal(cargarEstado().monedas, 33)
})

test('sin nada guardado, arranca de cero', () => {
  assert.equal(cargarEstado().monedas, crearEstadoInicial().monedas)
})

test('si el celu no deja guardar, avisa (devuelve false) en vez de romperse', () => {
  globalThis.localStorage = { getItem: () => null, setItem: () => { throw new Error('lleno') } }
  assert.equal(guardarEstado(conMonedas(1), LUNES), false)
})

test('una actualización con cosas nuevas no pierde el progreso: los campos nuevos se completan', () => {
  const viejo = { ...conMonedas(55), ropa: { tiene: ['corona'], puesta: { cabeza: 'corona' } } }
  delete viejo.estrella
  delete viejo.secretos
  const cargado = importarProgreso(JSON.stringify(viejo))
  assert.equal(cargado.monedas, 55)
  assert.deepEqual(cargado.ropa.tiene, ['corona'])
  assert.ok(cargado.estrella && cargado.secretos, 'lo nuevo arranca con sus valores iniciales')
})
