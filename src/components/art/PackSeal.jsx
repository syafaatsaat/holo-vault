import { CrimpStrip } from './CrimpEdge.jsx'
import styles from './PackSeal.module.css'

// The seal at the bottom of the home page's pack. While closed it looks like a
// normal crimped edge. When `open` turns true the whole strip slides off to the
// left, opening the pack.
export default function PackSeal({ open = false }) {
  return (
    <div className={`${styles.seal} ${open ? styles.open : ''}`} aria-hidden="true">
      <div className={styles.strip}>
        <CrimpStrip direction="down" />
        <span className={styles.label}>
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <circle cx="6" cy="6" r="3" />
            <circle cx="6" cy="18" r="3" />
            <path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12" />
          </svg>
          Tear here
        </span>
      </div>
    </div>
  )
}
