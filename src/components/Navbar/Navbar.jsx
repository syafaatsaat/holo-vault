import { Link, NavLink, useLocation } from 'react-router'
import { useCart } from '../../cart/useCart.js'
import { useScrolled } from '../../hooks/useScrolled.js'
import PackLogo from '../art/PackLogo.jsx'
import styles from './Navbar.module.css'

// Blends into the red band at the top of every page, then shrinks into a
// floating frosted-glass bar once the page scrolls.
export default function Navbar() {
  const { itemCount } = useCart()
  const { pathname } = useLocation()
  const compact = useScrolled()
  const cartLabel = `Cart, ${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
  const linkClass = ({ isActive }) => `${styles.link} ${isActive ? styles.current : ''}`

  return (
    <header className={`${styles.header} ${compact ? styles.compact : ''}`}>
      <nav aria-label="Main" className={styles.nav}>
        <Link to="/" className={styles.logo} aria-label="Holo Vault home">
          <PackLogo className={styles.logoArt} />
        </Link>
        <ul className={styles.links}>
          <li>
            <NavLink to="/shop" className={linkClass}>
              Shop
            </NavLink>
          </li>
          <li>
            <Link to="/#about" className={styles.link}>
              About
            </Link>
          </li>
          <li>
            <Link to={`${pathname}#visit`} className={styles.link}>
              Visit Us
            </Link>
          </li>
        </ul>
        <NavLink
          to="/cart"
          aria-label={cartLabel}
          className={({ isActive }) => `${styles.cart} ${isActive ? styles.cartCurrent : ''}`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21.5 7H6" />
          </svg>
          Cart
          {itemCount > 0 && (
            <span className={styles.badge} aria-hidden="true">
              {itemCount}
            </span>
          )}
        </NavLink>
      </nav>
    </header>
  )
}
