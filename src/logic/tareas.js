// Lógica pura de las tareas. Cada función recibe el estado completo y devuelve uno nuevo
// (o el mismo, si no hubo cambios). Nunca resta puntos.

import { ECONOMIA, ESTUDIO } from '../config.js'
import { fechaLocal, esDiaDeEstudioObligatorio } from './fechas.js'
import * as crono from './estudio.js'

export const LARGO_MAXIMO_TEXTO = 80
const MINUTO = 60 * 1000

// crypto.randomUUID no existe si la app se abre por http en la red local, así que armamos uno.
function crearId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function crearTarea(texto, tipo, ahora, obligatoria = false) {
  return {
    id: crearId(),
    texto,
    tipo,
    fecha: fechaLocal(ahora),
    hecha: false,
    hechaEn: null,
    puntosGanados: 0,
    obligatoria,
    estudio: tipo === 'estudio' ? crono.crearCronometro() : null,
  }
}

function reemplazarTarea(estado, id, cambio) {
  return {
    ...estado,
    tareas: estado.tareas.map((t) => (t.id === id ? { ...t, ...cambio(t) } : t)),
  }
}

export function agregarTarea(estado, texto, tipo, ahora = new Date()) {
  const limpio = texto.trim().slice(0, LARGO_MAXIMO_TEXTO)
  if (limpio === '') return estado
  return { ...estado, tareas: [...estado.tareas, crearTarea(limpio, tipo, ahora)] }
}

// ── Tarea del paseo ─────────────────────────────────────────────────────
// "Pasear a Bolti" (en cualquiera de sus variantes) es una tarea única: se anota una sola vez en
// la vida, desbloquea el minijuego del paseo (secreto) y se completa jugando el primer paseo.
// No se tilda a mano.

// ¿Ya la anotó alguna vez? (aunque la haya borrado: el secreto del paseo queda descubierto)
export function yaAnotoElPaseo(estado) {
  return Boolean(estado.secretos?.paseo) || estado.tareas.some((t) => t.tipo === 'paseo')
}

// Devuelve { estado, resultado: 'ok' | 'repetida' }
export function agregarTareaDePaseo(estado, texto, ahora = new Date()) {
  if (yaAnotoElPaseo(estado)) return { estado, resultado: 'repetida' }
  const limpio = texto.trim().slice(0, LARGO_MAXIMO_TEXTO)
  return { estado: { ...estado, tareas: [...estado.tareas, crearTarea(limpio, 'paseo', ahora)] }, resultado: 'ok' }
}

// Al terminar un paseo: completa la tarea del paseo pendiente (si hay), con sus monedas
// (respetando el tope de tareas del día) y un punto. Devuelve { estado, completada, puntos, monedas }.
export function completarPaseo(estado, ahora = new Date()) {
  const tarea = estado.tareas.find((t) => t.tipo === 'paseo' && !t.hecha)
  if (!tarea) return { estado, completada: false, puntos: 0, monedas: 0 }
  const conRecompensa = tareasConRecompensaRestantes(estado, ahora) > 0
  const monedas = conRecompensa ? monedasDeTarea() : 0
  const puntos = ECONOMIA.PUNTOS_POR_PASEO
  let nuevo = acreditar(estado, tarea.id, puntos, fechaLocal(ahora), 0, ahora)
  if (conRecompensa) nuevo = contarRecompensa({ ...nuevo, monedas: nuevo.monedas + monedas }, ahora)
  nuevo = reemplazarTarea(nuevo, tarea.id, () => ({ monedasGanadas: monedas }))
  return { estado: nuevo, completada: true, puntos, monedas }
}

// Todas las tareas dan lo mismo (las viejas "simple" y "grande" también)
export function monedasDeTarea() {
  return ECONOMIA.MONEDAS_POR_TAREA
}

// Cuántas tareas más pueden dar monedas hoy (el contador no baja si se borran tareas)
export function tareasConRecompensaRestantes(estado, ahora = new Date()) {
  const r = estado.recompensasTareas
  const usadas = r && r.fecha === fechaLocal(ahora) ? r.cantidad : 0
  return Math.max(0, ECONOMIA.TAREAS_CON_RECOMPENSA_POR_DIA - usadas)
}

function contarRecompensa(estado, ahora) {
  const hoy = fechaLocal(ahora)
  const r = estado.recompensasTareas
  const cantidad = r && r.fecha === hoy ? r.cantidad + 1 : 1
  return { ...estado, recompensasTareas: { fecha: hoy, cantidad } }
}

// Cuánto tiempo de estudio le queda disponible hoy a una tarea, sin pasarse del tope diario.
export function msDisponibles(estado, id, ahora = new Date()) {
  const hoy = fechaLocal(ahora)
  const acreditado = (estado.historialEstudio[hoy] ?? 0) * MINUTO
  const otrasEnCurso = estado.tareas
    .filter((t) => t.tipo === 'estudio' && !t.hecha && t.id !== id)
    .reduce((total, t) => total + crono.msContados(t.estudio, ahora.getTime()), 0)
  return Math.max(0, ESTUDIO.MINUTOS_MAXIMOS_POR_DIA * MINUTO - acreditado - otrasEnCurso)
}

function acreditar(estado, id, puntos, fecha, minutosEstudio, ahora) {
  const conPuntos = {
    ...estado,
    puntos: estado.puntos + puntos,
    puntosGanadosTotal: estado.puntosGanadosTotal + puntos,
    historialEstudio:
      minutosEstudio > 0
        ? {
            ...estado.historialEstudio,
            [fecha]: (estado.historialEstudio[fecha] ?? 0) + minutosEstudio,
          }
        : estado.historialEstudio,
  }
  return reemplazarTarea(conPuntos, id, (t) => ({
    hecha: true,
    hechaEn: ahora.toISOString(),
    puntosGanados: puntos,
    estudio: t.estudio ? crono.pausar(t.estudio, ahora.getTime()) : null,
  }))
}

// Devuelve { estado, completada, puntos, monedas }.
// Tareas comunes: dan monedas (si no se llegó al tope del día). Estudio: da puntos.
// Si no se puede completar, completada es false y el estado no cambia.
export function completarTarea(estado, id, ahora = new Date()) {
  const tarea = estado.tareas.find((t) => t.id === id)
  const nada = { estado, completada: false, puntos: 0, monedas: 0 }
  if (!tarea || tarea.hecha || tarea.tipo === 'paseo') return nada

  if (tarea.tipo !== 'estudio') {
    const conRecompensa = tareasConRecompensaRestantes(estado, ahora) > 0
    const monedas = conRecompensa ? monedasDeTarea() : 0
    let nuevo = acreditar(estado, id, 0, fechaLocal(ahora), 0, ahora)
    if (conRecompensa) nuevo = contarRecompensa({ ...nuevo, monedas: nuevo.monedas + monedas }, ahora)
    nuevo = reemplazarTarea(nuevo, id, () => ({ monedasGanadas: monedas }))
    return { estado: nuevo, completada: true, puntos: 0, monedas }
  }

  const ms = Math.min(crono.msContados(tarea.estudio, ahora.getTime()), msDisponibles(estado, id, ahora))
  if (!crono.llegoAlMinimo(ms)) return nada
  const puntos = crono.puntosPorTiempo(ms)
  return {
    estado: acreditar(estado, id, puntos, fechaLocal(ahora), crono.aMinutos(ms), ahora),
    completada: true,
    puntos,
    monedas: 0,
  }
}

// Borrar nunca resta puntos. La tarea obligatoria no se puede borrar hasta completarla.
export function borrarTarea(estado, id) {
  const tarea = estado.tareas.find((t) => t.id === id)
  if (!tarea || (tarea.obligatoria && !tarea.hecha)) return estado
  return { ...estado, tareas: estado.tareas.filter((t) => t.id !== id) }
}

// Aplica un cambio al cronómetro de una tarea. Si el cambio lo pone a correr, pausa los demás:
// solo puede haber un cronómetro andando.
export function actualizarCronometro(estado, id, cambio) {
  const tarea = estado.tareas.find((t) => t.id === id)
  if (!tarea || !tarea.estudio || tarea.hecha) return estado
  const nuevo = cambio(tarea.estudio)
  if (nuevo === tarea.estudio) return estado
  const ahora = Date.now()
  return {
    ...estado,
    tareas: estado.tareas.map((t) => {
      if (t.id === id) return { ...t, estudio: nuevo }
      if (crono.estaCorriendo(nuevo) && t.estudio && crono.estaCorriendo(t.estudio)) {
        return { ...t, estudio: crono.pausar(t.estudio, ahora) }
      }
      return t
    }),
  }
}

// Se llama al abrir la app y cada minuto. Vence las obligatorias de días anteriores y crea la
// de hoy si corresponde. Devuelve el mismo objeto si no cambió nada (así React no redibuja).
export function actualizarDia(estado, ahora = new Date()) {
  const hoy = fechaLocal(ahora)
  let nuevo = estado

  const vencidas = estado.tareas.filter((t) => t.obligatoria && !t.hecha && t.fecha !== hoy)
  for (const tarea of vencidas) {
    const corte = new Date(`${tarea.fecha}T23:59:59`)
    const finMs = Math.min(ahora.getTime(), corte.getTime())
    const ms = Math.min(
      crono.msContados(crono.pausar(tarea.estudio, finMs), finMs),
      ESTUDIO.MINUTOS_MAXIMOS_POR_DIA * MINUTO - (nuevo.historialEstudio[tarea.fecha] ?? 0) * MINUTO,
    )
    if (crono.llegoAlMinimo(ms)) {
      // Estudió lo suficiente pero no tocó "completar": no pierde lo estudiado.
      nuevo = acreditar(nuevo, tarea.id, crono.puntosPorTiempo(ms), tarea.fecha, crono.aMinutos(ms), corte)
    } else {
      // Sin castigo: la tarea simplemente desaparece.
      nuevo = { ...nuevo, tareas: nuevo.tareas.filter((t) => t.id !== tarea.id) }
    }
  }

  if (esDiaDeEstudioObligatorio(ahora) && nuevo.ultimoDiaObligatorio !== hoy) {
    const tarea = crearTarea('Estudiar', 'estudio', ahora, true)
    nuevo = { ...nuevo, tareas: [tarea, ...nuevo.tareas], ultimoDiaObligatorio: hoy }
  }

  return nuevo
}

// Al abrir la app: cierra los tramos de estudio que quedaron abiertos si se cerró de golpe.
export function retomarCronometros(estado, ahora = Date.now()) {
  const abiertas = estado.tareas.some((t) => t.estudio && crono.estaCorriendo(t.estudio))
  if (!abiertas) return estado
  return {
    ...estado,
    tareas: estado.tareas.map((t) =>
      t.estudio ? { ...t, estudio: crono.retomarDespuesDeCerrar(t.estudio, ahora) } : t,
    ),
  }
}

// ¿Estudió lo mínimo ese día? (para el humor de Bolti)
export function estudioElDia(estado, fecha) {
  return (estado.historialEstudio[fecha] ?? 0) >= ESTUDIO.MINUTOS_MINIMOS
}
