// Único módulo que toca localStorage. Todo acceso pasa por acá, envuelto en try/catch,
// porque localStorage puede fallar (modo incógnito, almacenamiento lleno, datos corruptos).

import { COMIDAS, ECONOMIA, PERRITA, REGLAS_SECRETOS } from './config.js'
import { fechaLocal } from './logic/fechas.js'
import { esHorarioDeDormir } from './logic/bolti.js'

const CLAVE = 'patitas:estado'
const VERSION_ACTUAL = 9

export function crearEstadoInicial() {
  const ahora = new Date().toISOString()
  return {
    version: VERSION_ACTUAL,
    monedas: ECONOMIA.MONEDAS_DE_BIENVENIDA,
    puntos: ECONOMIA.PUNTOS_DE_BIENVENIDA,
    // Historial de todo lo ganado. Nunca baja: los puntos ganados no se restan ni vencen.
    puntosGanadosTotal: ECONOMIA.PUNTOS_DE_BIENVENIDA,
    // { id, texto, tipo: 'tarea' | 'estudio', fecha, hecha, obligatoria, estudio? } (las viejas 'simple'/'grande' valen como 'tarea')
    tareas: [],
    // Minutos de estudio acreditados por día: { 'AAAA-MM-DD': minutos }.
    // Sirve para el tope diario y para que Bolti se ponga triste si un día de semana no estudió.
    historialEstudio: {},
    // Cuántas tareas dieron monedas hoy (tope diario). No baja si se borran tareas.
    recompensasTareas: { fecha: null, cantidad: 0 },
    // Cuántos puntos se cambiaron por monedas hoy (tope diario)
    conversiones: { fecha: null, cantidad: 0 },
    // Mejor puntaje de cada minijuego: { huesitos: 1240, memoria: 860 }
    records: {},
    // Último día en que se creó la tarea de estudio obligatoria (para no crearla dos veces)
    ultimoDiaObligatorio: null,
    // { id, planId, costo, fecha (ISO), cumplido }. La fecha sirve para el límite mensual.
    cupones: [],
    // Cuántas unidades tiene de cada comida: { croquetas: 0, galletita: 0, … }
    inventario: Object.fromEntries(COMIDAS.map((c) => [c.id, 0])),
    // Gacha de ropa: contadores de las garantías y tiradas gratis que le regalaron
    gacha: { tiradasDesdeUltra: 0, tiradasDesdeRara: 0, tiradasGratis: 0, tiradasTotales: 0 },
    // Piezas que dan las prendas repetidas, por rareza (se canjean por prendas que no tenga)
    piezas: { comun: 0, rara: 0, epica: 0, ultra: 0 },
    // Ropa que tiene (ids de PRENDAS) y la que tiene puesta por zona: { cabeza: 'corona', … }
    ropa: { tiene: [], puesta: {} },
    // Ya vio la bienvenida de la primera vez (el mensaje de Uri)
    bienvenidaVista: false,
    // Ya le preguntamos si quería ver el tutorial (se puede volver a ver desde Configuración)
    tutorialPreguntado: false,
    // Año en que abrió el regalo de cumpleaños (el 28/10 de cada año aparece uno nuevo)
    regaloCumpleAbierto: null,
    // Recordatorios de estudio de hoy (tope por día) y la última vez que dijo que la extrañó
    recordatoriosEstudio: { fecha: null, cantidad: 0, ultimo: null, ultimoExtrano: null },
    // Secretos descubiertos: { estornudo: '2026-11-02T…' } (fecha en que lo descubrió)
    secretos: {},
    // Medias que trajo Bolti (con 2 completa el par) y si hay una esperando en la habitación
    medias: 0,
    mediaEsperando: false,
    ultimoSorteoMedia: null, // día del último sorteo de la media (una vez por día)
    ultimoPure: null, // día en que comió el puré por última vez (aparece una vez por semana)
    // Estrella fugaz: chance de esta noche, última noche sorteada y si esta noche pasa una
    estrella: { chance: REGLAS_SECRETOS.ESTRELLA_CHANCE_INICIAL, ultimaNoche: null, estaNoche: false },
    // Día en que vio por última vez la cartita de cada fecha especial: { aniversario: '2027-03-24' }
    cartasVistas: {},
    // Día en que se empezó a usar la app (para no ponerla triste por días anteriores)
    instaladaEn: fechaLocal(),
    // Sin salud ni vida: Bolti nunca se enferma ni muere, como mucho se pone triste.
    perrita: {
      saciedad: PERRITA.SACIEDAD_INICIAL,
      energia: PERRITA.ENERGIA_INICIAL,
      carino: PERRITA.CARINO_INICIAL,
      durmiendo: esHorarioDeDormir(new Date()), // si la abre por primera vez de noche, ya duerme
      actualizadaEn: Date.now(), // última vez que se calcularon las necesidades (ms)
      ultimaActividad: null, // último mimo (ms), para volver a dormirse de madrugada
      ultimaVisita: ahora, // para saludarla si hace mucho que no entra
      festejo: null, // logros de Mari que Bolti todavía no festejó: { tareas, estudio }
      siesta: false, // durmiendo una siesta de día (termina sola al recuperar energía)
      forzado: null, // solo modo prueba: { durmiendo, hasta (ms) } ignora el horario de sueño
    },
  }
}

// Completa con valores por defecto lo que falte (por ejemplo, campos nuevos de una versión futura).
function completarEstado(datos) {
  const inicial = crearEstadoInicial()
  return {
    ...inicial,
    ...datos,
    perrita: { ...inicial.perrita, ...datos.perrita },
    inventario: { ...inicial.inventario, ...datos.inventario },
    records: { ...inicial.records, ...datos.records },
    gacha: { ...inicial.gacha, ...datos.gacha },
    piezas: { ...inicial.piezas, ...datos.piezas },
    ropa: { ...inicial.ropa, ...datos.ropa },
    secretos: { ...inicial.secretos, ...datos.secretos },
    cartasVistas: { ...inicial.cartasVistas, ...datos.cartasVistas },
    recordatoriosEstudio: { ...inicial.recordatoriosEstudio, ...datos.recordatoriosEstudio },
    estrella: { ...inicial.estrella, ...datos.estrella },
    version: VERSION_ACTUAL,
  }
}

function esEstadoValido(datos) {
  return (
    datos !== null &&
    typeof datos === 'object' &&
    typeof datos.monedas === 'number' &&
    typeof datos.puntos === 'number' &&
    Array.isArray(datos.tareas) &&
    Array.isArray(datos.cupones)
  )
}

// ── Respaldo automático ─────────────────────────────────────────────────
// Una vez por día se guarda aparte una copia del progreso (se guardan las últimas 7). Si al abrir
// la app el guardado principal está roto, se usa sola la última copia buena.
const CLAVE_COPIAS = 'patitas:copias'
const COPIAS_A_GUARDAR = 7

function leerCopias() {
  try {
    const copias = JSON.parse(localStorage.getItem(CLAVE_COPIAS))
    return Array.isArray(copias) ? copias : []
  } catch {
    return []
  }
}

// Si hoy todavía no se hizo, guarda la copia del día (y borra las más viejas)
function guardarCopiaDelDia(estado, ahora) {
  try {
    const hoy = fechaLocal(ahora)
    const copias = leerCopias()
    if (copias[0]?.fecha === hoy) return
    const nuevas = [{ fecha: hoy, datos: estado }, ...copias].slice(0, COPIAS_A_GUARDAR)
    localStorage.setItem(CLAVE_COPIAS, JSON.stringify(nuevas))
  } catch (error) {
    console.error('No se pudo guardar la copia del día', error)
  }
}

// La copia más nueva que esté sana, o null
function ultimaCopiaBuena() {
  const copia = leerCopias().find((c) => esEstadoValido(c?.datos))
  return copia ? completarEstado(copia.datos) : null
}

export function cargarEstado() {
  let texto = null
  try {
    texto = localStorage.getItem(CLAVE)
  } catch (error) {
    console.error('No se pudo leer el progreso guardado', error)
    return crearEstadoInicial()
  }
  // Primera vez (o datos borrados): si quedó alguna copia, se recupera de ahí
  if (texto === null) return ultimaCopiaBuena() ?? crearEstadoInicial()
  try {
    const datos = JSON.parse(texto)
    if (esEstadoValido(datos)) return completarEstado(datos)
  } catch (error) {
    console.error('El progreso guardado está roto, se usa la última copia', error)
  }
  return ultimaCopiaBuena() ?? crearEstadoInicial()
}

// Guarda el progreso (y, una vez por día, la copia aparte). Devuelve false si no se pudo.
export function guardarEstado(estado, ahora = new Date()) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(estado))
  } catch (error) {
    console.error('No se pudo guardar el progreso', error)
    return false
  }
  guardarCopiaDelDia(estado, ahora)
  return true
}

// Le pide al navegador que nunca borre los datos de la app para liberar espacio.
// Con la app instalada, Chrome casi siempre lo acepta sin preguntar.
export async function pedirQueNoSeBorren() {
  try {
    if (!navigator.storage?.persist) return false
    if (await navigator.storage.persisted()) return true
    return await navigator.storage.persist()
  } catch {
    return false
  }
}

// Devuelve el progreso como texto JSON, para guardarlo como respaldo.
export function exportarProgreso(estado) {
  return JSON.stringify(estado, null, 2)
}

// Recibe un texto JSON exportado antes. Devuelve el estado listo para usar,
// o null si el texto no es un progreso válido.
export function importarProgreso(texto) {
  try {
    const datos = JSON.parse(texto)
    if (!esEstadoValido(datos)) return null
    return completarEstado(datos)
  } catch {
    return null
  }
}
