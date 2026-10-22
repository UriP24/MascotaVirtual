import { useState } from 'react'
import {
  adelantarBolti,
  cambiarBolti,
  llenarBandeja,
  liberarCanjes,
  borrarCupones,
  liberarCambioDelDia,
  reiniciarTodo,
  simularQueNoEstudio,
  sumarEstudio,
  sumarMonedas,
  sumarPuntos,
  volverAlHorarioNormal,
} from '../logic/prueba.js'
import './TestPanel.css'

// Panel oculto del modo prueba. Solo aparece con ?prueba en el link (o con npm run dev).
function TestPanel({ estado, setEstado }) {
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
        ['Con hambre', (e) => cambiarBolti(e, { saciedad: 15 })],
        ['Triste', (e) => cambiarBolti(e, { carino: 15, saciedad: Math.max(e.perrita.saciedad, 50) })],
        ['Cansada', (e) => cambiarBolti(e, { energia: 15 })],
        ['Energía llena', (e) => cambiarBolti(e, { energia: 100 })],
        ['Dormida', (e) => cambiarBolti(e, { durmiendo: true })],
        ['Todo lleno', (e) => cambiarBolti(e, { saciedad: 100, energia: 100, carino: 100 })],
        ['Contenta normal', (e) => cambiarBolti(e, { saciedad: 80, energia: 80, carino: 80 })],
      ],
    },
    {
      titulo: '💰 Economía',
      acciones: [
        ['+50 🪙', (e) => sumarMonedas(e, 50)],
        ['+10 ⭐', (e) => sumarPuntos(e, 10)],
        ['+100 🪙', (e) => sumarMonedas(e, 100)],
        ['Llenar bandeja', (e) => llenarBandeja(e)],
      ],
    },
    {
      titulo: '🎁 Canjes',
      acciones: [
        ['Liberar canjes', (e) => liberarCanjes(e)],
        ['Liberar cambio de hoy', (e) => liberarCambioDelDia(e)],
        ['Borrar cupones', (e) => borrarCupones(e)],
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
      <div className="grupo">
        <span>🕐 Horario de sueño</span>
        {estado.perrita.forzado ? (
          <div className="botones">
            <small>
              Forzada {estado.perrita.forzado.durmiendo ? 'dormida' : 'despierta'} hasta las{' '}
              {new Date(estado.perrita.forzado.hasta).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}
            </small>
            <button onClick={() => setEstado((e) => volverAlHorarioNormal(e))}>Volver al horario normal</button>
          </div>
        ) : (
          <small>Normal: duerme de 00:00 a 10:00. Los botones de Bolti la fuerzan 1 hora.</small>
        )}
      </div>
    </div>
  )
}

export default TestPanel
