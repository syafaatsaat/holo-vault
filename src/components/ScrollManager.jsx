import { useEffect } from 'react'
import { useLocation } from 'react-router'

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// After each navigation: jump to the section named in the hash (/#about, /shop#visit),
// otherwise start the new page at the top. Keyed on location.key so clicking
// "Visit Us" again after scrolling away still works.
export default function ScrollManager() {
  const { pathname, hash, key } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) {
        target.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
        return
      }
    }
    window.scrollTo({ top: 0, left: 0 })
  }, [pathname, hash, key])

  return null
}
