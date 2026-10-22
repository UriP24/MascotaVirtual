import { precioEnPuntos } from '../config.js'
import './PlanCard.css'

// Tarjeta de un plan para canjear.
function PlanCard({ plan, puntos, disponibleEsteMes, onCanjear }) {
  const precio = precioEnPuntos(plan)
  const faltan = Math.max(0, precio - puntos)
  let boton = 'Canjear'
  if (!disponibleEsteMes) boton = '🔒' // el cartel de arriba dice cuándo vuelve
  else if (faltan > 0) boton = `Te faltan ${faltan} ⭐`

  return (
    <li className="plan-card">
      <span className="emoji" aria-hidden="true">
        {plan.emoji}
      </span>
      <div className="info">
        <strong>{plan.nombre}</strong>
        <small>{plan.descripcion}</small>
      </div>
      <div className="lado">
        <span className="precio">{precio} ⭐</span>
        <button
          disabled={!disponibleEsteMes || faltan > 0}
          onClick={() => onCanjear(plan)}
          aria-label={disponibleEsteMes ? `${boton}: ${plan.nombre}` : `${plan.nombre}: disponible el mes que viene`}
        >
          {boton}
        </button>
      </div>
    </li>
  )
}

export default PlanCard
