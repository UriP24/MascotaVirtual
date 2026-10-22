import StudyChart from './StudyChart.jsx'
import { formatearMinutos, mejorRacha, rachaActual, resumen, ultimos7Dias } from '../logic/estadisticas.js'
import './StudyStats.css'

// Hoja con la racha y las estadísticas de estudio.
function StudyStats({ estado, ahora, onCerrar }) {
  const racha = rachaActual(estado, ahora)
  const mejor = mejorRacha(estado, ahora)
  const r = resumen(estado)
  const dias = ultimos7Dias(estado, ahora)

  return (
    <div className="study-stats-fondo" onClick={onCerrar}>
      <div className="study-stats" role="dialog" aria-label="Estadísticas de estudio" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado">
          <h2>📊 Tu estudio</h2>
          <button className="cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>

        <div className="racha">
          <span className="numero">🔥 {racha}</span>
          <span>{racha === 1 ? 'día seguido estudiando' : 'días seguidos estudiando'}</span>
          <small>Tu mejor racha: {mejor} {mejor === 1 ? 'día' : 'días'} · el finde no la corta</small>
        </div>

        <div className="mosaicos">
          <div>
            <small>Tiempo total</small>
            <strong>{formatearMinutos(r.minutosTotales)}</strong>
          </div>
          <div>
            <small>Pomodoros</small>
            <strong>🍅 {r.pomodoros}</strong>
          </div>
          <div>
            <small>Días que estudiaste</small>
            <strong>{r.diasConEstudio}</strong>
          </div>
          <div>
            <small>Promedio por día</small>
            <strong>{formatearMinutos(r.promedioPorDia)}</strong>
          </div>
        </div>

        <h3>Últimos 7 días</h3>
        <StudyChart dias={dias} />

        <details className="lista">
          <summary>Ver como lista</summary>
          <ul>
            {[...dias].reverse().map((d) => (
              <li key={d.fecha}>
                <span>{new Date(`${d.fecha}T12:00:00`).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric' })}</span>
                <strong>{d.minutos > 0 ? formatearMinutos(d.minutos) : '—'}</strong>
              </li>
            ))}
          </ul>
        </details>
        <p className="nota">El tiempo se suma cuando terminás una tarea de estudio.</p>
      </div>
    </div>
  )
}

export default StudyStats
