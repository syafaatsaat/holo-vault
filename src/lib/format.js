export const MIN_QUANTITY = 1
export const MAX_QUANTITY = 99

const priceFormatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

// 1215.47 -> "$1,215.47"
export function formatPrice(amount) {
  return priceFormatter.format(amount)
}

const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

// "2026-10-22" -> "22 Oct 2026". Read as UTC so it never shifts a day in other time zones.
export function formatPricesDate(isoDate) {
  return dateFormatter.format(new Date(`${isoDate}T00:00:00Z`))
}

// While typing, keep digits only (at most two), and allow an empty field
// so the user can clear it before entering a new number.
export function sanitizeQuantityInput(text) {
  return String(text).replace(/\D/g, '').slice(0, 2)
}

// The quantity actually used: blank, 0 or junk becomes 1; anything above 99 becomes 99.
export function clampQuantity(value) {
  const quantity = Number.parseInt(value, 10)
  if (Number.isNaN(quantity) || quantity < MIN_QUANTITY) return MIN_QUANTITY
  return Math.min(quantity, MAX_QUANTITY)
}
