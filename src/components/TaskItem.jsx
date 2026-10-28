import { ECONOMIA } from '../config.js'
import { monedasDeTarea } from '../logic/tareas.js'
import './TaskItem.css'

function TaskItem({ tarea, onCompletar, onBorrar, children }) {
  const puedeBorrar = !tarea.obligatoria || tarea.hecha
  const etiquetas = {
    estudio: '🍅',
    paseo: `+${ECONOMIA.PUNTOS_POR_PASEO}⭐ +${monedasDeTarea()}🪙`,
  }
  const etiqueta = etiquetas[tarea.tipo] ?? `+${monedasDeTarea()}🪙`
  // La del estudio se completa con el cronómetro y la del paseo jugando: no tienen casilla
  const conCasilla = tarea.tipo !== 'estudio' && tarea.tipo !== 'paseo'

  return (
    <li className={`task-item ${tarea.hecha ? 'hecha' : ''} ${tarea.obligatoria ? 'obligatoria' : ''}`}>
      <div className="fila">
        {conCasilla && (
          <button
            className="check"
            onClick={() => onCompletar(tarea.id)}
            disabled={tarea.hecha}
            aria-label={tarea.hecha ? 'Hecha' : `Completar ${tarea.texto}`}
          >
            {tarea.hecha ? '✓' : ''}
          </button>
        )}
        <div className="texto">
          <span>{tarea.texto}</span>
          {tarea.obligatoria && !tarea.hecha && <small>Obligatoria de hoy 📚</small>}
          {tarea.tipo === 'paseo' && !tarea.hecha && <small>🐕 Se completa jugando al Paseo con Bolti</small>}
          {tarea.tipo === 'paseo' && tarea.hecha && <small>🐾 ¡Bolti salió a pasear!</small>}
          {tarea.hecha && tarea.puntosGanados > 0 && <small>+{tarea.puntosGanados}⭐ ganados</small>}
          {tarea.hecha && tarea.monedasGanadas > 0 && <small>+{tarea.monedasGanadas}🪙 ganadas</small>}
          {tarea.hecha && tarea.tipo !== 'estudio' && tarea.monedasGanadas === 0 && <small>Sin monedas (tope del día)</small>}
        </div>
        {!tarea.hecha && <span className="etiqueta">{etiqueta}</span>}
        {puedeBorrar && (
          <button className="borrar" onClick={() => onBorrar(tarea)} aria-label={`Borrar ${tarea.texto}`}>
            🗑
          </button>
        )}
      </div>
      {children}
    </li>
  )
}

export default TaskItem
