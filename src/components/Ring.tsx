import type { ReactNode } from 'react'

/** progress ring with a chunky ink outline, matching the mascot's line style */
export default function Ring({ value, size = 180, stroke = 18, color = 'var(--color-pink-deep)', children }: { value: number; size?: number; stroke?: number; color?: string; children?: ReactNode }) {
  const r = (size - stroke) / 2 - 3
  const c = 2 * Math.PI * r
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r + stroke / 2} fill="none" stroke="var(--color-ink)" strokeWidth="2.5" />
        <circle cx={size / 2} cy={size / 2} r={r - stroke / 2} fill="none" stroke="var(--color-ink)" strokeWidth="2.5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-lilac)" strokeWidth={stroke - 2.5} opacity="0.45" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke - 2.5} strokeDasharray={c} strokeDashoffset={c * (1 - Math.min(1, value))} strokeLinecap="butt" style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.3,1.3,0.5,1)' }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  )
}
