import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { renderRoute } from '../../../test/renderRoute.jsx'
import { CARDS, filterCards, SORT_OPTIONS } from '../../lib/cards.js'

const cardList = () => screen.getByRole('list', { name: 'Cards' })
const shownCards = () => within(cardList()).getAllByRole('article')
const shownNames = () => within(cardList()).getAllByRole('heading').map((heading) => heading.textContent)
const searchBox = () => screen.getByRole('searchbox', { name: 'Search cards by name' })
const sortSelect = () => screen.getByRole('combobox', { name: 'Sort cards' })
async function chooseSort(user, name) {
  await user.click(sortSelect())
  await user.click(screen.getByRole('option', { name }))
}
const setButton = (name) => within(screen.getByRole('group', { name: 'Filter by set' })).getByRole('button', { name })
const showMore = () => screen.queryByRole('button', { name: /^Show \d+ more/ })
const search = (router) => router.state.location.search

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Shop page', () => {
  it('shows the first 24 of all 276 cards, most valuable first', () => {
    renderRoute('/shop')
    expect(shownCards()).toHaveLength(24)
    expect(screen.getByText('Showing 24 of 276')).toBeInTheDocument()
    expect(shownNames()[0]).toBe('Umbreon ex')
  })

  it('shows 24 more cards at a time until all are shown', async () => {
    const user = userEvent.setup()
    renderRoute('/shop?set=obsidian-flames')
    // Obsidian Flames has 54 cards: 24, then 48, then the last 6.
    expect(shownCards()).toHaveLength(24)
    await user.click(screen.getByRole('button', { name: 'Show 24 more cards' }))
    expect(shownCards()).toHaveLength(48)
    await user.click(screen.getByRole('button', { name: 'Show 6 more cards' }))
    expect(shownCards()).toHaveLength(54)
    expect(showMore()).not.toBeInTheDocument()
    expect(screen.getByText('Showing 54 of 54')).toBeInTheDocument()
  })

  it('goes back to 24 cards when the filters change', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    await user.click(showMore())
    expect(shownCards()).toHaveLength(48)
    await chooseSort(user, 'Name: A to Z')
    expect(shownCards()).toHaveLength(24)
  })
})

describe('searching', () => {
  it('finds cards by name, ignoring capitals, and saves the search in the URL', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/shop')
    await user.type(searchBox(), 'CHARI')
    const expected = filterCards({ query: 'chari' })
    expect(shownCards()).toHaveLength(expected.length)
    // Matches anywhere in the name, so the Trainer card "Giovanni's Charisma" counts too.
    expect(shownNames().every((name) => name.toLowerCase().includes('chari'))).toBe(true)
    expect(shownNames()).toContain("Giovanni's Charisma")
    expect(screen.getByText(`${expected.length} cards match “CHARI”`)).toBeInTheDocument()
    expect(search(router)).toBe('?q=CHARI')
  })

  it('does not scroll the page back to the top while typing', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    const scrollTo = vi.spyOn(window, 'scrollTo')
    await user.type(searchBox(), 'pika')
    expect(scrollTo).not.toHaveBeenCalled()
  })

  it('clears the search with the clear button and puts the cursor back', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/shop?q=pikachu')
    await user.click(screen.getByRole('button', { name: 'Clear search' }))
    expect(searchBox()).toHaveValue('')
    expect(searchBox()).toHaveFocus()
    expect(search(router)).toBe('')
    expect(shownCards()).toHaveLength(24)
  })

  it('offers a way out when nothing matches', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/shop?set=151')
    await user.type(searchBox(), 'mewtwo gx')
    expect(screen.queryByRole('list', { name: 'Cards' })).not.toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'No cards caught' })).toBeInTheDocument()
    expect(screen.getByText('0 cards match “mewtwo gx” in 151')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear search and filters' }))
    expect(search(router)).toBe('')
    expect(screen.getByText('Showing 24 of 276')).toBeInTheDocument()
  })
})

describe('set filters', () => {
  it('shows only the chosen set and marks its button as pressed', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/shop')
    expect(setButton('All sets')).toHaveAttribute('aria-pressed', 'true')
    await user.click(setButton('151'))
    expect(setButton('151')).toHaveAttribute('aria-pressed', 'true')
    expect(setButton('All sets')).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('55 cards in 151')).toBeInTheDocument()
    expect(search(router)).toBe('?set=151')
  })

  it('combines with search', async () => {
    const user = userEvent.setup()
    renderRoute('/shop?set=151')
    await user.type(searchBox(), 'charizard')
    const expected = filterCards({ query: 'charizard', set: '151' })
    expect(shownCards()).toHaveLength(expected.length)
    expect(screen.getByText(`${expected.length} cards match “charizard” in 151`)).toBeInTheDocument()
  })

  it('goes back to every set with "All sets"', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/shop?set=surging-sparks')
    await user.click(setButton('All sets'))
    expect(search(router)).toBe('')
    expect(screen.getByText('276 cards')).toBeInTheDocument()
  })
})

describe('sorting', () => {
  it('sorts by price high to low by default', () => {
    renderRoute('/shop')
    expect(sortSelect()).toHaveTextContent('Price: high to low')
  })

  it('sorts by price low to high', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/shop')
    await chooseSort(user, 'Price: low to high')
    expect(shownNames()[0]).toBe(filterCards({ sort: 'price-asc' })[0].name)
    expect(search(router)).toBe('?sort=price-asc')
  })

  it('sorts by name', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    await chooseSort(user, 'Name: A to Z')
    const names = shownNames()
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)))
  })

  it('opens a list of the sorts with the current one selected', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await user.click(sortSelect())
    expect(sortSelect()).toHaveAttribute('aria-expanded', 'true')
    const options = within(screen.getByRole('listbox', { name: 'Sort cards' })).getAllByRole('option')
    expect(options.map((option) => option.textContent)).toEqual(SORT_OPTIONS.map((option) => option.label))
    expect(screen.getByRole('option', { name: 'Price: high to low' })).toHaveAttribute('aria-selected', 'true')
    expect(sortSelect()).toHaveFocus()
  })

  it('can be used from the keyboard', async () => {
    const user = userEvent.setup()
    const { router } = renderRoute('/shop')
    sortSelect().focus()
    await user.keyboard('{ArrowDown}')
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    await user.keyboard('{ArrowDown}{ArrowDown}')
    expect(sortSelect()).toHaveAttribute('aria-activedescendant', screen.getByRole('option', { name: 'Name: A to Z' }).id)
    await user.keyboard('{Enter}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(sortSelect()).toHaveTextContent('Name: A to Z')
    expect(search(router)).toBe('?sort=name-asc')
  })

  it('closes without changing the sort on Escape or a click elsewhere', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    sortSelect().focus()
    await user.keyboard('{ArrowDown}{ArrowDown}{Escape}')
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    await user.click(sortSelect())
    await user.click(searchBox())
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument()
    expect(sortSelect()).toHaveTextContent('Price: high to low')
  })
})

describe('filters from the URL', () => {
  it('opens with the search, set and sort from a shared link', () => {
    renderRoute('/shop?q=charizard&set=151&sort=price-asc')
    expect(searchBox()).toHaveValue('charizard')
    expect(setButton('151')).toHaveAttribute('aria-pressed', 'true')
    expect(sortSelect()).toHaveTextContent('Price: low to high')
    const expected = filterCards({ query: 'charizard', set: '151', sort: 'price-asc' })
    expect(shownCards()).toHaveLength(expected.length)
  })

  it('ignores an unknown set or sort in the URL', () => {
    renderRoute('/shop?set=base-set&sort=rarity')
    expect(setButton('All sets')).toHaveAttribute('aria-pressed', 'true')
    expect(sortSelect()).toHaveTextContent('Price: high to low')
    expect(screen.getByText(`${CARDS.length} cards`)).toBeInTheDocument()
  })
})

describe('adding to the cart', () => {
  it('updates the cart count in the navbar', async () => {
    const user = userEvent.setup()
    renderRoute('/shop')
    const nav = within(screen.getByRole('navigation', { name: 'Main' }))
    expect(nav.getByRole('link', { name: 'Cart, 0 items' })).toBeInTheDocument()

    const [firstCard] = shownCards()
    await user.click(within(firstCard).getByRole('button', { name: /^Increase quantity/ }))
    await user.click(within(firstCard).getByRole('button', { name: 'Add to cart' }))
    expect(nav.getByRole('link', { name: 'Cart, 2 items' })).toBeInTheDocument()

    const secondCard = shownCards()[1]
    await user.click(within(secondCard).getByRole('button', { name: 'Add to cart' }))
    expect(nav.getByRole('link', { name: 'Cart, 3 items' })).toBeInTheDocument()
  })
})
