import { useEffect, useMemo, useReducer } from 'react'
import { CartContext } from './CartContext.js'
import { cartReducer, getCartLines, getItemCount, getSubtotal } from './cartReducer.js'
import { loadCart, saveCart } from './storage.js'

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, () => loadCart())

  useEffect(() => {
    saveCart(items)
  }, [items])

  const value = useMemo(
    () => ({
      items,
      lines: getCartLines(items),
      itemCount: getItemCount(items),
      subtotal: getSubtotal(items),
      addToCart: (id, quantity = 1) => dispatch({ type: 'add', id, quantity }),
      setQuantity: (id, quantity) => dispatch({ type: 'setQuantity', id, quantity }),
      removeFromCart: (id) => dispatch({ type: 'remove', id }),
      clearCart: () => dispatch({ type: 'clear' }),
    }),
    [items],
  )

  return <CartContext value={value}>{children}</CartContext>
}
