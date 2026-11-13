import type { State } from './accountData'
import { MEALS, MEAL_BY_ID, type Meal } from '../data/meals'
import { MOVES, MOVE_BY_ID, type Move } from '../data/exercises'

export interface Catalog {
  meal: (id: string) => Meal
  move: (id: string) => Move
  /** Custom first, then Built-in */
  meals: Meal[]
  moves: Move[]
}

/** Every Meal and Move an Account can use: Built-in plus its Custom ones. */
export function catalog(s: Partial<State>): Catalog {
  const meals = s.custom?.meals ?? []
  const moves = s.custom?.moves ?? []
  const mealById: Record<string, Meal> = { ...MEAL_BY_ID, ...Object.fromEntries(meals.map((m) => [m.id, m])) }
  const moveById: Record<string, Move> = { ...MOVE_BY_ID, ...Object.fromEntries(moves.map((m) => [m.id, m])) }
  return {
    meal: (id) => mealById[id],
    move: (id) => moveById[id],
    meals: [...meals, ...MEALS],
    moves: [...moves, ...MOVES],
  }
}

/** Custom ids carry a prefix no Built-in id uses, so the two never clash. */
export const CUSTOM_PREFIX = 'c-'
export const isCustom = (id: string) => id.startsWith(CUSTOM_PREFIX)
export const newCustomId = () => CUSTOM_PREFIX + crypto.randomUUID()
