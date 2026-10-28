import { useEffect, useState } from 'react'
import TaskForm from '../components/TaskForm.jsx'
import TaskItem from '../components/TaskItem.jsx'
import Toast from '../components/Toast.jsx'
import SecretFound from '../components/SecretFound.jsx'
import { esTareaDePaseo } from '../logic/paseo.js'
import { descubrir, estaDescubierto } from '../logic/secretos.js'
import StudyTimer from '../components/StudyTimer.jsx'
import StudyStats from '../components/StudyStats.jsx'
import {
  actualizarCronometro,
  agregarTarea,
  agregarTareaDePaseo,
  borrarTarea,
  completarTarea,
  msDisponibles,
  tareasConRecompensaRestantes,
} from '../logic/tareas.js'
import { festejarLogro } from '../logic/festejo.js'
import { rachaActual } from '../logic/estadisticas.js'
import './Tareas.css'

function Tareas({ estado, setEstado }) {
  const [aviso, setAviso] = useState(null)
  const [verEstadisticas, setVerEstadisticas] = useState(false)
  const [secretoPaseo, setSecretoPaseo] = useState(false)
  const ahora = new Date(estado.perrita.actualizadaEn) // App lo actualiza cada minuto
  const racha = rachaActual(estado, ahora)

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
    let nuevo
    if (esTareaDePaseo(texto)) {
      // "Pasear a Bolti": tarea única, se anota una sola vez y se completa jugando al Paseo
      const r = agregarTareaDePaseo(estado, texto)
      if (r.resultado === 'repetida') {
        avisar('Esa tarea ya la anotaste 🐾 El paseo ya está en 🎮 Jugar')
        return
      }
      nuevo = r.estado
    } else {
      nuevo = agregarTarea(estado, texto, tipo)
    }
    // Secreto: anotar "pasear a Bolti" desbloquea el minijuego del paseo
    if (esTareaDePaseo(texto) && !estaDescubierto(nuevo, 'paseo')) {
      nuevo = descubrir(nuevo, 'paseo', new Date()).estado
      setSecretoPaseo(true)
      navigator.vibrate?.([30, 50, 30])
    }
    setEstado(nuevo)
  }

  function completar(id) {
    const resultado = completarTarea(estado, id)
    if (!resultado.completada) return
    const tarea = estado.tareas.find((t) => t.id === id)
    setEstado(festejarLogro(resultado.estado, tarea.tipo === 'estudio' ? 'estudio' : 'tarea'))
    if (resultado.puntos > 0) avisar(`¡Bien! +${resultado.puntos} ⭐ · Bolti está orgullosa 🐶`)
    else if (resultado.monedas > 0) avisar(`¡Bien! +${resultado.monedas} 🪙 · Bolti está orgullosa 🐶`)
    else avisar('Ya juntaste las monedas de hoy · Bolti igual te festeja 💕')
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
      <div className="titulo">
        <h1>📝 Tareas</h1>
        <button className="ver-estadisticas" onClick={() => setVerEstadisticas(true)}>
          🔥 {racha} {racha === 1 ? 'día' : 'días'} · 📊
        </button>
      </div>
      <TaskForm onAgregar={agregar} />
      <p className="recompensas">
        {tareasConRecompensaRestantes(estado) > 0
          ? `Hoy ${tareasConRecompensaRestantes(estado) === 1 ? 'te queda 1 tarea' : `te quedan ${tareasConRecompensaRestantes(estado)} tareas`} con monedas 🪙`
          : 'Ya juntaste las monedas de tareas de hoy 🪙 · mañana hay más'}
      </p>

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
      {secretoPaseo && (
        <SecretFound
          id="paseo"
          extra="¡Bolti se puso loca de contenta! Hay un juego nuevo en 🎮 Jugar: Paseo con Bolti 🐾"
          onCerrar={() => setSecretoPaseo(false)}
        />
      )}
      {verEstadisticas && <StudyStats estado={estado} ahora={ahora} onCerrar={() => setVerEstadisticas(false)} />}
    </section>
  )
}

export default Tareas
