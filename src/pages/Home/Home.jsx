import { useRef } from 'react'
import PackSeal from '../../components/art/PackSeal.jsx'
import PokeBall from '../../components/art/PokeBall.jsx'
import { usePackOpen } from '../../hooks/usePackOpen.js'
import About from './About.jsx'
import Hero from './Hero.jsx'
import TopCards from './TopCards.jsx'
import Welcome from './Welcome.jsx'
import styles from './Home.module.css'

// The top of the home page is one red booster pack: the welcome screen and hero
// inside it, and a crimped seal at its bottom. When the seal scrolls into view it
// tears away and the top cards drop out from behind the pack.
export default function Home() {
  const sealRef = useRef(null)
  const open = usePackOpen(sealRef)

  return (
    <>
      <title>Holo Vault · Pokémon TCG singles at market price</title>
      <div className={styles.pack}>
        <PokeBall variant="outline" className={`${styles.ball} ${styles.ballOne}`} />
        <PokeBall variant="outline" className={`${styles.ball} ${styles.ballTwo}`} />
        <PokeBall variant="outline" className={`${styles.ball} ${styles.ballThree}`} />
        <PokeBall variant="outline" className={`${styles.ball} ${styles.ballFour}`} />
        <Welcome />
        <Hero />
      </div>
      <div ref={sealRef}>
        <PackSeal open={open} />
      </div>
      <TopCards open={open} />
      <About />
    </>
  )
}
