// Lógica pura del gacha de ropa: tiradas con ⭐, garantías (pity) y canje de piezas.
// `rng` es una función que devuelve un número entre 0 y 1 (Math.random); en los tests se reemplaza.
// Gastar en el gacha resta del saldo, pero puntosGanadosTotal nunca baja.

import { GACHA, PRENDAS, TEMPORADAS } from '../config.js'

const RAREZAS_DE_GACHA = ['comun', 'rara', 'epica', 'ultra']

export function buscarPrenda(id) {
  return PRENDAS.find((p) => p.id === id)
}

export function temporadasActivas(ahora = new Date()) {
  const mes = ahora.getMonth() + 1
  return TEMPORADAS.filter((t) => t.meses.includes(mes))
}

// ¿Puede salir en el gacha (o canjearse con piezas) en este momento?
export function estaDisponible(prenda, ahora = new Date()) {
  if (prenda.exclusiva) return false
  if (!prenda.temporada) return true
  return temporadasActivas(ahora).some((t) => t.id === prenda.temporada)
}

export function prendasDisponibles(rareza, ahora = new Date()) {
  return PRENDAS.filter((p) => p.rareza === rareza && estaDisponible(p, ahora))
}

export function tienePrenda(estado, id) {
  return estado.ropa.tiene.includes(id)
}

// Las que todavía no tiene y se pueden canjear con piezas ahora (las de temporada, solo en su época)
export function prendasCanjeables(estado, rareza, ahora = new Date()) {
  return prendasDisponibles(rareza, ahora).filter((p) => !tienePrenda(estado, p.id))
}

export function precio(cantidad) {
  return cantidad === GACHA.TIRADAS_MULTI ? GACHA.PRECIO_MULTI : cantidad * GACHA.PRECIO_TIRADA
}

// Cuántas tiradas faltan para cada garantía (contando la próxima)
export function faltanParaUltra(estado) {
  return GACHA.GARANTIA_ULTRA - estado.gacha.tiradasDesdeUltra
}

export function faltanParaRara(estado) {
  return GACHA.GARANTIA_RARA - estado.gacha.tiradasDesdeRara
}

// Elige al azar un elemento según su peso: [{ valor, peso }]
function sortear(opciones, rng) {
  const total = opciones.reduce((suma, o) => suma + o.peso, 0)
  let tiro = rng() * total
  for (const o of opciones) {
    tiro -= o.peso
    if (tiro < 0) return o.valor
  }
  return opciones[opciones.length - 1].valor
}

function elegirRareza(contadores, rng) {
  if (contadores.tiradasDesdeUltra + 1 >= GACHA.GARANTIA_ULTRA) return 'ultra'
  const conRaraAsegurada = contadores.tiradasDesdeRara + 1 >= GACHA.GARANTIA_RARA
  const opciones = RAREZAS_DE_GACHA.filter((r) => !(conRaraAsegurada && r === 'comun')).map((r) => ({
    valor: r,
    peso: GACHA.PROBABILIDADES[r],
  }))
  return sortear(opciones, rng)
}

function elegirPremio(rareza, ahora, rng) {
  const premioPuntos = GACHA.PREMIOS_PUNTOS[rareza]
  // La chance de ⭐ está dada sobre el total, así que adentro de la rareza se divide por su chance
  if (premioPuntos && rng() < premioPuntos.chance / GACHA.PROBABILIDADES[rareza]) {
    return { tipo: 'puntos', rareza, puntos: premioPuntos.puntos }
  }
  const opciones = prendasDisponibles(rareza, ahora).map((p) => ({
    valor: p,
    peso: p.temporada ? GACHA.PESO_TEMPORADA : 1,
  }))
  const prenda = sortear(opciones, rng)
  return { tipo: 'prenda', rareza, prendaId: prenda.id }
}

// Hace `cantidad` tiradas (1 o una multi de 10). Usa primero las tiradas gratis si alcanzan.
// Devuelve { resultado: 'ok' | 'sin-puntos', estado, premios, gratis }.
export function tirar(estado, cantidad, ahora = new Date(), rng = Math.random) {
  const gratis = estado.gacha.tiradasGratis >= cantidad
  const costo = gratis ? 0 : precio(cantidad)
  if (estado.puntos < costo) return { resultado: 'sin-puntos', estado, premios: [], gratis }

  const gacha = {
    ...estado.gacha,
    tiradasGratis: estado.gacha.tiradasGratis - (gratis ? cantidad : 0),
  }
  const tiene = [...estado.ropa.tiene]
  const piezas = { ...estado.piezas }
  let puntosGanados = 0
  const premios = []

  for (let i = 0; i < cantidad; i++) {
    const rareza = elegirRareza(gacha, rng)
    const premio = elegirPremio(rareza, ahora, rng)
    gacha.tiradasTotales += 1
    gacha.tiradasDesdeUltra = rareza === 'ultra' ? 0 : gacha.tiradasDesdeUltra + 1
    gacha.tiradasDesdeRara = rareza === 'comun' ? gacha.tiradasDesdeRara + 1 : 0

    if (premio.tipo === 'puntos') {
      puntosGanados += premio.puntos
    } else if (tiene.includes(premio.prendaId)) {
      premio.repetida = true
      piezas[rareza] += 1
    } else {
      tiene.push(premio.prendaId)
    }
    premios.push(premio)
  }

  return {
    resultado: 'ok',
    gratis,
    premios,
    estado: {
      ...estado,
      puntos: estado.puntos - costo + puntosGanados,
      puntosGanadosTotal: estado.puntosGanadosTotal + puntosGanados,
      gacha,
      piezas,
      ropa: { ...estado.ropa, tiene },
    },
  }
}

// Canjea piezas de una rareza por una prenda de esa rareza que no tenga.
export function canjearPiezas(estado, prendaId, ahora = new Date()) {
  const prenda = buscarPrenda(prendaId)
  if (!prenda || !estaDisponible(prenda, ahora)) return { resultado: 'no-disponible', estado }
  if (tienePrenda(estado, prendaId)) return { resultado: 'ya-la-tiene', estado }
  const costo = GACHA.PIEZAS_PARA_CANJE[prenda.rareza]
  if (estado.piezas[prenda.rareza] < costo) return { resultado: 'faltan-piezas', estado }
  return {
    resultado: 'ok',
    estado: {
      ...estado,
      piezas: { ...estado.piezas, [prenda.rareza]: estado.piezas[prenda.rareza] - costo },
      ropa: { ...estado.ropa, tiene: [...estado.ropa.tiene, prendaId] },
    },
  }
}

// Para regalos (cumpleaños, secretos): suma tiradas gratis
export function regalarTiradas(estado, cantidad) {
  return { ...estado, gacha: { ...estado.gacha, tiradasGratis: estado.gacha.tiradasGratis + cantidad } }
}

// Cuántas prendas del gacha tiene, sobre el total que existen (sin contar exclusivas)
export function progresoColeccion(estado) {
  const delGacha = PRENDAS.filter((p) => !p.exclusiva)
  return {
    tiene: delGacha.filter((p) => tienePrenda(estado, p.id)).length,
    total: delGacha.length,
  }
}
