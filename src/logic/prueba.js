// Atajos del modo prueba (solo para Uri, para no esperar los tiempos reales).
// Se activa abriendo la app con la palabra secreta al final del link (?palabra), o con
// `npm run dev`. No es "?prueba" para que Mari no lo adivine y se regale puntos. El repo es
// público, así que la palabra no está escrita: solo su "huella" (un número que sale de ella y del
// que no se puede volver a la palabra). Uri la tiene anotada aparte.

import { crearEstadoInicial } from '../storage.js'
import { COMIDAS, SECRETOS } from '../config.js'
import { fechaLocal } from './fechas.js'
import { actualizarDia } from './tareas.js'
import { actualizarBolti } from './bolti.js'

const MINUTO = 60 * 1000
const HORA = 60 * MINUTO

const HUELLA_MODO_PRUEBA = 1218093212233323

// Huella de un texto (hash cyrb53): siempre da el mismo número para el mismo texto
export function huella(texto) {
  let h1 = 0xdeadbeef
  let h2 = 0x41c6ce57
  for (let i = 0; i < texto.length; i++) {
    const c = texto.charCodeAt(i)
    h1 = Math.imul(h1 ^ c, 2654435761)
    h2 = Math.imul(h2 ^ c, 1597334677)
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909)
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909)
  return 4294967296 * (2097151 & h2) + (h1 >>> 0)
}

export function modoPruebaActivo() {
  if (import.meta.env?.DEV) return true
  return [...new URLSearchParams(window.location.search).keys()].some((clave) => huella(clave) === HUELLA_MODO_PRUEBA)
}

// Suma minutos al cronómetro de la tarea de estudio pendiente (la que está corriendo, o la primera).
export function sumarEstudio(estado, minutos) {
  const pendientes = estado.tareas.filter((t) => t.tipo === 'estudio' && !t.hecha)
  const tarea = pendientes.find((t) => t.estudio.inicioTramo !== null) ?? pendientes[0]
  if (!tarea) return estado
  return {
    ...estado,
    tareas: estado.tareas.map((t) =>
      t.id === tarea.id ? { ...t, estudio: { ...t.estudio, acumuladoMs: t.estudio.acumuladoMs + minutos * MINUTO } } : t,
    ),
  }
}

// Hace como si hubieran pasado unas horas para Bolti (respeta su horario de sueño).
export function adelantarBolti(estado, horas, ahora = Date.now()) {
  const p = estado.perrita
  const atras = horas * HORA
  const corrida = {
    ...p,
    actualizadaEn: p.actualizadaEn - atras,
    ultimaActividad: p.ultimaActividad === null ? null : p.ultimaActividad - atras,
  }
  return actualizarBolti({ ...estado, perrita: corrida }, ahora)
}

const DURACION_FORZADO = 1 * HORA

// Cambia valores de Bolti y la deja despierta (o dormida) 1 hora sin importar el horario,
// para poder tocarla y probar tranquilo aunque sea de noche (o de día).
export function cambiarBolti(estado, cambios, ahora = Date.now()) {
  const durmiendo = cambios.durmiendo ?? false
  return {
    ...estado,
    perrita: {
      ...estado.perrita,
      ...cambios,
      durmiendo,
      actualizadaEn: ahora,
      forzado: { durmiendo, hasta: ahora + DURACION_FORZADO },
    },
  }
}

// Saca el forzado: Bolti vuelve a seguir su horario de sueño.
export function volverAlHorarioNormal(estado, ahora = Date.now()) {
  return actualizarBolti({ ...estado, perrita: { ...estado.perrita, forzado: null, ultimaActividad: null } }, ahora + 1)
}

// Como si la app estuviera instalada hace una semana y ayer no hubiera estudiado.
export function simularQueNoEstudio(estado, ahora = new Date()) {
  const haceUnaSemana = new Date(ahora)
  haceUnaSemana.setDate(haceUnaSemana.getDate() - 8)
  const hoy = fechaLocal(ahora)
  return {
    ...estado,
    instaladaEn: fechaLocal(haceUnaSemana),
    historialEstudio: estado.historialEstudio[hoy] ? { [hoy]: estado.historialEstudio[hoy] } : {},
  }
}

export function sumarMonedas(estado, cantidad) {
  return { ...estado, monedas: estado.monedas + cantidad }
}

export function sumarPuntos(estado, cantidad) {
  return {
    ...estado,
    puntos: estado.puntos + cantidad,
    puntosGanadosTotal: estado.puntosGanadosTotal + cantidad,
  }
}

// Dos unidades de cada comida (incluida la torta, para probarla)
export function llenarBandeja(estado) {
  const inventario = { ...estado.inventario }
  for (const c of COMIDAS) inventario[c.id] = (inventario[c.id] ?? 0) + 2
  return { ...estado, inventario }
}

// Corre todos los cupones 3 meses para atrás: libera todos los planes para volver a probar.
export function liberarCanjes(estado) {
  return {
    ...estado,
    cupones: estado.cupones.map((c) => {
      const fecha = new Date(c.fecha)
      fecha.setMonth(fecha.getMonth() - 3)
      return { ...c, fecha: fecha.toISOString() }
    }),
  }
}

export function borrarCupones(estado) {
  return { ...estado, cupones: [] }
}

// Permite volver a cambiar monedas por puntos hoy
export function liberarCambioDelDia(estado) {
  return { ...estado, conversiones: { fecha: null, cantidad: 0 } }
}

// Gacha: la próxima tirada sale ultra rara (por la garantía de las 30)
export function ultraEnLaProxima(estado) {
  return { ...estado, gacha: { ...estado.gacha, tiradasDesdeUltra: 29 } }
}

// Gacha: saca toda la ropa, las piezas y los contadores
export function vaciarRopa(estado) {
  const inicial = crearEstadoInicial()
  return { ...estado, gacha: inicial.gacha, piezas: inicial.piezas, ropa: inicial.ropa }
}

// Cumple: hace aparecer el regalo aunque no sea 28/10
export function mostrarRegaloDeCumple(estado) {
  return { ...estado, cumpleDePrueba: true }
}

// Le saca a Bolti lo que tenga puesto en la cabeza (el gorrito)
export function sacarGorrito(estado) {
  const { cabeza: _sacada, ...resto } = estado.ropa.puesta
  return { ...estado, ropa: { ...estado.ropa, puesta: resto } }
}

// Secretos: deja un evento que Casa dispara (pasa un gato, trae una media, aparece el puré…)
export function lanzarEvento(estado, tipo) {
  return { ...estado, eventoPrueba: { tipo, id: Date.now() } }
}

// Secretos: los olvida todos (y saca sus premios) para volver a descubrirlos
export function borrarSecretos(estado) {
  const premios = SECRETOS.map((s) => s.premio?.prenda).filter(Boolean)
  const puesta = Object.fromEntries(Object.entries(estado.ropa.puesta).filter(([, id]) => !premios.includes(id)))
  return {
    ...estado,
    secretos: {},
    medias: 0,
    mediaEsperando: false,
    ultimoSorteoMedia: null,
    ultimoPure: null,
    purePrueba: false,
    cartasVistas: {},
    ropa: { tiene: estado.ropa.tiene.filter((id) => !premios.includes(id)), puesta },
  }
}

// Paseo: desbloquea el juego sin anotar la tarea
export function desbloquearPaseo(estado) {
  return { ...estado, secretos: { ...estado.secretos, paseo: estado.secretos.paseo ?? new Date().toISOString() } }
}

// Paseo: el caballo aparece seguro en la próxima partida (para probar INVENCIBLE)
export function caballoEnElProximoPaseo(estado) {
  return { ...estado, caballoSeguro: true }
}

// Paseo: muestra u oculta las cajas de choque (para revisar que coincidan con los dibujos)
export function alternarCajasDelPaseo(estado) {
  return { ...estado, verCajasPaseo: !estado.verCajasPaseo }
}

export function reiniciarTodo() {
  return actualizarDia(crearEstadoInicial())
}
