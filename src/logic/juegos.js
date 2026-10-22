// Reglas generales de los minijuegos: cuándo se puede jugar y qué da cada partida.

import { JUEGOS, PERRITA } from '../config.js'
import { avanzarTiempo } from './bolti.js'
import { festejarLogro } from './festejo.js'

// Devuelve { ok, motivo }: motivo 'durmiendo' | 'cansada' | null
export function puedeJugar(estado, ahora = Date.now()) {
  const p = avanzarTiempo(estado.perrita, ahora)
  if (p.durmiendo) return { ok: false, motivo: 'durmiendo' }
  if (p.energia < JUEGOS.ENERGIA_MINIMA_PARA_JUGAR) return { ok: false, motivo: 'cansada' }
  return { ok: true, motivo: null }
}

// La energía se cobra al empezar (así no conviene salir a mitad de partida para no pagarla)
export function empezarPartida(estado, ahora = Date.now()) {
  if (!puedeJugar(estado, ahora).ok) return estado
  const p = avanzarTiempo(estado.perrita, ahora)
  return {
    ...estado,
    perrita: { ...p, energia: Math.max(0, p.energia - JUEGOS.ENERGIA_POR_PARTIDA), ultimaActividad: ahora },
  }
}

// Al terminar: monedas (con tope por partida), cariño y festejo de Bolti
export function terminarPartida(estado, monedasGanadas) {
  const monedas = Math.max(0, Math.min(JUEGOS.HUESITOS_MONEDAS_MAXIMAS, Math.floor(monedasGanadas)))
  const p = estado.perrita
  const conPremio = {
    ...estado,
    monedas: estado.monedas + monedas,
    perrita: { ...p, carino: Math.min(PERRITA.NECESIDAD_MAXIMA, p.carino + JUEGOS.CARINO_POR_PARTIDA) },
  }
  return festejarLogro(conPremio, 'juego', { sumarCarino: false })
}
