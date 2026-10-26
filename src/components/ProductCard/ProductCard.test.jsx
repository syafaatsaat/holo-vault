import { act, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { umbreon } from '../../cart/testCards.js'
import ProductCard from './ProductCard.jsx'

const addButton = () => screen.getByRole('button', { name: /add(ed)? to cart/i })

afterEach(() => {
  vi.useRealTimers()
})

describe('ProductCard', () => {
  it('shows the card name, set, number, rarity, price and image', () => {
    render(<ProductCard card={umbreon} onAddToCart={() => {}} />)
    expect(screen.getByRole('heading', { name: 'Umbreon ex' })).toBeInTheDocument()
    expect(screen.getByText('Prismatic Evolutions · 161/131')).toBeInTheDocument()
    expect(screen.getByText('Special Illustration Rare')).toBeInTheDocument()
    expect(screen.getByText('$1,215.47')).toBeInTheDocument()
    expect(
      screen.getByRole('img', { name: 'Umbreon ex, Prismatic Evolutions Special Illustration Rare' }),
    ).toHaveAttribute('src', umbreon.image)
  })

  it('adds one copy by default', async () => {
    const onAddToCart = vi.fn()
    const user = userEvent.setup()
    render(<ProductCard card={umbreon} onAddToCart={onAddToCart} />)
    await user.click(addButton())
    expect(onAddToCart).toHaveBeenCalledWith(umbreon.id, 1)
  })

  it('adds the quantity chosen with the stepper or typed in', async () => {
    const onAddToCart = vi.fn()
    const user = userEvent.setup()
    render(<ProductCard card={umbreon} onAddToCart={onAddToCart} />)
    await user.click(screen.getByRole('button', { name: 'Increase quantity of Umbreon ex' }))
    await user.click(addButton())
    expect(onAddToCart).toHaveBeenLastCalledWith(umbreon.id, 2)

    const field = screen.getByRole('textbox', { name: 'Quantity of Umbreon ex' })
    await user.clear(field)
    await user.type(field, '12')
    await user.click(addButton())
    expect(onAddToCart).toHaveBeenLastCalledWith(umbreon.id, 12)
  })

  it('confirms the add, resets the quantity to 1, then restores the button', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime })
    render(<ProductCard card={umbreon} onAddToCart={() => {}} />)

    await user.click(screen.getByRole('button', { name: 'Increase quantity of Umbreon ex' }))
    await user.click(addButton())
    expect(addButton()).toHaveTextContent('Added to cart ✓')
    expect(screen.getByRole('status')).toHaveTextContent('Added 2 × Umbreon ex to your cart')
    expect(screen.getByRole('textbox', { name: 'Quantity of Umbreon ex' })).toHaveValue('1')

    act(() => vi.advanceTimersByTime(1300))
    expect(addButton()).toHaveTextContent('Add to cart')
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('opens a close-up of the card from the magnify button', async () => {
    const user = userEvent.setup()
    render(<ProductCard card={umbreon} onAddToCart={() => {}} />)
    await user.click(screen.getByRole('button', { name: 'View Umbreon ex close up' }))
    const dialog = screen.getByRole('dialog', { name: 'Umbreon ex' })
    const image = within(dialog).getByRole('img', { name: 'Umbreon ex, Prismatic Evolutions Special Illustration Rare' })
    expect(image).toHaveAttribute('src', umbreon.image.replace('/fit-in/400x400/', '/fit-in/800x800/'))
    expect(within(dialog).getByText('Prismatic Evolutions · 161/131')).toBeInTheDocument()
    expect(within(dialog).getByRole('button', { name: 'Close' })).toHaveFocus()
  })

  it.each([
    ['the close button', (user) => user.click(screen.getByRole('button', { name: 'Close' }))],
    ['Escape', (user) => user.keyboard('{Escape}')],
    ['a click on the dimmed page', (user) => user.click(screen.getByRole('dialog'))],
  ])('closes the close-up with %s and returns focus to the magnify button', async (_, close) => {
    const user = userEvent.setup()
    render(<ProductCard card={umbreon} onAddToCart={() => {}} />)
    const magnify = screen.getByRole('button', { name: 'View Umbreon ex close up' })
    await user.click(magnify)
    await close(user)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    expect(magnify).toHaveFocus()
  })
})
