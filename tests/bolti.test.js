import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import {
  avanzarTiempo,
  actualizarBolti,
  humor,
  darMimos,
  extranaElEstudio,
  horasDesdeUltimaVisita,
} from '../src/logic/bolti.js'

const MIN = 60 * 1000
const HORA = 60 * MIN
const ms = (texto) => new Date(texto).getTime()

function perrita(cambios = {}) {
  return {
    saciedad: 80,
    energia: 80,
    carino: 70,
    durmiendo: false,
    actualizadaEn: ms('2026-10-21T15:00:00'),
    ultimaActividad: null,
    ultimaVisita: null,
    ...cambios,
  }
}

function estadoCon(p, cambios = {}) {
  return { ...crearEstadoInicial(), perrita: p, instaladaEn: '2026-10-19', ...cambios }
}

test('las necesidades bajan con el tiempo y nunca quedan negativas', () => {
  const p = avanzarTiempo(perrita(), ms('2026-10-21T20:00:00')) // 5 h despierta
  assert.equal(Math.round(p.saciedad), 60)
  assert.equal(Math.round(p.carino), 50)
  assert.equal(Math.round(p.energia), 60)
  const muchoDespues = avanzarTiempo(perrita(), ms('2026-11-30T15:00:00'))
  for (const k of ['saciedad', 'energia', 'carino']) assert.ok(muchoDespues[k] >= 0)
})

test('sin tiempo transcurrido devuelve el mismo objeto', () => {
  const p = perrita()
  assert.equal(avanzarTiempo(p, p.actualizadaEn), p)
  const e = estadoCon(p)
  assert.equal(actualizarBolti(e, p.actualizadaEn), e)
})

test('con la app cerrada a la noche: se duerme sola a las 00 y recarga energía', () => {
  const p0 = perrita({ energia: 20, actualizadaEn: ms('2026-10-21T22:00:00') })
  const a_las_9 = avanzarTiempo(p0, ms('2026-10-22T09:00:00'))
  assert.equal(a_las_9.durmiendo, true)
  // 2 h despierta (−8) y 9 h durmiendo (+112,5) → llena
  assert.equal(Math.round(a_las_9.energia), 100)
  const a_las_11 = avanzarTiempo(p0, ms('2026-10-22T11:00:00'))
  assert.equal(a_las_11.durmiendo, false, 'a las 10 se despierta sola')
})

test('a las 23:59 sigue despierta; a las 00:15 ya duerme', () => {
  const p0 = perrita({ actualizadaEn: ms('2026-10-21T23:00:00') })
  assert.equal(avanzarTiempo(p0, ms('2026-10-21T23:59:00')).durmiendo, false)
  assert.equal(avanzarTiempo(p0, ms('2026-10-22T00:15:01')).durmiendo, true)
})

test('durmiendo no extraña: el cariño no baja', () => {
  const p0 = perrita({ durmiendo: true, actualizadaEn: ms('2026-10-22T01:00:00') })
  const p = avanzarTiempo(p0, ms('2026-10-22T05:00:00'))
  assert.equal(p.carino, 70)
})

test('si la despiertan de madrugada, vuelve a dormirse sin mimos', () => {
  const t = ms('2026-10-22T03:00:00')
  const p0 = perrita({ durmiendo: false, ultimaActividad: t, actualizadaEn: t })
  assert.equal(avanzarTiempo(p0, t + 30 * 1000).durmiendo, false)
  assert.equal(avanzarTiempo(p0, t + 16 * MIN).durmiendo, true)
})

test('humor: dormida > hambre > triste > contenta', () => {
  const ahora = new Date('2026-10-21T15:00:00')
  const e = (c) => estadoCon(perrita(c), { historialEstudio: { '2026-10-20': 60 } })
  assert.equal(humor(e({ durmiendo: true, saciedad: 0 }), ahora), 'dormida')
  assert.equal(humor(e({ saciedad: 10, carino: 10 }), ahora), 'hambre')
  assert.equal(humor(e({ carino: 10 }), ahora), 'triste')
  assert.equal(humor(e({ energia: 10 }), ahora), 'triste')
  assert.equal(humor(e({}), ahora), 'contenta')
})

test('extraña el estudio si no estudió el último día obligatorio; se le pasa estudiando hoy', () => {
  const miercoles = new Date('2026-10-21T15:00:00')
  const e = estadoCon(perrita())
  assert.equal(extranaElEstudio(e, miercoles), true, 'el martes no estudió')
  assert.equal(humor(e, miercoles), 'estudio', 'distinto de la tristeza por cariño')
  const estudioHoy = { ...e, historialEstudio: { '2026-10-21': 30 } }
  assert.equal(humor(estudioHoy, miercoles), 'contenta')
})

test('el lunes mira al viernes anterior; no cuenta días antes de instalar la app', () => {
  const lunes = new Date('2026-10-26T12:00:00')
  const e = estadoCon(perrita(), { historialEstudio: { '2026-10-23': 45 } })
  assert.equal(extranaElEstudio(e, lunes), false)
  const recienInstalada = estadoCon(perrita(), { instaladaEn: '2026-10-21' })
  assert.equal(extranaElEstudio(recienInstalada, new Date('2026-10-21T12:00:00')), false)
})

test('mimos suben el cariño hasta 100', () => {
  const t = ms('2026-10-21T15:00:00')
  const e = estadoCon(perrita({ carino: 98 }))
  assert.equal(darMimos(e, 5, t).perrita.carino, 100)
})

test('dormida siente los mimos pero no se despierta', () => {
  const t = ms('2026-10-22T02:00:00')
  let e = estadoCon(perrita({ durmiendo: true, actualizadaEn: t }))
  for (let i = 0; i < 10; i++) e = darMimos(e, 3, t + i * 60 * 1000) // 10 min de mimos
  assert.equal(e.perrita.carino, 100)
  assert.equal(e.perrita.durmiendo, true)
  assert.equal(e.perrita.ultimaActividad, null, 'no cuenta como actividad que la despierte')
})

test('horas desde la última visita', () => {
  const p = perrita({ ultimaVisita: '2026-10-21T03:00:00.000Z' })
  assert.equal(horasDesdeUltimaVisita(p, ms('2026-10-21T03:00:00.000Z') + 13 * HORA), 13)
})

test('luz: desde las 22 se puede apagar; a la tarde no tiene sueño', async () => {
  const { apagarLuz } = await import('../src/logic/bolti.js')
  const noche = ms('2026-10-22T22:30:00')
  const r = apagarLuz(estadoCon(perrita({ actualizadaEn: noche })), noche)
  assert.equal(r.resultado, 'noche')
  assert.equal(r.estado.perrita.durmiendo, true)
  // a las 23:30 sigue dormida (no la despierta ninguna regla)
  assert.equal(avanzarTiempo(r.estado.perrita, ms('2026-10-22T23:30:00')).durmiendo, true)
  const tarde = ms('2026-10-22T16:00:00')
  assert.equal(apagarLuz(estadoCon(perrita({ actualizadaEn: tarde })), tarde).resultado, 'sin-sueno')
})

test('siesta: con poca energía duerme de día hasta recuperar 80', async () => {
  const { apagarLuz } = await import('../src/logic/bolti.js')
  const tarde = ms('2026-10-22T14:00:00')
  const r = apagarLuz(estadoCon(perrita({ energia: 10, actualizadaEn: tarde })), tarde)
  assert.equal(r.resultado, 'siesta')
  const p1 = avanzarTiempo(r.estado.perrita, tarde + 2 * HORA) // +25 → 35
  assert.equal(p1.durmiendo, true, 'a las 2 h sigue en la siesta')
  const p2 = avanzarTiempo(r.estado.perrita, tarde + 6 * HORA) // llega a 80 a las ~5,6 h
  assert.equal(p2.durmiendo, false, 'se despierta sola al recuperar energía')
  assert.ok(p2.energia >= 75)
})

test('prender la luz la despierta; de madrugada se vuelve a dormir sola', async () => {
  const { prenderLuz } = await import('../src/logic/bolti.js')
  const t = ms('2026-10-23T02:00:00')
  const e = prenderLuz(estadoCon(perrita({ durmiendo: true, actualizadaEn: t })), t)
  assert.equal(e.perrita.durmiendo, false)
  assert.equal(avanzarTiempo(e.perrita, t + 20 * MIN).durmiendo, true)
})
