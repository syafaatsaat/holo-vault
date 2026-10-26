import styles from './RarityBadge.module.css'

const variants = {
  'Special Illustration Rare': styles.special,
  'Hyper Rare': styles.hyper,
  'Illustration Rare': styles.illustration,
  'Ultra Rare': styles.ultra,
  'Double Rare': styles.double,
  'ACE SPEC Rare': styles.aceSpec,
}

export default function RarityBadge({ rarity }) {
  return <span className={`${styles.badge} ${variants[rarity] ?? ''}`}>{rarity}</span>
}
