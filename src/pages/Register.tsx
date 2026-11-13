import { useEffect, useState, type FormEvent } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../auth'
import { supabase } from '../lib/supabase'
import { normalizeUsername, validateUsername } from '../lib/username'

const input = 'w-full rounded-2xl border-[2.5px] border-ink px-4 py-3 font-display text-xl font-semibold outline-none focus:shadow-pop'
const label = 'mb-1.5 block font-display text-lg font-semibold'

export default function Register() {
  const { signUp } = useAuth()
  const { state } = useLocation()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [takenName, setTakenName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const taken = takenName === normalizeUsername(username)
  const userError = validateUsername(username) ?? (taken ? 'That username is taken.' : null)
  const emailError = /^\S+@\S+\.\S+$/.test(email.trim()) ? null : 'Enter a valid email address.'
  const passError = password.length >= 8 ? null : 'Password must be at least 8 characters.'

  // Instant availability check; a stale reply for an older input is ignored.
  useEffect(() => {
    if (validateUsername(username)) return
    let stale = false
    const t = setTimeout(async () => {
      const { data } = await supabase.rpc('username_available', { u: normalizeUsername(username) })
      if (!stale && data === false) setTakenName(normalizeUsername(username))
    }, 300)
    return () => { stale = true; clearTimeout(t) }
  }, [username])

  async function submit(e: FormEvent) {
    e.preventDefault()
    setSubmitted(true)
    setFormError(null)
    if (userError || emailError || passError) return
    setBusy(true)
    const err = await signUp(username, email.trim(), password)
    setBusy(false)
    if (err) setFormError(/already|duplicate|database error/i.test(err) ? 'Could not create the account. The username or email may already be registered.' : err)
  }

  const show1 = (msg: string | null) => (submitted ? msg : null)
  const uErr = username === '' ? show1(userError) : userError

  return (
    <div className="wrap py-10">
      <form onSubmit={submit} noValidate className="card mx-auto flex w-full max-w-md flex-col gap-5 p-6 sm:p-8">
        <h1 className="text-4xl font-bold">Make your account</h1>
        <div>
          <label htmlFor="r-user" className={label}>Username</label>
          <input id="r-user" className={input} value={username} autoComplete="username" autoCapitalize="none" spellCheck={false}
            aria-invalid={!!uErr} aria-describedby="r-user-e" onChange={(e) => setUsername(e.target.value)} />
          <p id="r-user-e" role="alert" className="mt-1 text-base font-bold text-red-700">{uErr}</p>
        </div>
        <div>
          <label htmlFor="r-email" className={label}>Email</label>
          <input id="r-email" type="email" className={input} value={email} autoComplete="email"
            aria-invalid={!!show1(emailError)} aria-describedby="r-email-e" onChange={(e) => setEmail(e.target.value)} />
          <p id="r-email-e" role="alert" className="mt-1 text-base font-bold text-red-700">{show1(emailError)}</p>
        </div>
        <div>
          <label htmlFor="r-pass" className={label}>Password</label>
          <div className="flex gap-2">
            <input id="r-pass" type={show ? 'text' : 'password'} className={input} value={password} autoComplete="new-password"
              aria-invalid={!!show1(passError)} aria-describedby="r-pass-e" onChange={(e) => setPassword(e.target.value)} />
            <button type="button" className="btn shrink-0 px-4 text-base" onClick={() => setShow(!show)}>{show ? 'Hide' : 'Show'}</button>
          </div>
          <p id="r-pass-e" role="alert" className="mt-1 text-base font-bold text-red-700">{show1(passError)}</p>
        </div>
        <p role="alert" className="text-base font-bold text-red-700">{formError}</p>
        <button type="submit" className="btn btn-pink" disabled={busy}>{busy ? 'Creating…' : 'Create account'}</button>
        <p className="text-center text-base">Already have an account? <Link to="/login" state={state} className="font-bold underline">Log in</Link></p>
      </form>
    </div>
  )
}
