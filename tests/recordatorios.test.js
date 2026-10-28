import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { actualizarDia } from '../src/logic/tareas.js'
import { fraseDeEstudio, registrarRecordatorio } from '../src/logic/recordatorios.js'

const MIERCOLES = new Date('2026-11-04T11:00:00')
const HORA = 60 * 60 * 1000

// Instalada hace días, con la tarea "Estudiar" de hoy pendiente y el martes estudiado
function conEstudioPendiente(extra = {}) {
  const e = { ...crearEstadoInicial(), instaladaEn: '2026-10-28', historialEstudio: { '2026-11-03': 30 }, ...extra }
  return actualizarDia(e, MIERCOLES)
}

const en = (horas) => new Date(MIERCOLES.getTime() + horas * HORA)

test('recuerda estudiar solo si la tarea de hoy está pendiente', () => {
  assert.equal(typeof fraseDeEstudio(conEstudioPendiente(), MIERCOLES), 'string')
  const sinTarea = { ...crearEstadoInicial(), instaladaEn: '2026-10-28' }
  assert.equal(fraseDeEstudio(sinTarea, MIERCOLES), null)
  const sabado = actualizarDia({ ...crearEstadoInicial() }, new Date('2026-11-07T11:00:00'))
  assert.equal(fraseDeEstudio(sabado, new Date('2026-11-07T11:00:00')), null)
})

test('como mucho 3 veces por día y con 2 horas entre una y otra', () => {
  let e = conEstudioPendiente()
  e = registrarRecordatorio(e, fraseDeEstudio(e, en(0)), en(0))
  assert.equal(fraseDeEstudio(e, en(1)), null, 'muy pronto')
  e = registrarRecordatorio(e, fraseDeEstudio(e, en(2)), en(2))
  e = registrarRecordatorio(e, fraseDeEstudio(e, en(4)), en(4))
  assert.equal(fraseDeEstudio(e, en(7)), null, 'ya van 3 hoy')
  const jueves = new Date('2026-11-05T11:00:00')
  assert.equal(typeof fraseDeEstudio(actualizarDia(e, jueves), jueves), 'string', 'al otro día vuelve')
})

test('"ayer te extrañé" como mucho una vez por semana', () => {
  let e = conEstudioPendiente({ historialEstudio: {} })
  const primera = fraseDeEstudio(e, MIERCOLES)
  assert.match(primera, /extrañé/)
  e = registrarRecordatorio(e, primera, MIERCOLES)
  const jueves = new Date('2026-11-05T11:00:00')
  e = actualizarDia(e, jueves)
  assert.doesNotMatch(fraseDeEstudio(e, jueves), /extrañé/, 'esta semana ya lo dijo')
})
