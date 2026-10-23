import { Link } from 'react-router'
import PokeBall from '../../components/art/PokeBall.jsx'
import RarityBadge from '../../components/RarityBadge/RarityBadge.jsx'
import { CARDS, getSetName, getTopCards } from '../../lib/cards.js'
import { formatPrice } from '../../lib/format.js'
import styles from './TopCards.module.css'

const TOP_CARD_COUNT = 5

function shopLinkFor(card) {
  return `/shop?${new URLSearchParams({ q: card.name, set: card.set })}`
}

// The cards that "fall out" of the pack. They're always in the page (so screen
// readers and search engines see them); `open` only drives the drop-in animation.
export default function TopCards({ open }) {
  const cards = getTopCards(TOP_CARD_COUNT)

  return (
    <section
      id="top-cards"
      aria-labelledby="top-cards-title"
      className={`dotted ${styles.section} ${open ? styles.open : ''}`}
      data-state={open ? 'open' : 'closed'}
    >
      <div className={styles.inner}>
        <div className={styles.header}>
          <div className={styles.heading}>
            <PokeBall className={styles.headingBall} />
            <div>
              <h2 id="top-cards-title" className={styles.title}>
                Top cards in the vault
              </h2>
              <p className={styles.subtitle}>The most valuable pulls we stock right now.</p>
            </div>
          </div>
          <Link to="/shop" className={styles.seeAll}>
            See all {CARDS.length} cards
          </Link>
        </div>

        <ol className={styles.list}>
          {cards.map((card, index) => (
            <li key={card.id} className={styles.card} style={{ '--i': index }}>
              <img
                className={styles.image}
                src={card.image}
                alt={`${card.name}, ${getSetName(card.set)} ${card.rarity}`}
                width="287"
                height="400"
                loading="lazy"
                decoding="async"
              />
              <div className={styles.details}>
                <span className={styles.rank}>#{index + 1}</span>
                <div>
                  <p className={styles.label}>Card</p>
                  <h3 className={styles.name}>{card.name}</h3>
                  <p className={styles.meta}>
                    <RarityBadge rarity={card.rarity} /> {card.number}
                  </p>
                </div>
                <div>
                  <p className={styles.label}>Pack</p>
                  <p className={styles.pack} data-set={card.set}>
                    {getSetName(card.set)}
                  </p>
                </div>
                <div>
                  <p className={styles.label}>Market price</p>
                  <p className={styles.price}>{formatPrice(card.price)}</p>
                </div>
                <Link
                  to={shopLinkFor(card)}
                  className={styles.view}
                  aria-label={`View ${card.name} (${getSetName(card.set)}) in the shop`}
                >
                  View in shop
                </Link>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
