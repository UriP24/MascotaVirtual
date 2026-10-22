// Puntaje → monedas, con la misma tabla para todos los minijuegos (sin tope).

import { JUEGOS } from '../config.js'

export function monedasPorPuntaje(puntaje) {
  const tabla = JUEGOS.PUNTAJE_A_MONEDAS
  let monedas = tabla[0].monedas
  for (const fila of tabla) if (puntaje >= fila.desde) monedas = fila.monedas
  const ultimo = tabla.at(-1)
  if (puntaje >= ultimo.desde) {
    monedas += Math.floor((puntaje - ultimo.desde) / JUEGOS.PUNTAJE_EXTRA_CADA) * JUEGOS.MONEDAS_EXTRA
  }
  return monedas
}

export function formatearPuntaje(puntaje) {
  return Math.round(puntaje).toLocaleString('es-AR')
}

// Premio por récord: crece con el puntaje (500 → +10, 1.000 → +20, 1.500 → +30…), mínimo 5
export function monedasPorRecord(puntaje) {
  return Math.max(JUEGOS.RECORD_MONEDAS_MINIMAS, Math.floor(puntaje / 500) * JUEGOS.RECORD_MONEDAS_CADA_500)
}
