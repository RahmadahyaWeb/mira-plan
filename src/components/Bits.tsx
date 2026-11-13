import type { ReactNode } from 'react'
import type { Slot } from '../data/meals'
import type { MoveKind } from '../data/exercises'

export const SLOT_COLOR: Record<Slot, string> = { breakfast: 'bg-butter', lunch: 'bg-sky', snack: 'bg-lilac', dinner: 'bg-pink' }
export const KIND_COLOR: Record<MoveKind, string> = { warmup: 'bg-butter', cardio: 'bg-pink', strength: 'bg-sky', cooldown: 'bg-lilac' }
export const SLOT_LABEL: Record<Slot, string> = { breakfast: 'Breakfast', lunch: 'Lunch', snack: 'Snack', dinner: 'Dinner' }

/** drawn art (or an emoji) on a colored disc with an ink rim */
export function Plate({ emoji, art, color, size = 56 }: { emoji?: string; art?: ReactNode; color: string; size?: number }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full border-[2.5px] border-ink ${color}`} style={{ width: size, height: size, fontSize: size * 0.5 }} aria-hidden="true">
      {art ? (size >= 160
        // hero size: a white plate with a rim sits on the colored disc
        ? <span className="grid place-items-center rounded-full border-[2.5px] border-ink bg-paper" style={{ width: size * 0.8, height: size * 0.8 }}>
            <span className="grid place-items-center rounded-full border-2 border-ink/15" style={{ width: size * 0.66, height: size * 0.66 }}><span style={{ width: size * 0.6, height: size * 0.6 }}>{art}</span></span>
          </span>
        : <span style={{ width: size * 0.8, height: size * 0.8 }}>{art}</span>)
        : <span className="grid place-items-center rounded-full bg-paper/70" style={{ width: size * 0.74, height: size * 0.74 }}>{emoji}</span>}
    </span>
  )
}

export const DISH: Record<Slot, string> = { breakfast: '#ffb8d6', lunch: '#ffe98f', snack: '#a9e0f7', dinner: '#d8c6f7' }

/** speech bubble with a tail pointing toward the mascot */
export function Bubble({ children, side = 'left', className = '' }: { children: ReactNode; side?: 'left' | 'right' | 'bottom'; className?: string }) {
  const tail = side === 'left' ? 'left-[-11px] top-1/2 -translate-y-1/2 rotate-45 border-l-[2.5px] border-b-[2.5px]'
    : side === 'right' ? 'right-[-11px] top-1/2 -translate-y-1/2 rotate-45 border-r-[2.5px] border-t-[2.5px]'
    : 'bottom-[-11px] left-10 rotate-45 border-r-[2.5px] border-b-[2.5px]'
  return (
    <div className={`relative rounded-2xl border-[2.5px] border-ink bg-paper px-4 py-3 font-display text-lg font-medium leading-snug shadow-pop-sm ${className}`} role="status">
      {children}
      <span className={`absolute size-5 border-ink bg-paper ${tail}`} aria-hidden="true" />
    </div>
  )
}

/** hand-drawn underline swoosh */
export function Swoosh({ className = '', color = 'var(--color-pink-deep)' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 300 24" preserveAspectRatio="none" className={className} aria-hidden="true">
      <path d="M4 16 C 60 6, 130 4, 196 9 S 280 14, 296 8" fill="none" stroke={color} strokeWidth="9" strokeLinecap="round" />
    </svg>
  )
}

export const fmt = (n: number) => Math.round(n).toLocaleString('en-US')
