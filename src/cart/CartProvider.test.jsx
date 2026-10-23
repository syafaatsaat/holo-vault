import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CartProvider } from './CartProvider.jsx'
import { STORAGE_KEY } from './storage.js'
import { pikachu, umbreon } from './testCards.js'
import { useCart } from './useCart.js'

// A tiny stand-in for the real pages: shows the cart and offers each action.
function CartPanel() {
  const { lines, itemCount, subtotal, addToCart, setQuantity, removeFromCart, clearCart } = useCart()
  return (
    <div>
      <p>Items: {itemCount}</p>
      <p>Subtotal: {subtotal}</p>
      <ul>
        {lines.map(({ card, quantity }) => (
          <li key={card.id}>
            {card.name} x{quantity}
          </li>
        ))}
      </ul>
      <button onClick={() => addToCart(umbreon.id, 2)}>Add Umbreon</button>
      <button onClick={() => addToCart(pikachu.id)}>Add Pikachu</button>
      <button onClick={() => setQuantity(umbreon.id, 5)}>Set Umbreon to 5</button>
      <button onClick={() => removeFromCart(umbreon.id)}>Remove Umbreon</button>
      <button onClick={clearCart}>Clear</button>
    </div>
  )
}

function renderCart() {
  return render(
    <CartProvider>
      <CartPanel />
    </CartProvider>,
  )
}

const savedItems = () => JSON.parse(localStorage.getItem(STORAGE_KEY)).items

afterEach(() => {
  vi.restoreAllMocks()
})

describe('CartProvider', () => {
  it('starts with an empty cart', () => {
    renderCart()
    expect(screen.getByText('Items: 0')).toBeInTheDocument()
    expect(screen.getByText('Subtotal: 0')).toBeInTheDocument()
  })

  it('adds cards and updates the count and subtotal', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByRole('button', { name: 'Add Umbreon' }))
    await user.click(screen.getByRole('button', { name: 'Add Pikachu' }))
    expect(screen.getByText('Items: 3')).toBeInTheDocument()
    expect(screen.getByText('Subtotal: 2689.05')).toBeInTheDocument()
    expect(screen.getByText('Umbreon ex x2')).toBeInTheDocument()
    expect(screen.getByText('Pikachu ex x1')).toBeInTheDocument()
  })

  it('changes a quantity, removes a card and clears the cart', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByRole('button', { name: 'Add Umbreon' }))
    await user.click(screen.getByRole('button', { name: 'Set Umbreon to 5' }))
    expect(screen.getByText('Umbreon ex x5')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Add Pikachu' }))
    await user.click(screen.getByRole('button', { name: 'Remove Umbreon' }))
    expect(screen.queryByText(/Umbreon ex/)).not.toBeInTheDocument()
    expect(screen.getByText('Items: 1')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Clear' }))
    expect(screen.getByText('Items: 0')).toBeInTheDocument()
  })

  it('saves the cart to localStorage after every change', async () => {
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByRole('button', { name: 'Add Umbreon' }))
    expect(savedItems()).toEqual([{ id: umbreon.id, quantity: 2 }])
    await user.click(screen.getByRole('button', { name: 'Remove Umbreon' }))
    expect(savedItems()).toEqual([])
  })

  it('restores a saved cart, as after a page refresh', async () => {
    const user = userEvent.setup()
    const first = renderCart()
    await user.click(screen.getByRole('button', { name: 'Add Pikachu' }))
    first.unmount()

    renderCart()
    expect(screen.getByText('Pikachu ex x1')).toBeInTheDocument()
    expect(screen.getByText('Items: 1')).toBeInTheDocument()
  })

  it('still works when storage is blocked', async () => {
    vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('SecurityError')
    })
    const user = userEvent.setup()
    renderCart()
    await user.click(screen.getByRole('button', { name: 'Add Umbreon' }))
    expect(screen.getByText('Items: 2')).toBeInTheDocument()
  })
})

describe('useCart', () => {
  it('explains the mistake when used outside CartProvider', () => {
    // React logs the thrown error; keep the test output clean.
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => render(<CartPanel />)).toThrow('useCart must be used inside a <CartProvider>')
  })
})
