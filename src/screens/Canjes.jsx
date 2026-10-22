import { useEffect, useState } from 'react'
import { PLANES, precioEnPuntos } from '../config.js'
import PlanCard from '../components/PlanCard.jsx'
import CouponItem from '../components/CouponItem.jsx'
import CouponHistory from '../components/CouponHistory.jsx'
import GameCard from '../components/GameCard.jsx'
import GamePicker from '../components/GamePicker.jsx'
import CoinExchange from '../components/CoinExchange.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import {
  canjear,
  cuponesPendientes,
  disponibleDesde,
  historialDeCupones,
  marcarCumplido,
  nombreDelMes,
  textoRotacion,
  usosRestantesEsteMes,
} from '../logic/canjes.js'
import { convertirMonedas, puntosConvertiblesHoy } from '../logic/economia.js'
import { festejarLogro } from '../logic/festejo.js'
import './Canjes.css'

function Canjes({ estado, setEstado }) {
  const [planElegido, setPlanElegido] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [verHistorial, setVerHistorial] = useState(false)
  const [eligiendoJuego, setEligiendoJuego] = useState(false)

  useEffect(() => {
    if (!aviso) return
    const timer = setTimeout(() => setAviso(null), 2200)
    return () => clearTimeout(timer)
  }, [aviso])

  // "Ahora" = última actualización del estado (App lo refresca cada minuto)
  const ahora = new Date(estado.perrita.actualizadaEn)
  // Del más caro al más barato. Los jueguitos van juntos en una sola tarjeta (arriba de todo).
  const planesOrdenados = PLANES.filter((p) => !p.grupo).sort((a, b) => precioEnPuntos(b) - precioEnPuntos(a))
  const juegos = PLANES.filter((p) => p.grupo === 'juegos').map((plan) => ({
    plan,
    vuelveEl: disponibleDesde(estado, plan, ahora),
    usosRestantes: usosRestantesEsteMes(estado, plan, ahora),
  }))
  const pendientes = cuponesPendientes(estado)
  const historial = historialDeCupones(estado)

  function confirmarCanje() {
    const r = canjear(estado, planElegido.id, new Date())
    setPlanElegido(null)
    if (r.resultado !== 'ok') return
    setEstado(festejarLogro(r.estado, 'canje'))
    setAviso({ texto: `¡Canjeaste ${planElegido.nombre}! 🎉`, id: Date.now() })
  }

  function cambiarMonedas() {
    const r = convertirMonedas(estado, new Date())
    if (r.resultado !== 'ok') return
    setEstado(r.estado)
    setAviso({ texto: '+1 ⭐', id: Date.now() })
  }

  return (
    <section className="pantalla canjes">
      <h1>🎁 Canjes</h1>

      <div className="cartel-reglas">
        <strong>🎁 Canjeá puntos por planes juntos</strong>
        <small>Podés canjear varios. Cada plan tiene su frecuencia: lo que no cuesta plata, hasta 2 veces por mes; lo barato, 1 vez por mes; cena y comida pedida, cada 2 meses; las salidas grandes 🍝 🎬, cada 3 meses; y los jueguitos 🎮, de 3 a 12 meses según el precio.</small>
      </div>

      <CoinExchange monedas={estado.monedas} quedanHoy={puntosConvertiblesHoy(estado, ahora)} onCambiar={cambiarMonedas} />

      <h2>Planes juntos</h2>
      <ul className="lista">
        <GameCard juegos={juegos.map((j) => j.plan)} onElegir={() => setEligiendoJuego(true)} />
        {planesOrdenados.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            puntos={estado.puntos}
            vuelveEl={disponibleDesde(estado, plan, ahora)}
            usosRestantes={usosRestantesEsteMes(estado, plan, ahora)}
            onCanjear={setPlanElegido}
          />
        ))}
      </ul>

      <h2>Mis cupones</h2>
      {pendientes.length === 0 ? (
        <p className="vacio">No tenés cupones pendientes 💕</p>
      ) : (
        <ul className="lista">
          {pendientes.map((c) => (
            <CouponItem key={c.id} cupon={c} onCumplido={(cupon) => setEstado((e) => marcarCumplido(e, cupon.id))} />
          ))}
        </ul>
      )}

      <button className="ver-historial" onClick={() => setVerHistorial((v) => !v)} aria-expanded={verHistorial}>
        📜 {verHistorial ? 'Ocultar historial' : `Historial de canjes (${historial.length})`}
      </button>
      {verHistorial && <CouponHistory cupones={historial} />}

      {eligiendoJuego && (
        <GamePicker
          juegos={juegos}
          puntos={estado.puntos}
          onElegir={(plan) => {
            setEligiendoJuego(false)
            setPlanElegido(plan)
          }}
          onCerrar={() => setEligiendoJuego(false)}
        />
      )}

      {planElegido && (
        <ConfirmDialog
          titulo={`${planElegido.emoji} ${planElegido.nombre}`}
          textoConfirmar="¡Sí, canjear!"
          onConfirmar={confirmarCanje}
          onCancelar={() => setPlanElegido(null)}
        >
          <p>
            ¿Canjear por <strong>{precioEnPuntos(planElegido)} ⭐</strong>?
          </p>
          <p>
            Se canjea {textoRotacion(planElegido)}: lo vas a poder volver a canjear en{' '}
            {nombreDelMes(new Date(ahora.getFullYear(), ahora.getMonth() + planElegido.rotacionMeses, 1))}.
          </p>
        </ConfirmDialog>
      )}

      <Toast mensaje={aviso} />
    </section>
  )
}

export default Canjes
