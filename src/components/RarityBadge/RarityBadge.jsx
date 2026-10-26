import styles from './RarityBadge.module.css'

const variants = {
  'Special Illustration Rare': styles.special,
  'Hyper Rare': styles.hyper,
  'Illustration Rare': styles.illustration,
  'Ultra Rare': styles.ultra,
  'Double Rare': styles.double,
  'ACE SPEC Rare': styles.aceSpec,
}

// The abbreviations collectors use, for badges too narrow for the full name
const shortNames = {
  'Special Illustration Rare': 'SIR',
  'Hyper Rare': 'HR',
  'Illustration Rare': 'IR',
  'Ultra Rare': 'UR',
  'Double Rare': 'RR',
  'ACE SPEC Rare': 'ACE',
}

// With `shortOnPhones`, small screens show the abbreviation; screen readers
// still get the full name.
export default function RarityBadge({ rarity, shortOnPhones = false }) {
  const short = shortOnPhones && shortNames[rarity]
  return (
    <span className={`${styles.badge} ${variants[rarity] ?? ''} ${short ? styles.shortable : ''}`}>
      {short ? (
        <>
          <span className={styles.full}>{rarity}</span>
          <span className={styles.short} aria-hidden="true">
            {short}
          </span>
        </>
      ) : (
        rarity
      )}
    </span>
  )
}
