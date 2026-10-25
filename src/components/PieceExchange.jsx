import { GACHA } from '../config.js'
import './PieceExchange.css'

// Elegir qué prenda canjear con las piezas de una rareza (solo las que no tiene).
function PieceExchange({ rareza, opciones, onElegir, onCerrar }) {
  return (
    <div className="piece-exchange-fondo" onClick={onCerrar}>
      <div
        className="piece-exchange"
        role="dialog"
        aria-modal="true"
        aria-label={`Canjear piezas ${rareza.nombre}`}
        onClick={(e) => e.stopPropagation()}
        style={{ '--color-rareza': rareza.color }}
      >
        <div className="encabezado">
          <h2>🧩 Elegí una prenda {rareza.nombre.toLowerCase()}</h2>
          <button className="cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <p className="costo">Cuesta {GACHA.PIEZAS_PARA_CANJE[rareza.id]} piezas</p>
        <ul>
          {opciones.map((prenda) => (
            <li key={prenda.id}>
              <span className="emoji" aria-hidden="true">
                {prenda.emoji}
              </span>
              <span className="nombre">{prenda.nombre}</span>
              <button onClick={() => onElegir(prenda.id)}>Elegir</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default PieceExchange
