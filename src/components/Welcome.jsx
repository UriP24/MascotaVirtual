import { useState } from 'react'
import './Welcome.css'

// El mensaje de Uri, tal cual lo escribió.
const MENSAJE = [
  'Mi amor, feliz cumpleaños, esta vez decidí ser un poco mas creativo con tu regalo. Así q con mi amigo Claudio (Claude Code), decidimos hacerte un regalo. Tu propia mascota virtual.',
  'Espero que te guste, que lo disfrutes, que te entretengas y que te sirva sobre todas las cosas.',
]
const FIRMA = 'Te Amo, Uri ❤️'

// Bienvenida de la primera vez: el mensaje de Uri → "¿Estás lista?" → "¡Hola, Mari!, soy Bolti".
// Bolti todavía no se ve: aparece recién al tocar "Conocer a Bolti".
function Welcome({ onTerminar }) {
  const [paso, setPaso] = useState(0)

  return (
    <div className="welcome">
      {/* La key reinicia la animación de entrada en cada paso */}
      <div className="welcome-paso" key={paso}>
        {paso === 0 && (
          <>
            <div className="carta">
              <span className="sobre" aria-hidden="true">
                💌
              </span>
              {MENSAJE.map((parrafo) => (
                <p key={parrafo}>{parrafo}</p>
              ))}
              <p className="firma">{FIRMA}</p>
            </div>
            <button className="principal" onClick={() => setPaso(1)}>
              Seguir
            </button>
          </>
        )}

        {paso === 1 && (
          <>
            <h1>¿Estás lista para empezar?</h1>
            <button className="principal" onClick={() => setPaso(2)}>
              Sí
            </button>
          </>
        )}

        {paso === 2 && (
          <>
            <div className="huellitas" aria-hidden="true">
              <span>🐾</span>
              <span>🐾</span>
              <span>🐾</span>
            </div>
            <h1 className="hola">¡Hola, Mari!, soy Bolti</h1>
            <button className="principal" onClick={onTerminar}>
              Conocer a Bolti
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default Welcome
