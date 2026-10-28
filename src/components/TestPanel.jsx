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
  ultraEnLaProxima,
  mostrarRegaloDeCumple,
  sacarGorrito,
  lanzarEvento,
  borrarSecretos,
  desbloquearPaseo,
  caballoEnElProximoPaseo,
  vaciarRopa,
  volverAlHorarioNormal,
} from '../logic/prueba.js'
import { regalarTiradas } from '../logic/gacha.js'
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
        ['+25 min', (e) => sumarEstudio(e, 25)],
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
    {
      titulo: '✨ Gacha',
      acciones: [
        ['+10 tiradas gratis', (e) => regalarTiradas(e, 10)],
        ['Ultra en la próxima', (e) => ultraEnLaProxima(e)],
        ['+50 ⭐', (e) => sumarPuntos(e, 50)],
        ['Vaciar ropa', (e) => vaciarRopa(e)],
      ],
    },
    {
      titulo: '🔍 Secretos (cerrá el panel para verlos)',
      acciones: [
        ['Pasa un gato', (e) => lanzarEvento(e, 'gato')],
        ['Pasa una vaca', (e) => lanzarEvento(e, 'vaca')],
        ['Trae una media', (e) => lanzarEvento(e, 'media')],
        ['Aparece el puré', (e) => lanzarEvento(e, 'pure')],
        ['Estrella fugaz', (e) => lanzarEvento(e, 'estrella')],
        ['Sacudir el celu', (e) => lanzarEvento(e, 'sacudida')],
        ['Hoy es San Valentín', (e) => lanzarEvento(e, 'san-valentin')],
        ['Hoy es aniversario', (e) => lanzarEvento(e, 'aniversario')],
        ['Desbloquear paseo', (e) => desbloquearPaseo(e)],
        ['Caballo en el próximo paseo', (e) => caballoEnElProximoPaseo(e)],
        ['Borrar secretos', (e) => borrarSecretos(e)],
      ],
    },
    {
      titulo: '🎂 Cumple',
      acciones: [
        ['Mostrar regalo de cumple', (e) => mostrarRegaloDeCumple(e)],
        ['Sacar gorrito', (e) => sacarGorrito(e)],
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
