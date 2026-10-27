import './ObjetoPiso.css'

// Algo que aparece en el piso de la habitación y se puede tocar:
// la media que trajo Bolti (secreto de las medias) o el platito de puré (secreto del puré).
function ObjetoPiso({ tipo, onTocar }) {
  return (
    <button
      className={`objeto-piso ${tipo}`}
      onClick={onTocar}
      aria-label={tipo === 'media' ? 'Una media que trajo Bolti' : 'Un platito de puré de zapallo'}
    >
      {tipo === 'media' ? <Media /> : <PlatoPure />}
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

function PlatoPure() {
  return (
    <svg viewBox="0 0 64 40" width="62" height="39">
      <ellipse cx="32" cy="28" rx="29" ry="10" fill="#fff8f2" stroke={C} strokeWidth="2.5" />
      <ellipse cx="32" cy="26" rx="20" ry="6" fill="#f4e6d8" />
      <path fill="#f59a3c" stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M16 26 C16 16 24 10 32 10 C40 10 48 16 48 26 C40 30 24 30 16 26 Z" />
      <path fill="none" stroke="#ffc27a" strokeWidth="3" strokeLinecap="round" d="M25 18 Q30 14 36 16" />
      <path fill="#c9c3cf" stroke={C} strokeWidth="2" d="M50 6 L54 8 L42 22 L40 21 Z" />
    </svg>
  )
}

export default ObjetoPiso
