import './ActionBar.css'

// Botones de acción de Casa, abajo, al alcance del pulgar.
// acciones: [{ id, icono, texto, onClick }]
function ActionBar({ acciones }) {
  return (
    <div className="action-bar">
      {acciones.map((a) => (
        <button key={a.id} onClick={a.onClick}>
          <span aria-hidden="true">{a.icono}</span>
          {a.texto}
        </button>
      ))}
    </div>
  )
}

export default ActionBar
