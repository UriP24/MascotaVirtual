import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { canjear, marcarCumplido, proximoCanje, puedeCanjearEsteMes, puntosQueFaltan, buscarPlan } from '../src/logic/canjes.js'

const OCT = new Date('2026-10-24T18:00:00')

function conPuntos(puntos) {
  return { ...crearEstadoInicial(), puntos, puntosGanadosTotal: puntos }
}

test('canjear resta puntos del saldo pero no del total ganado, y genera cupón con fecha', () => {
  const r = canjear(conPuntos(100), 'comer-afuera', OCT)
  assert.equal(r.resultado, 'ok')
  assert.equal(r.estado.puntos, 20)
  assert.equal(r.estado.puntosGanadosTotal, 100, 'los puntos ganados nunca bajan')
  const [cupon] = r.estado.cupones
  assert.equal(cupon.nombre, 'Salir a comer')
  assert.equal(cupon.costo, 80)
  assert.equal(cupon.fecha, OCT.toISOString())
  assert.equal(cupon.cumplido, false)
})

test('sin puntos suficientes no canjea y dice cuántos faltan', () => {
  const e = conPuntos(70)
  assert.equal(canjear(e, 'comer-afuera', OCT).resultado, 'sin-puntos')
  assert.equal(puntosQueFaltan(e, buscarPlan('comer-afuera')), 10)
})

test('1 canje por mes calendario, sea cual sea', () => {
  const e = canjear(conPuntos(200), 'helado', OCT).estado
  assert.equal(puedeCanjearEsteMes(e, OCT), false)
  assert.equal(canjear(e, 'cafe', new Date('2026-10-31T23:59:00')).resultado, 'limite-mes')
  assert.equal(canjear(e, 'cafe', new Date('2026-11-01T00:00:00')).resultado, 'ok', 'el día 1 se renueva')
})

test('el próximo canje es el día 1 del mes siguiente, también en diciembre', () => {
  assert.equal(proximoCanje(OCT).getTime(), new Date('2026-11-01T00:00:00').getTime())
  assert.equal(proximoCanje(new Date('2026-12-15T10:00:00')).getTime(), new Date('2027-01-01T00:00:00').getTime())
})

test('canje de diciembre no bloquea enero', () => {
  const e = canjear(conPuntos(100), 'cine', new Date('2026-12-20T12:00:00')).estado
  assert.equal(puedeCanjearEsteMes(e, new Date('2027-01-02T12:00:00')), true)
})

test('marcar cupón como cumplido', () => {
  let e = canjear(conPuntos(50), 'masaje', OCT).estado
  e = marcarCumplido(e, e.cupones[0].id, new Date('2026-10-26T20:00:00'))
  assert.equal(e.cupones[0].cumplido, true)
  assert.ok(e.cupones[0].cumplidoEn)
})
