import { useEffect, useRef, useState } from 'react'
import Bolti from '../components/Bolti.jsx'
import NeedsBars from '../components/NeedsBars.jsx'
import SpeechBubble from '../components/SpeechBubble.jsx'
import FloatingEmoji from '../components/FloatingEmoji.jsx'
import ActionBar from '../components/ActionBar.jsx'
import Shop from '../components/Shop.jsx'
import Backpack from '../components/Backpack.jsx'
import GiftBox from '../components/GiftBox.jsx'
import GiftReveal from '../components/GiftReveal.jsx'
import Confetti from '../components/Confetti.jsx'
import Ventana from '../components/Ventana.jsx'
import ObjetoPiso from '../components/ObjetoPiso.jsx'
import Mesita from '../components/Mesita.jsx'
import SecretFound from '../components/SecretFound.jsx'
import SpecialCard from '../components/SpecialCard.jsx'
import { apagarLuz, darMimos, humor, prenderLuz } from '../logic/bolti.js'
import { PERRITA, REGLAS_SECRETOS } from '../config.js'
import { comprar, darDeComer } from '../logic/comida.js'
import { festejoVisto, fraseDeFestejo } from '../logic/festejo.js'
import { abrirRegaloDeCumple, hayRegaloDeCumple } from '../logic/cumple.js'
import { esCumple } from '../logic/fechas.js'
import { alternarPrenda } from '../logic/ropa.js'
import {
  agarrarMedia,
  comerPure,
  descubrir,
  estaDescubierto,
  fechaEspecial,
  hayPure,
  pistaAlAzar,
  sortearMedia,
} from '../logic/secretos.js'
import { fechaLocal } from '../logic/fechas.js'
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
  if (esCumple(ahora)) return '¡Feliz cumple, Mari! 🎂💕'
  if (fechaEspecial(ahora) === 'aniversario') return '¡Feliz aniversario! 💕'
  if (fechaEspecial(ahora) === 'san-valentin') return '¡Feliz San Valentín, Mari! 💘'
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
  // El día del cumple: confeti al entrar y al abrir el regalo
  const [confeti, setConfeti] = useState(() => (esCumple(ahora) ? 1 : 0))
  const [regaloAbierto, setRegaloAbierto] = useState(false)
  // Secretos
  const [gesto, setGesto] = useState(null) // gesto especial de Bolti: 'estornuda', 'patea', 'rueda'…
  const [visita, setVisita] = useState(null) // quien pasa por la ventana: { tipo: 'gato' | 'vaca', id }
  const [estrella, setEstrella] = useState(false)
  const [secretoNuevo, setSecretoNuevo] = useState(null) // id del secreto recién descubierto
  // La cartita de la fecha especial de hoy (aniversario o San Valentín), una vez por día
  const [carta, setCarta] = useState(() => {
    const fecha = fechaEspecial(ahora)
    return fecha && estado.cartasVistas[fecha] !== fechaLocal(ahora) ? fecha : null
  })
  const habitacionRef = useRef(null)
  const toque = useRef({ apretado: false, recorrido: 0, ultimo: null, huboMimos: false, quieto: 0 })
  const nariz = useRef({ toques: 0, ultimo: 0 })
  const panza = useRef(0)
  const timers = useRef({})

  // El saludo se va solo después de un ratito. Al salir de la pantalla, se cancelan los timers.
  const festejoAlEntrar = useRef(festejando)

  useEffect(() => {
    const t = timers.current
    if (festejoAlEntrar.current) setEstado(festejoVisto) // ya lo festejó
    t.frase = setTimeout(() => setFrase(null), 3500)
    // Secreto de las medias: una vez por día, desde que se despierta, puede traer una
    setEstado((e) => sortearMedia(e, new Date(e.perrita.actualizadaEn)))
    return () => {
      clearTimeout(t.gesto)
      clearTimeout(t.apretado)
      clearTimeout(t.visita)
      clearTimeout(t.estrella)
      clearTimeout(t.secreto)
      clearTimeout(t.confeti)
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

  // Secreto del gato y la vaca: cada tanto, de día, alguien pasa por la ventana
  const despierta = animo !== 'dormida'
  useEffect(() => {
    if (!despierta) return
    const timer = setInterval(() => {
      const r = Math.random()
      const tipo = r < REGLAS_SECRETOS.CHANCE_VACA ? 'vaca' : r < REGLAS_SECRETOS.CHANCE_VACA + REGLAS_SECRETOS.CHANCE_GATO ? 'gato' : null
      if (tipo) mostrarVisitaRef.current(tipo)
    }, REGLAS_SECRETOS.VISITA_CADA_SEGUNDOS * 1000)
    return () => clearInterval(timer)
  }, [despierta])

  // Secreto de la sacudida: si sacude el celu, Bolti se sacude
  useEffect(() => {
    let ultima = 0
    function alMoverCelu(e) {
      const a = e.acceleration
      const fuerza = a && a.x !== null ? Math.hypot(a.x, a.y, a.z) : 0
      if (fuerza < REGLAS_SECRETOS.SACUDIDA_FUERZA || Date.now() - ultima < 3000) return
      ultima = Date.now()
      sacudirseRef.current()
    }
    window.addEventListener('devicemotion', alMoverCelu)
    return () => window.removeEventListener('devicemotion', alMoverCelu)
  }, [])

  // Modo prueba: los atajos de secretos dejan un evento en el estado y acá se dispara
  const eventoPrueba = estado.eventoPrueba
  useEffect(() => {
    if (!eventoPrueba) return
    manejarEventoRef.current(eventoPrueba.tipo)
    setEstado((e) => ({ ...e, eventoPrueba: null }))
  }, [eventoPrueba, setEstado])

  // Los efectos de arriba llaman siempre a la última versión de estas funciones
  const mostrarVisitaRef = useRef(null)
  const sacudirseRef = useRef(null)
  const manejarEventoRef = useRef(null)
  useEffect(() => {
    mostrarVisitaRef.current = mostrarVisita
    sacudirseRef.current = sacudirse
    manejarEventoRef.current = manejarEventoPrueba
  })

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
    toque.current = { apretado: true, recorrido: 0, ultimo: { x: e.clientX, y: e.clientY }, huboMimos: false, quieto: 0 }
    // Secreto panza arriba: dedo quieto sobre ella un ratito
    clearTimeout(timers.current.apretado)
    if (animo === 'dormida') return
    timers.current.apretado = setTimeout(() => {
      toque.current.huboMimos = true // al soltar no cuenta como toque
      hacerGesto('rueda', 1200)
      decir('¡Panza arriba! Rascame 💕', 2500)
      descubrirSecreto('panza-arriba')
    }, REGLAS_SECRETOS.APRETADO_MS)
  }

  // Punto del dedo en las coordenadas del dibujo de Bolti (viewBox 300×320)
  function puntoEnBolti(e) {
    const r = e.currentTarget.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * 300, y: ((e.clientY - r.top) / r.height) * 320 }
  }

  // Frotar = mimos: cada tanto recorrido suma cariño y suelta un corazón.
  // También funciona dormida: siente los mimos pero sigue durmiendo.
  function alMover(e) {
    const t = toque.current
    if (!t.apretado) return
    const paso = Math.hypot(e.clientX - t.ultimo.x, e.clientY - t.ultimo.y)
    t.recorrido += paso
    t.quieto += paso
    t.ultimo = { x: e.clientX, y: e.clientY }
    if (t.quieto > 12) clearTimeout(timers.current.apretado) // se movió: no es "dedo quieto"
    // Secreto de la patita: rascarle la panza un rato
    const p = puntoEnBolti(e)
    if (animo !== 'dormida' && ((p.x - 150) / 50) ** 2 + ((p.y - 232) / 55) ** 2 < 1) {
      panza.current += paso
      if (panza.current >= REGLAS_SECRETOS.PANZA_RECORRIDO) {
        panza.current = 0
        hacerGesto('patea', 1600)
        decir('¡Ahí, ahí! ¡Qué rico! 🐾')
        descubrirSecreto('patita')
      }
    }
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
    clearTimeout(timers.current.apretado)
    if (t.huboMimos) return
    if (animo === 'dormida') {
      decir('zzz… 😴')
      return
    }
    // Secreto del estornudo: tocarle la nariz varias veces seguidas
    const p = puntoEnBolti(e)
    if (Math.hypot(p.x - 150, p.y - 134) < 22) {
      const n = nariz.current
      n.toques = Date.now() - n.ultimo < REGLAS_SECRETOS.NARIZ_SEGUNDOS_ENTRE_TOQUES * 1000 ? n.toques + 1 : 1
      n.ultimo = Date.now()
      if (n.toques >= REGLAS_SECRETOS.NARIZ_TOQUES) {
        n.toques = 0
        hacerGesto('estornuda', 800)
        decir('¡Achís! 🤧')
        descubrirSecreto('estornudo')
        return
      }
    }
    setSaltos((s) => s + 1)
    setEstado((est) => darMimos(est, 1))
    setMimos(true) // mueve la cola de contenta
    clearTimeout(timers.current.mimos)
    timers.current.mimos = setTimeout(() => setMimos(false), 900)
    soltarEmoji('💗', e.clientX, e.clientY)
    // A veces, en vez de una frase común, suelta una pista de un secreto
    const pista = Math.random() < REGLAS_SECRETOS.CHANCE_PISTA ? pistaAlAzar(estado) : null
    decir(pista ?? azar(FRASES_AL_TOCARLA), pista ? 2800 : 1800)
  }

  // ── Secretos ──────────────────────────────────────────────────────────

  function hacerGesto(nombre, duracion) {
    setGesto(nombre)
    clearTimeout(timers.current.gesto)
    timers.current.gesto = setTimeout(() => setGesto(null), duracion)
  }

  // Lo descubre (con su premio) y, si es la primera vez, muestra el cartel después de un ratito
  function descubrirSecreto(id, demora = 1400) {
    if (estaDescubierto(estado, id)) return
    setEstado((e) => descubrir(e, id, new Date()).estado)
    clearTimeout(timers.current.secreto)
    timers.current.secreto = setTimeout(() => setSecretoNuevo(id), demora)
    navigator.vibrate?.([30, 50, 30])
  }

  function mostrarVisita(tipo) {
    setVisita((actual) => actual ?? { tipo, id: Date.now() })
    clearTimeout(timers.current.visita)
    timers.current.visita = setTimeout(() => setVisita(null), REGLAS_SECRETOS.VISITA_DURACION_SEGUNDOS * 1000)
  }

  function tocarVisita(tipo) {
    setVisita(null)
    setSaltos((n) => n + 1)
    decir(tipo === 'gato' ? '¡Guau, guau! ¡Un gato! 🐱' : '¡Muuu! ¡Yo las arreaba! 🐄', 2500)
    descubrirSecreto(tipo)
  }

  function mostrarEstrella() {
    setEstrella(true)
    clearTimeout(timers.current.estrella)
    timers.current.estrella = setTimeout(() => setEstrella(false), 1500)
    decir('¡Una estrella fugaz! Pedí un deseo ✨', 3000)
    descubrirSecreto('estrella', 1800)
  }

  // Secreto de la estrella: de noche, tocar la ventana
  function tocarVentana() {
    if (animo !== 'dormida') return
    if (Math.random() < REGLAS_SECRETOS.CHANCE_ESTRELLA) mostrarEstrella()
    else decir('Qué linda noche… 🌙')
  }

  function sacudirse() {
    hacerGesto('sacude', 900)
    decir(animo === 'dormida' ? '¿Eh? ¿Qué pasó? 😵‍💫' : '¡Brrr! 💦')
    descubrirSecreto('sacudida')
  }

  function tocarMedia() {
    const r = agarrarMedia(estado, new Date())
    if (!r.resultado) return
    setEstado(r.estado)
    setSaltos((n) => n + 1)
    const frases = {
      suelta: '¡Te traje una media! ¿Dónde estará la otra? 🧦',
      par: '¡Encontré la otra! ¡El par completo! 🧦🧦',
      extra: `¡Otra media para vos! +${REGLAS_SECRETOS.MONEDAS_POR_MEDIA_EXTRA} 🪙`,
    }
    decir(frases[r.resultado], 3000)
    if (r.nuevo) {
      clearTimeout(timers.current.secreto)
      timers.current.secreto = setTimeout(() => setSecretoNuevo('medias'), 1600)
    }
  }

  // Secreto del puré: se lo come feliz y le guiña un ojo, cómplice
  function tocarPure() {
    const nuevo = !estaDescubierto(estado, 'pure')
    setEstado((e) => comerPure(e, new Date()).estado)
    setComiendo(true)
    decir('¡Ñam! 😋', DURACION_COMIENDO)
    clearTimeout(timers.current.comiendo)
    timers.current.comiendo = setTimeout(() => {
      setComiendo(false)
      hacerGesto('guino', 2200)
      decir('Shhh… nuestro secreto 🤫', 3200)
      if (nuevo) {
        clearTimeout(timers.current.secreto)
        timers.current.secreto = setTimeout(() => setSecretoNuevo('pure'), 2400)
      }
    }, DURACION_COMIENDO)
  }

  function cerrarCarta() {
    const fecha = carta
    setCarta(null)
    setEstado((e) => ({ ...e, cartasVistas: { ...e.cartasVistas, [fecha]: fechaLocal(new Date()) } }))
    descubrirSecreto(fecha, 400)
  }

  function manejarEventoPrueba(tipo) {
    if (tipo === 'gato' || tipo === 'vaca') mostrarVisita(tipo)
    if (tipo === 'media') setEstado((e) => ({ ...e, mediaEsperando: true }))
    if (tipo === 'pure') setEstado((e) => ({ ...e, purePrueba: true }))
    if (tipo === 'estrella') mostrarEstrella()
    if (tipo === 'sacudida') sacudirse()
    if (tipo === 'aniversario' || tipo === 'san-valentin') setCarta(tipo)
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

  function tirarConfeti() {
    setConfeti((n) => n + 1)
    clearTimeout(timers.current.confeti)
    timers.current.confeti = setTimeout(() => setConfeti(0), 5000)
  }

  function abrirRegalo() {
    setEstado((e) => abrirRegaloDeCumple(e, new Date(e.perrita.actualizadaEn)))
    setRegaloAbierto(true)
    tirarConfeti()
    navigator.vibrate?.([40, 60, 40])
  }

  function cerrarRegalo() {
    setRegaloAbierto(false)
    if (animo === 'dormida') return
    setSaltos((n) => n + 1)
    setMimos(true)
    clearTimeout(timers.current.mimos)
    timers.current.mimos = setTimeout(() => setMimos(false), 1500)
    decir('¡Feliz cumple, Mari! ¡Te quiero! 🎂💕', 3500)
  }

  // Desde la pestaña Ropa de la mochila: se la pone o se la saca, y a Bolti le encanta
  function ponerOSacar(id) {
    setEstado((e) => alternarPrenda(e, id))
    if (animo === 'dormida') return
    setSaltos((n) => n + 1)
    setMimos(true)
    clearTimeout(timers.current.mimos)
    timers.current.mimos = setTimeout(() => setMimos(false), 900)
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
        <Ventana visita={visita} estrella={estrella} onTocar={tocarVentana} onTocarVisita={tocarVisita} />
        <div className="cuadro" aria-hidden="true">
          BOLTI
        </div>
        <div className="alfombra" aria-hidden="true" />
        <Mesita conPure={hayPure(estado, ahora) && animo !== 'dormida' && !mochilaAbierta} onTocarPure={tocarPure} />
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
          ropa={estado.ropa.puesta}
          onPointerDown={alApretar}
          onPointerMove={alMover}
          onPointerUp={alSoltar}
          gesto={gesto}
          onPointerCancel={() => {
            toque.current.apretado = false
            clearTimeout(timers.current.apretado)
          }}
        />
        <FloatingEmoji items={flotantes} />
        {hayRegaloDeCumple(estado, ahora) && !mochilaAbierta && <GiftBox onAbrir={abrirRegalo} />}
        {estado.mediaEsperando && !mochilaAbierta && <ObjetoPiso tipo="media" onTocar={tocarMedia} />}

        {mochilaAbierta && (
          <Backpack
            estado={estado}
            arrastrandoId={arrastre?.comida.id}
            onDar={darComida}
            onEmpezar={empezarArrastre}
            onMover={moverArrastre}
            onSoltar={soltarArrastre}
            onCancelar={() => setArrastre(null)}
            onAlternarPrenda={ponerOSacar}
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
      {regaloAbierto && <GiftReveal onCerrar={cerrarRegalo} />}
      {confeti > 0 && <Confetti key={confeti} />}
      {carta && <SpecialCard tipo={carta} onCerrar={cerrarCarta} />}
      {secretoNuevo && <SecretFound id={secretoNuevo} onCerrar={() => setSecretoNuevo(null)} />}
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
