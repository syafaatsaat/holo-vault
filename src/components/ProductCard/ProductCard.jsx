import { useEffect, useRef, useState } from 'react'
import { getSetName } from '../../lib/cards.js'
import { formatPrice } from '../../lib/format.js'
import QuantityStepper from '../QuantityStepper/QuantityStepper.jsx'
import RarityBadge from '../RarityBadge/RarityBadge.jsx'
import CardZoom from './CardZoom.jsx'
import styles from './ProductCard.module.css'

const ADDED_MESSAGE_MS = 1200

export default function ProductCard({ card, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(null)
  const [zoomed, setZoomed] = useState(false)
  const zoomButtonRef = useRef(null)
  const setName = getSetName(card.set)

  // Turn "Added to cart" back into the normal button after a moment.
  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(null), ADDED_MESSAGE_MS)
    return () => clearTimeout(timer)
  }, [added])

  // Back to the magnify button once the close-up has gone (it can't take focus
  // while the modal is still open)
  const refocusZoomButton = useRef(false)
  useEffect(() => {
    if (zoomed || !refocusZoomButton.current) return
    refocusZoomButton.current = false
    zoomButtonRef.current?.focus()
  }, [zoomed])

  function closeZoom() {
    refocusZoomButton.current = true
    setZoomed(false)
  }

  function handleAdd() {
    onAddToCart(card.id, quantity)
    setAdded({ quantity })
    setQuantity(1)
  }

  return (
    <article className={styles.card}>
      <div className={styles.imageWrap}>
        <img
          className={styles.image}
          src={card.image}
          alt={`${card.name}, ${setName} ${card.rarity}`}
          width="287"
          height="400"
          loading="lazy"
          decoding="async"
        />
        <button
          ref={zoomButtonRef}
          type="button"
          className={styles.magnify}
          onClick={() => setZoomed(true)}
          aria-label={`View ${card.name} close up`}
        >
          {/* A white edge under the dark lines keeps the icon visible on any card art */}
          <svg viewBox="0 0 24 24" width="30" height="30" fill="none" strokeLinecap="round" aria-hidden="true">
            <g stroke="var(--white)" strokeWidth="5.4">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M20 20l-4.8-4.8M10.5 7.5v6M7.5 10.5h6" />
            </g>
            <g stroke="currentColor" strokeWidth="2.6">
              <circle cx="10.5" cy="10.5" r="6.5" />
              <path d="M20 20l-4.8-4.8M10.5 7.5v6M7.5 10.5h6" />
            </g>
          </svg>
        </button>
      </div>
      <div className={styles.details}>
        <RarityBadge rarity={card.rarity} />
        <h2 className={styles.name}>{card.name}</h2>
        <p className={styles.meta}>
          {setName} · {card.number}
        </p>
      </div>
      <p className={styles.price}>{formatPrice(card.price)}</p>
      <QuantityStepper className={styles.stepper} quantity={quantity} onQuantityChange={setQuantity} itemName={card.name} />
      <button type="button" className={`${styles.add} ${added ? styles.added : ''}`} onClick={handleAdd}>
        {added ? (
          <>
            Added <span className={styles.addedExtra}>to cart</span> ✓
          </>
        ) : (
          'Add to cart'
        )}
      </button>
      <p role="status" className="visually-hidden">
        {added ? `Added ${added.quantity} × ${card.name} to your cart` : ''}
      </p>
      {zoomed && <CardZoom card={card} onClose={closeZoom} />}
    </article>
  )
}
