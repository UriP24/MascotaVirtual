// Lógica pura del cronómetro de estudio. Todas las funciones reciben el cronómetro y "ahora"
// (en milisegundos) y devuelven un cronómetro nuevo, sin modificar el original.
//
// En vez de sumar un segundo por tick (el celular frena los ticks y se atrasaría), guardamos
// cuándo arrancó el tramo actual y calculamos la diferencia con la hora actual.

import { ECONOMIA, ESTUDIO } from '../config.js'

const MINUTO = 60 * 1000

export function crearCronometro() {
  return {
    acumuladoMs: 0, // tiempo ya contado en tramos anteriores
    inicioTramo: null, // cuándo arrancó el tramo actual (null = pausado)
    pausa: null, // por qué está pausado: 'manual' | 'segundo-plano' | 'inactividad' | 'maximo'
    proximoChequeo: null, // cuándo Bolti va a preguntar "¿Seguís estudiando?"
    chequeoDesde: null, // cuándo preguntó (si todavía no respondió)
    latido: null, // última vez que la app confirmó que seguía abierta
  }
}

function chequeoActivo() {
  return ESTUDIO.CHEQUEO_MINUTOS_MIN > 0
}

function proximoChequeo(ahora, azar) {
  if (!chequeoActivo()) return null
  const { CHEQUEO_MINUTOS_MIN: min, CHEQUEO_MINUTOS_MAX: max } = ESTUDIO
  return ahora + (min + (max - min) * azar) * MINUTO
}

export function estaCorriendo(crono) {
  return crono.inicioTramo !== null
}

// Tiempo contado hasta ahora. Mientras Bolti espera respuesta, el tiempo queda congelado
// en el momento en que preguntó.
export function msContados(crono, ahora) {
  if (!estaCorriendo(crono)) return crono.acumuladoMs
  const fin = crono.chequeoDesde ?? ahora
  return crono.acumuladoMs + Math.max(0, fin - crono.inicioTramo)
}

export function iniciar(crono, ahora, azar = Math.random()) {
  if (estaCorriendo(crono)) return crono
  return {
    ...crono,
    inicioTramo: ahora,
    pausa: null,
    proximoChequeo: proximoChequeo(ahora, azar),
    chequeoDesde: null,
    latido: ahora,
  }
}

export function pausar(crono, ahora, motivo = 'manual') {
  if (!estaCorriendo(crono)) return crono
  return {
    ...crono,
    acumuladoMs: msContados(crono, ahora),
    inicioTramo: null,
    pausa: motivo,
    proximoChequeo: null,
    chequeoDesde: null,
  }
}

// Se llama seguido mientras corre: dispara la pregunta de Bolti, pausa si no respondió a tiempo
// y frena el cronómetro si llegó al tope. Devuelve el mismo objeto si no cambió nada.
export function revisar(crono, ahora, limiteMs) {
  if (!estaCorriendo(crono)) return crono

  if (msContados(crono, ahora) >= limiteMs) {
    return { ...pausar(crono, ahora, 'maximo'), acumuladoMs: limiteMs }
  }

  if (crono.chequeoDesde !== null) {
    const vence = crono.chequeoDesde + ESTUDIO.CHEQUEO_MINUTOS_PARA_RESPONDER * MINUTO
    if (ahora >= vence) return pausar(crono, ahora, 'inactividad')
    return crono
  }

  if (crono.proximoChequeo !== null && ahora >= crono.proximoChequeo) {
    return { ...crono, chequeoDesde: crono.proximoChequeo }
  }

  return crono
}

// Respondió "¡Sí!" a tiempo: el tiempo de espera cuenta y se programa la próxima pregunta.
export function confirmarPresencia(crono, ahora, azar = Math.random()) {
  if (crono.chequeoDesde === null) return crono
  return { ...crono, chequeoDesde: null, proximoChequeo: proximoChequeo(ahora, azar) }
}

export function registrarLatido(crono, ahora) {
  if (!estaCorriendo(crono)) return crono
  return { ...crono, latido: ahora }
}

// Al abrir la app: si quedó un tramo abierto (la app se cerró de golpe), solo cuenta hasta
// el último latido, y el cronómetro sigue corriendo desde ahora.
export function retomarDespuesDeCerrar(crono, ahora) {
  if (!estaCorriendo(crono)) return crono
  const fin = Math.min(crono.latido ?? crono.inicioTramo, ahora)
  return iniciar(pausar(crono, fin, 'segundo-plano'), ahora)
}

export function puntosPorTiempo(ms) {
  const bloques = Math.floor(ms / (ECONOMIA.MINUTOS_POR_BLOQUE_ESTUDIO * MINUTO))
  return bloques * ECONOMIA.PUNTOS_POR_BLOQUE_ESTUDIO
}

export function llegoAlMinimo(ms) {
  return ms >= ESTUDIO.MINUTOS_MINIMOS * MINUTO
}

export function aMinutos(ms) {
  return Math.floor(ms / MINUTO)
}
