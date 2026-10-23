import { CrimpStrip } from './CrimpEdge.jsx'
import styles from './PackSeal.module.css'

const SLICES = 60

// The seal at the bottom of the home page's pack. While closed it looks like a
// normal crimped edge. When `open` turns true it peels away like foil: the strip
// is cut into thin slices, each showing its own window onto the full strip and
// curling a moment after its left neighbour (timing lives in the CSS).
export default function PackSeal({ open = false }) {
  return (
    <div className={`${styles.seal} ${open ? styles.open : ''}`} aria-hidden="true">
      <div className={styles.strip} style={{ '--slices': SLICES }}>
        {Array.from({ length: SLICES }, (_, i) => (
          <div key={i} className={styles.slice} style={{ '--i': i }}>
            <div className={styles.window}>
              <CrimpStrip direction="down" />
            </div>
          </div>
        ))}
      </div>
      <span className={styles.label}>
        <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          <circle cx="6" cy="6" r="3" />
          <circle cx="6" cy="18" r="3" />
          <path d="M20 4L8.1 15.9M14.5 14.5L20 20M8.1 8.1L12 12" />
        </svg>
        Tear here
      </span>
    </div>
  )
}
