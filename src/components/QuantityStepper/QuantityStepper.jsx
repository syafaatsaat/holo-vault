import { useState } from 'react'
import { MAX_QUANTITY, MIN_QUANTITY, clampQuantity, sanitizeQuantityInput } from '../../lib/format.js'
import styles from './QuantityStepper.module.css'

// −/number/+ control. The parent owns the quantity; while the user is typing,
// the field shows their text (which may be blank) and reports each valid number.
// Leaving the field blank or at 0 snaps it back to 1.
export default function QuantityStepper({ quantity, onQuantityChange, itemName, className = '' }) {
  const [draft, setDraft] = useState(null)

  function handleInput(event) {
    const text = sanitizeQuantityInput(event.target.value)
    setDraft(text)
    if (text !== '') onQuantityChange(clampQuantity(text))
  }

  function handleBlur() {
    if (draft === '') onQuantityChange(MIN_QUANTITY)
    setDraft(null)
  }

  function step(change) {
    setDraft(null)
    onQuantityChange(clampQuantity(quantity + change))
  }

  return (
    <div className={`${styles.stepper} ${className}`}>
      <button
        type="button"
        className={styles.button}
        onClick={() => step(-1)}
        disabled={quantity <= MIN_QUANTITY}
        aria-label={`Decrease quantity of ${itemName}`}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
          <path d="M5 12h14" />
        </svg>
      </button>
      <input
        type="text"
        inputMode="numeric"
        autoComplete="off"
        className={styles.input}
        value={draft ?? String(quantity)}
        onChange={handleInput}
        onBlur={handleBlur}
        aria-label={`Quantity of ${itemName}`}
      />
      <button
        type="button"
        className={styles.button}
        onClick={() => step(1)}
        disabled={quantity >= MAX_QUANTITY}
        aria-label={`Increase quantity of ${itemName}`}
      >
        <svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}
