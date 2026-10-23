import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// After each navigation: jump to the section named in the hash (/#about, /shop#visit),
// otherwise start the new page at the top. Keyed on location.key so clicking
// "Visit Us" again after scrolling away still works. Changes to the query string
// alone (the Shop's search, set and sort) leave the scroll position alone.
export default function ScrollManager() {
  const location = useLocation()
  const previous = useRef(null)

  useEffect(() => {
    const { pathname, hash, search } = location
    const before = previous.current
    previous.current = location
    if (before && before.pathname === pathname && before.hash === hash && before.search !== search) return

    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [location])

  return null
}
