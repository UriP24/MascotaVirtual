import { useId } from 'react'

// Una pieza de ropa dibujada en SVG con el mismo estilo que Bolti (contorno marrón, colores planos).
// Las coordenadas son las del dibujo de Bolti (viewBox 300×320): cabeza centrada en (150, 112),
// cuello bajo el mentón en y ≈ 180, pecho hasta y ≈ 255, patas delanteras en x 117–143 y 157–183.
// Cada prenda se arma con una o más piezas (ver dibujos.js): { forma, color, color2, … }

const C = '#5a3a2a' // contorno, igual que Bolti
const T = 3 // grosor del contorno

const ROPA_CUERPO =
  'M112 178 Q150 194 188 178 C200 196 206 222 210 254 Q150 272 90 254 C94 222 100 196 112 178 Z'
const VESTIDO =
  'M114 178 Q150 194 186 178 C196 200 206 228 222 264 Q150 286 78 264 C94 228 104 200 114 178 Z'

function PiezaRopa({ pieza }) {
  const id = useId().replace(/[^a-zA-Z0-9]/g, '')
  const Forma = FORMAS[pieza.forma]
  return Forma ? <Forma {...pieza} id={id} /> : null
}

// ── Cabeza ────────────────────────────────────────────────────────────────

function Mono({ color }) {
  return (
    <g transform="translate(180 64) rotate(18)">
      <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M0 0 C-8 -16 -26 -16 -27 -3 C-28 10 -10 12 0 0 Z" />
      <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M0 0 C8 -16 26 -16 27 -3 C28 10 10 12 0 0 Z" />
      <circle r="6" fill={color} stroke={C} strokeWidth={T} />
    </g>
  )
}

function Flor({ color, x = 104, y = 70, r = 7 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      {[0, 72, 144, 216, 288].map((a) => (
        <circle
          key={a}
          cx={Math.cos((a * Math.PI) / 180) * r * 1.15}
          cy={Math.sin((a * Math.PI) / 180) * r * 1.15}
          r={r}
          fill={color}
          stroke={C}
          strokeWidth="2"
        />
      ))}
      <circle r={r * 0.7} fill="#ffd666" stroke={C} strokeWidth="2" />
    </g>
  )
}

function Gorro({ color, color2 = '#fff8f2', pompon = true, rayas = false, punta = false, id }) {
  const domo = 'M84 96 C82 34 218 34 216 96 Z'
  return (
    <g transform="translate(0 -9)">
      {punta && (
        <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M170 44 C206 46 226 70 236 104 L214 96 C206 76 194 64 176 58 Z" />
      )}
      <clipPath id={`domo${id}`}>
        <path d={domo} />
      </clipPath>
      <path fill={color} stroke={C} strokeWidth={T} d={domo} />
      {rayas && (
        <g clipPath={`url(#domo${id})`} stroke={color2} strokeWidth="7">
          <line x1="70" y1="78" x2="230" y2="78" />
          <line x1="70" y1="60" x2="230" y2="60" />
        </g>
      )}
      <rect x="78" y="84" width="144" height="18" rx="9" fill={color2} stroke={C} strokeWidth={T} />
      {pompon && !punta && <circle cx="150" cy="34" r="11" fill={color2} stroke={C} strokeWidth={T} />}
      {punta && <circle cx="234" cy="106" r="10" fill={color2} stroke={C} strokeWidth={T} />}
    </g>
  )
}

function Gorra({ color, color2 }) {
  return (
    <g transform="translate(0 -16)">
      <path fill={color} stroke={C} strokeWidth={T} d="M88 92 C86 42 214 42 212 92 Z" />
      <path fill={color2} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M150 84 C186 80 218 84 236 96 C218 104 184 102 150 96 Z" />
      <circle cx="150" cy="46" r="5" fill={color2} stroke={C} strokeWidth="2" />
    </g>
  )
}

function Corona({ color = '#f2c14e', chica = false }) {
  const d = chica
    ? 'M126 64 L126 48 L138 56 L150 42 L162 56 L174 48 L174 64 Z'
    : 'M112 64 L112 32 L131 48 L150 24 L169 48 L188 32 L188 64 Z'
  return (
    <g>
      <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d={d} />
      <circle cx="150" cy={chica ? 57 : 54} r={chica ? 3.5 : 5} fill="#ec6f9e" />
      {!chica && <circle cx="127" cy="56" r="3.5" fill="#2bb8b0" />}
      {!chica && <circle cx="173" cy="56" r="3.5" fill="#2bb8b0" />}
    </g>
  )
}

function Vincha({ color, adorno, color2 = color }) {
  return (
    <g>
      {adorno === 'orejas-gato' && (
        <>
          <path fill={color2} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M102 66 L112 28 L136 56 Z" />
          <path fill={color2} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M198 66 L188 28 L164 56 Z" />
          <path fill="#f590b2" d="M110 58 L114 40 L126 54 Z" />
          <path fill="#f590b2" d="M190 58 L186 40 L174 54 Z" />
        </>
      )}
      {adorno === 'orejas-oso' && (
        <>
          <circle cx="108" cy="56" r="16" fill={color2} stroke={C} strokeWidth={T} />
          <circle cx="192" cy="56" r="16" fill={color2} stroke={C} strokeWidth={T} />
          <circle cx="108" cy="56" r="8" fill="#f590b2" />
          <circle cx="192" cy="56" r="8" fill="#f590b2" />
        </>
      )}
      {adorno === 'orejas-ardilla' && (
        <>
          <path fill={color2} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M104 66 C100 44 108 30 118 30 C126 38 130 52 128 60 Z" />
          <path fill={color2} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M196 66 C200 44 192 30 182 30 C174 38 170 52 172 60 Z" />
        </>
      )}
      {adorno === 'cuerno' && (
        <>
          <path fill="#f2c14e" stroke={C} strokeWidth={T} strokeLinejoin="round" d="M140 56 L150 10 L160 56 Z" />
          <path fill="none" stroke={C} strokeWidth="2" d="M143 44 L157 38 M145 32 L155 27" />
          <Flor color="#ffb3d1" x={124} y={58} r={5} />
          <Flor color="#b9a4f3" x={176} y={58} r={5} />
        </>
      )}
      {adorno === 'corazones' && (
        <>
          <path fill="none" stroke={C} strokeWidth="2.5" d="M126 58 Q118 40 124 26 M174 58 Q182 40 176 26" />
          <Corazon x={124} y={22} color={color2} />
          <Corazon x={176} y={22} color={color2} />
        </>
      )}
      {adorno === 'antenas' && (
        <>
          <path fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" d="M128 58 Q118 36 110 24 M172 58 Q182 36 190 24" />
          <circle cx="110" cy="22" r="7" fill={color2} stroke={C} strokeWidth="2.5" />
          <circle cx="190" cy="22" r="7" fill={color2} stroke={C} strokeWidth="2.5" />
        </>
      )}
      {adorno === 'murcielago' && (
        <>
          <path fill={color2} stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M128 56 C116 34 96 30 82 38 C92 42 94 48 92 54 C100 50 106 54 108 60 C114 54 122 54 128 56 Z" />
          <path fill={color2} stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M172 56 C184 34 204 30 218 38 C208 42 206 48 208 54 C200 50 194 54 192 60 C186 54 178 54 172 56 Z" />
        </>
      )}
      {adorno === 'cuernos-reno' && (
        <>
          <path fill="none" stroke="#8a5a32" strokeWidth="7" strokeLinecap="round" d="M118 58 C110 40 108 26 114 12 M112 34 C102 30 96 22 96 14 M182 58 C190 40 192 26 186 12 M188 34 C198 30 204 22 204 14" />
        </>
      )}
      {adorno === 'pinches' && (
        <>
          <path fill={color2} stroke={C} strokeWidth="2.5" strokeLinejoin="round" d="M118 58 L124 36 L134 54 Z M138 52 L150 26 L160 52 Z M166 54 L176 36 L182 58 Z" />
        </>
      )}
      {adorno === 'flores' && (
        <>
          <Flor color="#ffb3d1" x={104} y={78} r={6} />
          <Flor color="#ffd666" x={124} y={60} r={6} />
          <Flor color="#b9a4f3" x={150} y={54} r={6} />
          <Flor color="#9fe3dd" x={176} y={60} r={6} />
          <Flor color="#ffb3d1" x={196} y={78} r={6} />
        </>
      )}
      {adorno !== 'flores' && (
        <path fill="none" stroke={color} strokeWidth="7" strokeLinecap="round" d="M88 100 C92 48 208 48 212 100" />
      )}
    </g>
  )
}

function Corazon({ x, y, color, tam = 1 }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${tam})`}
      fill={color}
      stroke={C}
      strokeWidth="2"
      d="M0 8 C-12 0 -10 -10 -4 -10 C-1 -10 0 -7 0 -5 C0 -7 1 -10 4 -10 C10 -10 12 0 0 8 Z"
    />
  )
}

function Orejeras({ color, color2 }) {
  return (
    <g>
      <path fill="none" stroke={color2} strokeWidth="7" strokeLinecap="round" d="M88 100 C92 44 208 44 212 100" />
      <circle cx="86" cy="104" r="20" fill={color} stroke={C} strokeWidth={T} />
      <circle cx="214" cy="104" r="20" fill={color} stroke={C} strokeWidth={T} />
    </g>
  )
}

function Boina({ color }) {
  return (
    <g transform="rotate(-8 150 60)">
      <ellipse cx="150" cy="60" rx="58" ry="18" fill={color} stroke={C} strokeWidth={T} />
      <path fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" d="M150 42 L154 32" />
    </g>
  )
}

function Sombrero({ tipo, color, color2 }) {
  if (tipo === 'bruja') {
    return (
      <g>
        <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M112 72 C124 50 140 20 166 -4 C170 20 178 50 190 72 Z" />
        <ellipse cx="150" cy="74" rx="88" ry="15" fill={color} stroke={C} strokeWidth={T} />
        <path fill="none" stroke={color2} strokeWidth="7" d="M116 66 Q150 74 186 66" />
      </g>
    )
  }
  if (tipo === 'chef') {
    return (
      <g>
        <path fill="#fff8f2" stroke={C} strokeWidth={T} d="M112 74 C96 66 98 40 118 40 C118 18 146 12 152 28 C160 12 190 18 184 40 C204 40 206 66 188 74 Z" />
        <rect x="112" y="64" width="76" height="16" rx="6" fill="#fff8f2" stroke={C} strokeWidth={T} />
      </g>
    )
  }
  // vaquera / exploradora: ala ancha y copa
  return (
    <g>
      <ellipse cx="150" cy="70" rx="90" ry="16" fill={color} stroke={C} strokeWidth={T} />
      <path fill={color} stroke={C} strokeWidth={T} d="M110 70 C108 30 192 30 190 70 Z" />
      <path fill="none" stroke={color2} strokeWidth="7" d="M112 60 Q150 66 188 60" />
    </g>
  )
}

function Casco({ color }) {
  return (
    <g>
      <circle cx="150" cy="114" r="84" fill="rgb(207 236 255 / 0.14)" stroke={color} strokeWidth="7" />
      <path fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" opacity="0.8" d="M96 70 Q112 48 140 42" />
    </g>
  )
}

function NarizReno() {
  return <circle cx="150" cy="133" r="11" fill="#e8505b" stroke={C} strokeWidth="2.5" />
}

function Antiparras({ color }) {
  return (
    <g>
      <path fill="none" stroke={color} strokeWidth="6" d="M86 76 C110 64 190 64 214 76" />
      <rect x="112" y="58" width="34" height="24" rx="11" fill="#9fe3dd" stroke={C} strokeWidth={T} />
      <rect x="154" y="58" width="34" height="24" rx="11" fill="#9fe3dd" stroke={C} strokeWidth={T} />
    </g>
  )
}

function GorritoCumple() {
  return (
    <g>
      <path fill="#ec6f9e" stroke={C} strokeWidth={T} strokeLinejoin="round" d="M122 62 L178 57 L161 12 Z" />
      <circle cx="146" cy="47" r="4" fill="#fff5f8" />
      <circle cx="163" cy="48" r="4" fill="#fff5f8" />
      <circle cx="157" cy="31" r="3.5" fill="#fff5f8" />
      <path fill="none" stroke="#2bb8b0" strokeWidth="7" strokeLinecap="round" d="M122 62 L178 57" />
      <circle cx="161" cy="11" r="7.5" fill="#ffd666" stroke={C} strokeWidth="2.5" />
    </g>
  )
}

// ── Cara ──────────────────────────────────────────────────────────────────

function Anteojos({ color, sol = false }) {
  const lente = sol ? '#2a2022' : 'rgb(255 255 255 / 0.25)'
  return (
    <g>
      <path fill="none" stroke={color} strokeWidth="3.5" d="M104 106 L90 100 M196 106 L210 100 M138 108 Q150 100 162 108" />
      <circle cx="121" cy="110" r="17" fill={lente} stroke={color} strokeWidth="4" />
      <circle cx="179" cy="110" r="17" fill={lente} stroke={color} strokeWidth="4" />
      {sol && <path fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.7" d="M112 104 L118 99 M170 104 L176 99" />}
    </g>
  )
}

function Antifaz({ color }) {
  return (
    <path
      fill={color}
      fillRule="evenodd"
      stroke={C}
      strokeWidth="2.5"
      d="M96 104 C108 90 140 94 150 102 C160 94 192 90 204 104 C206 124 182 130 168 122 L150 114 L132 122 C118 130 94 124 96 104 Z M121 98 a11 13 0 1 0 0.1 0 Z M179 98 a11 13 0 1 0 0.1 0 Z"
    />
  )
}

// ── Cuello ────────────────────────────────────────────────────────────────

function Collar({ color, dije }) {
  return (
    <g>
      <path fill="none" stroke={C} strokeWidth="13" strokeLinecap="round" d="M106 176 Q150 202 194 176" />
      <path fill="none" stroke={color} strokeWidth="8" strokeLinecap="round" d="M106 176 Q150 202 194 176" />
      {dije === 'cascabel' && (
        <g>
          <circle cx="150" cy="200" r="9" fill="#ffd666" stroke={C} strokeWidth="2.5" />
          <path stroke={C} strokeWidth="2" d="M150 202 L150 208" />
        </g>
      )}
      {dije === 'corazon' && <Corazon x={150} y={204} color="#ec6f9e" tam={1.1} />}
      {dije === 'hueso' && (
        <g>
          <path fill="#f2c14e" stroke={C} strokeWidth="2.5" d="M134 198 a5 5 0 1 1 5 -6 L161 192 a5 5 0 1 1 5 6 a5 5 0 1 1 -5 6 L139 204 a5 5 0 1 1 -5 -6 Z" />
          <text x="150" y="201" fontSize="7" fontWeight="800" textAnchor="middle" fill={C}>
            BOLTI
          </text>
        </g>
      )}
    </g>
  )
}

function Bufanda({ color, color2, id }) {
  const banda = 'M98 168 Q150 206 202 168 L206 186 Q150 226 94 186 Z'
  const cola = 'M168 192 L192 188 L196 240 L172 244 Z'
  return (
    <g>
      <clipPath id={`buf${id}`}>
        <path d={banda} />
        <path d={cola} />
      </clipPath>
      <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d={cola} />
      <path fill={color} stroke={C} strokeWidth={T} d={banda} />
      {color2 && (
        <g clipPath={`url(#buf${id})`} stroke={color2} strokeWidth="5">
          <line x1="120" y1="160" x2="110" y2="210" />
          <line x1="150" y1="170" x2="150" y2="220" />
          <line x1="180" y1="160" x2="190" y2="210" />
          <line x1="160" y1="216" x2="210" y2="210" />
        </g>
      )}
      <path fill="none" stroke={C} strokeWidth="2.5" strokeLinecap="round" d="M176 244 L176 252 M184 243 L185 251 M192 242 L194 250" />
    </g>
  )
}

function Panuelo({ color, color2 = '#fff8f2' }) {
  return (
    <g>
      <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M106 178 Q150 196 194 178 L150 228 Z" />
      <circle cx="140" cy="196" r="3" fill={color2} />
      <circle cx="160" cy="196" r="3" fill={color2} />
      <circle cx="150" cy="210" r="3" fill={color2} />
    </g>
  )
}

function Babero() {
  return (
    <g>
      <path fill="#fff8f2" stroke="#ec6f9e" strokeWidth="4" d="M112 182 Q150 198 188 182 C192 214 174 238 150 238 C126 238 108 214 112 182 Z" />
      <path fill="#f59a3c" d="M138 214 C134 206 146 202 150 208 C156 202 166 210 160 218 C156 224 140 222 138 214 Z" />
    </g>
  )
}

// ── Cuerpo ────────────────────────────────────────────────────────────────

function Prenda({ color, color2 = '#fff8f2', patron, vestido = false, mangas = true, id }) {
  const d = vestido ? VESTIDO : ROPA_CUERPO
  return (
    <g>
      <clipPath id={`ropa${id}`}>
        <path d={d} />
      </clipPath>
      {mangas && (
        <g fill={patron === 'pelaje' ? '#fff8f2' : color} stroke={C} strokeWidth={T}>
          <rect x="115" y="236" width="30" height="38" rx="11" />
          <rect x="155" y="236" width="30" height="38" rx="11" />
        </g>
      )}
      <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d={d} />
      <g clipPath={`url(#ropa${id})`}>
        <Patron patron={patron} color2={color2} />
      </g>
      {patron === 'bolsillo' && <path fill={color} stroke={C} strokeWidth="2.5" d="M124 226 L176 226 L170 248 L130 248 Z" />}
      {patron === 'botones' && (
        <g fill={color2} stroke={C} strokeWidth="2">
          <circle cx="150" cy="206" r="4" />
          <circle cx="150" cy="224" r="4" />
          <circle cx="150" cy="242" r="4" />
        </g>
      )}
      {patron === 'emblema' && (
        <g>
          <path fill={color2} stroke={C} strokeWidth="2.5" d="M150 198 L172 210 L164 238 L150 246 L136 238 L128 210 Z" />
          <text x="150" y="232" fontSize="24" fontWeight="900" textAnchor="middle" fill={color}>
            B
          </text>
        </g>
      )}
      {patron === 'cinturon' && (
        <g>
          <path fill="none" stroke={color2} strokeWidth="8" d="M96 238 Q150 252 204 238" />
          <path fill={color2} stroke={C} strokeWidth="2" d="M146 246 L136 266 L144 266 L150 252 L156 266 L164 266 L154 246 Z" />
        </g>
      )}
      {patron === 'pelaje' && (
        <path fill="none" stroke="#fff8f2" strokeWidth="10" strokeLinecap="round" d={vestido ? 'M82 262 Q150 284 218 262' : 'M92 252 Q150 270 208 252'} />
      )}
    </g>
  )
}

function Patron({ patron, color2 }) {
  if (patron === 'rayas') {
    return (
      <g stroke={color2} strokeWidth="7">
        {[192, 210, 228, 246].map((y) => (
          <line key={y} x1="80" y1={y} x2="220" y2={y} />
        ))}
      </g>
    )
  }
  if (patron === 'argentina') {
    return (
      <g>
        {[112, 136, 160, 184].map((x) => (
          <rect key={x} x={x} y="170" width="12" height="110" fill="#fff8f2" />
        ))}
        <circle cx="150" cy="214" r="8" fill="#f2c14e" stroke={C} strokeWidth="1.5" />
      </g>
    )
  }
  if (patron === 'tejido') {
    return (
      <g fill="none" stroke={color2} strokeWidth="3">
        {[200, 222, 244].map((y) => (
          <path key={y} d={`M80 ${y} l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8 l10 -8 l10 8`} />
        ))}
      </g>
    )
  }
  if (patron === 'corazones') {
    return (
      <g>
        <Corazon x={128} y={208} color={color2} />
        <Corazon x={172} y={204} color={color2} />
        <Corazon x={150} y={232} color={color2} />
      </g>
    )
  }
  if (patron === 'acolchado') {
    return (
      <g fill="none" stroke={C} strokeWidth="2" opacity="0.5">
        <path d="M80 202 Q150 214 220 202 M80 226 Q150 238 220 226" />
      </g>
    )
  }
  if (patron === 'abeja') {
    return (
      <g fill="#3a3038">
        <rect x="80" y="200" width="140" height="12" />
        <rect x="80" y="228" width="140" height="12" />
      </g>
    )
  }
  if (patron === 'calabaza') {
    return (
      <g fill="none" stroke="#d9772a" strokeWidth="3">
        <path d="M130 184 Q118 220 128 262 M170 184 Q182 220 172 262 M150 190 L150 266" />
      </g>
    )
  }
  if (patron === 'ositos') {
    return (
      <g fill={color2}>
        {[
          [126, 210],
          [172, 206],
          [150, 236],
        ].map(([x, y]) => (
          <g key={x}>
            <circle cx={x} cy={y} r="6" />
            <circle cx={x - 5} cy={y - 5} r="3" />
            <circle cx={x + 5} cy={y - 5} r="3" />
          </g>
        ))}
      </g>
    )
  }
  if (patron === 'bolsillos') {
    return (
      <g fill="none" stroke={C} strokeWidth="2">
        <rect x="118" y="200" width="20" height="16" rx="2" />
        <rect x="162" y="200" width="20" height="16" rx="2" />
      </g>
    )
  }
  if (patron === 'parches') {
    return (
      <g>
        <rect x="160" y="200" width="18" height="12" rx="2" fill="#5b9bd5" />
        <circle cx="128" cy="206" r="6" fill="#e8505b" />
      </g>
    )
  }
  return null
}

function Flotador() {
  return (
    <g>
      <ellipse cx="150" cy="258" rx="74" ry="20" fill="none" stroke={C} strokeWidth="24" />
      <ellipse cx="150" cy="258" rx="74" ry="20" fill="none" stroke="#ffd666" strokeWidth="18" />
      <path fill="none" stroke="#ec6f9e" strokeWidth="18" strokeDasharray="22 40" d="M76 258 A74 20 0 0 0 224 258" />
      <circle cx="80" cy="244" r="12" fill="#ffd666" stroke={C} strokeWidth="2.5" />
      <path fill="#f59a3c" stroke={C} strokeWidth="2" d="M68 244 L60 247 L68 250 Z" />
      <circle cx="77" cy="241" r="2" fill={C} />
    </g>
  )
}

function Capa({ color }) {
  return <path fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round" d="M104 176 C72 220 60 268 64 302 L236 302 C240 268 228 220 196 176 Z" />
}

// Los bordes de la capa que caen sobre los hombros, por delante del cuerpo
function Hombros({ color }) {
  return (
    <g fill={color} stroke={C} strokeWidth={T} strokeLinejoin="round">
      <path d="M108 176 L126 184 C116 206 106 230 98 252 L90 248 C94 222 98 198 108 176 Z" />
      <path d="M192 176 L174 184 C184 206 194 230 202 252 L210 248 C206 222 202 198 192 176 Z" />
    </g>
  )
}

function Broche({ color = '#f2c14e' }) {
  return (
    <g fill={color} stroke={C} strokeWidth="2">
      <circle cx="112" cy="182" r="6" />
      <circle cx="188" cy="182" r="6" />
    </g>
  )
}

function Alas({ tipo, color, color2 = color }) {
  if (tipo === 'mariposa') {
    return (
      <g stroke={C} strokeWidth={T} strokeLinejoin="round">
        <path fill={color} d="M110 200 C70 150 30 170 40 210 C46 232 80 236 110 222 Z" />
        <path fill={color} d="M190 200 C230 150 270 170 260 210 C254 232 220 236 190 222 Z" />
        <path fill={color2} d="M108 226 C80 236 60 262 76 274 C90 284 106 262 112 238 Z" />
        <path fill={color2} d="M192 226 C220 236 240 262 224 274 C210 284 194 262 188 238 Z" />
      </g>
    )
  }
  // plumas (cupido) o transparentes (abeja, hada)
  return (
    <g stroke={C} strokeWidth="2.5" strokeLinejoin="round">
      <path fill={color} d="M106 200 C80 170 54 172 50 190 C66 192 60 204 74 208 C64 214 74 226 90 222 C96 226 104 222 108 214 Z" />
      <path fill={color} d="M194 200 C220 170 246 172 250 190 C234 192 240 204 226 208 C236 214 226 226 210 222 C204 226 196 222 192 214 Z" />
    </g>
  )
}

// ── Patitas ───────────────────────────────────────────────────────────────

function Medias({ color, color2 }) {
  return (
    <g>
      {[129, 171].map((x) => (
        <g key={x}>
          <rect x={x - 15} y="266" width="30" height="32" rx="11" fill={color} stroke={C} strokeWidth={T} />
          <ellipse cx={x} cy="298" rx="18" ry="10" fill={color} stroke={C} strokeWidth={T} />
          {color2 && (
            <g stroke={color2} strokeWidth="4">
              <line x1={x - 13} y1="276" x2={x + 13} y2="276" />
              <line x1={x - 14} y1="286" x2={x + 14} y2="286" />
            </g>
          )}
        </g>
      ))}
    </g>
  )
}

function Botitas({ color }) {
  return (
    <g>
      {[129, 171].map((x) => (
        <g key={x}>
          <rect x={x - 16} y="262" width="32" height="38" rx="11" fill={color} stroke={C} strokeWidth={T} />
          <ellipse cx={x} cy="301" rx="20" ry="8" fill="#3a3038" stroke={C} strokeWidth="2.5" />
        </g>
      ))}
    </g>
  )
}

function Guantes({ color, color2 = '#fff8f2' }) {
  return (
    <g>
      {[129, 171].map((x) => (
        <g key={x}>
          <ellipse cx={x} cy="295" rx="19" ry="12" fill={color} stroke={C} strokeWidth={T} />
          <rect x={x - 15} y="280" width="30" height="9" rx="4" fill={color2} stroke={C} strokeWidth="2" />
        </g>
      ))}
    </g>
  )
}

const FORMAS = {
  cumple: GorritoCumple,
  mono: Mono,
  flor: Flor,
  gorro: Gorro,
  gorra: Gorra,
  corona: Corona,
  vincha: Vincha,
  orejeras: Orejeras,
  boina: Boina,
  sombrero: Sombrero,
  casco: Casco,
  'nariz-reno': NarizReno,
  antiparras: Antiparras,
  anteojos: Anteojos,
  antifaz: Antifaz,
  collar: Collar,
  bufanda: Bufanda,
  panuelo: Panuelo,
  babero: Babero,
  prenda: Prenda,
  flotador: Flotador,
  capa: Capa,
  hombros: Hombros,
  broche: Broche,
  alas: Alas,
  medias: Medias,
  botitas: Botitas,
  guantes: Guantes,
}

export default PiezaRopa
