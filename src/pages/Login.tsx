import { useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import AuthStage from '../components/AuthStage'

const input = 'w-full rounded-2xl border-[2.5px] border-ink px-4 py-3 font-display text-xl font-semibold outline-none focus:shadow-pop'
const label = 'mb-1.5 block font-display text-lg font-semibold'

export default function Login() {
  const { signIn } = useAuth()
  const { state } = useLocation()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function submit(e: FormEvent) {
    e.preventDefault()
    if (!username.trim() || !password) return setError('Enter your username and password.')
    setBusy(true)
    setError(null)
    setError(await signIn(username, password))
    setBusy(false)
  }

  return (
    <AuthStage say="Welcome back! Your plan missed you." tint="bg-pink/35">
      <form onSubmit={submit} noValidate className="card flex w-full flex-col gap-5 p-6 sm:p-8">
        <h1 className="text-4xl font-bold sm:text-5xl">Welcome back</h1>
        <div>
          <label htmlFor="l-user" className={label}>Username</label>
          <input id="l-user" className={input} value={username} autoComplete="username" autoCapitalize="none" spellCheck={false}
            aria-invalid={!!error} aria-describedby="l-err" onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div>
          <label htmlFor="l-pass" className={label}>Password</label>
          <div className="flex gap-2">
            <input id="l-pass" type={show ? 'text' : 'password'} className={input} value={password} autoComplete="current-password"
              aria-invalid={!!error} aria-describedby="l-err" onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="btn shrink-0 px-4 text-base" aria-pressed={show} onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
          </div>
        </div>
        <p id="l-err" role="alert" className="text-base font-bold text-red-700">{error}</p>
        <button type="submit" className="btn btn-pink" disabled={busy}>{busy ? 'Logging in…' : 'Log in'}</button>
        {/* Inactive until password reset ships (docs/backlog.md). */}
        <span aria-disabled="true" className="text-center text-base text-ink/50">Forgot password?</span>
        <p className="text-center text-base">New here? <Link to="/register" state={state} className="font-bold underline">Sign up</Link></p>
      </form>
    </AuthStage>
  )
}
