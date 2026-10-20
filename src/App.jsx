import { useEffect, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Casa from './screens/Casa.jsx'
import Tareas from './screens/Tareas.jsx'
import Canjes from './screens/Canjes.jsx'
import Jugar from './screens/Jugar.jsx'
import { cargarEstado, guardarEstado } from './storage.js'
import './App.css'

const PANTALLAS = {
  casa: Casa,
  tareas: Tareas,
  canjes: Canjes,
  jugar: Jugar,
}

function App() {
  const [pantallaActiva, setPantallaActiva] = useState('casa')
  // Se pasa la función (sin llamarla) para que lea localStorage una sola vez, al arrancar.
  const [estado, setEstado] = useState(cargarEstado)

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
