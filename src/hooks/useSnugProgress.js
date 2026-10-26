import { useEffect, useRef } from 'react'

// Longest step one frame may take. A CSS transition runs on the clock, so when
// iOS Safari stalls the page for a moment (its toolbar collapses on the same
// flick that shrinks the navbar) the transition jumps to wherever the clock
// says it should be. Capping each frame's step means a stall only pauses the
// animation, which then carries on from where it was.
const MAX_STEP_MS = 1000 / 30

// Material's standard easing, cubic-bezier(0.4, 0, 0.2, 1), solved for y at x.
function ease(x) {
  if (x <= 0) return 0
  if (x >= 1) return 1
  const bezier = (t, a, b) => 3 * a * t * (1 - t) ** 2 + 3 * b * t ** 2 * (1 - t) + t ** 3
  let lo = 0
  let hi = 1
  for (let i = 0; i < 20; i++) {
    const mid = (lo + hi) / 2
    if (bezier(mid, 0.4, 0.2) < x) lo = mid
    else hi = mid
  }
  return bezier((lo + hi) / 2, 0, 1)
}

// Animates the `--snug` custom property on `ref`'s element from 0 to 1 while
// `on` is true, and back to 0 when it turns false, over `duration` ms. If `on`
// flips halfway, it turns around from where it is. With reduced motion it
// jumps straight to the end.
export function useSnugProgress(ref, on, duration = 500) {
  const progress = useRef(on ? 1 : 0)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const target = on ? 1 : 0
    const set = () => element.style.setProperty('--snug', ease(progress.current).toFixed(4))

    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      progress.current = target
      set()
      return
    }

    set()
    let frame
    let last = null
    const step = (now) => {
      const elapsed = last === null ? 0 : Math.min(now - last, MAX_STEP_MS)
      last = now
      const change = elapsed / duration
      progress.current = target > progress.current
        ? Math.min(target, progress.current + change)
        : Math.max(target, progress.current - change)
      set()
      if (progress.current !== target) frame = requestAnimationFrame(step)
    }
    if (progress.current !== target) frame = requestAnimationFrame(step)
    return () => cancelAnimationFrame(frame)
  }, [ref, on, duration])
}
