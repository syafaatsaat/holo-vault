import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../../test/renderRoute.jsx'

// The burger and its menu are shown on phones only (CSS), but the behaviour
// is the same at every size, so it can be tested here.
const nav = () => within(screen.getByRole('navigation', { name: 'Main' }))
const burger = () => nav().getByRole('button', { name: 'Menu' })

describe('phone menu', () => {
  it('starts closed and controls the list of page links', () => {
    renderRoute('/shop')
    expect(burger()).toHaveAttribute('aria-expanded', 'false')
    const menu = document.getElementById(burger().getAttribute('aria-controls'))
    expect(within(menu).getAllByRole('link').map((link) => link.textContent)).toEqual(['Shop', 'About', 'Visit Us'])
  })

  it('opens and closes with the burger button', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    await user.click(burger())
    expect(burger()).toHaveAttribute('aria-expanded', 'true')
    await user.click(burger())
    expect(burger()).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes when a link in it is followed', async () => {
    const user = userEvent.setup()
    renderRoute('/')
    await user.click(burger())
    await user.click(nav().getByRole('link', { name: 'Shop' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Shop the vault.' })).toBeInTheDocument()
    expect(burger()).toHaveAttribute('aria-expanded', 'false')
  })

  it('closes on Escape and puts focus back on the burger', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    await user.click(burger())
    await user.keyboard('{Escape}')
    expect(burger()).toHaveAttribute('aria-expanded', 'false')
    expect(burger()).toHaveFocus()
  })

  it('closes when the user taps outside the navbar', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    await user.click(burger())
    await user.click(screen.getByRole('heading', { level: 1 }))
    expect(burger()).toHaveAttribute('aria-expanded', 'false')
  })

  it('stays open when tapping inside the navbar but not on a link', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    await user.click(burger())
    await user.click(screen.getByRole('navigation', { name: 'Main' }))
    expect(burger()).toHaveAttribute('aria-expanded', 'true')
  })
})
