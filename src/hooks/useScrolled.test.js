import { act, renderHook } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { useScrolled } from './useScrolled.js'

function scrollPageTo(y) {
  window.scrollY = y
  window.dispatchEvent(new Event('scroll'))
}

afterEach(() => {
  window.scrollY = 0
})

describe('useScrolled', () => {
  it('is false at the top of the page', () => {
    const { result } = renderHook(() => useScrolled())
    expect(result.current).toBe(false)
  })

  it('turns true past the threshold and false again back at the top', () => {
    const { result } = renderHook(() => useScrolled(40))
    act(() => scrollPageTo(41))
    expect(result.current).toBe(true)
    act(() => scrollPageTo(0))
    expect(result.current).toBe(false)
  })

  it('stays put between the reset point and the threshold, so it never flickers', () => {
    const { result } = renderHook(() => useScrolled(40, 8))
    act(() => scrollPageTo(30))
    expect(result.current).toBe(false)
    act(() => scrollPageTo(41))
    expect(result.current).toBe(true)
    act(() => scrollPageTo(30))
    expect(result.current).toBe(true)
    act(() => scrollPageTo(41))
    act(() => scrollPageTo(9))
    expect(result.current).toBe(true)
    act(() => scrollPageTo(8))
    expect(result.current).toBe(false)
  })

  it('treats the bounce above the top (a negative scroll) as the top', () => {
    const { result } = renderHook(() => useScrolled())
    act(() => scrollPageTo(200))
    act(() => scrollPageTo(-30))
    expect(result.current).toBe(false)
  })

  it('starts true if the page is already scrolled, e.g. after a refresh', () => {
    window.scrollY = 500
    const { result } = renderHook(() => useScrolled())
    expect(result.current).toBe(true)
  })
})
