import { Link } from 'react-router'
import PageBand from '../../components/PageBand/PageBand.jsx'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <>
      <title>Page not found · Holo Vault</title>
      <PageBand title="This page" highlight="got away.">
        We couldn&apos;t find the page you were looking for.
      </PageBand>
      <div className="dotted page-content">
        <div className={styles.actions}>
          <Link to="/shop" className={`${styles.button} ${styles.primary}`}>
            Browse the shop
          </Link>
          <Link to="/" className={styles.button}>
            Go back home
          </Link>
        </div>
      </div>
    </>
  )
}
