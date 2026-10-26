import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import PokeBall from '../art/PokeBall.jsx'
import styles from './PokeTrail.module.css'

// Distance the mouse travels between balls, and how many can be on screen at once
const SPACING = 56
const MAX_BALLS = 20
// Mostly red tops, with the brand's yellow and blue mixed in
const TOPS = ['var(--red)', 'var(--yellow)', 'var(--red)', 'var(--blue)']

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// A trail of Poké Balls that follows the mouse across the dotted background.
// Each ball is placed inside the `.dotted` section under the cursor, layered just
// above its dots and behind everything else in it, so the trail slips under
// cards, text and buttons. Each ball pops in, spins and fades, then removes
// itself. Touch and pen input don't leave a trail, and neither does anything for
// users who prefer reduced motion.
export default function PokeTrail() {
  const [balls, setBalls] = useState([])

  useEffect(() => {
    if (prefersReducedMotion()) return

    let last = null
    let nextId = 0
    const onMove = (event) => {
      const host = event.pointerType === 'mouse' && event.target.closest?.('.dotted')
      if (!host) {
        last = null
        return
      }
      const x = event.clientX
      const y = event.clientY
      if (last && Math.hypot(x - last.x, y - last.y) < SPACING) return
      last = { x, y }

      // Position within the section, which may itself be moving (Top cards drops in)
      const box = host.getBoundingClientRect()
      const id = nextId++
      const ball = {
        id,
        host,
        x: x - box.left,
        y: y - box.top,
        top: TOPS[id % TOPS.length],
        spin: Math.round(Math.random() * 240 - 120),
      }
      setBalls((current) => [...current.slice(1 - MAX_BALLS), ball])
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  const remove = (id) => setBalls((current) => current.filter((ball) => ball.id !== id))

  // A section that unmounted (after navigating away) takes its balls with it
  return balls
    .filter((ball) => ball.host.isConnected)
    .map((ball) =>
      createPortal(
        <span
          aria-hidden="true"
          className={styles.ball}
          style={{ left: ball.x, top: ball.y, '--spin': `${ball.spin}deg` }}
          onAnimationEnd={() => remove(ball.id)}
        >
          <PokeBall top={ball.top} />
        </span>,
        ball.host,
        ball.id,
      ),
    )
}
