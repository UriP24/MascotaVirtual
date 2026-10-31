// Sonidos que Uri carga a mano en el celu de Mari (desde el modo prueba): no vienen con la app,
// así no quedan en el repo público. Si no hay archivo cargado, simplemente no suena nada.

import { leerSonido } from '../storage.js'

export const SONIDOS_CARGABLES = [
  { id: 'patada', nombre: '🐴 Golpe del caballo', cuando: 'cuando el caballo patea a Bolti' },
  { id: 'transformacion', nombre: '⚡ Transformación', cuando: 'cuando se levanta con el aura' },
  { id: 'cartel', nombre: '🎬 Cartel INVENCIBLE', cuando: 'cuando aparece el cartel' },
]

// Prepara los sonidos para que suenen sin demora: devuelve { id: Audio } con los que hay cargados
// y una función para liberar la memoria cuando ya no hacen falta.
export async function prepararSonidos(ids) {
  const audios = {}
  const urls = []
  for (const id of ids) {
    const archivo = await leerSonido(id)
    if (!archivo) continue
    const url = URL.createObjectURL(archivo)
    urls.push(url)
    audios[id] = new Audio(url)
    audios[id].preload = 'auto'
  }
  const liberar = () => {
    Object.values(audios).forEach((a) => a.pause())
    urls.forEach((u) => URL.revokeObjectURL(u))
  }
  return { audios, liberar }
}

export function sonar(audio) {
  if (!audio) return
  audio.currentTime = 0
  audio.play().catch(() => {}) // si el celu no lo deja sonar, sigue sin sonido
}

// Baja el volumen de a poco y lo frena (para no cortarlo de golpe)
export function apagar(audio, ms = 500) {
  if (!audio || audio.paused) return
  const inicio = audio.volume
  const pasos = 10
  let paso = 0
  const timer = setInterval(() => {
    paso += 1
    audio.volume = Math.max(0, inicio * (1 - paso / pasos))
    if (paso >= pasos) {
      clearInterval(timer)
      audio.pause()
      audio.volume = inicio
    }
  }, ms / pasos)
}
