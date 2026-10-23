import { getCardById } from '../lib/cards.js'
import { MAX_QUANTITY, clampQuantity } from '../lib/format.js'

export const STORAGE_KEY = 'holo-vault-cart'
const VERSION = 1

// Reading window.localStorage itself throws when storage is blocked
// (some private modes, disabled site data), so guard the lookup too.
function defaultStorage() {
  try {
    return window.localStorage
  } catch {
    return null
  }
}

// Turn whatever was saved into a valid cart: known cards only, quantities 1-99,
// and one row per card. Anything unreadable gives an empty cart.
export function loadCart(storage = defaultStorage()) {
  try {
    const raw = storage?.getItem(STORAGE_KEY)
    if (!raw) return []
    const saved = JSON.parse(raw)
    if (saved?.version !== VERSION || !Array.isArray(saved.items)) return []

    const rows = new Map()
    for (const item of saved.items) {
      const card = getCardById(item?.id)
      if (!card) continue
      const quantity = clampQuantity(item.quantity)
      const previous = rows.get(card.id) ?? 0
      rows.set(card.id, Math.min(previous + quantity, MAX_QUANTITY))
    }
    return [...rows].map(([id, quantity]) => ({ id, quantity }))
  } catch {
    return []
  }
}

// Saving is best effort: if storage is full or blocked, the cart still works,
// it just won't survive a refresh.
export function saveCart(items, storage = defaultStorage()) {
  try {
    storage?.setItem(STORAGE_KEY, JSON.stringify({ version: VERSION, items }))
  } catch {
    // Ignore: see above.
  }
}
