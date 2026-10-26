import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { renderRoute } from '../../../test/renderRoute.jsx'
import { STORAGE_KEY, saveCart } from '../../cart/storage.js'
import { latias, pikachu, umbreon } from '../../cart/testCards.js'

const rows = () => within(screen.getByRole('list', { name: 'Cart items' })).getAllByRole('listitem')
const rowFor = (name) => rows().find((row) => within(row).queryByRole('heading', { name }))
const summary = () => within(screen.getByRole('complementary', { name: 'Summary' }))
const navCart = () => within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: /^Cart,/ })

function startWith(items) {
  saveCart(items)
  return renderRoute('/cart')
}

// Press a card's Remove button and confirm in the dialog
async function removeCard(user, name) {
  await user.click(screen.getByRole('button', { name: `Remove ${name} from cart` }))
  await user.click(within(screen.getByRole('dialog', { name: `Remove ${name}?` })).getByRole('button', { name: 'Remove' }))
}

describe('empty cart', () => {
  it('says the pack is empty and links to the shop', () => {
    renderRoute('/cart')
    expect(screen.getByRole('heading', { name: 'Your pack is empty' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to the shop' })).toHaveAttribute('href', '/shop')
    expect(screen.queryByRole('list', { name: 'Cart items' })).not.toBeInTheDocument()
  })
})

describe('cart with items', () => {
  it('lists each card with its details, quantity and line total, in the order added', () => {
    startWith([
      { id: umbreon.id, quantity: 1 },
      { id: pikachu.id, quantity: 2 },
    ])
    expect(rows()).toHaveLength(2)
    const [first, second] = rows()
    expect(within(first).getByRole('heading', { name: 'Umbreon ex' })).toBeInTheDocument()
    expect(within(second).getByRole('heading', { name: 'Pikachu ex' })).toBeInTheDocument()

    const pikachuRow = within(second)
    expect(pikachuRow.getByText('Surging Sparks · 238/191')).toBeInTheDocument()
    expect(pikachuRow.getByText('$258.11 each')).toBeInTheDocument()
    expect(pikachuRow.getByRole('textbox', { name: 'Quantity of Pikachu ex' })).toHaveValue('2')
    // 2 × $258.11, with a hidden "Total for Pikachu ex:" label for screen readers
    expect(pikachuRow.getByText('$516.22')).toHaveTextContent('Total for Pikachu ex: $516.22')
  })

  it('shows the item count and subtotal', () => {
    startWith([
      { id: umbreon.id, quantity: 1 },
      { id: pikachu.id, quantity: 2 },
    ])
    expect(screen.getByText('3 cards in your cart')).toBeInTheDocument()
    expect(summary().getByText('Items').nextSibling).toHaveTextContent('3')
    expect(summary().getByText('Subtotal').nextSibling).toHaveTextContent('$1,731.69')
    expect(summary().getByRole('link', { name: 'Continue shopping' })).toHaveAttribute('href', '/shop')
  })

  it('updates totals and the navbar when a quantity changes with the buttons', async () => {
    const user = userEvent.setup()
    startWith([{ id: latias.id, quantity: 1 }])
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Latias ex' }))
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Latias ex' }))
    // 3 × $5.64, exact to the cent
    expect(summary().getByText('Subtotal').nextSibling).toHaveTextContent('$16.92')
    expect(navCart()).toHaveAccessibleName('Cart, 3 items')
  })

  it('updates totals when a quantity is typed in', async () => {
    const user = userEvent.setup()
    startWith([{ id: pikachu.id, quantity: 1 }])
    const field = screen.getByRole('textbox', { name: 'Quantity of Pikachu ex' })
    await user.clear(field)
    await user.type(field, '10')
    expect(summary().getByText('Subtotal').nextSibling).toHaveTextContent('$2,581.10')
    expect(screen.getByText('10 cards in your cart')).toBeInTheDocument()
  })

  it('removes a card, announces it and moves focus to the next Remove button', async () => {
    const user = userEvent.setup()
    startWith([
      { id: umbreon.id, quantity: 1 },
      { id: pikachu.id, quantity: 2 },
    ])
    await removeCard(user, 'Umbreon ex')
    expect(rowFor('Umbreon ex')).toBeUndefined()
    expect(rows()).toHaveLength(1)
    expect(screen.getByRole('status')).toHaveTextContent('Removed Umbreon ex from your cart.')
    expect(screen.getByRole('button', { name: 'Remove Pikachu ex from cart' })).toHaveFocus()
    expect(navCart()).toHaveAccessibleName('Cart, 2 items')
  })

  it('moves focus to the previous row when the last row is removed', async () => {
    const user = userEvent.setup()
    startWith([
      { id: umbreon.id, quantity: 1 },
      { id: pikachu.id, quantity: 1 },
    ])
    await removeCard(user, 'Pikachu ex')
    expect(screen.getByRole('button', { name: 'Remove Umbreon ex from cart' })).toHaveFocus()
  })

  it('shows the empty state, and focuses its link, after removing the last card', async () => {
    const user = userEvent.setup()
    startWith([{ id: umbreon.id, quantity: 1 }])
    await removeCard(user, 'Umbreon ex')
    expect(screen.getByRole('heading', { name: 'Your pack is empty' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Go to the shop' })).toHaveFocus()
    expect(navCart()).toHaveAccessibleName('Cart, 0 items')
  })
})

describe('saved cart', () => {
  it('keeps changes after leaving and coming back, as after a refresh', async () => {
    const user = userEvent.setup()
    const first = startWith([{ id: pikachu.id, quantity: 1 }])
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Pikachu ex' }))
    first.unmount()

    renderRoute('/cart')
    expect(screen.getByRole('textbox', { name: 'Quantity of Pikachu ex' })).toHaveValue('2')
  })

  it('skips saved cards that are no longer sold', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        version: 1,
        items: [
          { id: -1, quantity: 3 },
          { id: umbreon.id, quantity: 1 },
        ],
      }),
    )
    renderRoute('/cart')
    expect(rows()).toHaveLength(1)
    expect(screen.getByText('1 card in your cart')).toBeInTheDocument()
  })
})

describe('confirming a removal', () => {
  const removeButton = (name) => screen.getByRole('button', { name: `Remove ${name} from cart` })

  it('asks before removing, with the card focused on "Keep it"', async () => {
    const user = userEvent.setup()
    startWith([{ id: pikachu.id, quantity: 2 }])
    await user.click(removeButton('Pikachu ex'))
    const dialog = screen.getByRole('dialog', { name: 'Remove Pikachu ex?' })
    expect(dialog).toHaveAccessibleDescription('This takes all 2 copies out of your cart.')
    expect(within(dialog).getByRole('button', { name: 'Keep it' })).toHaveFocus()
    expect(rowFor('Pikachu ex')).toBeDefined()
  })

  it('keeps the card and returns focus to its Remove button on "Keep it"', async () => {
    const user = userEvent.setup()
    startWith([{ id: umbreon.id, quantity: 1 }])
    await user.click(removeButton('Umbreon ex'))
    await user.click(screen.getByRole('button', { name: 'Keep it' }))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(rowFor('Umbreon ex')).toBeDefined()
    expect(removeButton('Umbreon ex')).toHaveFocus()
    expect(navCart()).toHaveAccessibleName('Cart, 1 item')
  })

  it('keeps the card on Escape', async () => {
    const user = userEvent.setup()
    startWith([{ id: umbreon.id, quantity: 1 }])
    await user.click(removeButton('Umbreon ex'))
    await user.keyboard('{Escape}')
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(rowFor('Umbreon ex')).toBeDefined()
    expect(removeButton('Umbreon ex')).toHaveFocus()
  })

  it('keeps the card when the dimmed page around the dialog is clicked', async () => {
    const user = userEvent.setup()
    startWith([{ id: umbreon.id, quantity: 1 }])
    await user.click(removeButton('Umbreon ex'))
    await user.click(screen.getByRole('dialog'))
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(rowFor('Umbreon ex')).toBeDefined()
  })
})
