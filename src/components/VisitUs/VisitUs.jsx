import styles from './VisitUs.module.css'

// A Poké Ball-shaped panel: red top, dark band with a centre button, white bottom.
// The store details are fictional; see docs/design/DESIGN_NOTES.md.
export default function VisitUs() {
  return (
    <section id="visit" aria-labelledby="visit-title" className={`dotted ${styles.section}`}>
      <div className={styles.panel}>
        <div className={styles.top}>
          <p className={styles.eyebrow}>Visit us</p>
          <h2 id="visit-title" className={styles.title}>
            See the cards in person
          </h2>
          <p className={styles.intro}>Drop by the shop in Rustboro City to check a card up close before you buy.</p>
        </div>
        <div className={styles.band} aria-hidden="true">
          <span className={styles.button}>
            <svg viewBox="0 0 24 24" width="30" height="30" fill="none" stroke="var(--red)" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
          </span>
        </div>
        <div className={styles.bottom}>
          <dl className={styles.details}>
            <div>
              <dt>Address</dt>
              <dd>
                8 Granite Way, Rustboro City
                <br />
                Hoenn Region
              </dd>
            </div>
            <div>
              <dt>Opening hours</dt>
              <dd>Open daily, 11:00 am – 9:00 pm</dd>
            </div>
            <div>
              <dt>Contact</dt>
              <dd>
                <a href="mailto:holovault@pokemail.com">holovault@pokemail.com</a>
                <br />
                (0151) 555 0384
              </dd>
            </div>
          </dl>
          <div className={styles.map} role="img" aria-label="Map of Rustboro City (artwork coming soon)">
            Map placeholder
            <br />
            (Rustboro City town map art)
          </div>
        </div>
      </div>
    </section>
  )
}
