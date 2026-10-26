import { useEffect, useState } from 'react'

// True once the page has scrolled past `threshold` pixels, and false again only
// when it's back within `resetAt` pixels of the top. The gap between the two
// stops the state flickering while the page hovers near the threshold (a slow
// drag, the end of a flick, or iOS's bounce at the top), which would restart
// the navbar's shrink and grow animations halfway through.
export function useScrolled(threshold = 40, resetAt = 8) {
  const [scrolled, setScrolled] = useState(() => window.scrollY > threshold)

  useEffect(() => {
    const update = () => {
      const y = window.scrollY
      setScrolled((was) => (was ? y > resetAt : y > threshold))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    return () => window.removeEventListener('scroll', update)
  }, [threshold, resetAt])

  return scrolled
}
