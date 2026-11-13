import { describe, expect, it } from 'vitest'
import { empty, noCustom, type State } from './accountData'
import type { Profile } from './calc'
import { addDays } from './date'
import { fitScale, generatePlan } from './plan'
import { addCustomMeal, addCustomMove, addMove, deleteCustomMeal, deleteCustomMove, drink, editCustomMeal, mealOnToday, mealOptions, planDay, planWeek, removeMove, replaceMove, setMeal, startPlan, swap, tick } from './planDay'
import { catalog, isCustom } from './catalog'
import { itemIds } from './track'
import { MEAL_BY_ID, fitsDiet } from '../data/meals'
import { moveKcal } from './calc'

const profile: Profile = { name: '', sex: 'female', age: 30, heightCm: 165, weightKg: 65, activity: 'light', goal: 'lose', diet: 'anything', level: 0, workoutDays: 3 }
const start = '2026-01-01'
const plan = generatePlan(profile, start, 42)
const fresh: State = { profile, plan, log: {}, custom: noCustom }
const ready = (s: State) => ({ ...s, plan: s.plan!, profile: s.profile! })

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
    const old: State = { profile, plan, custom: noCustom, log: { '2026-01-01': { done: ['meal-0'], water: 1 }, '2026-01-05': { done: [], water: 3 }, '2026-01-06': { done: ['move-0'], water: 0 } } }
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
    expect(mealOnToday(empty, 'x', start).index).toBe(-1)
  })
})

describe('Custom Meals', () => {
  const nasi = { name: 'Nasi Uduk', slot: 'breakfast' as const, emoji: '🍚', kcal: 450, protein: 10, carbs: 70, fat: 14, diet: 'vegan' as const, minutes: 0, ingredients: [], steps: [] }
  it('adding one gives it a Custom id and the catalog finds it', () => {
    const s = addCustomMeal(nasi)(fresh)
    const [m] = s.custom.meals
    expect(isCustom(m.id)).toBe(true)
    expect(catalog(s).meal(m.id)).toEqual(m)
    expect(catalog(s).meals[0]).toEqual(m)
  })
  it('no Built-in id looks Custom', () => {
    expect(catalog({}).meals.some((m) => isCustom(m.id))).toBe(false)
    expect(catalog({}).moves.some((m) => isCustom(m.id))).toBe(false)
  })
  it('a Custom Meal on a Plan day counts when ticked', () => {
    const s = addCustomMeal(nasi)(fresh)
    const id = s.custom.meals[0].id
    const withIt: State = { ...s, plan: { ...plan, days: plan.days.map((d, i) => (i === 0 ? { ...d, meals: d.meals.map((m, j) => (j === 0 ? { ...m, id } : m)) } : d)) } }
    const d = planDay(ready(tick(start, 'meal-0')(withIt)), start)
    expect(d.eaten.kcal).toBeCloseTo(450 * d.day.scale)
  })
  it('a new Plan keeps Custom Meals', () => {
    const s = addCustomMeal(nasi)(fresh)
    const next = startPlan(profile, generatePlan(profile, '2026-01-05', 7), '2026-01-05')(s)
    expect(next.custom).toBe(s.custom)
  })
})

describe('Custom Moves', () => {
  const salsa = { name: 'Salsa', kind: 'cardio' as const, intensity: 'hard' as const, minutes: 20, emoji: '', dose: '', how: '' }
  it('maps intensity to MET 3 / 5 / 8 and uses one minutes and dose for both levels', () => {
    const mets = (['light', 'moderate', 'hard'] as const).map((intensity) => addCustomMove({ ...salsa, intensity })(fresh).custom.moves[0].met)
    expect(mets).toEqual([3, 5, 8])
    const m = addCustomMove({ ...salsa, dose: '2 songs' })(fresh).custom.moves[0]
    expect(m.minutes).toEqual([20, 20])
    expect(m.dose).toEqual(['2 songs', '2 songs'])
    expect(isCustom(m.id)).toBe(true)
  })
  it('a Custom Move on a Plan day burns kcal with the mapped MET', () => {
    const s = addCustomMove(salsa)(fresh)
    const id = s.custom.moves[0].id
    const day = plan.days.findIndex((d) => d.workout.moves.length)
    const key = addDays(start, day)
    const withIt: State = { ...s, plan: { ...plan, days: plan.days.map((d, i) => (i === day ? { ...d, workout: { ...d.workout, moves: [id, ...d.workout.moves.slice(1)] } } : d)) } }
    expect(catalog(withIt).move(id).name).toBe('Salsa')
    expect(planDay(ready(tick(key, 'move-0')(withIt)), key).burned).toBeCloseTo(moveKcal(8, profile.weightKg, 20))
  })
})

describe('editing and deleting Custom items', () => {
  const nasi = { name: 'Nasi Uduk', slot: 'breakfast' as const, emoji: '🍚', kcal: 450, protein: 10, carbs: 70, fat: 14, diet: 'vegan' as const, minutes: 0, ingredients: [], steps: [] }
  // put Custom Meal `id` as the breakfast of Plan day 0 and 2
  const onDays = (s: State, id: string): State => ({ ...s, plan: { ...s.plan!, days: s.plan!.days.map((d, i) => (i === 0 || i === 2 ? { ...d, meals: d.meals.map((m, j) => (j === 0 ? { ...m, id } : m)) } : d)) } })

  it('editing a Custom Meal changes it and recalculates the portion of every Plan day using it', () => {
    const added = addCustomMeal(nasi)(fresh)
    const id = added.custom.meals[0].id
    const s = onDays(added, id)
    const next = editCustomMeal(id, { ...nasi, name: 'Nasi Uduk Besar', kcal: 1200 })(s)
    expect(next.custom.meals).toEqual([{ ...nasi, name: 'Nasi Uduk Besar', kcal: 1200, id }])
    expect(next.plan!.days[0].scale).toBeLessThan(s.plan!.days[0].scale)
    expect(next.plan!.days[2].scale).toBeLessThan(s.plan!.days[2].scale)
    expect(next.plan!.days[1]).toBe(s.plan!.days[1])
  })

  it('deleting a Custom Meal swaps in a Built-in Meal of the same slot and diet, not already on that day, and recalculates the portion', () => {
    const vegan = { ...profile, diet: 'vegan' as const }
    const base: State = { profile: vegan, plan: generatePlan(vegan, start, 7), log: {}, custom: noCustom }
    const added = addCustomMeal(nasi)(base)
    const id = added.custom.meals[0].id
    const s = onDays(added, id)
    const next = deleteCustomMeal(id)(s)
    expect(next.custom.meals).toEqual([])
    for (const d of [0, 2]) {
      const day = next.plan!.days[d]
      const m = MEAL_BY_ID[day.meals[0].id]
      expect(m.slot).toBe('breakfast')
      expect(fitsDiet(m, 'vegan')).toBe(true)
      expect(day.meals.slice(1).map((x) => x.id)).not.toContain(m.id)
      expect(day.scale).toBe(fitScale(day.meals, base.plan!.target, catalog({})))
    }
    expect(next.plan!.days[1]).toBe(s.plan!.days[1])
  })

  it('deleting a Custom Move drops it from every workout, and ticks stay on the right items', () => {
    const salsa = { name: 'Salsa', kind: 'cardio' as const, intensity: 'hard' as const, minutes: 20, emoji: '', dose: '', how: '' }
    const added = addCustomMove(salsa)(fresh)
    const id = added.custom.moves[0].id
    const day = plan.days.findIndex((d) => d.workout.moves.length > 2)
    const withIt: State = { ...added, plan: { ...plan, days: plan.days.map((d, i) => (i === day ? { ...d, workout: { ...d.workout, moves: [d.workout.moves[0], id, ...d.workout.moves.slice(1)] } } : d)) } }
    const key = addDays(start, day)
    const later = addDays(key, 7)
    const ticked = [tick(key, 'move-0'), tick(key, 'move-1'), tick(key, 'move-2'), tick(key, 'meal-1'), tick(later, 'move-2')].reduce((acc, f) => f(acc), withIt)
    const next = deleteCustomMove(id)(ticked)
    expect(next.custom.moves).toEqual([])
    expect(next.plan!.days[day].workout.moves).toEqual(plan.days[day].workout.moves)
    expect(next.plan!.days.flatMap((d) => d.workout.moves)).not.toContain(id)
    expect(next.log[key].done.sort()).toEqual(['meal-1', 'move-0', 'move-1'])
    expect(next.log[later].done).toEqual(['move-1'])
  })
})

describe('setMeal', () => {
  const vegan = { ...profile, diet: 'vegan' as const }
  const base: State = { profile: vegan, plan: generatePlan(vegan, start, 7), log: {}, custom: noCustom }
  const day0 = base.plan!.days[0]
  const pick = (slot: string, not: string[]) => catalog(base).meals.find((m) => m.slot === slot && fitsDiet(m, 'vegan') && !not.includes(m.id))!

  it('puts the Meal in that position and recalculates the portion', () => {
    const m = pick('breakfast', day0.meals.map((x) => x.id))
    const next = setMeal(0, 0, m.id, start)(base)
    expect(next.plan!.days[0].meals[0]).toEqual({ slot: 'breakfast', id: m.id })
    expect(next.plan!.days[0].meals.length).toBe(day0.meals.length)
    expect(next.plan!.days[0].scale).toBe(fitScale(next.plan!.days[0].meals, base.plan!.target, catalog(base)))
    expect(next.plan!.days[1]).toBe(base.plan!.days[1])
  })

  it('refuses a Meal of another slot, one that does not fit the diet, or an unknown id', () => {
    const lunch = pick('lunch', day0.meals.map((x) => x.id))
    const meaty = catalog(base).meals.find((m) => m.slot === 'breakfast' && !fitsDiet(m, 'vegan'))!
    expect(setMeal(0, 0, lunch.id, start)(base)).toBe(base)
    expect(setMeal(0, 0, meaty.id, start)(base)).toBe(base)
    expect(setMeal(0, 0, 'nope', start)(base)).toBe(base)
    expect(setMeal(0, 99, lunch.id, start)(base)).toBe(base)
  })

  it('offers Built-in and Custom Meals of that slot that fit the diet', () => {
    const added = addCustomMeal({ name: 'Nasi Uduk', slot: 'breakfast', emoji: '🍚', kcal: 900, protein: 10, carbs: 70, fat: 14, diet: 'vegan', minutes: 0, ingredients: [], steps: [] })(base)
    const opts = mealOptions(added, 0, 0)
    expect(opts[0].name).toBe('Nasi Uduk')
    expect(opts.length).toBeGreaterThan(1)
    expect(opts.every((m) => m.slot === 'breakfast' && fitsDiet(m, 'vegan'))).toBe(true)
  })

  it('takes a Custom Meal of the same slot and diet', () => {
    const added = addCustomMeal({ name: 'Nasi Uduk', slot: 'breakfast', emoji: '🍚', kcal: 900, protein: 10, carbs: 70, fat: 14, diet: 'vegan', minutes: 0, ingredients: [], steps: [] })(base)
    const id = added.custom.meals[0].id
    const next = setMeal(0, 0, id, start)(added)
    expect(next.plan!.days[0].meals[0].id).toBe(id)
    expect(next.plan!.days[0].scale).toBeLessThan(base.plan!.days[0].scale)
  })

  it('unticks the replaced meal only on today when today falls on that Plan day', () => {
    const m = pick('breakfast', day0.meals.map((x) => x.id))
    const past = addDays(start, 7)
    const today = addDays(start, 14)
    const later = addDays(start, 21)
    const ticked = [tick(past, 'meal-0'), tick(today, 'meal-0'), tick(today, 'meal-1'), tick(today, 'move-0'), tick(later, 'meal-0')].reduce((acc, f) => f(acc), base)
    const next = setMeal(0, 0, m.id, today)(ticked)
    expect(next.log[today].done).toEqual(['meal-1', 'move-0'])
    expect(next.log[past]).toBe(ticked.log[past])
    expect(next.log[later]).toBe(ticked.log[later])
    // today on another Plan day, or before the Plan starts: log untouched
    expect(setMeal(0, 0, m.id, addDays(start, 15))(ticked).log).toBe(ticked.log)
    expect(setMeal(0, 0, m.id, addDays(start, -7))(ticked).log).toBe(ticked.log)
  })

  it('swap to next still lands on a Built-in Meal, even from a Custom one', () => {
    const added = addCustomMeal({ name: 'Nasi Uduk', slot: 'breakfast', emoji: '🍚', kcal: 450, protein: 10, carbs: 70, fat: 14, diet: 'vegan', minutes: 0, ingredients: [], steps: [] })(base)
    const withIt = setMeal(0, 0, added.custom.meals[0].id, start)(added)
    expect(isCustom(swap(0, 0)(withIt).plan!.days[0].meals[0].id)).toBe(false)
  })
})

describe('editing a workout', () => {
  const salsa = { name: 'Salsa', kind: 'cardio' as const, intensity: 'hard' as const, minutes: 20, emoji: '', dose: '', how: '' }
  const withSalsa = addCustomMove(salsa)(fresh)
  const sid = withSalsa.custom.moves[0].id
  const work = plan.days.findIndex((d) => !d.workout.rest && d.workout.moves.length > 2)
  const rest = plan.days.findIndex((d) => d.workout.rest)
  const moves = (s: State, d: number) => s.plan!.days[d].workout.moves

  it('adds a Move at the end, on a rest day too, keeping title and rest flag', () => {
    const end = addMove(rest, sid, start)(withSalsa)
    expect(moves(end, rest)).toEqual([...plan.days[rest].workout.moves, sid])
    expect(end.plan!.days[rest].workout.rest).toBe(true)
    expect(end.plan!.days[rest].workout.title).toBe(plan.days[rest].workout.title)
    expect(addMove(work, 'nope', start)(fresh)).toBe(fresh)
  })

  it('removes and replaces Moves; replace takes any kind', () => {
    const orig = plan.days[work].workout.moves
    expect(moves(removeMove(work, 1, start)(fresh), work)).toEqual(orig.toSpliced(1, 1))
    expect(moves(replaceMove(work, 0, sid, start)(withSalsa), work)).toEqual(orig.with(0, sid))
    expect(removeMove(work, 99, start)(fresh)).toBe(fresh)
    expect(replaceMove(work, 0, 'nope', start)(fresh)).toBe(fresh)
  })

  it('a workout can be emptied; progress and burned kcal still work', () => {
    const n = plan.days[work].workout.moves.length
    const empty = Array.from({ length: n }, () => removeMove(work, 0, start)).reduce((acc, f) => f(acc), fresh)
    expect(moves(empty, work)).toEqual([])
    const key = addDays(start, work)
    const d = planDay(ready(tick(key, 'meal-0')(empty)), key)
    expect(d.burned).toBe(0)
    expect(d.progress).toEqual({ done: 1, total: d.day.meals.length, ratio: 1 / d.day.meals.length })
  })

  it("today's ticks follow their items; removed or replaced Moves are unticked; other dates untouched", () => {
    const today = addDays(start, work + 7)
    const past = addDays(start, work)
    const later = addDays(today, 7)
    const ticked = [tick(today, 'move-0'), tick(today, 'move-1'), tick(today, 'move-2'), tick(today, 'meal-0'), tick(past, 'move-1'), tick(later, 'move-2')].reduce((acc, f) => f(acc), fresh)
    const sorted = (s: State) => [...s.log[today].done].sort()
    expect(sorted(addMove(work, 'jog', today)(ticked))).toEqual(['meal-0', 'move-0', 'move-1', 'move-2'])
    expect(sorted(removeMove(work, 1, today)(ticked))).toEqual(['meal-0', 'move-0', 'move-1'])
    expect(sorted(replaceMove(work, 1, 'jog', today)(ticked))).toEqual(['meal-0', 'move-0', 'move-2'])
    for (const f of [addMove(work, 'jog', today), removeMove(work, 0, today), replaceMove(work, 0, 'jog', today)]) {
      const next = f(ticked)
      expect(next.log[past]).toBe(ticked.log[past])
      expect(next.log[later]).toBe(ticked.log[later])
    }
    // edit on a Plan day today does not fall on: log untouched
    expect(removeMove(work, 0, addDays(today, 1))(ticked).log).toBe(ticked.log)
  })
})
