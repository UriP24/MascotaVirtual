// Lógica pura de los canjes: cambiar puntos por un plan juntos y guardar el cupón.
// Cada plan tiene su frecuencia por meses calendario (validada con la fecha de sus cupones):
// 1 vez cada `rotacionMeses` meses, o hasta `vecesPorMes` veces en el mismo mes (no se acumulan).
// Se pueden canjear planes distintos en el mismo mes.
// Canjear resta del saldo, pero puntosGanadosTotal nunca baja.

import { PLANES, precioEnPuntos } from '../config.js'

export function buscarPlan(id) {
  return PLANES.find((p) => p.id === id)
}

// Meses calendario entre dos fechas (octubre → enero = 3)
function mesesEntre(desde, hasta) {
  return (hasta.getFullYear() - desde.getFullYear()) * 12 + (hasta.getMonth() - desde.getMonth())
}

function cuponesDelPlan(estado, planId) {
  return estado.cupones.filter((c) => c.planId === planId)
}

function ultimoCupon(estado, planId) {
  const cupones = cuponesDelPlan(estado, planId)
  if (cupones.length === 0) return null
  return cupones.reduce((ultimo, c) => (new Date(c.fecha) > new Date(ultimo.fecha) ? c : ultimo))
}

function vecesPorMes(plan) {
  return plan.vecesPorMes ?? 1
}

// Cuántas veces se canjeó el plan en el mes calendario de "ahora"
export function usosEsteMes(estado, plan, ahora = new Date()) {
  return cuponesDelPlan(estado, plan.id).filter((c) => mesesEntre(new Date(c.fecha), ahora) === 0).length
}

// Fecha desde la que se puede volver a canjear el plan (día 1 del mes que corresponda),
// o null si ya está disponible.
export function disponibleDesde(estado, plan, ahora = new Date()) {
  if (plan.rotacionMeses > 1) {
    const ultimo = ultimoCupon(estado, plan.id)
    if (!ultimo) return null
    const fecha = new Date(ultimo.fecha)
    if (mesesEntre(fecha, ahora) >= plan.rotacionMeses) return null
    return new Date(fecha.getFullYear(), fecha.getMonth() + plan.rotacionMeses, 1)
  }
  if (usosEsteMes(estado, plan, ahora) < vecesPorMes(plan)) return null
  return new Date(ahora.getFullYear(), ahora.getMonth() + 1, 1)
}

// Para los planes de varias veces por mes: cuántas veces le quedan este mes
export function usosRestantesEsteMes(estado, plan, ahora = new Date()) {
  return Math.max(0, vecesPorMes(plan) - usosEsteMes(estado, plan, ahora))
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

export function nombreDelMes(fecha) {
  return new Date(fecha).toLocaleDateString('es-AR', { month: 'long' })
}

export function textoRotacion(plan) {
  if (plan.rotacionMeses > 1) return `1 vez cada ${plan.rotacionMeses} meses`
  return vecesPorMes(plan) === 1 ? '1 vez por mes' : `${vecesPorMes(plan)} veces por mes`
}

export function formatearFechaHora(fecha) {
  const f = new Date(fecha)
  const dia = f.toLocaleDateString('es-AR', { day: 'numeric', month: 'numeric', year: 'numeric' })
  const hora = f.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
  return `${dia} a las ${hora}`
}

// Cupones para mostrar: pendientes (todavía no cumplidos) e historial (todos, del más nuevo al más viejo)
export function cuponesPendientes(estado) {
  return estado.cupones.filter((c) => !c.cumplido)
}

export function historialDeCupones(estado) {
  return [...estado.cupones].sort((a, b) => new Date(b.fecha) - new Date(a.fecha))
}
