import { describe, expect, it } from 'vitest'
import {
  MAX_QUANTITY,
  MIN_QUANTITY,
  clampQuantity,
  formatPrice,
  formatPricesDate,
  sanitizeQuantityInput,
} from './format.js'

describe('formatPrice', () => {
  it('formats US dollars with thousands separators and two decimals', () => {
    expect(formatPrice(1215.47)).toBe('$1,215.47')
    expect(formatPrice(3.5)).toBe('$3.50')
    expect(formatPrice(0.2784)).toBe('$0.28')
  })
})

describe('formatPricesDate', () => {
  it('shows the snapshot date as day, short month and year', () => {
    expect(formatPricesDate('2026-10-22')).toBe('22 Oct 2026')
  })
})

describe('sanitizeQuantityInput', () => {
  it('keeps only digits, at most two', () => {
    expect(sanitizeQuantityInput('12')).toBe('12')
    expect(sanitizeQuantityInput('4a')).toBe('4')
    expect(sanitizeQuantityInput('-3')).toBe('3')
    expect(sanitizeQuantityInput('250')).toBe('25')
  })

  it('allows an empty field while typing', () => {
    expect(sanitizeQuantityInput('')).toBe('')
    expect(sanitizeQuantityInput('abc')).toBe('')
  })
})

describe('clampQuantity', () => {
  it('keeps quantities from 1 to 99 as they are', () => {
    expect(clampQuantity(1)).toBe(1)
    expect(clampQuantity('7')).toBe(7)
    expect(clampQuantity(99)).toBe(99)
  })

  it('turns blank, zero, negative or junk values into 1', () => {
    for (const value of ['', '0', 0, -5, 'abc', undefined, null, NaN]) {
      expect(clampQuantity(value)).toBe(MIN_QUANTITY)
    }
  })

  it('caps large quantities at 99', () => {
    expect(clampQuantity(150)).toBe(MAX_QUANTITY)
    expect(clampQuantity('1000')).toBe(MAX_QUANTITY)
  })

  it('drops decimals', () => {
    expect(clampQuantity(2.9)).toBe(2)
  })
})
