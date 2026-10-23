import { CARDS } from '../lib/cards.js'

// Real catalogue cards used across the cart tests.
function find(name, rarity) {
  const card = CARDS.find((c) => c.name === name && c.rarity === rarity)
  if (!card) throw new Error(`Test card not found: ${name} (${rarity})`)
  return card
}

export const umbreon = find('Umbreon ex', 'Special Illustration Rare') // $1,215.47
export const pikachu = find('Pikachu ex', 'Special Illustration Rare') // $258.11
export const latias = find('Latias ex', 'Double Rare') // $5.64
