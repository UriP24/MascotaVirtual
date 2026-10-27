// Cómo se dibuja cada prenda sobre Bolti: una lista de piezas (ver PiezaRopa.jsx).
// `parte` dice dónde va: 'cabeza' (se mueve con la cabeza), 'cuerpo' (sobre el cuerpo)
// o 'atras' (detrás del cuerpo: capas y alas).

const ROSA = '#ec6f9e'
const ROSA_CLARO = '#ffb3d1'
const TURQUESA = '#2bb8b0'
const TURQUESA_CLARO = '#9fe3dd'
const LILA = '#a488ec'
const AMARILLO = '#ffd666'
const ROJO = '#e8505b'
const BLANCO = '#fff8f2'
const VERDE = '#6cc070'
const MARRON = '#a8743f'
const NARANJA = '#f59a3c'
const AZUL = '#5b9bd5'
const CELESTE = '#8fd3f4'
const NEGRO = '#3a3038'
const DORADO = '#f2c14e'
const CAQUI = '#c9b27c'

const cabeza = (forma, extra = {}) => ({ parte: 'cabeza', forma, ...extra })
const cuerpo = (forma, extra = {}) => ({ parte: 'cuerpo', forma, ...extra })
const atras = (forma, extra = {}) => ({ parte: 'atras', forma, ...extra })

export const DIBUJOS_ROPA = {
  // De siempre
  'mono-rosa': [cabeza('mono', { color: ROSA })],
  'flor-oreja': [cabeza('flor', { color: ROSA_CLARO })],
  'panuelito-turquesa': [cuerpo('panuelo', { color: TURQUESA })],
  'collar-cascabel': [cuerpo('collar', { color: ROJO, dije: 'cascabel' })],
  'remerita-rayada': [cuerpo('prenda', { color: TURQUESA_CLARO, color2: BLANCO, patron: 'rayas' })],
  'medias-colores': [cuerpo('medias', { color: LILA, color2: AMARILLO })],
  anteojitos: [cabeza('anteojos', { color: ROSA })],
  'anteojos-sol': [cabeza('anteojos', { color: NEGRO, sol: true })],
  'buzo-capucha': [cuerpo('prenda', { color: LILA, patron: 'bolsillo' })],
  'botitas-lluvia': [cuerpo('botitas', { color: AMARILLO })],
  gorra: [cabeza('gorra', { color: TURQUESA, color2: ROSA })],
  'camiseta-argentina': [cuerpo('prenda', { color: CELESTE, patron: 'argentina' })],
  bufanda: [cuerpo('bufanda', { color: ROSA, color2: BLANCO })],
  corona: [cabeza('corona')],
  'vincha-unicornio': [cabeza('vincha', { color: LILA, adorno: 'cuerno' })],
  'disfraz-abeja': [
    atras('alas', { color: 'rgb(220 240 255 / 0.85)' }),
    cuerpo('prenda', { color: AMARILLO, patron: 'abeja' }),
    cabeza('vincha', { color: NEGRO, adorno: 'antenas', color2: NEGRO }),
  ],
  'disfraz-dinosaurio': [
    cuerpo('prenda', { color: VERDE, color2: '#a6dc8f', patron: 'tejido' }),
    cabeza('vincha', { color: VERDE, adorno: 'pinches', color2: '#a6dc8f' }),
  ],
  'traje-astronauta': [
    cuerpo('prenda', { color: '#e9edf2', patron: 'parches' }),
    cabeza('casco', { color: '#c3ccd8' }),
  ],
  'conjunto-chef': [
    cuerpo('prenda', { color: BLANCO, color2: ROJO, patron: 'botones' }),
    cuerpo('panuelo', { color: ROJO }),
    cabeza('sombrero', { tipo: 'chef' }),
  ],
  'conjunto-princesa': [
    cuerpo('prenda', { color: ROSA_CLARO, vestido: true, mangas: false }),
    cuerpo('collar', { color: DORADO, dije: 'corazon' }),
    cabeza('corona', { chica: true }),
  ],

  // Navidad y verano
  'gorro-papa-noel': [cabeza('gorro', { color: ROJO, punta: true })],
  'flotador-patito': [cuerpo('flotador')],
  'disfraz-reno': [
    cuerpo('prenda', { color: MARRON }),
    cabeza('vincha', { color: MARRON, adorno: 'cuernos-reno' }),
    cabeza('nariz-reno'),
  ],
  'conjunto-mama-noel': [
    cuerpo('prenda', { color: ROJO, vestido: true, patron: 'pelaje' }),
    cabeza('gorro', { color: ROJO, punta: true }),
  ],
  // San Valentín
  'vincha-corazones': [cabeza('vincha', { color: ROSA, adorno: 'corazones', color2: ROJO })],
  'remera-corazones': [cuerpo('prenda', { color: BLANCO, color2: ROSA, patron: 'corazones' })],
  'alitas-cupido': [atras('alas', { color: BLANCO })],
  'conjunto-cupido': [
    atras('alas', { color: BLANCO }),
    cuerpo('prenda', { color: ROSA_CLARO, color2: ROJO, patron: 'corazones' }),
    cabeza('vincha', { color: ROSA, adorno: 'corazones', color2: ROJO }),
  ],
  // Otoño
  boina: [cabeza('boina', { color: '#c0504d' })],
  'pulover-tejido': [cuerpo('prenda', { color: NARANJA, color2: '#ffd9a8', patron: 'tejido' })],
  'disfraz-ardilla': [
    cuerpo('prenda', { color: '#c9773a' }),
    cabeza('vincha', { color: '#c9773a', adorno: 'orejas-ardilla', color2: '#c9773a' }),
  ],
  'conjunto-exploradora': [
    cuerpo('prenda', { color: CAQUI, patron: 'bolsillos' }),
    cabeza('sombrero', { color: CAQUI, color2: MARRON }),
  ],
  // Invierno
  guantes: [cuerpo('guantes', { color: TURQUESA })],
  orejeras: [cabeza('orejeras', { color: ROSA_CLARO, color2: ROSA })],
  'campera-inflable': [cuerpo('prenda', { color: AZUL, patron: 'acolchado' })],
  'traje-esqui': [
    cuerpo('prenda', { color: TURQUESA, patron: 'acolchado' }),
    cabeza('gorro', { color: ROSA, rayas: true }),
    cabeza('antiparras', { color: NEGRO }),
  ],
  // Primavera
  'corona-flores': [cabeza('vincha', { adorno: 'flores' })],
  'panuelo-floreado': [cuerpo('panuelo', { color: ROSA_CLARO, color2: AMARILLO })],
  'disfraz-mariposa': [
    atras('alas', { tipo: 'mariposa', color: LILA, color2: ROSA_CLARO }),
    cuerpo('prenda', { color: '#d9ccfa' }),
    cabeza('vincha', { color: NEGRO, adorno: 'antenas', color2: ROSA }),
  ],
  'conjunto-hada': [
    atras('alas', { color: 'rgb(200 245 240 / 0.85)' }),
    cuerpo('prenda', { color: TURQUESA_CLARO, vestido: true, mangas: false }),
    cabeza('vincha', { adorno: 'flores' }),
  ],
  // Halloween
  'vincha-murcielago': [cabeza('vincha', { color: NEGRO, adorno: 'murcielago', color2: NEGRO })],
  'capa-vampiro': [atras('capa', { color: '#7a2f3a' }), cuerpo('hombros', { color: '#7a2f3a' }), cuerpo('broche')],
  'disfraz-calabaza': [cuerpo('prenda', { color: NARANJA, patron: 'calabaza' })],
  'conjunto-bruja': [
    cuerpo('prenda', { color: '#6b4fa0', vestido: true }),
    cabeza('sombrero', { tipo: 'bruja', color: '#6b4fa0', color2: VERDE }),
  ],

  // Exclusivas
  'gorrito-cumple': [cabeza('cumple')],
  'panuelo-salud': [cuerpo('panuelo', { color: CELESTE })],
  'remerita-panza': [cuerpo('prenda', { color: ROSA_CLARO, color2: BLANCO, patron: 'rayas', mangas: false })],
  'pijama-ositos': [
    cuerpo('prenda', { color: '#bfe3f7', color2: BLANCO, patron: 'ositos' }),
    cabeza('vincha', { color: '#bfe3f7', adorno: 'orejas-oso', color2: '#bfe3f7' }),
  ],
  'bata-bano': [cuerpo('prenda', { color: BLANCO, color2: ROSA, patron: 'cinturon' })],
  'orejitas-gato': [cabeza('vincha', { color: NEGRO, adorno: 'orejas-gato', color2: NEGRO })],
  'sombrero-vaquera': [cabeza('sombrero', { color: MARRON, color2: ROJO })],
  'par-medias': [cuerpo('medias', { color: BLANCO, color2: ROSA })],
  'mono-rojo': [cabeza('mono', { color: ROJO })],
  'collar-corazon': [cuerpo('collar', { color: ROSA, dije: 'corazon' })],
  'babero-complice': [cuerpo('babero')],
  'collar-bolti': [cuerpo('collar', { color: TURQUESA, dije: 'hueso' })],
  'traje-superheroe': [
    atras('capa', { color: ROSA }),
    cuerpo('prenda', { color: TURQUESA, color2: AMARILLO, patron: 'emblema' }),
    cuerpo('broche', { color: AMARILLO }),
    cabeza('antifaz', { color: ROSA }),
  ],
}
