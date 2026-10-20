import { useEffect, useRef, useState } from 'react'
import './Bolti.css'

// Bolti dibujada en SVG por partes (cabeza, orejas, ojos, boca, cola…). Cada parte se anima
// por separado con CSS, y las expresiones se arman mostrando u ocultando partes según el humor.
//
// Props:
// - animo: 'contenta' | 'hambre' | 'triste' | 'dormida'
// - mimos: true mientras le hacen mimos (ojitos felices, cola rápida)
// - saltos: un contador; cada vez que aumenta, Bolti da un saltito
// - el resto (onPointerDown, etc.) se pasa al <svg>
function Bolti({ animo, mimos = false, saltos = 0, ...resto }) {
  const svgRef = useRef(null)
  const ojosRef = useRef(null)
  const [parpadeo, setParpadeo] = useState(false)
  const [ladea, setLadea] = useState(false)

  // Parpadea cada tanto, al azar, para parecer viva.
  useEffect(() => {
    let timer
    function siguiente() {
      timer = setTimeout(() => {
        setParpadeo(true)
        timer = setTimeout(() => {
          setParpadeo(false)
          siguiente()
        }, 130)
      }, 1800 + Math.random() * 3500)
    }
    siguiente()
    return () => clearTimeout(timer)
  }, [])

  // Cada tanto ladea la cabeza, solo si está contenta.
  useEffect(() => {
    if (animo !== 'contenta') return
    let timer
    function siguiente() {
      timer = setTimeout(() => {
        setLadea(true)
        timer = setTimeout(() => {
          setLadea(false)
          siguiente()
        }, 1400)
      }, 5000 + Math.random() * 6000)
    }
    siguiente()
    return () => clearTimeout(timer)
  }, [animo])

  // Los ojos siguen el dedo o el mouse. Movemos el grupo directo (sin estado) para no
  // redibujar todo el componente con cada movimiento.
  useEffect(() => {
    function mirar(e) {
      const svg = svgRef.current
      const ojos = ojosRef.current
      if (!svg || !ojos) return
      const r = svg.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width * 0.5)
      const dy = e.clientY - (r.top + r.height * 0.34)
      const distancia = Math.hypot(dx, dy) || 1
      const fuerza = Math.min(1, distancia / 200) * 4
      ojos.setAttribute('transform', `translate(${(dx / distancia) * fuerza} ${(dy / distancia) * fuerza})`)
    }
    window.addEventListener('pointermove', mirar)
    return () => window.removeEventListener('pointermove', mirar)
  }, [])

  const clases = ['bolti', parpadeo && 'parpadeo', ladea && 'ladea', mimos && 'mimos']
    .filter(Boolean)
    .join(' ')

  return (
    <svg ref={svgRef} className={clases} viewBox="0 0 300 320" data-animo={animo} role="img" aria-label={`Bolti, ${animo}`} {...resto}>
      <ellipse cx="150" cy="304" rx="92" ry="11" fill="rgb(63 53 64 / 0.12)" />
      {/* Saltito: al cambiar la key, React vuelve a crear el grupo y la animación arranca de nuevo */}
      <g key={saltos} className={saltos > 0 ? 'saltito' : undefined}>
      <g className="cuerpo">
        <path className="cola contorno" fill="#e8c48f" d="M200 252 C246 246 274 210 268 166 C266 152 252 152 252 166 C255 200 238 226 198 234 Z" />
        <ellipse className="contorno" cx="104" cy="266" rx="38" ry="34" fill="#e2b97f" />
        <ellipse className="contorno" cx="196" cy="266" rx="38" ry="34" fill="#e2b97f" />
        <ellipse className="contorno" cx="150" cy="232" rx="62" ry="68" fill="#e8c48f" />
        <ellipse cx="150" cy="222" rx="34" ry="50" fill="#fbf4e8" />
        <ellipse cx="150" cy="168" rx="44" ry="16" fill="#fbf4e8" />
        <rect className="contorno" x="117" y="246" width="26" height="52" rx="13" fill="#e8c48f" />
        <rect className="contorno" x="157" y="246" width="26" height="52" rx="13" fill="#e8c48f" />
        <ellipse className="contorno" cx="129" cy="298" rx="17" ry="9" fill="#efd3a5" />
        <ellipse className="contorno" cx="171" cy="298" rx="17" ry="9" fill="#efd3a5" />

        <g className="cabeza">
          <path className="oreja oreja-izq contorno" fill="#e2b77c" d="M92 78 C60 80 44 130 58 172 C66 192 92 186 98 162 C104 132 108 96 92 78 Z" />
          <path className="oreja oreja-der contorno" fill="#e2b77c" d="M208 78 C240 80 256 130 242 172 C234 192 208 186 202 162 C196 132 192 96 208 78 Z" />
          <ellipse className="contorno" cx="150" cy="112" rx="68" ry="60" fill="#e8c48f" />
          <path fill="#fbf4e8" d="M142 54 C146 52 154 52 158 54 L161 100 C168 114 176 124 178 138 L122 138 C124 124 132 114 139 100 Z" />
          <ellipse cx="150" cy="146" rx="38" ry="27" fill="#fbf4e8" />
          <ellipse cx="106" cy="134" rx="12" ry="7" fill="#f6a3bd" opacity="0.55" />
          <ellipse cx="194" cy="134" rx="12" ry="7" fill="#f6a3bd" opacity="0.55" />

          <g ref={ojosRef}>
            <g className="ojos-normales">
              <g className="ojo">
                <ellipse cx="121" cy="110" rx="10" ry="12" fill="#2a2022" />
                <circle cx="124.5" cy="105.5" r="3.6" fill="#fff" />
                <circle cx="118" cy="114" r="1.6" fill="#fff" />
              </g>
              <g className="ojo">
                <ellipse cx="179" cy="110" rx="10" ry="12" fill="#2a2022" />
                <circle cx="182.5" cy="105.5" r="3.6" fill="#fff" />
                <circle cx="176" cy="114" r="1.6" fill="#fff" />
              </g>
            </g>
          </g>
          <g className="ojos-felices" fill="none" stroke="#2a2022" strokeWidth="4.5" strokeLinecap="round">
            <path d="M110 114 Q121 100 132 114" />
            <path d="M168 114 Q179 100 190 114" />
          </g>
          <g className="ojos-dormidos" fill="none" stroke="#2a2022" strokeWidth="4" strokeLinecap="round">
            <path d="M110 110 Q121 120 132 110" />
            <path d="M168 110 Q179 120 190 110" />
          </g>
          <g className="cejas-tristes" fill="none" stroke="#5a3a2a" strokeWidth="3.5" strokeLinecap="round">
            <path d="M108 92 L130 86" />
            <path d="M192 92 L170 86" />
          </g>
          <path className="lagrima" fill="#8fd8f0" d="M116 124 C112 132 112 138 117 139 C122 138 121 132 116 124 Z" />

          <path fill="#2a2022" d="M139 132 C139 125 161 125 161 132 C161 139 154 144 150 144 C146 144 139 139 139 132 Z" />
          <ellipse cx="146" cy="130" rx="3.5" ry="2" fill="#fff" opacity="0.7" />
          <path className="boca-cerrada" fill="none" stroke="#5a3a2a" strokeWidth="3" strokeLinecap="round" d="M150 144 L150 150 M136 150 Q143 158 150 150 Q157 158 164 150" />
          <path className="boca-abierta" fill="#7a2f3a" stroke="#5a3a2a" strokeWidth="3" d="M136 150 Q150 172 164 150 Q150 156 136 150 Z" />
          <path className="lengua" fill="#f08aa0" stroke="#c9566f" strokeWidth="2" d="M144 153 L156 153 L156 162 C156 168 144 168 144 162 Z" />
          <g className="zzz">
            <text x="210" y="60" fontSize="22">z</text>
            <text x="226" y="44" fontSize="18">z</text>
            <text x="240" y="30" fontSize="14">z</text>
          </g>
        </g>
      </g>
      </g>
    </svg>
  )
}

export default Bolti
