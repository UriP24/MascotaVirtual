import PlanCard from './PlanCard.jsx'
import './GamePicker.css'

// Hoja que sube desde abajo para elegir qué jueguito canjear.
// juegos: [{ plan, vuelveEl, usosRestantes }]
function GamePicker({ juegos, puntos, onElegir, onCerrar }) {
  return (
    <div className="game-picker-fondo" onClick={onCerrar}>
      <div className="game-picker" role="dialog" aria-label="Elegí un juego" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado">
          <h2>🎮 ¿Qué juego querés?</h2>
          <button className="cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <ul>
          {juegos.map(({ plan, vuelveEl, usosRestantes }) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              puntos={puntos}
              vuelveEl={vuelveEl}
              usosRestantes={usosRestantes}
              onCanjear={onElegir}
            />
          ))}
        </ul>
        <p className="pie">Tenés {puntos} ⭐</p>
      </div>
    </div>
  )
}

export default GamePicker
