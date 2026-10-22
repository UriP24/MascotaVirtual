// Racha y estadísticas de estudio, calculadas a partir de historialEstudio ({ 'AAAA-MM-DD': minutos }).
// Un día cuenta como "estudiado" si llegó a un pomodoro (ESTUDIO.MINUTOS_MINIMOS).
// La racha no se corta por un fin de semana (o día no obligatorio) sin estudio: ese día se saltea.

import { ECONOMIA, ESTUDIO } from '../config.js'
import { esDiaDeEstudioObligatorio, fechaLocal } from './fechas.js'

const LETRAS_DIA = ['D', 'L', 'M', 'M', 'J', 'V', 'S']

function minutosDel(estado, fecha) {
  return estado.historialEstudio[fecha] ?? 0
}

function estudio(estado, fecha) {
  return minutosDel(estado, fecha) >= ESTUDIO.MINUTOS_MINIMOS
}

function diaAnterior(fecha) {
  const d = new Date(fecha)
  d.setDate(d.getDate() - 1)
  return d
}

function primerDia(estado) {
  const fechas = Object.keys(estado.historialEstudio).sort()
  const candidatos = [estado.instaladaEn, fechas[0]].filter(Boolean).sort()
  return candidatos[0] ?? null
}

// Días seguidos estudiando hasta hoy. Si hoy todavía no estudió, no la corta: cuenta hasta ayer.
export function rachaActual(estado, ahora = new Date()) {
  const desde = primerDia(estado)
  if (!desde) return 0
  let racha = 0
  let dia = new Date(ahora)
  if (!estudio(estado, fechaLocal(dia))) dia = diaAnterior(dia)
  while (fechaLocal(dia) >= desde) {
    const fecha = fechaLocal(dia)
    if (estudio(estado, fecha)) racha++
    else if (esDiaDeEstudioObligatorio(dia)) break
    dia = diaAnterior(dia)
  }
  return racha
}

export function mejorRacha(estado, ahora = new Date()) {
  const desde = primerDia(estado)
  if (!desde) return 0
  let mejor = 0
  let actual = 0
  const dia = new Date(`${desde}T12:00:00`)
  const hoy = fechaLocal(ahora)
  while (fechaLocal(dia) <= hoy) {
    const fecha = fechaLocal(dia)
    if (estudio(estado, fecha)) {
      actual++
      mejor = Math.max(mejor, actual)
    } else if (esDiaDeEstudioObligatorio(dia) && fecha !== hoy) {
      actual = 0
    }
    dia.setDate(dia.getDate() + 1)
  }
  return mejor
}

export function resumen(estado) {
  const minutos = Object.values(estado.historialEstudio)
  const total = minutos.reduce((a, b) => a + b, 0)
  const diasConEstudio = minutos.filter((m) => m >= ESTUDIO.MINUTOS_MINIMOS).length
  const pomodoros = minutos.reduce((a, m) => a + Math.floor(m / ECONOMIA.MINUTOS_POR_BLOQUE_ESTUDIO), 0)
  return {
    minutosTotales: total,
    pomodoros,
    diasConEstudio,
    promedioPorDia: diasConEstudio > 0 ? Math.round(total / diasConEstudio) : 0,
  }
}

// Los últimos 7 días (del más viejo a hoy), para el gráfico
export function ultimos7Dias(estado, ahora = new Date()) {
  const dias = []
  const dia = new Date(ahora)
  for (let i = 0; i < 7; i++) {
    dias.unshift({ fecha: fechaLocal(dia), letra: LETRAS_DIA[dia.getDay()], minutos: minutosDel(estado, fechaLocal(dia)) })
    dia.setDate(dia.getDate() - 1)
  }
  return dias
}

export function formatearMinutos(minutos) {
  const h = Math.floor(minutos / 60)
  const m = minutos % 60
  if (h === 0) return `${m} min`
  return m === 0 ? `${h} h` : `${h} h ${m} min`
}
