/** Exercise drawings in the same thick-outline style as the food art. */
const INK = '#1f1629'
const sw = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }

type Kind = 'sofa' | 'shoe' | 'run' | 'bike' | 'rope' | 'music' | 'dumbbell' | 'kettlebell' | 'mat' | 'lotus' | 'breath' | 'circles' | 'roller' | 'stairs'

const BY_ID: Record<string, Kind> = {
  march: 'shoe', 'brisk-walk': 'shoe', stairs: 'stairs', 'step-ups': 'stairs',
  jog: 'run', 'high-knees': 'run', 'mountain-climbers': 'run',
  cycling: 'bike', 'bicycle-crunch': 'bike',
  jacks: 'rope', 'jump-rope': 'rope', burpees: 'rope',
  dance: 'music',
  rows: 'dumbbell', dips: 'dumbbell', pushups: 'dumbbell',
  squats: 'kettlebell', lunges: 'kettlebell', 'wall-sit': 'kettlebell', 'glute-bridge': 'kettlebell',
  plank: 'mat', superman: 'mat',
  yoga: 'lotus', stretch: 'lotus', breathing: 'breath',
  sofa: 'sofa',
  'arm-circles': 'circles', 'hip-circles': 'circles', 'foam-roll': 'roller',
}

function Art({ kind }: { kind: Kind }) {
  switch (kind) {
    case 'sofa':
      return <>
        <rect x="18" y="30" width="64" height="30" rx="10" fill="#d8c6f7" {...sw} />
        <rect x="8" y="46" width="18" height="30" rx="8" fill="#a98be8" {...sw} />
        <rect x="74" y="46" width="18" height="30" rx="8" fill="#a98be8" {...sw} />
        <rect x="24" y="56" width="52" height="20" rx="6" fill="#ffb8d6" {...sw} />
        <path d="M18 76 V84 M82 76 V84" {...sw} />
      </>
    case 'shoe':
    case 'run':
      return <>
        {kind === 'run' && <path d="M8 40 H24 M4 52 H20 M10 64 H22" {...sw} strokeWidth={3.5} />}
        <path d="M26 30 Q34 28 40 34 L52 46 Q70 50 82 56 Q92 62 88 72 H26 Z" fill="#ff7d93" {...sw} />
        <path d="M26 72 H88 Q90 80 82 82 H30 Q24 82 26 72 Z" fill="#fff" {...sw} />
        <path d="M44 44 L50 38 M50 50 L56 44" {...sw} strokeWidth={3} />
      </>
    case 'bike':
      return <>
        <circle cx="26" cy="64" r="16" fill="#a9e0f7" {...sw} />
        <circle cx="74" cy="64" r="16" fill="#a9e0f7" {...sw} />
        <path d="M26 64 L42 40 H66 L74 64 M42 40 L54 64 L66 40 M38 32 H48 M64 40 L60 28 H70" fill="none" {...sw} />
      </>
    case 'rope':
      return <>
        <path d="M24 30 Q50 96 76 30" fill="none" stroke="#ff7d93" strokeWidth="7" strokeLinecap="round" />
        <path d="M24 30 Q50 96 76 30" fill="none" {...sw} strokeWidth={2} />
        <rect x="16" y="12" width="14" height="24" rx="6" fill="#ffe98f" {...sw} />
        <rect x="70" y="12" width="14" height="24" rx="6" fill="#ffe98f" {...sw} />
      </>
    case 'music':
      return <>
        <path d="M40 72 V24 L76 16 V62" fill="none" {...sw} />
        <path d="M40 24 L76 16 V28 L40 36 Z" fill={INK} />
        <ellipse cx="30" cy="72" rx="12" ry="9" fill="#d8c6f7" {...sw} />
        <ellipse cx="66" cy="64" rx="12" ry="9" fill="#ff7d93" {...sw} />
      </>
    case 'dumbbell':
      return <g transform="rotate(-30 50 50)">
        <rect x="30" y="45" width="40" height="10" rx="4" fill="#fff" {...sw} />
        <rect x="14" y="30" width="16" height="40" rx="5" fill="#a98be8" {...sw} />
        <rect x="70" y="30" width="16" height="40" rx="5" fill="#a98be8" {...sw} />
      </g>
    case 'kettlebell':
      return <>
        <path d="M34 40 Q32 16 50 16 Q68 16 66 40" fill="none" {...sw} strokeWidth={7} />
        <path d="M34 40 Q32 16 50 16 Q68 16 66 40" fill="none" stroke="#ffe98f" strokeWidth="2" strokeLinecap="round" />
        <path d="M26 62 Q26 38 50 38 Q74 38 74 62 Q74 86 50 86 Q26 86 26 62 Z" fill="#ff7360" {...sw} />
        <path d="M36 56 Q38 48 46 46" stroke="#fff" strokeWidth="4" strokeLinecap="round" fill="none" />
      </>
    case 'mat':
      return <>
        <path d="M12 70 L68 46 L88 56 L32 82 Z" fill="#95d68b" {...sw} />
        <ellipse cx="74" cy="34" rx="12" ry="16" fill="#95d68b" {...sw} />
        <ellipse cx="74" cy="34" rx="5" ry="8" fill="#fff" {...sw} strokeWidth={3} />
      </>
    case 'lotus':
      return <>
        <path d="M50 78 Q30 60 50 22 Q70 60 50 78 Z" fill="#ffb8d6" {...sw} />
        <path d="M48 78 Q20 74 14 46 Q38 50 48 78 Z" fill="#d8c6f7" {...sw} />
        <path d="M52 78 Q80 74 86 46 Q62 50 52 78 Z" fill="#d8c6f7" {...sw} />
        <path d="M20 84 H80" {...sw} />
      </>
    case 'breath':
      return <>
        <path d="M12 38 H62 Q76 38 76 26 Q76 16 66 16 Q58 16 58 24" fill="none" {...sw} />
        <path d="M12 54 H80 Q92 54 92 66 Q92 76 82 76 Q74 76 74 68" fill="none" {...sw} />
        <path d="M20 70 H52" {...sw} />
        <circle cx="30" cy="22" r="7" fill="#ffe98f" {...sw} strokeWidth={3} />
      </>
    case 'circles':
      return <>
        <path d="M78 46 A28 28 0 1 1 64 24" fill="none" stroke="#a9e0f7" strokeWidth="10" strokeLinecap="round" />
        <path d="M78 46 A28 28 0 1 1 64 24" fill="none" {...sw} strokeWidth={3} />
        <path d="M58 14 L68 24 L56 32" fill="none" {...sw} />
        <circle cx="50" cy="50" r="7" fill="#ff7d93" {...sw} strokeWidth={3} />
      </>
    case 'roller':
      return <>
        <rect x="14" y="34" width="64" height="32" rx="16" fill="#ffbf47" {...sw} />
        <ellipse cx="78" cy="50" rx="10" ry="16" fill="#ffe98f" {...sw} />
        <path d="M30 36 V64 M46 36 V64 M62 36 V64" stroke={INK} strokeWidth="3" opacity="0.4" />
      </>
    case 'stairs':
    default:
      return <>
        <path d="M12 84 V68 H32 V52 H52 V36 H72 V20 H88 V84 Z" fill="#a9e0f7" {...sw} />
        <path d="M18 60 L24 54 M38 44 L44 38" {...sw} strokeWidth={3} />
      </>
  }
}

export default function MoveArt({ id, className = 'size-full' }: { id: string; className?: string }) {
  // 'sofa' is not a move; the wizard uses it for "mostly sitting"
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <Art kind={BY_ID[id] ?? 'stairs'} />
    </svg>
  )
}
