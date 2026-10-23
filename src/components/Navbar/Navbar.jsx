import { Link, NavLink, useLocation } from 'react-router'
import { useCart } from '../../cart/useCart.js'
import styles from './Navbar.module.css'

// Structure and links only for now; the pack logo, Option C styling and the
// shrink-on-scroll glass bar arrive in Phase 5.
export default function Navbar() {
  const { itemCount } = useCart()
  const { pathname } = useLocation()
  const cartLabel = `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`

  return (
    <header className={styles.header}>
      <nav aria-label="Main" className={styles.nav}>
        <Link to="/" className={styles.logo} aria-label="Holo Vault home">
          Holo Vault
        </Link>
        <ul className={styles.links}>
          <li>
            <NavLink to="/shop">Shop</NavLink>
          </li>
          <li>
            <Link to="/#about">About</Link>
          </li>
          <li>
            <Link to={`${pathname}#visit`}>Visit Us</Link>
          </li>
        </ul>
        <NavLink to="/cart" className={styles.cart} aria-label={cartLabel}>
          Cart <span aria-hidden="true">({itemCount})</span>
        </NavLink>
      </nav>
    </header>
  )
}
