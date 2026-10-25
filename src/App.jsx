import { useEffect, useState } from 'react'
import TopBar from './components/TopBar.jsx'
import BottomNav from './components/BottomNav.jsx'
import TestPanel from './components/TestPanel.jsx'
import Welcome from './components/Welcome.jsx'
import Tutorial from './components/Tutorial.jsx'
import Settings from './components/Settings.jsx'
import ConfirmDialog from './components/ConfirmDialog.jsx'
import Casa from './screens/Casa.jsx'
import Tareas from './screens/Tareas.jsx'
import Canjes from './screens/Canjes.jsx'
import Jugar from './screens/Jugar.jsx'
import { cargarEstado, guardarEstado } from './storage.js'
import { actualizarDia, retomarCronometros } from './logic/tareas.js'
import { actualizarBolti, horasDesdeUltimaVisita, registrarVisita } from './logic/bolti.js'
import { modoPruebaActivo } from './logic/prueba.js'
import { hayRegaloDeCumple } from './logic/cumple.js'
import { esCumple } from './logic/fechas.js'
import './App.css'

// Se decide una sola vez al abrir la app.
const modoPrueba = modoPruebaActivo()

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
  const [configuracionAbierta, setConfiguracionAbierta] = useState(false)
  const [tutorialAbierto, setTutorialAbierto] = useState(false)
  const [mensajeAbierto, setMensajeAbierto] = useState(false)
  const [preguntarTutorial, setPreguntarTutorial] = useState(false)

  // Cada minuto: revisa si cambió el día y avanza las necesidades de Bolti.
  useEffect(() => {
    const timer = setInterval(() => setEstado((e) => actualizarBolti(actualizarDia(e))), 60 * 1000)
    return () => clearInterval(timer)
  }, [])

  // Cada vez que cambia el estado, se guarda en el celular.
  useEffect(() => {
    guardarEstado(estado)
  }, [estado])

  // Después de la bienvenida, deja que vea a Bolti un ratito y le ofrece el tutorial (una sola vez).
  // El día del cumple espera a que abra el regalo y a que lo vea tranquila.
  const ahora = new Date(estado.perrita.actualizadaEn)
  const faltaPreguntarTutorial =
    estado.bienvenidaVista && !estado.tutorialPreguntado && !hayRegaloDeCumple(estado, ahora)
  const esperaTutorial = esCumple(ahora) ? 8000 : 2500
  useEffect(() => {
    if (!faltaPreguntarTutorial) return
    const timer = setTimeout(() => setPreguntarTutorial(true), esperaTutorial)
    return () => clearTimeout(timer)
  }, [faltaPreguntarTutorial, esperaTutorial])

  function responderTutorial(quiere) {
    setPreguntarTutorial(false)
    setEstado((e) => ({ ...e, tutorialPreguntado: true }))
    if (quiere) setTutorialAbierto(true)
  }

  const Pantalla = PANTALLAS[pantallaActiva]

  // La primera vez: el mensaje de Uri antes de conocer a Bolti
  if (!estado.bienvenidaVista) {
    return (
      <div className="app">
        <Welcome onTerminar={() => setEstado((e) => ({ ...e, bienvenidaVista: true }))} />
        {modoPrueba && <TestPanel estado={estado} setEstado={setEstado} />}
      </div>
    )
  }

  return (
    <div className="app">
      <TopBar
        monedas={estado.monedas}
        puntos={estado.puntos}
        onAbrirConfiguracion={() => setConfiguracionAbierta(true)}
      />
      <Pantalla
        estado={estado}
        setEstado={setEstado}
        horasAusente={inicio.horasAusente}
        onCambiarPantalla={setPantallaActiva}
      />
      <BottomNav pantallaActiva={pantallaActiva} onCambiar={setPantallaActiva} />
      {preguntarTutorial && (
        <ConfirmDialog
          titulo="🐾 ¿Te muestro cómo funciona?"
          textoConfirmar="Sí, mostrame"
          textoCancelar="Ahora no"
          onConfirmar={() => responderTutorial(true)}
          onCancelar={() => responderTutorial(false)}
        >
          <p>Son unos pasitos cortos. Lo podés volver a ver cuando quieras desde ⚙️.</p>
        </ConfirmDialog>
      )}
      {configuracionAbierta && (
        <Settings
          onVerTutorial={() => {
            setConfiguracionAbierta(false)
            setTutorialAbierto(true)
          }}
          onVerMensaje={() => {
            setConfiguracionAbierta(false)
            setMensajeAbierto(true)
          }}
          onCerrar={() => setConfiguracionAbierta(false)}
        />
      )}
      {tutorialAbierto && <Tutorial onCerrar={() => setTutorialAbierto(false)} />}
      {mensajeAbierto && <Welcome soloCarta onTerminar={() => setMensajeAbierto(false)} />}
      {modoPrueba && <TestPanel estado={estado} setEstado={setEstado} />}
    </div>
  )
}

export default App
