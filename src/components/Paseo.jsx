import { useCallback, useEffect, useRef, useState } from 'react'
import BoltiPerfil from './BoltiPerfil.jsx'
import PaseoObjeto from './PaseoObjeto.jsx'
import PaseoInvencible from './PaseoInvencible.jsx'
import { JUEGOS } from '../config.js'
import { X_BOLTI, cajaDeCosa, cajasDeBolti, crearJuego, enElPiso, invencible, paso, puntajeFinal, saltar, segundosRestantes } from '../logic/paseo.js'
import { formatearPuntaje } from '../logic/puntaje.js'
import './Paseo.css'

const CUENTA_REGRESIVA = 3
const PISO = 0.2 // alto de la vereda (proporción del alto de la pantalla)
const ANCHO_BOLTI = 0.3 // ancho del dibujo de Bolti (proporción del ancho)
// Ancho del dibujo de cada cosa (un poco más grande que su "caja" de choque)
const ANCHO_DIBUJO = { charco: 0.19, gato: 0.13, bici: 0.21, hueso: 0.12, dorado: 0.12, caballo: 0.52 }

// Minijuego "Paseo con Bolti": Bolti corre por el barrio y se toca para saltar.
// La simulación vive en logic/paseo.js; acá solo se dibuja y se maneja el toque.
// verCajas (modo prueba): dibuja las cajas de choque para revisarlas
function Paseo({ onTerminar, caballoSeguro = false, verCajas = false }) {
  const [juegoInicial] = useState(() => crearJuego(Math.random, caballoSeguro))
  const juegoRef = useRef(juegoInicial)
  const areaRef = useRef(null)
  const [juego, setJuego] = useState(juegoInicial)
  const [tamano, setTamano] = useState({ ancho: 360, alto: 700 })
  const [cuenta, setCuenta] = useState(CUENTA_REGRESIVA)
  const [pausado, setPausado] = useState(false)
  const [textos, setTextos] = useState([])
  const [escena, setEscena] = useState(false) // la escena de la patada del caballo (INVENCIBLE)
  const terminarRef = useRef(onTerminar)
  useEffect(() => {
    terminarRef.current = onTerminar
  })

  // Medidas de la pantalla (todo se dibuja en proporción al ancho)
  useEffect(() => {
    const area = areaRef.current
    const medir = () => setTamano({ ancho: area.clientWidth, alto: area.clientHeight })
    medir()
    const observador = new ResizeObserver(medir)
    observador.observe(area)
    return () => observador.disconnect()
  }, [])

  useEffect(() => {
    if (cuenta <= 0) return
    const timer = setTimeout(() => setCuenta((c) => c - 1), 800)
    return () => clearTimeout(timer)
  }, [cuenta])

  // Si la app pasa a segundo plano, se pausa sola
  useEffect(() => {
    function alCambiar() {
      if (document.visibilityState === 'hidden') setPausado(true)
    }
    document.addEventListener('visibilitychange', alCambiar)
    return () => document.removeEventListener('visibilitychange', alCambiar)
  }, [])

  // El bucle del juego: un paso por cuadro de animación
  useEffect(() => {
    if (cuenta > 0 || pausado || escena) return
    let anterior = performance.now()
    let id = requestAnimationFrame(function cuadro(ahora) {
      const dt = Math.min(0.05, (ahora - anterior) / 1000)
      anterior = ahora
      const j = paso(juegoRef.current, dt)
      juegoRef.current = j
      if (j.eventos.length > 0) {
        if (j.eventos.some((ev) => ev.tipo === 'choque')) navigator.vibrate?.([40, 30, 40])
        const nuevos = j.eventos
          .filter((ev) => ev.gana)
          .map((ev, i) => ({
            id: `${j.t}-${i}`,
            texto: ev.tipo === 'esquiva' ? `¡Esquivada! +${ev.gana}` : `+${ev.gana}`,
            dorado: ev.tipo === 'dorado' || ev.tipo === 'esquiva',
          }))
        if (nuevos.length > 0) {
          setTextos((lista) => [...lista, ...nuevos])
          setTimeout(() => setTextos((lista) => lista.filter((t) => !nuevos.includes(t))), 700)
        }
      }
      setJuego(j)
      // ¡La pateó el caballo! Se pausa el juego y arranca la escena
      if (j.eventos.some((ev) => ev.tipo === 'patada')) {
        navigator.vibrate?.([60, 40, 120])
        setEscena(true)
        return
      }
      if (j.terminado) {
        terminarRef.current(resultado(j))
        return
      }
      id = requestAnimationFrame(cuadro)
    })
    return () => cancelAnimationFrame(id)
  }, [cuenta, pausado, escena])

  const terminarEscena = useCallback(() => setEscena(false), [])

  function resultado(j) {
    return { puntaje: puntajeFinal(j), huesos: j.huesos, saltados: j.saltados, patadas: j.patadas }
  }

  function tocar() {
    if (cuenta > 0 || pausado) return
    juegoRef.current = saltar(juegoRef.current)
  }

  const { ancho, alto } = tamano
  const piso = alto * PISO
  const anchoBolti = ancho * ANCHO_BOLTI
  const altoBolti = anchoBolti * (120 / 170)
  const pose = enElPiso(juego) ? 'corriendo' : 'saltando'

  return (
    <div className="paseo" ref={areaRef} onPointerDown={tocar}>
      <div className={`fondo ${pausado || cuenta > 0 ? 'quieto' : ''}`} aria-hidden="true">
        <span className="sol" />
        <span className="nube n1" />
        <span className="nube n2" />
        <span className="arboles" />
        <span className="vereda" style={{ height: piso }} />
      </div>

      <div className="marcador">
        <span>⏱ {segundosRestantes(juego)}</span>
        <span>
          ⭐ {formatearPuntaje(juego.puntos)}
          {invencible(juego) && <b className="doble"> ×2</b>}
        </span>
        <span className="vidas" aria-label={`${juego.vidas} vidas`}>
          {'❤️'.repeat(Math.max(0, juego.vidas))}
          {'🤍'.repeat(JUEGOS.PASEO_VIDAS - Math.max(0, juego.vidas))}
        </span>
        <button
          className="pausa"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={() => setPausado(true)}
          aria-label="Pausar"
        >
          ⏸️
        </button>
      </div>

      {juego.items.map((it) => {
        const anchoDibujo = ancho * ANCHO_DIBUJO[it.tipo]
        return (
          <div
            key={it.id}
            className={`cosa-paseo ${it.tipo}`}
            style={{ left: it.x * ancho - anchoDibujo / 2, bottom: piso + it.altura * ancho, width: anchoDibujo }}
            aria-hidden="true"
          >
            <PaseoObjeto tipo={it.tipo} preparando={Boolean(it.preparando)} pateando={Boolean(it.pateo)} />
          </div>
        )
      })}

      {juego.items
        .filter((it) => it.tipo === 'caballo' && it.preparando && !it.pateo) // levantó la pata: ¡saltá!
        .map((it) => (
          <span
            key={`aviso-${it.id}`}
            className="aviso-caballo"
            style={{ left: (it.x - ANCHO_DIBUJO.caballo * 0.3) * ancho, bottom: piso + ancho * 0.48 }}
            aria-hidden="true"
          >
            ❗
          </span>
        ))}

      <div
        className="bolti-paseo"
        style={{
          left: X_BOLTI * ancho - anchoBolti * 0.46,
          bottom: piso + juego.y * ancho - altoBolti * (12 / 120),
          width: anchoBolti,
        }}
      >
        <BoltiPerfil pose={pose} fase={juego.t} invencible={invencible(juego)} golpe={juego.t < juego.golpeHasta} />
      </div>

      {textos.map((t) => (
        <span
          key={t.id}
          className={`texto-paseo ${t.dorado ? 'dorado' : ''}`}
          style={{ left: X_BOLTI * ancho, bottom: piso + altoBolti + juego.y * ancho }}
          aria-hidden="true"
        >
          {t.texto}
        </span>
      ))}

      {verCajas &&
        [...cajasDeBolti(juego.y), ...juego.items.filter((it) => it.tipo !== 'caballo').map((it) => cajaDeCosa(it))].map((c, i) => (
          <span
            key={i}
            className="caja-choque"
            style={{ left: c.x1 * ancho, bottom: piso + c.y1 * ancho, width: (c.x2 - c.x1) * ancho, height: (c.y2 - c.y1) * ancho }}
            aria-hidden="true"
          />
        ))}

      {escena && <PaseoInvencible onTerminar={terminarEscena} />}

      {cuenta > 0 && (
        <div className="cartel">
          <span className="numero">{cuenta}</span>
          <small>Tocá la pantalla para saltar · Juntá huesitos 🦴</small>
        </div>
      )}
      {pausado && (
        <div className="cartel" onPointerDown={(e) => e.stopPropagation()}>
          <strong>⏸️ Pausa</strong>
          <button onClick={() => setPausado(false)}>▶ Seguir</button>
          <button className="secundario" onClick={() => onTerminar(resultado(juegoRef.current))}>
            Terminar acá
          </button>
        </div>
      )}
    </div>
  )
}

export default Paseo
