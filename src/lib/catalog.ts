import type { State } from './accountData'
import { MEAL_BY_ID, type Meal } from '../data/meals'
import { MOVE_BY_ID, type Move } from '../data/exercises'

export interface Catalog { meal: (id: string) => Meal; move: (id: string) => Move }

/** Every Meal and Move an Account can use. Only Built-in for now; Custom items join here. */
export const catalog = (_s: Partial<State>): Catalog => ({
  meal: (id) => MEAL_BY_ID[id],
  move: (id) => MOVE_BY_ID[id],
})
