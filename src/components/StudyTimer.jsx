import { useEffect, useRef, useState } from 'react'
import { ECONOMIA, ESTUDIO } from '../config.js'
import * as crono from '../logic/estudio.js'
import PresenceCheck from './PresenceCheck.jsx'
import './StudyTimer.css'

const MINUTO = 60 * 1000
const CADA_CUANTO_LATIDO = 15 * 1000

function formatear(ms) {
  const totalSeg = Math.floor(ms / 1000)
  const h = Math.floor(totalSeg / 3600)
  const m = String(Math.floor((totalSeg % 3600) / 60)).padStart(2, '0')
  const s = String(totalSeg % 60).padStart(2, '0')
  return `${h}:${m}:${s}`
}

const MENSAJES_PAUSA = {
  inactividad: 'Se pausó porque no respondiste a Bolti. Ese rato no contó.',
  maximo: '¡Llegaste al máximo de estudio de hoy! A descansar 💤',
}

function StudyTimer({ tarea, limiteMs, onActualizar, onCompletar }) {
  const estudio = tarea.estudio
  const corriendo = crono.estaCorriendo(estudio)
  const [ahora, setAhora] = useState(() => Date.now())

  // Guardamos los últimos valores en refs para que los timers no tengan que reiniciarse.
  const limiteRef = useRef(limiteMs)
  const actualizarRef = useRef(onActualizar)
  useEffect(() => {
    limiteRef.current = limiteMs
    actualizarRef.current = onActualizar
  })

  // Mientras corre: refresca la pantalla cada segundo, revisa la pregunta de Bolti y el tope,
  // y cada tanto deja un "latido" guardado por si la app se cierra de golpe.
  useEffect(() => {
    if (!corriendo) return
    let ultimoLatido = Date.now()
    const timer = setInterval(() => {
      const t = Date.now()
      setAhora(t)
      actualizarRef.current((c) => {
        const revisado = crono.revisar(c, t, limiteRef.current)
        if (t - ultimoLatido < CADA_CUANTO_LATIDO) return revisado
        ultimoLatido = t
        return crono.registrarLatido(revisado, t)
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [corriendo])

  // Antitrampa: si la app pasa a segundo plano se pausa; al volver, sigue sola.
  useEffect(() => {
    function alCambiarVisibilidad() {
      const t = Date.now()
      if (document.visibilityState === 'hidden') {
        actualizarRef.current((c) => crono.pausar(c, t, 'segundo-plano'))
      } else {
        setAhora(t)
        actualizarRef.current((c) => (c.pausa === 'segundo-plano' ? crono.iniciar(c, t) : c))
      }
    }
    document.addEventListener('visibilitychange', alCambiarVisibilidad)
    return () => document.removeEventListener('visibilitychange', alCambiarVisibilidad)
  }, [])

  // Mantiene la pantalla encendida mientras corre (si no, se bloquea y se pausaría).
  useEffect(() => {
    if (!corriendo || !('wakeLock' in navigator)) return
    let bloqueo = null
    let cancelado = false
    navigator.wakeLock
      .request('screen')
      .then((b) => (cancelado ? b.release() : (bloqueo = b)))
      .catch(() => {}) // si el navegador no lo permite, seguimos sin él
    return () => {
      cancelado = true
      bloqueo?.release().catch(() => {})
    }
  }, [corriendo])

  const contado = Math.min(crono.msContados(estudio, ahora), limiteMs)
  const minimoMs = ESTUDIO.MINUTOS_MINIMOS * MINUTO
  const bloqueMs = ECONOMIA.MINUTOS_POR_BLOQUE_ESTUDIO * MINUTO
  const puntos = crono.puntosPorTiempo(contado)
  const puedeCompletar = crono.llegoAlMinimo(contado)
  const sinTiempo = limiteMs <= 0 || (!corriendo && contado >= limiteMs)
  const progreso = puedeCompletar ? (contado % bloqueMs) / bloqueMs : contado / minimoMs
  const faltan = puedeCompletar
    ? Math.ceil((bloqueMs - (contado % bloqueMs)) / MINUTO)
    : Math.ceil((minimoMs - contado) / MINUTO)

  return (
    <div className="study-timer">
      <div className="reloj" aria-live="off">
        {formatear(contado)}
      </div>
      <div className="barra" aria-hidden="true">
        <div style={{ width: `${Math.min(progreso, 1) * 100}%` }} />
      </div>
      <p className="detalle">
        {puedeCompletar
          ? `Llevás +${puntos}⭐ · el próximo en ${faltan} min`
          : `Faltan ${faltan} min para poder completarla`}
      </p>
      {estudio.pausa && MENSAJES_PAUSA[estudio.pausa] && (
        <p className="aviso-pausa">{MENSAJES_PAUSA[estudio.pausa]}</p>
      )}

      <div className="botones">
        {corriendo ? (
          <button className="pausar" onClick={() => onActualizar((c) => crono.pausar(c, Date.now()))}>
            ⏸️ Pausar
          </button>
        ) : (
          <button
            className="empezar"
            disabled={sinTiempo}
            onClick={() => {
              setAhora(Date.now())
              onActualizar((c) => crono.iniciar(c, Date.now()))
            }}
          >
            ▶ {contado > 0 ? 'Seguir' : 'Empezar'}
          </button>
        )}
        <button className="completar" disabled={!puedeCompletar} onClick={() => onCompletar(tarea.id)}>
          ✓ Listo{puedeCompletar ? ` +${puntos}⭐` : ''}
        </button>
      </div>

      {corriendo && estudio.chequeoDesde !== null && (
        <PresenceCheck
          desde={estudio.chequeoDesde}
          ahora={ahora}
          onConfirmar={() => onActualizar((c) => crono.confirmarPresencia(c, Date.now()))}
        />
      )}
    </div>
  )
}

export default StudyTimer
