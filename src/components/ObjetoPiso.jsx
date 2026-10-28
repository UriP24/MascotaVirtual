import './ObjetoPiso.css'

// Algo que aparece en el piso de la habitación y se puede tocar: por ahora, la media que
// trajo Bolti (secreto de las medias). El puré aparece en la Mesita.
function ObjetoPiso({ tipo, onTocar }) {
  return (
    <button className={`objeto-piso ${tipo}`} onClick={onTocar} aria-label="Una media que trajo Bolti">
      <Media />
    </button>
  )
}

const C = '#5a3a2a'

function Media() {
  return (
    <svg viewBox="0 0 50 50" width="48" height="48">
      <path fill="#fff8f2" stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M16 4 L32 4 L32 28 C32 32 34 34 40 36 C48 39 46 48 38 48 L22 48 C14 48 12 42 14 34 L16 28 Z" />
      <path fill="none" stroke="#ec6f9e" strokeWidth="4" d="M16 10 L32 10 M16 18 L32 18" />
      <path fill="#2bb8b0" stroke={C} strokeWidth="2" d="M14 40 C14 46 18 48 22 48 L30 48 C26 46 24 42 24 40 Z" />
    </svg>
  )
}

export default ObjetoPiso
