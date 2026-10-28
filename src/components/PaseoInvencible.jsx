import { useEffect, useState } from 'react'
import BoltiPerfil from './BoltiPerfil.jsx'
import './PaseoInvencible.css'

// La escena de cuando el caballo patea a Bolti (secreto INVENCIBLE), con el juego en pausa:
// 1. impacto · 2. zoom a Bolti tirada en un cráter (mareada, sin lastimarse) · 3. se levanta con
// aura dorada y dice "SOY…" · 4. cartel INVENCIBLE como el de la serie (con letras propias).
const PASOS = [
  { nombre: 'impacto', dura: 350 },
  { nombre: 'tirada', dura: 1900 },
  { nombre: 'levanta', dura: 1700 },
  { nombre: 'titulo', dura: 2300 },
]

// Más altas en el medio, como el título de la serie
const LETRAS = 'INVENCIBLE'.split('')
const TAMANOS = [62, 68, 74, 80, 84, 84, 80, 74, 68, 62]

function PaseoInvencible({ onTerminar }) {
  const [paso, setPaso] = useState(0)
  const [fase, setFase] = useState(0) // para las estrellitas y el aura

  useEffect(() => {
    if (paso >= PASOS.length) {
      onTerminar()
      return
    }
    const timer = setTimeout(() => setPaso((p) => p + 1), PASOS[paso].dura)
    return () => clearTimeout(timer)
  }, [paso, onTerminar])

  useEffect(() => {
    const inicio = performance.now()
    let id = requestAnimationFrame(function cuadro(ahora) {
      setFase((ahora - inicio) / 1000)
      id = requestAnimationFrame(cuadro)
    })
    return () => cancelAnimationFrame(id)
  }, [])

  const actual = PASOS[paso]?.nombre

  return (
    <div className={`paseo-invencible ${actual ?? ''}`} aria-live="polite">
      {actual === 'impacto' && <div className="destello" />}

      {actual === 'tirada' && (
        <div className="escena crater">
          <div className="zoom">
            <div className="agujero" />
            <div className="piedritas" />
            <div className="bolti-tirada">
              <BoltiPerfil pose="tirada" fase={fase} />
            </div>
          </div>
        </div>
      )}

      {actual === 'levanta' && (
        <div className="escena aura-fondo">
          <div className="bolti-parada">
            <div className="aura">
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <span key={i} style={{ '--i': i, transform: `scaleY(${1 + Math.sin(fase * 14 + i) * 0.12})` }} />
              ))}
            </div>
            <BoltiPerfil pose="parada" fase={fase} invencible />
          </div>
          <span className="globo-soy-grande">SOY…</span>
        </div>
      )}

      {actual === 'titulo' && (
        <div className="escena titulo">
          <svg viewBox="0 0 420 200" className="cartel-serie" role="img" aria-label="INVENCIBLE">
            <defs>
              <path id="arco-invencible" d="M 14 150 Q 210 70 406 150" />
              <linearGradient id="relleno-invencible" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#ffd9e7" />
                <stop offset="1" stopColor="#ec6f9e" />
              </linearGradient>
            </defs>
            {/* Sombra turquesa, corrida abajo a la derecha */}
            <text className="sombra" transform="translate(7 7)">
              <textPath href="#arco-invencible" startOffset="50%" textAnchor="middle" textLength="370" lengthAdjust="spacingAndGlyphs">
                {LETRAS.map((l, i) => (
                  <tspan key={i} fontSize={TAMANOS[i]}>
                    {l}
                  </tspan>
                ))}
              </textPath>
            </text>
            <text className="letras">
              <textPath href="#arco-invencible" startOffset="50%" textAnchor="middle" textLength="370" lengthAdjust="spacingAndGlyphs">
                {LETRAS.map((l, i) => (
                  <tspan key={i} fontSize={TAMANOS[i]}>
                    {l}
                  </tspan>
                ))}
              </textPath>
            </text>
          </svg>
        </div>
      )}
    </div>
  )
}

export default PaseoInvencible
