import { useEffect, useRef, useState } from 'react'
import { useCart } from '../../cart/useCart.js'
import PageBand from '../../components/PageBand/PageBand.jsx'
import CartRow from './CartRow.jsx'
import CartSummary from './CartSummary.jsx'
import EmptyCart from './EmptyCart.jsx'
import RemoveDialog from './RemoveDialog.jsx'
import styles from './Cart.module.css'

export default function Cart() {
  const { lines, itemCount, subtotal, setQuantity, removeFromCart } = useCart()
  const [announcement, setAnnouncement] = useState('')
  // The card whose Remove button was pressed, waiting for the dialog's answer
  const [confirmingId, setConfirmingId] = useState(null)
  const confirmingIndex = lines.findIndex((line) => line.card.id === confirmingId)
  // Where focus goes once the dialog has closed: back to the same Remove button
  // if the card was kept; after a removal that button is gone, so a neighbouring
  // row's Remove button (or the empty-cart link).
  const focusNext = useRef(null)
  const removeButtons = useRef(new Map())
  const shopLink = useRef(null)

  useEffect(() => {
    const pending = focusNext.current
    if (pending === null || confirmingId !== null) return
    focusNext.current = null
    const target = pending === 'shop' ? shopLink.current : removeButtons.current.get(pending)
    target?.focus()
  }, [lines, confirmingId])

  function keepCard() {
    focusNext.current = confirmingId
    setConfirmingId(null)
  }

  function removeCard() {
    const { card } = lines[confirmingIndex]
    const neighbour = lines[confirmingIndex + 1] ?? lines[confirmingIndex - 1]
    focusNext.current = neighbour ? neighbour.card.id : 'shop'
    setConfirmingId(null)
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
              {lines.map((line) => (
                <CartRow
                  key={line.card.id}
                  line={line}
                  onQuantityChange={(quantity) => setQuantity(line.card.id, quantity)}
                  onRemove={() => setConfirmingId(line.card.id)}
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
        {confirmingIndex >= 0 && (
          <RemoveDialog line={lines[confirmingIndex]} onConfirm={removeCard} onCancel={keepCard} />
        )}
        <p role="status" className="visually-hidden">
          {announcement}
        </p>
      </div>
    </>
  )
}
