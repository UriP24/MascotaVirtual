import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial, importarProgreso } from '../src/storage.js'
import { GACHA, PRENDAS, TEMPORADAS } from '../src/config.js'
import {
  canjearPiezas,
  estaDisponible,
  buscarPrenda,
  faltanParaUltra,
  prendasCanjeables,
  prendasDisponibles,
  progresoColeccion,
  regalarTiradas,
  temporadasActivas,
  tirar,
} from '../src/logic/gacha.js'

const OCT = new Date('2026-10-25T18:00:00')
const NOV = new Date('2026-11-10T18:00:00')
const DIC = new Date('2026-12-20T18:00:00')

function conPuntos(puntos) {
  return { ...crearEstadoInicial(), puntos, puntosGanadosTotal: puntos }
}

// Números "al azar" que se repiten en orden: así cada tirada sale como queremos
function azar(...valores) {
  let i = 0
  return () => valores[i++ % valores.length]
}
// Rareza: la primera posible (común, o rara si está asegurada) · sin ⭐ · la primera prenda
const laPrimera = () => azar(0, 0.99, 0)

test('catálogo: ids únicos, temporadas que existen y prendas de siempre en cada rareza', () => {
  const ids = PRENDAS.map((p) => p.id)
  assert.equal(new Set(ids).size, ids.length)
  const temporadas = TEMPORADAS.map((t) => t.id)
  for (const p of PRENDAS) if (p.temporada) assert.ok(temporadas.includes(p.temporada), p.id)
  for (const rareza of ['comun', 'rara', 'epica', 'ultra']) {
    assert.ok(PRENDAS.some((p) => p.rareza === rareza && !p.temporada && !p.exclusiva), rareza)
  }
})

test('cada temporada tiene su conjunto ultra raro destacado', () => {
  for (const t of TEMPORADAS) {
    assert.ok(PRENDAS.some((p) => p.temporada === t.id && p.rareza === 'ultra'), t.id)
  }
})

test('los premios de ⭐ devuelven menos de lo que cuesta la tirada', () => {
  const promedio = Object.values(GACHA.PREMIOS_PUNTOS).reduce((s, p) => s + p.chance * p.puntos, 0)
  assert.ok(promedio < GACHA.PRECIO_TIRADA / 2, `devuelve ${promedio} ⭐ por tirada`)
})

test('temporadas de Argentina: octubre es primavera y Halloween, diciembre Navidad', () => {
  assert.deepEqual(temporadasActivas(OCT).map((t) => t.id), ['primavera', 'halloween'])
  assert.deepEqual(temporadasActivas(DIC).map((t) => t.id), ['navidad', 'primavera'])
  assert.deepEqual(temporadasActivas(new Date('2026-12-05T12:00:00')).map((t) => t.id), ['primavera'], 'Navidad recién el 10/12')
  assert.deepEqual(temporadasActivas(new Date('2027-01-05T12:00:00')).map((t) => t.id), [], 'después de diciembre, nada de Navidad')
  assert.deepEqual(temporadasActivas(new Date('2026-11-01T12:00:00')).map((t) => t.id), ['primavera'], 'terminó Halloween')
  assert.deepEqual(temporadasActivas(new Date('2026-07-01T12:00:00')).map((t) => t.id), ['invierno'])
})

test('la ropa de temporada solo sale en su época y las exclusivas nunca', () => {
  const capa = buscarPrenda('capa-vampiro')
  assert.equal(estaDisponible(capa, OCT), true)
  assert.equal(estaDisponible(capa, NOV), false)
  assert.equal(estaDisponible(buscarPrenda('gorrito-cumple'), OCT), false)
  assert.equal(estaDisponible(buscarPrenda('corona'), NOV), true)
  assert.ok(!prendasDisponibles('ultra', DIC).some((p) => p.temporada === 'halloween'))
})

test('una tirada cuesta 5 ⭐ y la multi 50 ⭐ (10 premios)', () => {
  const una = tirar(conPuntos(60), 1, OCT, laPrimera())
  assert.equal(una.resultado, 'ok')
  assert.equal(una.premios.length, 1)
  assert.equal(una.estado.puntos, 55)
  const multi = tirar(conPuntos(60), 10, OCT, laPrimera())
  assert.equal(multi.premios.length, 10)
  assert.equal(multi.estado.puntos, 10)
  assert.equal(multi.estado.puntosGanadosTotal, 60, 'gastar no baja lo ganado')
})

test('sin puntos suficientes no tira', () => {
  const r = tirar(conPuntos(49), 10, OCT, laPrimera())
  assert.equal(r.resultado, 'sin-puntos')
  assert.equal(r.estado.puntos, 49)
})

test('cada multi trae al menos una rara o mejor', () => {
  const r = tirar(conPuntos(50), 10, OCT, laPrimera())
  const rarezas = r.premios.map((p) => p.rareza)
  assert.equal(rarezas.filter((x) => x === 'comun').length, 9)
  assert.equal(rarezas[9], 'rara')
  assert.equal(r.estado.gacha.tiradasDesdeRara, 0)
})

test('a las 30 tiradas sale una ultra rara asegurada y el contador vuelve a 0', () => {
  let estado = conPuntos(1000)
  estado = tirar(estado, 10, OCT, laPrimera()).estado
  estado = tirar(estado, 10, OCT, laPrimera()).estado
  assert.equal(faltanParaUltra(estado), 10)
  const r = tirar(estado, 10, OCT, laPrimera())
  assert.equal(r.premios[9].rareza, 'ultra')
  assert.equal(r.estado.gacha.tiradasDesdeUltra, 0)
  assert.equal(faltanParaUltra(r.estado), 30)
})

test('si sale una ultra rara antes, el contador también vuelve a 0', () => {
  const r = tirar(conPuntos(10), 1, OCT, azar(0.999, 0.99, 0))
  assert.equal(r.premios[0].rareza, 'ultra')
  assert.equal(r.estado.gacha.tiradasDesdeUltra, 0)
})

test('una prenda repetida da 1 pieza de su rareza', () => {
  const r = tirar(conPuntos(10), 2, OCT, laPrimera())
  assert.equal(r.premios[0].repetida, undefined)
  assert.equal(r.premios[1].repetida, true)
  assert.equal(r.estado.piezas.comun, 1)
  assert.equal(r.estado.ropa.tiene.length, 1)
})

test('los premios de ⭐ se suman al saldo y a lo ganado', () => {
  const r = tirar(conPuntos(5), 1, OCT, azar(0, 0, 0))
  assert.deepEqual(r.premios[0], { tipo: 'puntos', rareza: 'comun', puntos: 15 })
  assert.equal(r.estado.puntos, 15)
  assert.equal(r.estado.puntosGanadosTotal, 20)
})

test('las tiradas gratis se usan primero y no gastan ⭐', () => {
  const estado = regalarTiradas(conPuntos(0), 10)
  const r = tirar(estado, 10, OCT, laPrimera())
  assert.equal(r.resultado, 'ok')
  assert.equal(r.gratis, true)
  assert.equal(r.estado.puntos, 0)
  assert.equal(r.estado.gacha.tiradasGratis, 0)
})

test('con piezas se canjea una prenda que no tenga de esa rareza', () => {
  const estado = { ...conPuntos(0), piezas: { comun: GACHA.PIEZAS_PARA_CANJE.comun, rara: 0, epica: 0, ultra: 0 } }
  const opciones = prendasCanjeables(estado, 'comun', OCT)
  const r = canjearPiezas(estado, opciones[0].id, OCT)
  assert.equal(r.resultado, 'ok')
  assert.equal(r.estado.piezas.comun, 0)
  assert.ok(r.estado.ropa.tiene.includes(opciones[0].id))
  assert.equal(canjearPiezas(r.estado, opciones[0].id, OCT).resultado, 'ya-la-tiene')
  assert.equal(canjearPiezas(r.estado, opciones[1].id, OCT).resultado, 'faltan-piezas')
})

test('lo de temporada solo se canjea en su época', () => {
  const estado = { ...conPuntos(0), piezas: { comun: 0, rara: GACHA.PIEZAS_PARA_CANJE.rara, epica: 0, ultra: 0 } }
  assert.equal(canjearPiezas(estado, 'capa-vampiro', NOV).resultado, 'no-disponible')
  assert.equal(canjearPiezas(estado, 'capa-vampiro', OCT).resultado, 'ok')
  assert.ok(!prendasCanjeables(estado, 'rara', NOV).some((p) => p.id === 'capa-vampiro'))
})

test('progreso de la colección: cuenta solo las del gacha', () => {
  const estado = { ...conPuntos(0), ropa: { tiene: ['corona', 'gorrito-cumple'], puesta: {} } }
  const { tiene, total } = progresoColeccion(estado)
  assert.equal(tiene, 1)
  assert.equal(total, PRENDAS.filter((p) => !p.exclusiva).length)
})

test('un progreso guardado de antes del gacha se completa sin perder nada', () => {
  const viejo = { ...conPuntos(42) }
  delete viejo.gacha
  delete viejo.piezas
  delete viejo.ropa
  const cargado = importarProgreso(JSON.stringify(viejo))
  assert.equal(cargado.puntos, 42)
  assert.equal(cargado.gacha.tiradasDesdeUltra, 0)
  assert.deepEqual(cargado.ropa, { tiene: [], puesta: {} })
})

test('mejorar piezas: 10 comunes → 1 rara, 10 raras → 1 épica, 5 épicas → 1 ultra (solo para arriba)', async () => {
  const { mejorarPiezas } = await import('../src/logic/gacha.js')
  const conPiezas = (piezas) => ({ ...crearEstadoInicial(), piezas: { comun: 0, rara: 0, epica: 0, ultra: 0, ...piezas } })
  assert.deepEqual(mejorarPiezas(conPiezas({ comun: 12 }), 'comun').estado.piezas, { comun: 2, rara: 1, epica: 0, ultra: 0 })
  assert.deepEqual(mejorarPiezas(conPiezas({ rara: 10 }), 'rara').estado.piezas, { comun: 0, rara: 0, epica: 1, ultra: 0 })
  assert.deepEqual(mejorarPiezas(conPiezas({ epica: 5 }), 'epica').estado.piezas, { comun: 0, rara: 0, epica: 0, ultra: 1 })
  assert.equal(mejorarPiezas(conPiezas({ comun: 9 }), 'comun').resultado, 'faltan-piezas')
  assert.equal(mejorarPiezas(conPiezas({ ultra: 9 }), 'ultra').resultado, 'no-se-puede')
})
