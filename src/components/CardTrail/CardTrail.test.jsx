import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { CARDS } from '../../lib/cards.js'
import CardTrail from './CardTrail.jsx'

const originalMatchMedia = window.matchMedia

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

// A dotted section with a heading and a white card on it, and a footer without dots
function renderPage() {
  const result = render(
    <>
      <section className="dotted" data-testid="dots">
        <h2 data-testid="heading">Top cards</h2>
        <article style={{ backgroundColor: 'white' }}>
          <p data-testid="card-text">Umbreon ex</p>
        </article>
        <button type="button">Add to cart</button>
      </section>
      <footer data-testid="footer">Footer</footer>
      <CardTrail />
    </>,
  )
  return { ...result, trail: () => result.container.querySelectorAll('[aria-hidden="true"] > img') }
}

function move(target, x, y, pointerType = 'mouse') {
  const event = new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  act(() => {
    target.dispatchEvent(event)
  })
}

describe('CardTrail', () => {
  it('drops a card where the mouse moves over the dotted background', () => {
    const { getByTestId, trail } = renderPage()
    move(getByTestId('dots'), 100, 120)
    expect(trail()).toHaveLength(1)
    expect(trail()[0]).toHaveStyle({ left: '100px', top: '120px' })
  })

  it('shows cards the shop sells, as decoration only', () => {
    const { getByTestId, trail } = renderPage()
    const images = new Set(CARDS.map((card) => card.image))
    for (let i = 0; i < 10; i++) move(getByTestId('dots'), i * 100, 100)
    trail().forEach((card) => {
      expect(images).toContain(card.getAttribute('src'))
      expect(card).toHaveAttribute('alt', '')
    })
  })

  it('keeps the trail going under content on the dots, like headings and cards', () => {
    const { getByTestId, getByRole, trail } = renderPage()
    move(getByTestId('heading'), 100, 100)
    move(getByTestId('card-text'), 200, 100)
    move(getByRole('button'), 300, 100)
    expect(trail()).toHaveLength(3)
  })

  it('spaces the cards out instead of dropping one on every tiny movement', () => {
    const { getByTestId, trail } = renderPage()
    const dots = getByTestId('dots')
    move(dots, 100, 100)
    move(dots, 110, 105)
    expect(trail()).toHaveLength(1)
    move(dots, 200, 100)
    expect(trail()).toHaveLength(2)
  })

  it('leaves no trail outside the dotted background', () => {
    const { getByTestId, trail } = renderPage()
    move(getByTestId('footer'), 100, 100)
    expect(trail()).toHaveLength(0)
  })

  it('ignores touch and pen input', () => {
    const { getByTestId, trail } = renderPage()
    move(getByTestId('dots'), 100, 100, 'touch')
    move(getByTestId('dots'), 200, 100, 'pen')
    expect(trail()).toHaveLength(0)
  })

  it('removes each card once its animation finishes', () => {
    const { getByTestId, trail } = renderPage()
    move(getByTestId('dots'), 100, 100)
    // jsdom has no AnimationEvent, so React listens for the prefixed name there
    const card = trail()[0]
    act(() => {
      card.dispatchEvent(new Event('animationend', { bubbles: true }))
      card.dispatchEvent(new Event('webkitAnimationEnd', { bubbles: true }))
    })
    expect(trail()).toHaveLength(0)
  })

  it('keeps at most 40 cards on screen', () => {
    const { getByTestId, trail } = renderPage()
    for (let i = 0; i < 50; i++) move(getByTestId('dots'), i * 100, 100)
    expect(trail()).toHaveLength(40)
  })

  it('is turned off for users who prefer reduced motion', () => {
    window.matchMedia = (query) => ({ ...originalMatchMedia(query), matches: true })
    const { getByTestId, trail } = renderPage()
    move(getByTestId('dots'), 100, 100)
    expect(trail()).toHaveLength(0)
  })
})
