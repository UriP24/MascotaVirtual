import { useEffect, useState } from 'react'
import { PLANES, precioEnPuntos } from '../config.js'
import PlanCard from '../components/PlanCard.jsx'
import CouponItem from '../components/CouponItem.jsx'
import CoinExchange from '../components/CoinExchange.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import { canjear, formatearFecha, marcarCumplido, proximoCanje, puedeCanjearEsteMes } from '../logic/canjes.js'
import { convertirMonedas, puntosConvertiblesHoy } from '../logic/economia.js'
import { festejarLogro } from '../logic/festejo.js'
import './Canjes.css'

function Canjes({ estado, setEstado }) {
  const [planElegido, setPlanElegido] = useState(null)
  const [aviso, setAviso] = useState(null)

  useEffect(() => {
    if (!aviso) return
    const timer = setTimeout(() => setAviso(null), 2200)
    return () => clearTimeout(timer)
  }, [aviso])

  // "Ahora" = última actualización del estado (App lo refresca cada minuto)
  const ahora = new Date(estado.perrita.actualizadaEn)
  const disponible = puedeCanjearEsteMes(estado, ahora)
  const nombreMes = ahora.toLocaleDateString('es-AR', { month: 'long' })
  const pendientes = estado.cupones.filter((c) => !c.cumplido)
  const cumplidos = estado.cupones.filter((c) => c.cumplido)

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

      <div className={`cartel-mes ${disponible ? 'disponible' : 'usado'}`}>
        {disponible ? (
          <>
            <strong>✅ Tu canje de {nombreMes} está disponible</strong>
            <small>Podés canjear un plan por mes. ¡Elegí con cuidado!</small>
          </>
        ) : (
          <>
            <strong>🗓️ Ya usaste el canje de {nombreMes}</strong>
            <small>Vuelve a estar disponible el {formatearFecha(proximoCanje(ahora))}</small>
          </>
        )}
      </div>

      <CoinExchange monedas={estado.monedas} quedanHoy={puntosConvertiblesHoy(estado, ahora)} onCambiar={cambiarMonedas} />

      <h2>Planes juntos</h2>
      <ul className="lista">
        {PLANES.map((plan) => (
          <PlanCard key={plan.id} plan={plan} puntos={estado.puntos} disponibleEsteMes={disponible} onCanjear={setPlanElegido} />
        ))}
      </ul>

      <h2>Mis cupones</h2>
      {estado.cupones.length === 0 ? (
        <p className="vacio">Todavía no canjeaste ningún plan 💕</p>
      ) : (
        <ul className="lista">
          {[...pendientes, ...cumplidos].map((c) => (
            <CouponItem key={c.id} cupon={c} onCumplido={(cupon) => setEstado((e) => marcarCumplido(e, cupon.id))} />
          ))}
        </ul>
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
          <p>Es tu canje de {nombreMes}: hasta el {formatearFecha(proximoCanje(ahora))} no vas a poder canjear otro.</p>
        </ConfirmDialog>
      )}

      <Toast mensaje={aviso} />
    </section>
  )
}

export default Canjes
