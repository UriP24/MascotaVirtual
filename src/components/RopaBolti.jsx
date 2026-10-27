import PiezaRopa from './ropa/PiezaRopa.jsx'
import { DIBUJOS_ROPA } from './ropa/dibujos.js'

// La ropa que Bolti tiene puesta, dibujada en su SVG. Se usa tres veces, en distintas capas:
// - parte="atras": detrás del cuerpo (capas, alas)
// - parte="cuerpo": sobre el cuerpo (ropa, cuello, patitas)
// - parte="cabeza": adentro del grupo de la cabeza (gorros, anteojos), así se mueve con ella
// Recibe `puesta`: { cabeza: 'gorrito-cumple', cuello: 'bufanda', … }

// Orden en que se dibujan las zonas (lo de abajo primero: la bufanda va sobre la remera)
const ORDEN_ZONAS = ['entero', 'cuerpo', 'patitas', 'cuello', 'cara', 'cabeza']

function RopaBolti({ puesta = {}, parte }) {
  return ORDEN_ZONAS.flatMap((zona) => {
    const id = puesta[zona]
    if (!id) return []
    return (DIBUJOS_ROPA[id] ?? [])
      .filter((pieza) => pieza.parte === parte)
      .map((pieza, i) => <PiezaRopa key={`${id}-${i}`} pieza={pieza} />)
  })
}

export default RopaBolti
