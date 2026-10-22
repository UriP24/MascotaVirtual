import { monedasDeTarea } from '../logic/tareas.js'
import './TaskItem.css'

function TaskItem({ tarea, onCompletar, onBorrar, children }) {
  const puedeBorrar = !tarea.obligatoria || tarea.hecha
  const etiqueta = tarea.tipo === 'estudio' ? '⏱' : `+${monedasDeTarea(tarea.tipo)}🪙`

  return (
    <li className={`task-item ${tarea.hecha ? 'hecha' : ''} ${tarea.obligatoria ? 'obligatoria' : ''}`}>
      <div className="fila">
        {tarea.tipo !== 'estudio' && (
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
