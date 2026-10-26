import { useEffect, useId, useRef } from 'react'
import { getSetName } from '../../lib/cards.js'
import styles from './Cart.module.css'

// Asks before a card leaves the cart. A modal <dialog>, so the page behind is
// dimmed and can't be clicked or tabbed to. "Keep it" has focus first, so a
// stray Enter never removes anything; Escape or a click on the dimmed page
// also keeps the card.
export default function RemoveDialog({ line, onConfirm, onCancel }) {
  const dialogRef = useRef(null)
  const keepRef = useRef(null)
  const titleId = useId()
  const textId = useId()
  const { card, quantity } = line

  useEffect(() => {
    dialogRef.current.showModal()
    keepRef.current.focus()
  }, [])

  // The parent closes the dialog by unmounting it, so stop the browser closing
  // it on its own (Escape) and report a cancel instead
  function handleCancel(event) {
    event.preventDefault()
    onCancel()
  }

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby={titleId}
      aria-describedby={textId}
      onCancel={handleCancel}
      onKeyDown={(event) => event.key === 'Escape' && handleCancel(event)}
      // A click on the dimmed backdrop lands on the <dialog> itself
      onClick={(event) => event.target === event.currentTarget && onCancel()}
    >
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
