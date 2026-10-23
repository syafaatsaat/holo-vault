import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../cart/useCart.js'
import PageBand from '../../components/PageBand/PageBand.jsx'
import CartRow from './CartRow.jsx'
import CartSummary from './CartSummary.jsx'
import EmptyCart from './EmptyCart.jsx'
import styles from './Cart.module.css'

export default function Cart() {
  const { lines, itemCount, subtotal, setQuantity, removeFromCart } = useCart()
  const [announcement, setAnnouncement] = useState('')
  // After a removal the focused Remove button disappears; move focus to a
  // neighbouring row's Remove button (or the empty-cart link) once the list updates.
  const focusAfterRemove = useRef(null)
  const removeButtons = useRef(new Map())
  const shopLink = useRef(null)

  useEffect(() => {
    const pending = focusAfterRemove.current
    if (pending === null) return
    focusAfterRemove.current = null
    const target = pending === 'shop' ? shopLink.current : removeButtons.current.get(pending)
    target?.focus()
  }, [lines])

  function handleRemove(index) {
    const { card } = lines[index]
    const neighbour = lines[index + 1] ?? lines[index - 1]
    focusAfterRemove.current = neighbour ? neighbour.card.id : 'shop'
    removeFromCart(card.id)
    setAnnouncement(`Removed ${card.name} from your cart.`)
  }

  const countText = `${itemCount} ${itemCount === 1 ? 'card' : 'cards'} in your cart`

  return (
    <>
      <title>Cart · Holo Vault</title>
      <PageBand eyebrow={lines.length > 0 ? countText : undefined} title="Your" highlight="cart.">
        Change quantities or remove cards before you visit the shop.
      </PageBand>
      <div className="page-content">
        {lines.length === 0 ? (
          <EmptyCart linkRef={shopLink} />
        ) : (
          <div className={styles.layout}>
            <ul className={styles.list} aria-label="Cart items">
              {lines.map((line, index) => (
                <CartRow
                  key={line.card.id}
                  line={line}
                  onQuantityChange={(quantity) => setQuantity(line.card.id, quantity)}
                  onRemove={() => handleRemove(index)}
                  removeButtonRef={(button) => {
                    if (button) removeButtons.current.set(line.card.id, button)
                    else removeButtons.current.delete(line.card.id)
                  }}
                />
              ))}
            </ul>
            <CartSummary itemCount={itemCount} subtotal={subtotal} />
          </div>
        )}
        <p role="status" className="visually-hidden">
          {announcement}
        </p>
      </div>
    </>
  )
}
