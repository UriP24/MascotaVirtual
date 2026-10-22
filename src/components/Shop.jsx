import { comidasALaVenta } from '../logic/comida.js'
import './Shop.css'

// Tienda de comida: hoja que sube desde abajo. Se paga con monedas.
function Shop({ monedas, inventario, onComprar, onCerrar }) {
  return (
    <div className="shop-fondo" onClick={onCerrar}>
      <div className="shop" role="dialog" aria-label="Tienda de comida" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado">
          <h2>🛒 Tienda</h2>
          <span className="monedas">🪙 {monedas}</span>
          <button className="cerrar" onClick={onCerrar} aria-label="Cerrar tienda">
            ✕
          </button>
        </div>
        <ul>
          {comidasALaVenta().map((c) => {
            const alcanza = monedas >= c.precio
            const tiene = inventario[c.id] ?? 0
            return (
              <li key={c.id}>
                <span className="emoji" aria-hidden="true">
                  {c.emoji}
                </span>
                <div className="info">
                  <strong>{c.nombre}</strong>
                  <small>
                    +{c.saciedad} panza{c.carino > 0 ? ` · +${c.carino} cariño` : ''}
                    {tiene > 0 ? ` · tenés ${tiene}` : ''}
                  </small>
                </div>
                <button className="comprar" disabled={!alcanza} onClick={() => onComprar(c.id)} aria-label={`Comprar ${c.nombre} por ${c.precio} monedas`}>
                  {c.precio} 🪙
                </button>
              </li>
            )
          })}
        </ul>
        <p className="pie">La comida va a la bandeja: arrastrala hasta la boca de Bolti 🐶</p>
      </div>
    </div>
  )
}

export default Shop
