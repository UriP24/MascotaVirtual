import { useEffect, useState } from 'react'
import TaskForm from '../components/TaskForm.jsx'
import TaskItem from '../components/TaskItem.jsx'
import Toast from '../components/Toast.jsx'
import StudyTimer from '../components/StudyTimer.jsx'
import {
  actualizarCronometro,
  agregarTarea,
  borrarTarea,
  completarTarea,
  msDisponibles,
} from '../logic/tareas.js'
import { festejarLogro } from '../logic/festejo.js'
import './Tareas.css'

function Tareas({ estado, setEstado }) {
  const [aviso, setAviso] = useState(null)

  // El aviso se borra solo después de un ratito.
  useEffect(() => {
    if (!aviso) return
    const timer = setTimeout(() => setAviso(null), 1800)
    return () => clearTimeout(timer)
  }, [aviso])

  function avisar(texto) {
    setAviso({ texto, id: Date.now() })
  }

  function agregar(texto, tipo) {
    setEstado(agregarTarea(estado, texto, tipo))
  }

  function completar(id) {
    const resultado = completarTarea(estado, id)
    if (resultado.puntos === 0) return
    const tarea = estado.tareas.find((t) => t.id === id)
    setEstado(festejarLogro(resultado.estado, tarea.tipo === 'estudio' ? 'estudio' : 'tarea'))
    avisar(`¡Bien! +${resultado.puntos} ⭐ · Bolti está orgullosa 🐶`)
  }

  function borrar(tarea) {
    if (!window.confirm(`¿Borrar "${tarea.texto}"?`)) return
    setEstado(borrarTarea(estado, tarea.id))
  }

  const pendientes = estado.tareas.filter((t) => !t.hecha)
  const hechas = estado.tareas.filter((t) => t.hecha)

  function renderTarea(tarea) {
    return (
      <TaskItem key={tarea.id} tarea={tarea} onCompletar={completar} onBorrar={borrar}>
        {tarea.tipo === 'estudio' && !tarea.hecha && (
          <StudyTimer
            tarea={tarea}
            limiteMs={msDisponibles(estado, tarea.id)}
            onActualizar={(cambio) => setEstado((e) => actualizarCronometro(e, tarea.id, cambio))}
            onCompletar={completar}
          />
        )}
      </TaskItem>
    )
  }

  return (
    <section className="pantalla tareas">
      <h1>📝 Tareas</h1>
      <TaskForm onAgregar={agregar} />

      <h2>Pendientes</h2>
      {pendientes.length === 0 ? (
        <p className="vacio">¡No hay nada pendiente! Bolti está orgullosa 🐾</p>
      ) : (
        <ul>{pendientes.map(renderTarea)}</ul>
      )}

      {hechas.length > 0 && (
        <>
          <h2>Hechas</h2>
          <ul>{hechas.map(renderTarea)}</ul>
        </>
      )}

      <Toast mensaje={aviso} />
    </section>
  )
}

export default Tareas
