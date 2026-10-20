import './SpeechBubble.css'

// Globito de diálogo de Bolti. La key hace que la animación arranque con cada frase nueva.
function SpeechBubble({ texto }) {
  if (!texto) return null
  return (
    <div className="speech-bubble" role="status" key={texto}>
      {texto}
    </div>
  )
}

export default SpeechBubble
