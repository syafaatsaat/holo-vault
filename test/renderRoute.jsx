import { render } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router'
import { CartProvider } from '../src/cart/CartProvider.jsx'
import { routes } from '../src/routes.jsx'

// Render the real app at a given address, the way main.jsx does, but with an
// in-memory router so tests can start on any page.
export function renderRoute(path = '/') {
  const router = createMemoryRouter(routes, { initialEntries: [path] })
  const result = render(
    <CartProvider>
      <RouterProvider router={router} />
    </CartProvider>,
  )
  return { ...result, router }
}
