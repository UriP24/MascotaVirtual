// Único módulo que toca localStorage. Todo acceso pasa por acá, envuelto en try/catch,
// porque localStorage puede fallar (modo incógnito, almacenamiento lleno, datos corruptos).

import { PERRITA } from './config.js'

const CLAVE = 'patitas:estado'
const VERSION_ACTUAL = 1

export function crearEstadoInicial() {
  const ahora = new Date().toISOString()
  return {
    version: VERSION_ACTUAL,
    monedas: 0,
    puntos: 0,
    // Historial de todo lo ganado. Nunca baja: los puntos ganados no se restan ni vencen.
    puntosGanadosTotal: 0,
    // { id, texto, tipo: 'simple' | 'grande', hecha, creadaEn }
    tareas: [],
    // { id, planId, costo, fecha (ISO), cumplido }. La fecha sirve para el límite mensual.
    cupones: [],
    // Sin salud ni vida: la perrita nunca se enferma ni muere, como mucho se pone triste.
    perrita: {
      saciedad: PERRITA.SACIEDAD_INICIAL,
      ultimaComida: ahora,
      ultimaVisita: ahora,
    },
  }
}

// Completa con valores por defecto lo que falte (por ejemplo, campos nuevos de una versión futura).
function completarEstado(datos) {
  const inicial = crearEstadoInicial()
  return {
    ...inicial,
    ...datos,
    perrita: { ...inicial.perrita, ...datos.perrita },
    version: VERSION_ACTUAL,
  }
}

function esEstadoValido(datos) {
  return (
    datos !== null &&
    typeof datos === 'object' &&
    typeof datos.monedas === 'number' &&
    typeof datos.puntos === 'number' &&
    Array.isArray(datos.tareas) &&
    Array.isArray(datos.cupones)
  )
}

export function cargarEstado() {
  try {
    const texto = localStorage.getItem(CLAVE)
    if (texto === null) return crearEstadoInicial()
    const datos = JSON.parse(texto)
    if (!esEstadoValido(datos)) return crearEstadoInicial()
    return completarEstado(datos)
  } catch (error) {
    console.error('No se pudo leer el progreso guardado', error)
    return crearEstadoInicial()
  }
}

export function guardarEstado(estado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
    return true
  } catch (error) {
    console.error('No se pudo guardar el progreso', error)
    return false
  }
}

// Devuelve el progreso como texto JSON, para guardarlo como respaldo.
export function exportarProgreso(estado) {
  return JSON.stringify(estado, null, 2)
}

// Recibe un texto JSON exportado antes. Devuelve el estado listo para usar,
// o null si el texto no es un progreso válido.
export function importarProgreso(texto) {
  try {
    const datos = JSON.parse(texto)
    if (!esEstadoValido(datos)) return null
    return completarEstado(datos)
  } catch {
    return null
  }
}
