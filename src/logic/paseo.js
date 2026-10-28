// Simulación pura del minijuego "Paseo con Bolti". Bolti corre en el lugar (x fija) y las cosas
// vienen desde la derecha. Las medidas son en "anchos de pantalla": x de 0 a 1, y = altura sobre
// el piso. `paso` avanza el juego `dt` segundos y recibe la función de azar para poder probarlo.

import { JUEGOS } from '../config.js'

export const X_BOLTI = 0.25

// Cajas de choque de Bolti, medidas sobre su dibujo (un poco más chicas, para ser justas):
// el cuerpo con las patas, y la cabeza que va adelante y más arriba. Relativas a su x y a su altura.
const CAJAS_BOLTI = [
  { x1: -0.05, x2: 0.06, y1: 0, y2: 0.11 }, // cuerpo y patas
  { x1: 0.07, x2: 0.13, y1: 0.09, y2: 0.16 }, // cabeza
]
const DISTANCIA_PATADA = 0.18 // a esta distancia patea: la pata de atrás llega justo adelante de Bolti
export const DISTANCIA_AVISO = 0.45 // a esta distancia levanta la pata: si salta ahí, la esquiva
const ALTURA_PARA_ESQUIVAR = 0.05 // si en el momento de la patada está más alta que esto, la esquiva

// Caja de choque de cada cosa (ancho y alto), sacada de su dibujo y un poco más chica que él
export const MEDIDAS = {
  charco: { ancho: 0.15, alto: 0.03 },
  gato: { ancho: 0.09, alto: 0.1 },
  bici: { ancho: 0.16, alto: 0.11 },
  hueso: { ancho: 0.1, alto: 0.1 }, // la medalla entera
  dorado: { ancho: 0.1, alto: 0.1 },
  caballo: { ancho: 0.32, alto: 0.45 },
}

export function cajasDeBolti(y) {
  return CAJAS_BOLTI.map((c) => ({ x1: X_BOLTI + c.x1, x2: X_BOLTI + c.x2, y1: y + c.y1, y2: y + c.y2 }))
}

// La caja de una cosa: centrada en su x y apoyada en su altura
export function cajaDeCosa(item, x = item.x) {
  const m = MEDIDAS[item.tipo]
  return { x1: x - m.ancho / 2, x2: x + m.ancho / 2, y1: item.altura, y2: item.altura + m.alto }
}

function seTocan(a, b) {
  return a.x1 < b.x2 && b.x1 < a.x2 && a.y1 < b.y2 && b.y1 < a.y2
}

function tocaABolti(caja, y) {
  return cajasDeBolti(y).some((c) => seTocan(c, caja))
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
    invencibleHasta: 0,
    esquivas: 0,
    siguienteId: 1,
    eventos: [],
    terminado: false,
  }
}

export function enElPiso(juego) {
  return juego.y <= 0 && juego.vy <= 0
}

export function invencible(juego) {
  return juego.t < juego.invencibleHasta
}

// Tocar la pantalla: salta (solo si está en el piso)
// La física del salto según la velocidad del camino: siempre sube lo mismo y, en el aire, avanza
// siempre la misma distancia (más lento el juego → más tiempo en el aire)
export function fisicaDelSalto(t) {
  const duracion = JUEGOS.PASEO_SALTO_DISTANCIA / JUEGOS.PASEO_ETAPAS[etapa(t)].velocidad
  const altura = JUEGOS.PASEO_SALTO_ALTURA
  return { impulso: (4 * altura) / duracion, gravedad: (8 * altura) / duracion ** 2 }
}

export function saltar(juego) {
  if (juego.terminado || !enElPiso(juego)) return juego
  const { impulso, gravedad } = fisicaDelSalto(juego.t)
  return { ...juego, vy: impulso, gravedad }
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
  let { proximo, siguienteId, puntos, huesos, saltados, vidas, golpeHasta, invencibleHasta, patadas, esquivas, caballoSalio } = juego
  const { caballoEn } = juego
  const eventos = []
  const doble = t < invencibleHasta ? 2 : 1

  // Salto y gravedad
  const gravedad = juego.gravedad ?? fisicaDelSalto(t).gravedad
  let vy = juego.vy - gravedad * dt
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
    const caja = cajaDeCosa(item, x)
    let actualizado = { ...item, x }

    if (item.tipo === 'hueso' || item.tipo === 'dorado') {
      if (tocaABolti(caja, y)) {
        const gana = (item.tipo === 'dorado' ? JUEGOS.PASEO_PUNTOS_DORADO : JUEGOS.PASEO_PUNTOS_HUESO) * doble
        puntos += gana
        huesos += 1
        eventos.push({ tipo: item.tipo, gana })
        continue // se lo comió
      }
    } else if (item.tipo === 'caballo') {
      // Avisa levantando la pata; al llegar, patea: si Bolti está saltando la esquiva, si no la patea
      if (!item.preparando && x - X_BOLTI < DISTANCIA_AVISO) actualizado.preparando = true
      if (!item.pateo && x - X_BOLTI < DISTANCIA_PATADA) {
        actualizado.pateo = true
        if (y > ALTURA_PARA_ESQUIVAR || t < invencibleHasta) {
          esquivas += 1
          const gana = JUEGOS.PASEO_PUNTOS_ESQUIVA * doble
          puntos += gana
          eventos.push({ tipo: 'esquiva', gana })
        } else {
          patadas += 1
          invencibleHasta = t + JUEGOS.PASEO_INVENCIBLE_SEGUNDOS
          eventos.push({ tipo: 'patada' })
        }
      }
    } else if (!item.pasado && !item.chocado) {
      const protegida = t < golpeHasta || t < invencibleHasta || item.rebote
      const cayendoEncima = vy < 0 && y >= MEDIDAS[item.tipo].alto * 0.4
      if (tocaABolti(caja, y) && !protegida && cayendoEncima) {
        // Cae encima: rebota y sigue, sin lastimarse
        actualizado.rebote = true
        vy = fisicaDelSalto(t).impulso * JUEGOS.PASEO_REBOTE
        eventos.push({ tipo: 'rebote' })
      } else if (tocaABolti(caja, y) && !protegida) {
        actualizado.chocado = true
        vidas -= 1
        golpeHasta = t + 1
        eventos.push({ tipo: 'choque' })
      } else if (caja.x2 < X_BOLTI + CAJAS_BOLTI[0].x1) {
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
    invencibleHasta,
    patadas,
    esquivas,
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
