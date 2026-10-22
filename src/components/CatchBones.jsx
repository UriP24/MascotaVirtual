import { useEffect, useRef, useState } from 'react'
import Bolti from './Bolti.jsx'
import { crearJuego, enTurbo, moverBolti, paso, segundosRestantes } from '../logic/huesitos.js'
import { JUEGOS } from '../config.js'
import './CatchBones.css'

const EMOJIS = { hueso: '🦴', dorado: '🍖', chocolate: '🍫' }
const CUENTA_REGRESIVA = 3

// Minijuego "Atrapá los huesitos": Bolti abajo sigue el dedo y atrapa lo que cae.
// La simulación vive en logic/huesitos.js; acá solo se dibuja y se maneja el dedo.
function CatchBones({ onTerminar }) {
  const [juegoInicial] = useState(crearJuego)
  const juegoRef = useRef(juegoInicial) // el estado "vivo" del juego, que cambia en cada cuadro
  const areaRef = useRef(null)
  const [juego, setJuego] = useState(juegoInicial) // copia para dibujar
  const [cuenta, setCuenta] = useState(CUENTA_REGRESIVA)
  const [pausado, setPausado] = useState(false)
  const [feliz, setFeliz] = useState(false)
  const [textos, setTextos] = useState([]) // "+1", "💔" que suben y se van
  const terminarRef = useRef(onTerminar)
  useEffect(() => {
    terminarRef.current = onTerminar
  })

  // Cuenta regresiva 3, 2, 1
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
    if (cuenta > 0 || pausado) return
    let anterior = performance.now()
    let id = requestAnimationFrame(function cuadro(ahora) {
      const dt = Math.min(0.05, (ahora - anterior) / 1000) // si el celu se traba, no salta de golpe
      anterior = ahora
      const j = paso(juegoRef.current, dt)
      juegoRef.current = j
      if (j.eventos.length > 0) {
        if (j.eventos.some((ev) => ev.tipo !== 'chocolate')) {
          setFeliz(true)
          setTimeout(() => setFeliz(false), 400)
          navigator.vibrate?.(15)
        } else {
          navigator.vibrate?.([40, 30, 40])
        }
        const nuevos = j.eventos.map((ev) => ({
          id: `${j.t}-${ev.x}`,
          x: ev.x,
          texto: ev.tipo === 'chocolate' ? '💔' : `+${ev.gana}`,
          dorado: ev.tipo === 'dorado',
        }))
        setTextos((lista) => [...lista, ...nuevos])
        setTimeout(() => setTextos((lista) => lista.filter((t) => !nuevos.includes(t))), 800)
      }
      setJuego(j)
      if (j.terminado) {
        terminarRef.current({ monedas: j.monedas, huesos: j.huesos, vidas: j.vidas })
        return
      }
      id = requestAnimationFrame(cuadro)
    })
    return () => cancelAnimationFrame(id)
  }, [cuenta, pausado])

  function moverDedo(e) {
    const r = areaRef.current.getBoundingClientRect()
    juegoRef.current = moverBolti(juegoRef.current, (e.clientX - r.left) / r.width)
    if (cuenta > 0 || pausado) setJuego(juegoRef.current)
  }

  const algoCerca = juego.items.some((it) => it.tipo !== 'chocolate' && it.y > 0.6 && Math.abs(it.x - juego.boltiX) < 0.15)

  return (
    <div className="catch-bones" ref={areaRef} onPointerDown={moverDedo} onPointerMove={moverDedo}>
      <div className="marcador">
        <span>⏱ {segundosRestantes(juego)}</span>
        <span>
          🦴 {juego.huesos} · 🪙 {juego.monedas}
          {juego.monedas >= JUEGOS.MONEDAS_MAXIMAS_POR_PARTIDA && ' (máx.)'}
        </span>
        <span className="vidas" aria-label={`${juego.vidas} vidas`}>
          {'❤️'.repeat(juego.vidas)}
          {'🤍'.repeat(JUEGOS.HUESITOS_VIDAS - juego.vidas)}
        </span>
        <button className="pausa" onClick={() => setPausado(true)} aria-label="Pausar">
          ⏸️
        </button>
      </div>

      {enTurbo(juego) && juego.t < JUEGOS.HUESITOS_ETAPAS.at(-1).desde + 1.5 && (
        <div className="turbo" aria-live="polite">
          ¡Más rápido! 🔥
        </div>
      )}

      {juego.items.map((it) => (
        <span key={it.id} className={`cosa ${it.tipo}`} style={{ left: `${it.x * 100}%`, top: `${it.y * 100}%` }} aria-hidden="true">
          {EMOJIS[it.tipo]}
        </span>
      ))}

      {textos.map((t) => (
        <span key={t.id} className={`texto-flotante ${t.dorado ? 'dorado' : ''}`} style={{ left: `${t.x * 100}%` }} aria-hidden="true">
          {t.texto}
        </span>
      ))}

      <div className="bolti-jugadora" style={{ left: `${juego.boltiX * 100}%` }}>
        <Bolti animo="contenta" mimos={feliz} esperando={algoCerca && !feliz} />
      </div>
      <div className="pasto" aria-hidden="true" />

      {cuenta > 0 && (
        <div className="cartel">
          <span className="numero">{cuenta}</span>
          <small>Mové a Bolti con el dedo · ¡Ojo con el chocolate 🍫!</small>
        </div>
      )}
      {pausado && (
        <div className="cartel" onPointerDown={(e) => e.stopPropagation()}>
          <strong>⏸️ Pausa</strong>
          <button onClick={() => setPausado(false)}>▶ Seguir</button>
          <button className="secundario" onClick={() => onTerminar({ monedas: juego.monedas, huesos: juego.huesos, vidas: juego.vidas })}>
            Terminar acá
          </button>
        </div>
      )}
    </div>
  )
}

export default CatchBones
