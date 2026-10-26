import { renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useSnugProgress } from './useSnugProgress.js'

// Hands-on animation frames: each `runFrame(ms)` moves the clock on by `ms`
// and runs whatever frame callback is waiting.
let pending
let now
function runFrame(ms) {
  now += ms
  const callback = pending
  pending = null
  callback?.(now)
}

let element
const snug = () => Number(element.style.getPropertyValue('--snug'))

beforeEach(() => {
  pending = null
  now = 0
  vi.stubGlobal('requestAnimationFrame', (callback) => {
    pending = callback
    return 1
  })
  vi.stubGlobal('cancelAnimationFrame', () => {
    pending = null
  })
  element = document.createElement('header')
})

afterEach(() => {
  vi.unstubAllGlobals()
})

function render(on) {
  const ref = { current: element }
  return renderHook(({ on }) => useSnugProgress(ref, on, 500), { initialProps: { on } })
}

describe('useSnugProgress', () => {
  it('starts at the end matching the state, without animating', () => {
    render(false)
    expect(snug()).toBe(0)
    render(true)
    expect(snug()).toBe(1)
    expect(pending).toBeNull()
  })

  it('eases from 0 to 1 over the duration', () => {
    const { rerender } = render(false)
    rerender({ on: true })
    runFrame(16) // the first frame only notes the time
    for (let i = 0; i < 15; i++) runFrame(16)
    expect(snug()).toBeGreaterThan(0.3)
    expect(snug()).toBeLessThan(1)
    for (let i = 0; i < 20; i++) runFrame(16)
    expect(snug()).toBe(1)
    expect(pending).toBeNull()
  })

  it('only pauses through a stall instead of skipping ahead', () => {
    const { rerender } = render(false)
    rerender({ on: true })
    runFrame(16)
    runFrame(16)
    const before = snug()
    runFrame(2000) // the page froze for two seconds
    expect(snug()).toBeLessThan(0.1)
    expect(snug()).toBeGreaterThan(before)
  })

  it('turns around from where it is when the state flips halfway', () => {
    const { rerender } = render(false)
    rerender({ on: true })
    for (let i = 0; i < 16; i++) runFrame(16)
    const halfway = snug()
    rerender({ on: false })
    runFrame(16)
    runFrame(16)
    expect(snug()).toBeLessThan(halfway)
    expect(snug()).toBeGreaterThan(0)
  })

  it('jumps straight to the end with reduced motion', () => {
    vi.stubGlobal('matchMedia', (query) => ({ matches: query.includes('reduce') }))
    const { rerender } = render(false)
    rerender({ on: true })
    expect(snug()).toBe(1)
    expect(pending).toBeNull()
  })
})
