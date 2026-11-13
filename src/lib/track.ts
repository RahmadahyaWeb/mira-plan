import { addDays, daysBetween, planDayIndex } from './date'
import type { Plan, PlanDay } from './plan'

export interface DayLog { done: string[]; water: number }
export type Log = Record<string, DayLog>

export const itemIds = (day: PlanDay) => [...day.meals.map((_, i) => `meal-${i}`), ...day.workout.moves.map((_, i) => `move-${i}`)]

export const dayFor = (plan: Plan, key: string) => plan.days[planDayIndex(plan.startKey, key)]

export const progress = (plan: Plan, log: Log, key: string) => {
  const ids = itemIds(dayFor(plan, key))
  const done = new Set(log[key]?.done ?? [])
  const n = ids.filter((id) => done.has(id)).length
  return { done: n, total: ids.length, ratio: ids.length ? n / ids.length : 0 }
}

export const isComplete = (plan: Plan, log: Log, key: string) => {
  const p = progress(plan, log, key)
  return p.total > 0 && p.done === p.total
}

/** A day counts when every meal and move is ticked. Today only counts once complete, otherwise the streak runs through yesterday. */
export function streak(plan: Plan, log: Log, today: string) {
  let key = isComplete(plan, log, today) ? today : addDays(today, -1)
  let n = 0
  while (daysBetween(plan.startKey, key) >= 0 && isComplete(plan, log, key)) {
    n++
    key = addDays(key, -1)
  }
  return n
}

/** Which per-day rows a save must write: days added or changed, and days gone. */
export function diffLog(prev: Log, next: Log) {
  const same = (a: DayLog, b: DayLog) => a.water === b.water && a.done.length === b.done.length && a.done.every((x, i) => x === b.done[i])
  return {
    upsert: Object.keys(next).filter((k) => !prev[k] || !same(prev[k], next[k])),
    remove: Object.keys(prev).filter((k) => !(k in next)),
  }
}
