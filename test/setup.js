// Runs before every test file. Adds jest-dom's matchers (toBeInTheDocument, ...),
// resets the DOM and storage between tests, and stands in for browser features
// jsdom doesn't implement but the app uses.
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Minimal IntersectionObserver for the pack-opening hook. Nothing intersects on
// its own; a test can call `IntersectionObserver.instances[0].trigger()` to
// simulate an element scrolling into view.
class MockIntersectionObserver {
  static instances = []

  constructor(callback, options = {}) {
    this.callback = callback
    this.options = options
    this.elements = new Set()
    MockIntersectionObserver.instances.push(this)
  }

  observe(element) {
    this.elements.add(element)
  }

  unobserve(element) {
    this.elements.delete(element)
  }

  disconnect() {
    this.elements.clear()
  }

  takeRecords() {
    return []
  }

  trigger(isIntersecting = true) {
    const entries = [...this.elements].map((target) => ({
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
      boundingClientRect: target.getBoundingClientRect(),
    }))
    this.callback(entries, this)
  }
}

window.IntersectionObserver = MockIntersectionObserver

// matchMedia always reports "no match", so tests run the full-motion path
// unless a test overrides it.
window.matchMedia = (query) => ({
  matches: false,
  media: query,
  onchange: null,
  addEventListener() {},
  removeEventListener() {},
  addListener() {},
  removeListener() {},
  dispatchEvent() {
    return false
  },
})

window.scrollTo = () => {}
Element.prototype.scrollIntoView = function scrollIntoView() {}

afterEach(() => {
  cleanup()
  localStorage.clear()
  MockIntersectionObserver.instances = []
})
