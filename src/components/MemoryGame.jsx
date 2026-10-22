import { useEffect, useRef, useState } from 'react'
import Bolti from './Bolti.jsx'
import { avanzar, configNivel, crearPartida, seVe, tocarCarta } from '../logic/memoria.js'
import { formatearPuntaje } from '../logic/puntaje.js'
import './MemoryGame.css'

// Minijuego "Memoria de Bolti": encontrar los pares de cosas de su vida antes de que se acabe el tiempo.
// La simulación vive en logic/memoria.js; acá se dibuja y se manejan los toques.
function MemoryGame({ onTerminar }) {
  const [partidaInicial] = useState(crearPartida)
  const partidaRef = useRef(partidaInicial)
  const [partida, setPartida] = useState(partidaInicial)
  const [pausado, setPausado] = useState(false)
  const [cartel, setCartel] = useState(null) // "¡Nivel 2! +10 s"
  const [feliz, setFeliz] = useState(false)
  const terminarRef = useRef(onTerminar)
  useEffect(() => {
    terminarRef.current = onTerminar
  })

  function resultado(p) {
    return { puntaje: p.puntos, pares: p.pares, niveles: p.nivelesSuperados }
  }

  // Si la app pasa a segundo plano, se pausa sola
  useEffect(() => {
    function alCambiar() {
      if (document.visibilityState === 'hidden') setPausado(true)
    }
    document.addEventListener('visibilitychange', alCambiar)
    return () => document.removeEventListener('visibilitychange', alCambiar)
  }, [])

  // El reloj del juego
  useEffect(() => {
    if (pausado) return
    let anterior = performance.now()
    let id = requestAnimationFrame(function cuadro(ahora) {
      const dt = Math.min(0.1, (ahora - anterior) / 1000)
      anterior = ahora
      const p = avanzar(partidaRef.current, dt)
      if (p !== partidaRef.current) {
        partidaRef.current = p
        setPartida(p)
      }
      if (p.terminado) {
        terminarRef.current(resultado(p))
        return
      }
      id = requestAnimationFrame(cuadro)
    })
    return () => cancelAnimationFrame(id)
  }, [pausado])

  function tocar(i) {
    if (pausado) return
    const anterior = partidaRef.current
    const p = tocarCarta(anterior, i)
    if (p === anterior) return
    partidaRef.current = p
    setPartida(p)
    if (p.evento === 'par' || p.evento === 'nivel') {
      setFeliz(true)
      setTimeout(() => setFeliz(false), 700)
      navigator.vibrate?.(20)
    }
    if (p.evento === 'nivel') {
      setCartel(`¡Nivel ${p.nivel}! +${configNivel(anterior.nivel).bonusTiempo} s`)
      setTimeout(() => setCartel(null), 1400)
    }
  }

  const { columnas } = configNivel(partida.nivel)
  const segundos = Math.ceil(partida.tiempo)

  return (
    <div className="memory-game">
      <div className="marcador">
        <span className={segundos <= 10 ? 'apurada' : ''}>⏱ {segundos}</span>
        <span>Nivel {partida.nivel}</span>
        <span>⭐ {formatearPuntaje(partida.puntos)}</span>
        <button className="pausa" onClick={() => setPausado(true)} aria-label="Pausar">
          ⏸️
        </button>
      </div>

      <p className="consigna">{partida.evento === 'par' && partida.aLaPrimera ? '¡A la primera! +10 ✨' : 'Encontrá los pares'}</p>

      <div className="tablero" style={{ gridTemplateColumns: `repeat(${columnas}, 1fr)` }}>
        {partida.cartas.map((c, i) => (
          <button
            key={c.id}
            className={`carta ${seVe(c) ? 'dada-vuelta' : ''} ${c.estado === 'encontrada' ? 'encontrada' : ''}`}
            onClick={() => tocar(i)}
            aria-label={seVe(c) ? c.simbolo : 'Carta tapada'}
          >
            <span className="cara dorso" aria-hidden="true">
              🐾
            </span>
            <span className="cara frente" aria-hidden="true">
              {c.simbolo}
            </span>
          </button>
        ))}
      </div>

      <div className="bolti-mira">
        <Bolti animo="contenta" mimos={feliz} />
      </div>

      {cartel && <div className="cartel-nivel">{cartel}</div>}
      {pausado && (
        <div className="pausa-fondo">
          <strong>⏸️ Pausa</strong>
          <button onClick={() => setPausado(false)}>▶ Seguir</button>
          <button className="secundario" onClick={() => onTerminar(resultado(partidaRef.current))}>
            Terminar acá
          </button>
        </div>
      )}
    </div>
  )
}

export default MemoryGame
