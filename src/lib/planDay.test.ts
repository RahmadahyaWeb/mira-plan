import { describe, expect, it } from 'vitest'
import type { State } from './accountData'
import type { Profile } from './calc'
import { addDays } from './date'
import { generatePlan } from './plan'
import { drink, mealOnToday, planDay, planWeek, startPlan, swap, tick } from './planDay'
import { itemIds } from './track'
import { MEAL_BY_ID } from '../data/meals'

const profile: Profile = { name: '', sex: 'female', age: 30, heightCm: 165, weightKg: 65, activity: 'light', goal: 'lose', diet: 'anything', level: 0, workoutDays: 3 }
const start = '2026-01-01'
const plan = generatePlan(profile, start, 42)
const fresh: State = { profile, plan, log: {} }
const ready = (s: State) => ({ plan: s.plan!, profile: s.profile!, log: s.log })

describe('planDay', () => {
  it('starts with nothing ticked', () => {
    const d = planDay(ready(fresh), start)
    expect(d.index).toBe(0)
    expect(d.progress).toEqual({ done: 0, total: itemIds(d.day).length, ratio: 0 })
    expect(d.eaten.kcal).toBe(0)
    expect(d.burned).toBe(0)
    expect(d.water).toBe(0)
  })
  it('sums ticked meals at the day portion and ticked moves as kcal burned', () => {
    const s = [tick(start, 'meal-0'), tick(start, 'move-0')].reduce((acc, f) => f(acc), fresh)
    const d = planDay(ready(s), start)
    expect(d.eaten.kcal).toBeCloseTo(MEAL_BY_ID[d.day.meals[0].id].kcal * d.day.scale)
    expect(d.burned).toBeGreaterThan(0)
    expect(d.progress.done).toBe(2)
  })
  it('wraps to the Plan day of a later date', () => {
    expect(planDay(ready(fresh), addDays(start, 8)).index).toBe(1)
  })
})

describe('planWeek', () => {
  it('covers the 7-day cycle that holds today', () => {
    const w = planWeek(ready(fresh), addDays(start, 9))
    expect(w.days.map((d) => d.key)).toEqual(Array.from({ length: 7 }, (_, i) => addDays(start, 7 + i)))
    expect(w.mealCount).toBe(w.days.reduce((n, d) => n + d.day.meals.length, 0))
    expect(w.moveDays).toBe(3)
    expect(w.done).toBe(0)
  })
  it('counts ticks inside the cycle', () => {
    const w = planWeek(ready(tick(start, 'meal-0')(fresh)), start)
    expect(w.done).toBe(1)
    expect(w.total).toBeGreaterThan(w.done)
  })
})

describe('actions', () => {
  it('tick toggles an item on and off', () => {
    const on = tick(start, 'meal-0')(fresh)
    expect(on.log[start].done).toEqual(['meal-0'])
    expect(tick(start, 'meal-0')(on).log[start].done).toEqual([])
  })
  it('drink fills up to a glass, and empties the last full glass', () => {
    const three = drink(start, 2)(fresh)
    expect(three.log[start].water).toBe(3)
    expect(drink(start, 2)(three).log[start].water).toBe(2)
    expect(drink(start, 0)(three).log[start].water).toBe(1)
  })
  it('swap replaces one meal with another', () => {
    const next = swap(0, 0)(fresh)
    expect(next.plan!.days[0].meals[0].id).not.toBe(plan.days[0].meals[0].id)
    expect(swap(0, 0)({ ...fresh, plan: null })).toEqual({ ...fresh, plan: null })
  })
  it('a new Plan drops ticks from today on and keeps the past', () => {
    const old: State = { profile, plan, log: { '2026-01-01': { done: ['meal-0'], water: 1 }, '2026-01-05': { done: [], water: 3 }, '2026-01-06': { done: ['move-0'], water: 0 } } }
    const fresh2 = generatePlan(profile, '2026-01-05', 7)
    const next = startPlan(profile, fresh2, '2026-01-05')(old)
    expect(Object.keys(next.log)).toEqual(['2026-01-01'])
    expect(next.plan).toBe(fresh2)
  })
})

describe('mealOnToday', () => {
  it('finds today\'s meal, its portion and tick', () => {
    const id = plan.days[0].meals[1].id
    const idx = plan.days[0].meals.findIndex((m) => m.id === id)
    const s = tick(start, `meal-${idx}`)(fresh)
    expect(mealOnToday(s, id, start)).toEqual({ index: idx, scale: plan.days[0].scale, eaten: true })
  })
  it('is -1 and scale 1 for a meal not on today, or with no Plan', () => {
    expect(mealOnToday(fresh, 'nope', start)).toEqual({ index: -1, scale: 1, eaten: false })
    expect(mealOnToday({ profile: null, plan: null, log: {} }, 'x', start).index).toBe(-1)
  })
})
