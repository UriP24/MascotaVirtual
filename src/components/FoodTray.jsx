import { comidasEnInventario } from '../logic/comida.js'
import './FoodTray.css'

// Bandeja con la comida del inventario. Cada comida se arrastra con el dedo hasta la boca de Bolti.
// Los eventos del arrastre los maneja Casa (onArrastrar*).
function FoodTray({ estado, arrastrandoId, onEmpezar, onMover, onSoltar, onCancelar, onAbrirTienda }) {
  const comidas = comidasEnInventario(estado)

  if (comidas.length === 0) {
    return (
      <div className="food-tray vacia">
        <span>La bandeja está vacía</span>
        <button onClick={onAbrirTienda}>🛒 Comprar comida</button>
      </div>
    )
  }

  return (
    <div className="food-tray" aria-label="Comida para darle a Bolti">
      {comidas.map((c) => (
        <button
          key={c.id}
          className={`comida ${arrastrandoId === c.id ? 'arrastrando' : ''}`}
          aria-label={`${c.nombre}, tenés ${c.cantidad}. Arrastrala hasta la boca de Bolti`}
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId)
            onEmpezar(c, e)
          }}
          onPointerMove={onMover}
          onPointerUp={onSoltar}
          onPointerCancel={onCancelar}
        >
          <span className="emoji">{c.emoji}</span>
          <span className="cantidad">{c.cantidad}</span>
        </button>
      ))}
    </div>
  )
}

export default FoodTray
