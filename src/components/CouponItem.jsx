import { formatearFechaHora } from '../logic/canjes.js'
import './CouponItem.css'

// Un cupón canjeado. Se marca como cumplido cuando hacen el plan.
function CouponItem({ cupon, onCumplido }) {
  return (
    <li className={`coupon-item ${cupon.cumplido ? 'cumplido' : ''}`}>
      <span className="emoji" aria-hidden="true">
        {cupon.emoji}
      </span>
      <div className="info">
        <strong>{cupon.nombre}</strong>
        <small>
          Canjeado el {formatearFechaHora(cupon.fecha)}
        </small>
      </div>
      {!cupon.cumplido && (
        <button onClick={() => onCumplido(cupon)} aria-label={`Marcar ${cupon.nombre} como cumplido`}>
          ✓ Cumplido
        </button>
      )}
    </li>
  )
}

export default CouponItem
