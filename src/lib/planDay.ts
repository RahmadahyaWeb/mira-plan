import type { Custom, State } from './accountData'
import { macroTargets, moveKcal, type Profile } from './calc'
import { addDays, daysBetween, planDayIndex } from './date'
import { fitScale, swapMeal, type Plan, type PlanDay } from './plan'
import { dayFor, progress, type Log } from './track'
import { catalog, newCustomId } from './catalog'
import { fitsDiet, type Meal } from '../data/meals'
import type { Move, MoveKind } from '../data/exercises'

/** Account data once it has a Profile and a Plan. */
export interface Ready { plan: Plan; profile: Profile; log: Log; custom: Custom }

export const WATER_GOAL = 8

/** Everything a page shows for one calendar date: its Plan day, what is ticked, and the sums. */
export function planDay(s: Ready, key: string) {
  const { plan, profile, log } = s
  const cat = catalog(s)
  const day = dayFor(plan, key)
  const done = new Set(log[key]?.done ?? [])
  const eaten = day.meals.reduce((acc, pm, i) => {
    if (!done.has(`meal-${i}`)) return acc
    const m = cat.meal(pm.id)
    return { kcal: acc.kcal + m.kcal * day.scale, protein: acc.protein + m.protein * day.scale, carbs: acc.carbs + m.carbs * day.scale, fat: acc.fat + m.fat * day.scale }
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 })
  const burned = day.workout.moves.reduce((sum, id, i) => {
    const mv = cat.move(id)
    return done.has(`move-${i}`) ? sum + moveKcal(mv.met, profile.weightKg, mv.minutes[profile.level]) : sum
  }, 0)
  return {
    key,
    day,
    index: planDayIndex(plan.startKey, key),
    done,
    progress: progress(plan, log, key),
    water: log[key]?.water ?? 0,
    eaten,
    burned,
    macros: macroTargets(profile, plan.target),
  }
}

/** The 7-day cycle of the Plan that contains `today`, with its totals. */
export function planWeek(s: Ready, today: string) {
  const start = addDays(s.plan.startKey, Math.floor(Math.max(0, daysBetween(s.plan.startKey, today)) / 7) * 7)
  const days = Array.from({ length: 7 }, (_, i) => planDay(s, addDays(start, i)))
  return {
    days,
    done: days.reduce((n, d) => n + d.progress.done, 0),
    total: days.reduce((n, d) => n + d.progress.total, 0),
    mealCount: days.reduce((n, d) => n + d.day.meals.length, 0),
    moveDays: days.filter((d) => !d.day.workout.rest).length,
  }
}

/** Whether a meal is on today's Plan day, its portion factor, and whether it is ticked. */
export function mealOnToday(state: State, mealId: string, today: string) {
  const day: PlanDay | null = state.plan ? dayFor(state.plan, today) : null
  const index = day ? day.meals.findIndex((m) => m.id === mealId) : -1
  return {
    index,
    scale: index >= 0 ? day!.scale : 1,
    eaten: index >= 0 && (state.log[today]?.done ?? []).includes(`meal-${index}`),
  }
}

// Actions: each returns an updater for the store's `set`.
type Update = (s: State) => State
const dayOf = (log: Log, key: string) => log[key] ?? { done: [], water: 0 }

export const tick = (key: string, id: string): Update => (s) => {
  const d = dayOf(s.log, key)
  const done = d.done.includes(id) ? d.done.filter((x) => x !== id) : [...d.done, id]
  return { ...s, log: { ...s.log, [key]: { ...d, done } } }
}

/** Click glass `i` (0-based): fill up to it, or empty it when it is the last full glass. */
export const drink = (key: string, i: number): Update => (s) => {
  const d = dayOf(s.log, key)
  const water = i < d.water && i === d.water - 1 ? i : i + 1
  return { ...s, log: { ...s.log, [key]: { ...d, water } } }
}

export const swap = (dayIdx: number, mealIdx: number): Update => (s) =>
  s.plan && s.profile ? { ...s, plan: swapMeal(s.plan, dayIdx, mealIdx, s.profile.diet, catalog(s)) } : s

/**
 * Ticks are stored by position, so a Plan day edit remaps today's ticks of `prefix`:
 * `map(i)` is old item i's new index, or null when it is gone (and loses its tick).
 * Only today's entry changes, and only when today falls on that Plan day.
 */
function remapToday(s: State, dayIdx: number, today: string, prefix: 'meal-' | 'move-', map: (i: number) => number | null): Log {
  const { plan, log } = s
  const d = log[today]
  if (!plan || !d || daysBetween(plan.startKey, today) < 0 || planDayIndex(plan.startKey, today) !== dayIdx) return log
  const done = d.done.flatMap((t) => {
    if (!t.startsWith(prefix)) return [t]
    const n = map(Number(t.slice(prefix.length)))
    return n === null ? [] : [prefix + n]
  })
  return { ...log, [today]: { ...d, done } }
}

/** The Meals that may go in one meal position: Built-in and Custom, same slot, fitting the diet. */
export function mealOptions(s: State, dayIdx: number, mealIdx: number): Meal[] {
  const cur = s.plan?.days[dayIdx]?.meals[mealIdx]
  const diet = s.profile?.diet
  return cur && diet ? catalog(s).meals.filter((m) => m.slot === cur.slot && fitsDiet(m, diet)) : []
}

/** Put Meal `mealId` in one meal position of one Plan day. Refuses any Meal not in `mealOptions`. */
export const setMeal = (dayIdx: number, mealIdx: number, mealId: string, today: string): Update => (s) => {
  const day = s.plan?.days[dayIdx]
  if (!s.plan || !day || day.meals[mealIdx]?.id === mealId || !mealOptions(s, dayIdx, mealIdx).some((m) => m.id === mealId)) return s
  const meals = day.meals.map((m, i) => (i === mealIdx ? { ...m, id: mealId } : m))
  const days = s.plan.days.map((d, i) => (i === dayIdx ? { ...d, meals, scale: fitScale(meals, s.plan!.target, catalog(s)) } : d))
  return { ...s, plan: { ...s.plan, days }, log: remapToday(s, dayIdx, today, 'meal-', (i) => (i === mealIdx ? null : i)) }
}

/** Change one Plan day's workout; `map` says where each old Move went (null: gone). Title and rest flag stay. */
function setMoves(s: State, dayIdx: number, moves: string[], today: string, map: (i: number) => number | null): State {
  const days = s.plan!.days.map((d, i) => (i === dayIdx ? { ...d, workout: { ...d.workout, moves } } : d))
  return { ...s, plan: { ...s.plan!, days }, log: remapToday(s, dayIdx, today, 'move-', map) }
}

const workoutOf = (s: State, dayIdx: number) => s.plan?.days[dayIdx]?.workout.moves

/** Add Move `moveId` at the end of one Plan day's workout, so no tick has to move. Any kind, rest days too. */
export const addMove = (dayIdx: number, moveId: string, today: string): Update => (s) => {
  const moves = workoutOf(s, dayIdx)
  if (!moves || !catalog(s).move(moveId)) return s
  return setMoves(s, dayIdx, [...moves, moveId], today, (i) => i)
}

/** Take Move `moveIdx` out of one Plan day's workout; the workout may become empty. */
export const removeMove = (dayIdx: number, moveIdx: number, today: string): Update => (s) => {
  const moves = workoutOf(s, dayIdx)
  if (!moves || moveIdx < 0 || moveIdx >= moves.length) return s
  return setMoves(s, dayIdx, moves.toSpliced(moveIdx, 1), today, (i) => (i === moveIdx ? null : i < moveIdx ? i : i - 1))
}

/** Put Move `moveId` in place of Move `moveIdx`; the replaced one loses today's tick. */
export const replaceMove = (dayIdx: number, moveIdx: number, moveId: string, today: string): Update => (s) => {
  const moves = workoutOf(s, dayIdx)
  if (!moves || moveIdx < 0 || moveIdx >= moves.length || !catalog(s).move(moveId) || moves[moveIdx] === moveId) return s
  return setMoves(s, dayIdx, moves.with(moveIdx, moveId), today, (i) => (i === moveIdx ? null : i))
}

/** Add a Custom Meal to the Account's Library. */
export const addCustomMeal = (meal: Omit<Meal, 'id'>): Update => (s) => ({
  ...s,
  custom: { ...s.custom, meals: [...s.custom.meals, { ...meal, id: newCustomId() }] },
})

/** Change a Custom Meal; every Plan day that uses it gets its portion recalculated. */
export const editCustomMeal = (id: string, meal: Omit<Meal, 'id'>): Update => (s) => {
  const next = { ...s, custom: { ...s.custom, meals: s.custom.meals.map((m) => (m.id === id ? { ...meal, id } : m)) } }
  if (!next.plan) return next
  const cat = catalog(next)
  const target = next.plan.target
  const days = next.plan.days.map((d) => (d.meals.some((m) => m.id === id) ? { ...d, scale: fitScale(d.meals, target, cat) } : d))
  return { ...next, plan: { ...next.plan, days } }
}

/** Delete a Custom Meal; each Plan day slot holding it gets the next Built-in Meal that fits, and a new portion. */
export const deleteCustomMeal = (id: string): Update => (s) => {
  const next = { ...s, custom: { ...s.custom, meals: s.custom.meals.filter((m) => m.id !== id) } }
  if (!next.plan || !next.profile) return next
  const cat = catalog(next)
  let plan = next.plan
  // shortcut: if a slot has no Built-in Meal left that fits, swapMeal keeps the old id; every slot and diet has several today
  plan.days.forEach((d, di) => d.meals.forEach((m, mi) => { if (m.id === id) plan = swapMeal(plan, di, mi, next.profile!.diet, cat) }))
  return { ...next, plan }
}

export type Intensity = 'light' | 'moderate' | 'hard'
export const INTENSITY_MET: Record<Intensity, number> = { light: 3, moderate: 5, hard: 8 }
export interface CustomMoveInput { name: string; kind: MoveKind; intensity: Intensity; minutes: number; emoji: string; dose: string; how: string }

/** Intensity picks the MET; both levels share one minutes and dose. */
function toMove(id: string, { intensity, minutes, dose, emoji, ...rest }: CustomMoveInput): Move {
  const d = dose || `${minutes} min` // Today shows a dose line, so never leave it blank
  return { ...rest, id, emoji: emoji || '💪', met: INTENSITY_MET[intensity], minutes: [minutes, minutes], dose: [d, d] }
}

export const addCustomMove = (input: CustomMoveInput): Update => (s) =>
  ({ ...s, custom: { ...s.custom, moves: [...s.custom.moves, toMove(newCustomId(), input)] } })

/** Change a Custom Move; workouts hold its id, so they show the new version. */
export const editCustomMove = (id: string, input: CustomMoveInput): Update => (s) =>
  ({ ...s, custom: { ...s.custom, moves: s.custom.moves.map((m) => (m.id === id ? toMove(id, input) : m)) } })

/** Delete a Custom Move: it leaves every workout, and ticks (`move-<index>`) shift so they stay on the same items. */
export const deleteCustomMove = (id: string): Update => (s) => {
  const next = { ...s, custom: { ...s.custom, moves: s.custom.moves.filter((m) => m.id !== id) } }
  if (!next.plan) return next
  const old = next.plan
  // per Plan day: old move index -> new tick id, or null when that move is gone
  const remap = old.days.map((d) => {
    let n = 0
    return d.workout.moves.map((m) => (m === id ? null : `move-${n++}`))
  })
  const log = Object.fromEntries(Object.entries(next.log).map(([k, dl]) => {
    if (daysBetween(old.startKey, k) < 0) return [k, dl] // before this Plan: ticks belong to an older one
    const map = remap[planDayIndex(old.startKey, k)]
    const done = dl.done.flatMap((t) => (t.startsWith('move-') ? (map[Number(t.slice(5))] ?? []) : [t]))
    return [k, { ...dl, done }]
  }))
  const days = old.days.map((d) => (d.workout.moves.includes(id) ? { ...d, workout: { ...d.workout, moves: d.workout.moves.filter((m) => m !== id) } } : d))
  return { ...next, log, plan: { ...old, days } }
}

/** A new Plan: ticks from today on belonged to the old Plan's items, so they go. */
export const startPlan = (profile: Profile, plan: Plan, today: string): Update => (s) => ({
  ...s,
  profile,
  plan,
  log: Object.fromEntries(Object.entries(s.log).filter(([k]) => k < today)),
})
