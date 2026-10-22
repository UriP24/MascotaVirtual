import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { actualizarDia, completarTarea } from '../src/logic/tareas.js'
import { humor } from '../src/logic/bolti.js'
import { adelantarBolti, simularQueNoEstudio, sumarEstudio, sumarPuntos } from '../src/logic/prueba.js'

const MARTES = new Date('2026-10-20T15:00:00')

test('sumar 30 min de estudio permite completar la tarea obligatoria', () => {
  let e = actualizarDia(crearEstadoInicial(), MARTES)
  e = sumarEstudio(e, 30)
  const r = completarTarea(e, e.tareas[0].id, MARTES)
  assert.equal(r.puntos, 1)
})

test('adelantar a Bolti baja sus necesidades', () => {
  const ahora = new Date('2026-10-20T15:00:00').getTime()
  const e = { ...crearEstadoInicial(), perrita: { ...crearEstadoInicial().perrita, actualizadaEn: ahora } }
  const despues = adelantarBolti(e, 6, ahora)
  assert.ok(despues.perrita.saciedad < e.perrita.saciedad)
})

test('"ayer no estudió" hace que extrañe el estudio', () => {
  const inicial = crearEstadoInicial()
  // despierta, para no depender de la hora real en que se corren las pruebas
  const e = simularQueNoEstudio({ ...inicial, perrita: { ...inicial.perrita, durmiendo: false } }, MARTES)
  assert.equal(humor(e, MARTES), 'estudio')
})

test('sumar puntos también suma al total ganado', () => {
  const e = sumarPuntos(crearEstadoInicial(), 10)
  assert.equal(e.puntosGanadosTotal, 10)
})

test('"Todo lleno" de noche la deja despierta 1 h aunque la toquen', async () => {
  const { cambiarBolti, volverAlHorarioNormal } = await import('../src/logic/prueba.js')
  const { darMimos } = await import('../src/logic/bolti.js')
  const noche = new Date('2026-10-23T01:30:00').getTime()
  let e = { ...crearEstadoInicial(), perrita: { ...crearEstadoInicial().perrita, durmiendo: true, actualizadaEn: noche } }
  e = cambiarBolti(e, { saciedad: 100, energia: 100, carino: 100 }, noche)
  e = darMimos(e, 3, noche + 5 * 60 * 1000)
  assert.equal(e.perrita.durmiendo, false, 'sigue despierta después de 5 min')
  e = darMimos(e, 3, noche + 50 * 60 * 1000)
  assert.equal(e.perrita.durmiendo, false, 'sigue despierta a los 50 min')
  const vencido = adelantarBolti(e, 0, noche + 80 * 60 * 1000)
  assert.equal(vencido.perrita.forzado, null, 'el forzado vence a la hora')
  assert.equal(vencido.perrita.durmiendo, true, 'y vuelve a su horario')
  const normal = volverAlHorarioNormal(cambiarBolti(e, {}, noche), noche)
  assert.equal(normal.perrita.durmiendo, true)
})

test('"Dormida" de día dura 1 h', async () => {
  const { cambiarBolti } = await import('../src/logic/prueba.js')
  const tarde = new Date('2026-10-22T15:00:00').getTime()
  let e = { ...crearEstadoInicial(), perrita: { ...crearEstadoInicial().perrita, actualizadaEn: tarde } }
  e = cambiarBolti(e, { durmiendo: true }, tarde)
  assert.equal(adelantarBolti(e, 0, tarde + 30 * 60 * 1000).perrita.durmiendo, true)
})

test('llenar bandeja suma 2 de cada comida', async () => {
  const { llenarBandeja } = await import('../src/logic/prueba.js')
  const e = llenarBandeja(crearEstadoInicial())
  assert.equal(e.inventario.croquetas, 2)
  assert.equal(e.inventario.torta, 2)
})

test('liberar canjes permite volver a canjear un plan grande', async () => {
  const { liberarCanjes } = await import('../src/logic/prueba.js')
  const { canjear } = await import('../src/logic/canjes.js')
  const oct = new Date('2026-10-24T18:00:00')
  let e = canjear({ ...crearEstadoInicial(), puntos: 300 }, 'comer-afuera', oct).estado
  assert.equal(canjear(e, 'comer-afuera', oct).resultado, 'en-rotacion')
  e = liberarCanjes(e)
  assert.equal(canjear(e, 'comer-afuera', oct).resultado, 'ok')
})
