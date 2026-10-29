import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'
import { hayVersionNueva } from './logic/actualizacion.js'

// Modo sin internet. Cuando hay una versión nueva publicada, se instala sola pero sin cortar nada:
// espera a que la app pase a segundo plano (ver logic/actualizacion.js).
// Además, si la app queda abierta, busca actualizaciones cada hora.
const actualizar = registerSW({
  immediate: true,
  onNeedRefresh() {
    hayVersionNueva(() => actualizar(true))
  },
  onRegisteredSW(_url, registro) {
    if (registro) setInterval(() => registro.update(), 60 * 60 * 1000)
  },
})

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
