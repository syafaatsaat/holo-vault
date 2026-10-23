import { Link } from 'react-router'
import { formatPrice } from '../../lib/format.js'
import styles from './Cart.module.css'

// A small Poké Ball panel: red top, dark band with a centre button, white bottom.
export default function CartSummary({ itemCount, subtotal }) {
  return (
    <aside className={styles.summary} aria-labelledby="summary-title">
      <div className={styles.summaryTop}>
        <h2 id="summary-title" className={styles.summaryTitle}>
          Summary
        </h2>
      </div>
      <div className={styles.summaryBand} aria-hidden="true">
        <span />
      </div>
      <dl className={styles.summaryBody}>
        <div className={styles.summaryLine}>
          <dt>Items</dt>
          <dd>{itemCount}</dd>
        </div>
        <div className={`${styles.summaryLine} ${styles.subtotal}`}>
          <dt>Subtotal</dt>
          <dd>{formatPrice(subtotal)}</dd>
        </div>
      </dl>
      <div className={styles.summaryFooter}>
        <p className={styles.note}>Checkout isn&apos;t part of this demo store.</p>
        <Link to="/shop" className={styles.secondaryButton}>
          Continue shopping
        </Link>
      </div>
    </aside>
  )
}
