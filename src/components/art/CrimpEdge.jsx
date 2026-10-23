import { useId } from 'react'
import styles from './CrimpEdge.module.css'

// One 20×16 tooth, repeated across the full width so teeth stay the same size
// on every screen (a stretched SVG would squash them on phones).
const TOOTH = {
  down: '0,0 20,0 10,16',
  up: '0,16 20,16 10,0',
}

function Teeth({ direction }) {
  const patternId = useId()
  return (
    <svg className={styles.teeth} aria-hidden="true">
      <defs>
        <pattern id={patternId} width="20" height="16" patternUnits="userSpaceOnUse">
          <polygon points={TOOTH[direction]} />
        </pattern>
      </defs>
      <rect width="100%" height="16" fill={`url(#${patternId})`} />
    </svg>
  )
}

// The crimped seal of a booster pack: a ridged band with a zigzag edge.
// "down" sits under a red band (teeth hanging down); "up" sits on top of the footer.
export function CrimpStrip({ direction = 'down' }) {
  return (
    <>
      {direction === 'up' && <Teeth direction="up" />}
      <div className={styles.band} />
      {direction === 'down' && <Teeth direction="down" />}
    </>
  )
}

export default function CrimpEdge({ direction = 'down', className = '' }) {
  return (
    <div className={`${styles.edge} ${styles[direction]} ${className}`} aria-hidden="true">
      <CrimpStrip direction={direction} />
    </div>
  )
}
