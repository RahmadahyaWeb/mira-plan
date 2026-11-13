import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createAccountData, empty, type State } from './lib/accountData'
import { supabaseAdapter } from './lib/accountDataSupabase'
import type { Log } from './lib/track'
import { useAuth } from './auth'

const OLD_KEY = 'mira-planner-v1'

interface Store { state: State; set: (fn: (s: State) => State) => void; loading: boolean; error: string | null }
export const Ctx = createContext<Store | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const { account } = useAuth()
  const id = account?.id
  const [data] = useState(() => createAccountData(supabaseAdapter))
  const snap = useSyncExternalStore(data.subscribe, data.getSnapshot)

  useEffect(() => {
    // Old device-only data is dropped, never imported.
    try { localStorage.removeItem(OLD_KEY) } catch { /* storage blocked */ }
  }, [])

  useEffect(() => { data.setAccount(id) }, [data, id])

  // Until the effect hands data the new Account, the snapshot is still for the old one: count that as loading.
  const loading = !!id && (snap.accountId !== id || snap.loading)
  return <Ctx.Provider value={{ state: loading ? empty : snap.state, set: data.update, loading, error: loading ? null : snap.error }}>{children}</Ctx.Provider>
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
