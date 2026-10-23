import styles from './VisitUs.module.css'

// The store details are fictional; see docs/design/DESIGN_NOTES.md.
export default function VisitUs() {
  return (
    <section id="visit" aria-labelledby="visit-title" className={styles.section}>
      <p className={styles.eyebrow}>Visit us</p>
      <h2 id="visit-title">See the cards in person</h2>
      <p>Drop by the shop in Rustboro City to check a card up close before you buy.</p>
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
    </section>
  )
}
