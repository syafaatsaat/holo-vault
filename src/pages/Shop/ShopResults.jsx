import { useState } from 'react'
import { useCart } from '../../cart/useCart.js'
import PokeBall from '../../components/art/PokeBall.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import styles from './Shop.module.css'

const PAGE_SIZE = 24

export default function ShopResults({ cards, onReset }) {
  const { addToCart } = useCart()
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  if (cards.length === 0) {
    return (
      <div className={styles.empty}>
        <PokeBall className={styles.emptyBall} />
        <h2 className={styles.emptyTitle}>No cards caught</h2>
        <p className={styles.emptyText}>Nothing matches your search. Check the spelling or try another set.</p>
        <button type="button" className={styles.primaryButton} onClick={onReset}>
          Clear search and filters
        </button>
      </div>
    )
  }

  const shown = cards.slice(0, visibleCount)
  const remaining = cards.length - shown.length
  const nextBatch = Math.min(PAGE_SIZE, remaining)

  return (
    <>
      <ul className={styles.grid} aria-label="Cards">
        {shown.map((card) => (
          <li key={card.id}>
            <ProductCard card={card} onAddToCart={addToCart} />
          </li>
        ))}
      </ul>
      <div className={styles.more}>
        <p className={styles.shownCount}>
          Showing {shown.length} of {cards.length}
        </p>
        {remaining > 0 && (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
          >
            Show {nextBatch} more {nextBatch === 1 ? 'card' : 'cards'}
          </button>
        )}
      </div>
    </>
  )
}
