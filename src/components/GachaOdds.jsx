import { GACHA, PRENDAS, RAREZAS } from '../config.js'
import { estaDisponible } from '../logic/gacha.js'
import './GachaOdds.css'

function porcentaje(chance) {
  return `${(chance * 100).toLocaleString('es-AR', { maximumFractionDigits: 1 })}%`
}

// Chances a la vista, para que sea transparente.
function GachaOdds({ ahora }) {
  const deTemporada = PRENDAS.filter((p) => p.temporada && estaDisponible(p, ahora))

  return (
    <details className="gacha-odds">
      <summary>📊 Ver chances</summary>
      <ul>
        {RAREZAS.map((r) => (
          <li key={r.id} style={{ color: r.color }}>
            <span>{r.nombre}</span>
            <strong>{porcentaje(GACHA.PROBABILIDADES[r.id])}</strong>
          </li>
        ))}
      </ul>
      <p>
        Premios de ⭐:{' '}
        {Object.values(GACHA.PREMIOS_PUNTOS)
          .map((p) => `${p.puntos} ⭐ (${porcentaje(p.chance)})`)
          .join(' · ')}
      </p>
      {deTemporada.length > 0 && (
        <p>
          De temporada (salen más seguido ahora): {deTemporada.map((p) => p.emoji).join(' ')}
        </p>
      )}
    </details>
  )
}

export default GachaOdds
