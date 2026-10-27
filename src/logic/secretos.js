// Lógica pura de los secretos: descubrirlos (una sola vez, con su premio), la media de las
// mañanas, el puré del almuerzo, las fechas especiales y las pistas.

import { REGLAS_SECRETOS as R, SECRETOS } from '../config.js'
import { fechaLocal } from './fechas.js'
import { regalarTiradas } from './gacha.js'

const DIA = 24 * 60 * 60 * 1000

export function buscarSecreto(id) {
  return SECRETOS.find((s) => s.id === id)
}

export function estaDescubierto(estado, id) {
  return Boolean(estado.secretos[id])
}

export function progresoSecretos(estado) {
  return { descubiertos: SECRETOS.filter((s) => estaDescubierto(estado, s.id)).length, total: SECRETOS.length }
}

function darPremio(estado, premio) {
  if (premio.tiradas) return regalarTiradas(estado, premio.tiradas)
  if (premio.prenda && !estado.ropa.tiene.includes(premio.prenda)) {
    return { ...estado, ropa: { ...estado.ropa, tiene: [...estado.ropa.tiene, premio.prenda] } }
  }
  return estado
}

// Descubre un secreto (si no lo había descubierto) y le da su premio.
// Devuelve { estado, nuevo }: `nuevo` es true solo la primera vez.
export function descubrir(estado, id, ahora = new Date()) {
  const secreto = buscarSecreto(id)
  if (!secreto || secreto.proximamente || estaDescubierto(estado, id)) return { estado, nuevo: false }
  const conSecreto = { ...estado, secretos: { ...estado.secretos, [id]: ahora.toISOString() } }
  return { estado: darPremio(conSecreto, secreto.premio), nuevo: true }
}

// San Valentín o aniversario, si hoy es uno de esos días
export function fechaEspecial(ahora = new Date()) {
  const hoy = fechaLocal(ahora).slice(5)
  if (hoy === R.FECHA_SAN_VALENTIN) return 'san-valentin'
  if (hoy === R.FECHA_ANIVERSARIO) return 'aniversario'
  return null
}

// Una vez por día, desde que se despierta: chance de que Bolti traiga una media
export function sortearMedia(estado, ahora = new Date(), rng = Math.random) {
  const hoy = fechaLocal(ahora)
  if (ahora.getHours() < R.HORA_MEDIA || estado.ultimoSorteoMedia === hoy) return estado
  return { ...estado, ultimoSorteoMedia: hoy, mediaEsperando: estado.mediaEsperando || rng() < R.CHANCE_MEDIA }
}

// Mari agarra la media. resultado: 'suelta' (la primera), 'par' (la segunda: secreto) o 'extra' (+🪙)
export function agarrarMedia(estado, ahora = new Date()) {
  if (!estado.mediaEsperando) return { estado, resultado: null, nuevo: false }
  const medias = estado.medias + 1
  const base = { ...estado, mediaEsperando: false, medias }
  if (medias === 1) return { estado: base, resultado: 'suelta', nuevo: false }
  if (medias === 2) {
    const r = descubrir(base, 'medias', ahora)
    return { estado: r.estado, resultado: 'par', nuevo: r.nuevo }
  }
  return { estado: { ...base, monedas: base.monedas + R.MONEDAS_POR_MEDIA_EXTRA }, resultado: 'extra', nuevo: false }
}

function diasDesde(fechaTexto, ahora) {
  return Math.floor((new Date(`${fechaLocal(ahora)}T12:00:00`) - new Date(`${fechaTexto}T12:00:00`)) / DIA)
}

// ¿Aparece el platito de puré? Al almuerzo, unos días después de empezar y después una vez por semana.
export function hayPure(estado, ahora = new Date()) {
  if (estado.purePrueba) return true
  const hora = ahora.getHours()
  if (hora < R.PURE_DESDE || hora >= R.PURE_HASTA) return false
  if (diasDesde(estado.instaladaEn, ahora) < R.PURE_DIAS_DESDE_INSTALACION) return false
  return !estado.ultimoPure || diasDesde(estado.ultimoPure, ahora) >= R.PURE_CADA_DIAS
}

export function comerPure(estado, ahora = new Date()) {
  const comido = { ...estado, ultimoPure: fechaLocal(ahora), purePrueba: false }
  return descubrir(comido, 'pure', ahora)
}

// Una pista al azar de un secreto que todavía no descubrió (las fechas no tienen frase)
export function pistaAlAzar(estado, rng = Math.random) {
  const pendientes = SECRETOS.filter((s) => s.frase && !estaDescubierto(estado, s.id))
  if (pendientes.length === 0) return null
  return pendientes[Math.floor(rng() * pendientes.length)].frase
}
