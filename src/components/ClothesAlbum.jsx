import { createPortal } from 'react-dom'
import Bolti from './Bolti.jsx'
import { PRENDAS, RAREZAS, RAREZA_EXCLUSIVA, TEMPORADAS } from '../config.js'
import { cuandoVuelve, estaDisponible, tienePrenda } from '../logic/gacha.js'
import { estaPuesta } from '../logic/ropa.js'
import './ClothesAlbum.css'

// Álbum de ropa: todas las prendas por colección, con barra de progreso.
// Las que tiene se ven puestas en una Bolti chiquita (tocándolas se las pone o se las saca);
// las que faltan, con "?" y el color de su rareza.
const COLECCIONES = [
  { id: 'siempre', nombre: '👗 De siempre', prendas: PRENDAS.filter((p) => !p.temporada && !p.exclusiva) },
  ...TEMPORADAS.map((t) => ({
    id: t.id,
    nombre: `${t.emoji} ${t.nombre}`,
    temporada: t.id,
    prendas: PRENDAS.filter((p) => p.temporada === t.id),
  })),
  { id: 'exclusivas', nombre: '🔒 Secretos y regalos', prendas: PRENDAS.filter((p) => p.exclusiva) },
]

function rarezaDe(prenda) {
  return prenda.exclusiva ? RAREZA_EXCLUSIVA : RAREZAS.find((r) => r.id === prenda.rareza)
}

function ClothesAlbum({ estado, onAlternarPrenda, onCerrar }) {
  const ahora = new Date(estado.perrita.actualizadaEn) // App lo refresca cada minuto
  const total = PRENDAS.length
  const tiene = PRENDAS.filter((p) => tienePrenda(estado, p.id)).length

  // Va directo en <body> (no adentro de la mochila), así no le llegan los estilos de donde se abre
  return createPortal(
    <div className="clothes-album" role="dialog" aria-modal="true" aria-label="Álbum de ropa">
      <div className="encabezado">
        <h2>📖 Álbum de ropa</h2>
        <button className="cerrar" onClick={onCerrar} aria-label="Cerrar">
          ✕
        </button>
      </div>
      <Progreso tiene={tiene} total={total} />

      {COLECCIONES.map((coleccion) => {
        const conseguidas = coleccion.prendas.filter((p) => tienePrenda(estado, p.id)).length
        return (
          <section key={coleccion.id}>
            <h3>
              {coleccion.nombre}
              {coleccion.temporada && !estaDisponible(coleccion.prendas[0], ahora) && (
                <small> · vuelve el {cuandoVuelve(coleccion.temporada)}</small>
              )}
            </h3>
            <Progreso tiene={conseguidas} total={coleccion.prendas.length} />
            <ul>
              {coleccion.prendas.map((prenda) => (
                <Ficha
                  key={prenda.id}
                  prenda={prenda}
                  tiene={tienePrenda(estado, prenda.id)}
                  puesta={estaPuesta(estado, prenda.id)}
                  onTocar={() => onAlternarPrenda(prenda.id)}
                />
              ))}
            </ul>
          </section>
        )
      })}
    </div>,
    document.body,
  )
}

function Progreso({ tiene, total }) {
  return (
    <div className="progreso">
      <div className="barra" aria-hidden="true">
        <div style={{ width: `${(tiene / total) * 100}%` }} />
      </div>
      <span>
        {tiene}/{total}
      </span>
    </div>
  )
}

function Ficha({ prenda, tiene, puesta, onTocar }) {
  const rareza = rarezaDe(prenda)
  if (!tiene) {
    return (
      <li className="ficha falta" style={{ '--color-rareza': rareza.color }}>
        <span className="signo" aria-hidden="true">
          ?
        </span>
        <small className="nombre">???</small>
        <small className="rareza">{rareza.nombre}</small>
      </li>
    )
  }
  return (
    <li className={`ficha ${puesta ? 'puesta' : ''}`} style={{ '--color-rareza': rareza.color }}>
      <button onClick={onTocar} aria-pressed={puesta} aria-label={`${puesta ? 'Sacarle' : 'Ponerle'} ${prenda.nombre}`}>
        <Bolti animo="contenta" quieta ropa={{ [prenda.zona]: prenda.id }} aria-hidden="true" />
        {puesta && <span className="tilde">✓</span>}
      </button>
      <small className="nombre">{prenda.nombre}</small>
      <small className="rareza">{rareza.nombre}</small>
    </li>
  )
}

export default ClothesAlbum
