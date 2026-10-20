import './Toast.css'

// Cartelito que aparece un momento, por ejemplo "+2 ⭐".
function Toast({ mensaje }) {
  if (!mensaje) return null
  return (
    <div className="toast" role="status" key={mensaje.id}>
      {mensaje.texto}
    </div>
  )
}

export default Toast
