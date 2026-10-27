// Ponerle y sacarle ropa a Bolti. Una prenda por zona (cabeza, cara, cuello, cuerpo, patitas).
// Un disfraz o conjunto ("entero") la viste toda: al ponerlo se saca lo demás, y al ponerle
// cualquier otra prenda se saca el disfraz.

import { PRENDAS, ZONAS } from '../config.js'

function buscarPrenda(id) {
  return PRENDAS.find((p) => p.id === id)
}

export function estaPuesta(estado, id) {
  return Object.values(estado.ropa.puesta).includes(id)
}

export function ponerPrenda(estado, id) {
  const prenda = buscarPrenda(id)
  if (!prenda || !estado.ropa.tiene.includes(id)) return estado
  let puesta
  if (prenda.zona === 'entero') {
    puesta = { entero: id }
  } else {
    const { entero: _disfraz, ...resto } = estado.ropa.puesta
    puesta = { ...resto, [prenda.zona]: id }
  }
  return { ...estado, ropa: { ...estado.ropa, puesta } }
}

export function sacarPrenda(estado, id) {
  const puesta = Object.fromEntries(Object.entries(estado.ropa.puesta).filter(([, puestaId]) => puestaId !== id))
  return { ...estado, ropa: { ...estado.ropa, puesta } }
}

// Tocar una prenda en la mochila: si la tiene puesta se la saca, si no se la pone
export function alternarPrenda(estado, id) {
  return estaPuesta(estado, id) ? sacarPrenda(estado, id) : ponerPrenda(estado, id)
}

export function sacarTodo(estado) {
  return { ...estado, ropa: { ...estado.ropa, puesta: {} } }
}

// La ropa que tiene, ordenada por zona (cabeza primero) para mostrarla en la mochila
export function ropaQueTiene(estado) {
  return estado.ropa.tiene
    .map(buscarPrenda)
    .filter(Boolean)
    .sort((a, b) => ZONAS.indexOf(a.zona) - ZONAS.indexOf(b.zona))
}
