import { Link, useNavigate, useParams } from 'react-router-dom'
import { useState } from 'react'
import Mascot from '../components/Mascot'
import FoodArt from '../components/FoodArt'
import { Plate, SLOT_COLOR, DISH, SLOT_LABEL, fmt } from '../components/Bits'
import { ArrowLeft, Check, Clock } from '../components/Icons'
import { MEALS, fitsDiet, type Meal } from '../data/meals'
import { catalog } from '../lib/catalog'
import { useStore } from '../store'
import { dateKey } from '../lib/date'
import { mealOnToday, tick } from '../lib/planDay'

const STAGE = { breakfast: 'bg-butter/45', lunch: 'bg-sky/45', snack: 'bg-lilac/45', dinner: 'bg-pink/45' }
const DIET_LABEL ={ vegan: '🥦 Vegan', vegetarian: '🧀 Vegetarian', anything: '🍗 Omnivore' }

export default function MealPage() {
  const { id = '' } = useParams()
  const nav = useNavigate()
  const { state, set } = useStore()
  const [got, setGot] = useState<Set<number>>(new Set())
  const m: Meal | undefined = catalog(state).meal(id)
  if (!m) return <div className="wrap py-20 text-center"><h1 className="text-4xl font-bold">Meal not found</h1><Link to="/" className="btn mt-6">Home</Link></div>

  // when this meal is on today's plan: show today's portion and let it be ticked from here
  const today = dateKey()
  const { index: mealIdx, scale, eaten } = mealOnToday(state, id, today)
  const diet = state.profile?.diet ?? 'anything'
  const more = MEALS.filter((x) => x.slot === m.slot && x.id !== m.id && fitsDiet(x, diet)).slice(0, 3)
  const k = (n: number) => fmt(n * scale)

  return (
    <div className="wrap max-w-5xl pb-16 pt-2">
      <button type="button" onClick={() => nav(-1)} className="btn !min-h-11"><ArrowLeft />Back</button>
      {/* hero stage tinted by meal slot, same outlined-shape language as the wizard stage */}
      <div className={`relative isolate mt-6 grid gap-8 overflow-hidden rounded-[2rem] border-[2.5px] border-ink p-6 shadow-pop sm:p-10 md:grid-cols-[auto_1fr] md:items-center ${STAGE[m.slot]}`}>
        <svg viewBox="0 0 200 200" className="absolute -bottom-24 -left-20 -z-10 hidden w-80 text-paper md:block" aria-hidden="true"><circle cx="100" cy="100" r="90" fill="currentColor" stroke="var(--color-ink)" strokeWidth="1.2" /></svg>
        <svg viewBox="0 0 200 200" className="absolute -bottom-36 -right-20 -z-10 hidden w-64 text-paper md:block" aria-hidden="true"><rect x="20" y="20" width="160" height="160" rx="50" fill="currentColor" stroke="var(--color-ink)" strokeWidth="1.2" transform="rotate(14 100 100)" /></svg>
        <div className="relative mx-auto pb-2 pr-20 sm:pb-4 sm:pr-32">
          {/* Plate sizes by prop, so phones get a smaller copy to keep the title above the fold */}
          <div className="rounded-full shadow-pop sm:hidden"><Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={170} /></div>
          <div className="rounded-full shadow-pop max-sm:hidden"><Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={300} /></div>
          {/* mascot leans in toward the plate */}
          <Mascot size={220} flip hopKey={eaten} className="absolute -bottom-2 -right-2 origin-bottom-right max-sm:scale-[0.65]" />
          <span className="sticker absolute right-0 top-2 rotate-[8deg] bg-paper text-lg sm:right-4 sm:top-6 sm:text-xl" aria-hidden="true">Yum!</span>
        </div>
        <div>
          <div className="flex flex-wrap gap-2">
            <span className={`chip ${SLOT_COLOR[m.slot]}`}>{SLOT_LABEL[m.slot]}</span>
            <span className="chip"><Clock />{m.minutes} min</span>
            <span className="chip">{DIET_LABEL[m.diet]}</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[1.02] sm:text-6xl">{m.name}</h1>
          <div className="mt-5 grid grid-cols-4 gap-2 sm:mt-6 sm:gap-3">
            {([['kcal', k(m.kcal), 'bg-butter'], ['protein', `${k(m.protein)} g`, 'bg-pink'], ['carbs', `${k(m.carbs)} g`, 'bg-sky'], ['fat', `${k(m.fat)} g`, 'bg-lilac']] as const).map(([l, v, c]) => (
              <div key={l} className={`rounded-2xl border-[2.5px] border-ink px-1 py-2 text-center sm:p-3 ${c}`}>
                <p className="font-display text-lg font-bold sm:text-2xl">{v}</p><p className="text-sm font-bold">{l}</p>
              </div>
            ))}
          </div>
          {scale !== 1 && <p className="mt-3 text-sm text-ink-soft">Numbers include today&apos;s portion size (×{scale}).</p>}
          {mealIdx >= 0 && (
            <button type="button" aria-pressed={eaten} onClick={() => set(tick(today, `meal-${mealIdx}`))} className={`btn mt-5 !min-h-14 !px-8 !text-xl ${eaten ? 'btn-pink' : 'btn-ink'}`}>
              {eaten ? <><Check />Eaten today</> : 'Mark as eaten'}
            </button>
          )}
        </div>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <section className="card overflow-hidden">
          <h2 className="border-b-[2.5px] border-ink bg-butter px-6 py-4 text-3xl font-bold">Ingredients</h2>
          <div className="p-6 pt-4">
          <ul className="space-y-2">
            {m.ingredients.map((ing, i) => {
              const on = got.has(i)
              return (
                <li key={i}>
                  <button type="button" aria-pressed={on} onClick={() => setGot((g) => { const n = new Set(g); if (n.has(i)) n.delete(i); else n.add(i); return n })} className="flex w-full items-center gap-3 rounded-xl p-1.5 text-left hover:bg-butter/40">
                    <span className={`grid size-7 shrink-0 place-items-center rounded-lg border-[2.5px] border-ink ${on ? 'bg-pink-deep text-paper' : ''}`}>{on && <Check className="size-4" />}</span>
                    <span className={on ? 'line-through opacity-60' : ''}>{ing}</span>
                  </button>
                </li>
              )
            })}
          </ul>
          </div>
        </section>
        <section className="card overflow-hidden">
          <h2 className="border-b-[2.5px] border-ink bg-sky px-6 py-4 text-3xl font-bold">How to make it</h2>
          <div className="p-6">
          <ol className="space-y-4">
            {m.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className={`grid size-9 shrink-0 place-items-center rounded-full border-[2.5px] border-ink font-display font-bold ${['bg-pink', 'bg-sky', 'bg-butter'][i % 3]}`}>{i + 1}</span>
                <p className="pt-1">{s}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 rounded-2xl bg-pink/50 p-4 font-display text-lg font-medium">Takes about {m.minutes} minutes. You&apos;ve got this!</p>
          </div>
        </section>
      </div>

      {more.length > 0 && (
        <section className="mt-12">
          <h2 className="text-3xl font-bold">More {SLOT_LABEL[m.slot].toLowerCase()} ideas</h2>
          <ul className="mt-5 grid gap-5 sm:grid-cols-3">
            {more.map((x) => (
              <li key={x.id}>
                <Link to={`/meal/${x.id}`} className="card flex items-center gap-4 p-4 transition-transform duration-150 hover:-translate-y-1">
                  <Plate art={<FoodArt meal={x} dish={DISH[x.slot]} />} color={SLOT_COLOR[x.slot]} size={60} />
                  <span className="leading-tight"><span className="block font-display text-xl font-semibold">{x.name}</span><span className="text-sm text-ink-soft">{x.kcal} kcal · {x.minutes} min</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
