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

test('"ayer no estudió" la pone triste', () => {
  const e = simularQueNoEstudio(crearEstadoInicial(), MARTES)
  assert.equal(humor(e, MARTES), 'triste')
})

test('sumar puntos también suma al total ganado', () => {
  const e = sumarPuntos(crearEstadoInicial(), 10)
  assert.equal(e.puntosGanadosTotal, 10)
})
