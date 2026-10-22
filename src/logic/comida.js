// Lógica pura de la comida: comprar con monedas (nunca con puntos) y darle de comer a Bolti.

import { COMIDAS, PERRITA } from '../config.js'
import { avanzarTiempo } from './bolti.js'

export function buscarComida(id) {
  return COMIDAS.find((c) => c.id === id)
}

export function comidasALaVenta() {
  return COMIDAS.filter((c) => c.precio !== null)
}

// Lo que tiene en el inventario, en el orden de COMIDAS, solo lo que tiene al menos 1.
export function comidasEnInventario(estado) {
  return COMIDAS.filter((c) => (estado.inventario[c.id] ?? 0) > 0).map((c) => ({
    ...c,
    cantidad: estado.inventario[c.id],
  }))
}

// Devuelve { estado, ok }. Si no alcanza la plata o no se vende, el estado no cambia.
export function comprar(estado, id) {
  const comida = buscarComida(id)
  if (!comida || comida.precio === null || estado.monedas < comida.precio) return { estado, ok: false }
  return {
    estado: {
      ...estado,
      monedas: estado.monedas - comida.precio,
      inventario: { ...estado.inventario, [id]: (estado.inventario[id] ?? 0) + 1 },
    },
    ok: true,
  }
}

function limitar(valor) {
  return Math.max(0, Math.min(PERRITA.NECESIDAD_MAXIMA, valor))
}

// Devuelve { estado, resultado } con resultado:
// 'comio' | 'llena' | 'durmiendo' | 'sin-comida'. Si no come, la comida no se gasta.
export function darDeComer(estado, id, ahora = Date.now()) {
  const comida = buscarComida(id)
  const p = avanzarTiempo(estado.perrita, ahora)
  const conTiempo = { ...estado, perrita: p }
  if (!comida || (estado.inventario[id] ?? 0) <= 0) return { estado: conTiempo, resultado: 'sin-comida' }
  if (p.durmiendo) return { estado: conTiempo, resultado: 'durmiendo' }
  if (p.saciedad >= PERRITA.SACIEDAD_LLENA) return { estado: conTiempo, resultado: 'llena' }
  return {
    estado: {
      ...estado,
      inventario: { ...estado.inventario, [id]: estado.inventario[id] - 1 },
      perrita: {
        ...p,
        saciedad: limitar(p.saciedad + comida.saciedad),
        carino: limitar(p.carino + comida.carino),
        ultimaActividad: ahora,
      },
    },
    resultado: 'comio',
  }
}
