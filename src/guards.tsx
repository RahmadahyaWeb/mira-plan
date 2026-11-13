import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth'
import { useStore } from './store'

/** Where a Visitor was headed before login; else Today, or the wizard if there is no Plan yet. */
export function useAfterLogin(): string {
  const from = (useLocation().state as { from?: string } | null)?.from
  const home = useHome()
  return from ?? home
}

/** An Account's home: Today once it has a Plan, the wizard before. */
export function useHome(): string {
  return useStore().state.plan ? '/today' : '/plan'
}

export function RequireAccount() {
  const { account, loading } = useAuth()
  const store = useStore()
  const { pathname, search } = useLocation()
  if (loading || (account && store.loading)) return null
  return account ? <Outlet /> : <Navigate to="/login" replace state={{ from: pathname + search }} />
}

export function PublicOnly() {
  const { account, loading } = useAuth()
  const store = useStore()
  const to = useAfterLogin()
  // wait for Account data, or the Plan check above reads an empty store
  if (loading || (account && store.loading)) return null
  return account ? <Navigate to={to} replace /> : <Outlet />
}
