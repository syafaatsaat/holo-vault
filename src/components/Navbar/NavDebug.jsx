import { useEffect, useRef, useState } from 'react'

// TEMPORARY: an on-screen log for tracking down the navbar jump in iOS Safari.
// Shown only with ?navdebug in the address. For 1.2s after each shrink or grow
// starts it logs every animation frame: time since the change, gap since the
// last frame, the --snug value, scroll position, and the window and visual
// viewport heights (which change while Safari's toolbar collapses).
export default function NavDebug({ headerRef, compact }) {
  const [lines, setLines] = useState([])
  const log = useRef([])
  const first = useRef(true)

  useEffect(() => {
    const push = (line) => {
      log.current = [...log.current.slice(-80), line]
      setLines(log.current)
    }
    const vv = window.visualViewport
    const size = () => `ih${window.innerHeight} vv${vv ? Math.round(vv.height) + '@' + Math.round(vv.offsetTop) : '-'}`
    const onResize = () => push(`  resize ${size()}`)
    const onVvResize = () => push(`  vv-resize ${size()}`)
    window.addEventListener('resize', onResize)
    vv?.addEventListener('resize', onVvResize)
    return () => {
      window.removeEventListener('resize', onResize)
      vv?.removeEventListener('resize', onVvResize)
    }
  }, [])

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    const start = performance.now()
    let last = start
    let frame
    const add = (line) => {
      log.current = [...log.current.slice(-80), line]
      setLines(log.current)
    }
    add(`${compact ? 'SHRINK' : 'GROW'} y${Math.round(window.scrollY)}`)
    const tick = (now) => {
      const snug = headerRef.current?.style.getPropertyValue('--snug') || '?'
      add(`${Math.round(now - start)} +${Math.round(now - last)} s${Number(snug).toFixed(2)} y${Math.round(window.scrollY)} ih${window.innerHeight} vv${Math.round(window.visualViewport?.height ?? 0)}`)
      last = now
      if (now - start < 1200) frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [compact, headerRef])

  const copy = () => navigator.clipboard?.writeText(log.current.join('\n'))
  const clear = () => {
    log.current = []
    setLines([])
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: 4,
        bottom: 90,
        zIndex: 100,
        width: 250,
        maxHeight: '45vh',
        overflow: 'auto',
        padding: 4,
        background: 'rgb(255 255 255 / 0.92)',
        border: '1px solid #000',
        font: '9px/1.25 ui-monospace, monospace',
        color: '#000',
        pointerEvents: 'auto',
      }}
    >
      <button type="button" onClick={copy}>Copy log</button> <button type="button" onClick={clear}>Clear</button>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{lines.join('\n')}</pre>
    </div>
  )
}
