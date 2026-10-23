import { Link } from 'react-router'
import { CARDS, getSetName, getTopCards } from '../../lib/cards.js'
import { formatPrice } from '../../lib/format.js'
import styles from './Home.module.css'

export default function Hero() {
  const [topPull] = getTopCards(1)

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.heroText}>
        <p className={styles.pill}>Pokémon TCG singles at market price</p>
        <h2 id="hero-title" className={styles.heroTitle}>
          {/* The space before <br> keeps "cards you" as two words for screen readers */}
          Catch the cards <br />
          you <span className={styles.yellow}>chased.</span>
        </h2>
        <p className={styles.heroIntro}>
          {CARDS.length} Double Rare and higher singles from 151, Prismatic Evolutions, Surging Sparks and
          Obsidian Flames.
        </p>
        <div className={styles.heroButtons}>
          <Link to="/shop" className={`${styles.button} ${styles.buttonYellow}`}>
            Start shopping
          </Link>
          <Link to="/#top-cards" className={styles.button}>
            See top cards
          </Link>
        </div>
      </div>

      <figure className={styles.topPull}>
        <img
          className={styles.topPullImage}
          src={topPull.image}
          alt={`${topPull.name}, ${getSetName(topPull.set)} ${topPull.rarity}`}
          width="287"
          height="400"
        />
        <figcaption>
          <span className={styles.priceSticker}>
            <span className={styles.priceStickerLabel}>Top pull</span>
            <span className={styles.priceStickerValue}>{formatPrice(topPull.price)}</span>
          </span>
          <span className={styles.nameTag}>
            {topPull.name} · {topPull.number}
          </span>
        </figcaption>
      </figure>
    </section>
  )
}
