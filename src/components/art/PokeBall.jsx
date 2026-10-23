// Decorative Poké Ball. `variant="solid"` is the coloured sticker version;
// `variant="outline"` is the faint line art used in backgrounds.
export default function PokeBall({ variant = 'solid', top = 'var(--red)', className, style }) {
  if (variant === 'outline') {
    return (
      <svg viewBox="0 0 100 100" aria-hidden="true" className={className} style={style}>
        <g fill="none" stroke="currentColor" strokeWidth="3">
          <circle cx="50" cy="50" r="46" />
          <path d="M4 50h33M63 50h33" />
          <circle cx="50" cy="50" r="13" />
        </g>
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 100" aria-hidden="true" className={className} style={style}>
      <g stroke="var(--ink)" strokeWidth="7">
        <circle cx="50" cy="50" r="45" fill="var(--white)" />
        <path d="M5 50a45 45 0 0 1 90 0Z" fill={top} />
        <path d="M5 50h90" />
        <circle cx="50" cy="50" r="14" fill="var(--white)" />
      </g>
    </svg>
  )
}
