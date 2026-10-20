import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Modo sin internet: cuando hay una versión nueva publicada, la app se recarga sola para usarla.
// Además, si la app queda abierta, busca actualizaciones cada hora.
registerSW({
  immediate: true,
  onRegisteredSW(_url, registro) {
    if (registro) setInterval(() => registro.update(), 60 * 60 * 1000)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
