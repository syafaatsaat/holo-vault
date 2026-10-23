import { Link } from 'react-router'
import PackLogo from '../../components/art/PackLogo.jsx'
import styles from './Cart.module.css'

export default function EmptyCart({ linkRef }) {
  return (
    <div className={styles.empty}>
      <PackLogo className={styles.emptyPack} strokeWidth={3} />
      <h2 className={styles.emptyTitle}>Your pack is empty</h2>
      <p className={styles.emptyText}>No cards caught yet. Head to the shop to find one.</p>
      <Link ref={linkRef} to="/shop" className={styles.primaryButton}>
        Go to the shop
      </Link>
    </div>
  )
}
