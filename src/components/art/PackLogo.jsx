// Booster pack with crimped edges and a torn top-right corner showing silver foil.
const PACK_OUTLINE =
  '4,6 10,2 16,6 22,2 28,6 34,2 40,6 46,2 52,6 56,11 60,8 63,15 68,13 70,20 76,23 ' +
  '76,94 70,98 64,94 58,98 52,94 46,98 40,94 34,98 28,94 22,98 16,94 10,98 4,94'
const FOIL = '52,6 56,11 60,8 63,15 68,13 70,20 76,23 76,29 69,26 66,20 62,21 58,14 55,16 51,10'

export default function PackLogo({ className, strokeWidth = 5 }) {
  return (
    <svg viewBox="0 0 80 100" aria-hidden="true" className={className} overflow="visible">
      <polygon points={PACK_OUTLINE} fill="var(--yellow)" />
      <polygon points={FOIL} fill="var(--foil)" />
      <g stroke="var(--ink)" strokeWidth={strokeWidth} strokeLinejoin="round">
        <polygon points={PACK_OUTLINE} fill="none" />
        <path d="M4 17H59M4 83H76" strokeWidth={strokeWidth * 0.8} />
        <circle cx="40" cy="50" r="15" fill="var(--white)" strokeWidth={strokeWidth * 0.9} />
        <path d="M25 50a15 15 0 0 1 30 0Z" fill="var(--red)" strokeWidth={strokeWidth * 0.9} />
        <circle cx="40" cy="50" r="5" fill="var(--white)" strokeWidth={strokeWidth * 0.8} />
      </g>
    </svg>
  )
}
