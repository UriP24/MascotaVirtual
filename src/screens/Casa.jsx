import { useEffect, useRef, useState } from 'react'
import Bolti from '../components/Bolti.jsx'
import NeedsBars from '../components/NeedsBars.jsx'
import SpeechBubble from '../components/SpeechBubble.jsx'
import FloatingEmoji from '../components/FloatingEmoji.jsx'
import ActionBar from '../components/ActionBar.jsx'
import Shop from '../components/Shop.jsx'
import Backpack from '../components/Backpack.jsx'
import { apagarLuz, darMimos, humor, prenderLuz } from '../logic/bolti.js'
import { PERRITA } from '../config.js'
import { comprar, darDeComer } from '../logic/comida.js'
import { festejoVisto, fraseDeFestejo } from '../logic/festejo.js'
import './Casa.css'

const DISTANCIA_POR_MIMO = 45 // px que hay que frotar para cada corazón
const RADIO_BOCA = 0.2 // qué tan cerca de la boca (en proporción al ancho de Bolti) cuenta como "en la boca"
const DURACION_COMIENDO = 1800
const FRASES_AL_TOCARLA = ['¡Guau! 🐾', '¡Hola, Mari! 💕', '¿Jugamos?', '¡Te quiero!', '¡Más mimos!']
const RECORDATORIOS_ESTUDIO = [
  '¿Estudiamos un ratito? 📚',
  'Te espero para estudiar juntas 🐶📚',
  'Con un pomodorito de 25 minutos me pongo contenta 💕',
  '¿Hoy toca estudiar? Yo te acompaño 📚',
]

function azar(lista) {
  return lista[Math.floor(Math.random() * lista.length)]
}

const HORA_FIN_DE_LA_NOCHE = 6 // de 00:00 a 06:00, si abre la app, Bolti la manda a dormir

function saludoInicial(horasAusente, animo, ahora) {
  if (animo === 'dormida') {
    return ahora.getHours() < HORA_FIN_DE_LA_NOCHE ? 'Vamos a dormir, Mari 💤' : null
  }
  if (horasAusente >= 12) return '¡Te extrañé! 🥺'
  return '¡Hola, Mari! 🐾'
}

// Lo que dice Bolti cuando nadie la toca, según cómo está.
function fraseDeHumor(estado, animo, ahora) {
  if (animo === 'dormida') return ahora.getHours() === 0 ? 'Vamos a dormir, Mari 💤' : null
  if (animo === 'hambre') return 'Tengo hambre… 🥺'
  if (animo === 'triste') {
    if (estado.perrita.energia < PERRITA.NIVEL_BAJO) return 'Estoy cansadita… 🥱'
    return '¿Me hacés mimos? 🥺'
  }
  // 'estudio' no tiene frase fija: le recuerda cada tanto (ver RECORDATORIO_ESTUDIO_MINUTOS)
  return null
}

function Casa({ estado, setEstado, horasAusente = 0, onCambiarPantalla }) {
  // "Ahora" es la última vez que se actualizó Bolti (App lo hace cada minuto). Así el dibujo
  // no depende de la hora exacta en que React decide redibujar.
  const ahora = new Date(estado.perrita.actualizadaEn)
  const animo = humor(estado, ahora)
  const [mimos, setMimos] = useState(false)
  // Si hay un logro sin festejar (y está despierta), entra saltando y lo festeja
  const festejando = animo !== 'dormida' && Boolean(estado.perrita.festejo)
  const [saltos, setSaltos] = useState(festejando ? 1 : 0)
  const [frase, setFrase] = useState(() =>
    festejando ? fraseDeFestejo(estado.perrita.festejo) : saludoInicial(horasAusente, animo, ahora),
  )
  const [flotantes, setFlotantes] = useState([])
  const [tiendaAbierta, setTiendaAbierta] = useState(false)
  const [arrastre, setArrastre] = useState(null) // { comida, x, y, cerca }
  const [mochilaAbierta, setMochilaAbierta] = useState(false)
  const [volando, setVolando] = useState(null) // comida que vuela hasta la boca: { comida, x, y, dx, dy }
  const [comiendo, setComiendo] = useState(false)
  const [rechaza, setRechaza] = useState(false)
  const habitacionRef = useRef(null)
  const toque = useRef({ apretado: false, recorrido: 0, ultimo: null, huboMimos: false })
  const timers = useRef({})

  // El saludo se va solo después de un ratito. Al salir de la pantalla, se cancelan los timers.
  const festejoAlEntrar = useRef(festejando)

  useEffect(() => {
    const t = timers.current
    if (festejoAlEntrar.current) setEstado(festejoVisto) // ya lo festejó
    t.frase = setTimeout(() => setFrase(null), 3500)
    return () => {
      clearTimeout(t.frase)
      clearTimeout(t.mimos)
      clearTimeout(t.comiendo)
      clearTimeout(t.rechaza)
      clearTimeout(t.volando)
    }
  }, [setEstado]) // setEstado nunca cambia: corre solo al entrar a Casa

  // Si extraña el estudio: se lo recuerda un ratito al entrar y después cada tanto (no queda fijo)
  const extranaEstudio = animo === 'estudio'
  useEffect(() => {
    if (!extranaEstudio) return
    const t = timers.current
    const recordar = () => {
      setFrase(azar(RECORDATORIOS_ESTUDIO))
      clearTimeout(t.frase)
      t.frase = setTimeout(() => setFrase(null), 5000)
    }
    const primero = setTimeout(recordar, 4000)
    const cadaTanto = setInterval(recordar, PERRITA.RECORDATORIO_ESTUDIO_MINUTOS * 60 * 1000)
    return () => {
      clearTimeout(primero)
      clearInterval(cadaTanto)
    }
  }, [extranaEstudio])

  function decir(texto, duracion = 1800) {
    setFrase(texto)
    clearTimeout(timers.current.frase)
    timers.current.frase = setTimeout(() => setFrase(null), duracion)
  }

  function soltarEmoji(emoji, clientX, clientY) {
    const r = habitacionRef.current.getBoundingClientRect()
    const item = {
      id: Date.now() + Math.random(),
      emoji,
      x: clientX - r.left,
      y: clientY - r.top - 20,
      dx: Math.random() * 60 - 30,
    }
    setFlotantes((lista) => [...lista, item])
    setTimeout(() => setFlotantes((lista) => lista.filter((f) => f.id !== item.id)), 1500)
  }

  function alApretar(e) {
    e.currentTarget.setPointerCapture(e.pointerId)
    toque.current = { apretado: true, recorrido: 0, ultimo: { x: e.clientX, y: e.clientY }, huboMimos: false }
  }

  // Frotar = mimos: cada tanto recorrido suma cariño y suelta un corazón.
  // También funciona dormida: siente los mimos pero sigue durmiendo.
  function alMover(e) {
    const t = toque.current
    if (!t.apretado) return
    t.recorrido += Math.hypot(e.clientX - t.ultimo.x, e.clientY - t.ultimo.y)
    t.ultimo = { x: e.clientX, y: e.clientY }
    if (t.recorrido < DISTANCIA_POR_MIMO) return
    t.recorrido = 0
    t.huboMimos = true
    setEstado((est) => darMimos(est, 3))
    soltarEmoji('💗', e.clientX, e.clientY)
    navigator.vibrate?.(15)
    setMimos(true)
    clearTimeout(timers.current.mimos)
    timers.current.mimos = setTimeout(() => setMimos(false), 900)
  }

  // Tocar sin frotar = saltito y una frase.
  function alSoltar(e) {
    const t = toque.current
    if (!t.apretado) return
    t.apretado = false
    if (t.huboMimos) return
    if (animo === 'dormida') {
      decir('zzz… 😴')
      return
    }
    setSaltos((s) => s + 1)
    setEstado((est) => darMimos(est, 1))
    setMimos(true) // mueve la cola de contenta
    clearTimeout(timers.current.mimos)
    timers.current.mimos = setTimeout(() => setMimos(false), 900)
    soltarEmoji('💗', e.clientX, e.clientY)
    decir(azar(FRASES_AL_TOCARLA))
  }

  function posicionBoca() {
    const svg = habitacionRef.current?.querySelector('svg.bolti')
    if (!svg) return null
    const r = svg.getBoundingClientRect()
    return { x: r.left + r.width * (150 / 300), y: r.top + r.height * (152 / 320), ancho: r.width }
  }

  // ¿El dedo con la comida está cerca de la boca de Bolti?
  function cercaDeLaBoca(x, y) {
    const boca = posicionBoca()
    return Boolean(boca) && Math.hypot(x - boca.x, y - boca.y) < boca.ancho * RADIO_BOCA
  }

  function empezarArrastre(comida, e) {
    setArrastre({ comida, x: e.clientX, y: e.clientY, cerca: false })
  }

  function moverArrastre(e) {
    if (!arrastre) return
    setArrastre({ ...arrastre, x: e.clientX, y: e.clientY, cerca: cercaDeLaBoca(e.clientX, e.clientY) })
  }

  function soltarArrastre(e) {
    if (!arrastre) return
    const { comida } = arrastre
    setArrastre(null)
    if (!cercaDeLaBoca(e.clientX, e.clientY)) return // vuelve sola a la mochila
    alimentar(comida, e.clientX, e.clientY)
  }

  // Tocar una comida de la mochila: vuela sola hasta la boca y se la come
  function darComida(comida, rectBoton) {
    const boca = posicionBoca()
    if (!boca || volando) return
    const x = rectBoton.left + rectBoton.width / 2
    const y = rectBoton.top + rectBoton.height / 2
    setVolando({ comida, x, y, dx: boca.x - x, dy: boca.y - y })
    clearTimeout(timers.current.volando)
    timers.current.volando = setTimeout(() => {
      setVolando(null)
      alimentar(comida, boca.x, boca.y)
    }, 450)
  }

  // Galletita o queso: después de comer, salta de alegría, mueve la cola y tira corazones
  function festejarPremio(x, y) {
    setSaltos((n) => n + 1)
    setMimos(true)
    clearTimeout(timers.current.mimos)
    timers.current.mimos = setTimeout(() => setMimos(false), 1200)
    soltarEmoji('💗', x - 20, y)
    soltarEmoji('💖', x + 20, y)
    soltarEmoji('✨', x, y - 10)
    decir('¡Gracias, Mari! ¡Te quiero! 🐾💕')
  }

  function alimentar(comida, x, y) {
    const r = darDeComer(estado, comida.id)
    setEstado(r.estado)
    if (r.resultado === 'comio') {
      setComiendo(true)
      clearTimeout(timers.current.comiendo)
      timers.current.comiendo = setTimeout(() => {
        setComiendo(false)
        if (comida.premio) festejarPremio(x, y)
      }, DURACION_COMIENDO)
      decir(comida.premio ? '¡Mi premio favorito! 💕' : '¡Ñam ñam! 😋', DURACION_COMIENDO)
      if (comida.carino > 0) soltarEmoji('💗', x, y)
      soltarEmoji(comida.emoji, x, y)
      navigator.vibrate?.(30)
    } else if (r.resultado === 'llena') {
      setRechaza(true)
      clearTimeout(timers.current.rechaza)
      timers.current.rechaza = setTimeout(() => setRechaza(false), 1200)
      decir('¡Estoy llena! 😋')
    } else if (r.resultado === 'durmiendo') {
      decir('Está durmiendo… 😴')
    }
  }

  const FRASES_LUZ = {
    noche: 'Buenas noches 💤',
    siesta: 'Una siestita… 😴',
    'sin-sueno': 'No tengo sueño todavía 🐶',
  }

  function alternarLuz() {
    if (estado.perrita.durmiendo) {
      setEstado((e) => prenderLuz(e))
      const hora = new Date().getHours()
      decir(hora < 10 || hora >= 22 ? '¿Ya es de día? 🥱' : '¡Buen día! ☀️')
      return
    }
    const r = apagarLuz(estado)
    setEstado(r.estado)
    if (FRASES_LUZ[r.resultado]) decir(FRASES_LUZ[r.resultado])
  }

  const texto = frase ?? fraseDeHumor(estado, animo, ahora)

  return (
    <section className="pantalla casa">
      <NeedsBars perrita={estado.perrita} />
      <div
        ref={habitacionRef}
        className={`habitacion ${animo === 'dormida' ? 'noche' : ''} ${mochilaAbierta ? 'con-mochila' : ''}`}
      >
        <div className="ventana" aria-hidden="true" />
        <div className="cuadro" aria-hidden="true">
          BOLTI
        </div>
        <div className="alfombra" aria-hidden="true" />
        <SpeechBubble texto={texto} />
        <Bolti
          animo={animo}
          carino={estado.perrita.carino}
          energia={estado.perrita.energia}
          saciedad={estado.perrita.saciedad}
          mimos={mimos}
          saltos={saltos}
          esperando={(arrastre?.cerca || Boolean(volando)) && animo !== 'dormida'}
          comiendo={comiendo}
          rechaza={rechaza}
          onPointerDown={alApretar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          onPointerCancel={() => (toque.current.apretado = false)}
        />
        <FloatingEmoji items={flotantes} />
        {mochilaAbierta && (
          <Backpack
            estado={estado}
            arrastrandoId={arrastre?.comida.id}
            onDar={darComida}
            onEmpezar={empezarArrastre}
            onMover={moverArrastre}
            onSoltar={soltarArrastre}
            onCancelar={() => setArrastre(null)}
            onAbrirTienda={() => setTiendaAbierta(true)}
            onCerrar={() => setMochilaAbierta(false)}
          />
        )}
      </div>
      <ActionBar
        acciones={[
          { id: 'mochila', icono: '🎒', texto: 'Mochila', onClick: () => setMochilaAbierta((v) => !v) },
          { id: 'tienda', icono: '🛒', texto: 'Tienda', onClick: () => setTiendaAbierta(true) },
          estado.perrita.durmiendo
            ? { id: 'luz', icono: '☀️', texto: 'Prender luz', onClick: alternarLuz }
            : { id: 'luz', icono: '💡', texto: 'Apagar luz', onClick: alternarLuz },
          { id: 'jugar', icono: '🎮', texto: 'Jugar', onClick: () => onCambiarPantalla?.('jugar') },
        ]}
      />
      <p className="ayuda">
        {animo === 'dormida'
          ? 'Está durmiendo 💤 · Frotala suave para hacerle mimos sin despertarla'
          : 'Tocala para que salte · Frotala con el dedo para hacerle mimos'}
      </p>
      {arrastre && (
        <div className="comida-arrastrada" style={{ left: arrastre.x, top: arrastre.y }} aria-hidden="true">
          {arrastre.comida.emoji}
        </div>
      )}
      {volando && (
        <div
          className="comida-arrastrada comida-volando"
          style={{ left: volando.x, top: volando.y, '--dx': `${volando.dx}px`, '--dy': `${volando.dy}px` }}
          aria-hidden="true"
        >
          {volando.comida.emoji}
        </div>
      )}
      {tiendaAbierta && (
        <Shop
          monedas={estado.monedas}
          inventario={estado.inventario}
          onComprar={(id) => setEstado((e) => comprar(e, id).estado)}
          onCerrar={() => setTiendaAbierta(false)}
        />
      )}
    </section>
  )
}

export default Casa
