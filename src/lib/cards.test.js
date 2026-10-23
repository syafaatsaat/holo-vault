import { describe, expect, it } from 'vitest'
import {
  CARDS,
  DEFAULT_SORT,
  PRICES_AS_OF,
  SETS,
  SORT_OPTIONS,
  countCardsInSet,
  filterCards,
  getCardById,
  getSetName,
  getTopCards,
  isKnownSet,
  isKnownSort,
} from './cards.js'

// A small, readable catalogue so expected orders are obvious.
const sample = [
  { id: 1, name: 'Charizard ex', set: '151', price: 305.79 },
  { id: 2, name: 'Pikachu ex', set: 'surging-sparks', price: 258.11 },
  { id: 3, name: 'Charizard ex', set: 'obsidian-flames', price: 89.11 },
  { id: 4, name: 'Umbreon ex', set: 'prismatic-evolutions', price: 1215.47 },
  { id: 5, name: 'Squirtle', set: '151', price: 87.43 },
  { id: 6, name: 'Dragonite ex', set: 'obsidian-flames', price: 3.51 },
]

const ids = (cards) => cards.map((card) => card.id)

describe('the card catalogue', () => {
  it('has the 276 cards from the four fan-favourite sets', () => {
    expect(CARDS).toHaveLength(276)
    expect(SETS.map((set) => set.name)).toEqual([
      '151',
      'Prismatic Evolutions',
      'Surging Sparks',
      'Obsidian Flames',
    ])
  })

  it('gives every card a unique id, a known set, a price and an image', () => {
    expect(new Set(ids(CARDS)).size).toBe(CARDS.length)
    for (const card of CARDS) {
      expect(isKnownSet(card.set)).toBe(true)
      expect(card.price).toBeGreaterThan(0)
      expect(card.image).toMatch(/^https:\/\//)
    }
  })

  it('has no card numbers left in card names', () => {
    for (const card of CARDS) expect(card.name).not.toMatch(/\d+\/\d+/)
  })

  it('records the date the prices were taken', () => {
    expect(PRICES_AS_OF).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('getCardById', () => {
  it('finds a card by number or string id', () => {
    const card = CARDS[0]
    expect(getCardById(card.id)).toBe(card)
    expect(getCardById(String(card.id))).toBe(card)
  })

  it('returns undefined for an unknown id', () => {
    expect(getCardById(-1)).toBeUndefined()
    expect(getCardById('not-a-card')).toBeUndefined()
  })
})

describe('sets', () => {
  it('turns a set slug into its display name', () => {
    expect(getSetName('prismatic-evolutions')).toBe('Prismatic Evolutions')
  })

  it('falls back to the slug for an unknown set', () => {
    expect(getSetName('base-set')).toBe('base-set')
  })

  it('counts cards in a set', () => {
    expect(countCardsInSet('151', sample)).toBe(2)
    const total = SETS.reduce((sum, set) => sum + countCardsInSet(set.slug), 0)
    expect(total).toBe(CARDS.length)
  })
})

describe('sort options', () => {
  it('lists the four sorts with price high to low as the default', () => {
    expect(SORT_OPTIONS.map((option) => option.value)).toEqual([
      'price-desc',
      'price-asc',
      'name-asc',
      'name-desc',
    ])
    expect(DEFAULT_SORT).toBe('price-desc')
    expect(isKnownSort('name-asc')).toBe(true)
    expect(isKnownSort('rarity')).toBe(false)
  })
})

describe('filterCards', () => {
  it('returns every card, priciest first, by default', () => {
    expect(ids(filterCards({}, sample))).toEqual([4, 1, 2, 3, 5, 6])
  })

  it('searches names, ignoring case and surrounding spaces', () => {
    expect(ids(filterCards({ query: '  CHARI ' }, sample))).toEqual([1, 3])
  })

  it('filters by set', () => {
    expect(ids(filterCards({ set: 'obsidian-flames' }, sample))).toEqual([3, 6])
  })

  it('combines search, set filter and sort', () => {
    const result = filterCards({ query: 'charizard', set: '151', sort: 'price-asc' }, sample)
    expect(ids(result)).toEqual([1])
  })

  it('sorts by price low to high', () => {
    expect(ids(filterCards({ sort: 'price-asc' }, sample))).toEqual([6, 5, 3, 2, 1, 4])
  })

  it('sorts by name, putting the pricier of two same-named cards first', () => {
    expect(ids(filterCards({ sort: 'name-asc' }, sample))).toEqual([1, 3, 6, 2, 5, 4])
    expect(ids(filterCards({ sort: 'name-desc' }, sample))).toEqual([4, 5, 2, 6, 3, 1])
  })

  it('returns nothing when no name matches', () => {
    expect(filterCards({ query: 'mewtwo' }, sample)).toEqual([])
  })

  it('treats an unknown set or sort as "all sets" and the default sort', () => {
    expect(ids(filterCards({ set: 'base-set', sort: 'rarity' }, sample))).toEqual(
      ids(filterCards({}, sample)),
    )
  })

  it('does not reorder the list it was given', () => {
    const copy = [...sample]
    filterCards({ sort: 'name-asc' }, copy)
    expect(copy).toEqual(sample)
  })
})

describe('getTopCards', () => {
  it('returns the most valuable cards', () => {
    expect(ids(getTopCards(3, sample))).toEqual([4, 1, 2])
  })

  it('leads the real catalogue with the Umbreon ex Special Illustration Rare', () => {
    const [top] = getTopCards(1)
    expect(top.name).toBe('Umbreon ex')
    expect(top.rarity).toBe('Special Illustration Rare')
  })
})
