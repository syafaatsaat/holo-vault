import { useEffect, useState } from 'react'
import { getSetName } from '../../lib/cards.js'
import { formatPrice } from '../../lib/format.js'
import QuantityStepper from '../QuantityStepper/QuantityStepper.jsx'
import RarityBadge from '../RarityBadge/RarityBadge.jsx'
import styles from './ProductCard.module.css'

const ADDED_MESSAGE_MS = 1200

export default function ProductCard({ card, onAddToCart }) {
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(null)
  const setName = getSetName(card.set)

  // Turn "Added to cart" back into the normal button after a moment.
  useEffect(() => {
    if (!added) return
    const timer = setTimeout(() => setAdded(null), ADDED_MESSAGE_MS)
    return () => clearTimeout(timer)
  }, [added])

  function handleAdd() {
    onAddToCart(card.id, quantity)
    setAdded({ quantity })
    setQuantity(1)
  }

  return (
    <article className={styles.card}>
      <img
        className={styles.image}
        src={card.image}
        alt={`${card.name}, ${setName} ${card.rarity}`}
        width="287"
        height="400"
        loading="lazy"
        decoding="async"
      />
      <div className={styles.details}>
        <RarityBadge rarity={card.rarity} />
        <h2 className={styles.name}>{card.name}</h2>
        <p className={styles.meta}>
          {setName} · {card.number}
        </p>
      </div>
      <p className={styles.price}>{formatPrice(card.price)}</p>
      <QuantityStepper quantity={quantity} onQuantityChange={setQuantity} itemName={card.name} />
      <button type="button" className={`${styles.add} ${added ? styles.added : ''}`} onClick={handleAdd}>
        {added ? 'Added to cart ✓' : 'Add to cart'}
      </button>
      <p role="status" className="visually-hidden">
        {added ? `Added ${added.quantity} × ${card.name} to your cart` : ''}
      </p>
    </article>
  )
}
