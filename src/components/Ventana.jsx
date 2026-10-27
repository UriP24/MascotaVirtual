import './Ventana.css'

// La ventana de la habitación. Cada tanto pasa alguien (un gato o una vaca) y, de noche,
// a veces cruza una estrella fugaz. Tocar la ventana o a quien pasa puede destapar un secreto.
function Ventana({ visita, estrella, onTocar, onTocarVisita }) {
  return (
    <div className="ventana" onClick={onTocar}>
      <span className="vidrio">
        {visita && (
          <button
            key={visita.id}
            className={`visita ${visita.tipo}`}
            aria-label={visita.tipo === 'gato' ? 'Un gato en la ventana' : 'Una vaca en la ventana'}
            onClick={(e) => {
              e.stopPropagation()
              onTocarVisita(visita.tipo)
            }}
          >
            {visita.tipo === 'gato' ? <Gato /> : <Vaca />}
          </button>
        )}
        {estrella && <span className="estrella-fugaz" aria-hidden="true" />}
      </span>
      <span className="cortina izquierda" aria-hidden="true" />
      <span className="cortina derecha" aria-hidden="true" />
      <span className="alfeizar" aria-hidden="true" />
    </div>
  )
}

const C = '#5a3a2a'

function Gato() {
  return (
    <svg viewBox="0 0 64 44" width="54" height="37">
      <path fill="none" stroke={C} strokeWidth="5" strokeLinecap="round" d="M12 26 C2 22 4 8 10 6" />
      <path fill="none" stroke="#8a8090" strokeWidth="3" strokeLinecap="round" d="M12 26 C2 22 4 8 10 6" />
      <ellipse cx="28" cy="30" rx="17" ry="10" fill="#8a8090" stroke={C} strokeWidth="2.5" />
      <rect x="16" y="32" width="6" height="11" rx="3" fill="#8a8090" stroke={C} strokeWidth="2" />
      <rect x="34" y="32" width="6" height="11" rx="3" fill="#8a8090" stroke={C} strokeWidth="2" />
      <path fill="#8a8090" stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M41 12 L43 2 L49 9 L55 2 L57 12 Z" />
      <circle cx="49" cy="18" r="10" fill="#8a8090" stroke={C} strokeWidth="2.5" />
      <circle cx="46" cy="17" r="1.8" fill="#2a2022" />
      <circle cx="53" cy="17" r="1.8" fill="#2a2022" />
      <path fill="#f590b2" d="M48 21 L51 21 L49.5 23 Z" />
    </svg>
  )
}

function Vaca() {
  return (
    <svg viewBox="0 0 80 52" width="66" height="43">
      <path fill="none" stroke={C} strokeWidth="2.5" strokeLinecap="round" d="M10 22 C4 26 4 34 6 38" />
      <rect x="10" y="16" width="44" height="24" rx="11" fill="#fff8f2" stroke={C} strokeWidth="2.5" />
      <ellipse cx="24" cy="24" rx="7" ry="5" fill="#3a3038" />
      <ellipse cx="42" cy="32" rx="6" ry="4" fill="#3a3038" />
      {[14, 22, 40, 48].map((x) => (
        <rect key={x} x={x} y="36" width="6" height="14" rx="3" fill="#fff8f2" stroke={C} strokeWidth="2" />
      ))}
      <path fill="#f2c14e" stroke={C} strokeWidth="2" d="M58 8 L54 2 L61 6 Z M72 8 L76 2 L69 6 Z" />
      <ellipse cx="65" cy="20" rx="12" ry="12" fill="#fff8f2" stroke={C} strokeWidth="2.5" />
      <ellipse cx="66" cy="28" rx="9" ry="6" fill="#f7b9cf" stroke={C} strokeWidth="2" />
      <circle cx="61" cy="17" r="1.8" fill="#2a2022" />
      <circle cx="70" cy="17" r="1.8" fill="#2a2022" />
    </svg>
  )
}

export default Ventana
