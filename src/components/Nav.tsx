import { NavLink, Link, useLocation } from 'react-router-dom'
import Mascot from './Mascot'
import { Calendar, CheckCircle, Flame, Sparkle } from './Icons'
import { streak } from '../lib/track'
import { dateKey } from '../lib/date'
import { useStore } from '../store'
import { useAuth } from '../auth'

const links = [
  { to: '/today', label: 'Today', Icon: CheckCircle },
  { to: '/week', label: 'Week', Icon: Calendar },
  { to: '/plan', label: 'My plan', Icon: Sparkle },
]

export default function Nav() {
  const { state } = useStore()
  const { account, signOut } = useAuth()
  const path = useLocation().pathname
  const onLanding = path === '/'
  const streakN = state.plan ? streak(state.plan, state.log, dateKey()) : 0
  return (
    <>
      <header className="no-print relative z-20">
        <div className="wrap flex h-20 items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2 rounded-full pr-2" aria-label="Mira home">
            <span className="grid size-12 place-items-center overflow-hidden rounded-full border-[2.5px] border-ink bg-pink shadow-pop-sm">
              <Mascot size={46} view="head" />
            </span>
            <span className="font-display text-2xl font-bold">Mira</span>
          </Link>
          {account && <nav aria-label="Main" className="hidden items-center gap-2 md:flex">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className={({ isActive }) => `rounded-full border-[2.5px] px-4 py-1.5 font-display text-lg font-semibold transition-colors ${isActive ? 'border-ink bg-butter' : 'border-transparent hover:border-ink'}`}>
                {l.label}
              </NavLink>
            ))}
          </nav>}
          <div className="flex items-center gap-2">
            {account ? (
              <>
                {state.plan && !onLanding && (
                  <Link to="/today" className="btn !min-h-11 !px-3 sm:!px-4 !text-base bg-butter whitespace-nowrap" aria-label={`${streakN} day streak, open today`}>
                    <Flame className="size-5 text-pink-deep" /><span className="sm:hidden">{streakN}</span><span className="hidden sm:inline">{streakN ? `${streakN} day streak` : 'Start a streak'}</span>
                  </Link>
                )}
                <span className="hidden font-display text-lg font-semibold sm:inline">{account.username}</span>
                <button type="button" onClick={signOut} className="btn !min-h-11 !px-3 sm:!px-4 !text-base whitespace-nowrap">Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn !min-h-11 !px-3 sm:!px-4 !text-base whitespace-nowrap">Log in</Link>
                <Link to="/register" className="btn btn-ink !min-h-11 !px-3 sm:!px-4 !text-base whitespace-nowrap">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>
      {/* phone tab bar, app pages only */}
      {account && !onLanding && <nav aria-label="Tabs" className="no-print fixed inset-x-3 bottom-3 z-30 grid grid-cols-3 gap-1 rounded-full border-[2.5px] border-ink bg-paper p-1.5 shadow-[4px_4px_0_0_var(--color-ink),0_6px_0_12px_var(--color-paper)] md:hidden">
        {links.map((l) => (
          <NavLink key={l.to} to={l.to} className={({ isActive }) => `flex min-h-12 items-center justify-center gap-1.5 rounded-full font-display font-semibold ${isActive ? 'bg-butter' : ''}`}>
            <l.Icon className="size-5" />{l.label}
          </NavLink>
        ))}
      </nav>}
    </>
  )
}
