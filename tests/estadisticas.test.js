import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { formatearMinutos, mejorRacha, rachaActual, resumen, ultimos7Dias } from '../src/logic/estadisticas.js'

// Semana del lunes 19 al domingo 25 de octubre de 2026
function conHistorial(historialEstudio, instaladaEn = '2026-10-12') {
  return { ...crearEstadoInicial(), historialEstudio, instaladaEn }
}

test('racha de días seguidos estudiando (con 25 min o más)', () => {
  const e = conHistorial({ '2026-10-20': 50, '2026-10-21': 25, '2026-10-22': 75 })
  assert.equal(rachaActual(e, new Date('2026-10-22T20:00:00')), 3)
})

test('si hoy todavía no estudió, la racha sigue contando hasta ayer', () => {
  const e = conHistorial({ '2026-10-21': 25, '2026-10-22': 50 })
  assert.equal(rachaActual(e, new Date('2026-10-23T10:00:00')), 2)
})

test('un día de semana sin estudio corta la racha; menos de 25 min no cuenta', () => {
  const e = conHistorial({ '2026-10-19': 50, '2026-10-20': 10, '2026-10-21': 50, '2026-10-22': 50 })
  assert.equal(rachaActual(e, new Date('2026-10-22T20:00:00')), 2)
})

test('el fin de semana sin estudio no corta la racha (y si estudió, suma)', () => {
  const finde = conHistorial({ '2026-10-22': 50, '2026-10-23': 50, '2026-10-26': 50 })
  assert.equal(rachaActual(finde, new Date('2026-10-26T20:00:00')), 3, 'jue, vie y lun')
  const conSabado = conHistorial({ '2026-10-23': 50, '2026-10-24': 25, '2026-10-26': 50 })
  assert.equal(rachaActual(conSabado, new Date('2026-10-26T20:00:00')), 3, 'vie, sáb y lun')
})

test('mejor racha histórica', () => {
  const e = conHistorial({
    '2026-10-12': 50, '2026-10-13': 50, '2026-10-14': 50, '2026-10-15': 50, // 4 seguidos
    '2026-10-19': 50, '2026-10-20': 50, // corte el viernes 16
  })
  assert.equal(mejorRacha(e, new Date('2026-10-20T20:00:00')), 4)
  assert.equal(rachaActual(e, new Date('2026-10-20T20:00:00')), 2)
})

test('resumen: total, pomodoros, días y promedio', () => {
  const r = resumen(conHistorial({ '2026-10-20': 50, '2026-10-21': 80, '2026-10-22': 10 }))
  assert.deepEqual(r, { minutosTotales: 140, pomodoros: 2 + 3, diasConEstudio: 2, promedioPorDia: 70 })
})

test('últimos 7 días para el gráfico, terminando hoy', () => {
  const dias = ultimos7Dias(conHistorial({ '2026-10-22': 50 }), new Date('2026-10-22T20:00:00'))
  assert.equal(dias.length, 7)
  assert.equal(dias.at(-1).fecha, '2026-10-22')
  assert.equal(dias.at(-1).letra, 'J')
  assert.equal(dias.at(-1).minutos, 50)
  assert.equal(dias[0].fecha, '2026-10-16')
})

test('formato de minutos', () => {
  assert.deepEqual([25, 60, 135].map(formatearMinutos), ['25 min', '1 h', '2 h 15 min'])
})
