import { Link } from 'react-router'
import PokeBall from '../../components/art/PokeBall.jsx'
import { SETS, countCardsInSet } from '../../lib/cards.js'
import styles from './About.module.css'

const SET_TINTS = ['var(--tint-red)', 'var(--tint-blue)', 'var(--tint-yellow)', 'var(--tint-grey)']

const FEATURES = [
  { colour: 'var(--yellow)', title: 'Market priced', text: 'Prices follow TCGplayer market data, not guesswork.' },
  {
    colour: 'var(--red)',
    title: 'Only the good stuff',
    text: 'Double Rare and up, from ex cards to Special Illustration Rares.',
  },
  {
    colour: 'var(--blue)',
    title: 'Fan-favourite sets',
    text: '151, Prismatic Evolutions, Surging Sparks and Obsidian Flames.',
  },
  {
    colour: 'var(--ink)',
    title: 'Sleeved and protected',
    text: 'Every card is sleeved and stored in a rigid top loader, so it reaches you in the same condition it left our case.',
  },
]

export default function About() {
  return (
    <section id="about" aria-labelledby="about-title" className={`dotted ${styles.section}`}>
      <div className={styles.inner}>
        <PokeBall variant="outline" className={styles.backdrop} />
        <div className={styles.intro}>
          <p className={styles.pill}>About</p>
          <h2 id="about-title" className={styles.title}>
            A card shop built for collectors
          </h2>
          <p className={styles.text}>
            Holo Vault sells single cards, so you can skip the packs and go straight for the one you want. Every card
            is priced from TCGplayer market data, so you always know you are paying what the card is worth.
          </p>
          <ul className={styles.sets} aria-label="Sets we stock">
            {SETS.map((set, index) => (
              <li key={set.slug}>
                <Link
                  to={`/shop?set=${set.slug}`}
                  className={styles.setLink}
                  style={{ background: SET_TINTS[index % SET_TINTS.length] }}
                >
                  {set.name} · {countCardsInSet(set.slug)}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <ul className={styles.features}>
          {FEATURES.map((feature) => (
            <li key={feature.title} className={styles.feature}>
              <PokeBall top={feature.colour} className={styles.featureBall} />
              <h3 className={styles.featureTitle}>{feature.title}</h3>
              <p className={styles.featureText}>{feature.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
