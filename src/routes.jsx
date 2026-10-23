import Layout from './components/Layout/Layout.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Home from './pages/Home/Home.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import Shop from './pages/Shop/Shop.jsx'

// Every page shares the Layout: navbar, Visit Us and footer.
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'cart', element: <Cart /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
