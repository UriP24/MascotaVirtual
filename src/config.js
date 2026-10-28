// Todos los números de la economía viven acá.
// Son valores de prototipo: cambialos libremente, el resto del código los lee de este archivo.

export const ECONOMIA = {
  // Monedas que da completar cualquier tarea (las tareas no dan puntos: así inventar tareas no rompe
  // la economía). Solo las primeras TAREAS_CON_RECOMPENSA_POR_DIA de cada día dan monedas.
  MONEDAS_POR_TAREA: 10,
  // La tarea "pasear a Bolti" (una por día): se completa jugando al Paseo y da además un punto
  PUNTOS_POR_PASEO: 1,
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

  // Monedas con las que arranca la app (para comprarle comida desde el primer día)
  MONEDAS_DE_BIENVENIDA: 100,
  // Puntos de regalo para que pueda probar un canje o el gacha el primer día
  PUNTOS_DE_BIENVENIDA: 30,
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

// Recordatorios de estudio: Bolti lo menciona en una burbujita que se va sola, sin quedarse triste
export const RECORDATORIOS_ESTUDIO = {
  MAXIMO_POR_DIA: 3,
  HORAS_ENTRE: 2, // mínimo entre un recordatorio y el siguiente
  EXTRANO_CADA_DIAS: 7, // "Ayer te extrañé estudiando" como mucho una vez por semana
  PRIMERO_A_LOS_SEGUNDOS: 8, // al entrar a Casa, el primero (si toca) llega después de esto
  REVISAR_CADA_MINUTOS: 5,
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
  // premio: true → Bolti lo festeja (salta, mueve la cola y tira corazones)
  { id: 'galletita', nombre: 'Galletita de perro', emoji: '🍪', precio: 3, saciedad: 5, carino: 3, premio: true },
  { id: 'queso', nombre: 'Pedacito de queso', emoji: '🧀', precio: 4, saciedad: 5, carino: 5, premio: true },
  { id: 'patita', nombre: 'Patita de pollo', emoji: '🍗', precio: 10, saciedad: 20, carino: 2 },
  { id: 'carne', nombre: 'Carnecita con hueso', emoji: '🍖', precio: 15, saciedad: 30, carino: 5 },
  { id: 'asado', nombre: 'Asadito', emoji: '🥩', precio: 25, saciedad: 50, carino: 10 },
  // Se regala una el día del cumple (28/10)
  { id: 'torta', nombre: 'Torta de cumple', emoji: '🎂', precio: null, saciedad: 100, carino: 20 },
]
// Cumpleaños de Mari (todos los años): aparece un regalo, no hay estudio obligatorio
export const FECHA_CUMPLE = '10-28' // MM-DD
export const REGALO_CUMPLE = {
  prenda: 'gorrito-cumple', // se la pone sola al abrir el regalo
  comida: 'torta', // va a la mochila
  tiradasGratis: 10, // una multi gratis del gacha
}

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

  // Minijuego "Paseo con Bolti" (se desbloquea con el secreto de anotar "pasear a Bolti").
  // Bolti corre de costado; tocar la pantalla la hace saltar. Las medidas son en "anchos de pantalla".
  PASEO_DURACION_SEGUNDOS: 45,
  PASEO_VIDAS: 3,
  PASEO_SALTO: 1.8, // velocidad hacia arriba al saltar
  PASEO_GRAVEDAD: 4.6, // con estos dos valores el salto dura ~0,78 s y sube ~0,35
  PASEO_PUNTOS_POR_SEGUNDO: 10, // por caminar
  PASEO_PUNTOS_HUESO: 10,
  PASEO_PUNTOS_DORADO: 30,
  PASEO_PUNTOS_SALTO: 20, // por cada obstáculo que pasa sin chocar
  PASEO_PUNTOS_POR_VIDA: 100, // por cada corazón que queda al final
  PASEO_PROB_DORADO: 0.15,
  PASEO_ETAPAS: [
    { desde: 0, velocidad: 0.42, intervalo: 1.6 },
    { desde: 12, velocidad: 0.5, intervalo: 1.35 },
    { desde: 25, velocidad: 0.6, intervalo: 1.15 },
    { desde: 35, velocidad: 0.72, intervalo: 1 }, // últimos 10 s
  ],
  // El caballo (secreto INVENCIBLE): a veces aparece una vez por paseo y patea con las patas de atrás.
  // Si Bolti salta justo, lo esquiva; si la agarra en el piso, la patea y se levanta invencible
  // unos segundos (nada la frena y los puntos valen doble)
  PASEO_PROB_CABALLO: 0.5,
  PASEO_CABALLO_DESDE: 12, // segundos: aparece entre estos dos momentos
  PASEO_CABALLO_HASTA: 28,
  PASEO_INVENCIBLE_SEGUNDOS: 5,
  PASEO_PUNTOS_ESQUIVA: 50, // si salta justo cuando el caballo patea, lo esquiva
  // Puntaje para ganar el título "Paseadora de perros" y el collar con chapita "Bolti"
  PASEO_PUNTAJE_PASEADORA: 1500,

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

// ── Gacha de ropa (se paga con ⭐) ──────────────────────────────────────────────
export const GACHA = {
  PRECIO_TIRADA: 5, // ⭐ por 1 premio
  TIRADAS_MULTI: 10,
  PRECIO_MULTI: 50, // ⭐ por 10 premios (sin descuento: lo mismo que 10 sueltas)
  GARANTIA_RARA: 10, // cada 10 tiradas, una rara o mejor asegurada (o sea, en cada multi)
  GARANTIA_ULTRA: 30, // a las 30 tiradas, ultra rara asegurada
  // Chance de cada rareza en una tirada normal
  PROBABILIDADES: { comun: 0.7, rara: 0.22, epica: 0.07, ultra: 0.01 },
  // Premios de ⭐ (chance sobre el total de tiradas). Devuelven en promedio ~30% de lo gastado.
  PREMIOS_PUNTOS: {
    comun: { puntos: 15, chance: 0.05 },
    rara: { puntos: 25, chance: 0.02 },
    epica: { puntos: 50, chance: 0.005 },
  },
  // La ropa de temporada sale más seguido que la de siempre mientras es su época
  PESO_TEMPORADA: 2,
  // Una prenda repetida da 1 pieza de su rareza. Con estas piezas se canjea una prenda que no tenga.
  PIEZAS_PARA_CANJE: { comun: 5, rara: 10, epica: 20, ultra: 3 },
}

export const RAREZAS = [
  { id: 'comun', nombre: 'Común', color: '#857682' },
  { id: 'rara', nombre: 'Rara', color: '#2bb8b0' },
  { id: 'epica', nombre: 'Épica', color: '#a488ec' },
  { id: 'ultra', nombre: 'Ultra rara', color: '#ec6f9e' },
]

// Temporadas de Argentina (hemisferio sur). Puede haber dos a la vez (octubre: primavera y Halloween).
export const TEMPORADAS = [
  { id: 'navidad', nombre: 'Navidad y verano', emoji: '🎄', meses: [12, 1] },
  { id: 'san-valentin', nombre: 'San Valentín', emoji: '💘', meses: [2] },
  { id: 'otono', nombre: 'Otoño', emoji: '🍂', meses: [3, 4, 5] },
  { id: 'invierno', nombre: 'Invierno', emoji: '❄️', meses: [6, 7, 8] },
  { id: 'primavera', nombre: 'Primavera', emoji: '🌼', meses: [9, 10, 11] },
  { id: 'halloween', nombre: 'Halloween', emoji: '🦇', meses: [10] },
]

// Zonas donde se pone cada prenda. "entero" es un disfraz o conjunto que la viste toda.
export const ZONAS = ['cabeza', 'cara', 'cuello', 'cuerpo', 'patitas', 'entero']

// Catálogo de ropa. Sin `temporada` = sale siempre. `exclusiva` = no sale en el gacha
// (se consigue con el regalo de cumple o descubriendo secretos).
export const PRENDAS = [
  // De siempre
  { id: 'mono-rosa', nombre: 'Moño rosa', emoji: '🎀', zona: 'cabeza', rareza: 'comun' },
  { id: 'flor-oreja', nombre: 'Flor en la oreja', emoji: '🌸', zona: 'cabeza', rareza: 'comun' },
  { id: 'panuelito-turquesa', nombre: 'Pañuelito turquesa', emoji: '💠', zona: 'cuello', rareza: 'comun' },
  { id: 'collar-cascabel', nombre: 'Collar con cascabel', emoji: '🔔', zona: 'cuello', rareza: 'comun' },
  { id: 'remerita-rayada', nombre: 'Remerita rayada', emoji: '👕', zona: 'cuerpo', rareza: 'comun' },
  { id: 'medias-colores', nombre: 'Medias de colores', emoji: '🧦', zona: 'patitas', rareza: 'comun' },
  { id: 'anteojitos', nombre: 'Anteojitos redondos', emoji: '👓', zona: 'cara', rareza: 'comun' },
  { id: 'anteojos-sol', nombre: 'Anteojos de sol', emoji: '🕶️', zona: 'cara', rareza: 'rara' },
  { id: 'buzo-capucha', nombre: 'Buzo con capucha', emoji: '🧥', zona: 'cuerpo', rareza: 'rara' },
  { id: 'botitas-lluvia', nombre: 'Botitas de lluvia', emoji: '👢', zona: 'patitas', rareza: 'rara' },
  { id: 'gorra', nombre: 'Gorra', emoji: '🧢', zona: 'cabeza', rareza: 'rara' },
  { id: 'camiseta-argentina', nombre: 'Camiseta de Argentina', emoji: '🇦🇷', zona: 'cuerpo', rareza: 'rara' },
  { id: 'bufanda', nombre: 'Bufanda', emoji: '🧣', zona: 'cuello', rareza: 'rara' },
  { id: 'corona', nombre: 'Corona', emoji: '👑', zona: 'cabeza', rareza: 'epica' },
  { id: 'vincha-unicornio', nombre: 'Vincha de unicornio', emoji: '🦄', zona: 'cabeza', rareza: 'epica' },
  { id: 'disfraz-abeja', nombre: 'Disfraz de abeja', emoji: '🐝', zona: 'entero', rareza: 'epica' },
  { id: 'disfraz-dinosaurio', nombre: 'Disfraz de dinosaurio', emoji: '🦖', zona: 'entero', rareza: 'epica' },
  { id: 'traje-astronauta', nombre: 'Traje de astronauta', emoji: '🚀', zona: 'entero', rareza: 'ultra' },
  { id: 'conjunto-chef', nombre: 'Conjunto de chef', emoji: '👩‍🍳', zona: 'entero', rareza: 'ultra' },
  { id: 'conjunto-princesa', nombre: 'Conjunto de princesa', emoji: '👸', zona: 'entero', rareza: 'ultra' },

  // Navidad y verano (diciembre y enero)
  { id: 'gorro-papa-noel', nombre: 'Gorro de Papá Noel', emoji: '🎅', zona: 'cabeza', rareza: 'comun', temporada: 'navidad' },
  { id: 'flotador-patito', nombre: 'Flotador de patito', emoji: '🦆', zona: 'cuerpo', rareza: 'rara', temporada: 'navidad' },
  { id: 'disfraz-reno', nombre: 'Disfraz de reno', emoji: '🦌', zona: 'entero', rareza: 'epica', temporada: 'navidad' },
  { id: 'conjunto-mama-noel', nombre: 'Conjunto de Mamá Noel', emoji: '🤶', zona: 'entero', rareza: 'ultra', temporada: 'navidad' },
  // San Valentín (febrero)
  { id: 'vincha-corazones', nombre: 'Vincha de corazones', emoji: '💖', zona: 'cabeza', rareza: 'comun', temporada: 'san-valentin' },
  { id: 'remera-corazones', nombre: 'Remera con corazones', emoji: '💌', zona: 'cuerpo', rareza: 'rara', temporada: 'san-valentin' },
  { id: 'alitas-cupido', nombre: 'Alitas de cupido', emoji: '💘', zona: 'cuerpo', rareza: 'epica', temporada: 'san-valentin' },
  { id: 'conjunto-cupido', nombre: 'Conjunto de Cupido', emoji: '🏹', zona: 'entero', rareza: 'ultra', temporada: 'san-valentin' },
  // Otoño (marzo a mayo)
  { id: 'boina', nombre: 'Boina', emoji: '🍂', zona: 'cabeza', rareza: 'comun', temporada: 'otono' },
  { id: 'pulover-tejido', nombre: 'Pulóver tejido', emoji: '🧶', zona: 'cuerpo', rareza: 'rara', temporada: 'otono' },
  { id: 'disfraz-ardilla', nombre: 'Disfraz de ardilla', emoji: '🐿️', zona: 'entero', rareza: 'epica', temporada: 'otono' },
  { id: 'conjunto-exploradora', nombre: 'Conjunto de exploradora', emoji: '🧭', zona: 'entero', rareza: 'ultra', temporada: 'otono' },
  // Invierno (junio a agosto)
  { id: 'guantes', nombre: 'Guantes', emoji: '🧤', zona: 'patitas', rareza: 'comun', temporada: 'invierno' },
  { id: 'orejeras', nombre: 'Orejeras', emoji: '🎧', zona: 'cabeza', rareza: 'rara', temporada: 'invierno' },
  { id: 'campera-inflable', nombre: 'Campera inflable', emoji: '🧥', zona: 'cuerpo', rareza: 'epica', temporada: 'invierno' },
  { id: 'traje-esqui', nombre: 'Traje de esquí', emoji: '⛷️', zona: 'entero', rareza: 'ultra', temporada: 'invierno' },
  // Primavera (septiembre a noviembre)
  { id: 'corona-flores', nombre: 'Corona de flores', emoji: '🌼', zona: 'cabeza', rareza: 'comun', temporada: 'primavera' },
  { id: 'panuelo-floreado', nombre: 'Pañuelo floreado', emoji: '🌷', zona: 'cuello', rareza: 'rara', temporada: 'primavera' },
  { id: 'disfraz-mariposa', nombre: 'Disfraz de mariposa', emoji: '🦋', zona: 'entero', rareza: 'epica', temporada: 'primavera' },
  { id: 'conjunto-hada', nombre: 'Conjunto de hada de las flores', emoji: '🧚', zona: 'entero', rareza: 'ultra', temporada: 'primavera' },
  // Halloween (octubre)
  { id: 'vincha-murcielago', nombre: 'Vincha de murciélago', emoji: '🦇', zona: 'cabeza', rareza: 'comun', temporada: 'halloween' },
  { id: 'capa-vampiro', nombre: 'Capa de vampiro', emoji: '🧛', zona: 'cuerpo', rareza: 'rara', temporada: 'halloween' },
  { id: 'disfraz-calabaza', nombre: 'Disfraz de calabaza', emoji: '🎃', zona: 'entero', rareza: 'epica', temporada: 'halloween' },
  { id: 'conjunto-bruja', nombre: 'Conjunto de bruja', emoji: '🧙', zona: 'entero', rareza: 'ultra', temporada: 'halloween' },

  // Exclusivas: no salen en el gacha
  { id: 'gorrito-cumple', nombre: 'Gorrito de cumpleaños', emoji: '🥳', zona: 'cabeza', rareza: 'exclusiva', exclusiva: true },
  { id: 'panuelo-salud', nombre: 'Pañuelo "¡Salud!"', emoji: '🤧', zona: 'cuello', rareza: 'exclusiva', exclusiva: true },
  { id: 'remerita-panza', nombre: 'Remerita panza al aire', emoji: '👚', zona: 'cuerpo', rareza: 'exclusiva', exclusiva: true },
  { id: 'pijama-ositos', nombre: 'Pijama de ositos', emoji: '🧸', zona: 'entero', rareza: 'exclusiva', exclusiva: true },
  { id: 'bata-bano', nombre: 'Bata de baño', emoji: '🛁', zona: 'cuerpo', rareza: 'exclusiva', exclusiva: true },
  { id: 'orejitas-gato', nombre: 'Vincha con orejitas de gato', emoji: '🐱', zona: 'cabeza', rareza: 'exclusiva', exclusiva: true },
  { id: 'sombrero-vaquera', nombre: 'Sombrero de vaquera', emoji: '🤠', zona: 'cabeza', rareza: 'exclusiva', exclusiva: true },
  { id: 'par-medias', nombre: 'Par de medias', emoji: '🧦', zona: 'patitas', rareza: 'exclusiva', exclusiva: true },
  { id: 'mono-rojo', nombre: 'Moño rojo', emoji: '❤️', zona: 'cabeza', rareza: 'exclusiva', exclusiva: true },
  { id: 'collar-corazon', nombre: 'Collar de corazón', emoji: '💗', zona: 'cuello', rareza: 'exclusiva', exclusiva: true },
  { id: 'babero-complice', nombre: 'Babero de cómplice', emoji: '🥣', zona: 'cuello', rareza: 'exclusiva', exclusiva: true },
  { id: 'collar-bolti', nombre: 'Collar con chapita "Bolti"', emoji: '🦴', zona: 'cuello', rareza: 'exclusiva', exclusiva: true },
  { id: 'traje-superheroe', nombre: 'Traje de superhéroe', emoji: '🦸', zona: 'entero', rareza: 'exclusiva', exclusiva: true },
]

// ── Secretos ────────────────────────────────────────────────────────────────
// `pista`: la adivinanza que se ve en la lista de secretos. `frase`: lo que Bolti dice cada tanto
// como pista. `premio`: una prenda exclusiva o tiradas gratis del gacha.
export const SECRETOS = [
  { id: 'estornudo', nombre: '¡Salud!', pista: 'A Bolti le pica la nariz…', frase: 'Me pica la nariz… 🤧', premio: { prenda: 'panuelo-salud' } },
  { id: 'patita', nombre: 'La patita loca', pista: 'Hay un lugar donde le encanta que la rasquen', frase: '¿Me rascás la pancita? 🐾', premio: { prenda: 'remerita-panza' } },
  { id: 'panza-arriba', nombre: 'Panza arriba', pista: 'Dejá el dedo quieto sobre ella un ratito…', frase: 'A veces quiero un mimo largo, largo 💕', premio: { prenda: 'pijama-ositos' } },
  { id: 'sacudida', nombre: '¡Brrr!', pista: '¿Qué pasa si la sacudís?', frase: 'Me encanta sacudirme después del baño 💦', premio: { prenda: 'bata-bano' } },
  { id: 'gato', nombre: 'El gato de la ventana', pista: 'Alguien se asoma por la ventana de vez en cuando', frase: 'Me pareció ver un gato… 👀', premio: { prenda: 'orejitas-gato' } },
  { id: 'vaca', nombre: '¡Una vaca!', pista: 'A veces pasa alguien muy grande por la ventana', frase: '¿Sabías que yo arreaba vacas? 🐄', premio: { prenda: 'sombrero-vaquera' } },
  { id: 'medias', nombre: 'Ladrona de medias', pista: 'Algunas mañanas Bolti trae regalitos', frase: 'Hoy me levanté con ganas de robar algo… 🧦', premio: { prenda: 'par-medias' } },
  { id: 'estrella', nombre: 'Estrella fugaz', pista: 'De noche, mirá bien por la ventana', frase: '¿Viste las estrellas de noche? ✨', premio: { tiradas: 10 } },
  { id: 'san-valentin', nombre: 'San Valentín', pista: 'Un día de febrero lleno de amor', premio: { prenda: 'mono-rojo' } },
  { id: 'aniversario', nombre: 'Aniversario', pista: 'Un día de marzo muy importante para ustedes dos', premio: { prenda: 'collar-corazon' } },
  { id: 'pure', nombre: 'Cómplices', pista: 'A la hora del almuerzo, a veces sobra algo naranja…', frase: '¿Hoy hay puré? 👀', premio: { prenda: 'babero-complice' } },
  { id: 'paseo', nombre: 'A pasear', pista: 'Bolti quiere salir… si alguien lo anotara', frase: 'Me encantaría salir a pasear… si alguien lo anotara 📝', premio: { tiradas: 10 } },
  { id: 'invencible', nombre: 'INVENCIBLE', pista: 'En el paseo, algunos golpes no la frenan', premio: { prenda: 'traje-superheroe' } },
]

export const REGLAS_SECRETOS = {
  NARIZ_TOQUES: 5, // toques seguidos en la nariz para que estornude
  NARIZ_SEGUNDOS_ENTRE_TOQUES: 3,
  PANZA_RECORRIDO: 700, // px frotando la panza para que patee
  APRETADO_MS: 1800, // dedo quieto sobre Bolti para que se ponga panza arriba
  SACUDIDA_FUERZA: 22, // aceleración (m/s²) para que cuente como sacudir el celu
  VISITA_CADA_SEGUNDOS: 40, // cada cuánto puede pasar alguien por la ventana
  CHANCE_GATO: 0.12,
  CHANCE_VACA: 0.06,
  VISITA_DURACION_SEGUNDOS: 7,
  CHANCE_ESTRELLA: 0.35, // al tocar la ventana de noche
  CHANCE_MEDIA: 0.15, // cada mañana
  HORA_MEDIA: 10, // la media aparece desde que se despierta
  MONEDAS_POR_MEDIA_EXTRA: 10, // después del par
  PURE_DESDE: 13,
  PURE_HASTA: 15,
  PURE_DIAS_DESDE_INSTALACION: 3, // la primera vez, unos días después de empezar a usar la app
  PURE_CADA_DIAS: 7,
  CHANCE_PISTA: 0.18, // al tocarla, a veces dice una pista
  FECHA_SAN_VALENTIN: '02-14',
  FECHA_ANIVERSARIO: '03-24',
}

// La cartita del aniversario (24/3). Uri la escribe antes de marzo; mientras tanto va este texto.
export const CARTA_ANIVERSARIO = [
  'Feliz aniversario, mi amor.',
  'Gracias por cada día juntos. Te amo ❤️',
]
