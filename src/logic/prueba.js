// Atajos del modo prueba (solo para Uri, para no esperar los tiempos reales).
// Se activa abriendo la app con ?prueba al final del link, o con `npm run dev`.

import { crearEstadoInicial } from '../storage.js'
import { fechaLocal } from './fechas.js'
import { actualizarDia } from './tareas.js'
import { actualizarBolti } from './bolti.js'

const MINUTO = 60 * 1000
const HORA = 60 * MINUTO

export function modoPruebaActivo() {
  if (import.meta.env?.DEV) return true
  return new URLSearchParams(window.location.search).has('prueba')
}

// Suma minutos al cronómetro de la tarea de estudio pendiente (la que está corriendo, o la primera).
export function sumarEstudio(estado, minutos) {
  const pendientes = estado.tareas.filter((t) => t.tipo === 'estudio' && !t.hecha)
  const tarea = pendientes.find((t) => t.estudio.inicioTramo !== null) ?? pendientes[0]
  if (!tarea) return estado
  return {
    ...estado,
    tareas: estado.tareas.map((t) =>
      t.id === tarea.id ? { ...t, estudio: { ...t.estudio, acumuladoMs: t.estudio.acumuladoMs + minutos * MINUTO } } : t,
    ),
  }
}

// Hace como si hubieran pasado unas horas para Bolti (respeta su horario de sueño).
export function adelantarBolti(estado, horas, ahora = Date.now()) {
  const p = estado.perrita
  const atras = horas * HORA
  const corrida = {
    ...p,
    actualizadaEn: p.actualizadaEn - atras,
    ultimaActividad: p.ultimaActividad === null ? null : p.ultimaActividad - atras,
  }
  return actualizarBolti({ ...estado, perrita: corrida }, ahora)
}

export function cambiarBolti(estado, cambios) {
  return { ...estado, perrita: { ...estado.perrita, ...cambios } }
}

// Como si la app estuviera instalada hace una semana y ayer no hubiera estudiado.
export function simularQueNoEstudio(estado, ahora = new Date()) {
  const haceUnaSemana = new Date(ahora)
  haceUnaSemana.setDate(haceUnaSemana.getDate() - 8)
  const hoy = fechaLocal(ahora)
  return {
    ...estado,
    instaladaEn: fechaLocal(haceUnaSemana),
    historialEstudio: estado.historialEstudio[hoy] ? { [hoy]: estado.historialEstudio[hoy] } : {},
  }
}

export function sumarMonedas(estado, cantidad) {
  return { ...estado, monedas: estado.monedas + cantidad }
}

export function sumarPuntos(estado, cantidad) {
  return {
    ...estado,
    puntos: estado.puntos + cantidad,
    puntosGanadosTotal: estado.puntosGanadosTotal + cantidad,
  }
}

export function reiniciarTodo() {
  return actualizarDia(crearEstadoInicial())
}
