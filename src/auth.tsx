import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { User } from '@supabase/supabase-js'
import { supabase } from './lib/supabase'
import { normalizeUsername } from './lib/username'

export interface Account { id: string; username: string }
interface Auth {
  account: Account | null
  loading: boolean
  signUp: (username: string, email: string, password: string) => Promise<string | null>
  signIn: (username: string, password: string) => Promise<string | null>
  signOut: () => Promise<void>
}

const toAccount = (u: User | undefined): Account | null =>
  u ? { id: u.id, username: String(u.user_metadata?.username ?? '') } : null

const Ctx = createContext<Auth | null>(null)

/** Actions resolve to an error message, or null on success. */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<Account | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fires INITIAL_SESSION on load (restores the session), then every change.
    const { data } = supabase.auth.onAuthStateChange((_e, session) => {
      setAccount(toAccount(session?.user))
      setLoading(false)
    })
    return () => data.subscription.unsubscribe()
  }, [])

  const signUp: Auth['signUp'] = async (username, email, password) => {
    const { error } = await supabase.auth.signUp({ email, password, options: { data: { username: normalizeUsername(username) } } })
    return error ? error.message : null
  }
  const signIn: Auth['signIn'] = async (username, password) => {
    const fail = 'Wrong username or password.'
    const { data: email } = await supabase.rpc('email_for_username', { u: normalizeUsername(username) })
    if (!email) return fail
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? fail : null
  }
  const signOut = async () => { await supabase.auth.signOut() }

  return <Ctx.Provider value={{ account, loading, signUp, signIn, signOut }}>{children}</Ctx.Provider>
}

export function useAuth() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useAuth outside AuthProvider')
  return c
}
