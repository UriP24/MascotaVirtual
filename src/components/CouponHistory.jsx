import { formatearFechaHora } from '../logic/canjes.js'
import './CouponHistory.css'

// Registro de todos los cupones canjeados, con fecha y hora de canje y de cumplido.
function CouponHistory({ cupones }) {
  if (cupones.length === 0) return <p className="coupon-history vacio">Todavía no hay canjes en el historial.</p>
  return (
    <ul className="coupon-history">
      {cupones.map((c) => (
        <li key={c.id}>
          <span className="emoji" aria-hidden="true">
            {c.emoji}
          </span>
          <div className="info">
            <strong>
              {c.nombre} <span className="costo">· {c.costo} ⭐</span>
            </strong>
            <small>Canjeado el {formatearFechaHora(c.fecha)}</small>
            <small className={c.cumplido ? 'cumplido' : 'pendiente'}>
              {c.cumplido ? `✓ Cumplido el ${formatearFechaHora(c.cumplidoEn)}` : '⏳ Pendiente'}
            </small>
          </div>
        </li>
      ))}
    </ul>
  )
}

export default CouponHistory
