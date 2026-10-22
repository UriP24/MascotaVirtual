import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { festejarLogro, festejoVisto, fraseDeFestejo } from '../src/logic/festejo.js'

test('cada logro suma cariño y queda pendiente de festejar', () => {
  let e = crearEstadoInicial()
  const carino = e.perrita.carino
  e = festejarLogro(e, 'tarea')
  e = festejarLogro(e, 'tarea')
  assert.equal(e.perrita.carino, carino + 10)
  assert.equal(fraseDeFestejo(e.perrita.festejo), '¡Terminaste 2 tareas! 🎉')
  e = festejarLogro(e, 'estudio')
  assert.match(fraseDeFestejo(e.perrita.festejo), /Estudiaste/)
  assert.equal(festejoVisto(e).perrita.festejo, null)
})

test('el cariño no pasa de 100', () => {
  const e = crearEstadoInicial()
  const lleno = { ...e, perrita: { ...e.perrita, carino: 98 } }
  assert.equal(festejarLogro(lleno, 'tarea').perrita.carino, 100)
})
