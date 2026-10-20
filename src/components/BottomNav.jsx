import './BottomNav.css'

const PESTANAS = [
  { id: 'casa', icono: '🏠', texto: 'Casa' },
  { id: 'tareas', icono: '📝', texto: 'Tareas' },
  { id: 'canjes', icono: '🎁', texto: 'Canjes' },
  { id: 'jugar', icono: '🎮', texto: 'Jugar' },
]

function BottomNav({ pantallaActiva, onCambiar }) {
  return (
    <nav className="bottom-nav">
      {PESTANAS.map((pestana) => (
        <button
          key={pestana.id}
          className={pestana.id === pantallaActiva ? 'activa' : ''}
          onClick={() => onCambiar(pestana.id)}
        >
          <span className="icono">{pestana.icono}</span>
          <span>{pestana.texto}</span>
        </button>
      ))}
    </nav>
  )
}

export default BottomNav
