// Todos los números de la economía viven acá.
// Son valores de prototipo: cambialos libremente, el resto del código los lee de este archivo.

export const ECONOMIA = {
  // Monedas que da completar cualquier tarea (las tareas no dan puntos: así inventar tareas no rompe
  // la economía). Solo las primeras TAREAS_CON_RECOMPENSA_POR_DIA de cada día dan monedas.
  MONEDAS_POR_TAREA: 10,
  TAREAS_CON_RECOMPENSA_POR_DIA: 5,

  // Estudio: cada bloque completo de minutos da puntos
  MINUTOS_POR_BLOQUE_ESTUDIO: 25, // un pomodoro
  PUNTOS_POR_BLOQUE_ESTUDIO: 1,

  // Conversión de monedas a puntos, con tope diario
  MONEDAS_POR_PUNTO: 100,
  PUNTOS_CONVERTIBLES_POR_DIA: 1,

  // Precio de los canjes: 1 punto equivale a esta cantidad de pesos de un plan real
  PESOS_POR_PUNTO: 500,

  // Margen de puntos que se suma a los planes con precio investigado (por si suben los precios)
  MARGEN_PUNTOS_PLAN: 5,

  // Para los canjes de jueguitos (precio en dólares)
  DOLAR_EN_PESOS: 1600,

  // Monedas con las que arranca la app (para poder comprarle comida desde el primer día)
  MONEDAS_DE_BIENVENIDA: 30,
}

export const ESTUDIO = {
  // Hay que llegar a este mínimo para poder completar una tarea de estudio
  MINUTOS_MINIMOS: 25, // un pomodoro
  // Tope de estudio por día, sumando todas las tareas de estudio
  MINUTOS_MAXIMOS_POR_DIA: 200, // 8 pomodoros
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

  // Si extraña el estudio, cada cuántos minutos le recuerda a Mari que estudie (unos segundos)
  RECORDATORIO_ESTUDIO_MINUTOS: 7,

  // Cariño que gana cuando Mari completa una tarea o una sesión de estudio (Bolti está orgullosa)
  CARINO_POR_LOGRO: 5,
}

// Comida: se compra con monedas, va al inventario y se le da arrastrándola a la boca.
// precio null = no se vende (regalo).
export const COMIDAS = [
  { id: 'croquetas', nombre: 'Plato de croquetas', emoji: '🥣', precio: 5, saciedad: 15, carino: 0 },
  // premio: true → Bolti lo festeja (salta, mueve la cola y tira corazones)
  { id: 'galletita', nombre: 'Galletita de perro', emoji: '🍪', precio: 3, saciedad: 5, carino: 3, premio: true },
  { id: 'queso', nombre: 'Pedacito de queso', emoji: '🧀', precio: 4, saciedad: 5, carino: 5, premio: true },
  { id: 'patita', nombre: 'Patita de pollo', emoji: '🍗', precio: 10, saciedad: 20, carino: 2 },
  { id: 'carne', nombre: 'Carnecita con hueso', emoji: '🍖', precio: 15, saciedad: 30, carino: 5 },
  { id: 'asado', nombre: 'Asadito', emoji: '🥩', precio: 25, saciedad: 50, carino: 10 },
  // Se regala una el día del cumple (28/10)
  { id: 'torta', nombre: 'Torta de cumple', emoji: '🎂', precio: null, saciedad: 100, carino: 20 },
]
export const FECHA_REGALO_TORTA = '10-28' // MM-DD

export const JUEGOS = {
  ENERGIA_POR_PARTIDA: 10, // se gasta al empezar
  ENERGIA_MINIMA_PARA_JUGAR: 10,
  CARINO_POR_PARTIDA: 8,

  // Cada juego da un puntaje, y el puntaje se convierte en monedas con esta tabla (sin tope).
  // De 1.600 en adelante: 40 monedas y +5 cada 300 puntos más.
  PUNTAJE_A_MONEDAS: [
    { desde: 0, monedas: 5 }, // premio consuelo
    { desde: 200, monedas: 10 },
    { desde: 400, monedas: 15 },
    { desde: 600, monedas: 20 },
    { desde: 800, monedas: 25 },
    { desde: 1000, monedas: 30 },
    { desde: 1300, monedas: 35 },
    { desde: 1600, monedas: 40 },
  ],
  PUNTAJE_EXTRA_CADA: 300,
  MONEDAS_EXTRA: 5,
  // Premio por superar el récord del juego: +10 monedas cada 500 puntos del récord nuevo (mínimo 5)
  RECORD_MONEDAS_MINIMAS: 5,
  RECORD_MONEDAS_CADA_500: 10,

  // Minijuego "Atrapá los huesitos"
  HUESITOS_DURACION_SEGUNDOS: 40,
  HUESITOS_VIDAS: 3, // el chocolate saca una vida (nunca resta monedas)
  HUESITOS_PUNTOS_HUESO: 10,
  HUESITOS_PUNTOS_DORADO: 30,
  HUESITOS_RACHA_X2: 10, // atrapando seguido sin tocar chocolate: ×2 desde 10, ×3 desde 25
  HUESITOS_RACHA_X3: 25,
  HUESITOS_PUNTOS_POR_VIDA: 100, // por cada corazón que queda al final
  HUESITOS_PROB_DORADO: 0.12,
  // La velocidad sube por escalones: lenta los primeros 5 s, sube cada 10 s y los últimos 15 s
  // es mucho más rápida (el último escalón es el "¡Más rápido! 🔥").
  // velocidad: alto de pantalla por segundo · intervalo: segundos entre tanda y tanda
  // probDoble: probabilidad de que caigan dos cosas a la vez
  HUESITOS_ETAPAS: [
    { desde: 0, velocidad: 0.4, intervalo: 0.45, probDoble: 0, probChocolate: 0.18 },
    { desde: 5, velocidad: 0.5, intervalo: 0.38, probDoble: 0.15, probChocolate: 0.22 },
    { desde: 15, velocidad: 0.62, intervalo: 0.32, probDoble: 0.25, probChocolate: 0.27 },
    { desde: 25, velocidad: 0.88, intervalo: 0.24, probDoble: 0.4, probChocolate: 0.33 }, // últimos 15 s
  ],

  // Minijuego "Memoria de Bolti": límite por tiempo, cada nivel superado suma tiempo.
  // No se muestran las cartas al empezar: se van dando vuelta. Equivocarse no resta tiempo.
  MEMORIA_TIEMPO_INICIAL: 40, // segundos
  MEMORIA_NIVELES: [
    { pares: 3, columnas: 3, bonusTiempo: 10 },
    { pares: 4, columnas: 4, bonusTiempo: 10 },
    { pares: 6, columnas: 4, bonusTiempo: 10 },
    { pares: 8, columnas: 4, bonusTiempo: 8 }, // del 4 en adelante se repite este
  ],
  MEMORIA_PUNTOS_PAR: 20,
  MEMORIA_PUNTOS_PAR_A_LA_PRIMERA: 10, // extra si no se equivocó desde el par anterior
  MEMORIA_PUNTOS_POR_NIVEL: 50, // × el número de nivel superado
  MEMORIA_ESPERA_ERROR: 0.8, // segundos que se ven las dos cartas que no coinciden
  // Cosas de la vida de Bolti
  MEMORIA_SIMBOLOS: ['🦴', '🎾', '🥣', '🐄', '🧀', '🍗', '🌳', '🏠', '☀️', '💗'],
}

// Planes para canjear. Se pueden canjear varios planes distintos en el mismo mes, pero cada uno
// tiene su frecuencia (por meses calendario):
// - Mucha plata (más de $50.000 para los dos): 1 vez cada 3 meses (`rotacionMeses: 3`)
// - Plata media: 1 vez cada 2 meses. Poca plata: 1 vez por mes.
// - Sin plata: hasta 2 veces por mes (`vecesPorMes: 2`), no se acumulan de un mes a otro.
//
// Precio en puntos (ver precioEnPuntos):
// - Salidas de a dos: los puntos cubren la parte de Mari = costo para los dos / 2 / PESOS_POR_PUNTO.
// - `margen: true`: suma MARGEN_PUNTOS_PLAN (precios investigados en octubre 2026, por si suben).
// - Redondeo a número redondo: si la unidad es 5 o más, sube a la decena (67 → 70); si no, baja (192 → 190).
// - `puntosFijos`: puntos elegidos a mano (planes que no son plata o con precio decidido); sin redondeo.
// - `usdMaximo` (jueguitos): regalo para Mari sola, precio completo = dólares × DOLAR_EN_PESOS,
//   redondeado para arriba a los mil pesos (7.100 → 8.000), / PESOS_POR_PUNTO, y a número redondo.
export const PLANES = [
  {
    id: 'comer-afuera',
    nombre: 'Salir a comer algo rico y caro',
    emoji: '🍝',
    // Referencia: un ramen caro con entrada y postre ronda $66.000 por persona; 150 deja margen
    // para un lugar caro de verdad
    puntosFijos: 150,
    rotacionMeses: 3,
    descripcion: 'Elegís el lugar y pedís lo que quieras, invito yo',
  },
  {
    id: 'cine',
    nombre: 'Ir al cine',
    emoji: '🎬',
    // Referencia: 2 entradas 2D (~$21.000 c/u) + combo grande (~$20.000) = ~$62.000 para los dos
    puntosFijos: 90,
    rotacionMeses: 3,
    descripcion: 'La película que vos elijas, con pochoclos incluidos',
  },
  {
    id: 'cena-casera',
    nombre: 'Cena casera',
    emoji: '🍲',
    costoParaDos: 40000,
    margen: true,
    rotacionMeses: 2, // más barata que las salidas: cada 2 meses
    descripcion: 'Te cocino lo que me pidas y después lavo todo yo',
  },
  {
    id: 'pedir-comida',
    nombre: 'Pedir comida rica',
    emoji: '🍔',
    // Referencia: 2 lomitos o hamburguesas ≈ $35.000 → parte de Mari 17.500 → 35 + 5 → 40
    puntosFijos: 40,
    rotacionMeses: 2,
    descripcion: 'Lomito, hamburguesa o lo que pinte: pedimos y lo pago yo',
  },

  {
    id: 'helado',
    nombre: 'Salida por helado',
    emoji: '🍦',
    costoParaDos: 25000, // 1 kg de Cremolati
    margen: true,
    rotacionMeses: 1,
    descripcion: 'Un kilo de Cremolati para compartir, de los gustos que quieras',
  },
  {
    id: 'cafe',
    nombre: 'Salir a tomar un café',
    emoji: '☕',
    costoParaDos: 20000, // café con cookie, $8.000–$10.000 c/u
    margen: true,
    rotacionMeses: 1,
    descripcion: 'Un cafecito con una cookie, en el lugar que elijas',
  },
  {
    id: 'picnic',
    nombre: 'Picnic',
    emoji: '🧺',
    puntosFijos: 20,
    rotacionMeses: 1,
    descripcion: 'Mantita, algo rico comprado y una tarde al aire libre',
  },
  {
    id: 'masaje',
    nombre: 'Media hora de masaje',
    emoji: '💆',
    puntosFijos: 20,
    rotacionMeses: 1,
    vecesPorMes: 2, // no cuesta plata: hasta 2 veces por mes (no se acumulan)
    descripcion: 'Media hora de masajes, sin apuro y con aceite',
  },
  {
    id: 'dia-de-parque',
    nombre: 'Día de parque',
    emoji: '🌳',
    costoParaDos: 10000,
    rotacionMeses: 1,
    descripcion: 'Salir a pasear, caminar o patinar juntos, con mate y facturas',
  },
  {
    id: 'hoy-no-haces-nada',
    nombre: 'Hoy no hacés nada',
    emoji: '🧹',
    puntosFijos: 20,
    rotacionMeses: 1,
    vecesPorMes: 2, // no cuesta plata: hasta 2 veces por mes (no se acumulan)
    descripcion: 'Ese día me encargo yo de todas las tareas de la casa',
  },
  {
    id: 'desayuno',
    nombre: 'Desayuno en la cama',
    emoji: '🍳',
    puntosFijos: 15,
    rotacionMeses: 1,
    vecesPorMes: 2, // no cuesta plata: hasta 2 veces por mes (no se acumulan)
    descripcion: 'Te despierto con el desayuno listo, sin moverte de la cama',
  },
  {
    id: 'noche-de-peli',
    nombre: 'Noche de peli en casa',
    emoji: '🛋️',
    puntosFijos: 10,
    rotacionMeses: 1,
    vecesPorMes: 2, // no cuesta plata: hasta 2 veces por mes (no se acumulan)
    descripcion: 'Vos elegís la peli y yo hago los pochoclos',
  },
  {
    id: 'elegis-la-serie',
    nombre: 'Vos elegís la serie',
    emoji: '📺',
    puntosFijos: 10,
    rotacionMeses: 1,
    vecesPorMes: 2, // no cuesta plata: hasta 2 veces por mes (no se acumulan)
    descripcion: 'Elegís qué serie vemos y no hay discusión',
  },
  {
    id: 'juego-chico',
    nombre: 'Jueguito chico',
    emoji: '🎮',
    grupo: 'juegos', // se eligen desde una sola tarjeta "Un jueguito"
    usdMaximo: 5, // regalo para Mari sola: precio completo (no se divide a la mitad)
    rotacionMeses: 3,
    descripcion: 'Un jueguito de hasta 5 dólares, el que vos quieras',
  },
  {
    id: 'juego-mediano',
    nombre: 'Juego mediano',
    emoji: '🎮',
    grupo: 'juegos',
    usdMaximo: 15, // regalo para Mari sola: precio completo (no se divide a la mitad)
    rotacionMeses: 6,
    descripcion: 'Un juego de hasta 15 dólares, el que vos quieras',
  },
  {
    id: 'juego-grande',
    nombre: 'Juego grande',
    emoji: '🎮',
    grupo: 'juegos',
    usdMaximo: 30, // regalo para Mari sola: precio completo (no se divide a la mitad)
    rotacionMeses: 8,
    descripcion: 'Un juego de hasta 30 dólares, el que vos quieras',
  },
  {
    id: 'juego-enorme',
    nombre: 'Juego enorme',
    emoji: '🎮',
    grupo: 'juegos',
    usdMaximo: 60, // regalo para Mari sola: precio completo (no se divide a la mitad)
    rotacionMeses: 12,
    descripcion: 'Un juegazo de hasta 60 dólares, el que vos quieras',
  },
]

// Número redondo: si la unidad es 5 o más, sube a la decena siguiente; si no, baja (67 → 70, 192 → 190).
function redondear(puntos) {
  return Math.round(puntos / 10) * 10
}

export function precioEnPesosDeJuego(usd) {
  return Math.ceil((usd * ECONOMIA.DOLAR_EN_PESOS) / 1000) * 1000
}

export function precioEnPuntos(plan) {
  if (plan.puntosFijos) return plan.puntosFijos // elegidos a mano: sin redondeo
  if (plan.usdMaximo) return redondear(precioEnPesosDeJuego(plan.usdMaximo) / ECONOMIA.PESOS_POR_PUNTO)
  const base = Math.ceil(plan.costoParaDos / 2 / ECONOMIA.PESOS_POR_PUNTO)
  return redondear(base + (plan.margen ? ECONOMIA.MARGEN_PUNTOS_PLAN : 0))
}
