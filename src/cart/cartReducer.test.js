import { describe, expect, it } from 'vitest'
import { cartReducer, emptyCart, getCartLines, getItemCount, getSubtotal } from './cartReducer.js'
import { latias, pikachu, umbreon } from './testCards.js'

const add = (items, id, quantity) => cartReducer(items, { type: 'add', id, quantity })

describe('cartReducer', () => {
  it('adds a new card with its quantity', () => {
    expect(add(emptyCart, umbreon.id, 2)).toEqual([{ id: umbreon.id, quantity: 2 }])
  })

  it('keeps cards in the order they were first added', () => {
    const items = add(add(emptyCart, umbreon.id, 1), pikachu.id, 1)
    expect(items.map((item) => item.id)).toEqual([umbreon.id, pikachu.id])
  })

  it('adds to the quantity when the same card is added again', () => {
    const items = add(add(emptyCart, umbreon.id, 2), umbreon.id, 3)
    expect(items).toEqual([{ id: umbreon.id, quantity: 5 }])
  })

  it('caps a card at 99', () => {
    const items = add(add(emptyCart, umbreon.id, 98), umbreon.id, 5)
    expect(items).toEqual([{ id: umbreon.id, quantity: 99 }])
  })

  it('treats a string id as the same card', () => {
    const items = add(add(emptyCart, umbreon.id, 1), String(umbreon.id), 1)
    expect(items).toEqual([{ id: umbreon.id, quantity: 2 }])
  })

  it('adds 1 when the quantity is missing or invalid', () => {
    expect(add(emptyCart, umbreon.id, undefined)).toEqual([{ id: umbreon.id, quantity: 1 }])
    expect(add(emptyCart, umbreon.id, 'abc')).toEqual([{ id: umbreon.id, quantity: 1 }])
  })

  it('ignores cards that are not in the catalogue', () => {
    expect(add(emptyCart, -1, 1)).toBe(emptyCart)
  })

  it('sets a quantity, keeping it within 1 to 99', () => {
    const items = add(emptyCart, umbreon.id, 1)
    const set = (quantity) => cartReducer(items, { type: 'setQuantity', id: umbreon.id, quantity })
    expect(set(7)).toEqual([{ id: umbreon.id, quantity: 7 }])
    expect(set(0)).toEqual([{ id: umbreon.id, quantity: 1 }])
    expect(set(500)).toEqual([{ id: umbreon.id, quantity: 99 }])
  })

  it('ignores setting the quantity of a card that is not in the cart', () => {
    const items = add(emptyCart, umbreon.id, 1)
    expect(cartReducer(items, { type: 'setQuantity', id: pikachu.id, quantity: 4 })).toBe(items)
  })

  it('removes a card', () => {
    const items = add(add(emptyCart, umbreon.id, 1), pikachu.id, 1)
    expect(cartReducer(items, { type: 'remove', id: umbreon.id })).toEqual([
      { id: pikachu.id, quantity: 1 },
    ])
  })

  it('clears the cart', () => {
    const items = add(emptyCart, umbreon.id, 1)
    expect(cartReducer(items, { type: 'clear' })).toEqual([])
  })

  it('never changes the previous cart', () => {
    const before = add(emptyCart, umbreon.id, 1)
    const snapshot = structuredClone(before)
    add(before, umbreon.id, 2)
    cartReducer(before, { type: 'setQuantity', id: umbreon.id, quantity: 9 })
    cartReducer(before, { type: 'remove', id: umbreon.id })
    expect(before).toEqual(snapshot)
  })

  it('throws on an unknown action, so typos are caught early', () => {
    expect(() => cartReducer(emptyCart, { type: 'addd' })).toThrow('Unknown cart action: addd')
  })
})

describe('cart totals', () => {
  const items = [
    { id: umbreon.id, quantity: 1 },
    { id: pikachu.id, quantity: 2 },
  ]

  it('builds rows with card details and line totals', () => {
    expect(getCartLines(items)).toEqual([
      { card: umbreon, quantity: 1, lineTotal: 1215.47 },
      { card: pikachu, quantity: 2, lineTotal: 516.22 },
    ])
  })

  it('counts every copy of every card', () => {
    expect(getItemCount(items)).toBe(3)
    expect(getItemCount(emptyCart)).toBe(0)
  })

  it('adds up the subtotal', () => {
    expect(getSubtotal(items)).toBe(1731.69)
    expect(getSubtotal(emptyCart)).toBe(0)
  })

  it('keeps totals exact to the cent', () => {
    // 5.64 * 3 is 16.919999999999998 in plain floating-point maths.
    const latiasItems = [{ id: latias.id, quantity: 3 }]
    expect(getCartLines(latiasItems)[0].lineTotal).toBe(16.92)
    expect(getSubtotal(latiasItems)).toBe(16.92)
  })
})
