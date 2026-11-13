import { MEALS, MEAL_BY_ID, fitsDiet, type Diet, type Slot } from '../data/meals'
import { MOVE_BY_ID, movesOf, type MoveKind } from '../data/exercises'
import { kcalTarget, type Goal, type Profile } from './calc'

export interface PlanMeal { slot: Slot; id: string }
export interface Workout { title: string; rest: boolean; moves: string[] }
export interface PlanDay { meals: PlanMeal[]; scale: number; workout: Workout }
export interface Plan { startKey: string; target: number; seed: number; days: PlanDay[] }

const rng = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}

const shuffle = <T,>(a: T[], r: () => number) => {
  const b = [...a]
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(r() * (i + 1))
    ;[b[i], b[j]] = [b[j], b[i]]
  }
  return b
}

export const poolFor = (slot: Slot, diet: Diet) => MEALS.filter((m) => m.slot === slot && fitsDiet(m, diet))

export const dayKcal = (meals: PlanMeal[]) => meals.reduce((s, m) => s + MEAL_BY_ID[m.id].kcal, 0)

/** one portion factor per day so the day lands on target; steps of 0.05 */
export const fitScale = (meals: PlanMeal[], target: number) =>
  Math.min(2.2, Math.max(0.6, Math.round((target / dayKcal(meals)) * 20) / 20))

const WORKOUT_PATTERN: Record<3 | 4 | 5, number[]> = { 3: [0, 2, 4], 4: [0, 1, 3, 5], 5: [0, 1, 2, 4, 5] }
type Focus = 'cardio' | 'strength' | 'mixed'
const FOCUS: Record<Goal, Focus[]> = {
  lose: ['cardio', 'mixed', 'cardio', 'strength', 'mixed'],
  maintain: ['mixed', 'strength', 'cardio', 'mixed', 'strength'],
  gain: ['strength', 'strength', 'mixed', 'strength', 'strength'],
}
const RECIPE: Record<Focus, [string, Partial<Record<MoveKind, number>>]> = {
  cardio: ['Sparkle Cardio', { warmup: 1, cardio: 1, strength: 2, cooldown: 1 }],
  strength: ['Rainbow Strength', { warmup: 1, strength: 4, cooldown: 1 }],
  mixed: ['Unicorn Circuit', { warmup: 1, cardio: 1, strength: 3, cooldown: 1 }],
}

export function generatePlan(p: Profile, startKey: string, seed = Date.now() % 1e9): Plan {
  const r = rng(seed)
  const target = kcalTarget(p)
  const snacks = target > 3200 ? 3 : target > 2400 ? 2 : 1
  const pools = Object.fromEntries((['breakfast', 'lunch', 'snack', 'dinner'] as Slot[]).map((s) => [s, shuffle(poolFor(s, p.diet), r)])) as Record<Slot, ReturnType<typeof poolFor>>
  const movePools = Object.fromEntries((['warmup', 'cardio', 'strength', 'cooldown'] as MoveKind[]).map((k) => [k, shuffle(movesOf(k), r)])) as Record<MoveKind, ReturnType<typeof movesOf>>
  const cursor: Record<MoveKind, number> = { warmup: 0, cardio: 0, strength: 0, cooldown: 0 }
  const take = (k: MoveKind) => movePools[k][cursor[k]++ % movePools[k].length].id

  let workoutN = 0
  const days = Array.from({ length: 7 }, (_, d): PlanDay => {
    const pick = (s: Slot, i: number) => ({ slot: s, id: pools[s][i % pools[s].length].id })
    const meals: PlanMeal[] = [pick('breakfast', d), pick('snack', d * snacks), pick('lunch', d), pick('dinner', d)]
    for (let i = 1; i < snacks; i++) meals.splice(2 + i, 0, pick('snack', d * snacks + i))

    let workout: Workout
    if (WORKOUT_PATTERN[p.workoutDays].includes(d)) {
      const [title, recipe] = RECIPE[FOCUS[p.goal][workoutN++ % 5]]
      const moves = (Object.entries(recipe) as [MoveKind, number][]).flatMap(([k, n]) => Array.from({ length: n }, () => take(k)))
      workout = { title, rest: false, moves }
    } else {
      workout = { title: 'Rest & Recharge', rest: true, moves: ['brisk-walk', take('cooldown')] }
    }
    return { meals, scale: fitScale(meals, target), workout }
  })
  return { startKey, target, seed, days }
}

/** replace one meal with the next one in its pool that is not already on that day */
export function swapMeal(plan: Plan, dayIdx: number, mealIdx: number, diet: Diet): Plan {
  const day = plan.days[dayIdx]
  const cur = day.meals[mealIdx]
  const pool = poolFor(cur.slot, diet)
  const used = new Set(day.meals.map((m) => m.id))
  const start = pool.findIndex((m) => m.id === cur.id)
  const next = Array.from({ length: pool.length }, (_, i) => pool[(start + 1 + i) % pool.length]).find((m) => !used.has(m.id))
  if (!next) return plan
  const meals = day.meals.map((m, i) => (i === mealIdx ? { ...m, id: next.id } : m))
  const days = plan.days.map((d, i) => (i === dayIdx ? { ...d, meals, scale: fitScale(meals, plan.target) } : d))
  return { ...plan, days }
}

export const moveMinutes = (id: string, level: 0 | 1) => MOVE_BY_ID[id].minutes[level]
