import { useState } from 'react'
import {
  adelantarBolti,
  cambiarBolti,
  reiniciarTodo,
  simularQueNoEstudio,
  sumarEstudio,
  sumarMonedas,
  sumarPuntos,
} from '../logic/prueba.js'
import './TestPanel.css'

// Panel oculto del modo prueba. Solo aparece con ?prueba en el link (o con npm run dev).
function TestPanel({ setEstado }) {
  const [abierto, setAbierto] = useState(false)
  const [confirmarReinicio, setConfirmarReinicio] = useState(false)

  const grupos = [
    {
      titulo: '⏱ Estudio',
      acciones: [
        ['+10 min', (e) => sumarEstudio(e, 10)],
        ['+30 min', (e) => sumarEstudio(e, 30)],
        ['Ayer no estudió', (e) => simularQueNoEstudio(e)],
      ],
    },
    {
      titulo: '🐶 Bolti',
      acciones: [
        ['Adelantar 1 h', (e) => adelantarBolti(e, 1)],
        ['Adelantar 6 h', (e) => adelantarBolti(e, 6)],
        ['Con hambre', (e) => cambiarBolti(e, { saciedad: 15, durmiendo: false })],
        ['Triste', (e) => cambiarBolti(e, { carino: 15, durmiendo: false })],
        ['Dormida', (e) => cambiarBolti(e, { durmiendo: true })],
        ['Todo lleno', (e) => cambiarBolti(e, { saciedad: 100, energia: 100, carino: 100, durmiendo: false })],
      ],
    },
    {
      titulo: '💰 Economía',
      acciones: [
        ['+50 🪙', (e) => sumarMonedas(e, 50)],
        ['+10 ⭐', (e) => sumarPuntos(e, 10)],
      ],
    },
  ]

  if (!abierto) {
    return (
      <button className="test-panel-abrir" onClick={() => setAbierto(true)} aria-label="Abrir modo prueba">
        🧪
      </button>
    )
  }

  return (
    <div className="test-panel" role="dialog" aria-label="Modo prueba">
      <div className="encabezado">
        <strong>🧪 Modo prueba</strong>
        <button onClick={() => setAbierto(false)} aria-label="Cerrar">
          ✕
        </button>
      </div>
      {grupos.map((grupo) => (
        <div key={grupo.titulo} className="grupo">
          <span>{grupo.titulo}</span>
          <div className="botones">
            {grupo.acciones.map(([texto, accion]) => (
              <button key={texto} onClick={() => setEstado(accion)}>
                {texto}
              </button>
            ))}
          </div>
        </div>
      ))}
      <div className="grupo">
        <span>🔄 Progreso</span>
        <div className="botones">
          {confirmarReinicio ? (
            <>
              <button
                className="peligro"
                onClick={() => {
                  setEstado(reiniciarTodo())
                  setConfirmarReinicio(false)
                }}
              >
                Sí, borrar todo
              </button>
              <button onClick={() => setConfirmarReinicio(false)}>Cancelar</button>
            </>
          ) : (
            <button onClick={() => setConfirmarReinicio(true)}>Reiniciar todo</button>
          )}
        </div>
      </div>
      <small>"Dormida" de día dura hasta el próximo minuto: a esa hora Bolti se despierta sola.</small>
    </div>
  )
}

export default TestPanel
