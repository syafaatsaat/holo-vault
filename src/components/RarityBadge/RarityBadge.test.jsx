import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import RarityBadge from './RarityBadge.jsx'

describe('RarityBadge', () => {
  it('shows the full rarity name', () => {
    render(<RarityBadge rarity="Special Illustration Rare" />)
    expect(screen.getByText('Special Illustration Rare')).toBeInTheDocument()
    expect(screen.queryByText('SIR')).not.toBeInTheDocument()
  })

  it('adds the collector abbreviation for phones, hidden from screen readers', () => {
    render(<RarityBadge rarity="Double Rare" shortOnPhones />)
    expect(screen.getByText('Double Rare')).toBeInTheDocument()
    expect(screen.getByText('RR')).toHaveAttribute('aria-hidden', 'true')
  })

  it('keeps the full name for a rarity with no abbreviation', () => {
    render(<RarityBadge rarity="Promo" shortOnPhones />)
    expect(screen.getByText('Promo')).toBeInTheDocument()
  })
})
