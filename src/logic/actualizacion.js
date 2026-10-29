// Actualizaciones sin cortes: cuando se publica una versión nueva, la app no se recarga en medio de
// una partida o de un pomodoro. Espera a que pase a segundo plano (Mari cambia de app o bloquea el
// celu) sin nada en curso, y recién ahí instala la versión nueva. Si la cierra del todo, la próxima
// vez que la abra ya arranca con la nueva.

const ocupada = new Set() // lo que está en curso: 'juego', 'estudio'
let instalar = null // instala la versión nueva y recarga (la da el service worker)

// Las pantallas avisan cuando empieza y termina algo que no hay que cortar
export function marcarOcupada(motivo, siOno) {
  if (siOno) ocupada.add(motivo)
  else ocupada.delete(motivo)
  intentar()
}

export function hayVersionNueva(instalarla) {
  instalar = instalarla
  intentar()
}

function intentar() {
  if (!instalar || ocupada.size > 0 || document.visibilityState !== 'hidden') return
  const instalarla = instalar
  instalar = null
  instalarla()
}

if (typeof document !== 'undefined') document.addEventListener('visibilitychange', intentar)
