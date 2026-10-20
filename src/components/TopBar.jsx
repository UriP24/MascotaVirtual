import './TopBar.css'

function TopBar({ monedas, puntos }) {
  return (
    <header className="top-bar">
      <div className="contador moneda" aria-label="Monedas">
        <span>🪙</span>
        <strong>{monedas}</strong>
      </div>
      <div className="contador punto" aria-label="Puntos">
        <span>⭐</span>
        <strong>{puntos}</strong>
      </div>
    </header>
  )
}

export default TopBar
