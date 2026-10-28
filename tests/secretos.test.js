import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { PRENDAS, SECRETOS } from '../src/config.js'
import {
  agarrarMedia,
  atraparEstrella,
  sortearEstrella,
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

test('pasear a Bolti regala una multi; INVENCIBLE da el traje de superhéroe', () => {
  assert.equal(descubrir(estado(), 'paseo', MANANA).estado.gacha.tiradasGratis, 10)
  assert.ok(descubrir(estado(), 'invencible', MANANA).estado.ropa.tiene.includes('traje-superheroe'))
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

const NOCHE = new Date('2026-11-05T23:00:00')
const MADRUGADA = new Date('2026-11-06T02:00:00')

test('estrella: se sortea una vez por noche (la madrugada cuenta como la misma noche)', () => {
  const e = sortearEstrella(estado(), NOCHE, () => 0.99)
  assert.equal(e.estrella.ultimaNoche, '2026-11-05')
  assert.equal(e.estrella.estaNoche, false)
  assert.equal(sortearEstrella(e, MADRUGADA, () => 0), e, 'misma noche: no se vuelve a sortear')
  const dia = estado()
  assert.equal(sortearEstrella(dia, new Date('2026-11-05T15:00:00'), () => 0), dia, 'de día no hace nada')
})

test('estrella: arranca en 0,01% y crece ×1,25 por noche sin estrella, hasta 50%', () => {
  let e = sortearEstrella(estado(), NOCHE, () => 0.99)
  assert.equal(e.estrella.chance, 0.0001)
  e = sortearEstrella(e, new Date('2026-11-06T23:00:00'), () => 0.99)
  assert.ok(Math.abs(e.estrella.chance - 0.000125) < 1e-12)
  e = sortearEstrella(e, new Date('2026-11-09T23:00:00'), () => 0.99) // pasaron 3 noches
  assert.ok(Math.abs(e.estrella.chance - 0.0001 * 1.25 ** 4) < 1e-12)
  e = sortearEstrella(e, new Date('2027-06-01T23:00:00'), () => 0.99)
  assert.equal(e.estrella.chance, 0.5)
})

test('estrella: al atraparla, la primera da la multi (secreto) y las siguientes 1 tirada; la chance vuelve a empezar', () => {
  const alta = { ...estado(), estrella: { chance: 0.4, ultimaNoche: '2026-11-04', estaNoche: true } }
  let r = atraparEstrella(alta, NOCHE)
  assert.equal(r.nuevo, true)
  assert.equal(r.estado.gacha.tiradasGratis, 10)
  assert.equal(r.estado.estrella.chance, 0.0001)
  assert.equal(r.estado.estrella.estaNoche, false)
  r = atraparEstrella({ ...r.estado, estrella: { ...r.estado.estrella, estaNoche: true } }, NOCHE)
  assert.equal(r.nuevo, false)
  assert.equal(r.estado.gacha.tiradasGratis, 11)
})
