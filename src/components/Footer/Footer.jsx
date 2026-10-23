import { Link, useLocation } from 'react-router'
import { PRICES_AS_OF } from '../../lib/cards.js'
import { formatPricesDate } from '../../lib/format.js'
import CrimpEdge from '../art/CrimpEdge.jsx'
import PokeBall from '../art/PokeBall.jsx'
import styles from './Footer.module.css'

export default function Footer() {
  const { pathname } = useLocation()

  return (
    <>
      <CrimpEdge direction="up" />
      <footer className={styles.footer}>
        <PokeBall variant="outline" className={styles.ball} />
        <div className={styles.inner}>
          <div className={styles.top}>
            <p className={styles.brand}>Holo Vault</p>
            <nav aria-label="Footer">
              <ul className={styles.links}>
                <li>
                  <Link to="/shop">Shop</Link>
                </li>
                <li>
                  <Link to="/#about">About</Link>
                </li>
                <li>
                  <Link to={`${pathname}#visit`}>Visit Us</Link>
                </li>
                <li>
                  <Link to="/cart">Cart</Link>
                </li>
              </ul>
            </nav>
          </div>
          <div className={styles.bottom}>
            <p>Prices: TCGplayer market data via tcgapi.dev, as of {formatPricesDate(PRICES_AS_OF)}.</p>
            <p>Fan project. Not affiliated with Nintendo, Creatures, GAME FREAK or The Pokémon Company.</p>
          </div>
        </div>
      </footer>
    </>
  )
}
