import { useState } from 'react'
import { formatearMinutos } from '../logic/estadisticas.js'
import './StudyChart.css'

const ANCHO = 300
const ALTO = 150
const ARRIBA = 22 // lugar para el valor arriba de la barra
const ABAJO = 22 // lugar para las letras de los días
const IZQUIERDA = 30 // lugar para los minutos del eje
const BARRA = 24 // ancho máximo de barra
const RADIO = 4

// Escala "redonda" en pomodoros de 25 min (25, 50, 100, 150, 200…)
function maximoEje(valores) {
  const mayor = Math.max(...valores, 50)
  if (mayor <= 50) return 50
  if (mayor <= 100) return 100
  return Math.ceil(mayor / 50) * 50
}

// Columna con la punta redondeada (4 px) y la base recta, apoyada en la línea de base
function columna(x, y, ancho, alto) {
  if (alto <= 0) return ''
  const r = Math.min(RADIO, alto, ancho / 2)
  return `M${x},${y + alto} V${y + r} Q${x},${y} ${x + r},${y} H${x + ancho - r} Q${x + ancho},${y} ${x + ancho},${y + r} V${y + alto} Z`
}

// Gráfico de barras: minutos estudiados cada uno de los últimos 7 días (una sola serie).
// Tocar una barra muestra su valor; el de hoy se ve siempre.
function StudyChart({ dias }) {
  const [elegido, setElegido] = useState(dias.length - 1)
  const maximo = maximoEje(dias.map((d) => d.minutos))
  const altoUtil = ALTO - ARRIBA - ABAJO
  const anchoBanda = (ANCHO - IZQUIERDA) / dias.length
  const y = (minutos) => ARRIBA + altoUtil - (minutos / maximo) * altoUtil
  const marcas = [0, maximo / 2, maximo]

  return (
    <figure className="study-chart">
      <svg viewBox={`0 0 ${ANCHO} ${ALTO}`} role="group" aria-label="Minutos estudiados en los últimos 7 días">
        {marcas.map((m) => (
          <g key={m} aria-hidden="true">
            <line className="grilla" x1={IZQUIERDA} x2={ANCHO} y1={y(m)} y2={y(m)} />
            <text className="eje" x={IZQUIERDA - 6} y={y(m) + 4} textAnchor="end">
              {m}
            </text>
          </g>
        ))}
        {dias.map((d, i) => {
          const ancho = Math.min(BARRA, anchoBanda - 8)
          const x = IZQUIERDA + i * anchoBanda + (anchoBanda - ancho) / 2
          const alto = (d.minutos / maximo) * altoUtil
          const mostrarValor = i === elegido && d.minutos > 0
          return (
            <g
              key={d.fecha}
              className={`dia ${i === elegido ? 'elegido' : ''}`}
              role="img"
              aria-label={`${d.fecha}: ${formatearMinutos(d.minutos)}`}
              onClick={() => setElegido(i)}
            >
              {/* Zona para tocar, más grande que la barra */}
              <rect x={IZQUIERDA + i * anchoBanda} y={ARRIBA} width={anchoBanda} height={altoUtil + ABAJO} fill="transparent" />
              <path className="barra" d={columna(x, y(d.minutos), ancho, alto)} />
              {mostrarValor && (
                <text className="valor" x={x + ancho / 2} y={y(d.minutos) - 6} textAnchor="middle">
                  {formatearMinutos(d.minutos)}
                </text>
              )}
              <text className={`letra ${i === dias.length - 1 ? 'hoy' : ''}`} x={x + ancho / 2} y={ALTO - 6} textAnchor="middle">
                {i === dias.length - 1 ? 'Hoy' : d.letra}
              </text>
            </g>
          )
        })}
      </svg>
      <figcaption>Minutos por día · tocá una barra para ver su valor</figcaption>
    </figure>
  )
}

export default StudyChart
