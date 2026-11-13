import MoveArt from '../components/MoveArt'
import { Link } from 'react-router-dom'
import Ring from '../components/Ring'
import Mascot from '../components/Mascot'
import FoodArt from '../components/FoodArt'
import { Plate, SLOT_COLOR, DISH, fmt } from '../components/Bits'
import { Printer } from '../components/Icons'
import NoPlan from '../components/NoPlan'
import { useStore } from '../store'
import { dateKey, prettyDay } from '../lib/date'
import { planWeek } from '../lib/planDay'
import { MEAL_BY_ID } from '../data/meals'
import { MOVE_BY_ID } from '../data/exercises'

const TOPS = ['bg-pink', 'bg-sky', 'bg-butter', 'bg-lilac']

export default function Week() {
  const { state } = useStore()
  const { plan, profile, log } = state
  if (!plan || !profile) return <NoPlan />
  const today = dateKey()
  const { days, done: weekDone, total: weekTotal, mealCount, moveDays } = planWeek({ plan, profile, log }, today)
  return (
    <div className="wrap pb-16 pt-2">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-bold text-ink-soft">{prettyDay(days[0].key, { month: 'short', day: 'numeric' })} to {prettyDay(days[6].key, { month: 'short', day: 'numeric' })} · {fmt(plan.target)} kcal a day</p>
          <h1 className="text-5xl font-bold sm:text-6xl">Your week</h1>
        </div>
        <div className="no-print flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => window.print()} className="btn"><Printer />Print</button>
          <Link to="/plan" className="btn btn-pink">Remake plan</Link>
        </div>
      </div>

      <div className="no-print card relative mt-16 flex flex-col gap-4 bg-lilac px-6 py-5 sm:flex-row sm:items-end sm:gap-8">
        <Mascot size={220} hopKey={weekDone} className="mx-auto -mt-24 shrink-0 sm:mx-0 sm:-mb-8 sm:-mt-32" />
        <div className="min-w-0 flex-1 sm:pb-2">
          <ul className="mb-3 flex flex-wrap gap-2.5">
            <li className="sticker rotate-[-3deg] bg-butter text-base">7 days</li>
            <li className="sticker rotate-[2deg] bg-pink text-base">{mealCount} meals</li>
            <li className="sticker rotate-[-2deg] bg-sky text-base">{moveDays} workout days</li>
          </ul>
          <p className="font-display text-2xl font-semibold leading-tight sm:text-4xl">
            {weekDone === 0 ? 'Every sparkle starts with one tick!' : weekDone / weekTotal >= 0.8 ? 'You are a true unicorn!' : 'Keep going, you are doing great.'}
          </p>
          <div className="mt-3 flex items-center gap-3">
            <div className="h-6 flex-1 overflow-hidden rounded-full border-[2.5px] border-ink bg-paper"><div className="h-full bg-pink-deep transition-[width] duration-500" style={{ width: `${(weekDone / weekTotal) * 100}%` }} /></div>
            <p className="shrink-0 font-bold"><span className="font-display text-2xl">{weekDone}</span> / {weekTotal} ticked</p>
          </div>
        </div>
      </div>

      <ol className="mt-10 space-y-5">
        {days.map(({ key: k, day, progress: p }, i) => {
          const isToday = k === today
          return (
            <li key={k}>
              <Link to={`/today/${k}`} aria-label={`Open ${prettyDay(k)}`}
                className={`grid overflow-hidden rounded-3xl border-[2.5px] border-ink bg-paper transition-[transform,box-shadow] duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-pop lg:grid-cols-[170px_1fr_320px] print:grid-cols-[110px_1fr_200px] ${isToday ? 'shadow-pop ring-4 ring-pink-deep ring-offset-2' : 'shadow-pop-sm'}`}>
                <div className={`flex items-center justify-between gap-3 border-ink px-5 py-3 max-lg:border-b-[2.5px] lg:flex-col lg:items-start lg:justify-center lg:border-r-[2.5px] ${TOPS[i % 4]}`}>
                  <div className="leading-tight">
                    <p className="font-display text-4xl font-bold">{prettyDay(k, { weekday: 'short' })}</p>
                    {isToday
                      ? <p className="sticker mt-1 rotate-[-4deg] bg-paper !px-2 !py-0 text-sm">Today</p>
                      : <p className="font-bold">{prettyDay(k, { month: 'short', day: 'numeric' })}</p>}
                  </div>
                  {k > today && p.done === 0
                    ? <span className="rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-sm font-bold">{day.meals.length} meals</span>
                    : <Ring value={p.ratio} size={54} stroke={9}><span className="text-xs font-extrabold">{Math.round(p.ratio * 100)}%</span></Ring>}
                </div>
                <ul className="grid content-center gap-x-6 gap-y-4 px-5 py-4 sm:grid-cols-2">
                  {day.meals.map((pm, j) => {
                    const m = MEAL_BY_ID[pm.id]
                    return (
                      <li key={j} className="flex min-w-0 items-center gap-2.5">
                        <Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={52} />
                        <span className="min-w-0 leading-tight">
                          <span className="block text-sm font-bold capitalize text-ink-soft">{m.slot}</span>
                          <span className="block text-lg font-semibold">{m.name}</span>
                        </span>
                      </li>
                    )
                  })}
                </ul>
                <div className={`border-t-2 border-dashed border-ink/30 px-5 py-4 lg:border-l-2 lg:border-t-0 ${day.workout.rest ? 'bg-lilac/35' : 'bg-pink/25'}`}>
                  <p className="flex items-center gap-2 font-display text-xl font-semibold"><span className={`grid size-9 place-items-center rounded-full border-2 border-ink p-1 ${day.workout.rest ? 'bg-lilac' : 'bg-pink'}`}><MoveArt id={day.workout.rest ? 'yoga' : day.workout.moves[1]} /></span>{day.workout.title}</p>
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {day.workout.moves.slice(0, 3).map((id, j) => <li key={j} className="rounded-full border-2 border-ink bg-paper px-2.5 py-0.5 text-sm font-semibold">{MOVE_BY_ID[id].name}</li>)}
                    {day.workout.moves.length > 3 && <li className="rounded-full border-2 border-dashed border-ink/50 px-2.5 py-0.5 text-sm font-semibold">+{day.workout.moves.length - 3} more</li>}
                  </ul>
                </div>
              </Link>
            </li>
          )
        })}
      </ol>
    </div>
  )
}
