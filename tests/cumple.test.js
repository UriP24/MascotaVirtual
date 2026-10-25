import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { abrirRegaloDeCumple, hayRegaloDeCumple } from '../src/logic/cumple.js'
import { esCumple, esDiaDeEstudioObligatorio } from '../src/logic/fechas.js'
import { actualizarDia } from '../src/logic/tareas.js'
import { mostrarRegaloDeCumple, sacarGorrito } from '../src/logic/prueba.js'

const CUMPLE = new Date('2026-10-28T11:00:00') // miércoles
const DIA_ANTES = new Date('2026-10-27T11:00:00')
const CUMPLE_QUE_VIENE = new Date('2027-10-28T11:00:00')

test('el cumple es el 28/10 de todos los años', () => {
  assert.equal(esCumple(CUMPLE), true)
  assert.equal(esCumple(CUMPLE_QUE_VIENE), true)
  assert.equal(esCumple(DIA_ANTES), false)
})

test('el día del cumple no hay estudio obligatorio aunque sea día de semana', () => {
  assert.equal(esDiaDeEstudioObligatorio(CUMPLE), false)
  assert.equal(esDiaDeEstudioObligatorio(DIA_ANTES), true)
  const e = actualizarDia(crearEstadoInicial(), CUMPLE)
  assert.equal(e.tareas.length, 0)
})

test('el regalo aparece solo el día del cumple', () => {
  assert.equal(hayRegaloDeCumple(crearEstadoInicial(), CUMPLE), true)
  assert.equal(hayRegaloDeCumple(crearEstadoInicial(), DIA_ANTES), false)
})

test('abrir el regalo: gorrito puesto, torta en la mochila y una multi gratis', () => {
  const e = abrirRegaloDeCumple(crearEstadoInicial(), CUMPLE)
  assert.ok(e.ropa.tiene.includes('gorrito-cumple'))
  assert.equal(e.ropa.puesta.cabeza, 'gorrito-cumple')
  assert.equal(e.inventario.torta, 1)
  assert.equal(e.gacha.tiradasGratis, 10)
  assert.equal(hayRegaloDeCumple(e, CUMPLE), false, 'una sola vez por año')
  assert.deepEqual(abrirRegaloDeCumple(e, CUMPLE), e)
})

test('al año siguiente hay otro regalo (sin repetir el gorrito)', () => {
  const este = abrirRegaloDeCumple(crearEstadoInicial(), CUMPLE)
  assert.equal(hayRegaloDeCumple(este, CUMPLE_QUE_VIENE), true)
  const otro = abrirRegaloDeCumple(este, CUMPLE_QUE_VIENE)
  assert.equal(otro.ropa.tiene.filter((id) => id === 'gorrito-cumple').length, 1)
  assert.equal(otro.inventario.torta, 2)
  assert.equal(otro.gacha.tiradasGratis, 20)
})

test('modo prueba: el regalo aparece cualquier día y se puede sacar el gorrito', () => {
  const conRegalo = mostrarRegaloDeCumple(crearEstadoInicial())
  assert.equal(hayRegaloDeCumple(conRegalo, DIA_ANTES), true)
  const abierto = abrirRegaloDeCumple(conRegalo, DIA_ANTES)
  assert.equal(abierto.ropa.puesta.cabeza, 'gorrito-cumple')
  assert.equal(hayRegaloDeCumple(abierto, DIA_ANTES), false)
  assert.equal(sacarGorrito(abierto).ropa.puesta.cabeza, undefined)
})
