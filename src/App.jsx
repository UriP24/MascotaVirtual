import { useState } from 'react'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import Casa from './screens/Casa.jsx'
import Tareas from './screens/Tareas.jsx'
import Canjes from './screens/Canjes.jsx'
import Jugar from './screens/Jugar.jsx'
import './App.css'

const PANTALLAS = {
  casa: Casa,
  tareas: Tareas,
  canjes: Canjes,
  jugar: Jugar,
}

function App() {
  const [pantallaActiva, setPantallaActiva] = useState('casa')
  const [monedas] = useState(0)
  const [puntos] = useState(0)
  const Pantalla = PANTALLAS[pantallaActiva]

  return (
    <div className="app">
      <TopBar monedas={monedas} puntos={puntos} />
      <Pantalla />
      <BottomNav pantallaActiva={pantallaActiva} onCambiar={setPantallaActiva} />
    </div>
  )
}

export default App
