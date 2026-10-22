// Todos los números de la economía viven acá.
// Son valores de prototipo: cambialos libremente, el resto del código los lee de este archivo.

export const ECONOMIA = {
  // Monedas que da completar una tarea (las tareas no dan puntos: así inventar tareas no rompe
  // la economía). Solo las primeras TAREAS_CON_RECOMPENSA_POR_DIA de cada día dan monedas.
  MONEDAS_TAREA_SIMPLE: 5,
  MONEDAS_TAREA_GRANDE: 10,
  TAREAS_CON_RECOMPENSA_POR_DIA: 5,

  // Estudio: cada bloque completo de minutos da puntos
  MINUTOS_POR_BLOQUE_ESTUDIO: 30,
  PUNTOS_POR_BLOQUE_ESTUDIO: 1,

  // Conversión de monedas a puntos, con tope diario
  MONEDAS_POR_PUNTO: 100,
  PUNTOS_CONVERTIBLES_POR_DIA: 1,

  // Precio de los canjes: 1 punto equivale a esta cantidad de pesos de un plan real
  PESOS_POR_PUNTO: 500,

  // Cuántos canjes se pueden hacer por mes calendario (se renueva el día 1)
  CANJES_POR_MES: 1,

  // Monedas con las que arranca la app (para poder comprarle comida desde el primer día)
  MONEDAS_DE_BIENVENIDA: 30,
}

export const ESTUDIO = {
  // Hay que llegar a este mínimo para poder completar una tarea de estudio
  MINUTOS_MINIMOS: 30,
  // Tope de estudio por día, sumando todas las tareas de estudio
  MINUTOS_MAXIMOS_POR_DIA: 240,
  // Días con tarea de estudio obligatoria (0 = domingo, 1 = lunes … 6 = sábado)
  DIAS_OBLIGATORIOS: [1, 2, 3, 4, 5],
  // Bolti pregunta "¿Seguís estudiando?" cada tanto (al azar entre estos minutos).
  // Poné CHEQUEO_MINUTOS_MIN en 0 para desactivarlo.
  CHEQUEO_MINUTOS_MIN: 20,
  CHEQUEO_MINUTOS_MAX: 30,
  // Si no responde en este tiempo, se pausa y no cuenta desde que Bolti preguntó
  CHEQUEO_MINUTOS_PARA_RESPONDER: 3,
}

export const PERRITA = {
  // Las tres necesidades (panza, energía, cariño) van de 0 a este máximo. Nunca se enferma ni muere:
  // con valores bajos solo se pone triste o con hambre.
  NECESIDAD_MAXIMA: 100,
  SACIEDAD_INICIAL: 80,
  ENERGIA_INICIAL: 80,
  CARINO_INICIAL: 70,
  // Debajo de este nivel se nota (con hambre, triste, cansada)
  NIVEL_BAJO: 30,

  // Cuánto baja cada necesidad por hora (con reloj real, aunque la app esté cerrada)
  SACIEDAD_BAJA_POR_HORA: 4, // de llena a vacía en ~24 h; "con hambre" a las ~12 h
  CARINO_BAJA_POR_HORA: 4, // ~1 día sin mimos
  ENERGIA_BAJA_POR_HORA: 4, // despierta
  ENERGIA_SUBE_POR_HORA_DURMIENDO: 12.5, // de 0 a 100 en 8 h

  // Sueño (horas en formato 24 h)
  HORA_PUEDE_DORMIR: 22, // desde esta hora se le puede apagar la luz
  HORA_SE_DUERME_SOLA: 0, // a medianoche se duerme sola aunque la luz siga prendida
  HORA_SE_DESPIERTA: 10, // se despierta sola
  ENERGIA_PARA_SIESTA: 20, // con menos energía puede dormir siesta a cualquier hora
  SIESTA_HASTA_ENERGIA: 80, // la siesta termina sola cuando recupera esta energía

  // Con la panza en este valor o más, está llena y no quiere comer
  SACIEDAD_LLENA: 95,

  // Cariño que gana cuando Mari completa una tarea o una sesión de estudio (Bolti está orgullosa)
  CARINO_POR_LOGRO: 5,
}

// Comida: se compra con monedas, va al inventario y se le da arrastrándola a la boca.
// precio null = no se vende (regalo).
export const COMIDAS = [
  { id: 'croquetas', nombre: 'Plato de croquetas', emoji: '🥣', precio: 5, saciedad: 15, carino: 0 },
  { id: 'galletita', nombre: 'Galletita de perro', emoji: '🍪', precio: 3, saciedad: 5, carino: 3 },
  { id: 'queso', nombre: 'Pedacito de queso', emoji: '🧀', precio: 4, saciedad: 5, carino: 5 },
  { id: 'patita', nombre: 'Patita de pollo', emoji: '🍗', precio: 10, saciedad: 20, carino: 2 },
  { id: 'carne', nombre: 'Carnecita con hueso', emoji: '🍖', precio: 15, saciedad: 30, carino: 5 },
  { id: 'asado', nombre: 'Asadito', emoji: '🥩', precio: 25, saciedad: 50, carino: 10 },
  // Se regala una el día del cumple (28/10)
  { id: 'torta', nombre: 'Torta de cumple', emoji: '🎂', precio: null, saciedad: 100, carino: 20 },
]
export const FECHA_REGALO_TORTA = '10-28' // MM-DD

export const JUEGOS = {
  ENERGIA_POR_PARTIDA: 10,
  ENERGIA_MINIMA_PARA_JUGAR: 10,
  CARINO_POR_PARTIDA: 8,
  // Minijuego "Atrapá los huesitos"
  HUESITOS_DURACION_SEGUNDOS: 45,
  HUESITOS_MONEDAS_POR_HUESITO: 1,
}

// Planes para canjear. El precio en puntos se calcula con precioEnPuntos() (pesos / PESOS_POR_PUNTO).
export const PLANES = [
  {
    id: 'comer-afuera',
    nombre: 'Salir a comer',
    emoji: '🍝',
    costoPesos: 40000,
    descripcion: 'Elegís el lugar y pedís lo que quieras, invito yo',
  },
  {
    id: 'dia-de-parque',
    nombre: 'Día de parque',
    emoji: '🌳',
    costoPesos: 10000,
    descripcion: 'Mate, facturas y una tarde al sol en el parque que elijas',
  },
  {
    id: 'masaje',
    nombre: 'Una hora de masaje',
    emoji: '💆',
    costoPesos: 15000,
    descripcion: 'Una hora entera de masajes, sin apuro y con aceite',
  },
  {
    id: 'cine',
    nombre: 'Ir al cine',
    emoji: '🎬',
    costoPesos: 20000,
    descripcion: 'La película que vos elijas, con pochoclos incluidos',
  },
  {
    id: 'helado',
    nombre: 'Salida por helado',
    emoji: '🍦',
    costoPesos: 8000,
    descripcion: 'Un helado del tamaño que quieras, en tu heladería favorita',
  },
  {
    id: 'cena-casera',
    nombre: 'Cena casera',
    emoji: '🍲',
    costoPesos: 12000,
    descripcion: 'Te cocino lo que me pidas y después lavo todo yo',
  },
  {
    id: 'cafe',
    nombre: 'Salir a tomar un café',
    emoji: '☕',
    costoPesos: 10000,
    descripcion: 'Un cafecito con algo rico, en el lugar que elijas',
  },
]

export function precioEnPuntos(plan) {
  return Math.ceil(plan.costoPesos / ECONOMIA.PESOS_POR_PUNTO)
}
