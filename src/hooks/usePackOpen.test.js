import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { usePackOpen } from './usePackOpen.js'

const originalMatchMedia = window.matchMedia
const originalObserver = window.IntersectionObserver

function renderWithSeal() {
  const seal = document.createElement('div')
  document.body.append(seal)
  return renderHook(() => usePackOpen({ current: seal }))
}

afterEach(() => {
  window.matchMedia = originalMatchMedia
  window.IntersectionObserver = originalObserver
  document.body.innerHTML = ''
})

describe('usePackOpen', () => {
  it('stays closed until the seal scrolls into view, then opens', () => {
    const { result } = renderWithSeal()
    expect(result.current).toBe(false)
    act(() => IntersectionObserver.instances[0].trigger(true))
    expect(result.current).toBe(true)
  })

  it('only plays once: it stops watching after opening', () => {
    const { result } = renderWithSeal()
    const observer = IntersectionObserver.instances[0]
    act(() => observer.trigger(true))
    expect(observer.elements.size).toBe(0)
    expect(result.current).toBe(true)
  })

  it('opens if the seal is already above the screen, e.g. arriving at /#about', () => {
    const { result } = renderWithSeal()
    const observer = IntersectionObserver.instances[0]
    const [seal] = observer.elements
    seal.getBoundingClientRect = () => ({ top: -400 })
    act(() => observer.trigger(false))
    expect(result.current).toBe(true)
  })

  it('stays closed while the seal is still below the screen', () => {
    const { result } = renderWithSeal()
    const observer = IntersectionObserver.instances[0]
    const [seal] = observer.elements
    seal.getBoundingClientRect = () => ({ top: 2000 })
    act(() => observer.trigger(false))
    expect(result.current).toBe(false)
  })

  it('opens straight away when the user prefers reduced motion', () => {
    window.matchMedia = (query) => ({ ...originalMatchMedia(query), matches: true })
    const { result } = renderWithSeal()
    expect(result.current).toBe(true)
  })

  it('opens straight away in browsers without IntersectionObserver', () => {
    delete window.IntersectionObserver
    const { result } = renderWithSeal()
    expect(result.current).toBe(true)
  })
})
