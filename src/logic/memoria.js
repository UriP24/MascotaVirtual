// Simulación pura del minijuego "Memoria de Bolti". El límite es por tiempo: arranca con
// MEMORIA_TIEMPO_INICIAL segundos y cada nivel superado suma tiempo. Los niveles tienen cada vez
// más pares y menos "vistazo" al empezar.

import { JUEGOS } from '../config.js'

export function configNivel(nivel) {
  const niveles = JUEGOS.MEMORIA_NIVELES
  return niveles[Math.min(nivel, niveles.length) - 1]
}

function mezclar(lista, azar) {
  const copia = [...lista]
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1))
    ;[copia[i], copia[j]] = [copia[j], copia[i]]
  }
  return copia
}

function crearCartas(nivel, azar) {
  const { pares } = configNivel(nivel)
  const simbolos = mezclar(JUEGOS.MEMORIA_SIMBOLOS, azar).slice(0, pares)
  return mezclar([...simbolos, ...simbolos], azar).map((simbolo, i) => ({ id: `${nivel}-${i}`, simbolo, estado: 'oculta' }))
}

export function crearPartida(azar = Math.random) {
  return {
    nivel: 1,
    cartas: crearCartas(1, azar),
    seleccion: [], // índices de las cartas dadas vuelta (máximo 2)
    monedas: 0,
    pares: 0,
    nivelesSuperados: 0,
    tiempo: JUEGOS.MEMORIA_TIEMPO_INICIAL,
    vistazo: configNivel(1).vistazo, // mientras dura, se ven todas y el reloj no corre
    esperando: 0, // mientras dura, se ven las dos que no coinciden
    evento: null, // 'par' | 'error' | 'nivel' (para efectos en pantalla)
    terminado: false,
  }
}

function sumarMonedas(monedas, cuanto) {
  return Math.min(JUEGOS.MONEDAS_MAXIMAS_POR_PARTIDA, monedas + cuanto)
}

export function tocarCarta(partida, indice, azar = Math.random) {
  const p = partida
  const carta = p.cartas[indice]
  if (p.terminado || p.vistazo > 0 || p.esperando > 0 || !carta || carta.estado !== 'oculta') return p

  const cartas = p.cartas.map((c, i) => (i === indice ? { ...c, estado: 'visible' } : c))
  const seleccion = [...p.seleccion, indice]
  if (seleccion.length < 2) return { ...p, cartas, seleccion, evento: null }

  const [a, b] = seleccion
  if (cartas[a].simbolo !== cartas[b].simbolo) {
    return { ...p, cartas, seleccion, esperando: JUEGOS.MEMORIA_ESPERA_ERROR, evento: 'error' }
  }

  // ¡Par!
  const conPar = cartas.map((c, i) => (i === a || i === b ? { ...c, estado: 'encontrada' } : c))
  const monedas = sumarMonedas(p.monedas, JUEGOS.MEMORIA_MONEDAS_POR_PAR)
  if (!conPar.every((c) => c.estado === 'encontrada')) {
    return { ...p, cartas: conPar, seleccion: [], monedas, pares: p.pares + 1, evento: 'par' }
  }

  // Nivel superado: más tiempo y el siguiente nivel
  const nivel = p.nivel + 1
  return {
    ...p,
    nivel,
    cartas: crearCartas(nivel, azar),
    seleccion: [],
    monedas: sumarMonedas(monedas, JUEGOS.MEMORIA_MONEDAS_POR_NIVEL),
    pares: p.pares + 1,
    nivelesSuperados: p.nivelesSuperados + 1,
    tiempo: p.tiempo + configNivel(p.nivel).bonusTiempo,
    vistazo: configNivel(nivel).vistazo,
    evento: 'nivel',
  }
}

export function avanzar(partida, dt) {
  const p = partida
  if (p.terminado) return p
  if (p.vistazo > 0) return { ...p, vistazo: Math.max(0, p.vistazo - dt) }

  const tiempo = Math.max(0, p.tiempo - dt)
  let { cartas, seleccion, esperando } = p
  if (esperando > 0) {
    esperando = Math.max(0, esperando - dt)
    if (esperando === 0) {
      cartas = cartas.map((c, i) => (seleccion.includes(i) ? { ...c, estado: 'oculta' } : c))
      seleccion = []
    }
  }
  return { ...p, tiempo, cartas, seleccion, esperando, terminado: tiempo === 0 }
}

// ¿Esta carta se ve? (dada vuelta, encontrada, o durante el vistazo)
export function seVe(partida, carta) {
  return partida.vistazo > 0 || carta.estado !== 'oculta'
}
