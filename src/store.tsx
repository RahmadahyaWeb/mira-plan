import { createContext, useContext, useEffect, useState, useSyncExternalStore, type ReactNode } from 'react'
import { createAccountData, empty, type State } from './lib/accountData'
import { supabaseAdapter } from './lib/accountDataSupabase'
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
