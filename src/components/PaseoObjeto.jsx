// Las cosas que aparecen en el paseo, dibujadas con el mismo estilo que Bolti.
// Todas miran / se apoyan sobre el piso (el borde de abajo del dibujo es el piso).
function PaseoObjeto({ tipo, pateando = false }) {
  if (tipo === 'charco') return <Charco />
  if (tipo === 'gato') return <GatoSentado />
  if (tipo === 'bici') return <Bici />
  if (tipo === 'hueso' || tipo === 'dorado') return <Hueso dorado={tipo === 'dorado'} />
  if (tipo === 'caballo') return <Caballo pateando={pateando} />
  return null
}

const C = '#5a3a2a'

function Charco() {
  return (
    <svg viewBox="0 0 100 26" width="100%" style={{ display: 'block' }}>
      <ellipse cx="50" cy="15" rx="47" ry="10" fill="#8fd3f4" stroke={C} strokeWidth="2.5" />
      <ellipse cx="38" cy="12" rx="16" ry="3" fill="#d6f1fd" />
    </svg>
  )
}

function GatoSentado() {
  return (
    <svg viewBox="0 0 64 66" width="100%" style={{ display: 'block' }}>
      <path fill="none" stroke={C} strokeWidth="6" strokeLinecap="round" d="M44 60 C60 60 62 44 54 38" />
      <path fill="none" stroke="#8a8090" strokeWidth="3.5" strokeLinecap="round" d="M44 60 C60 60 62 44 54 38" />
      <path fill="#8a8090" stroke={C} strokeWidth="2.5" d="M14 64 C10 44 16 30 30 30 C44 30 50 44 46 64 Z" />
      <path fill="#8a8090" stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M14 18 L16 4 L24 12 L34 12 L42 4 L44 18 Z" />
      <circle cx="29" cy="22" r="14" fill="#8a8090" stroke={C} strokeWidth="2.5" />
      <ellipse cx="24" cy="21" rx="2.5" ry="3.5" fill="#2a2022" />
      <ellipse cx="34" cy="21" rx="2.5" ry="3.5" fill="#2a2022" />
      <path fill="#f590b2" d="M27 26 L31 26 L29 28.5 Z" />
      <path fill="none" stroke={C} strokeWidth="1.5" d="M14 26 L4 24 M14 29 L4 30 M44 26 L54 24 M44 29 L54 30" />
    </svg>
  )
}

function Bici() {
  return (
    <svg viewBox="0 0 112 72" width="100%" style={{ display: 'block' }}>
      <circle cx="24" cy="50" r="19" fill="none" stroke={C} strokeWidth="6" />
      <circle cx="88" cy="50" r="19" fill="none" stroke={C} strokeWidth="6" />
      <circle cx="24" cy="50" r="19" fill="none" stroke="#3a3038" strokeWidth="3" />
      <circle cx="88" cy="50" r="19" fill="none" stroke="#3a3038" strokeWidth="3" />
      <path fill="none" stroke={C} strokeWidth="7" strokeLinejoin="round" strokeLinecap="round" d="M24 50 L44 22 L76 22 L88 50 M44 22 L56 50 L76 22 M56 50 L24 50" />
      <path fill="none" stroke="#2bb8b0" strokeWidth="4" strokeLinejoin="round" strokeLinecap="round" d="M24 50 L44 22 L76 22 L88 50 M44 22 L56 50 L76 22 M56 50 L24 50" />
      <path fill="#ec6f9e" stroke={C} strokeWidth="2.5" d="M34 14 L52 14 C54 14 54 20 50 20 L36 20 C32 20 32 14 34 14 Z" />
      <path fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" d="M76 22 L80 8 L90 6" />
    </svg>
  )
}

function Hueso({ dorado }) {
  return (
    <svg viewBox="0 0 60 30" width="100%" style={{ display: 'block' }} className={dorado ? 'hueso-dorado' : undefined}>
      <path
        fill={dorado ? '#f2c14e' : '#fff8f2'}
        stroke={C}
        strokeWidth="2.5"
        d="M14 8 a7 7 0 1 1 6 7 L40 15 a7 7 0 1 1 6 -7 a7 7 0 1 1 0 14 a7 7 0 1 1 -6 -7 L20 15 a7 7 0 1 1 -6 7 a7 7 0 1 1 0 -14 Z"
      />
    </svg>
  )
}

// El caballo mira a la derecha y le muestra la cola a Bolti; al patear estira las patas de atrás
function Caballo({ pateando }) {
  return (
    <svg viewBox="0 0 200 180" width="100%" style={{ display: 'block' }} className={pateando ? 'caballo pateando' : 'caballo'}>
      {/* Cola */}
      <path fill="#5c3b22" stroke={C} strokeWidth="3" strokeLinejoin="round" d="M44 66 C28 70 22 96 26 120 C34 112 36 96 48 80 Z" />
      {/* Patas de atrás (la de adelante patea) */}
      <rect x="54" y="92" width="14" height="80" rx="7" fill="#946233" stroke={C} strokeWidth="3" />
      <g className="pata-patada">
        <rect x="68" y="92" width="15" height="80" rx="7" fill="#a8743f" stroke={C} strokeWidth="3" />
        <rect x="65" y="162" width="21" height="12" rx="4" fill="#3a3038" />
      </g>
      {/* Patas de adelante */}
      <rect x="128" y="92" width="14" height="80" rx="7" fill="#946233" stroke={C} strokeWidth="3" />
      <rect x="142" y="92" width="15" height="80" rx="7" fill="#a8743f" stroke={C} strokeWidth="3" />
      <rect x="139" y="162" width="21" height="12" rx="4" fill="#3a3038" />
      <rect x="51" y="162" width="20" height="12" rx="4" fill="#3a3038" />
      {/* Cuerpo */}
      <ellipse cx="102" cy="82" rx="62" ry="30" fill="#a8743f" stroke={C} strokeWidth="3" />
      {/* Cuello y cabeza */}
      <path fill="#a8743f" stroke={C} strokeWidth="3" strokeLinejoin="round" d="M140 70 C146 50 152 34 164 22 L182 36 C176 50 168 66 160 82 Z" />
      <path fill="#a8743f" stroke={C} strokeWidth="3" strokeLinejoin="round" d="M160 16 C172 10 186 16 194 34 C198 44 192 52 184 50 L168 44 C160 40 154 26 160 16 Z" />
      <path fill="#a8743f" stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M162 18 L160 4 L170 14 Z" />
      <circle cx="176" cy="26" r="3" fill="#2a2022" />
      <circle cx="190" cy="42" r="2" fill="#2a2022" />
      {/* Crin */}
      <path fill="#5c3b22" stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M158 16 C150 26 144 40 138 58 L146 62 C150 46 156 32 166 22 Z" />
    </svg>
  )
}

export default PaseoObjeto
