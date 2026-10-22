import { precioEnPuntos } from '../config.js'
import './PlanCard.css'

// Una sola tarjeta para todos los jueguitos: al tocarla se elige cuál.
function GameCard({ juegos, onElegir }) {
  const precios = juegos.map(precioEnPuntos)
  return (
    <li className="plan-card">
      <span className="emoji" aria-hidden="true">
        🎮
      </span>
      <div className="info">
        <strong>Un jueguito</strong>
        <small>Elegí qué juego querés: chico, mediano, grande o enorme</small>
        <small className="rotacion">🔁 De 3 a 12 meses según el precio</small>
      </div>
      <div className="lado">
        <span className="precio">desde {Math.min(...precios)} ⭐</span>
        <button onClick={onElegir}>Elegir juego</button>
      </div>
    </li>
  )
}

export default GameCard
