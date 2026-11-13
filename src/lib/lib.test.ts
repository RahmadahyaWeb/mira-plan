import { describe, expect, it } from 'vitest'
import { bmr, kcalTarget, type Profile } from './calc'
import { addDays, dateKey, planDayIndex } from './date'
import { dayKcal, generatePlan, swapMeal } from './plan'
import { itemIds, streak, type Log } from './track'
import { MEAL_BY_ID, fitsDiet } from '../data/meals'

const base: Profile = { name: '', sex: 'female', age: 30, heightCm: 165, weightKg: 65, activity: 'light', goal: 'lose', diet: 'anything', level: 0, workoutDays: 3 }

describe('calc', () => {
  it('matches Mifflin-St Jeor', () => {
    expect(bmr(base)).toBeCloseTo(10 * 65 + 6.25 * 165 - 5 * 30 - 161)
    expect(bmr({ ...base, sex: 'male' })).toBeCloseTo(10 * 65 + 6.25 * 165 - 5 * 30 + 5)
  })
  it('never drops below the safe floor', () => {
    expect(kcalTarget({ ...base, weightKg: 40, heightCm: 145, age: 70, activity: 'sedentary' })).toBe(1200)
  })
})

describe('date', () => {
  it('uses the local calendar day, not UTC', () => {
    expect(dateKey(new Date(2026, 10, 13, 0, 31))).toBe('2026-11-13')
    expect(dateKey(new Date(2026, 10, 13, 23, 59))).toBe('2026-11-13')
  })
  it('wraps plan days and crosses months', () => {
    expect(addDays('2026-11-30', 1)).toBe('2026-12-01')
    expect(planDayIndex('2026-11-13', '2026-11-20')).toBe(0)
    expect(planDayIndex('2026-11-13', '2026-11-12')).toBe(6)
  })
})

describe('plan', () => {
  for (const goal of ['lose', 'maintain', 'gain'] as const)
    for (const diet of ['anything', 'vegetarian', 'vegan'] as const)
      for (const p of [base, { ...base, sex: 'male' as const, weightKg: 95, heightCm: 190, activity: 'very' as const }])
        it(`hits target within 5% (${goal}, ${diet}, ${p.sex})`, () => {
          const plan = generatePlan({ ...p, goal, diet }, '2026-11-13', 42)
          for (const d of plan.days) {
            expect(Math.abs(dayKcal(d.meals) * d.scale - plan.target) / plan.target).toBeLessThan(0.05)
            for (const m of d.meals) expect(fitsDiet(MEAL_BY_ID[m.id], diet)).toBe(true)
          }
          expect(plan.days.filter((d) => !d.workout.rest)).toHaveLength(p.workoutDays)
        })

  it('swap keeps slot and diet, avoids duplicates', () => {
    const plan = generatePlan({ ...base, diet: 'vegan' }, '2026-11-13', 7)
    const next = swapMeal(plan, 0, 0, 'vegan')
    const a = plan.days[0].meals[0], b = next.days[0].meals[0]
    expect(b.id).not.toBe(a.id)
    expect(MEAL_BY_ID[b.id].slot).toBe(a.slot)
    expect(new Set(next.days[0].meals.map((m) => m.id)).size).toBe(next.days[0].meals.length)
  })
})

describe('streak', () => {
  const plan = generatePlan(base, '2026-11-10', 1)
  const full = (key: string) => ({ done: itemIds(plan.days[planDayIndex(plan.startKey, key)]), water: 0 })
  it('counts through yesterday when today is unfinished', () => {
    const log: Log = { '2026-11-11': full('2026-11-11'), '2026-11-12': full('2026-11-12'), '2026-11-13': { done: ['meal-0'], water: 0 } }
    expect(streak(plan, log, '2026-11-13')).toBe(2)
  })
  it('includes today once complete and stops at a gap', () => {
    const log: Log = { '2026-11-10': full('2026-11-10'), '2026-11-12': full('2026-11-12'), '2026-11-13': full('2026-11-13') }
    expect(streak(plan, log, '2026-11-13')).toBe(2)
  })
})
