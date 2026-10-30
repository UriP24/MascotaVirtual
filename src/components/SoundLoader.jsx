import { useEffect, useState } from 'react'
import { borrarSonido, guardarSonido, leerSonido } from '../storage.js'
import { SONIDOS_CARGABLES, prepararSonidos, sonar } from '../logic/sonidos.js'

// Modo prueba: cargar los sonidos de INVENCIBLE desde archivos del celu. Quedan guardados solo en
// este celu (no en el repo ni en la app publicada).
function SoundLoader() {
  const [cargados, setCargados] = useState({})
  const [aviso, setAviso] = useState(null)

  async function revisar() {
    const estado = {}
    for (const s of SONIDOS_CARGABLES) estado[s.id] = Boolean(await leerSonido(s.id))
    setCargados(estado)
  }

  useEffect(() => {
    let vigente = true
    ;(async () => {
      const estado = {}
      for (const s of SONIDOS_CARGABLES) estado[s.id] = Boolean(await leerSonido(s.id))
      if (vigente) setCargados(estado)
    })()
    return () => {
      vigente = false
    }
  }, [])

  async function cargar(id, archivo) {
    if (!archivo) return
    const ok = await guardarSonido(id, archivo)
    setAviso(ok ? `Listo: ${archivo.name}` : 'No se pudo guardar el sonido')
    revisar()
  }

  async function probar(id) {
    const { audios, liberar } = await prepararSonidos([id])
    sonar(audios[id])
    setTimeout(liberar, 15000)
  }

  async function borrar(id) {
    await borrarSonido(id)
    revisar()
  }

  return (
    <div className="grupo">
      <span>🔊 Sonidos de INVENCIBLE (solo en este celu)</span>
      {SONIDOS_CARGABLES.map((s) => (
        <div key={s.id} className="botones">
          <small>
            {s.nombre} · {s.cuando} · {cargados[s.id] ? '✅ cargado' : 'sin cargar'}
          </small>
          <label className="cargar-sonido">
            📂 Elegir archivo
            <input type="file" accept="audio/*" hidden onChange={(e) => cargar(s.id, e.target.files[0])} />
          </label>
          {cargados[s.id] && (
            <>
              <button onClick={() => probar(s.id)}>▶ Probar</button>
              <button onClick={() => borrar(s.id)}>Borrar</button>
            </>
          )}
        </div>
      ))}
      {aviso && <small>{aviso}</small>}
    </div>
  )
}

export default SoundLoader
