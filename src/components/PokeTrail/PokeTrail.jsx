import { useEffect, useState } from 'react'
import PokeBall from '../art/PokeBall.jsx'
import styles from './PokeTrail.module.css'

// Distance the mouse travels between balls, and how many can be on screen at once
const SPACING = 32
const MAX_BALLS = 40
// Mostly red tops, with the brand's yellow and blue mixed in
const TOPS = ['var(--red)', 'var(--yellow)', 'var(--red)', 'var(--blue)']

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// A trail of Poké Balls that follows the mouse across the dotted background.
// The balls share one layer just above the page's dot grid and behind everything
// else, so the trail slips under cards, text and buttons and crosses from one
// section to the next without being cut off. Each ball pops in, spins and fades,
// then removes itself. Touch and pen input don't leave a trail, and neither does
// anything for users who prefer reduced motion.
export default function PokeTrail() {
  const [balls, setBalls] = useState([])

  useEffect(() => {
    if (prefersReducedMotion()) return

    let last = null
    let nextId = 0
    const onMove = (event) => {
      if (event.pointerType !== 'mouse' || !event.target.closest?.('.dotted')) {
        last = null
        return
      }
      const x = event.clientX
      const y = event.clientY
      if (last && Math.hypot(x - last.x, y - last.y) < SPACING) return
      last = { x, y }

      const id = nextId++
      const ball = { id, x, y, top: TOPS[id % TOPS.length], spin: Math.round(Math.random() * 240 - 120) }
      setBalls((current) => [...current.slice(1 - MAX_BALLS), ball])
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  const remove = (id) => setBalls((current) => current.filter((ball) => ball.id !== id))

  return (
    <div className={styles.trail} aria-hidden="true">
      {balls.map((ball) => (
        <span
          key={ball.id}
          className={styles.ball}
          style={{ left: ball.x, top: ball.y, '--spin': `${ball.spin}deg` }}
          onAnimationEnd={() => remove(ball.id)}
        >
          <PokeBall top={ball.top} />
        </span>
      ))}
    </div>
  )
}
