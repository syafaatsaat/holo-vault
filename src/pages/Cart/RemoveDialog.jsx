import { useId, useRef } from 'react'
import { useModalDialog } from '../../hooks/useModalDialog.js'
import { getSetName } from '../../lib/cards.js'
import styles from './Cart.module.css'

// Asks before a card leaves the cart. "Keep it" has focus first, so a stray
// Enter never removes anything; Escape or a click on the dimmed page also keeps
// the card.
export default function RemoveDialog({ line, onConfirm, onCancel }) {
  const keepRef = useRef(null)
  const dialogProps = useModalDialog(onCancel, keepRef)
  const titleId = useId()
  const textId = useId()
  const { card, quantity } = line

  return (
    <dialog {...dialogProps} className={styles.dialog} aria-labelledby={titleId} aria-describedby={textId}>
      <div className={styles.dialogBody}>
        <img className={styles.dialogImage} src={card.image} alt="" width="287" height="400" />
        <h2 id={titleId} className={styles.dialogTitle}>
          Remove {card.name}?
        </h2>
        <p id={textId} className={styles.dialogText}>
          {quantity === 1
            ? `This takes the ${getSetName(card.set)} card out of your cart.`
            : `This takes all ${quantity} copies out of your cart.`}
        </p>
        <div className={styles.dialogActions}>
          <button ref={keepRef} type="button" className={styles.keepButton} onClick={onCancel}>
            Keep it
          </button>
          <button type="button" className={styles.confirmButton} onClick={onConfirm}>
            Remove
          </button>
        </div>
      </div>
    </dialog>
  )
}
