import type { Diet } from '../data/meals'

export type Sex = 'female' | 'male'
export type Activity = 'sedentary' | 'light' | 'moderate' | 'very'
export type Goal = 'lose' | 'maintain' | 'gain'

export interface Profile {
  name: string
  sex: Sex
  age: number
  heightCm: number
  weightKg: number
  activity: Activity
  goal: Goal
  diet: Diet
  level: 0 | 1
  workoutDays: 3 | 4 | 5
}

export const ACTIVITY_FACTOR: Record<Activity, number> = { sedentary: 1.2, light: 1.375, moderate: 1.55, very: 1.725 }
const GOAL_DELTA: Record<Goal, number> = { lose: -500, maintain: 0, gain: 300 }

/** Mifflin-St Jeor resting energy */
export const bmr = (p: Pick<Profile, 'sex' | 'age' | 'heightCm' | 'weightKg'>) =>
  10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age + (p.sex === 'male' ? 5 : -161)

export const tdee = (p: Profile) => bmr(p) * ACTIVITY_FACTOR[p.activity]

/** daily kcal target, rounded to 10, never below a safe floor */
export const kcalTarget = (p: Profile) => {
  const floor = p.sex === 'male' ? 1500 : 1200
  return Math.round(Math.max(floor, tdee(p) + GOAL_DELTA[p.goal]) / 10) * 10
}

export const macroTargets = (p: Profile, kcal = kcalTarget(p)) => {
  const protein = Math.round(p.weightKg * (p.goal === 'maintain' ? 1.4 : 1.6))
  const fat = Math.round((kcal * 0.28) / 9)
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4))
  return { protein, carbs, fat }
}

export const moveKcal = (met: number, kg: number, minutes: number) => Math.round(((met * 3.5 * kg) / 200) * minutes)
