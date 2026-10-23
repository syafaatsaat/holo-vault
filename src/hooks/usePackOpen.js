import { useEffect, useState } from 'react'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Opens the home page's pack once, as soon as its seal is a little way up the
// screen or already scrolled past. Checking the seal's position on scroll (rather
// than waiting for it to "intersect") also catches jumps straight past it, such
// as the End key, a fast scrollbar drag or Back restoring the scroll position.
// Users who prefer reduced motion get it open from the start.
export function usePackOpen(sealRef) {
  const [open, setOpen] = useState(prefersReducedMotion)

  useEffect(() => {
    const seal = sealRef.current
    if (open || !seal) return

    const check = () => {
      if (seal.getBoundingClientRect().top < window.innerHeight * 0.85) setOpen(true)
    }
    // The page may already be scrolled (e.g. after a refresh), so check once up front.
    const frame = requestAnimationFrame(check)
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', check)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', check)
    }
  }, [open, sealRef])

  return open
}
