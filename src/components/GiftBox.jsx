import './GiftBox.css'

// Regalo que se sacude y brilla en la habitación hasta que Mari lo toca.
function GiftBox({ onAbrir }) {
  return (
    <button className="gift-box" onClick={onAbrir} aria-label="Abrir el regalo">
      <span className="brillo" aria-hidden="true">
        ✨
      </span>
      <span className="caja" aria-hidden="true">
        🎁
      </span>
      <span className="cartelito">¡Tocame!</span>
    </button>
  )
}

export default GiftBox
