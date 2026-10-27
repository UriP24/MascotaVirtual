import { PRENDAS } from '../config.js'
import { buscarSecreto } from '../logic/secretos.js'
import './SecretFound.css'

// "¡Descubriste un secreto!" con su premio.
function SecretFound({ id, onCerrar }) {
  const secreto = buscarSecreto(id)
  const prenda = secreto.premio.prenda && PRENDAS.find((p) => p.id === secreto.premio.prenda)
  return (
    <div className="secret-found-fondo">
      <div className="secret-found" role="dialog" aria-modal="true" aria-label="Descubriste un secreto">
        <span className="lupa" aria-hidden="true">
          🔍
        </span>
        <p className="titulo">¡Descubriste un secreto!</p>
        <h2>{secreto.nombre}</h2>
        <div className="premio">
          <span className="emoji" aria-hidden="true">
            {prenda ? prenda.emoji : '✨'}
          </span>
          <span className="texto">
            <strong>{prenda ? prenda.nombre : 'Multi gratis del gacha'}</strong>
            <small>{prenda ? 'Ya está en tu mochila 👗' : `${secreto.premio.tiradas} tiradas en Canjes → Gacha`}</small>
          </span>
        </div>
        <button onClick={onCerrar}>¡Qué lindo! 🐾</button>
      </div>
    </div>
  )
}

export default SecretFound
