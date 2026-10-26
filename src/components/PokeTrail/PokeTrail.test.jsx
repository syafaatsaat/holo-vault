import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import PokeTrail from './PokeTrail.jsx'

const originalMatchMedia = window.matchMedia

afterEach(() => {
  window.matchMedia = originalMatchMedia
})

// A dotted section with a bare heading on it and a white card on top of it
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
      <PokeTrail />
    </>,
  )
  return { ...result, balls: () => result.container.querySelectorAll('[aria-hidden="true"] > span') }
}

function move(target, x, y, pointerType = 'mouse') {
  const event = new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  act(() => {
    target.dispatchEvent(event)
  })
}

describe('PokeTrail', () => {
  it('drops a ball where the mouse moves over the dotted background', () => {
    const { getByTestId, balls } = renderPage()
    move(getByTestId('dots'), 100, 120)
    expect(balls()).toHaveLength(1)
    expect(balls()[0]).toHaveStyle({ left: '100px', top: '120px' })
  })

  it('counts bare content on the dots, like a heading, as background', () => {
    const { getByTestId, balls } = renderPage()
    move(getByTestId('heading'), 100, 120)
    expect(balls()).toHaveLength(1)
  })

  it('spaces the balls out instead of dropping one on every tiny movement', () => {
    const { getByTestId, balls } = renderPage()
    const dots = getByTestId('dots')
    move(dots, 100, 100)
    move(dots, 110, 105)
    expect(balls()).toHaveLength(1)
    move(dots, 160, 100)
    expect(balls()).toHaveLength(2)
  })

  it('leaves no trail over cards, buttons or areas without dots', () => {
    const { getByTestId, getByRole, balls } = renderPage()
    move(getByTestId('card-text'), 100, 100)
    move(getByRole('button'), 200, 100)
    move(getByTestId('footer'), 300, 100)
    expect(balls()).toHaveLength(0)
  })

  it('ignores touch and pen input', () => {
    const { getByTestId, balls } = renderPage()
    move(getByTestId('dots'), 100, 100, 'touch')
    move(getByTestId('dots'), 200, 100, 'pen')
    expect(balls()).toHaveLength(0)
  })

  it('removes each ball once its animation finishes', () => {
    const { getByTestId, balls } = renderPage()
    move(getByTestId('dots'), 100, 100)
    // jsdom has no AnimationEvent, so React listens for the prefixed name there
    const ball = balls()[0]
    act(() => {
      ball.dispatchEvent(new Event('animationend', { bubbles: true }))
      ball.dispatchEvent(new Event('webkitAnimationEnd', { bubbles: true }))
    })
    expect(balls()).toHaveLength(0)
  })

  it('keeps at most 20 balls on screen', () => {
    const { getByTestId, balls } = renderPage()
    for (let i = 0; i < 30; i++) move(getByTestId('dots'), i * 50, 100)
    expect(balls()).toHaveLength(20)
  })

  it('is turned off for users who prefer reduced motion', () => {
    window.matchMedia = (query) => ({ ...originalMatchMedia(query), matches: true })
    const { getByTestId, balls } = renderPage()
    move(getByTestId('dots'), 100, 100)
    expect(balls()).toHaveLength(0)
  })
})
