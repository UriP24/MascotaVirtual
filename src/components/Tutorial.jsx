import { useState } from 'react'
import { ECONOMIA, GACHA } from '../config.js'
import './Tutorial.css'

const PAGINAS = [
  {
    emoji: '🐶',
    titulo: 'Esta es Bolti',
    texto: 'Tocala para que salte y frotala con el dedo para hacerle mimos. Le encanta que la mimes 💕',
  },
  {
    emoji: '🎒',
    titulo: 'Darle de comer',
    texto: 'Comprale comida en la 🛒 tienda con tus 🪙. Después abrí la 🎒 mochila y tocá la comida (o arrastrala hasta su boca).',
  },
  {
    emoji: '💤',
    titulo: 'A dormir',
    texto: 'Desde las 22 le podés apagar la luz. A las 00 se duerme sola y se despierta a las 10. Si está muy cansada, puede dormir una siestita.',
  },
  {
    emoji: '📝',
    titulo: 'Tareas',
    texto: `Anotá tus tareas del día: cada una te da ${ECONOMIA.MONEDAS_POR_TAREA} 🪙 (las primeras ${ECONOMIA.TAREAS_CON_RECOMPENSA_POR_DIA} de cada día).`,
  },
  {
    emoji: '🍅',
    titulo: 'Estudiar',
    texto: `De lunes a viernes aparece la tarea "Estudiar". Estudiá en pomodoros de ${ECONOMIA.MINUTOS_POR_BLOQUE_ESTUDIO} minutos: cada uno te da ${ECONOMIA.PUNTOS_POR_BLOQUE_ESTUDIO} ⭐. Si salís de la app, el reloj se pausa.`,
  },
  {
    emoji: '🎁',
    titulo: 'Canjes',
    texto: `Con tus ⭐ canjeás planes para hacer juntos y te llevás un cupón. También podés cambiar ${ECONOMIA.MONEDAS_POR_PUNTO} 🪙 por 1 ⭐ por día.`,
  },
  {
    emoji: '✨',
    titulo: 'Gacha',
    texto: `En Canjes → Gacha gastás ⭐ en ropita para Bolti. A las ${GACHA.GARANTIA_ULTRA} tiradas te toca una ultra rara asegurada.`,
  },
  {
    emoji: '🎮',
    titulo: 'Jugar',
    texto: 'Los minijuegos te dan 🪙 y a Bolti le encanta jugar con vos (pero se cansa, así que dejala descansar).',
  },
  {
    emoji: '🐾',
    titulo: '¡Y algo más!',
    texto: 'Bolti nunca se enferma: si la descuidás se pone triste, y con mimos y comida vuelve a estar contenta. Ah, y tiene algunos secretos escondidos… 🤫',
  },
]

// Tutorial en páginas. Se ofrece después de la bienvenida y se puede volver a ver desde Configuración.
function Tutorial({ onCerrar }) {
  const [pagina, setPagina] = useState(0)
  const actual = PAGINAS[pagina]
  const esLaUltima = pagina === PAGINAS.length - 1

  return (
    <div className="tutorial-fondo">
      <div className="tutorial" role="dialog" aria-modal="true" aria-label="Cómo funciona">
        <button className="saltear" onClick={onCerrar}>
          {esLaUltima ? 'Cerrar' : 'Saltear'}
        </button>
        <div className="pagina" key={pagina}>
          <span className="emoji" aria-hidden="true">
            {actual.emoji}
          </span>
          <h2>{actual.titulo}</h2>
          <p>{actual.texto}</p>
        </div>
        <div className="puntitos" aria-label={`Página ${pagina + 1} de ${PAGINAS.length}`}>
          {PAGINAS.map((p, i) => (
            <span key={p.titulo} className={i === pagina ? 'activo' : undefined} />
          ))}
        </div>
        <div className="botones">
          <button className="anterior" disabled={pagina === 0} onClick={() => setPagina((n) => n - 1)}>
            Anterior
          </button>
          <button className="siguiente" onClick={esLaUltima ? onCerrar : () => setPagina((n) => n + 1)}>
            {esLaUltima ? '¡Listo! 🐾' : 'Siguiente'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Tutorial
