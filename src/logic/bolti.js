// Lógica pura de Bolti: necesidades con reloj real, sueño, humor y mimos.
// Nunca se enferma ni muere: las necesidades solo van de 0 a NECESIDAD_MAXIMA.

import { PERRITA } from '../config.js'
import { fechaLocal, esDiaDeEstudioObligatorio } from './fechas.js'
import { estudioElDia } from './tareas.js'

const MINUTO = 60 * 1000
const HORA = 60 * MINUTO
// Simulamos el tiempo en tramos cortos para respetar los horarios de sueño
const PASO = 15 * MINUTO
// Si la app estuvo cerrada mucho tiempo, no hace falta simular más que esto
const MAXIMO_A_SIMULAR = 7 * 24 * HORA
// Si la despiertan de madrugada, vuelve a dormirse tras este rato sin mimos
const ESPERA_PARA_REDORMIRSE = 1 * MINUTO

function limitar(valor) {
  return Math.max(0, Math.min(PERRITA.NECESIDAD_MAXIMA, valor))
}

// De 00:00 a 10:00 es su horario de dormir
export function esHorarioDeDormir(fecha) {
  const hora = fecha.getHours()
  return hora >= PERRITA.HORA_SE_DUERME_SOLA && hora < PERRITA.HORA_SE_DESPIERTA
}

// De 10:00 a 22:00 está despierta sí o sí
function esHorarioDeDia(fecha) {
  const hora = fecha.getHours()
  return hora >= PERRITA.HORA_SE_DESPIERTA && hora < PERRITA.HORA_PUEDE_DORMIR
}

// Avanza las necesidades desde la última actualización hasta "ahora" (en ms).
// Devuelve la misma perrita si no pasó tiempo.
export function avanzarTiempo(perrita, ahora) {
  const desde = perrita.actualizadaEn ?? ahora
  if (ahora <= desde) return perrita

  let { saciedad, energia, carino, durmiendo } = perrita
  let t = Math.max(desde, ahora - MAXIMO_A_SIMULAR)

  while (t < ahora) {
    const fin = Math.min(t + PASO, ahora)
    const fecha = new Date(t)
    const ultimaActividad = perrita.ultimaActividad ?? 0

    if (!durmiendo && esHorarioDeDormir(fecha) && t >= ultimaActividad + ESPERA_PARA_REDORMIRSE) {
      durmiendo = true
    } else if (durmiendo && esHorarioDeDia(fecha)) {
      durmiendo = false
    }

    const horas = (fin - t) / HORA
    saciedad -= PERRITA.SACIEDAD_BAJA_POR_HORA * horas
    if (durmiendo) {
      energia += PERRITA.ENERGIA_SUBE_POR_HORA_DURMIENDO * horas
    } else {
      energia -= PERRITA.ENERGIA_BAJA_POR_HORA * horas
      carino -= PERRITA.CARINO_BAJA_POR_HORA * horas // durmiendo no extraña
    }
    saciedad = limitar(saciedad)
    energia = limitar(energia)
    carino = limitar(carino)
    t = fin
  }

  return { ...perrita, saciedad, energia, carino, durmiendo, actualizadaEn: ahora }
}

// Avanza a Bolti dentro del estado completo. Mismo objeto si no cambió nada.
export function actualizarBolti(estado, ahora = Date.now()) {
  const perrita = avanzarTiempo(estado.perrita, ahora)
  if (perrita === estado.perrita) return estado
  return { ...estado, perrita }
}

// ¿Se perdió el estudio del último día obligatorio? Solo cuenta días en que la app ya estaba
// instalada, y se le pasa apenas estudia hoy.
export function extranaElEstudio(estado, ahora = new Date()) {
  if (estudioElDia(estado, fechaLocal(ahora))) return false
  const dia = new Date(ahora)
  for (let i = 0; i < 7; i++) {
    dia.setDate(dia.getDate() - 1)
    if (esDiaDeEstudioObligatorio(dia)) break
  }
  const fecha = fechaLocal(dia)
  if (!estado.instaladaEn || fecha < estado.instaladaEn) return false
  return !estudioElDia(estado, fecha)
}

// El humor no se guarda: se calcula. Gana la primera regla que se cumple.
export function humor(estado, ahora = new Date()) {
  const p = estado.perrita
  if (p.durmiendo) return 'dormida'
  if (p.saciedad < PERRITA.NIVEL_BAJO) return 'hambre'
  if (p.carino < PERRITA.NIVEL_BAJO || p.energia < PERRITA.NIVEL_BAJO) return 'triste'
  if (extranaElEstudio(estado, ahora)) return 'triste'
  return 'contenta'
}

// Mimos: suben el cariño. Dormida no los siente (no se despierta por tocarla).
export function darMimos(estado, cantidad, ahora = Date.now()) {
  const p = avanzarTiempo(estado.perrita, ahora)
  if (p.durmiendo) return { ...estado, perrita: p }
  return {
    ...estado,
    perrita: { ...p, carino: limitar(p.carino + cantidad), ultimaActividad: ahora },
  }
}

export function horasDesdeUltimaVisita(perrita, ahora = Date.now()) {
  if (!perrita.ultimaVisita) return 0
  return (ahora - new Date(perrita.ultimaVisita).getTime()) / HORA
}

export function registrarVisita(estado, ahora = Date.now()) {
  return { ...estado, perrita: { ...estado.perrita, ultimaVisita: new Date(ahora).toISOString() } }
}
