import type { State } from './accountData'
import { macroTargets, moveKcal, type Profile } from './calc'
import { addDays, daysBetween, planDayIndex } from './date'
import { swapMeal, type Plan, type PlanDay } from './plan'
import { dayFor, progress, type Log } from './track'
import { MEAL_BY_ID } from '../data/meals'
import { MOVE_BY_ID } from '../data/exercises'

/** Account data once it has a Profile and a Plan. */
export interface Ready { plan: Plan; profile: Profile; log: Log }

export const WATER_GOAL = 8

/** Everything a page shows for one calendar date: its Plan day, what is ticked, and the sums. */
export function planDay({ plan, profile, log }: Ready, key: string) {
  const day = dayFor(plan, key)
  const done = new Set(log[key]?.done ?? [])
  const eaten = day.meals.reduce((acc, pm, i) => {
    if (!done.has(`meal-${i}`)) return acc
    const m = MEAL_BY_ID[pm.id]
    return { kcal: acc.kcal + m.kcal * day.scale, protein: acc.protein + m.protein * day.scale, carbs: acc.carbs + m.carbs * day.scale, fat: acc.fat + m.fat * day.scale }
  }, { kcal: 0, protein: 0, carbs: 0, fat: 0 })
  const burned = day.workout.moves.reduce((s, id, i) => (done.has(`move-${i}`) ? s + moveKcal(MOVE_BY_ID[id].met, profile.weightKg, MOVE_BY_ID[id].minutes[profile.level]) : s), 0)
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
  s.plan && s.profile ? { ...s, plan: swapMeal(s.plan, dayIdx, mealIdx, s.profile.diet) } : s

/** A new Plan: ticks from today on belonged to the old Plan's items, so they go. */
export const startPlan = (profile: Profile, plan: Plan, today: string): Update => (s) => ({
  ...s,
  profile,
  plan,
  log: Object.fromEntries(Object.entries(s.log).filter(([k]) => k < today)),
})
