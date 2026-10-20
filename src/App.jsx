import { useState } from 'react'
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
  const Pantalla = PANTALLAS[pantallaActiva]

  return (
    <div className="app">
      <Pantalla />
      <BottomNav pantallaActiva={pantallaActiva} onCambiar={setPantallaActiva} />
    </div>
  )
}

export default App
