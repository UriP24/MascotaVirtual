// Simulación pura del minijuego "Atrapá los huesitos". Las posiciones van de 0 a 1 (proporción de
// la pantalla), así no depende del tamaño del celular. `paso` avanza el juego `dt` segundos y
// recibe la función de azar para poder probarlo.

import { JUEGOS } from '../config.js'

const ZONA_ATRAPE_ARRIBA = 0.76 // altura donde Bolti agarra las cosas
const ZONA_ATRAPE_ABAJO = 0.9
const ANCHO_ATRAPE = 0.12 // qué tan lejos del centro de Bolti cuenta como atrapado
const BORDE = 0.08

function mezclar(desde, hasta, progreso) {
  return desde + (hasta - desde) * progreso
}

const PROGRESO_ANTES_DEL_TURBO = 0.25

// Qué tan difícil está (de 0 a 1): sube despacio al principio y rápido en los últimos segundos
export function progresoDificultad(t) {
  const total = JUEGOS.HUESITOS_DURACION_SEGUNDOS
  const inicioTurbo = total - JUEGOS.HUESITOS_TURBO_SEGUNDOS_FINALES
  if (t < inicioTurbo) return PROGRESO_ANTES_DEL_TURBO * (t / inicioTurbo)
  return Math.min(1, PROGRESO_ANTES_DEL_TURBO + (1 - PROGRESO_ANTES_DEL_TURBO) * ((t - inicioTurbo) / (total - inicioTurbo)))
}

export function enTurbo(juego) {
  return juego.t >= JUEGOS.HUESITOS_DURACION_SEGUNDOS - JUEGOS.HUESITOS_TURBO_SEGUNDOS_FINALES
}

export function crearJuego() {
  return {
    t: 0,
    items: [], // { id, tipo: 'hueso' | 'dorado' | 'chocolate', x, y, vy }
    boltiX: 0.5,
    huesos: 0, // cuántas cosas ricas atrapó
    monedas: 0,
    vidas: JUEGOS.HUESITOS_VIDAS,
    proximaCosa: 0.4,
    siguienteId: 1,
    eventos: [], // lo que pasó en este paso, para efectos en pantalla
    terminado: false,
  }
}

export function moverBolti(juego, x) {
  return { ...juego, boltiX: Math.max(BORDE, Math.min(1 - BORDE, x)) }
}

function elegirTipo(azar, progreso) {
  const r = azar()
  const probChocolate = mezclar(JUEGOS.HUESITOS_PROB_CHOCOLATE_INICIO, JUEGOS.HUESITOS_PROB_CHOCOLATE_FIN, progreso)
  if (r < probChocolate) return 'chocolate'
  if (r < probChocolate + JUEGOS.HUESITOS_PROB_DORADO) return 'dorado'
  return 'hueso'
}

export function paso(juego, dt, azar = Math.random) {
  if (juego.terminado) return juego
  const t = juego.t + dt
  const progreso = progresoDificultad(t)
  let { proximaCosa, siguienteId, monedas, huesos, vidas } = juego
  const eventos = []

  // Aparecen cosas arriba
  let items = juego.items
  if (t >= proximaCosa) {
    const nueva = {
      id: siguienteId++,
      tipo: elegirTipo(azar, progreso),
      x: BORDE + azar() * (1 - 2 * BORDE),
      y: -0.05,
      vy: mezclar(JUEGOS.HUESITOS_VELOCIDAD_INICIO, JUEGOS.HUESITOS_VELOCIDAD_FIN, progreso),
    }
    items = [...items, nueva]
    proximaCosa = t + mezclar(JUEGOS.HUESITOS_INTERVALO_INICIO, JUEGOS.HUESITOS_INTERVALO_FIN, progreso)
  }

  // Caen, y Bolti agarra lo que llega a su boca
  const quedan = []
  for (const item of items) {
    const y = item.y + item.vy * dt
    const enLaBoca = y >= ZONA_ATRAPE_ARRIBA && y <= ZONA_ATRAPE_ABAJO && Math.abs(item.x - juego.boltiX) < ANCHO_ATRAPE
    if (enLaBoca) {
      if (item.tipo === 'chocolate') {
        vidas -= 1
        eventos.push({ tipo: 'chocolate', x: item.x })
      } else {
        const gana = item.tipo === 'dorado' ? JUEGOS.HUESITOS_MONEDAS_DORADO : JUEGOS.HUESITOS_MONEDAS_HUESO
        monedas = Math.min(JUEGOS.MONEDAS_MAXIMAS_POR_PARTIDA, monedas + gana)
        huesos += 1
        eventos.push({ tipo: item.tipo, x: item.x, gana })
      }
    } else if (y < 1.05) {
      quedan.push({ ...item, y })
    }
  }

  const terminado = t >= JUEGOS.HUESITOS_DURACION_SEGUNDOS || vidas <= 0
  return { ...juego, t, items: quedan, monedas, huesos, vidas, proximaCosa, siguienteId, eventos, terminado }
}

export function segundosRestantes(juego) {
  return Math.max(0, Math.ceil(JUEGOS.HUESITOS_DURACION_SEGUNDOS - juego.t))
}
