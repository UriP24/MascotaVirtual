// Simulación pura del minijuego "Paseo con Bolti". Bolti corre en el lugar (x fija) y las cosas
// vienen desde la derecha. Las medidas son en "anchos de pantalla": x de 0 a 1, y = altura sobre
// el piso. `paso` avanza el juego `dt` segundos y recibe la función de azar para poder probarlo.

import { JUEGOS } from '../config.js'

export const X_BOLTI = 0.25
const MEDIO_ANCHO_BOLTI = 0.05 // la "caja" con la que choca (más chica que el dibujo, para ser justo)
const DISTANCIA_PATADA = 0.12 // a esta distancia del caballo, la patea

// Medidas de cada cosa: ancho y alto (en anchos de pantalla)
export const MEDIDAS = {
  charco: { ancho: 0.16, alto: 0.03 },
  gato: { ancho: 0.1, alto: 0.09 },
  bici: { ancho: 0.17, alto: 0.13 },
  hueso: { ancho: 0.06, alto: 0.04 },
  dorado: { ancho: 0.06, alto: 0.04 },
  caballo: { ancho: 0.32, alto: 0.45 },
}
const OBSTACULOS = ['charco', 'gato', 'bici']

export function etapa(t) {
  let indice = 0
  JUEGOS.PASEO_ETAPAS.forEach((e, i) => {
    if (t >= e.desde) indice = i
  })
  return indice
}

// `caballoSeguro`: el modo prueba puede pedir que aparezca sí o sí
export function crearJuego(azar = Math.random, caballoSeguro = false) {
  const hayCaballo = caballoSeguro || azar() < JUEGOS.PASEO_PROB_CABALLO
  const momento = JUEGOS.PASEO_CABALLO_DESDE + azar() * (JUEGOS.PASEO_CABALLO_HASTA - JUEGOS.PASEO_CABALLO_DESDE)
  return {
    t: 0,
    y: 0, // altura de Bolti sobre el piso
    vy: 0,
    items: [], // { id, tipo, x, altura (para huesos en el aire), pasado, chocado }
    vidas: JUEGOS.PASEO_VIDAS,
    puntos: 0,
    huesos: 0,
    saltados: 0,
    patadas: 0,
    proximo: 1.2,
    caballoEn: hayCaballo ? (caballoSeguro ? 6 : momento) : null, // cuándo aparece (null: este paseo no)
    caballoSalio: false,
    golpeHasta: 0, // después de chocar, un ratito sin poder volver a chocar (titila)
    vueloHasta: 0, // volando por la patada del caballo
    invencibleHasta: 0,
    siguienteId: 1,
    eventos: [],
    terminado: false,
  }
}

export function enElPiso(juego) {
  return juego.y <= 0 && juego.vy <= 0
}

export function volando(juego) {
  return juego.t < juego.vueloHasta
}

export function invencible(juego) {
  return juego.t < juego.invencibleHasta
}

// Tocar la pantalla: salta (solo si está en el piso y no la acaba de patear el caballo)
export function saltar(juego) {
  if (juego.terminado || !enElPiso(juego) || volando(juego)) return juego
  return { ...juego, vy: JUEGOS.PASEO_SALTO }
}

function crearTanda(juego, azar) {
  const nuevos = []
  let id = juego.siguienteId
  if (azar() < 0.65) {
    const tipo = OBSTACULOS[Math.floor(azar() * OBSTACULOS.length)]
    nuevos.push({ id: id++, tipo, x: 1.15, altura: 0 })
    // A veces un hueso arriba del obstáculo, para agarrarlo saltando
    if (azar() < 0.35) nuevos.push({ id: id++, tipo: hueso(azar), x: 1.15, altura: 0.24 })
  } else {
    // Una fila de huesitos en el piso o en el aire
    const altura = azar() < 0.5 ? 0.02 : 0.22
    for (let i = 0; i < 3; i++) nuevos.push({ id: id++, tipo: hueso(azar), x: 1.12 + i * 0.09, altura })
  }
  return { nuevos, siguienteId: id }
}

function hueso(azar) {
  return azar() < JUEGOS.PASEO_PROB_DORADO ? 'dorado' : 'hueso'
}

export function paso(juego, dt, azar = Math.random) {
  if (juego.terminado) return juego
  const t = juego.t + dt
  const config = JUEGOS.PASEO_ETAPAS[etapa(t)]
  let { proximo, siguienteId, puntos, huesos, saltados, vidas, golpeHasta, vueloHasta, invencibleHasta, patadas, caballoSalio } = juego
  const { caballoEn } = juego
  const eventos = []
  const doble = t < invencibleHasta ? 2 : 1

  // Salto y gravedad (la patada del caballo la hace volar más alto)
  let vy = juego.vy - JUEGOS.PASEO_GRAVEDAD * dt
  let y = juego.y + vy * dt
  if (y <= 0) {
    y = 0
    vy = 0
  }

  // Aparecen cosas nuevas por la derecha (un rato antes y después del caballo, el camino queda libre)
  let items = juego.items
  const cercaDelCaballo = caballoEn !== null && t >= caballoEn - 1.5 && t < caballoEn + 2.5
  if (t >= proximo && !cercaDelCaballo) {
    const tanda = crearTanda({ siguienteId }, azar)
    items = [...items, ...tanda.nuevos]
    siguienteId = tanda.siguienteId
    proximo = t + config.intervalo
  }
  if (caballoEn !== null && !caballoSalio && t >= caballoEn) {
    items = [...items, { id: siguienteId++, tipo: 'caballo', x: 1.25, altura: 0 }]
    caballoSalio = true
  }

  // Todo avanza hacia la izquierda; se ve qué agarra, qué salta y con qué choca
  const quedan = []
  for (const item of items) {
    const x = item.x - config.velocidad * dt
    const m = MEDIDAS[item.tipo]
    const cerca = Math.abs(x - X_BOLTI) < m.ancho / 2 + MEDIO_ANCHO_BOLTI
    let actualizado = { ...item, x }

    if (item.tipo === 'hueso' || item.tipo === 'dorado') {
      if (cerca && Math.abs(y - item.altura) < 0.1) {
        const gana = (item.tipo === 'dorado' ? JUEGOS.PASEO_PUNTOS_DORADO : JUEGOS.PASEO_PUNTOS_HUESO) * doble
        puntos += gana
        huesos += 1
        eventos.push({ tipo: item.tipo, gana })
        continue // se lo comió
      }
    } else if (item.tipo === 'caballo') {
      if (!item.pateo && x - X_BOLTI < DISTANCIA_PATADA) {
        actualizado.pateo = true
        patadas += 1
        vy = 2.6 // ¡vuela!
        y = Math.max(y, 0.01)
        vueloHasta = t + JUEGOS.PASEO_VUELO_SEGUNDOS
        invencibleHasta = vueloHasta + JUEGOS.PASEO_INVENCIBLE_SEGUNDOS
        eventos.push({ tipo: 'patada' })
      }
    } else if (!item.pasado && !item.chocado) {
      const protegida = t < golpeHasta || t < vueloHasta || t < invencibleHasta
      if (cerca && y < m.alto && !protegida) {
        actualizado.chocado = true
        vidas -= 1
        golpeHasta = t + 1
        eventos.push({ tipo: 'choque' })
      } else if (x + m.ancho / 2 < X_BOLTI - MEDIO_ANCHO_BOLTI) {
        actualizado.pasado = true
        saltados += 1
        puntos += JUEGOS.PASEO_PUNTOS_SALTO * doble
        eventos.push({ tipo: 'salto', gana: JUEGOS.PASEO_PUNTOS_SALTO * doble })
      }
    }
    if (x > -0.4) quedan.push(actualizado)
  }

  // Puntos por caminar
  puntos += JUEGOS.PASEO_PUNTOS_POR_SEGUNDO * dt * doble

  const terminado = t >= JUEGOS.PASEO_DURACION_SEGUNDOS || vidas <= 0
  return {
    ...juego,
    t,
    y,
    vy,
    items: quedan,
    puntos,
    huesos,
    saltados,
    vidas,
    proximo,
    siguienteId,
    golpeHasta,
    vueloHasta,
    invencibleHasta,
    patadas,
    caballoSalio,
    eventos,
    terminado,
  }
}

// Puntaje final: lo juntado + 100 por cada corazón que quedó
export function puntajeFinal(juego) {
  return Math.round(juego.puntos) + Math.max(0, juego.vidas) * JUEGOS.PASEO_PUNTOS_POR_VIDA
}

export function segundosRestantes(juego) {
  return Math.max(0, Math.ceil(JUEGOS.PASEO_DURACION_SEGUNDOS - juego.t))
}

// ¿La tarea habla de pasear a Bolti? (sin importar mayúsculas ni tildes)
export function esTareaDePaseo(texto) {
  const limpio = texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
  return limpio.includes('pase') && limpio.includes('bolti')
}
