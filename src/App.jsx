import { useEffect, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Casa from './screens/Casa.jsx'
import Tareas from './screens/Tareas.jsx'
import Canjes from './screens/Canjes.jsx'
import Jugar from './screens/Jugar.jsx'
import { cargarEstado, guardarEstado } from './storage.js'
import { actualizarDia, retomarCronometros } from './logic/tareas.js'
import { actualizarBolti, horasDesdeUltimaVisita, registrarVisita } from './logic/bolti.js'
import './App.css'

const PANTALLAS = {
  casa: Casa,
  tareas: Tareas,
  canjes: Canjes,
  jugar: Jugar,
}

function App() {
  const [pantallaActiva, setPantallaActiva] = useState('casa')
  // La función se ejecuta una sola vez, al arrancar: lee el progreso, retoma cronómetros
  // que hayan quedado abiertos, crea la tarea de estudio del día si corresponde y calcula
  // lo que le pasó a Bolti mientras la app estuvo cerrada.
  const [inicio] = useState(() => {
    const cargado = actualizarBolti(actualizarDia(retomarCronometros(cargarEstado())))
    return {
      estado: registrarVisita(cargado),
      horasAusente: horasDesdeUltimaVisita(cargado.perrita), // para que Bolti la salude
    }
  })
  const [estado, setEstado] = useState(inicio.estado)

  // Cada minuto: revisa si cambió el día y avanza las necesidades de Bolti.
  useEffect(() => {
    const timer = setInterval(() => setEstado((e) => actualizarBolti(actualizarDia(e))), 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  // Cada vez que cambia el estado, se guarda en el celular.
  useEffect(() => {
    guardarEstado(estado)
  }, [estado])

  const Pantalla = PANTALLAS[pantallaActiva]

  return (
    <div className="app">
      <TopBar monedas={estado.monedas} puntos={estado.puntos} />
      <Pantalla estado={estado} setEstado={setEstado} horasAusente={inicio.horasAusente} />
      <BottomNav pantallaActiva={pantallaActiva} onCambiar={setPantallaActiva} />
    </div>
  )
}

export default App
