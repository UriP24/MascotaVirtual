import { useState } from 'react'
import { JUEGOS } from '../config.js'
import CatchBones from '../components/CatchBones.jsx'
import { empezarPartida, puedeJugar, terminarPartida } from '../logic/juegos.js'
import './Jugar.css'

const MOTIVOS = {
  durmiendo: 'Bolti está durmiendo 😴',
  cansada: 'Bolti está cansada, dejala descansar un rato 🥱',
}

function Jugar({ estado, setEstado }) {
  const [fase, setFase] = useState('menu') // 'menu' | 'jugando' | 'resultado'
  const [resultado, setResultado] = useState(null)
  const disponible = puedeJugar(estado, estado.perrita.actualizadaEn)
  const energia = Math.round(estado.perrita.energia)

  function jugar() {
    if (!puedeJugar(estado).ok) return
    setEstado(empezarPartida(estado))
    setFase('jugando')
  }

  function terminar(r) {
    setEstado((e) => terminarPartida(e, r.monedas))
    setResultado(r)
    setFase('resultado')
  }

  if (fase === 'jugando') return <CatchBones onTerminar={terminar} />

  return (
    <section className="pantalla jugar">
      <h1>🎮 Jugar</h1>
      <div className="energia">
        <span>⚡ Energía de Bolti</span>
        <div className="barra" aria-hidden="true">
          <i style={{ width: `${energia}%` }} />
        </div>
        <strong>{energia}</strong>
      </div>

      {fase === 'resultado' && resultado && (
        <div className="resultado" role="status">
          <span className="grande">{resultado.vidas > 0 ? '🎉' : '🍫'}</span>
          <strong>
            ¡Atrapaste {resultado.huesos} {resultado.huesos === 1 ? 'huesito' : 'huesitos'}!
          </strong>
          <span>
            +{resultado.monedas} 🪙 · +{JUEGOS.CARINO_POR_PARTIDA} 💗 · −{JUEGOS.ENERGIA_POR_PARTIDA} ⚡
          </span>
          {resultado.monedas >= JUEGOS.HUESITOS_MONEDAS_MAXIMAS && <small>¡Llegaste al máximo de la partida!</small>}
        </div>
      )}

      <ul className="juegos">
        <li className="juego">
          <span className="emoji" aria-hidden="true">
            🦴
          </span>
          <div className="info">
            <strong>Atrapá los huesitos</strong>
            <small>
              Mové a Bolti con el dedo y atrapá los huesitos que caen. ¡Ojo con el chocolate 🍫!
            </small>
            <small className="detalle">
              {JUEGOS.HUESITOS_DURACION_SEGUNDOS} s · cuesta {JUEGOS.ENERGIA_POR_PARTIDA} ⚡ · hasta {JUEGOS.HUESITOS_MONEDAS_MAXIMAS} 🪙 y +
              {JUEGOS.CARINO_POR_PARTIDA} 💗
            </small>
          </div>
          <button onClick={jugar} disabled={!disponible.ok}>
            {fase === 'resultado' ? 'Otra vez' : 'Jugar'}
          </button>
        </li>
      </ul>
      {!disponible.ok && <p className="motivo">{MOTIVOS[disponible.motivo]}</p>}
      <p className="pronto">Pronto: más juegos con Bolti 🐾</p>
    </section>
  )
}

export default Jugar
