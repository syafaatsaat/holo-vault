import { useEffect, useState } from 'react'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// Opens the home page's pack once, the first time its seal scrolls into view.
// Also opens straight away if the seal is already above the screen (e.g. the
// page was opened at /#about), if the user prefers reduced motion, or if the
// browser has no IntersectionObserver, so the content is never left hidden.
export function usePackOpen(sealRef) {
  const [open, setOpen] = useState(
    () => prefersReducedMotion() || typeof window.IntersectionObserver === 'undefined',
  )

  useEffect(() => {
    const seal = sealRef.current
    if (open || !seal) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting || entry.boundingClientRect.top < 0) {
          setOpen(true)
          observer.disconnect()
        }
      },
      // Wait until the seal is a little way up the screen, not just peeking in.
      { rootMargin: '0px 0px -15% 0px' },
    )
    observer.observe(seal)
    return () => observer.disconnect()
  }, [open, sealRef])

  return open
}
