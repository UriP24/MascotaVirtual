// La ropa que Bolti tiene puesta, dibujada en SVG encima de su cabeza (va adentro del grupo
// de la cabeza, así se mueve con ella). Por ahora: el gorrito de cumpleaños.
// Recibe `puesta`: { cabeza: 'gorrito-cumple', … }
function RopaBolti({ puesta = {} }) {
  return <>{puesta.cabeza === 'gorrito-cumple' && <GorritoCumple />}</>
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

export default RopaBolti
