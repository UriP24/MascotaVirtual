import './Settings.css'

// Configuración: todo lo que no es central. Se abre con el botón ⚙️ de la barra de arriba.
function Settings({ onVerTutorial, onVerMensaje, onCerrar }) {
  return (
    <div className="settings-fondo" onClick={onCerrar}>
      <div className="settings" role="dialog" aria-modal="true" aria-label="Configuración" onClick={(e) => e.stopPropagation()}>
        <div className="encabezado">
          <h2>⚙️ Configuración</h2>
          <button className="cerrar" onClick={onCerrar} aria-label="Cerrar">
            ✕
          </button>
        </div>
        <ul>
          <li>
            <button onClick={onVerTutorial}>
              <span aria-hidden="true">📖</span>
              <span>Ver cómo funciona</span>
            </button>
          </li>
          <li>
            <button onClick={onVerMensaje}>
              <span aria-hidden="true">💌</span>
              <span>Volver a leer el mensaje de cumpleaños</span>
            </button>
          </li>
        </ul>
        <p className="nota">💾 Tu progreso se guarda solo en este celular cada vez que hacés algo.</p>
      </div>
    </div>
  )
}

export default Settings
