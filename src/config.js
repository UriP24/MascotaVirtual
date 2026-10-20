// Todos los números de la economía viven acá.
// Son valores de prototipo: cambialos libremente, el resto del código los lee de este archivo.

export const ECONOMIA = {
  // Puntos que da completar una tarea
  PUNTOS_TAREA_SIMPLE: 1,
  PUNTOS_TAREA_GRANDE: 2,

  // Estudio: una sesión completa da puntos
  MINUTOS_SESION_ESTUDIO: 25,
  PUNTOS_POR_SESION_ESTUDIO: 1,

  // Conversión de monedas a puntos
  MONEDAS_POR_PUNTO: 50,

  // Precio de los canjes: 1 punto equivale a esta cantidad de pesos de un plan real
  PESOS_POR_PUNTO: 1000,

  // Cuántos canjes se pueden hacer por mes calendario (se renueva el día 1)
  CANJES_POR_MES: 1,
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
