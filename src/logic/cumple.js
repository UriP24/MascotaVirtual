// El regalo de cumpleaños: todos los 28/10 aparece un regalo en la habitación.
// Al abrirlo: el gorrito (se lo pone sola), una torta a la mochila y una multi gratis del gacha.

import { REGALO_CUMPLE } from '../config.js'
import { esCumple } from './fechas.js'
import { regalarTiradas } from './gacha.js'

// `cumpleDePrueba` lo prende el modo prueba para ver el regalo cualquier día
export function hayRegaloDeCumple(estado, ahora = new Date()) {
  if (estado.cumpleDePrueba) return true
  return esCumple(ahora) && estado.regaloCumpleAbierto !== ahora.getFullYear()
}

export function abrirRegaloDeCumple(estado, ahora = new Date()) {
  if (!hayRegaloDeCumple(estado, ahora)) return estado
  const { prenda, comida, tiradasGratis } = REGALO_CUMPLE
  const tiene = estado.ropa.tiene.includes(prenda) ? estado.ropa.tiene : [...estado.ropa.tiene, prenda]
  const nuevo = {
    ...estado,
    regaloCumpleAbierto: ahora.getFullYear(),
    cumpleDePrueba: false,
    ropa: { tiene, puesta: { ...estado.ropa.puesta, cabeza: prenda } },
    inventario: { ...estado.inventario, [comida]: (estado.inventario[comida] ?? 0) + 1 },
  }
  return regalarTiradas(nuevo, tiradasGratis)
}
