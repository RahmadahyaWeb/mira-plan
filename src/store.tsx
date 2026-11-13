import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react'
import type { Profile } from './lib/calc'
import type { Plan } from './lib/plan'
import { diffLog, type Log } from './lib/track'
import { supabase } from './lib/supabase'
import { useAuth } from './auth'

interface State { profile: Profile | null; plan: Plan | null; log: Log }
const OLD_KEY = 'mira-planner-v1'
const empty: State = { profile: null, plan: null, log: {} }

interface Store { state: State; set: (fn: (s: State) => State) => void; loading: boolean; error: string | null }
export const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const { account } = useAuth()
  const id = account?.id
  const [state, setState] = useState(empty)
  const [loadedFor, setLoadedFor] = useState<string | undefined>()
  const [error, setError] = useState<string | null>(null)
  const loading = !!id && loadedFor !== id // derived, so no render shows another Account's data
  const ref = useRef(empty)
  const queue = useRef(Promise.resolve())
  const idNow = useRef(id)
  idNow.current = id
  const loaded = useRef(false) // a failed load must never be followed by a save: it would overwrite the cloud row with blanks

  useEffect(() => {
    // Old device-only data is dropped, never imported.
    try { localStorage.removeItem(OLD_KEY) } catch { /* storage blocked */ }
  }, [])

  useEffect(() => {
    let stale = false
    ref.current = empty
    loaded.current = false
    setState(empty)
    setError(null)
    if (!id) return
    Promise.all([
      supabase.from('plans').select('profile, plan').eq('account_id', id).maybeSingle(),
      supabase.from('logs').select('day, done, water').eq('account_id', id),
    ]).then(([{ data, error: e }, { data: days, error: e2 }]) => {
      if (stale) return
      if (e || e2) setError('Could not load your plan. Check your connection and reload.')
      else {
        loaded.current = true
        const log: Log = Object.fromEntries((days ?? []).map((r) => [r.day, { done: r.done, water: r.water }]))
        ref.current = { profile: data?.profile ?? null, plan: data?.plan ?? null, log }
      }
      setState(ref.current)
      setLoadedFor(id)
    })
    return () => { stale = true }
  }, [id])

  const set: Store['set'] = (fn) => {
    const prev = ref.current
    const next = fn(prev)
    ref.current = next
    setState(next)
    if (!id || !loaded.current) return
    const planChanged = prev.profile !== next.profile || prev.plan !== next.plan
    const { upsert, remove } = diffLog(prev.log, next.log)
    if (!planChanged && !upsert.length && !remove.length) return
    // Saves run one at a time so the last change wins; a failure keeps the banner until a later save works.
    queue.current = queue.current.then(async () => {
      const results = await Promise.all([
        planChanged && supabase.from('plans').upsert({ account_id: id, profile: next.profile, plan: next.plan, updated_at: new Date().toISOString() }),
        upsert.length > 0 && supabase.from('logs').upsert(upsert.map((day) => ({ account_id: id, day, done: next.log[day].done, water: next.log[day].water }))),
        remove.length > 0 && supabase.from('logs').delete().eq('account_id', id).in('day', remove),
      ])
      if (idNow.current !== id) return // signed out or switched meanwhile
      setError(results.some((r) => r && r.error) ? 'Could not save your changes. They are kept on this screen; we will retry on your next change.' : null)
    })
  }

  return <Ctx.Provider value={{ state: loading ? empty : state, set, loading, error }}>{children}</Ctx.Provider>
}

export function useStore() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useStore outside StoreProvider')
  return c
}

export function toggleDone(log: Log, key: string, id: string): Log {
  const day = log[key] ?? { done: [], water: 0 }
  const done = day.done.includes(id) ? day.done.filter((x) => x !== id) : [...day.done, id]
  return { ...log, [key]: { ...day, done } }
}

export function setWater(log: Log, key: string, water: number): Log {
  const day = log[key] ?? { done: [], water: 0 }
  return { ...log, [key]: { ...day, water } }
}
