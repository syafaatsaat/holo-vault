import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useState } from 'react'
import { describe, expect, it } from 'vitest'
import QuantityStepper from './QuantityStepper.jsx'

// The stepper is controlled, so give it a parent that holds the quantity,
// and show that quantity outside the field to see what the parent receives.
function Harness({ start = 1 }) {
  const [quantity, setQuantity] = useState(start)
  return (
    <>
      <QuantityStepper quantity={quantity} onQuantityChange={setQuantity} itemName="Pikachu ex" />
      <output aria-label="Chosen quantity">{quantity}</output>
      <button type="button">Somewhere else</button>
    </>
  )
}

const field = () => screen.getByRole('textbox', { name: 'Quantity of Pikachu ex' })
const minus = () => screen.getByRole('button', { name: 'Decrease quantity of Pikachu ex' })
const plus = () => screen.getByRole('button', { name: 'Increase quantity of Pikachu ex' })
const chosen = () => screen.getByLabelText('Chosen quantity')

describe('QuantityStepper', () => {
  it('shows the current quantity', () => {
    render(<Harness start={3} />)
    expect(field()).toHaveValue('3')
  })

  it('steps up and down with the buttons', async () => {
    const user = userEvent.setup()
    render(<Harness start={2} />)
    await user.click(plus())
    expect(field()).toHaveValue('3')
    await user.click(minus())
    await user.click(minus())
    expect(field()).toHaveValue('1')
    expect(chosen()).toHaveTextContent('1')
  })

  it('disables − at 1 and + at 99', () => {
    const { unmount } = render(<Harness start={1} />)
    expect(minus()).toBeDisabled()
    expect(plus()).toBeEnabled()
    unmount()
    render(<Harness start={99} />)
    expect(plus()).toBeDisabled()
    expect(minus()).toBeEnabled()
  })

  it('lets the user type a quantity', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.clear(field())
    await user.type(field(), '12')
    expect(field()).toHaveValue('12')
    expect(chosen()).toHaveTextContent('12')
  })

  it('ignores letters and stops at two digits', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.clear(field())
    await user.type(field(), '4a5b6')
    expect(field()).toHaveValue('45')
    expect(chosen()).toHaveTextContent('45')
  })

  it('allows an empty field while typing, then snaps back to 1 on leaving it', async () => {
    const user = userEvent.setup()
    render(<Harness start={5} />)
    await user.clear(field())
    expect(field()).toHaveValue('')
    await user.click(screen.getByRole('button', { name: 'Somewhere else' }))
    expect(field()).toHaveValue('1')
    expect(chosen()).toHaveTextContent('1')
  })

  it('turns 0 into 1 once the user leaves the field', async () => {
    const user = userEvent.setup()
    render(<Harness start={5} />)
    await user.clear(field())
    await user.type(field(), '0')
    expect(chosen()).toHaveTextContent('1')
    await user.tab()
    expect(field()).toHaveValue('1')
  })

  it('carries on from a typed number when + is pressed', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.clear(field())
    await user.type(field(), '7')
    await user.click(plus())
    expect(field()).toHaveValue('8')
  })
})
