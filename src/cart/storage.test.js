import { afterEach, describe, expect, it, vi } from 'vitest'
import { STORAGE_KEY, loadCart, saveCart } from './storage.js'
import { pikachu, umbreon } from './testCards.js'

const saveRaw = (value) => localStorage.setItem(STORAGE_KEY, value)
const saveVersioned = (items) => saveRaw(JSON.stringify({ version: 1, items }))

afterEach(() => {
  vi.restoreAllMocks()
})

describe('saveCart and loadCart', () => {
  it('round-trip a cart', () => {
    const items = [
      { id: umbreon.id, quantity: 1 },
      { id: pikachu.id, quantity: 2 },
    ]
    saveCart(items)
    expect(loadCart()).toEqual(items)
  })

  it('start empty when nothing has been saved', () => {
    expect(loadCart()).toEqual([])
  })
})

describe('loadCart with bad saved data', () => {
  it('returns an empty cart for data that is not JSON', () => {
    saveRaw('{not json')
    expect(loadCart()).toEqual([])
  })

  it('returns an empty cart for the wrong shape or an unknown version', () => {
    saveRaw(JSON.stringify([{ id: umbreon.id, quantity: 1 }]))
    expect(loadCart()).toEqual([])
    saveRaw(JSON.stringify({ version: 99, items: [{ id: umbreon.id, quantity: 1 }] }))
    expect(loadCart()).toEqual([])
    saveRaw(JSON.stringify({ version: 1, items: 'lots' }))
    expect(loadCart()).toEqual([])
  })

  it('drops cards that are no longer in the catalogue and junk rows', () => {
    saveVersioned([{ id: -1, quantity: 2 }, null, 'umbreon', { id: umbreon.id, quantity: 1 }])
    expect(loadCart()).toEqual([{ id: umbreon.id, quantity: 1 }])
  })

  it('keeps quantities within 1 to 99', () => {
    saveVersioned([
      { id: umbreon.id, quantity: 0 },
      { id: pikachu.id, quantity: 500 },
    ])
    expect(loadCart()).toEqual([
      { id: umbreon.id, quantity: 1 },
      { id: pikachu.id, quantity: 99 },
    ])
  })

  it('merges duplicate rows for the same card', () => {
    saveVersioned([
      { id: umbreon.id, quantity: 2 },
      { id: String(umbreon.id), quantity: 3 },
    ])
    expect(loadCart()).toEqual([{ id: umbreon.id, quantity: 5 }])
  })
})

describe('when storage is blocked or full', () => {
  it('loads an empty cart if reading throws', () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    expect(loadCart()).toEqual([])
  })

  it('does not crash if saving throws', () => {
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('QuotaExceededError')
    })
    expect(() => saveCart([{ id: umbreon.id, quantity: 1 }])).not.toThrow()
  })

  it('copes with no storage at all', () => {
    expect(loadCart(null)).toEqual([])
    expect(() => saveCart([], null)).not.toThrow()
  })
})
