import { useState } from 'react'
import { JUEGOS } from '../config.js'
import CatchBones from '../components/CatchBones.jsx'
import MemoryGame from '../components/MemoryGame.jsx'
import { empezarPartida, puedeJugar, terminarPartida } from '../logic/juegos.js'
import { formatearPuntaje } from '../logic/puntaje.js'
import './Jugar.css'

const MOTIVOS = {
  durmiendo: 'Bolti está durmiendo 😴',
  cansada: 'Bolti está cansada, dejala descansar un rato 🥱',
}

const MINIJUEGOS = [
  {
    id: 'huesitos',
    emoji: '🦴',
    nombre: 'Atrapá los huesitos',
    descripcion: 'Atrapá huesitos con Bolti: si no tocás chocolate 🍫, la racha multiplica los puntos.',
    detalle: `${JUEGOS.HUESITOS_DURACION_SEGUNDOS} s`,
    Componente: CatchBones,
  },
  {
    id: 'memoria',
    emoji: '🧠',
    nombre: 'Memoria de Bolti',
    descripcion: 'Encontrá los pares de cosas de Bolti. Cada nivel tiene más cartas y te da más tiempo.',
    detalle: `arranca con ${JUEGOS.MEMORIA_TIEMPO_INICIAL} s`,
    Componente: MemoryGame,
  },
]

function textoResultado(r) {
  if (r.juego === 'memoria') {
    const pares = `${r.pares} ${r.pares === 1 ? 'par' : 'pares'}`
    if (r.niveles === 0) return `¡Encontraste ${pares}!`
    return `¡Encontraste ${pares} y pasaste ${r.niveles === 1 ? '1 nivel' : `${r.niveles} niveles`}!`
  }
  return `¡Atrapaste ${r.huesos} ${r.huesos === 1 ? 'huesito' : 'huesitos'}!`
}

function Jugar({ estado, setEstado }) {
  const [jugando, setJugando] = useState(null) // id del minijuego en curso
  const [resultado, setResultado] = useState(null)
  const disponible = puedeJugar(estado, estado.perrita.actualizadaEn)
  const energia = Math.round(estado.perrita.energia)

  function jugar(id) {
    if (!puedeJugar(estado).ok) return
    setEstado(empezarPartida(estado))
    setResultado(null)
    setJugando(id)
  }

  function terminar(r) {
    const fin = terminarPartida(estado, jugando, r.puntaje)
    setEstado(fin.estado)
    setResultado({ ...r, juego: jugando, monedas: fin.monedas, nuevoRecord: fin.nuevoRecord, premioRecord: fin.premioRecord })
    setJugando(null)
  }

  const enCurso = MINIJUEGOS.find((m) => m.id === jugando)
  if (enCurso) return <enCurso.Componente onTerminar={terminar} />

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

      {resultado && (
        <div className="resultado" role="status">
          <span className="grande">{resultado.nuevoRecord ? '🏆' : '🎉'}</span>
          <strong>{textoResultado(resultado)}</strong>
          <span className="puntaje">⭐ {formatearPuntaje(resultado.puntaje)} puntos</span>
          {resultado.nuevoRecord && <span className="record">¡Nuevo récord! 🏆 +{resultado.premioRecord} 🪙 de premio</span>}
          <span>
            +{resultado.monedas} 🪙 · +{JUEGOS.CARINO_POR_PARTIDA} 💗 · −{JUEGOS.ENERGIA_POR_PARTIDA} ⚡
          </span>
        </div>
      )}

      <ul className="juegos">
        {MINIJUEGOS.map((m) => (
          <li key={m.id} className="juego">
            <span className="emoji" aria-hidden="true">
              {m.emoji}
            </span>
            <div className="info">
              <strong>{m.nombre}</strong>
              <small>{m.descripcion}</small>
              <small className="detalle">
                {m.detalle} · cuesta {JUEGOS.ENERGIA_POR_PARTIDA} ⚡ · más puntos, más 🪙 · +{JUEGOS.CARINO_POR_PARTIDA} 💗
              </small>
              {estado.records?.[m.id] > 0 && <small className="record-juego">🏆 Récord: {formatearPuntaje(estado.records[m.id])}</small>}
            </div>
            <button onClick={() => jugar(m.id)} disabled={!disponible.ok} aria-label={`Jugar ${m.nombre}`}>
              {resultado?.juego === m.id ? 'Otra vez' : 'Jugar'}
            </button>
          </li>
        ))}
      </ul>
      {!disponible.ok && <p className="motivo">{MOTIVOS[disponible.motivo]}</p>}
      <p className="pronto">Pronto: más juegos con Bolti 🐾</p>
    </section>
  )
}

export default Jugar
