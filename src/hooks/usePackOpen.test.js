import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { usePackOpen } from './usePackOpen.js'

const originalMatchMedia = window.matchMedia

// jsdom has no layout, so tell the hook where the seal is on screen.
function renderWithSealAt(top) {
  const seal = document.createElement('div')
  seal.getBoundingClientRect = () => ({ top })
  document.body.append(seal)
  const hook = renderHook(() => usePackOpen({ current: seal }))
  return { ...hook, moveSealTo: (newTop) => (seal.getBoundingClientRect = () => ({ top: newTop })) }
}

function scroll() {
  window.dispatchEvent(new Event('scroll'))
}

afterEach(() => {
  window.matchMedia = originalMatchMedia
  document.body.innerHTML = ''
  vi.useRealTimers()
})

describe('usePackOpen', () => {
  // jsdom's window is 768px tall, so the seal opens the pack once its top is above ~653px.
  it('stays closed while the seal is below the screen', () => {
    const { result } = renderWithSealAt(2000)
    act(() => scroll())
    expect(result.current).toBe(false)
  })

  it('opens once the seal scrolls a little way up the screen', () => {
    const { result, moveSealTo } = renderWithSealAt(2000)
    moveSealTo(500)
    act(() => scroll())
    expect(result.current).toBe(true)
  })

  it('opens when the page jumps straight past the seal', () => {
    const { result, moveSealTo } = renderWithSealAt(2000)
    moveSealTo(-1500)
    act(() => scroll())
    expect(result.current).toBe(true)
  })

  it('opens without any scrolling if the seal is already in view on load', async () => {
    const { result } = renderWithSealAt(300)
    await act(() => new Promise((resolve) => requestAnimationFrame(resolve)))
    expect(result.current).toBe(true)
  })

  it('stays open after scrolling back up: it only plays once', () => {
    const { result, moveSealTo } = renderWithSealAt(2000)
    moveSealTo(400)
    act(() => scroll())
    moveSealTo(2000)
    act(() => scroll())
    expect(result.current).toBe(true)
  })

  it('opens straight away when the user prefers reduced motion', () => {
    window.matchMedia = (query) => ({ ...originalMatchMedia(query), matches: true })
    const { result } = renderWithSealAt(2000)
    expect(result.current).toBe(true)
  })
})
