import './Settings.css'

// Configuración: todo lo que no es central. Se abre con el botón ⚙️ de la barra de arriba.
const TEMAS = [
  { id: 'auto', nombre: 'Automático' },
  { id: 'claro', nombre: '☀️ Claro' },
  { id: 'oscuro', nombre: '🌙 Oscuro' },
]

function Settings({ secretos, tema, onCambiarTema, onVerTutorial, onVerMensaje, onVerSecretos, onCerrar }) {
  return (
    <div className="settings-fondo" onClick={onCerrar}>
      <div className="settings" role="dialog" aria-modal="true" aria-label="Configuración" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado">
          <h2>⚙️ Configuración</h2>
          <button className="cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <div className="tema">
          <span>🌗 Tema</span>
          <div className="opciones" role="radiogroup" aria-label="Tema">
            {TEMAS.map((t) => (
              <button key={t.id} role="radio" aria-checked={tema === t.id} className={tema === t.id ? 'elegido' : ''} onClick={() => onCambiarTema(t.id)}>
                {t.nombre}
              </button>
            ))}
          </div>
          {tema === 'auto' && <small>Sigue al celu: oscuro si el celu está en modo oscuro.</small>}
        </div>
        <ul>
          <li>
            <button onClick={onVerTutorial}>
              <span aria-hidden="true">📖</span>
              <span>Ver cómo funciona</span>
            </button>
          </li>
          <li>
            <button onClick={onVerSecretos}>
              <span aria-hidden="true">🔍</span>
              <span>
                Secretos descubiertos ({secretos.descubiertos}/{secretos.total})
              </span>
            </button>
          </li>
          <li>
            <button onClick={onVerMensaje}>
              <span aria-hidden="true">💌</span>
              <span>Volver a leer el mensaje de cumpleaños</span>
            </button>
          </li>
        </ul>
        <p className="nota">
          💾 Tu progreso se guarda solo en este celular cada vez que hacés algo, y todos los días se hace una copia de
          seguridad aparte.
        </p>
      </div>
    </div>
  )
}

export default Settings
