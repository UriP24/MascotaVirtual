import { useEffect } from 'react'
import { ESTUDIO } from '../config.js'
import './PresenceCheck.css'

// Bolti pregunta si sigue estudiando. Si no responde a tiempo, el cronómetro se pausa solo.
function PresenceCheck({ desde, ahora, onConfirmar }) {
  const vence = desde + ESTUDIO.CHEQUEO_MINUTOS_PARA_RESPONDER * 60 * 1000
  const segundos = Math.max(0, Math.ceil((vence - ahora) / 1000))

  // Vibra al aparecer (en Android; el iPhone no deja vibrar desde la web).
  useEffect(() => {
    navigator.vibrate?.([200, 100, 200])
  }, [desde])

  return (
    <div className="presence-check" role="dialog" aria-modal="true" aria-labelledby="pregunta-bolti">
      <div className="tarjeta">
        <div className="bolti">🐶</div>
        <h2 id="pregunta-bolti">¿Seguís estudiando?</h2>
        <p>Bolti quiere saber si seguís ahí 🐾</p>
        <button onClick={onConfirmar}>¡Sí, acá estoy!</button>
        <small>
          Si no respondés en {Math.floor(segundos / 60)}:{String(segundos % 60).padStart(2, '0')}, el
          cronómetro se pausa.
        </small>
      </div>
    </div>
  )
}

export default PresenceCheck
