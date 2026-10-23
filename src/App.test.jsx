import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import App from './App.jsx'

// Smoke test for the test setup. Replaced by real page tests from Phase 4.
describe('test setup', () => {
  it('renders a component and finds it by role', () => {
    render(<App />)
    expect(screen.getByRole('heading', { name: 'Holo Vault' })).toBeInTheDocument()
  })

  it('provides the browser stand-ins the app relies on', () => {
    const observer = new IntersectionObserver(() => {})
    expect(IntersectionObserver.instances).toContain(observer)
    expect(window.matchMedia('(prefers-reduced-motion: reduce)').matches).toBe(false)
  })

  it('starts each test with empty localStorage', () => {
    expect(localStorage.length).toBe(0)
    localStorage.setItem('holo-vault-cart', '{}')
  })

  it('still has empty localStorage after the previous test wrote to it', () => {
    expect(localStorage.length).toBe(0)
  })

  it('can drive user events', async () => {
    const user = userEvent.setup()
    render(<input aria-label="Search cards" />)
    await user.type(screen.getByLabelText('Search cards'), 'pika')
    expect(screen.getByLabelText('Search cards')).toHaveValue('pika')
  })
})
