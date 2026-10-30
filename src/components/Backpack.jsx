import { useRef, useState } from 'react'
import { comidasEnInventario } from '../logic/comida.js'
import { estaPuesta, ropaQueTiene } from '../logic/ropa.js'
import ClothesAlbum from './ClothesAlbum.jsx'
import './Backpack.css'

const DISTANCIA_PARA_ARRASTRAR = 10 // px: si el dedo se mueve más, es un arrastre y no un toque

// Mochila con dos pestañas:
// - Comida: tocar una comida se la da a Bolti; también se puede arrastrar hasta su boca
//   (los eventos del arrastre los maneja Casa).
// - Ropa: tocar una prenda se la pone o se la saca.
function Backpack({
  estado,
  arrastrandoId,
  onDar,
  onEmpezar,
  onMover,
  onSoltar,
  onCancelar,
  onAlternarPrenda,
  onAbrirTienda,
  onCerrar,
}) {
  const [pestana, setPestana] = useState('comida')
  const [albumAbierto, setAlbumAbierto] = useState(false)
  const comidas = comidasEnInventario(estado)
  const ropa = ropaQueTiene(estado)
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
    <div className="backpack" role="dialog" aria-label="Mochila">
      <div className="encabezado">
        <div className="pestanas" role="tablist">
          <button role="tab" aria-selected={pestana === 'comida'} onClick={() => setPestana('comida')}>
            🍖 Comida
          </button>
          <button role="tab" aria-selected={pestana === 'ropa'} onClick={() => setPestana('ropa')}>
            👗 Ropa
          </button>
        </div>
        {pestana === 'comida' && (
          <button className="tienda" onClick={onAbrirTienda}>
            🛒 Tienda
          </button>
        )}
        <button className="cerrar" onClick={onCerrar} aria-label="Cerrar mochila">
          ✕
        </button>
      </div>

      {pestana === 'comida' &&
        (comidas.length === 0 ? (
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
        ))}

      {pestana === 'ropa' && (
        <button className="ver-album" onClick={() => setAlbumAbierto(true)}>
          📖 Ver álbum de ropa
        </button>
      )}
      {albumAbierto && (
        <ClothesAlbum estado={estado} onAlternarPrenda={onAlternarPrenda} onCerrar={() => setAlbumAbierto(false)} />
      )}
      {pestana === 'ropa' &&
        (ropa.length === 0 ? (
          <p className="vacia">Todavía no tenés ropa para Bolti. ¡Probá el gacha en Canjes! ✨</p>
        ) : (
          <>
            <ul>
              {ropa.map((prenda) => {
                const puesta = estaPuesta(estado, prenda.id)
                return (
                  <li key={prenda.id}>
                    <button
                      className={`prenda ${puesta ? 'puesta' : ''}`}
                      aria-pressed={puesta}
                      aria-label={`${puesta ? 'Sacarle' : 'Ponerle'} ${prenda.nombre}`}
                      onClick={() => onAlternarPrenda(prenda.id)}
                    >
                      <span className="emoji">{prenda.emoji}</span>
                      {puesta && <span className="tilde">✓</span>}
                    </button>
                    <small>{prenda.nombre}</small>
                  </li>
                )
              })}
            </ul>
            <p className="ayuda-mochila">Tocá una prenda para ponérsela o sacársela</p>
          </>
        ))}
    </div>
  )
}

export default Backpack
