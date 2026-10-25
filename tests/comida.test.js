import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { ECONOMIA } from '../src/config.js'
import { comprar, darDeComer, comidasEnInventario, comidasALaVenta } from '../src/logic/comida.js'

const TARDE = new Date('2026-10-23T15:00:00').getTime()

function estado(perrita = {}, extra = {}) {
  const e = crearEstadoInicial()
  return { ...e, perrita: { ...e.perrita, durmiendo: false, actualizadaEn: TARDE, forzado: null, ...perrita }, ...extra }
}

test('arranca con las monedas de bienvenida y el inventario vacío', () => {
  const e = crearEstadoInicial()
  assert.equal(e.monedas, ECONOMIA.MONEDAS_DE_BIENVENIDA)
  assert.equal(comidasEnInventario(e).length, 0)
})

test('comprar resta monedas (nunca puntos) y suma al inventario', () => {
  const e = estado({}, { monedas: 30, puntos: 7 })
  const r = comprar(e, 'carne')
  assert.ok(r.ok)
  assert.equal(r.estado.monedas, 15)
  assert.equal(r.estado.puntos, 7)
  assert.equal(r.estado.inventario.carne, 1)
})

test('sin monedas suficientes no compra', () => {
  const e = estado({}, { monedas: 4 })
  const r = comprar(e, 'croquetas')
  assert.equal(r.ok, false)
  assert.equal(r.estado, e)
})

test('la torta no se vende', () => {
  assert.equal(comprar(estado({}, { monedas: 999 }), 'torta').ok, false)
  assert.ok(!comidasALaVenta().some((c) => c.id === 'torta'))
})

test('darle de comer suma panza y cariño y gasta la comida', () => {
  let e = comprar(estado({ saciedad: 40, carino: 50 }), 'asado').estado
  const r = darDeComer(e, 'asado', TARDE)
  assert.equal(r.resultado, 'comio')
  assert.equal(r.estado.perrita.saciedad, 90)
  assert.equal(r.estado.perrita.carino, 60)
  assert.equal(r.estado.inventario.asado, 0)
})

test('llena no come y no gasta la comida', () => {
  const e = comprar(estado({ saciedad: 97 }), 'galletita').estado
  const r = darDeComer(e, 'galletita', TARDE)
  assert.equal(r.resultado, 'llena')
  assert.equal(r.estado.inventario.galletita, 1)
})

test('dormida no come', () => {
  const e = comprar(estado({ durmiendo: true, forzado: { durmiendo: true, hasta: TARDE + 3600e3 } }), 'queso').estado
  const r = darDeComer(e, 'queso', TARDE)
  assert.equal(r.resultado, 'durmiendo')
  assert.equal(r.estado.inventario.queso, 1)
})

test('sin esa comida en el inventario', () => {
  assert.equal(darDeComer(estado(), 'patita', TARDE).resultado, 'sin-comida')
})

test('la panza no pasa de 100', () => {
  const e = { ...estado({ saciedad: 90 }), inventario: { ...crearEstadoInicial().inventario, asado: 1 } }
  assert.equal(darDeComer(e, 'asado', TARDE).estado.perrita.saciedad, 100)
})
