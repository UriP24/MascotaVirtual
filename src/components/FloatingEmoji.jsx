import './FloatingEmoji.css'

// Emojis que suben y se desvanecen (corazones de los mimos, etc.).
// items: [{ id, emoji, x, y, dx }] con x, y en píxeles dentro del contenedor.
function FloatingEmoji({ items }) {
  return items.map((item) => (
    <span
      key={item.id}
      className="floating-emoji"
      style={{ left: item.x, top: item.y, '--dx': `${item.dx}px` }}
      aria-hidden="true"
    >
      {item.emoji}
    </span>
  ))
}

export default FloatingEmoji
