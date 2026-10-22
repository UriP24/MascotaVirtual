import { useEffect, useState } from 'react'
import './PomodoroBreak.css'

const ANIMOS = [
  '¡Qué crack! Un pomodoro más y quedás re lista 💪',
  'Estoy re orgullosa de vos 🐾💕',
  '¡Vamos que se puede! Yo te acompaño 📚',
  'Cada bloque suma. ¡Seguí así, Mari! ✨',
  '¡Sos una genia! ¿Le damos otro ratito? 🍅',
  'Lo estás haciendo increíble. ¡Un empujoncito más! 🐶',
]

function azar(lista) {
  return lista[Math.floor(Math.random() * lista.length)]
}

// Bolti al terminar un pomodoro (25 min): pregunta si quiere seguir y le da ánimo.
// maximo: llegó a los 8 pomodoros del día, solo puede terminar.
function PomodoroBreak({ bloques, puntos, maximo, onSeguir, onDescansar, onTerminar }) {
  const [animo] = useState(() => azar(ANIMOS))

  useEffect(() => {
    navigator.vibrate?.([150, 80, 150])
  }, [])

  return (
    <div className="pomodoro-break" role="dialog" aria-modal="true" aria-labelledby="titulo-pomodoro">
      <div className="tarjeta">
        <div className="bolti">{maximo ? '🏆' : '🐶'}</div>
        <h2 id="titulo-pomodoro">
          {maximo ? '¡Completaste los 8 pomodoros de hoy!' : `¡Terminaste ${bloques === 1 ? 'un pomodoro' : `${bloques} pomodoros`}! 🍅`}
        </h2>
        <p className="llevas">
          Llevás {bloques} {bloques === 1 ? 'bloque' : 'bloques'} de 25 min · +{puntos} ⭐
        </p>
        <p className="animo">{maximo ? 'Estudiaste un montón. ¡A descansar, te lo ganaste! 💤' : animo}</p>
        {maximo ? (
          <button className="principal" onClick={onTerminar}>
            ✓ Terminar y sumar +{puntos} ⭐
          </button>
        ) : (
          <>
            <p className="pregunta">¿Querés seguir estudiando?</p>
            <button className="principal" onClick={onSeguir}>
              📚 Sí, otro pomodoro
            </button>
            <button className="secundario" onClick={onDescansar}>
              ☕ Descansar 5 minutitos
            </button>
            <button className="terciario" onClick={onTerminar}>
              ✓ Terminar por hoy (+{puntos} ⭐)
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default PomodoroBreak
