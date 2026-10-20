import { useEffect, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Casa from './screens/Casa.jsx'
import Tareas from './screens/Tareas.jsx'
import Canjes from './screens/Canjes.jsx'
import Jugar from './screens/Jugar.jsx'
import { cargarEstado, guardarEstado } from './storage.js'
import { actualizarDia, retomarCronometros } from './logic/tareas.js'
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
  // que hayan quedado abiertos y crea la tarea de estudio del día si corresponde.
  const [estado, setEstado] = useState(() => actualizarDia(retomarCronometros(cargarEstado())))

  // Cada minuto revisa si cambió el día (por si la app queda abierta pasada la medianoche).
  useEffect(() => {
    const timer = setInterval(() => setEstado((e) => actualizarDia(e)), 60 * 1000)
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
      <Pantalla estado={estado} setEstado={setEstado} />
      <BottomNav pantallaActiva={pantallaActiva} onCambiar={setPantallaActiva} />
    </div>
  )
}

export default App
