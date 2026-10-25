import { GACHA, RAREZAS } from '../config.js'
import { buscarPrenda } from '../logic/gacha.js'
import './GachaResults.css'

function rarezaDe(id) {
  return RAREZAS.find((r) => r.id === id)
}

// Lo que salió en una tirada: las cartas van apareciendo de a una.
function GachaResults({ premios, onCerrar }) {
  const hayUltra = premios.some((p) => p.rareza === 'ultra')

  return (
    <div className="gacha-resultados-fondo">
      <div className="gacha-resultados" role="dialog" aria-modal="true" aria-label="Lo que te tocó">
        <h2>{hayUltra ? '💎 ¡Una ultra rara!' : '✨ ¡Mirá lo que te tocó!'}</h2>
        <ul className={premios.length === 1 ? 'cartas una' : 'cartas'}>
          {premios.map((premio, i) => {
            const rareza = rarezaDe(premio.rareza)
            const prenda = premio.tipo === 'prenda' ? buscarPrenda(premio.prendaId) : null
            return (
              <li
                key={i}
                className={`carta ${premio.rareza}`}
                style={{ '--color-rareza': rareza.color, animationDelay: `${i * 0.15}s` }}
              >
                <span className="emoji" aria-hidden="true">
                  {prenda ? prenda.emoji : '⭐'}
                </span>
                <span className="nombre">{prenda ? prenda.nombre : `+${premio.puntos} ⭐`}</span>
                <span className="rareza">{rareza.nombre}</span>
                {premio.repetida && <span className="extra">Repetida · +1 pieza</span>}
                {prenda && !premio.repetida && <span className="extra nueva">¡Nueva!</span>}
              </li>
            )
          })}
        </ul>
        <button className="cerrar" onClick={onCerrar} style={{ animationDelay: `${premios.length * 0.15}s` }}>
          ¡Genial!
        </button>
        {premios.length === GACHA.TIRADAS_MULTI && <small>Las prendas nuevas ya están en tu ropa 👗</small>}
      </div>
    </div>
  )
}

export default GachaResults
