// Único módulo que toca localStorage. Todo acceso pasa por acá, envuelto en try/catch,
// porque localStorage puede fallar (modo incógnito, almacenamiento lleno, datos corruptos).

import { COMIDAS, ECONOMIA, PERRITA } from './config.js'
import { fechaLocal } from './logic/fechas.js'
import { esHorarioDeDormir } from './logic/bolti.js'

const CLAVE = 'patitas:estado'
const VERSION_ACTUAL = 4

export function crearEstadoInicial() {
  const ahora = new Date().toISOString()
  return {
    version: VERSION_ACTUAL,
    monedas: ECONOMIA.MONEDAS_DE_BIENVENIDA,
    puntos: 0,
    // Historial de todo lo ganado. Nunca baja: los puntos ganados no se restan ni vencen.
    puntosGanadosTotal: 0,
    // { id, texto, tipo: 'simple' | 'grande' | 'estudio', fecha, hecha, obligatoria, estudio? }
    tareas: [],
    // Minutos de estudio acreditados por día: { 'AAAA-MM-DD': minutos }.
    // Sirve para el tope diario y para que Bolti se ponga triste si un día de semana no estudió.
    historialEstudio: {},
    // Último día en que se creó la tarea de estudio obligatoria (para no crearla dos veces)
    ultimoDiaObligatorio: null,
    // { id, planId, costo, fecha (ISO), cumplido }. La fecha sirve para el límite mensual.
    cupones: [],
    // Cuántas unidades tiene de cada comida: { croquetas: 0, galletita: 0, … }
    inventario: Object.fromEntries(COMIDAS.map((c) => [c.id, 0])),
    // Día en que se empezó a usar la app (para no ponerla triste por días anteriores)
    instaladaEn: fechaLocal(),
    // Sin salud ni vida: Bolti nunca se enferma ni muere, como mucho se pone triste.
    perrita: {
      saciedad: PERRITA.SACIEDAD_INICIAL,
      energia: PERRITA.ENERGIA_INICIAL,
      carino: PERRITA.CARINO_INICIAL,
      durmiendo: esHorarioDeDormir(new Date()), // si la abre por primera vez de noche, ya duerme
      actualizadaEn: Date.now(), // última vez que se calcularon las necesidades (ms)
      ultimaActividad: null, // último mimo (ms), para volver a dormirse de madrugada
      ultimaVisita: ahora, // para saludarla si hace mucho que no entra
      siesta: false, // durmiendo una siesta de día (termina sola al recuperar energía)
      forzado: null, // solo modo prueba: { durmiendo, hasta (ms) } ignora el horario de sueño
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
    inventario: { ...inicial.inventario, ...datos.inventario },
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
