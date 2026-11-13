import type { Meal } from '../data/meals'

/** Flat food drawings in the mascot's style: thick ink outline, pastel fills, one white highlight. */
type Kind = 'bowl' | 'soup' | 'salad' | 'rice' | 'plate' | 'glass' | 'wrap' | 'toast' | 'stack' | 'muffin' | 'sandwich' | 'taco' | 'sushi' | 'pizza' | 'noodles' | 'egg' | 'apple' | 'banana' | 'berry' | 'handful' | 'jar'

const INK = '#1f1629'
const KIND_RULES: [RegExp, Kind][] = [
  [/smoothie/i, 'glass'],
  [/overnight|chia|parfait/i, 'jar'],
  [/wrap|burrito(?! bowl)|pita|roll-ups/i, 'wrap'],
  [/toast|bagel/i, 'toast'],
  [/pancake/i, 'stack'],
  [/muffin/i, 'muffin'],
  [/sandwich|club/i, 'sandwich'],
  [/taco/i, 'taco'],
  [/sushi/i, 'sushi'],
  [/pizza|flatbread/i, 'pizza'],
  [/noodle|zoodle|bolognese|pasta|shells|lasagna|spaghetti/i, 'noodles'],
  [/\begg|omelette|scramble/i, 'egg'],
  [/apple/i, 'apple'],
  [/banana/i, 'banana'],
  [/strawberr|berry blast/i, 'berry'],
  [/trail|edamame|chickpeas|rice cakes|crackers|sticks/i, 'handful'],
  [/salmon & veg|chicken & rice|cod|lemon herb|satay|stir-fry|meatball/i, 'plate'],
  [/soup|curry|chili|porridge/i, 'soup'],
  [/salad|buddha|quinoa/i, 'salad'],
  [/rice|risotto|poke|burrito bowl|fajita|sweet potato/i, 'rice'],
]
const COLOR_RULES: [RegExp, string][] = [
  [/blueberr|berry oats|rainbow berry/i, '#a98be8'],
  [/strawberr|berry/i, '#ff7d93'],
  [/mango|peach|curry|sweet potato/i, '#ffbf47'],
  [/banana|yogurt|cottage|congee|porridge|risotto|oats/i, '#fff1c9'],
  [/green|spinach|salad|edamame|broccoli|veggie|buddha|gado|quinoa|hummus|avocado|pesto|zoodle/i, '#95d68b'],
  [/salmon|shrimp|tuna|poke|sushi/i, '#ff9e80'],
  [/choc|peanut|pb|almond|trail|tempeh|satay/i, '#c08b5c'],
  [/tomato|chili|bolognese|marinara|margherita|pizza|lasagna|fajita|shells/i, '#ff7360'],
  [/bean|lentil|chickpea|falafel|shawarma/i, '#e5b46b'],
  [/mushroom|teriyaki|noodle|beef/i, '#d79b62'],
]

export function artFor(m: Pick<Meal, 'name'>) {
  const kind = KIND_RULES.find(([r]) => r.test(m.name))?.[1] ?? 'bowl'
  const food = COLOR_RULES.find(([r]) => r.test(m.name))?.[1] ?? '#ffd27a'
  return { kind, food }
}

const sw = { stroke: INK, strokeWidth: 4, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const }
const Shine = ({ d }: { d: string }) => <path d={d} fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" opacity="0.85" />

function Dots({ c, pts }: { c: string; pts: [number, number, number][] }) {
  return <>{pts.map(([x, y, r], i) => <circle key={i} cx={x} cy={y} r={r} fill={c} {...sw} strokeWidth={3} />)}</>
}

function Art({ kind, food, dish }: { kind: Kind; food: string; dish: string }) {
  switch (kind) {
    case 'bowl':
      return <>
        <path d="M18 50 Q24 28 50 28 Q76 28 82 50 Z" fill={food} {...sw} />
        <Dots c="#fff" pts={[[38, 40, 5], [56, 36, 4]]} />
        <Dots c="#ff7d93" pts={[[66, 43, 5]]} />
        <path d="M10 50 H90 Q88 84 50 87 Q12 84 10 50 Z" fill={dish} {...sw} />
        <Shine d="M22 60 Q26 74 38 79" />
      </>
    case 'soup':
      return <>
        <path d="M38 22 q-5 -6 0 -12 M52 22 q-5 -6 0 -12 M66 22 q-5 -6 0 -12" fill="none" {...sw} strokeWidth={3} opacity="0.5" />
        <ellipse cx="50" cy="44" rx="38" ry="10" fill={food} {...sw} />
        <Dots c="#95d68b" pts={[[36, 43, 3.5], [60, 41, 3]]} />
        <Dots c="#fff" pts={[[50, 46, 3]]} />
        <path d="M12 44 Q14 84 50 86 Q86 84 88 44" fill={dish} {...sw} />
        <path d="M80 54 Q96 52 92 62" fill="none" {...sw} />
        <Shine d="M22 58 Q26 72 38 78" />
      </>
    case 'salad':
      return <>
        <path d="M18 50 Q14 34 28 30 Q30 18 44 22 Q52 12 62 22 Q76 18 76 32 Q90 36 82 50 Z" fill="#95d68b" {...sw} />
        <path d="M34 34 Q40 40 46 34 M56 30 Q62 36 68 30" fill="none" stroke="#5fae5a" strokeWidth="3" strokeLinecap="round" />
        <Dots c="#ff7360" pts={[[40, 44, 5], [62, 42, 5]]} />
        <Dots c={food} pts={[[52, 46, 4]]} />
        <path d="M10 50 H90 Q88 84 50 87 Q12 84 10 50 Z" fill={dish} {...sw} />
        <Shine d="M22 60 Q26 74 38 79" />
      </>
    case 'rice':
      return <>
        <path d="M18 50 Q20 26 50 26 Q80 26 82 50 Z" fill="#fff" {...sw} />
        <path d="M30 40 l3 -2 M42 34 l3 -2 M58 34 l3 -2 M68 42 l3 -2 M48 44 l3 -2" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.35" />
        <path d="M48 30 Q60 22 72 34 Q66 44 52 42 Q44 38 48 30 Z" fill={food} {...sw} strokeWidth={3} />
        <Dots c="#95d68b" pts={[[34, 38, 4.5]]} />
        <path d="M10 50 H90 Q88 84 50 87 Q12 84 10 50 Z" fill={dish} {...sw} />
        <Shine d="M22 60 Q26 74 38 79" />
      </>
    case 'jar':
      return <>
        <rect x="26" y="14" width="48" height="12" rx="4" fill={dish} {...sw} />
        <path d="M28 26 H72 V80 Q72 88 64 88 H36 Q28 88 28 80 Z" fill="#fff" {...sw} />
        <path d="M31 62 H69 V79 Q69 85 63 85 H37 Q31 85 31 79 Z" fill="#fff1c9" />
        <path d="M31 46 H69 V62 H31 Z" fill={food} />
        <path d="M31 46 Q50 40 69 46" fill="none" {...sw} strokeWidth={3} />
        <path d="M28 26 H72 V80 Q72 88 64 88 H36 Q28 88 28 80 Z" fill="none" {...sw} />
        <Dots c="#ff7d93" pts={[[42, 40, 4], [58, 38, 4]]} />
        <Shine d="M36 34 V52" />
      </>
    case 'glass':
      return <>
        <path d="M58 26 L72 6" {...sw} strokeWidth={5} stroke="#ff7d93" />
        <path d="M58 26 L72 6" fill="none" {...sw} strokeWidth={2} />
        <path d="M27 24 H73 L65 88 H35 Z" fill={food} {...sw} />
        <path d="M27 24 H73 L71 36 H29 Z" fill="#fff" {...sw} strokeWidth={3} />
        <Shine d="M36 44 L39 76" />
      </>
    case 'wrap':
      return <g transform="rotate(-24 50 50)">
        <rect x="14" y="34" width="66" height="34" rx="17" fill="#f6d28e" {...sw} />
        <ellipse cx="74" cy="51" rx="12" ry="17" fill={food} {...sw} />
        <circle cx="74" cy="51" r="6" fill="#95d68b" {...sw} strokeWidth={3} />
        <path d="M30 40 V62 M46 40 V62" stroke={INK} strokeWidth="3" opacity="0.35" strokeLinecap="round" />
      </g>
    case 'toast':
      return <>
        <path d="M20 44 Q16 18 50 18 Q84 18 80 44 V84 H20 Z" fill="#e3a65c" {...sw} />
        <path d="M28 46 Q26 28 50 28 Q74 28 72 46 V76 H28 Z" fill="#ffe1a8" />
        <path d="M30 50 Q40 38 52 46 Q64 36 70 52 Q66 66 50 64 Q34 68 30 50 Z" fill={food} {...sw} strokeWidth={3} />
        <Dots c="#fff" pts={[[46, 52, 3.5]]} />
      </>
    case 'stack':
      return <>
        {[72, 58, 44].map((y) => <ellipse key={y} cx="50" cy={y} rx="34" ry="11" fill="#f2b766" {...sw} />)}
        <path d="M26 42 Q50 30 74 42 L72 52 Q66 46 62 56 Q56 46 48 54 Q40 46 30 52 Z" fill="#b5651d" opacity="0.9" />
        <rect x="42" y="30" width="16" height="10" rx="3" fill="#fff1c9" {...sw} strokeWidth={3} />
        <Dots c={food} pts={[[30, 66, 4], [70, 68, 4]]} />
      </>
    case 'muffin':
      return <>
        <path d="M22 52 Q20 22 50 22 Q80 22 78 52 Z" fill="#f2c27b" {...sw} />
        <Dots c={food} pts={[[38, 36, 5], [58, 32, 5], [62, 46, 4.5], [44, 47, 4]]} />
        <path d="M24 52 H76 L68 86 H32 Z" fill="#ffb8d6" {...sw} />
        <path d="M38 56 L40 84 M50 56 V84 M62 56 L60 84" stroke={INK} strokeWidth="3" strokeLinecap="round" />
      </>
    case 'sandwich':
      return <>
        <path d="M14 76 L50 18 L86 76 Z" fill="#f6d28e" {...sw} />
        <path d="M20 66 H80" stroke="#95d68b" strokeWidth="8" strokeLinecap="round" />
        <path d="M24 58 H76" stroke={food} strokeWidth="8" strokeLinecap="round" />
        <path d="M14 76 L50 18 L86 76 Z" fill="none" {...sw} />
        <path d="M10 76 H90 Q90 86 80 86 H20 Q10 86 10 76 Z" fill="#e3a65c" {...sw} />
      </>
    case 'taco':
      return <>
        <path d="M18 66 Q22 36 42 32 Q50 24 60 32 Q80 36 82 66" fill="#95d68b" {...sw} />
        <Dots c={food} pts={[[40, 40, 6], [60, 40, 6]]} />
        <path d="M12 70 Q14 34 50 34 Q86 34 88 70 Z" fill="#ffd27a" {...sw} />
        <Shine d="M24 60 Q28 46 40 42" />
      </>
    case 'sushi':
      return <>
        {[[30, 58], [70, 58], [50, 36]].map(([x, y]) => <g key={`${x}`}>
          <circle cx={x} cy={y} r="19" fill="#3c3446" {...sw} />
          <circle cx={x} cy={y} r="13" fill="#fff" />
          <circle cx={x} cy={y} r="6" fill={food} {...sw} strokeWidth={3} />
        </g>)}
      </>
    case 'pizza':
      return <>
        <path d="M50 88 L18 24 Q50 10 82 24 Z" fill="#ffe08a" {...sw} />
        <path d="M18 24 Q50 10 82 24 L78 32 Q50 20 22 32 Z" fill="#e3a65c" {...sw} strokeWidth={3} />
        <Dots c={food} pts={[[44, 42, 6], [58, 52, 5.5], [48, 66, 5]]} />
        <path d="M60 36 q4 -4 8 0 q-4 4 -8 0" fill="#95d68b" {...sw} strokeWidth={2.5} />
      </>
    case 'noodles':
      return <>
        <path d="M58 12 L46 50 M70 14 L54 50" {...sw} strokeWidth={4} />
        <path d="M18 50 Q22 34 50 32 Q78 34 82 50 Z" fill={food} {...sw} />
        <path d="M30 46 q5 -8 10 0 t10 0 t10 0 t10 0" fill="none" stroke="#fff1c9" strokeWidth="4" strokeLinecap="round" />
        <path d="M10 50 H90 Q88 84 50 87 Q12 84 10 50 Z" fill={dish} {...sw} />
        <Shine d="M22 60 Q26 74 38 79" />
      </>
    case 'egg':
      return <>
        <circle cx="50" cy="52" r="38" fill="#fff" {...sw} />
        <path d="M28 52 Q24 32 44 30 Q58 22 68 36 Q80 46 70 62 Q62 76 44 72 Q28 70 28 52 Z" fill="#fff" {...sw} strokeWidth={3} />
        <circle cx="50" cy="50" r="12" fill="#ffc145" {...sw} strokeWidth={3} />
        <path d="M46 46 q3 -3 6 -2" stroke="#fff" strokeWidth="3" strokeLinecap="round" fill="none" />
        <Dots c="#95d68b" pts={[[72, 70, 4], [30, 70, 3.5]]} />
      </>
    case 'apple':
      return <>
        <path d="M50 30 Q36 20 24 34 Q12 52 26 74 Q38 92 50 82 Q62 92 74 74 Q88 52 76 34 Q64 20 50 30 Z" fill="#ff6b6b" {...sw} />
        <path d="M50 30 Q50 18 56 12" {...sw} fill="none" />
        <path d="M54 22 Q66 10 74 18 Q64 28 54 22 Z" fill="#95d68b" {...sw} strokeWidth={3} />
        <Shine d="M30 46 Q30 38 36 34" />
      </>
    case 'banana':
      return <>
        <path d="M18 34 Q24 78 70 80 Q86 78 84 70 Q50 72 34 30 Q30 22 22 26 Z" fill="#ffe066" {...sw} />
        <path d="M84 70 L90 66" {...sw} />
        <Dots c="#c08b5c" pts={[[62, 70, 3]]} />
      </>
    case 'berry':
      return <>
        <path d="M50 88 Q18 64 22 40 Q26 26 50 30 Q74 26 78 40 Q82 64 50 88 Z" fill="#ff6b81" {...sw} />
        <path d="M34 28 L42 18 L50 26 L58 18 L66 28 Q50 36 34 28 Z" fill="#95d68b" {...sw} strokeWidth={3} />
        {[[40, 46], [58, 46], [50, 60], [38, 62], [62, 62], [50, 74]].map(([x, y]) => <ellipse key={`${x}${y}`} cx={x} cy={y} rx="2" ry="3" fill="#fff1c9" />)}
      </>
    case 'handful':
      return <>
        <Dots c={food} pts={[[34, 44, 8], [50, 38, 8], [66, 44, 8], [42, 50, 7], [58, 50, 7]]} />
        <path d="M14 52 H86 Q84 80 50 83 Q16 80 14 52 Z" fill={dish} {...sw} />
        <Shine d="M24 60 Q28 72 38 76" />
      </>
    case 'plate':
    default:
      return <>
        <circle cx="50" cy="50" r="40" fill="#fff" {...sw} />
        <circle cx="50" cy="50" r="30" fill="none" stroke={INK} strokeWidth="2.5" opacity="0.25" />
        <path d="M28 52 Q30 34 50 36 Q62 30 70 42 Q76 56 62 62 Q46 70 34 64 Q26 60 28 52 Z" fill={food} {...sw} strokeWidth={3} />
        <path d="M40 66 q6 -10 14 -4 q6 4 14 -2" stroke="#95d68b" strokeWidth="7" strokeLinecap="round" fill="none" />
        <Dots c="#fff1c9" pts={[[44, 48, 4]]} />
      </>
  }
}

export default function FoodArt({ meal, dish = '#ffb8d6', className = 'size-full' }: { meal: Pick<Meal, 'name'>; dish?: string; className?: string }) {
  const { kind, food } = artFor(meal)
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <Art kind={kind} food={food} dish={dish} />
    </svg>
  )
}
