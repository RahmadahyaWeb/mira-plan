// @vitest-environment jsdom
import { act } from 'react'
import { createRoot } from 'react-dom/client'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Ctx } from './auth'
import { Ctx as StoreCtx } from './store'
import { PublicOnly, RequireAccount } from './guards'

;(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true

const Path = () => <i>[{useLocation().pathname}]</i>
const Where = ({ name }: { name: string }) => {
  const l = useLocation()
  return <p data-testid="where">{name}|{l.pathname}|{(l.state as { from?: string } | null)?.from ?? ''}</p>
}

async function visit(entry: string | { pathname: string; state: unknown }, auth: { signedIn: boolean; loading?: boolean; dataLoading?: boolean }) {
  const value = {
    account: auth.signedIn ? { id: '1', username: 'mira' } : null,
    loading: auth.loading ?? false,
  } as never
  const el = document.createElement('div')
  await act(async () => {
    createRoot(el).render(
      <Ctx.Provider value={value}>
        <StoreCtx.Provider value={{ loading: auth.dataLoading ?? false } as never}>
        <MemoryRouter initialEntries={[entry]}>
          <Path />
          <Routes>
            <Route path="/" element={<Where name="landing" />} />
            <Route element={<PublicOnly />}>
              <Route path="/login" element={<Where name="login" />} />
            </Route>
            <Route element={<RequireAccount />}>
              <Route path="/plan" element={<Where name="plan" />} />
              <Route path="/today" element={<Where name="today" />} />
            </Route>
          </Routes>
        </MemoryRouter>
        </StoreCtx.Provider>
      </Ctx.Provider>,
    )
  })
  return el.textContent
}

describe('route guards', () => {
  it('sends a Visitor to login and remembers the page, with query', async () => {
    expect(await visit('/today?x=1', { signedIn: false })).toBe('[/login]login|/login|/today?x=1')
  })
  it('lets an Account into a protected page', async () => {
    expect(await visit('/today', { signedIn: true })).toBe('[/today]today|/today|')
  })
  it('sends a signed-in Account away from login to the plan', async () => {
    expect(await visit('/login', { signedIn: true })).toBe('[/plan]plan|/plan|')
  })
  it('returns an Account who just signed in to the remembered page', async () => {
    expect(await visit({ pathname: '/login', state: { from: '/today' } }, { signedIn: true })).toBe('[/today]today|/today|')
  })
  it('renders nothing while auth loads, on both guards', async () => {
    expect(await visit('/today', { signedIn: false, loading: true })).toBe('[/today]')
    expect(await visit('/login', { signedIn: true, loading: true })).toBe('[/login]')
  })
  it('waits for the Account data before showing a protected page', async () => {
    expect(await visit('/today', { signedIn: true, dataLoading: true })).toBe('[/today]')
  })
  it('keeps landing public', async () => {
    expect(await visit('/', { signedIn: false })).toBe('[/]landing|/|')
  })
})
