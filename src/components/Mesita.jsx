import './Mesita.css'

// Mesita de luz de la habitación (siempre está). Al almuerzo, a veces aparece arriba un platito
// de puré de zapallo: tocarlo es el secreto del puré.
function Mesita({ conPure, onTocarPure }) {
  return (
    <div className="mesita">
      <svg className="mueble" viewBox="0 0 100 92" aria-hidden="true">
        <ellipse cx="50" cy="88" rx="24" ry="5" fill="rgb(63 53 64 / 0.12)" />
        <path fill="#c9965e" stroke={C} strokeWidth="3" d="M44 38 L56 38 L58 82 L42 82 Z" />
        <ellipse cx="50" cy="82" rx="20" ry="6" fill="#c9965e" stroke={C} strokeWidth="3" />
        <path fill="#b8834d" stroke={C} strokeWidth="3" d="M4 30 L4 36 C4 44 96 44 96 36 L96 30 Z" />
        <ellipse cx="50" cy="30" rx="46" ry="11" fill="#d9a46b" stroke={C} strokeWidth="3" />
        <ellipse cx="50" cy="30" rx="30" ry="6.5" fill="#ffd9e7" stroke="#f7a8c6" strokeWidth="2" strokeDasharray="3 3" />
      </svg>
      {conPure && (
        <button className="plato" onClick={onTocarPure} aria-label="Un platito de puré de zapallo">
          <PlatoPure />
        </button>
      )}
    </div>
  )
}

const C = '#5a3a2a'

function PlatoPure() {
  return (
    <svg viewBox="0 0 80 58" width="74" height="54">
      {/* Vapor */}
      <g className="vapor" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" opacity="0.85">
        <path d="M32 14 C28 10 36 7 32 2" />
        <path d="M46 14 C42 10 50 7 46 2" />
      </g>
      {/* Plato */}
      <ellipse cx="40" cy="44" rx="36" ry="11" fill="#fff8f2" stroke={C} strokeWidth="2.5" />
      <ellipse cx="40" cy="42" rx="25" ry="6.5" fill="#efe3d6" />
      {/* Puré: montañita cremosa con olas hechas con la cuchara */}
      <path
        fill="#f8b862"
        stroke={C}
        strokeWidth="2.5"
        strokeLinejoin="round"
        d="M17 42 C14 35 19 30 24 31 C24 25 31 22 35 25 C37 19 45 18 47 24 C51 21 58 23 58 29 C64 29 66 36 62 42 C52 47 28 47 17 42 Z"
      />
      <path fill="none" stroke="#ffd79a" strokeWidth="2.5" strokeLinecap="round" d="M24 36 Q31 31 38 34 Q45 37 53 32" />
      <path fill="none" stroke="#e9963d" strokeWidth="2" strokeLinecap="round" d="M28 41 Q38 43 49 39" />
      <path fill="none" stroke={C} strokeWidth="2" strokeLinecap="round" d="M41 21 q3 -5 7 -2" />
      {/* Cuchara metida en el puré */}
      <path fill="#d5d0da" stroke={C} strokeWidth="2" strokeLinejoin="round" d="M54 30 L70 12 C72 10 75 12 73 15 L58 33 Z" />
    </svg>
  )
}

export default Mesita
