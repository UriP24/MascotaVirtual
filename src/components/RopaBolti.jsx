import { PRENDAS } from '../config.js'

// La ropa que Bolti tiene puesta, dibujada en su SVG. Se usa dos veces:
// - parte="cabeza": adentro del grupo de la cabeza (gorros, anteojos), así se mueve con ella
// - parte="cuerpo": sobre el cuerpo (cuello, ropa, patitas y disfraces enteros)
// Las prendas que todavía no tienen dibujo propio se muestran con su emoji en su lugar.
// Recibe `puesta`: { cabeza: 'gorrito-cumple', cuello: 'bufanda', … }

const ZONAS_DE_LA_PARTE = {
  cabeza: ['cabeza', 'cara'],
  cuerpo: ['cuello', 'cuerpo', 'patitas', 'entero'],
}

// Dónde va el emoji de cada zona (coordenadas del dibujo de Bolti, viewBox 300×320)
const LUGARES = {
  cabeza: [{ x: 150, y: 50, tam: 46 }],
  cara: [{ x: 150, y: 112, tam: 62 }],
  cuello: [{ x: 150, y: 184, tam: 34 }],
  cuerpo: [{ x: 150, y: 236, tam: 60 }],
  patitas: [
    { x: 129, y: 292, tam: 24 },
    { x: 171, y: 292, tam: 24 },
  ],
  entero: [{ x: 150, y: 236, tam: 92 }],
}

function RopaBolti({ puesta = {}, parte }) {
  return ZONAS_DE_LA_PARTE[parte].map((zona) => {
    const id = puesta[zona]
    if (!id) return null
    const Dibujo = DIBUJOS[id]
    return Dibujo ? <Dibujo key={zona} /> : <EmojiDePrenda key={zona} zona={zona} id={id} />
  })
}

function EmojiDePrenda({ zona, id }) {
  const prenda = PRENDAS.find((p) => p.id === id)
  if (!prenda) return null
  return (
    <g className={`ropa ropa-${zona}`}>
      {LUGARES[zona].map((lugar) => (
        <text
          key={lugar.x}
          x={lugar.x}
          y={lugar.y}
          fontSize={lugar.tam}
          textAnchor="middle"
          dominantBaseline="central"
        >
          {prenda.emoji}
        </text>
      ))}
    </g>
  )
}

function GorritoCumple() {
  return (
    <g className="ropa gorrito-cumple">
      <path fill="#ec6f9e" stroke="#5a3a2a" strokeWidth="3" strokeLinejoin="round" d="M122 62 L178 57 L161 12 Z" />
      <circle cx="146" cy="47" r="4" fill="#fff5f8" />
      <circle cx="163" cy="48" r="4" fill="#fff5f8" />
      <circle cx="157" cy="31" r="3.5" fill="#fff5f8" />
      <path fill="none" stroke="#2bb8b0" strokeWidth="7" strokeLinecap="round" d="M122 62 L178 57" />
      <circle cx="161" cy="11" r="7.5" fill="#ffd666" stroke="#5a3a2a" strokeWidth="2.5" />
    </g>
  )
}

// Prendas con dibujo propio (el resto usa su emoji)
const DIBUJOS = {
  'gorrito-cumple': GorritoCumple,
}

export default RopaBolti
