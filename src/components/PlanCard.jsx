import { precioEnPuntos } from '../config.js'
import { nombreDelMes, textoRotacion } from '../logic/canjes.js'
import './PlanCard.css'

// Tarjeta de un plan para canjear. `vuelveEl` es la fecha desde la que se puede volver a canjear
// (null si ya está disponible).
function PlanCard({ plan, puntos, vuelveEl, onCanjear }) {
  const precio = precioEnPuntos(plan)
  const faltan = Math.max(0, precio - puntos)
  let boton = 'Canjear'
  if (vuelveEl) boton = '🔒'
  else if (faltan > 0) boton = `Te faltan ${faltan} ⭐`

  return (
    <li className={`plan-card ${vuelveEl ? 'bloqueado' : ''}`}>
      <span className="emoji" aria-hidden="true">
        {plan.emoji}
      </span>
      <div className="info">
        <strong>{plan.nombre}</strong>
        <small>{plan.descripcion}</small>
        <small className="rotacion">
          {vuelveEl ? `🔒 Vuelve en ${nombreDelMes(vuelveEl)}` : `🔁 ${textoRotacion(plan)}`}
        </small>
      </div>
      <div className="lado">
        <span className="precio">{precio} ⭐</span>
        <button
          disabled={Boolean(vuelveEl) || faltan > 0}
          onClick={() => onCanjear(plan)}
          aria-label={vuelveEl ? `${plan.nombre}: vuelve en ${nombreDelMes(vuelveEl)}` : `${boton}: ${plan.nombre}`}
        >
          {boton}
        </button>
      </div>
    </li>
  )
}

export default PlanCard
