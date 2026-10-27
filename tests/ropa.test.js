import { test } from 'node:test'
import assert from 'node:assert/strict'
import { crearEstadoInicial } from '../src/storage.js'
import { alternarPrenda, estaPuesta, ponerPrenda, ropaQueTiene, sacarPrenda, sacarTodo } from '../src/logic/ropa.js'

function conRopa(...ids) {
  const e = crearEstadoInicial()
  return { ...e, ropa: { tiene: ids, puesta: {} } }
}

test('ponerle una prenda que tiene, en su zona', () => {
  const e = ponerPrenda(conRopa('corona', 'bufanda'), 'corona')
  assert.deepEqual(e.ropa.puesta, { cabeza: 'corona' })
  assert.equal(estaPuesta(e, 'corona'), true)
})

test('no se le puede poner algo que no tiene', () => {
  const e = conRopa('corona')
  assert.equal(ponerPrenda(e, 'bufanda'), e)
})

test('una prenda por zona: la nueva reemplaza a la anterior', () => {
  let e = conRopa('corona', 'gorra', 'bufanda')
  e = ponerPrenda(ponerPrenda(e, 'corona'), 'bufanda')
  e = ponerPrenda(e, 'gorra')
  assert.deepEqual(e.ropa.puesta, { cabeza: 'gorra', cuello: 'bufanda' })
})

test('un disfraz entero saca lo demás, y otra prenda saca el disfraz', () => {
  let e = conRopa('corona', 'bufanda', 'disfraz-abeja')
  e = ponerPrenda(ponerPrenda(e, 'corona'), 'bufanda')
  e = ponerPrenda(e, 'disfraz-abeja')
  assert.deepEqual(e.ropa.puesta, { entero: 'disfraz-abeja' })
  e = ponerPrenda(e, 'corona')
  assert.deepEqual(e.ropa.puesta, { cabeza: 'corona' })
})

test('tocarla de nuevo se la saca', () => {
  let e = alternarPrenda(conRopa('corona'), 'corona')
  assert.equal(estaPuesta(e, 'corona'), true)
  e = alternarPrenda(e, 'corona')
  assert.deepEqual(e.ropa.puesta, {})
})

test('sacar una prenda o todo', () => {
  let e = conRopa('corona', 'bufanda')
  e = ponerPrenda(ponerPrenda(e, 'corona'), 'bufanda')
  assert.deepEqual(sacarPrenda(e, 'corona').ropa.puesta, { cuello: 'bufanda' })
  assert.deepEqual(sacarTodo(e).ropa.puesta, {})
})

test('el gorrito del cumple se puede sacar', () => {
  const e = { ...conRopa('gorrito-cumple'), ropa: { tiene: ['gorrito-cumple'], puesta: { cabeza: 'gorrito-cumple' } } }
  assert.deepEqual(alternarPrenda(e, 'gorrito-cumple').ropa.puesta, {})
})

test('la ropa se muestra ordenada por zona', () => {
  const ids = ropaQueTiene(conRopa('medias-colores', 'bufanda', 'corona')).map((p) => p.id)
  assert.deepEqual(ids, ['corona', 'bufanda', 'medias-colores'])
})
