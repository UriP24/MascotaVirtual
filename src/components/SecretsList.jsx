import { PRENDAS, SECRETOS } from '../config.js'
import { estaDescubierto, progresoSecretos } from '../logic/secretos.js'
import './SecretsList.css'

// Lista de secretos (desde Configuración): los descubiertos con su premio, y los que faltan
// tapados con una pista.
function SecretsList({ estado, onCerrar }) {
  const { descubiertos, total } = progresoSecretos(estado)
  return (
    <div className="secrets-list-fondo" onClick={onCerrar}>
      <div className="secrets-list" role="dialog" aria-modal="true" aria-label="Secretos" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado">
          <h2>
            🔍 Secretos {descubiertos}/{total}
          </h2>
          <button className="cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <ul>
          {SECRETOS.map((s) => {
            const visto = estaDescubierto(estado, s.id)
            const prenda = s.premio?.prenda && PRENDAS.find((p) => p.id === s.premio.prenda)
            return (
              <li key={s.id} className={visto ? 'descubierto' : undefined}>
                <span className="icono" aria-hidden="true">
                  {visto ? (prenda ? prenda.emoji : '✨') : s.proximamente ? '🔒' : '❓'}
                </span>
                <span className="texto">
                  <strong>{visto ? s.nombre : '???'}</strong>
                  <small>{visto ? (prenda ? prenda.nombre : 'Multi gratis') : s.proximamente ? `Próximamente · ${s.pista}` : s.pista}</small>
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default SecretsList
