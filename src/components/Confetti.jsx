import { useState } from 'react'
import './Confetti.css'

const COLORES = ['#ec6f9e', '#2bb8b0', '#a488ec', '#ffd666', '#ffd9e7']
const CANTIDAD = 48

function crearPapelitos() {
  return Array.from({ length: CANTIDAD }, (_, i) => ({
    id: i,
    izquierda: Math.random() * 100,
    demora: Math.random() * 1.2,
    duracion: 2.4 + Math.random() * 1.6,
    color: COLORES[i % COLORES.length],
    giro: Math.random() * 360,
    ancho: 6 + Math.random() * 6,
  }))
}

// Lluvia de papelitos de colores (solo CSS). No bloquea los toques.
function Confetti() {
  const [papelitos] = useState(crearPapelitos)
  return (
    <div className="confetti" aria-hidden="true">
      {papelitos.map((p) => (
        <span
          key={p.id}
          style={{
            left: `${p.izquierda}%`,
            width: p.ancho,
            background: p.color,
            animationDelay: `${p.demora}s`,
            animationDuration: `${p.duracion}s`,
            '--giro': `${p.giro}deg`,
          }}
        />
      ))}
    </div>
  )
}

export default Confetti
