import './BoltiPerfil.css'

// Bolti de perfil (mirando a la derecha) para el minijuego del paseo. Mismo estilo que el dibujo
// de frente: rubia/crema, mancha blanca en la frente, pecho blanco, orejas caídas y cola larga.
// pose: 'corriendo' | 'saltando' (patas recogidas) | 'parada' (quieta) | 'tirada' (en el piso, mareada)
// fase: segundos de juego; las patas, la cola y la oreja se mueven según la fase (así corre
//       aunque el celu tenga "reducir animaciones")
// invencible: brilla dorada · golpe: titila después de chocar
function BoltiPerfil({ pose = 'corriendo', fase = 0, invencible = false, golpe = false }) {
  const clases = ['bolti-perfil', pose, invencible && 'invencible', golpe && 'golpe'].filter(Boolean).join(' ')
  const onda = Math.sin(fase * Math.PI * 2 * 3.2) // 3,2 pasos por segundo
  let patas = [0, 0, 0, 0] // atrás lejos, adelante lejos, atrás cerca, adelante cerca
  if (pose === 'corriendo') patas = [-onda * 28, onda * 28, onda * 28, -onda * 28]
  if (pose === 'saltando') patas = [35, -35, 35, -35]
  const rebote = pose === 'corriendo' ? -Math.abs(onda) * 3 : 0
  const cola = Math.sin(fase * Math.PI * 2 * 2) * 10
  const oreja = pose === 'corriendo' ? -Math.abs(onda) * 12 : pose === 'saltando' ? -25 : 0
  const girar = (grados) => ({ transform: `rotate(${grados}deg)` })
  return (
    <svg className={clases} viewBox="0 0 170 120" role="img" aria-label="Bolti paseando">
      <g className="cuerpo-perfil" style={{ transform: `translateY(${rebote}px)` }}>
        {/* Patas del lado de atrás (más oscuras) */}
        <rect className="pata" style={girar(patas[0])} x="46" y="68" width="12" height="36" rx="6" fill="#d4a46c" stroke={C} strokeWidth="3" />
        <rect className="pata" style={girar(patas[1])} x="104" y="68" width="12" height="36" rx="6" fill="#d4a46c" stroke={C} strokeWidth="3" />
        {/* Cola larga */}
        <path className="cola-perfil" style={girar(cola)} fill="#e8c48f" stroke={C} strokeWidth="3" strokeLinejoin="round" d="M40 58 C22 54 10 42 9 26 C8 19 17 18 18 25 C20 38 30 46 44 50 Z" />
        {/* Cuerpo y pecho blanco */}
        <ellipse cx="78" cy="64" rx="44" ry="23" fill="#e8c48f" stroke={C} strokeWidth="3" />
        <path fill="#fbf4e8" d="M100 50 C116 52 122 66 116 82 C110 86 100 84 98 76 C96 66 96 56 100 50 Z" />
        {/* Patas del lado de adelante */}
        <rect className="pata" style={girar(patas[2])} x="58" y="70" width="13" height="36" rx="6.5" fill="#e8c48f" stroke={C} strokeWidth="3" />
        <rect className="pata" style={girar(patas[3])} x="96" y="70" width="13" height="36" rx="6.5" fill="#e8c48f" stroke={C} strokeWidth="3" />
        {/* Cabeza */}
        <g className="cabeza-perfil">
          <path fill="#e8c48f" stroke={C} strokeWidth="3" d="M96 56 C100 44 108 36 116 32 L124 52 C116 58 106 62 96 56 Z" />
          <path fill="#fbf4e8" d="M104 44 C108 40 112 37 116 35 L118 42 C114 45 108 48 104 50 Z" />
          <circle cx="124" cy="36" r="22" fill="#e8c48f" stroke={C} strokeWidth="3" />
          <ellipse cx="143" cy="45" rx="15" ry="11" fill="#fbf4e8" stroke={C} strokeWidth="3" />
          <path fill="#fbf4e8" d="M121 15 C126 14 130 16 132 20 C136 28 140 34 144 36 L136 40 C130 34 124 26 121 15 Z" />
          <ellipse cx="156" cy="41" rx="5.5" ry="4.5" fill="#2a2022" />
          <path className="lengua-perfil" fill="#f08aa0" stroke="#c9566f" strokeWidth="2" d="M140 54 L148 54 L148 62 C148 67 140 67 140 62 Z" />
          <path fill="none" stroke={C} strokeWidth="2.5" strokeLinecap="round" d="M134 52 Q141 56 150 51" />
          <ellipse cx="127" cy="46" rx="6" ry="4" fill="#f590b2" opacity="0.6" />
          <g className="ojo-perfil">
            <ellipse cx="131" cy="32" rx="4.5" ry="5" fill="#2a2022" />
            <circle cx="132.5" cy="30" r="1.6" fill="#fff" />
          </g>
          <path className="ojo-feliz-perfil" fill="none" stroke="#2a2022" strokeWidth="3.5" strokeLinecap="round" d="M126 33 Q131 27 136 33" />
          {/* Oreja caída */}
          <path className="oreja-perfil" style={girar(oreja)} fill="#e2b77c" stroke={C} strokeWidth="3" strokeLinejoin="round" d="M112 22 C100 24 96 44 101 58 C105 66 115 63 115 53 C117 42 120 30 112 22 Z" />
        </g>
      </g>
      {/* Tirada: estrellitas que giran sobre la cabeza */}
      {pose === 'tirada' && (
        <g className="estrellitas">
          {[0, 120, 240].map((a) => (
            <path
              key={a}
              transform={`rotate(${a + fase * 220} 124 4) translate(124 4) translate(22 0)`}
              fill="#ffd666"
              stroke={C}
              strokeWidth="1.5"
              d="M0 -7 L2 -2 L7 -2 L3 1 L5 7 L0 3 L-5 7 L-3 1 L-7 -2 L-2 -2 Z"
            />
          ))}
        </g>
      )}
    </svg>
  )
}

const C = '#5a3a2a'

export default BoltiPerfil
