import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { PRENDAS, SECRETOS } from '../src/config.js'
import {
  agarrarMedia,
  comerPure,
  descubrir,
  fechaEspecial,
  hayPure,
  pistaAlAzar,
  progresoSecretos,
  sortearMedia,
} from '../src/logic/secretos.js'
import { borrarSecretos, lanzarEvento } from '../src/logic/prueba.js'

const MANANA = new Date('2026-11-05T11:00:00')
const TEMPRANO = new Date('2026-11-05T08:00:00')
const ALMUERZO = new Date('2026-11-05T13:30:00')

function estado(extra = {}) {
  return { ...crearEstadoInicial(), instaladaEn: '2026-10-28', ...extra }
}

test('cada secreto con premio de prenda usa una prenda exclusiva que existe', () => {
  for (const s of SECRETOS.filter((x) => x.premio?.prenda)) {
    const prenda = PRENDAS.find((p) => p.id === s.premio.prenda)
    assert.ok(prenda, s.id)
    assert.equal(prenda.exclusiva, true, s.id)
  }
})

test('descubrir un secreto da su premio una sola vez', () => {
  const r = descubrir(estado(), 'estornudo', MANANA)
  assert.equal(r.nuevo, true)
  assert.ok(r.estado.ropa.tiene.includes('panuelo-salud'))
  assert.equal(progresoSecretos(r.estado).descubiertos, 1)
  const otra = descubrir(r.estado, 'estornudo', MANANA)
  assert.equal(otra.nuevo, false)
  assert.equal(otra.estado.ropa.tiene.filter((id) => id === 'panuelo-salud').length, 1)
})

test('la estrella fugaz regala una multi', () => {
  const r = descubrir(estado(), 'estrella', MANANA)
  assert.equal(r.estado.gacha.tiradasGratis, 10)
})

test('los secretos que vienen después todavía no se pueden descubrir', () => {
  assert.equal(descubrir(estado(), 'paseo', MANANA).nuevo, false)
})

test('fechas especiales: San Valentín y aniversario, todos los años', () => {
  assert.equal(fechaEspecial(new Date('2027-02-14T12:00:00')), 'san-valentin')
  assert.equal(fechaEspecial(new Date('2027-03-24T12:00:00')), 'aniversario')
  assert.equal(fechaEspecial(new Date('2028-03-24T09:00:00')), 'aniversario')
  assert.equal(fechaEspecial(MANANA), null)
})

test('la media se sortea una vez por día y solo desde que se despierta', () => {
  assert.equal(sortearMedia(estado(), TEMPRANO, () => 0).mediaEsperando, false)
  const conMedia = sortearMedia(estado(), MANANA, () => 0)
  assert.equal(conMedia.mediaEsperando, true)
  const sinSuerte = sortearMedia(estado(), MANANA, () => 0.9)
  assert.equal(sinSuerte.mediaEsperando, false)
  assert.equal(sortearMedia(sinSuerte, MANANA, () => 0).mediaEsperando, false, 'ya se sorteó hoy')
})

test('dos medias completan el par (secreto) y después dan monedas', () => {
  let e = estado({ mediaEsperando: true })
  let r = agarrarMedia(e, MANANA)
  assert.equal(r.resultado, 'suelta')
  r = agarrarMedia({ ...r.estado, mediaEsperando: true }, MANANA)
  assert.equal(r.resultado, 'par')
  assert.equal(r.nuevo, true)
  assert.ok(r.estado.ropa.tiene.includes('par-medias'))
  const monedas = r.estado.monedas
  r = agarrarMedia({ ...r.estado, mediaEsperando: true }, MANANA)
  assert.equal(r.resultado, 'extra')
  assert.equal(r.estado.monedas, monedas + 10)
})

test('el puré aparece al almuerzo, unos días después de empezar y una vez por semana', () => {
  assert.equal(hayPure(estado(), ALMUERZO), true)
  assert.equal(hayPure(estado(), MANANA), false, 'fuera del horario')
  assert.equal(hayPure(estado({ instaladaEn: '2026-11-04' }), ALMUERZO), false, 'muy pronto')
  const r = comerPure(estado(), ALMUERZO)
  assert.equal(r.nuevo, true)
  assert.ok(r.estado.ropa.tiene.includes('babero-complice'))
  assert.equal(hayPure(r.estado, ALMUERZO), false, 'ya comió esta semana')
  assert.equal(hayPure(r.estado, new Date('2026-11-12T13:30:00')), true)
})

test('las pistas son de secretos que todavía no descubrió', () => {
  let e = estado()
  for (const s of SECRETOS) e = descubrir(e, s.id, MANANA).estado
  assert.equal(pistaAlAzar(e), null)
  assert.equal(typeof pistaAlAzar(estado(), () => 0), 'string')
})

test('modo prueba: borrar secretos los olvida y saca sus premios', () => {
  let e = descubrir(estado(), 'estornudo', MANANA).estado
  e = { ...e, ropa: { ...e.ropa, puesta: { cuello: 'panuelo-salud' } } }
  const limpio = borrarSecretos(e)
  assert.deepEqual(limpio.secretos, {})
  assert.ok(!limpio.ropa.tiene.includes('panuelo-salud'))
  assert.deepEqual(limpio.ropa.puesta, {})
  assert.equal(lanzarEvento(estado(), 'gato').eventoPrueba.tipo, 'gato')
})
