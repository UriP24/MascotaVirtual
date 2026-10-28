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

// ── Estrella fugaz ──────────────────────────────────────────────────────
// Cada noche se sortea si esta noche pasa una estrella. La chance arranca en 0,01% y se
// multiplica ×1,25 por cada noche sin estrella (hasta 50%). Si pasa, cruza la ventana cada tanto
// hasta que Mari la toca; al atraparla, la chance vuelve a empezar.

export function esDeNoche(ahora = new Date()) {
  const hora = ahora.getHours()
  return hora >= R.NOCHE_DESDE || hora < R.NOCHE_HASTA
}

// La noche a la que pertenece un momento: la madrugada cuenta como la noche anterior
function claveDeNoche(ahora) {
  const d = new Date(ahora)
  if (d.getHours() < R.NOCHE_HASTA) d.setDate(d.getDate() - 1)
  return fechaLocal(d)
}

export function sortearEstrella(estado, ahora = new Date(), rng = Math.random) {
  if (!esDeNoche(ahora)) return estado
  const noche = claveDeNoche(ahora)
  const e = estado.estrella
  if (e.ultimaNoche === noche) return estado
  // Las noches que pasaron sin estrella desde el último sorteo (aunque no haya abierto la app)
  const noches = e.ultimaNoche ? Math.max(1, diasDesde(e.ultimaNoche, new Date(`${noche}T12:00:00`))) : 0
  const chance = Math.min(R.ESTRELLA_CHANCE_MAXIMA, e.chance * R.ESTRELLA_MULTIPLICADOR ** noches)
  return { ...estado, estrella: { ...e, ultimaNoche: noche, chance, estaNoche: rng() < chance } }
}

// Mari tocó la estrella: premio (la primera vez es el secreto, una multi) y la chance vuelve a empezar.
// Devuelve { estado, nuevo, tiradas }
export function atraparEstrella(estado, ahora = new Date()) {
  const reiniciada = { ...estado, estrella: { ...estado.estrella, chance: R.ESTRELLA_CHANCE_INICIAL, estaNoche: false } }
  const r = descubrir(reiniciada, 'estrella', ahora)
  if (r.nuevo) return { estado: r.estado, nuevo: true, tiradas: buscarSecreto('estrella').premio.tiradas }
  return { estado: regalarTiradas(r.estado, R.ESTRELLA_TIRADAS), nuevo: false, tiradas: R.ESTRELLA_TIRADAS }
}

// Una pista al azar de un secreto que todavía no descubrió (las fechas no tienen frase)
export function pistaAlAzar(estado, rng = Math.random) {
  const pendientes = SECRETOS.filter((s) => s.frase && !estaDescubierto(estado, s.id))
  if (pendientes.length === 0) return null
  return pendientes[Math.floor(rng() * pendientes.length)].frase
}
