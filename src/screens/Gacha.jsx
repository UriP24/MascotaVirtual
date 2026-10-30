import { useState } from 'react'
import { GACHA, RAREZAS } from '../config.js'
import GachaResults from '../components/GachaResults.jsx'
import GachaOdds from '../components/GachaOdds.jsx'
import PieceExchange from '../components/PieceExchange.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'
import {
  buscarPrenda,
  canjearPiezas,
  mejorarPiezas,
  faltanParaRara,
  faltanParaUltra,
  precio,
  prendasCanjeables,
  progresoColeccion,
  temporadasActivas,
  tirar,
} from '../logic/gacha.js'
import ClothesAlbum from '../components/ClothesAlbum.jsx'
import { alternarPrenda } from '../logic/ropa.js'
import './Gacha.css'

const RAREZAS_CON_PIEZAS = RAREZAS.map((r) => r.id)
const nombreRareza = (id) => RAREZAS.find((r) => r.id === id).nombre.toLowerCase()

// Sección Gacha de Canjes: se gastan ⭐ en ropa y accesorios para Bolti.
function Gacha({ estado, setEstado, onAviso }) {
  const [confirmar, setConfirmar] = useState(null) // cantidad de tiradas a confirmar
  const [premios, setPremios] = useState(null)
  const [albumAbierto, setAlbumAbierto] = useState(false)
  const [canjeando, setCanjeando] = useState(null) // rareza de las piezas que está canjeando

  // "Ahora" = última actualización del estado (App lo refresca cada minuto)
  const ahora = new Date(estado.perrita.actualizadaEn)
  const temporadas = temporadasActivas(ahora)
  const coleccion = progresoColeccion(estado)
  const gratis = estado.gacha.tiradasGratis
  const faltanUltra = faltanParaUltra(estado)
  const faltanRara = faltanParaRara(estado)

  function hacerTirada(cantidad) {
    setConfirmar(null)
    const r = tirar(estado, cantidad, ahora)
    if (r.resultado !== 'ok') return
    setEstado(r.estado)
    setPremios(r.premios)
  }

  // Las gratis no piden confirmación; las que gastan ⭐, sí
  function pedirTirada(cantidad) {
    if (gratis >= cantidad) hacerTirada(cantidad)
    else setConfirmar(cantidad)
  }

  function canjear(prendaId) {
    const r = canjearPiezas(estado, prendaId, ahora)
    setCanjeando(null)
    if (r.resultado !== 'ok') return
    setEstado(r.estado)
    const prenda = buscarPrenda(prendaId)
    onAviso(`¡Conseguiste ${prenda.nombre}! ${prenda.emoji}`)
  }

  function mejorar(rareza) {
    const r = mejorarPiezas(estado, rareza)
    if (r.resultado !== 'ok') return
    setEstado(r.estado)
    onAviso(`⬆️ ¡Una pieza ${nombreRareza(GACHA.MEJORAR_PIEZAS[rareza].a)} más!`)
  }

  function botonTirar(cantidad, texto) {
    const esGratis = gratis >= cantidad
    const alcanza = esGratis || estado.puntos >= precio(cantidad)
    return (
      <button
        className={cantidad > 1 ? 'tirar multi' : 'tirar'}
        disabled={!alcanza}
        onClick={() => pedirTirada(cantidad)}
      >
        <span>{texto}</span>
        <strong>{esGratis ? 'Gratis 🎁' : `${precio(cantidad)} ⭐`}</strong>
      </button>
    )
  }

  return (
    <div className="gacha">
      <div className="gacha-cartel">
        <strong>✨ Ropita para Bolti</strong>
        <small>
          Cada tirada trae ropa, accesorios o ⭐. Cada {GACHA.GARANTIA_RARA} tiradas, una rara o mejor asegurada, y
          a las {GACHA.GARANTIA_ULTRA}, una ultra rara.
        </small>
        {temporadas.length > 0 && (
          <div className="temporadas">
            {temporadas.map((t) => (
              <span key={t.id}>
                {t.emoji} {t.nombre}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="garantias">
        <div className="fila">
          <span>💎 Ultra rara asegurada</span>
          <strong>{faltanUltra === 1 ? '¡en la próxima!' : `en ${faltanUltra} tiradas`}</strong>
        </div>
        <div className="barra" aria-hidden="true">
          <div style={{ width: `${(estado.gacha.tiradasDesdeUltra / GACHA.GARANTIA_ULTRA) * 100}%` }} />
        </div>
        <small>🌟 Rara o mejor asegurada {faltanRara === 1 ? 'en la próxima' : `en ${faltanRara} tiradas`}</small>
      </div>

      <div className="botones-tirar">
        {botonTirar(1, 'Tirar ×1')}
        {botonTirar(GACHA.TIRADAS_MULTI, `Multi ×${GACHA.TIRADAS_MULTI}`)}
      </div>
      {gratis > 0 && (
        <p className="gratis">
          🎁 Tenés {gratis} {gratis === 1 ? 'tirada gratis' : 'tiradas gratis'}
        </p>
      )}

      <h2>🧩 Piezas</h2>
      <ul className="piezas">
        {RAREZAS_CON_PIEZAS.map((id) => {
          const rareza = RAREZAS.find((r) => r.id === id)
          const tiene = estado.piezas[id]
          const costo = GACHA.PIEZAS_PARA_CANJE[id]
          const hayOpciones = prendasCanjeables(estado, id, ahora).length > 0
          return (
            <li key={id} style={{ '--color-rareza': rareza.color }}>
              <span className="nombre">{rareza.nombre}</span>
              <span className="cantidad">
                {tiene}/{costo}
              </span>
              <button disabled={tiene < costo || !hayOpciones} onClick={() => setCanjeando(id)}>
                Canjear
              </button>
              {GACHA.MEJORAR_PIEZAS[id] && (
                <button
                  className="mejorar"
                  disabled={tiene < GACHA.MEJORAR_PIEZAS[id].cantidad}
                  onClick={() => mejorar(id)}
                  aria-label={`Mejorar ${GACHA.MEJORAR_PIEZAS[id].cantidad} piezas ${rareza.nombre.toLowerCase()} por 1 ${nombreRareza(GACHA.MEJORAR_PIEZAS[id].a)}`}
                >
                  ⬆️ {GACHA.MEJORAR_PIEZAS[id].cantidad} → 1 {nombreRareza(GACHA.MEJORAR_PIEZAS[id].a).replace(' rara', '')}
                </button>
              )}
            </li>
          )
        })}
      </ul>
      <small className="ayuda">
        Si te toca una prenda repetida, te llevás una pieza de su rareza. Juntá piezas y elegí una prenda que te
        falte, o mejorá piezas a la rareza siguiente (⬆️). Lo de temporada se canjea solo en su época.
      </small>

      <button className="coleccion" onClick={() => setAlbumAbierto(true)}>
        📖 Tu ropa: {coleccion.tiene} de {coleccion.total} · Ver álbum
      </button>

      <GachaOdds ahora={ahora} />

      {confirmar && (
        <ConfirmDialog
          titulo={confirmar > 1 ? `✨ Multi ×${confirmar}` : '✨ Tirada'}
          textoConfirmar="¡Sí, tirar!"
          onConfirmar={() => hacerTirada(confirmar)}
          onCancelar={() => setConfirmar(null)}
        >
          <p>
            ¿Gastar <strong>{precio(confirmar)} ⭐</strong> en {confirmar > 1 ? `${confirmar} tiradas` : 'una tirada'}?
          </p>
          <p>Te quedarían {estado.puntos - precio(confirmar)} ⭐ para canjes.</p>
        </ConfirmDialog>
      )}

      {canjeando && (
        <PieceExchange
          rareza={RAREZAS.find((r) => r.id === canjeando)}
          opciones={prendasCanjeables(estado, canjeando, ahora)}
          onElegir={canjear}
          onCerrar={() => setCanjeando(null)}
        />
      )}

      {albumAbierto && (
        <ClothesAlbum
          estado={estado}
          onAlternarPrenda={(id) => setEstado((e) => alternarPrenda(e, id))}
          onCerrar={() => setAlbumAbierto(false)}
        />
      )}

      {premios && <GachaResults premios={premios} onCerrar={() => setPremios(null)} />}
    </div>
  )
}

export default Gacha
