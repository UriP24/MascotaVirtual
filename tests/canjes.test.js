import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { PLANES, precioEnPuntos } from '../src/config.js'
import { canjear, disponibleDesde, marcarCumplido, puntosQueFaltan, buscarPlan } from '../src/logic/canjes.js'

const OCT = new Date('2026-10-24T18:00:00')

function conPuntos(puntos) {
  return { ...crearEstadoInicial(), puntos, puntosGanadosTotal: puntos }
}

test('precios: mitad de Mari / 500 + 5 de margen, redondeando si la unidad es 5 o más', () => {
  const precios = Object.fromEntries(PLANES.map((p) => [p.id, precioEnPuntos(p)]))
  assert.deepEqual(precios, {
    'comer-afuera': 150, // fijo
    cine: 90, // fijo
    'cena-casera': 50, // 40 + 5 = 45 → 50
    helado: 30, // 25 + 5 = 30
    cafe: 30, // 20 + 5 = 25 → 30
    masaje: 20, // fijo
    'dia-de-parque': 10, // 10
    delivery: 50,
    picnic: 20,
    'hoy-no-haces-nada': 20,
    desayuno: 15,
    'noche-de-peli': 10,
    'elegis-la-serie': 10,
  })
})

test('canjear resta puntos del saldo pero no del total ganado, y genera cupón con fecha', () => {
  const r = canjear(conPuntos(170), 'comer-afuera', OCT)
  assert.equal(r.resultado, 'ok')
  assert.equal(r.estado.puntos, 20)
  assert.equal(r.estado.puntosGanadosTotal, 170, 'los puntos ganados nunca bajan')
  const [cupon] = r.estado.cupones
  assert.equal(cupon.costo, 150)
  assert.equal(cupon.fecha, OCT.toISOString())
})

test('sin puntos suficientes no canjea y dice cuántos faltan', () => {
  const e = conPuntos(140)
  assert.equal(canjear(e, 'comer-afuera', OCT).resultado, 'sin-puntos')
  assert.equal(puntosQueFaltan(e, buscarPlan('comer-afuera')), 10)
})

test('se pueden canjear varios planes distintos en el mismo mes', () => {
  let e = conPuntos(200)
  for (const id of ['helado', 'cafe', 'masaje', 'dia-de-parque']) {
    const r = canjear(e, id, OCT)
    assert.equal(r.resultado, 'ok', id)
    e = r.estado
  }
  assert.equal(e.cupones.length, 4)
})

test('los planes chicos: 1 vez por mes cada uno', () => {
  const e = canjear(conPuntos(200), 'cafe', OCT).estado
  assert.equal(canjear(e, 'cafe', new Date('2026-10-31T23:59:00')).resultado, 'en-rotacion')
  assert.equal(disponibleDesde(e, buscarPlan('cafe'), OCT).getTime(), new Date('2026-11-01T00:00:00').getTime())
  assert.equal(canjear(e, 'cafe', new Date('2026-11-01T00:00:00')).resultado, 'ok')
})

test('los grandes: 1 vez cada 3 meses (octubre → enero, cruzando el año)', () => {
  const e = canjear(conPuntos(300), 'comer-afuera', OCT).estado
  assert.equal(canjear(e, 'comer-afuera', new Date('2026-12-31T12:00:00')).resultado, 'en-rotacion')
  assert.equal(disponibleDesde(e, buscarPlan('comer-afuera'), OCT).getTime(), new Date('2027-01-01T00:00:00').getTime())
  assert.equal(canjear(e, 'comer-afuera', new Date('2027-01-01T00:00:00')).resultado, 'ok')
  assert.equal(canjear(e, 'cine', OCT).resultado, 'ok', 'otro plan grande sí se puede')
})

test('la cena casera: 1 vez cada 2 meses', () => {
  const e = canjear(conPuntos(100), 'cena-casera', OCT).estado
  assert.equal(canjear(e, 'cena-casera', new Date('2026-11-20T12:00:00')).resultado, 'en-rotacion')
  assert.equal(canjear(e, 'cena-casera', new Date('2026-12-01T00:00:00')).resultado, 'ok')
})

test('marcar cupón como cumplido', () => {
  let e = canjear(conPuntos(50), 'masaje', OCT).estado
  e = marcarCumplido(e, e.cupones[0].id, new Date('2026-10-26T20:00:00'))
  assert.equal(e.cupones[0].cumplido, true)
  assert.ok(e.cupones[0].cumplidoEn)
})
