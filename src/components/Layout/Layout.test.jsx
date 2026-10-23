import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '../../../test/renderRoute.jsx'
import { saveCart } from '../../cart/storage.js'
import { pikachu, umbreon } from '../../cart/testCards.js'

const mainNav = () => screen.getByRole('navigation', { name: 'Main' })

afterEach(() => {
  vi.restoreAllMocks()
})

describe('pages', () => {
  it.each([
    ['/', 'Welcome to Holo Vault', 'Holo Vault · Pokémon TCG singles at market price'],
    ['/shop', 'Shop the vault', 'Shop · Holo Vault'],
    ['/cart', 'Your cart', 'Cart · Holo Vault'],
  ])('%s shows its page with the shared navbar, Visit Us and footer', (path, heading, title) => {
    renderRoute(path)
    expect(screen.getByRole('heading', { level: 1, name: heading })).toBeInTheDocument()
    expect(document.title).toBe(title)
    expect(mainNav()).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'See the cards in person' })).toBeInTheDocument()
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('shows a not-found page with a way back for an unknown address', () => {
    renderRoute('/pokedex')
    expect(screen.getByRole('heading', { level: 1, name: 'This page got away' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Browse the shop' })).toHaveAttribute('href', '/shop')
    expect(mainNav()).toBeInTheDocument()
  })
})

describe('navbar', () => {
  it('links to Home, Shop, About, Visit Us and Cart', () => {
    renderRoute('/shop')
    const nav = within(mainNav())
    expect(nav.getByRole('link', { name: 'Holo Vault home' })).toHaveAttribute('href', '/')
    expect(nav.getByRole('link', { name: 'Shop' })).toHaveAttribute('href', '/shop')
    expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about')
    expect(nav.getByRole('link', { name: /^Cart/ })).toHaveAttribute('href', '/cart')
  })

  it('keeps Visit Us on the current page, since every page has that section', () => {
    renderRoute('/cart')
    expect(within(mainNav()).getByRole('link', { name: 'Visit Us' })).toHaveAttribute('href', '/cart#visit')
  })

  it('shows how many cards are in the cart', () => {
    saveCart([
      { id: umbreon.id, quantity: 1 },
      { id: pikachu.id, quantity: 2 },
    ])
    renderRoute('/')
    expect(within(mainNav()).getByRole('link', { name: 'Cart, 3 items' })).toBeInTheDocument()
  })

  it('uses "item" for a single card', () => {
    saveCart([{ id: umbreon.id, quantity: 1 }])
    renderRoute('/')
    expect(within(mainNav()).getByRole('link', { name: 'Cart, 1 item' })).toBeInTheDocument()
  })
})

describe('scrolling', () => {
  it('opens the home page at the About section for /#about', () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    renderRoute('/#about')
    const about = screen.getByRole('region', { name: 'A card shop built for collectors' })
    expect(scrollIntoView.mock.contexts).toContain(about)
  })

  it('scrolls to Visit Us when its link is clicked', async () => {
    const scrollIntoView = vi.spyOn(Element.prototype, 'scrollIntoView')
    const user = userEvent.setup()
    renderRoute('/shop')
    await user.click(within(mainNav()).getByRole('link', { name: 'Visit Us' }))
    const visit = screen.getByRole('region', { name: 'See the cards in person' })
    expect(scrollIntoView.mock.contexts).toContain(visit)
  })

  it('starts a newly opened page at the top', async () => {
    const scrollTo = vi.spyOn(window, 'scrollTo')
    const user = userEvent.setup()
    renderRoute('/')
    scrollTo.mockClear()
    await user.click(within(mainNav()).getByRole('link', { name: 'Shop' }))
    expect(screen.getByRole('heading', { level: 1, name: 'Shop the vault' })).toBeInTheDocument()
    expect(scrollTo).toHaveBeenCalledWith({ top: 0, left: 0 })
  })
})

describe('skip link', () => {
  it('lets keyboard users jump past the navbar to the page content', () => {
    renderRoute('/shop')
    expect(screen.getByRole('link', { name: 'Skip to content' })).toHaveAttribute('href', '#main')
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main')
  })
})
