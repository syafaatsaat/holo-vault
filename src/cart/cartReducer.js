import { getCardById } from '../lib/cards.js'
import { MAX_QUANTITY, clampQuantity } from '../lib/format.js'

// The cart is a list of { id, quantity }, in the order cards were first added.
export const emptyCart = []

export function cartReducer(items, action) {
  // Ids may arrive as strings ("21898"); use the card's own numeric id.
  const id = getCardById(action.id)?.id

  switch (action.type) {
    case 'add': {
      if (id === undefined) return items
      const quantity = clampQuantity(action.quantity)
      const existing = items.find((item) => item.id === id)
      if (!existing) return [...items, { id, quantity }]
      return items.map((item) =>
        item.id === id ? { ...item, quantity: Math.min(item.quantity + quantity, MAX_QUANTITY) } : item,
      )
    }
    case 'setQuantity': {
      if (!items.some((item) => item.id === id)) return items
      const quantity = clampQuantity(action.quantity)
      return items.map((item) => (item.id === id ? { ...item, quantity } : item))
    }
    case 'remove':
      return items.filter((item) => item.id !== id)
    case 'clear':
      return emptyCart
    default:
      throw new Error(`Unknown cart action: ${action.type}`)
  }
}

// Cart rows with their card details and line totals. Totals are worked out in
// whole cents so they never pick up floating-point noise.
export function getCartLines(items) {
  return items.flatMap(({ id, quantity }) => {
    const card = getCardById(id)
    if (!card) return []
    const lineCents = Math.round(card.price * 100) * quantity
    return [{ card, quantity, lineTotal: lineCents / 100 }]
  })
}

export function getItemCount(items) {
  return items.reduce((count, item) => count + item.quantity, 0)
}

export function getSubtotal(items) {
  const cents = getCartLines(items).reduce((sum, line) => sum + Math.round(line.lineTotal * 100), 0)
  return cents / 100
}
