// Cambio de monedas por puntos: MONEDAS_POR_PUNTO monedas = 1 punto, con un tope por día.

import { ECONOMIA } from '../config.js'
import { fechaLocal } from './fechas.js'

export function puntosConvertiblesHoy(estado, ahora = new Date()) {
  const c = estado.conversiones
  const usados = c && c.fecha === fechaLocal(ahora) ? c.cantidad : 0
  return Math.max(0, ECONOMIA.PUNTOS_CONVERTIBLES_POR_DIA - usados)
}

// Devuelve { estado, resultado }: 'ok' | 'sin-monedas' | 'tope-diario'
export function convertirMonedas(estado, ahora = new Date()) {
  if (puntosConvertiblesHoy(estado, ahora) <= 0) return { estado, resultado: 'tope-diario' }
  if (estado.monedas < ECONOMIA.MONEDAS_POR_PUNTO) return { estado, resultado: 'sin-monedas' }
  const hoy = fechaLocal(ahora)
  const c = estado.conversiones
  return {
    estado: {
      ...estado,
      monedas: estado.monedas - ECONOMIA.MONEDAS_POR_PUNTO,
      puntos: estado.puntos + 1,
      puntosGanadosTotal: estado.puntosGanadosTotal + 1,
      conversiones: { fecha: hoy, cantidad: c && c.fecha === hoy ? c.cantidad + 1 : 1 },
    },
    resultado: 'ok',
  }
}
