import './ConfirmDialog.css'

// Confirmación dentro de la app (los diálogos del navegador no siempre andan en la app instalada).
function ConfirmDialog({ titulo, children, textoConfirmar, onConfirmar, onCancelar }) {
  return (
    <div className="confirm-fondo" onClick={onCancelar}>
      <div className="confirm" role="dialog" aria-modal="true" aria-label={titulo} onClick={(e) => e.stopPropagation()}>
        <h2>{titulo}</h2>
        <div className="cuerpo">{children}</div>
        <div className="botones">
          <button className="cancelar" onClick={onCancelar}>
            Cancelar
          </button>
          <button className="confirmar" onClick={onConfirmar}>
            {textoConfirmar}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
