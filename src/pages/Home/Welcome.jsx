import PokeBall from '../../components/art/PokeBall.jsx'
import styles from './Home.module.css'

// The first screen: "Welcome to HOLO VAULT", with Poké Balls for both O's.
// Screen readers get the plain words; the drawn wordmark is hidden from them.
export default function Welcome() {
  return (
    <section className={styles.welcome}>
      <h1 className={styles.wordmarkHeading}>
        <span className="visually-hidden">Welcome to Holo Vault</span>
        <span aria-hidden="true" className={styles.welcomeTo}>
          Welcome to
        </span>
        <span aria-hidden="true" className={styles.wordmark}>
          <span className={styles.word}>
            H<PokeBall top="var(--yellow)" className={styles.letterBall} />L
            <PokeBall top="var(--blue)" className={styles.letterBall} />
          </span>
          <span className={styles.word}>VAULT</span>
        </span>
      </h1>
      <p className={styles.scrollHint} aria-hidden="true">
        Scroll to open the pack
        <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </p>
    </section>
  )
}
