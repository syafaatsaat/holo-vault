import QuantityStepper from '../../components/QuantityStepper/QuantityStepper.jsx'
import RarityBadge from '../../components/RarityBadge/RarityBadge.jsx'
import { getSetName } from '../../lib/cards.js'
import { formatPrice } from '../../lib/format.js'
import styles from './Cart.module.css'

export default function CartRow({ line, onQuantityChange, onRemove, removeButtonRef }) {
  const { card, quantity, lineTotal } = line
  const setName = getSetName(card.set)

  return (
    <li className={styles.row}>
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
        <p className={styles.meta}>{formatPrice(card.price)} each</p>
      </div>
      <div className={styles.controls}>
        <p className={styles.lineTotal}>
          <span className="visually-hidden">Total for {card.name}: </span>
          {formatPrice(lineTotal)}
        </p>
        <QuantityStepper
          className={styles.stepper}
          quantity={quantity}
          onQuantityChange={onQuantityChange}
          itemName={card.name}
        />
        <button
          ref={removeButtonRef}
          type="button"
          className={styles.remove}
          onClick={onRemove}
          aria-label={`Remove ${card.name} from cart`}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
          </svg>
          Remove
        </button>
      </div>
    </li>
  )
}
