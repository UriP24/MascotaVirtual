import { CARTA_ANIVERSARIO } from '../config.js'
import './SpecialCard.css'

// La cartita de las fechas especiales: el aniversario (24/3) y San Valentín (14/2).
function SpecialCard({ tipo, onCerrar }) {
  const aniversario = tipo === 'aniversario'
  return (
    <div className="special-card-fondo">
      <div className="special-card" role="dialog" aria-modal="true" aria-label={aniversario ? 'Feliz aniversario' : 'Feliz San Valentín'}>
        <span className="sobre" aria-hidden="true">
          {aniversario ? '💌' : '💘'}
        </span>
        <h2>{aniversario ? '¡Feliz aniversario!' : '¡Feliz San Valentín, Mari!'}</h2>
        {aniversario ? (
          <>
            {CARTA_ANIVERSARIO.map((parrafo) => (
              <p key={parrafo}>{parrafo}</p>
            ))}
            <p className="firma">Uri ❤️</p>
          </>
        ) : (
          <p>Hoy Bolti te quiere el doble (y eso que ya te quiere un montón) 🐾💕</p>
        )}
        <button onClick={onCerrar}>💕</button>
      </div>
    </div>
  )
}

export default SpecialCard
