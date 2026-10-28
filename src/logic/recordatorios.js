// Recordatorios de estudio: Bolti lo menciona en una burbujita que se va sola, como mucho
// unas pocas veces por día y solo si la tarea "Estudiar" de hoy está pendiente. No estudiar
// no la pone triste. "Ayer te extrañé estudiando" aparece como mucho una vez por semana.

import { RECORDATORIOS_ESTUDIO as R } from '../config.js'
import { extranaElEstudio } from './bolti.js'
import { fechaLocal } from './fechas.js'

const HORA = 60 * 60 * 1000
const DIA = 24 * HORA

const FRASES = [
  '¿Estudiamos un ratito? 📚',
  'Te espero para estudiar juntas 🐶📚',
  'Con un pomodorito de 25 minutos me pongo contenta 💕',
  '¿Hoy toca estudiar? Yo te acompaño 📚',
]
const FRASE_EXTRANO = 'Ayer te extrañé estudiando 🥺 ¿Hoy estudiamos un ratito? 📚'

function estudioPendienteHoy(estado, ahora) {
  const hoy = fechaLocal(ahora)
  return estado.tareas.some((t) => t.obligatoria && !t.hecha && t.fecha === hoy)
}

function diasDesde(fechaTexto, ahora) {
  return Math.floor((new Date(`${fechaLocal(ahora)}T12:00:00`) - new Date(`${fechaTexto}T12:00:00`)) / DIA)
}

// La frase que diría Bolti ahora, o null si no toca recordar
export function fraseDeEstudio(estado, ahora = new Date(), rng = Math.random) {
  if (!estudioPendienteHoy(estado, ahora)) return null
  const r = estado.recordatoriosEstudio
  const hoy = fechaLocal(ahora)
  const cantidadHoy = r.fecha === hoy ? r.cantidad : 0
  if (cantidadHoy >= R.MAXIMO_POR_DIA) return null
  if (r.ultimo && ahora.getTime() - r.ultimo < R.HORAS_ENTRE * HORA) return null
  const puedeExtranar = !r.ultimoExtrano || diasDesde(r.ultimoExtrano, ahora) >= R.EXTRANO_CADA_DIAS
  if (puedeExtranar && extranaElEstudio(estado, ahora)) return FRASE_EXTRANO
  return FRASES[Math.floor(rng() * FRASES.length)]
}

// Anota que ya se lo recordó (para el tope del día y la espera entre recordatorios)
export function registrarRecordatorio(estado, frase, ahora = new Date()) {
  const r = estado.recordatoriosEstudio
  const hoy = fechaLocal(ahora)
  return {
    ...estado,
    recordatoriosEstudio: {
      fecha: hoy,
      cantidad: (r.fecha === hoy ? r.cantidad : 0) + 1,
      ultimo: ahora.getTime(),
      ultimoExtrano: frase === FRASE_EXTRANO ? hoy : r.ultimoExtrano,
    },
  }
}
