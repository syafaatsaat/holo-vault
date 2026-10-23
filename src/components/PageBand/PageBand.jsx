import CrimpEdge from '../art/CrimpEdge.jsx'
import PokeBall from '../art/PokeBall.jsx'
import styles from './PageBand.module.css'

// The short red pack band at the top of the Shop, Cart and not-found pages.
// `title` is the heading, with `highlight` (if any) shown in yellow after it.
export default function PageBand({ eyebrow, title, highlight, children }) {
  return (
    <>
      <div className={styles.band}>
        <PokeBall variant="outline" className={`${styles.ball} ${styles.ballLeft}`} />
        <PokeBall variant="outline" className={`${styles.ball} ${styles.ballRight}`} />
        <div className={styles.content}>
          {eyebrow && <p className={styles.eyebrow}>{eyebrow}</p>}
          <h1 className={styles.title}>
            {title}
            {highlight && <> <span className={styles.highlight}>{highlight}</span></>}
          </h1>
          {children && <div className={styles.description}>{children}</div>}
        </div>
      </div>
      <CrimpEdge direction="down" />
    </>
  )
}
