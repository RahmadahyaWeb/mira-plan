import type { Profile } from './calc'
import type { Plan } from './plan'
import type { DayLog, Log } from './track'
import type { Meal } from '../data/meals'
import type { Move } from '../data/exercises'

/** The Account's own Meals and Moves. */
export interface Custom { meals: Meal[]; moves: Move[] }
export const noCustom: Custom = { meals: [], moves: [] }

export interface State { profile: Profile | null; plan: Plan | null; log: Log; custom: Custom }
export const empty: State = { profile: null, plan: null, log: {}, custom: noCustom }

/** The seam. Every call rejects on failure. */
export interface AccountDataAdapter {
  load(accountId: string): Promise<State>
  savePlan(accountId: string, profile: Profile | null, plan: Plan | null): Promise<void>
  saveLog(accountId: string, upsert: Record<string, DayLog>, remove: string[]): Promise<void>
  saveCustom(accountId: string, custom: Custom): Promise<void>
}

export interface Snapshot {
  accountId: string | undefined
  state: State // always `empty` while loading, so no render shows another Account's data
  loading: boolean
  error: string | null
}

/** Which per-day rows a save must write: days added or changed, and days gone. */
function diffLog(prev: Log, next: Log) {
  const same = (a: DayLog, b: DayLog) => a.water === b.water && a.done.length === b.done.length && a.done.every((x, i) => x === b.done[i])
  return {
    upsert: Object.keys(next).filter((k) => !prev[k] || !same(prev[k], next[k])),
    remove: Object.keys(prev).filter((k) => !(k in next)),
  }
}

/**
 * Account data for one Account at a time: load it, hand it out, save every change.
 * Saves run one at a time so the last change wins. A failed load blocks all saves
 * (they would overwrite the cloud row with blanks). A failed save keeps the data on
 * screen and shows an error until a later save works.
 */
export function createAccountData(adapter: AccountDataAdapter) {
  let accountId: string | undefined
  let generation = 0 // bumps on every setAccount; late results from an older one are ignored
  let state = empty
  let loading = false
  let loaded = false
  let error: string | null = null
  let queue = Promise.resolve()
  const listeners = new Set<() => void>()
  let snap: Snapshot = { accountId, state, loading, error }

  const emit = () => {
    snap = { accountId, state: loading ? empty : state, loading, error }
    listeners.forEach((l) => l())
  }

  function setAccount(id: string | undefined) {
    const gen = ++generation
    accountId = id
    state = empty
    loaded = false
    error = null
    loading = !!id
    emit()
    if (!id) return
    adapter.load(id).then(
      (data) => {
        if (gen !== generation) return
        state = data
        loaded = true
      },
      () => {
        if (gen !== generation) return
        error = 'Could not load your plan. Check your connection and reload.'
      },
    ).then(() => {
      if (gen !== generation) return
      loading = false
      emit()
    })
  }

  function update(fn: (s: State) => State) {
    const prev = state
    const next = fn(prev)
    state = next
    emit()
    const id = accountId
    if (!id || !loaded) return
    const planChanged = prev.profile !== next.profile || prev.plan !== next.plan
    const customChanged = prev.custom !== next.custom
    const { upsert, remove } = diffLog(prev.log, next.log)
    if (!planChanged && !customChanged && !upsert.length && !remove.length) return
    const gen = generation
    queue = queue.then(async () => {
      const jobs: Promise<void>[] = []
      if (planChanged) jobs.push(adapter.savePlan(id, next.profile, next.plan))
      if (customChanged) jobs.push(adapter.saveCustom(id, next.custom))
      if (upsert.length) jobs.push(adapter.saveLog(id, Object.fromEntries(upsert.map((d) => [d, next.log[d]])), []))
      if (remove.length) jobs.push(adapter.saveLog(id, {}, remove))
      const results = await Promise.allSettled(jobs)
      if (gen !== generation) return // signed out or switched meanwhile
      error = results.some((r) => r.status === 'rejected') ? 'Could not save your changes. They are kept on this screen; we will retry on your next change.' : null
      emit()
    })
  }

  return {
    setAccount,
    update,
    subscribe: (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } },
    getSnapshot: () => snap,
  }
}
