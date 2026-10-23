import { act, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '../../../test/renderRoute.jsx'
import { CARDS, SETS, countCardsInSet, getTopCards } from '../../lib/cards.js'
import { formatPrice } from '../../lib/format.js'

const originalMatchMedia = window.matchMedia
const topCardsSection = () => screen.getByRole('region', { name: 'Top cards in the vault' })
const topCardItems = () => within(within(topCardsSection()).getByRole('list')).getAllByRole('listitem')

afterEach(() => {
  window.matchMedia = originalMatchMedia
  vi.restoreAllMocks()
})

describe('Home page', () => {
  it('welcomes visitors, with the wordmark read out as plain words', () => {
    renderRoute('/')
    expect(screen.getByRole('heading', { level: 1, name: 'Welcome to Holo Vault' })).toBeInTheDocument()
    expect(document.title).toBe('Holo Vault · Pokémon TCG singles at market price')
  })

  it('invites visitors to shop or jump to the top cards', () => {
    renderRoute('/')
    expect(screen.getByRole('heading', { level: 2, name: 'Catch the cards you chased.' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Start shopping' })).toHaveAttribute('href', '/shop')
    expect(screen.getByRole('link', { name: 'See top cards' })).toHaveAttribute('href', '/#top-cards')
  })

  it('shows the most valuable card with its price', () => {
    renderRoute('/')
    const [top] = getTopCards(1)
    const hero = screen.getByRole('region', { name: 'Catch the cards you chased.' })
    expect(within(hero).getByRole('img', { name: /^Umbreon ex/ })).toHaveAttribute('src', top.image)
    expect(within(hero).getByText(formatPrice(top.price))).toBeInTheDocument()
    expect(within(hero).getByText(`${top.name} · ${top.number}`)).toBeInTheDocument()
  })
})

describe('top cards', () => {
  it('lists the five most valuable cards in order, with pack and price', () => {
    renderRoute('/')
    const expected = getTopCards(5)
    const items = topCardItems()
    expect(items).toHaveLength(5)
    items.forEach((item, index) => {
      const card = expected[index]
      const row = within(item)
      expect(row.getByText(`#${index + 1}`)).toBeInTheDocument()
      expect(row.getByRole('heading', { name: card.name })).toBeInTheDocument()
      expect(row.getByText(formatPrice(card.price))).toBeInTheDocument()
    })
  })

  it('links each card to that card in the shop', () => {
    renderRoute('/')
    const [first] = getTopCards(1)
    const link = within(topCardItems()[0]).getByRole('link', { name: /^View Umbreon ex/ })
    const url = new URL(link.getAttribute('href'), 'http://localhost')
    expect(url.pathname).toBe('/shop')
    expect(url.searchParams.get('q')).toBe(first.name)
    expect(url.searchParams.get('set')).toBe(first.set)
  })

  it('links to the full shop', () => {
    renderRoute('/')
    expect(within(topCardsSection()).getByRole('link', { name: `See all ${CARDS.length} cards` })).toHaveAttribute(
      'href',
      '/shop',
    )
  })
})

describe('opening the pack', () => {
  // jsdom has no layout; place every element (including the seal) far below the screen.
  const placeEverythingAt = (top) =>
    vi.spyOn(Element.prototype, 'getBoundingClientRect').mockReturnValue({ top, left: 0, right: 0, bottom: 0 })

  it('keeps the top cards in the page before the pack opens', () => {
    placeEverythingAt(5000)
    renderRoute('/')
    expect(topCardsSection()).toHaveAttribute('data-state', 'closed')
    expect(topCardItems()).toHaveLength(5)
  })

  it('opens once the seal scrolls into view', () => {
    const rect = placeEverythingAt(5000)
    renderRoute('/')
    rect.mockReturnValue({ top: 200, left: 0, right: 0, bottom: 0 })
    act(() => window.dispatchEvent(new Event('scroll')))
    expect(topCardsSection()).toHaveAttribute('data-state', 'open')
  })

  it('starts open for visitors who prefer reduced motion', () => {
    window.matchMedia = (query) => ({ ...originalMatchMedia(query), matches: true })
    renderRoute('/')
    expect(topCardsSection()).toHaveAttribute('data-state', 'open')
  })
})

describe('About', () => {
  it('introduces the shop', () => {
    renderRoute('/')
    expect(screen.getByRole('region', { name: 'A card shop built for collectors' })).toBeInTheDocument()
  })

  it('links each set we stock to the shop, filtered to that set', () => {
    renderRoute('/')
    const sets = within(screen.getByRole('list', { name: 'Sets we stock' }))
    for (const set of SETS) {
      const link = sets.getByRole('link', { name: `${set.name} · ${countCardsInSet(set.slug)}` })
      expect(link).toHaveAttribute('href', `/shop?set=${set.slug}`)
    }
  })
})
