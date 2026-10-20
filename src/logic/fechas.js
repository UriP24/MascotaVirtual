import { ESTUDIO } from '../config.js'

// Fecha local como texto 'AAAA-MM-DD' (no usamos toISOString porque está en UTC
// y a la noche en Argentina ya daría el día siguiente).
export function fechaLocal(fecha = new Date()) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

export function esDiaDeEstudioObligatorio(fecha = new Date()) {
  return ESTUDIO.DIAS_OBLIGATORIOS.includes(fecha.getDay())
}
