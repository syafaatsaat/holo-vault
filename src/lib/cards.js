import snapshot from '../data/cards.json'

// The card catalogue is a static snapshot made by scripts/fetch-cards.mjs.
export const PRICES_AS_OF = snapshot.pricesAsOf
export const SETS = snapshot.sets
export const CARDS = snapshot.cards

export const ALL_SETS = 'all'

export const SORT_OPTIONS = [
  { value: 'price-desc', label: 'Price: high to low' },
  { value: 'price-asc', label: 'Price: low to high' },
  { value: 'name-asc', label: 'Name: A to Z' },
  { value: 'name-desc', label: 'Name: Z to A' },
]

export const DEFAULT_SORT = 'price-desc'

const cardsById = new Map(CARDS.map((card) => [card.id, card]))
const setNames = new Map(SETS.map((set) => [set.slug, set.name]))

// Ids come back as strings from URLs and localStorage, so accept either.
export function getCardById(id) {
  return cardsById.get(Number(id))
}

export function getSetName(slug) {
  return setNames.get(slug) ?? slug
}

export function isKnownSet(slug) {
  return setNames.has(slug)
}

export function isKnownSort(value) {
  return SORT_OPTIONS.some((option) => option.value === value)
}

export function countCardsInSet(slug, cards = CARDS) {
  return cards.filter((card) => card.set === slug).length
}

// Same names (e.g. the two Charizard ex) fall back to the pricier one first,
// then id, so every sort has one fixed order.
function byName(a, b) {
  return a.name.localeCompare(b.name) || b.price - a.price || a.id - b.id
}

const comparators = {
  'price-desc': (a, b) => b.price - a.price || byName(a, b),
  'price-asc': (a, b) => a.price - b.price || byName(a, b),
  'name-asc': byName,
  'name-desc': (a, b) => byName(b, a),
}

// Search by name, filter by set and sort, all in one pass. Unknown set or sort
// values (e.g. from a hand-edited URL) fall back to "all sets" and the default sort.
export function filterCards({ set = ALL_SETS, query = '', sort = DEFAULT_SORT } = {}, cards = CARDS) {
  const needle = query.trim().toLowerCase()
  const setFilter = isKnownSet(set) ? set : ALL_SETS
  const compare = comparators[sort] ?? comparators[DEFAULT_SORT]

  return cards
    .filter((card) => setFilter === ALL_SETS || card.set === setFilter)
    .filter((card) => !needle || card.name.toLowerCase().includes(needle))
    .sort(compare)
}

export function getTopCards(count, cards = CARDS) {
  return [...cards].sort(comparators['price-desc']).slice(0, count)
}
