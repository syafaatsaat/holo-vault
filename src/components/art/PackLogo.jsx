import { useId } from 'react'

// Booster pack outline (crimped top and bottom, torn top-right corner) filled like
// a Poké Ball: red top, white bottom, dark middle band and centre button. The pack
// shape is used as a mask, so the ball pattern follows the crimps and the tear.
const PACK_OUTLINE =
  '4,6 10,2 16,6 22,2 28,6 34,2 40,6 46,2 52,6 56,11 60,8 63,15 68,13 70,20 76,23 ' +
  '76,94 70,98 64,94 58,98 52,94 46,98 40,94 34,98 28,94 22,98 16,94 10,98 4,94'

export default function PackLogo({ className, strokeWidth = 5 }) {
  // Unique per instance: the logo can appear more than once on a page
  const clipId = useId()

  return (
    <svg viewBox="0 0 80 100" aria-hidden="true" className={className} overflow="visible">
      <defs>
        <clipPath id={clipId}>
          <polygon points={PACK_OUTLINE} />
        </clipPath>
      </defs>
      {/* Thin white rim outside the outline, so the red top stands out on the red navbar */}
      <polygon
        points={PACK_OUTLINE}
        fill="none"
        stroke="var(--white)"
        strokeWidth={strokeWidth * 2.4}
        strokeLinejoin="round"
      />
      <g clipPath={`url(#${clipId})`}>
        <rect x="0" y="0" width="80" height="50" fill="var(--red)" />
        <rect x="0" y="50" width="80" height="50" fill="var(--white)" />
        <rect x="0" y={50 - strokeWidth * 0.8} width="80" height={strokeWidth * 1.6} fill="var(--ink)" />
      </g>
      <g stroke="var(--ink)" strokeLinejoin="round">
        <circle cx="40" cy="50" r="14" fill="var(--white)" strokeWidth={strokeWidth * 1.2} />
        <circle cx="40" cy="50" r="5.5" fill="var(--white)" strokeWidth={strokeWidth * 0.7} />
        <polygon points={PACK_OUTLINE} fill="none" strokeWidth={strokeWidth} />
      </g>
    </svg>
  )
}
