import { PERRITA } from '../config.js'
import './NeedsBars.css'

const NECESIDADES = [
  { clave: 'saciedad', icono: '🍖', texto: 'Panza' },
  { clave: 'energia', icono: '⚡', texto: 'Energía' },
  { clave: 'carino', icono: '💗', texto: 'Cariño' },
]

function nivel(valor) {
  if (valor >= 60) return 'bien'
  if (valor >= PERRITA.NIVEL_BAJO) return 'media'
  return 'baja'
}

function NeedsBars({ perrita }) {
  return (
    <div className="needs-bars" aria-label="Necesidades de Bolti">
      {NECESIDADES.map(({ clave, icono, texto }) => {
        const valor = Math.round(perrita[clave])
        return (
          <div key={clave} className="necesidad">
            <div className="etiqueta">
              <span>
                {icono} {texto}
              </span>
              <span className="valor">{valor}</span>
            </div>
            <div className={`barra ${nivel(valor)}`} role="meter" aria-valuenow={valor} aria-valuemin={0} aria-valuemax={PERRITA.NECESIDAD_MAXIMA} aria-label={texto}>
              <i style={{ width: `${(valor / PERRITA.NECESIDAD_MAXIMA) * 100}%` }} />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default NeedsBars
