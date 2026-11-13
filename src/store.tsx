import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Profile } from './lib/calc'
import type { Plan } from './lib/plan'
import type { Log } from './lib/track'

interface State { profile: Profile | null; plan: Plan | null; log: Log }
const KEY = 'mira-planner-v1'
const empty: State = { profile: null, plan: null, log: {} }

function load(): State {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? { ...empty, ...JSON.parse(raw) } : empty
  } catch {
    return empty
  }
}

const Ctx = createContext<{ state: State; set: (fn: (s: State) => State) => void } | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(load)
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* private mode: keep in memory */ }
  }, [state])
  return <Ctx.Provider value={{ state, set: setState }}>{children}</Ctx.Provider>
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
