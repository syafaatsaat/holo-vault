import styles from './TownMap.module.css'

// An illustrated, sticker-style map of Rustboro City for the Visit Us panel:
// Granite Way with Holo Vault pinned on it, a few landmarks, and the roads out
// of town. Original artwork, not the in-game map.

const STONE = '#c9c2b3'
const TREE = '#6cc070'
const TREE_LIGHT = '#9ad89a'
const GRASS = '#dcefd2'
const WATER = '#bcd6fa'

function Building({ x, y, w, h, roof, roofHeight = 28, windows = 2 }) {
  const gap = w / (windows + 1)
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx="10" fill={roof} />
      <rect x={x} y={y + roofHeight} width={w} height={h - roofHeight} fill="var(--white)" />
      <path d={`M${x} ${y + roofHeight}H${x + w}`} stroke="var(--ink)" strokeWidth="3" />
      {Array.from({ length: windows }, (_, i) => (
        <rect
          key={i}
          x={x + gap * (i + 1) - 8}
          y={y + roofHeight + 10}
          width="16"
          height="14"
          rx="3"
          fill="var(--tint-blue)"
          stroke="var(--ink)"
          strokeWidth="2"
        />
      ))}
      <rect x={x + w / 2 - 8} y={y + h - 20} width="16" height="20" rx="3" fill="var(--ink)" />
      <rect x={x} y={y} width={w} height={h} rx="10" fill="none" stroke="var(--ink)" strokeWidth="3" />
    </g>
  )
}

function Tree({ x, y, r = 16 }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={TREE} stroke="var(--ink)" strokeWidth="3" />
      <circle cx={x - r * 0.35} cy={y - r * 0.35} r={r * 0.3} fill={TREE_LIGHT} />
    </g>
  )
}

function Rock({ points }) {
  return <polygon points={points} fill={STONE} stroke="var(--ink)" strokeWidth="3" strokeLinejoin="round" />
}

// A white pill with a dark outline, sized to fit its text
function Label({ x, y, width, children }) {
  return (
    <g>
      <rect x={x - width / 2} y={y - 14} width={width} height="28" rx="14" fill="var(--white)" stroke="var(--ink)" strokeWidth="2.5" />
      <text x={x} y={y + 5} textAnchor="middle" className={styles.label}>
        {children}
      </text>
    </g>
  )
}

// A road: a dark outline under a white surface
function Road({ d }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="var(--ink)" strokeWidth="32" />
      <path d={d} stroke="var(--white)" strokeWidth="26" />
    </g>
  )
}

export default function TownMap({ className }) {
  return (
    <svg
      viewBox="0 0 560 400"
      role="img"
      aria-labelledby="town-map-title"
      className={`${styles.map} ${className ?? ''}`}
    >
      <title id="town-map-title">
        Map of Rustboro City: Holo Vault is on Granite Way, near the Pokémon Center, the Poké Mart and the Gym.
      </title>

      {/* Ground, with grassy patches under the trees */}
      <rect width="560" height="400" fill="#f1ece0" />
      <rect x="470" y="40" width="110" height="150" rx="30" fill={GRASS} />
      <rect x="400" y="240" width="180" height="180" rx="40" fill={GRASS} />
      <rect x="-20" y="320" width="150" height="100" rx="30" fill={GRASS} />

      {/* Roads: Granite Way across town, and the road from Route 104 to the north */}
      <Road d="M-20 210H580" />
      <Road d="M300 -20V420" />
      <text x="96" y="215" textAnchor="middle" className={styles.street}>
        Granite Way
      </text>
      <text x="482" y="215" textAnchor="middle" className={styles.street}>
        Route 116 →
      </text>
      <text x="0" y="0" textAnchor="middle" className={styles.street} transform="translate(305 340) rotate(-90)">
        ← Route 104
      </text>

      {/* Rustboro Gym, with granite boulders beside it */}
      <Building x={40} y={40} w={150} h={110} roof="var(--ink)" roofHeight={32} windows={3} />
      <circle cx="115" cy="56" r="9" fill="var(--yellow)" stroke="var(--white)" strokeWidth="2" />
      <Rock points="206,70 226,54 250,62 256,90 232,104 210,96" />
      <Rock points="228,130 246,118 268,126 266,150 244,158" />
      <Label x={115} y={172} width={56}>
        Gym
      </Label>

      {/* Pokémon Center */}
      <Building x={340} y={64} w={120} h={92} roof="var(--red)" windows={2} />
      <Label x={400} y={176} width={136}>
        Pokémon Center
      </Label>

      {/* Trees and a compass in the north-east */}
      <Tree x={500} y={78} />
      <Tree x={536} y={104} r={18} />
      <Tree x={498} y={140} r={14} />
      <Tree x={540} y={160} r={13} />
      <g transform="translate(528 34)">
        <circle r="17" fill="var(--white)" stroke="var(--ink)" strokeWidth="2.5" />
        <path d="M0 -12L5 2H-5Z" fill="var(--red)" />
        <text y="12" textAnchor="middle" className={styles.compass}>
          N
        </text>
      </g>

      {/* Houses and trees in the south-west */}
      <Building x={36} y={248} w={84} h={60} roof="var(--yellow)" roofHeight={22} windows={2} />
      <Tree x={40} y={350} />
      <Tree x={82} y={372} r={18} />

      {/* Holo Vault, with the pin */}
      <Building x={150} y={248} w={112} h={82} roof="var(--red)" windows={2} />
      <g transform="translate(206 258)">
        <circle r="9" fill="var(--white)" stroke="var(--ink)" strokeWidth="2.5" />
        <path d="M-9 0H9" stroke="var(--ink)" strokeWidth="2.5" />
        <circle r="3.5" fill="var(--white)" stroke="var(--ink)" strokeWidth="2" />
      </g>
      <Label x={206} y={354} width={104}>
        Holo Vault
      </Label>
      <g transform="translate(206 244)">
        <ellipse cy="2" rx="10" ry="4" fill="var(--ink)" opacity="0.25" />
        <path
          d="M0 0C-12 -16 -20 -26 -20 -38A20 20 0 0 1 20 -38C20 -26 12 -16 0 0Z"
          fill="var(--red)"
          stroke="var(--ink)"
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <circle cy="-38" r="7.5" fill="var(--white)" stroke="var(--ink)" strokeWidth="2.5" />
      </g>

      {/* Poké Mart */}
      <Building x={336} y={248} w={100} h={72} roof="var(--blue)" windows={2} />
      <Label x={386} y={342} width={92}>
        Poké Mart
      </Label>

      {/* Pond and trees in the south-east */}
      <ellipse cx="496" cy="320" rx="50" ry="36" fill={WATER} stroke="var(--ink)" strokeWidth="3" />
      <path d="M474 312q6 -6 12 0t12 0M490 330q6 -6 12 0t12 0" fill="none" stroke="var(--white)" strokeWidth="3" strokeLinecap="round" />
      <Tree x={452} y={378} r={15} />
      <Tree x={540} y={376} r={17} />
      <Tree x={548} y={268} r={14} />
    </svg>
  )
}
