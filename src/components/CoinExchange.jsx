import { ECONOMIA } from '../config.js'
import './CoinExchange.css'

// Cambio de monedas por puntos, con tope diario.
function CoinExchange({ monedas, quedanHoy, onCambiar }) {
  const alcanza = monedas >= ECONOMIA.MONEDAS_POR_PUNTO
  let detalle = `Podés cambiar ${ECONOMIA.PUNTOS_CONVERTIBLES_POR_DIA} ⭐ por día`
  if (quedanHoy === 0) detalle = 'Ya cambiaste hoy · mañana podés de nuevo'
  else if (!alcanza) detalle = `Te faltan ${ECONOMIA.MONEDAS_POR_PUNTO - monedas} 🪙`

  return (
    <div className="coin-exchange">
      <div className="info">
        <strong>
          🔄 {ECONOMIA.MONEDAS_POR_PUNTO} 🪙 → 1 ⭐
        </strong>
        <small>{detalle}</small>
      </div>
      <button disabled={!alcanza || quedanHoy === 0} onClick={onCambiar}>
        Cambiar
      </button>
    </div>
  )
}

export default CoinExchange
