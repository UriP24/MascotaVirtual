import { useEffect, useRef, useState } from 'react'
import BoltiPerfil from './BoltiPerfil.jsx'
import { apagar, prepararSonidos, sonar } from '../logic/sonidos.js'
import './PaseoInvencible.css'

// La escena de cuando el caballo patea a Bolti (secreto INVENCIBLE), con el juego en pausa:
// 1. impacto · 2. zoom a Bolti tirada en un cráter (mareada, sin lastimarse) · 3. se levanta con
// aura dorada y dice "SOY…" · 4. cartel INVENCIBLE como el de la serie (con letras propias).
const PASOS = [
  { nombre: 'impacto', dura: 500 },
  { nombre: 'tirada', dura: 3000 },
  { nombre: 'levanta', dura: 3800 },
  { nombre: 'titulo', dura: 4800 }, // lo que dura el sonido del cartel
]

// Más altas en el medio, como el título de la serie
const LETRAS = 'INVENCIBLE'.split('')
const TAMANOS = [62, 68, 74, 80, 84, 84, 80, 74, 68, 62]

// Sonido de cada paso (si Uri los cargó en el celu desde el modo prueba)
const SONIDO_DEL_PASO = { impacto: 'patada', levanta: 'transformacion', titulo: 'cartel' }

// Llamas distintas para el aura: se turnan para que parezca que se mueve (cada filtro se dibuja
// una sola vez, porque es pesado para el celu)
const SEMILLAS_AURA = [3, 11, 23]

function PaseoInvencible({ onTerminar }) {
  const [paso, setPaso] = useState(0)
  const [fase, setFase] = useState(0) // para las estrellitas
  const sonidos = useRef(null) // { audios, liberar } cuando están listos
  const pasoRef = useRef(0)

  // Los sonidos se leen del celu al empezar; si el golpe llega tarde, suena igual mientras dure el cráter
  useEffect(() => {
    let vigente = true
    prepararSonidos(Object.values(SONIDO_DEL_PASO)).then((s) => {
      if (!vigente) return s.liberar()
      sonidos.current = s
      if (pasoRef.current <= 1) sonar(s.audios.patada)
    })
    return () => {
      vigente = false
      sonidos.current?.liberar()
    }
  }, [])

  useEffect(() => {
    pasoRef.current = paso
    const audios = sonidos.current?.audios
    const nombre = PASOS[paso]?.nombre
    if (!audios || !SONIDO_DEL_PASO[nombre]) return
    if (nombre === 'titulo') apagar(audios.transformacion) // la transformación se apaga cuando sale el cartel
    sonar(audios[SONIDO_DEL_PASO[nombre]])
  }, [paso])

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
            {/* El aura sale desde el piso, del ancho de Bolti, y sube en punta como una llama */}
            <div className="auras">
              {SEMILLAS_AURA.map((semilla, i) => (
                <svg
                  key={semilla}
                  className="aura"
                  viewBox="0 0 100 200"
                  preserveAspectRatio="none"
                  style={{ filter: `url(#aura-saiyajin-${i})`, animationDelay: `${-i * 0.12}s` }}
                  aria-hidden="true"
                >
                  <path fill="white" d={FORMA_AURA} />
                </svg>
              ))}
            </div>
            <BoltiPerfil pose="parada" fase={fase} invencible />
          </div>
          <FiltrosAura />
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

// La forma del aura: base ancha apoyada en el piso y punta arriba (como la de la serie)
const FORMA_AURA = 'M50 4 C60 40 96 80 97 140 C98 178 84 196 50 196 C16 196 2 178 3 140 C4 80 40 40 50 4 Z'

function FiltrosAura() {
  return (
    <svg width="0" height="0" className="filtro-aura" aria-hidden="true">
      {SEMILLAS_AURA.map((semilla, i) => (
        <FiltroAura key={semilla} id={`aura-saiyajin-${i}`} semilla={semilla} />
      ))}
    </svg>
  )
}

// A la forma se le hacen picos con ruido (que cambia rápido de izquierda a derecha, así los picos
// quedan finitos y para arriba) y se pinta con borde amarillo fuerte, una línea finita oscura
// afuera y el adentro amarillo transparente
function FiltroAura({ id, semilla }) {
  return (
    <filter id={id} x="-25%" y="-20%" width="150%" height="140%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency="0.14 0.02" numOctaves="2" seed={semilla} result="ruidoPicos" />
      <feDisplacementMap in="SourceAlpha" in2="ruidoPicos" scale="44" xChannelSelector="R" yChannelSelector="G" result="conPicos" />
      <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="1" seed={semilla + 7} result="ruidoSuave" />
      <feDisplacementMap in="conPicos" in2="ruidoSuave" scale="14" xChannelSelector="R" yChannelSelector="G" result="picos" />
      <feMorphology in="picos" operator="erode" radius="5" result="adentro" />
      <feComposite in="picos" in2="adentro" operator="out" result="borde" />
      <feMorphology in="picos" operator="dilate" radius="1.5" result="afuera" />
      <feComposite in="afuera" in2="picos" operator="out" result="linea" />
      <feFlood floodColor="#fff47a" floodOpacity="0.5" />
      <feComposite in2="adentro" operator="in" result="relleno" />
      <feFlood floodColor="#ffee3a" />
      <feComposite in2="borde" operator="in" result="bordeAmarillo" />
      <feFlood floodColor="#7a6a1a" floodOpacity="0.8" />
      <feComposite in2="linea" operator="in" result="lineaOscura" />
      <feGaussianBlur in="bordeAmarillo" stdDeviation="3" result="brillo" />
      <feMerge>
        <feMergeNode in="relleno" />
        <feMergeNode in="brillo" />
        <feMergeNode in="bordeAmarillo" />
        <feMergeNode in="lineaOscura" />
      </feMerge>
    </filter>
  )
}

export default PaseoInvencible
