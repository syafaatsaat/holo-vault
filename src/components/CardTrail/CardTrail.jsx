import { useEffect, useState } from 'react'
import { CARDS } from '../../lib/cards.js'
import styles from './CardTrail.module.css'

// Distance the mouse travels between cards, and how many can be on screen at once
const SPACING = 96
const MAX_CARDS = 40
// How many different cards one visit's trail draws from. They're fetched up
// front, so a card never pops up blank while its image is still loading.
const POOL_SIZE = 24

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

function pickRandom(items, count) {
  const shuffled = [...items]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled.slice(0, count)
}

// A trail of random cards from the shop that follows the mouse across the
// dotted background. The cards share one layer just above the page's dot grid
// and behind everything else, so the trail slips under cards, text and buttons
// and crosses from one section to the next without being cut off. Each card
// pops in, then tilts and fades at full size before removing itself. Touch and
// pen input don't leave a trail, and neither does anything for users who
// prefer reduced motion.
export default function CardTrail() {
  const [trail, setTrail] = useState([])

  useEffect(() => {
    if (prefersReducedMotion()) return

    const pool = pickRandom(CARDS, POOL_SIZE)
    pool.forEach((card) => {
      new Image().src = card.image
    })

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

      const card = pool[Math.floor(Math.random() * pool.length)]
      const item = { id: nextId++, x, y, image: card.image, tilt: Math.round(Math.random() * 50 - 25) }
      setTrail((current) => [...current.slice(1 - MAX_CARDS), item])
    }

    document.addEventListener('pointermove', onMove, { passive: true })
    return () => document.removeEventListener('pointermove', onMove)
  }, [])

  const remove = (id) => setTrail((current) => current.filter((item) => item.id !== id))

  return (
    <div className={styles.trail} aria-hidden="true">
      {trail.map((item) => (
        <img
          key={item.id}
          src={item.image}
          alt=""
          className={styles.card}
          style={{ left: item.x, top: item.y, '--tilt': `${item.tilt}deg` }}
          onAnimationEnd={() => remove(item.id)}
        />
      ))}
    </div>
  )
}
