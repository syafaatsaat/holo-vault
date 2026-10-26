import { act, render } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import PokeTrail from './PokeTrail.jsx'

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
      <PokeTrail />
    </>,
  )
  return { ...result, balls: () => result.container.querySelectorAll('span[aria-hidden="true"]') }
}

function move(target, x, y, pointerType = 'mouse') {
  const event = new MouseEvent('pointermove', { bubbles: true, clientX: x, clientY: y })
  Object.defineProperty(event, 'pointerType', { value: pointerType })
  act(() => {
    target.dispatchEvent(event)
  })
}

describe('PokeTrail', () => {
  it('drops a ball inside the dotted section, where the mouse is', () => {
    const { getByTestId, balls } = renderPage()
    move(getByTestId('dots'), 100, 120)
    expect(balls()).toHaveLength(1)
    expect(balls()[0].parentElement).toBe(getByTestId('dots'))
    expect(balls()[0]).toHaveStyle({ left: '100px', top: '120px' })
  })

  it('keeps the trail going under content on the dots, like headings and cards', () => {
    const { getByTestId, getByRole, balls } = renderPage()
    move(getByTestId('heading'), 100, 100)
    move(getByTestId('card-text'), 200, 100)
    move(getByRole('button'), 300, 100)
    expect(balls()).toHaveLength(3)
    balls().forEach((ball) => expect(ball.parentElement).toBe(getByTestId('dots')))
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

  it('leaves no trail outside the dotted background', () => {
    const { getByTestId, balls } = renderPage()
    move(getByTestId('footer'), 100, 100)
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

  it('keeps at most 40 balls on screen', () => {
    const { getByTestId, balls } = renderPage()
    for (let i = 0; i < 50; i++) move(getByTestId('dots'), i * 40, 100)
    expect(balls()).toHaveLength(40)
  })

  it('is turned off for users who prefer reduced motion', () => {
    window.matchMedia = (query) => ({ ...originalMatchMedia(query), matches: true })
    const { getByTestId, balls } = renderPage()
    move(getByTestId('dots'), 100, 100)
    expect(balls()).toHaveLength(0)
  })
})
