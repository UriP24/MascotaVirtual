// Todos los números de la economía viven acá.
// Son valores de prototipo: cambialos libremente, el resto del código los lee de este archivo.

export const ECONOMIA = {
  // Puntos que da completar una tarea
  PUNTOS_TAREA_SIMPLE: 1,
  PUNTOS_TAREA_GRANDE: 2,

  // Estudio: cada bloque completo de minutos da puntos
  MINUTOS_POR_BLOQUE_ESTUDIO: 30,
  PUNTOS_POR_BLOQUE_ESTUDIO: 1,

  // Conversión de monedas a puntos
  MONEDAS_POR_PUNTO: 50,

  // Precio de los canjes: 1 punto equivale a esta cantidad de pesos de un plan real
  PESOS_POR_PUNTO: 500,

  // Cuántos canjes se pueden hacer por mes calendario (se renueva el día 1)
  CANJES_POR_MES: 1,
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
  // La saciedad va de 0 (con hambre) a SACIEDAD_MAXIMA (llena)
  SACIEDAD_MAXIMA: 100,
  SACIEDAD_INICIAL: 80,
}

// Planes para canjear. El precio en puntos se calcula con precioEnPuntos().
export const PLANES = [
  { id: 'comer-afuera', nombre: 'Salir a comer', emoji: '🍝', costoPesos: 40000 },
  { id: 'dia-de-parque', nombre: 'Día de parque', emoji: '🌳', costoPesos: 10000 },
  { id: 'masaje', nombre: 'Una hora de masaje', emoji: '💆', costoPesos: 15000 },
]

export function precioEnPuntos(plan) {
  return Math.ceil(plan.costoPesos / ECONOMIA.PESOS_POR_PUNTO)
}
