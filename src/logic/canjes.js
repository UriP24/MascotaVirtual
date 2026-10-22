// Lógica pura de los canjes: cambiar puntos por un plan juntos y guardar el cupón.
// Cada plan se puede canjear 1 vez cada `rotacionMeses` meses calendario (validado con la fecha
// de sus cupones). Se pueden canjear planes distintos en el mismo mes.
// Canjear resta del saldo, pero puntosGanadosTotal nunca baja.

import { PLANES, precioEnPuntos } from '../config.js'

export function buscarPlan(id) {
  return PLANES.find((p) => p.id === id)
}

// Meses calendario entre dos fechas (octubre → enero = 3)
function mesesEntre(desde, hasta) {
  return (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth())
}

function ultimoCupon(estado, planId) {
  const cupones = estado.cupones.filter((c) => c.planId === planId)
  if (cupones.length === 0) return null
  return cupones.reduce((ultimo, c) => (new Date(c.fecha) > new Date(ultimo.fecha) ? c : ultimo))
}

// Fecha desde la que se puede volver a canjear el plan (día 1 del mes que corresponda),
// o null si ya está disponible.
export function disponibleDesde(estado, plan, ahora = new Date()) {
  const ultimo = ultimoCupon(estado, plan.id)
  if (!ultimo) return null
  const fecha = new Date(ultimo.fecha)
  if (mesesEntre(fecha, ahora) >= plan.rotacionMeses) return null
  return new Date(fecha.getFullYear(), fecha.getMonth() + plan.rotacionMeses, 1)
}

export function puntosQueFaltan(estado, plan) {
  return Math.max(0, precioEnPuntos(plan) - estado.puntos)
}

function crearId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

// Devuelve { estado, resultado }: 'ok' | 'sin-puntos' | 'en-rotacion' | 'no-existe'
export function canjear(estado, planId, ahora = new Date()) {
  const plan = buscarPlan(planId)
  if (!plan) return { estado, resultado: 'no-existe' }
  if (disponibleDesde(estado, plan, ahora)) return { estado, resultado: 'en-rotacion' }
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

export function nombreDelMes(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', { month: 'long' })
}

export function textoRotacion(plan) {
  return plan.rotacionMeses === 1 ? '1 vez por mes' : `1 vez cada ${plan.rotacionMeses} meses`
}
