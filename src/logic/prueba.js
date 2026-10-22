// Atajos del modo prueba (solo para Uri, para no esperar los tiempos reales).
// Se activa abriendo la app con ?prueba al final del link, o con `npm run dev`.

import { crearEstadoInicial } from '../storage.js'
import { COMIDAS } from '../config.js'
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

const DURACION_FORZADO = 1 * HORA

// Cambia valores de Bolti y la deja despierta (o dormida) 1 hora sin importar el horario,
// para poder tocarla y probar tranquilo aunque sea de noche (o de día).
export function cambiarBolti(estado, cambios, ahora = Date.now()) {
  const durmiendo = cambios.durmiendo ?? false
  return {
    ...estado,
    perrita: {
      ...estado.perrita,
      ...cambios,
      durmiendo,
      actualizadaEn: ahora,
      forzado: { durmiendo, hasta: ahora + DURACION_FORZADO },
    },
  }
}

// Saca el forzado: Bolti vuelve a seguir su horario de sueño.
export function volverAlHorarioNormal(estado, ahora = Date.now()) {
  return actualizarBolti({ ...estado, perrita: { ...estado.perrita, forzado: null, ultimaActividad: null } }, ahora + 1)
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

// Dos unidades de cada comida (incluida la torta, para probarla)
export function llenarBandeja(estado) {
  const inventario = { ...estado.inventario }
  for (const c of COMIDAS) inventario[c.id] = (inventario[c.id] ?? 0) + 2
  return { ...estado, inventario }
}

// Mueve los cupones de este mes al mes pasado: libera el canje del mes para volver a probar.
export function liberarCanjeDelMes(estado, ahora = new Date()) {
  const esteMes = fechaLocal(ahora).slice(0, 7)
  return {
    ...estado,
    cupones: estado.cupones.map((c) => {
      const fecha = new Date(c.fecha)
      if (fechaLocal(fecha).slice(0, 7) !== esteMes) return c
      fecha.setMonth(fecha.getMonth() - 1)
      return { ...c, fecha: fecha.toISOString() }
    }),
  }
}

export function borrarCupones(estado) {
  return { ...estado, cupones: [] }
}

// Permite volver a cambiar monedas por puntos hoy
export function liberarCambioDelDia(estado) {
  return { ...estado, conversiones: { fecha: null, cantidad: 0 } }
}

export function reiniciarTodo() {
  return actualizarDia(crearEstadoInicial())
}
