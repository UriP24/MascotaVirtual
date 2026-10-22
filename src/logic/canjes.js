// Lógica pura de los canjes: cambiar puntos por un plan juntos y guardar el cupón.
// Límite: CANJES_POR_MES canjes por mes calendario (se renueva el día 1), validado con la fecha
// de los cupones. Canjear resta del saldo, pero puntosGanadosTotal nunca baja.

import { ECONOMIA, PLANES, precioEnPuntos } from '../config.js'
import { fechaLocal } from './fechas.js'

function mes(fecha) {
  return fechaLocal(fecha).slice(0, 7) // 'AAAA-MM'
}

export function buscarPlan(id) {
  return PLANES.find((p) => p.id === id)
}

export function canjesDelMes(estado, ahora = new Date()) {
  const esteMes = mes(ahora)
  return estado.cupones.filter((c) => mes(new Date(c.fecha)) === esteMes).length
}

export function puedeCanjearEsteMes(estado, ahora = new Date()) {
  return canjesDelMes(estado, ahora) < ECONOMIA.CANJES_POR_MES
}

// El día 1 del mes que viene, a las 00:00
export function proximoCanje(ahora = new Date()) {
  return new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1)
}

export function puntosQueFaltan(estado, plan) {
  return Math.max(0, precioEnPuntos(plan) - estado.puntos)
}

function crearId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// Devuelve { estado, resultado }: 'ok' | 'sin-puntos' | 'limite-mes' | 'no-existe'
export function canjear(estado, planId, ahora = new Date()) {
  const plan = buscarPlan(planId)
  if (!plan) return { estado, resultado: 'no-existe' }
  if (!puedeCanjearEsteMes(estado, ahora)) return { estado, resultado: 'limite-mes' }
  const costo = precioEnPuntos(plan)
  if (estado.puntos < costo) return { estado, resultado: 'sin-puntos' }
  const cupon = {
    id: crearId(),
    planId: plan.id,
    nombre: plan.nombre,
    emoji: plan.emoji,
    costo,
    fecha: ahora.toISOString(),
    cumplido: false,
    cumplidoEn: null,
  }
  return {
    estado: { ...estado, puntos: estado.puntos - costo, cupones: [cupon, ...estado.cupones] },
    resultado: 'ok',
  }
}

export function marcarCumplido(estado, cuponId, ahora = new Date()) {
  return {
    ...estado,
    cupones: estado.cupones.map((c) =>
      c.id === cuponId && !c.cumplido ? { ...c, cumplido: true, cumplidoEn: ahora.toISOString() } : c,
    ),
  }
}

export function formatearFecha(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', { day: 'numeric', month: 'long' })
}
