// Pruebas de la lógica. Se corren con: npm test
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import {
  agregarTarea,
  completarTarea,
  borrarTarea,
  actualizarDia,
  actualizarCronometro,
  retomarCronometros,
  estudioElDia,
  tareasConRecompensaRestantes,
} from '../src/logic/tareas.js'
import { convertirMonedas } from '../src/logic/economia.js'
import * as crono from '../src/logic/estudio.js'

const MIN = 60 * 1000
// Estado inicial sin los puntos de bienvenida, para contar solo lo que se gana en cada test
const sinPuntos = () => ({ ...crearEstadoInicial(), puntos: 0, puntosGanadosTotal: 0 })
const MARTES = new Date('2026-10-20T10:00:00')
const SABADO = new Date('2026-10-24T10:00:00')

test('agregar ignora texto vacío y corta textos largos', () => {
  const e = sinPuntos()
  assert.equal(agregarTarea(e, '   ', 'simple'), e)
  const e2 = agregarTarea(e, 'x'.repeat(200), 'simple')
  assert.equal(e2.tareas[0].texto.length, 80)
})

test('cada tarea da 10 monedas (no puntos) y no se puede repetir', () => {
  let e = agregarTarea({ ...sinPuntos(), monedas: 0 }, 'Barrer', 'tarea')
  e = agregarTarea(e, 'Tarea vieja', 'grande') // las viejas "grande" valen lo mismo
  const [barrer, vieja] = e.tareas
  let r = completarTarea(e, barrer.id, MARTES)
  assert.equal(r.monedas, 10)
  assert.equal(r.estado.puntos, 0, 'las tareas no dan puntos')
  r = completarTarea(r.estado, vieja.id, MARTES)
  assert.equal(r.estado.monedas, 20)
  const otra = completarTarea(r.estado, vieja.id, MARTES)
  assert.equal(otra.completada, false)
  assert.equal(otra.estado.monedas, 20)
})

test('solo las primeras 5 tareas del día dan monedas, aunque se borren', () => {
  let e = { ...sinPuntos(), monedas: 0 }
  for (let i = 0; i < 7; i++) {
    e = agregarTarea(e, `Tarea ${i}`, 'tarea', MARTES)
    const id = e.tareas.at(-1).id
    e = completarTarea(e, id, MARTES).estado
    e = borrarTarea(e, id) // borrar no reinicia el tope
  }
  assert.equal(e.monedas, 50, '5 tareas × 10')
  assert.equal(tareasConRecompensaRestantes(e, MARTES), 0)
  const conUnaMas = agregarTarea(e, 'Una más', 'tarea', MARTES)
  const r = completarTarea(conUnaMas, conUnaMas.tareas.at(-1).id, MARTES)
  assert.equal(r.completada, true, 'se puede completar igual')
  assert.equal(r.monedas, 0, 'pero ya no da monedas')
  const miercoles = new Date('2026-10-21T10:00:00')
  assert.equal(tareasConRecompensaRestantes(e, miercoles), 5, 'al otro día se renueva')
})

test('borrar nunca resta monedas ni puntos', () => {
  let e = agregarTarea({ ...sinPuntos(), monedas: 0 }, 'Barrer', 'tarea')
  e = completarTarea(e, e.tareas[0].id).estado
  e = borrarTarea(e, e.tareas[0].id)
  assert.equal(e.tareas.length, 0)
  assert.equal(e.monedas, 10)
})

test('cambio: 100 monedas por 1 punto, máximo 1 por día', () => {
  let e = { ...sinPuntos(), monedas: 250 }
  let r = convertirMonedas(e, MARTES)
  assert.equal(r.resultado, 'ok')
  assert.equal(r.estado.monedas, 150)
  assert.equal(r.estado.puntos, 1)
  assert.equal(r.estado.puntosGanadosTotal, 1)
  assert.equal(convertirMonedas(r.estado, MARTES).resultado, 'tope-diario')
  const miercoles = new Date('2026-10-21T10:00:00')
  assert.equal(convertirMonedas(r.estado, miercoles).resultado, 'ok')
  assert.equal(convertirMonedas({ ...sinPuntos(), monedas: 99 }, MARTES).resultado, 'sin-monedas')
})

test('de lunes a viernes aparece una sola tarea obligatoria, que no se puede borrar', () => {
  let e = actualizarDia(sinPuntos(), MARTES)
  assert.equal(e.tareas.length, 1)
  assert.ok(e.tareas[0].obligatoria)
  assert.equal(actualizarDia(e, MARTES), e, 'sin cambios devuelve el mismo objeto')
  assert.equal(borrarTarea(e, e.tareas[0].id), e)
  assert.equal(actualizarDia(sinPuntos(), SABADO).tareas.length, 0)
})

test('estudio: no se completa antes de 25 min y da 1 punto cada 25 (pomodoro)', () => {
  let e = actualizarDia(sinPuntos(), MARTES)
  const id = e.tareas[0].id
  const t0 = MARTES.getTime()
  e = actualizarCronometro(e, id, (c) => ({ ...crono.iniciar(c, t0), proximoChequeo: null }))
  assert.equal(completarTarea(e, id, new Date(t0 + 24 * MIN)).puntos, 0)
  const r = completarTarea(e, id, new Date(t0 + 75 * MIN))
  assert.equal(r.puntos, 3)
  assert.equal(r.estado.historialEstudio['2026-10-20'], 75)
  assert.ok(estudioElDia(r.estado, '2026-10-20'))
})

test('estudio: el tiempo en segundo plano no cuenta y al volver sigue', () => {
  let c = crono.crearCronometro()
  const t0 = 0
  c = crono.iniciar(c, t0, 0)
  c = crono.pausar(c, 10 * MIN, 'segundo-plano') // se fue a otra app
  assert.equal(crono.msContados(c, 60 * MIN), 10 * MIN)
  c = crono.iniciar(c, 60 * MIN, 0) // volvió 50 min después
  assert.equal(crono.msContados(c, 65 * MIN), 15 * MIN)
})

test('estudio: si no responde a Bolti, no cuenta desde que preguntó', () => {
  let c = crono.iniciar(crono.crearCronometro(), 0, 0) // azar 0 → pregunta a los 20 min
  const tope = 240 * MIN
  c = crono.revisar(c, 20 * MIN, tope)
  assert.equal(c.chequeoDesde, 20 * MIN)
  assert.equal(crono.msContados(c, 22 * MIN), 20 * MIN, 'congelado mientras espera')
  c = crono.revisar(c, 23 * MIN, tope)
  assert.equal(c.pausa, 'inactividad')
  assert.equal(c.acumuladoMs, 20 * MIN)
})

test('estudio: si responde a tiempo, cuenta todo', () => {
  let c = crono.iniciar(crono.crearCronometro(), 0, 0)
  c = crono.revisar(c, 20 * MIN, 240 * MIN)
  c = crono.confirmarPresencia(c, 21 * MIN, 0)
  assert.equal(crono.msContados(c, 25 * MIN), 25 * MIN)
  assert.equal(c.proximoChequeo, 41 * MIN)
})

test('estudio: se frena solo al llegar al tope de 8 pomodoros por día', () => {
  let c = crono.iniciar(crono.crearCronometro(), 0, 0)
  c = { ...c, proximoChequeo: null, bloquesAvisados: 7 }
  c = crono.revisar(c, 250 * MIN, 200 * MIN)
  assert.equal(c.pausa, 'maximo')
  assert.equal(c.acumuladoMs, 200 * MIN)
  assert.equal(crono.puntosPorTiempo(c.acumuladoMs), 8)
})

test('pomodoro: a los 25 min se pausa y espera que diga si sigue', () => {
  let c = { ...crono.iniciar(crono.crearCronometro(), 0, 0), proximoChequeo: null }
  c = crono.revisar(c, 24 * MIN, 200 * MIN)
  assert.equal(crono.estaCorriendo(c), true)
  c = crono.revisar(c, 25 * MIN + 500, 200 * MIN)
  assert.equal(c.pausa, 'bloque')
  assert.equal(c.acumuladoMs, 25 * MIN, 'queda justo en 25 min')
  c = { ...crono.iniciar(c, 30 * MIN, 0), proximoChequeo: null } // eligió seguir
  c = crono.revisar(c, 40 * MIN, 200 * MIN)
  assert.equal(crono.estaCorriendo(c), true, 'no vuelve a preguntar por el mismo bloque')
  c = crono.revisar(c, 55 * MIN, 200 * MIN)
  assert.equal(c.pausa, 'bloque')
  assert.equal(crono.bloquesCompletos(c.acumuladoMs), 2)
})

test('el tope de 4 h se reparte entre todas las tareas de estudio del día', () => {
  let e = actualizarDia(sinPuntos(), MARTES)
  e = { ...e, historialEstudio: { '2026-10-20': 220 } }
  const id = e.tareas[0].id
  const t0 = MARTES.getTime()
  e = actualizarCronometro(e, id, (c) => ({ ...crono.iniciar(c, t0), proximoChequeo: null }))
  // estudió 60 min más pero solo quedaban 20 → no llega al mínimo de esta tarea
  assert.equal(completarTarea(e, id, new Date(t0 + 60 * MIN)).puntos, 0)
})

test('solo un cronómetro corre a la vez', () => {
  let e = actualizarDia(sinPuntos(), MARTES)
  e = agregarTarea(e, 'Repasar', 'estudio', MARTES)
  const [a, b] = e.tareas
  e = actualizarCronometro(e, a.id, (c) => crono.iniciar(c, 0))
  e = actualizarCronometro(e, b.id, (c) => crono.iniciar(c, 0))
  assert.equal(crono.estaCorriendo(e.tareas[0].estudio), false)
  assert.equal(crono.estaCorriendo(e.tareas[1].estudio), true)
})

test('día vencido: sin estudiar desaparece sin castigo; con 30+ min se completa sola', () => {
  let e = actualizarDia(sinPuntos(), MARTES)
  const miercoles = new Date('2026-10-21T09:00:00')
  let sinEstudiar = actualizarDia(e, miercoles)
  assert.equal(sinEstudiar.tareas.length, 1, 'solo queda la del miércoles')
  assert.equal(sinEstudiar.puntos, 0)
  assert.equal(estudioElDia(sinEstudiar, '2026-10-20'), false)

  const id = e.tareas[0].id
  e = actualizarCronometro(e, id, (c) => ({ ...c, acumuladoMs: 45 * MIN }))
  const conEstudio = actualizarDia(e, miercoles)
  assert.equal(conEstudio.puntos, 1)
  assert.ok(conEstudio.tareas.find((t) => t.id === id).hecha)
})

test('si la app se cerró con el cronómetro andando, solo cuenta hasta el último latido', () => {
  let e = actualizarDia(sinPuntos(), MARTES)
  const id = e.tareas[0].id
  e = actualizarCronometro(e, id, (c) => crono.registrarLatido(crono.iniciar(c, 0), 10 * MIN))
  e = retomarCronometros(e, 100 * MIN)
  const c = e.tareas[0].estudio
  assert.equal(crono.msContados(c, 100 * MIN), 10 * MIN)
  assert.ok(crono.estaCorriendo(c))
})
