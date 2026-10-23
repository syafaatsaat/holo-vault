import { useEffect, useId, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router'
import { useCart } from '../../cart/useCart.js'
import { useScrolled } from '../../hooks/useScrolled.js'
import PackLogo from '../art/PackLogo.jsx'
import styles from './Navbar.module.css'

// Blends into the red band at the top of every page, then shrinks into a
// floating frosted-glass bar once the page scrolls. On phones the three page
// links move into a menu opened by the burger button beside Cart.
export default function Navbar() {
  const { itemCount } = useCart()
  const { pathname } = useLocation()
  const compact = useScrolled()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuId = useId()
  const navRef = useRef(null)
  const burgerRef = useRef(null)
  const itemText = `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`
  const linkClass = ({ isActive }) => `${styles.link} ${isActive ? styles.current : ''}`
  const closeMenu = () => setMenuOpen(false)

  // While the menu is open: Escape closes it (focus back on the burger), and a
  // tap or click anywhere outside the navbar closes it.
  useEffect(() => {
    if (!menuOpen) return
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        burgerRef.current?.focus()
      }
    }
    function onPointerDown(event) {
      if (!navRef.current?.contains(event.target)) setMenuOpen(false)
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('pointerdown', onPointerDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('pointerdown', onPointerDown)
    }
  }, [menuOpen])

  return (
    <header className={`${styles.header} ${compact ? styles.compact : ''}`}>
      <nav ref={navRef} aria-label="Main" className={`${styles.nav} ${menuOpen ? styles.menuOpen : ''}`}>
        <Link to="/" className={styles.logo} aria-label="Holo Vault home" onClick={closeMenu}>
          <PackLogo className={styles.logoArt} />
        </Link>
        {/* The burger comes before the menu and Cart in the page, so on phones the
            Tab order matches what you see: logo, burger, menu links, Cart.
            It's hidden on wider screens. */}
        <button
          ref={burgerRef}
          type="button"
          className={styles.burger}
          aria-label="Menu"
          aria-expanded={menuOpen}
          aria-controls={menuId}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
        {/* One set of links for every screen size: inline on wide screens,
            the burger's drop-down menu on phones. Following a link closes the menu. */}
        <ul id={menuId} className={styles.links} onClick={(event) => event.target.closest('a') && closeMenu()}>
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
        {/* Named "Cart, 3 items" from its own text (no aria-label), so the name
            starts with the visible word "Cart" for voice-control users */}
        <NavLink
          to="/cart"
          onClick={closeMenu}
          className={({ isActive }) => `${styles.cart} ${isActive ? styles.cartCurrent : ''}`}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <circle cx="9" cy="20" r="1.5" />
            <circle cx="18" cy="20" r="1.5" />
            <path d="M2 3h3l2.6 12.4a2 2 0 0 0 2 1.6h8.2a2 2 0 0 0 2-1.6L21.5 7H6" />
          </svg>
          {/* Hidden visually on phones (icon only), but still read out */}
          <span className={styles.cartLabel}>Cart</span>
          <span className="visually-hidden">, {itemText}</span>
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
