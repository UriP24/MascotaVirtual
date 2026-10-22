import { useRef } from 'react'
import { comidasEnInventario } from '../logic/comida.js'
import './Backpack.css'

const DISTANCIA_PARA_ARRASTRAR = 10 // px: si el dedo se mueve más, es un arrastre y no un toque

// Mochila con la comida del inventario. Tocar una comida se la da a Bolti; también se puede
// arrastrar hasta su boca. Los eventos del arrastre los maneja Casa.
function Backpack({ estado, arrastrandoId, onDar, onEmpezar, onMover, onSoltar, onCancelar, onAbrirTienda, onCerrar }) {
  const comidas = comidasEnInventario(estado)
  const toque = useRef(null) // { comida, x, y, arrastrando }

  function alApretar(comida, e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    toque.current = { comida, x: e.clientX, y: e.clientY, arrastrando: false }
  }

  function alMover(e) {
    const t = toque.current
    if (!t) return
    if (!t.arrastrando && Math.hypot(e.clientX - t.x, e.clientY - t.y) > DISTANCIA_PARA_ARRASTRAR) {
      t.arrastrando = true
      onEmpezar(t.comida, e)
    }
    if (t.arrastrando) onMover(e)
  }

  function alSoltar(e) {
    const t = toque.current
    toque.current = null
    if (!t) return
    if (t.arrastrando) onSoltar(e)
    else onDar(t.comida, e.currentTarget.getBoundingClientRect())
  }

  return (
    <div className="backpack" role="dialog" aria-label="Mochila con comida">
      <div className="encabezado">
        <strong>🎒 Mochila</strong>
        <button className="tienda" onClick={onAbrirTienda}>
          🛒 Tienda
        </button>
        <button className="cerrar" onClick={onCerrar} aria-label="Cerrar mochila">
          ✕
        </button>
      </div>
      {comidas.length === 0 ? (
        <p className="vacia">Tu mochila está vacía. ¡Comprale algo rico a Bolti!</p>
      ) : (
        <>
          <ul>
            {comidas.map((c) => (
              <li key={c.id}>
                <button
                  className={`comida ${arrastrandoId === c.id ? 'arrastrando' : ''}`}
                  aria-label={`Darle ${c.nombre} a Bolti (tenés ${c.cantidad})`}
                  onPointerDown={(e) => alApretar(c, e)}
                  onPointerMove={alMover}
                  onPointerUp={alSoltar}
                  onPointerCancel={() => {
                    toque.current = null
                    onCancelar()
                  }}
                >
                  <span className="emoji">{c.emoji}</span>
                  <span className="cantidad">{c.cantidad}</span>
                </button>
                <small>{c.nombre}</small>
              </li>
            ))}
          </ul>
          <p className="ayuda-mochila">Tocá una comida para dársela o arrastrala a su boca</p>
        </>
      )}
    </div>
  )
}

export default Backpack
