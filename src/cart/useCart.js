import { use } from 'react'
import { CartContext } from './CartContext.js'

export function useCart() {
  const cart = use(CartContext)
  if (!cart) throw new Error('useCart must be used inside a <CartProvider>')
  return cart
}
