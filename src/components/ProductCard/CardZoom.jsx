import { useId, useRef } from 'react'
import { useModalDialog } from '../../hooks/useModalDialog.js'
import { getLargeImage, getSetName } from '../../lib/cards.js'
import styles from './ProductCard.module.css'

// A close-up of one card. The sharper 800px image loads over the 400px one
// already on the page, so there's something to see straight away. Closes with
// the × button, Escape, or a click on the dimmed page.
export default function CardZoom({ card, onClose }) {
  const closeRef = useRef(null)
  const dialogProps = useModalDialog(onClose, closeRef)
  const titleId = useId()
  const setName = getSetName(card.set)

  return (
    <dialog {...dialogProps} className={styles.zoom} aria-labelledby={titleId}>
      <div className={styles.zoomBody}>
        <img
          className={styles.zoomImage}
          src={getLargeImage(card)}
          alt={`${card.name}, ${setName} ${card.rarity}`}
          width="573"
          height="800"
          style={{ backgroundImage: `url(${card.image})` }}
        />
        <div className={styles.zoomCaption}>
          <h2 id={titleId} className={styles.zoomTitle}>
            {card.name}
          </h2>
          <p className={styles.zoomMeta}>
            {setName} · {card.number}
          </p>
        </div>
        <button ref={closeRef} type="button" className={styles.zoomClose} onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </dialog>
  )
}
