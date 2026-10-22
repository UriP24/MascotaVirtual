// Reglas generales de los minijuegos: cuándo se puede jugar y qué da cada partida.

import { JUEGOS, PERRITA } from '../config.js'
import { avanzarTiempo } from './bolti.js'
import { festejarLogro } from './festejo.js'
import { monedasPorPuntaje } from './puntaje.js'

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

// Al terminar: el puntaje se convierte en monedas (sin tope), +5 si es récord, cariño y festejo.
// Devuelve { estado, monedas, nuevoRecord, recordAnterior }
export function terminarPartida(estado, juegoId, puntaje) {
  const recordAnterior = estado.records?.[juegoId] ?? 0
  const nuevoRecord = puntaje > recordAnterior && puntaje > 0
  const monedas = monedasPorPuntaje(puntaje) + (nuevoRecord ? JUEGOS.MONEDAS_POR_RECORD : 0)
  const p = estado.perrita
  const conPremio = {
    ...estado,
    monedas: estado.monedas + monedas,
    records: nuevoRecord ? { ...estado.records, [juegoId]: puntaje } : estado.records,
    perrita: { ...p, carino: Math.min(PERRITA.NECESIDAD_MAXIMA, p.carino + JUEGOS.CARINO_POR_PARTIDA) },
  }
  return { estado: festejarLogro(conPremio, 'juego', { sumarCarino: false }), monedas, nuevoRecord, recordAnterior }
}
