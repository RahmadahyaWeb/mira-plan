import MoveArt from '../components/MoveArt'
import { Link, useParams } from 'react-router-dom'
import Mascot from '../components/Mascot'
import FoodArt from '../components/FoodArt'
import Ring from '../components/Ring'
import { Bubble, Plate, KIND_COLOR, SLOT_COLOR, DISH, SLOT_LABEL, fmt } from '../components/Bits'
import { ArrowLeft, ArrowRight, Bolt, Check, Clock, Drop, Flame, Swap } from '../components/Icons'
import { useStore } from '../store'
import { addDays, dateKey, prettyDay } from '../lib/date'
import { streak } from '../lib/track'
import { WATER_GOAL, drink, planDay, swap, tick } from '../lib/planDay'
import { type Slot } from '../data/meals'
import { catalog } from '../lib/catalog'
import NoPlan from '../components/NoPlan'

const ROW: Record<Slot, string> = { breakfast: 'bg-butter/25', lunch: 'bg-sky/20', snack: 'bg-lilac/25', dinner: 'bg-pink/20' }
const ROW_ON: Record<Slot, string> = { breakfast: 'bg-butter/70', lunch: 'bg-sky/60', snack: 'bg-lilac/70', dinner: 'bg-pink/60' }

function Tick({ on, label, onClick }: { on: boolean; label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={on} aria-label={`${on ? 'Untick' : 'Tick'} ${label}`}
      className={`grid size-12 shrink-0 place-items-center rounded-full border-[2.5px] border-ink transition-[background-color,transform] duration-150 hover:scale-105 active:scale-95 ${on ? 'bg-pink-deep text-paper shadow-pop-sm' : 'bg-paper'}`}>
      {on && <Check className="size-6 animate-pop" />}
    </button>
  )
}

function cheer(ratio: number, rest: boolean, name: string) {
  const hi = name ? `, ${name}` : ''
  if (ratio >= 1) return `You did it all${hi}! Happy hop!`
  if (ratio >= 0.75) return 'So close! Just a little more sparkle.'
  if (ratio >= 0.4) return 'Look at you go! Keep ticking.'
  if (ratio > 0) return 'Great start! One tick at a time.'
  return rest ? `Rest day${hi}. Eat well and take a gentle walk.` : `Ready to sparkle${hi}? Let's start with breakfast.`
}

export default function Today() {
  const { state, set } = useStore()
  const params = useParams()
  const today = dateKey()
  const key = params.key ?? today
  const { plan, profile, log } = state
  if (!plan || !profile) return <NoPlan />
  const cat = catalog(state)

  const { day, index: dayIdx, done, progress: prog, water, eaten, burned, macros } = planDay({ plan, profile, log }, key)
  const st = streak(plan, log, today)
  const toggle = (id: string) => set(tick(key, id))
  const isToday = key === today
  const label = isToday ? 'Today' : key === addDays(today, -1) ? 'Yesterday' : key === addDays(today, 1) ? 'Tomorrow' : prettyDay(key, { weekday: 'long' })

  return (
    <div className="wrap pb-16 pt-2">
      {/* header */}
      <div className="flex items-end justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-ink-soft sm:text-base">{prettyDay(key)} · plan day {dayIdx + 1} of 7</p>
          <h1 className="truncate text-4xl font-bold sm:text-6xl">{label}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Link to={`/today/${addDays(key, -1)}`} className="btn !size-12 !px-0" aria-label="Previous day"><ArrowLeft /></Link>
          {!isToday && <Link to="/today" className="btn !min-h-12 max-sm:!px-4">Today</Link>}
          <Link to={`/today/${addDays(key, 1)}`} className="btn !size-12 !px-0" aria-label="Next day"><ArrowRight /></Link>
        </div>
      </div>

      <div className="mt-10 flex items-end gap-2 rounded-3xl border-[2.5px] border-ink bg-pink py-3 pl-1 pr-4 shadow-pop-sm lg:hidden">
        <Mascot size={104} hopKey={prog.done} className="-mt-10 -mb-1 shrink-0" />
        <div className="min-w-0 flex-1 pb-1">
          <p className="font-display text-base font-semibold leading-snug">{cheer(prog.ratio, day.workout.rest, profile.name)}</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-4 flex-1 overflow-hidden rounded-full border-[2.5px] border-ink bg-paper"><div className="h-full bg-pink-deep transition-[width] duration-500" style={{ width: `${prog.ratio * 100}%` }} /></div>
            <p className="font-display text-lg font-bold">{prog.done}/{prog.total}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:mt-8 lg:grid-cols-[1fr_360px]">
        <div className="space-y-6">
          {/* meals */}
          <section className="card p-3 sm:p-6" aria-labelledby="menu-h">
            <div className="flex items-baseline justify-between gap-3">
              <h2 id="menu-h" className="px-2 pt-1 text-2xl font-bold sm:p-0 sm:text-3xl">Daily menu</h2>
              {day.scale !== 1 && <span className="chip bg-butter" title="All portions on this day are scaled to hit your calorie number">Portions ×{day.scale}</span>}
            </div>
            <ul className="mt-4 space-y-3">
              {day.meals.map((pm, i) => {
                const m = cat.meal(pm.id)
                const id = `meal-${i}`
                const on = done.has(id)
                return (
                  <li key={i} className={`flex items-center gap-3 rounded-2xl border-2 p-2.5 transition-colors sm:gap-4 sm:p-4 ${on ? `border-ink ${ROW_ON[m.slot]}` : `border-ink/12 ${ROW[m.slot]}`}`}>
                    <span className="sm:hidden"><Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={46} /></span>
                    <span className="max-sm:hidden"><Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={60} /></span>
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-base font-bold text-ink-soft"><span className="whitespace-nowrap">{SLOT_LABEL[m.slot]} · {fmt(m.kcal * day.scale)} kcal</span>{on && <span className="animate-pop rounded-full bg-ink px-2 py-px text-xs font-extrabold text-paper">Done</span>}</p>
                      <Link to={`/meal/${m.id}`} className={`block font-display text-lg font-semibold leading-tight hover:underline sm:text-2xl `}>{m.name}</Link>
                      <button type="button" onClick={() => set(swap(dayIdx, i))} className="mt-1 inline-flex items-center gap-1 rounded-full py-0.5 text-sm font-bold text-ink-soft sm:hidden"><Swap className="size-4" />Swap</button>
                      <p className="mt-0.5 hidden items-center gap-1 text-base font-semibold text-ink-soft sm:flex"><Clock />{m.minutes} min · P {Math.round(m.protein * day.scale)} · C {Math.round(m.carbs * day.scale)} · F {Math.round(m.fat * day.scale)}</p>
                    </div>
                    <button type="button" onClick={() => set(swap(dayIdx, i))} aria-label={`Swap ${m.name}`} title="Swap for another meal"
                      className="grid size-11 shrink-0 place-items-center rounded-full border-2 border-ink/25 bg-paper max-sm:hidden text-ink-soft transition-colors hover:border-ink hover:bg-sky hover:text-ink">
                      <Swap />
                    </button>
                    <Tick on={on} label={m.name} onClick={() => toggle(id)} />
                  </li>
                )
              })}
            </ul>
          </section>

          {/* workout */}
          <section className="card p-3 sm:p-6" aria-labelledby="move-h">
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 id="move-h" className="px-2 pt-1 text-2xl font-bold sm:p-0 sm:text-3xl">{day.workout.title}</h2>
              <span className="chip bg-sky">{day.workout.moves.reduce((s, id) => s + cat.move(id).minutes[profile.level], 0)} min{day.workout.rest ? ' · easy day' : ''}</span>
            </div>
            <ul className="mt-4 space-y-3">
              {day.workout.moves.map((mid, i) => {
                const mv = cat.move(mid)
                const id = `move-${i}`
                const on = done.has(id)
                return (
                  <li key={i} className={`flex items-center gap-3 rounded-2xl border-2 p-2.5 transition-colors sm:gap-4 sm:p-4 ${on ? 'border-ink bg-sky/50' : 'border-ink/12 bg-sky/12'}`}>
                    <Plate art={<MoveArt id={mv.id} />} color={KIND_COLOR[mv.kind]} size={52} />
                    <div className="min-w-0 flex-1">
                      <p className="flex items-center gap-2 text-base font-bold text-ink-soft"><span><span className="capitalize">{mv.kind}</span> · {mv.dose[profile.level]}</span>{on && <span className="animate-pop rounded-full bg-ink px-2 py-px text-xs font-extrabold text-paper">Done</span>}</p>
                      <p className={`font-display text-xl font-semibold leading-tight `}>{mv.name}</p>
                      <p className="mt-0.5 hidden text-base text-ink-soft sm:block">{mv.how}</p>
                    </div>
                    <Tick on={on} label={mv.name} onClick={() => toggle(id)} />
                  </li>
                )
              })}
            </ul>
          </section>
        </div>
        {/* progress column: right side on laptops, after the lists on phones */}
        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="card grid grid-cols-2 divide-x-2 divide-dashed divide-ink/20 p-4 lg:hidden">
            <div className="flex items-center gap-3"><span className="grid size-10 place-items-center rounded-full border-[2.5px] border-ink bg-butter text-pink-deep"><Flame /></span><p className="leading-tight"><span className="block font-display text-2xl font-bold">{st}</span><span className="text-sm font-bold text-ink-soft">day streak</span></p></div>
            <div className="flex items-center gap-3 pl-4"><span className="grid size-10 place-items-center rounded-full border-[2.5px] border-ink bg-sky"><Bolt /></span><p className="leading-tight"><span className="block font-display text-2xl font-bold">{fmt(burned)}</span><span className="text-sm font-bold text-ink-soft">kcal moved</span></p></div>
          </div>
          <div className="card mt-14 max-lg:hidden">
            <div className="flex items-end gap-2 rounded-t-[21px] bg-pink px-4 pb-4">
              <div className="relative -mt-16 shrink-0">
                <Mascot size={176} view="full" hopKey={prog.done} />
                {(day.workout.rest || prog.ratio >= 1) && <span className="absolute -top-1 right-0 grid size-9 animate-pop place-items-center rounded-full border-[2.5px] border-ink bg-butter text-lg" aria-hidden="true">{prog.ratio >= 1 ? '⭐' : '🌙'}</span>}
              </div>
              <Bubble side="left" className="mb-8 !text-base">{cheer(prog.ratio, day.workout.rest, profile.name)}</Bubble>
            </div>
            <div className="flex items-center gap-5 rounded-b-[21px] border-t-[2.5px] border-ink p-5">
              <Ring value={prog.ratio} size={140} stroke={18}>
                <div><p className="font-display text-4xl font-bold">{Math.round(prog.ratio * 100)}%</p><p className="text-sm font-bold text-ink-soft">{prog.done} of {prog.total}</p></div>
              </Ring>
              <dl className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <dt className="grid size-10 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-butter text-pink-deep"><Flame /><span className="sr-only">Streak</span></dt>
                  <dd className="leading-tight"><span className="block font-display text-2xl font-bold">{st}</span><span className="text-sm font-bold text-ink-soft">{st ? (st === 1 ? 'day streak' : 'day streak') : 'start a streak!'}</span></dd>
                </div>
                <div className="flex items-center gap-3">
                  <dt className="grid size-10 shrink-0 place-items-center rounded-full border-[2.5px] border-ink bg-sky text-ink"><Bolt /><span className="sr-only">Moved</span></dt>
                  <dd className="leading-tight"><span className="block font-display text-2xl font-bold">{fmt(burned)}</span><span className="text-sm font-bold text-ink-soft">kcal moved</span></dd>
                </div>
              </dl>
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-baseline justify-between"><h2 className="text-2xl font-semibold">Energy</h2><p className="font-bold"><span className="font-display text-2xl">{fmt(eaten.kcal)}</span> / {fmt(plan.target)} kcal</p></div>
            <div className="mt-3 h-6 overflow-hidden rounded-full border-[2.5px] border-ink bg-paper"><div className="h-full bg-butter-deep transition-[width] duration-500" style={{ width: `${Math.min(100, (eaten.kcal / plan.target) * 100)}%` }} /></div>
            <div className="mt-4 grid grid-cols-3 gap-3 text-center">
              {([['Protein', eaten.protein, macros.protein, 'bg-pink'], ['Carbs', eaten.carbs, macros.carbs, 'bg-sky'], ['Fat', eaten.fat, macros.fat, 'bg-lilac']] as const).map(([n, v, t, c]) => (
                <div key={n}>
                  <div className="h-4 overflow-hidden rounded-full border-2 border-ink"><div className={`h-full ${c}`} style={{ width: `${Math.min(100, (v / t) * 100)}%` }} /></div>
                  <p className="mt-1.5 font-bold">{n}</p><p className="text-[15px] text-ink-soft"><span className="font-bold text-ink">{Math.round(v)}</span> / {t} g</p>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5">
            <div className="flex items-baseline justify-between"><h2 className="text-2xl font-semibold">Water</h2><p className="font-bold">{water} / {WATER_GOAL} glasses</p></div>
            <div className="mt-3 grid grid-cols-8 gap-2">
              {Array.from({ length: WATER_GOAL }, (_, i) => (
                <button key={i} type="button" aria-label={`${i + 1} glass${i ? 'es' : ''} of water`} aria-pressed={i < water}
                  onClick={() => set(drink(key, i))}
                  className={`grid h-12 place-items-center rounded-b-2xl rounded-t-md border-[2.5px] border-ink transition-colors ${i < water ? 'bg-sky text-ink' : 'bg-paper text-ink/25'}`}>
                  <Drop className="size-5" />
                </button>
              ))}
            </div>
          </div>
        </aside>

      </div>
    </div>
  )
}
