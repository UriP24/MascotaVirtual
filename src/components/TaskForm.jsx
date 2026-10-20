import { useState } from 'react'
import { LARGO_MAXIMO_TEXTO, puntosDeTarea } from '../logic/tareas.js'
import './TaskForm.css'

const TIPOS = [
  { id: 'simple', texto: `Simple +${puntosDeTarea('simple')}⭐` },
  { id: 'grande', texto: `Grande +${puntosDeTarea('grande')}⭐` },
  { id: 'estudio', texto: 'Estudio ⏱' },
]

function TaskForm({ onAgregar }) {
  const [texto, setTexto] = useState('')
  const [tipo, setTipo] = useState('simple')

  function enviar(evento) {
    evento.preventDefault() // que el formulario no recargue la página
    if (texto.trim() === '') return
    onAgregar(texto, tipo)
    setTexto('')
  }

  return (
    <form className="task-form" onSubmit={enviar}>
      <div className="fila">
        <input
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Nueva tarea…"
          maxLength={LARGO_MAXIMO_TEXTO}
          aria-label="Nueva tarea"
        />
        <button type="submit" className="agregar" disabled={texto.trim() === ''}>
          Agregar
        </button>
      </div>
      <div className="tipos" role="radiogroup" aria-label="Tipo de tarea">
        {TIPOS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={tipo === t.id}
            className={tipo === t.id ? 'elegido' : ''}
            onClick={() => setTipo(t.id)}
          >
            {t.texto}
          </button>
        ))}
      </div>
    </form>
  )
}

export default TaskForm
