import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from './auth'

/** Where a Visitor was headed before login; falls back to the plan. */
export function useAfterLogin(): string {
  const from = (useLocation().state as { from?: string } | null)?.from
  return from ?? '/plan'
}

export function RequireAccount() {
  const { account, loading } = useAuth()
  const { pathname, search } = useLocation()
  if (loading) return null
  return account ? <Outlet /> : <Navigate to="/login" replace state={{ from: pathname + search }} />
}

export function PublicOnly() {
  const { account, loading } = useAuth()
  const to = useAfterLogin()
  if (loading) return null
  return account ? <Navigate to={to} replace /> : <Outlet />
}
