import { useEffect, useState } from 'react'
import { PLANES, precioEnPuntos } from '../config.js'
import PlanCard from '../components/PlanCard.jsx'
import CouponItem from '../components/CouponItem.jsx'
import CoinExchange from '../components/CoinExchange.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import Toast from '../components/Toast.jsx'
import { canjear, disponibleDesde, marcarCumplido, nombreDelMes, textoRotacion } from '../logic/canjes.js'
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
  // Del más caro al más barato
  const planesOrdenados = [...PLANES].sort((a, b) => precioEnPuntos(b) - precioEnPuntos(a))
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

      <div className="cartel-reglas">
        <strong>🎁 Canjeá puntos por planes juntos</strong>
        <small>Podés canjear varios. Cada plan tiene su espera: la mayoría 1 vez por mes, la cena casera cada 2 meses y las salidas grandes 🍝 🎬 cada 3 meses.</small>
      </div>

      <CoinExchange monedas={estado.monedas} quedanHoy={puntosConvertiblesHoy(estado, ahora)} onCambiar={cambiarMonedas} />

      <h2>Planes juntos</h2>
      <ul className="lista">
        {planesOrdenados.map((plan) => (
          <PlanCard
            key={plan.id}
            plan={plan}
            puntos={estado.puntos}
            vuelveEl={disponibleDesde(estado, plan, ahora)}
            onCanjear={setPlanElegido}
          />
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
