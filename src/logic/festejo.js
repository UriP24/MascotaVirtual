// Bolti festeja los logros de Mari: gana cariño y, la próxima vez que Mari entra a Casa,
// salta y le dice algo lindo.

import { PERRITA } from '../config.js'

// tipo: 'tarea' | 'estudio' | 'canje' | 'juego'
// sumarCarino: false cuando el logro ya da su propio cariño (por ejemplo, una partida)
export function festejarLogro(estado, tipo, { sumarCarino = true } = {}) {
  const p = estado.perrita
  const anterior = p.festejo
  return {
    ...estado,
    perrita: {
      ...p,
      carino: sumarCarino ? Math.min(PERRITA.NECESIDAD_MAXIMA, p.carino + PERRITA.CARINO_POR_LOGRO) : p.carino,
      festejo: {
        tareas: (anterior?.tareas ?? 0) + (tipo === 'tarea' ? 1 : 0),
        estudio: (anterior?.estudio ?? 0) + (tipo === 'estudio' ? 1 : 0),
        canjes: (anterior?.canjes ?? 0) + (tipo === 'canje' ? 1 : 0),
        juegos: (anterior?.juegos ?? 0) + (tipo === 'juego' ? 1 : 0),
      },
    },
  }
}

export function fraseDeFestejo(festejo) {
  if (!festejo) return null
  if (festejo.canjes > 0) return '¡Que disfruten el plan! 💕'
  if (festejo.juegos > 0 && !festejo.estudio && !festejo.tareas) return '¡Qué lindo jugar con vos! 🦴'
  if (festejo.estudio > 0) return '¡Estudiaste un montón! Estoy orgullosa 📚💕'
  if (festejo.tareas > 1) return `¡Terminaste ${festejo.tareas} tareas! 🎉`
  return '¡Vi que terminaste una tarea! 🎉'
}

export function festejoVisto(estado) {
  if (!estado.perrita.festejo) return estado
  return { ...estado, perrita: { ...estado.perrita, festejo: null } }
}
