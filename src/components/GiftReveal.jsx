import { COMIDAS, ECONOMIA, PRENDAS, REGALO_CUMPLE } from '../config.js'
import './GiftReveal.css'

// Lo que traía el regalo de cumpleaños. El de la primera vez (`bienvenida`) trae además las monedas
// y los puntos para arrancar.
function GiftReveal({ bienvenida = false, onCerrar }) {
  const prenda = PRENDAS.find((p) => p.id === REGALO_CUMPLE.prenda)
  const comida = COMIDAS.find((c) => c.id === REGALO_CUMPLE.comida)
  const regalos = [
    { emoji: prenda.emoji, nombre: prenda.nombre, detalle: '¡Bolti ya lo tiene puesto!' },
    { emoji: comida.emoji, nombre: comida.nombre, detalle: 'Está en tu mochila 🎒' },
    { emoji: '✨', nombre: 'Multi gratis del gacha', detalle: `${REGALO_CUMPLE.tiradasGratis} tiradas en Canjes → Gacha` },
  ]
  if (bienvenida) {
    regalos.unshift(
      { emoji: '🪙', nombre: `${ECONOMIA.MONEDAS_DE_BIENVENIDA} monedas`, detalle: 'Para comprarle comida a Bolti en la Tienda' },
      { emoji: '⭐', nombre: `${ECONOMIA.PUNTOS_DE_BIENVENIDA} puntos de canje`, detalle: 'Para canjear planes juntos o tirar en el gacha' },
    )
  }

  return (
    <div className="gift-reveal-fondo">
      <div className="gift-reveal" role="dialog" aria-modal="true" aria-label="Tu regalo de cumpleaños">
        <span className="mono-regalo" aria-hidden="true">
          🎀
        </span>
        <h2>¡Feliz cumple, Mari! 🎂</h2>
        <ul>
          {regalos.map((r, i) => (
            <li key={r.nombre} style={{ animationDelay: `${0.3 + i * 0.35}s` }}>
              <span className="emoji" aria-hidden="true">
                {r.emoji}
              </span>
              <span className="texto">
                <strong>{r.nombre}</strong>
                <small>{r.detalle}</small>
              </span>
            </li>
          ))}
        </ul>
        <button onClick={onCerrar}>¡Gracias! 💕</button>
      </div>
    </div>
  )
}

export default GiftReveal
