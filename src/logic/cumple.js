// El regalo: la primera vez que abre la app aparece un regalo en la habitación con las monedas y los
// puntos de bienvenida, el gorrito, la torta y una multi gratis del gacha. Después, todos los 28/10
// aparece otro (gorrito, torta y multi).

import { ECONOMIA, REGALO_CUMPLE } from '../config.js'
import { esCumple } from './fechas.js'
import { regalarTiradas } from './gacha.js'

// `cumpleDePrueba` lo prende el modo prueba para ver el regalo cualquier día
export function hayRegaloDeCumple(estado, ahora = new Date()) {
  if (estado.cumpleDePrueba || !estado.regaloBienvenidaAbierto) return true
  return esCumple(ahora) && estado.regaloCumpleAbierto !== ahora.getFullYear()
}

// ¿El regalo que está por abrir es el de la primera vez? (trae también monedas y puntos)
export function esRegaloDeBienvenida(estado) {
  return !estado.regaloBienvenidaAbierto
}

export function abrirRegaloDeCumple(estado, ahora = new Date()) {
  if (!hayRegaloDeCumple(estado, ahora)) return estado
  const { prenda, comida, tiradasGratis } = REGALO_CUMPLE
  const tiene = estado.ropa.tiene.includes(prenda) ? estado.ropa.tiene : [...estado.ropa.tiene, prenda]
  const bienvenida = esRegaloDeBienvenida(estado)
  const nuevo = {
    ...estado,
    // Si el de bienvenida se abre un 28/10, ese año ya no aparece otro
    regaloCumpleAbierto: esCumple(ahora) ? ahora.getFullYear() : estado.regaloCumpleAbierto,
    regaloBienvenidaAbierto: true,
    cumpleDePrueba: false,
    ropa: { tiene, puesta: { ...estado.ropa.puesta, cabeza: prenda } },
    inventario: { ...estado.inventario, [comida]: (estado.inventario[comida] ?? 0) + 1 },
  }
  if (bienvenida) {
    nuevo.monedas = estado.monedas + ECONOMIA.MONEDAS_DE_BIENVENIDA
    nuevo.puntos = estado.puntos + ECONOMIA.PUNTOS_DE_BIENVENIDA
    nuevo.puntosGanadosTotal = estado.puntosGanadosTotal + ECONOMIA.PUNTOS_DE_BIENVENIDA
  }
  return regalarTiradas(nuevo, tiradasGratis)
}
