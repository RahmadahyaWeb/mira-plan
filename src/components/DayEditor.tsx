import { useEffect, useRef, useState } from 'react'
import FoodArt from './FoodArt'
import MoveArt from './MoveArt'
import { Plate, SLOT_COLOR, SLOT_LABEL, KIND_COLOR, DISH, fmt } from './Bits'
import { useStore } from '../store'
import { catalog } from '../lib/catalog'
import { dateKey } from '../lib/date'
import { addMove, mealOptions, removeMove, replaceMove, setMeal } from '../lib/planDay'

/** What the panel is choosing for: a meal position, a Move to replace, or a Move to add. */
export type Choosing = { meal: number } | { move: number } | 'add' | null

const row = 'flex w-full items-center gap-3 rounded-2xl border-2 border-ink/15 bg-paper p-2 text-left transition-colors hover:border-ink hover:bg-butter/40'

/** Panel to pick Meals and add, remove or replace Moves of one Plan day. Changes repeat every week. */
export default function DayEditor({ dayIdx, pick: initial, onClose }: { dayIdx: number; pick: Choosing; onClose: () => void }) {
  const { state, set } = useStore()
  const ref = useRef<HTMLDialogElement>(null)
  const [pick, setPick] = useState<Choosing>(initial)
  useEffect(() => { ref.current?.showModal() }, [])
  const { plan, profile } = state
  if (!plan || !profile) return null
  const cat = catalog(state)
  const day = plan.days[dayIdx]
  const today = dateKey() // ticks only move for the real today, not the date being viewed

  let title = 'Edit this Plan day'
  let list = null
  if (pick && pick !== 'add' && 'meal' in pick) {
    const cur = day.meals[pick.meal]
    title = `Pick a ${SLOT_LABEL[cur.slot]} Meal`
    list = mealOptions(state, dayIdx, pick.meal).map((m) => (
      <li key={m.id}><button type="button" aria-current={m.id === cur.id} onClick={() => { set(setMeal(dayIdx, pick.meal, m.id, today)); setPick(null) }} className={`${row} ${m.id === cur.id ? '!border-ink bg-butter/60' : ''}`}>
        <Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={44} />
        <span className="min-w-0 flex-1 leading-tight"><span className="block font-display text-lg font-semibold">{m.name}</span><span className="text-sm font-bold text-ink-soft">{fmt(m.kcal)} kcal</span></span>
      </button></li>
    ))
  } else if (pick) {
    title = pick === 'add' ? 'Add a Move' : `Replace ${cat.move(day.workout.moves[pick.move]).name}`
    list = cat.moves.map((mv) => (
      <li key={mv.id}><button type="button" onClick={() => { set(pick === 'add' ? addMove(dayIdx, mv.id, today) : replaceMove(dayIdx, pick.move, mv.id, today)); setPick(null) }} className={row}>
        <Plate art={<MoveArt id={mv.id} />} color={KIND_COLOR[mv.kind]} size={44} />
        <span className="min-w-0 flex-1 leading-tight"><span className="block font-display text-lg font-semibold">{mv.name}</span><span className="text-sm font-bold capitalize text-ink-soft">{mv.kind} · {mv.dose[profile.level]}</span></span>
      </button></li>
    ))
  }

  return (
    <dialog ref={ref} onClose={onClose} aria-labelledby="day-editor-h" className="m-auto max-h-[85vh] w-[min(560px,calc(100vw-32px))] overflow-y-auto rounded-3xl border-[2.5px] border-ink bg-paper p-5 text-ink shadow-pop backdrop:bg-ink/40 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h2 id="day-editor-h" className="text-2xl font-bold">{title}</h2>
        <button type="button" onClick={() => (pick ? setPick(null) : ref.current?.close())} className="btn !min-h-10 px-4 text-sm">{pick ? 'Back' : 'Done'}</button>
      </div>
      {list ? <ul className="mt-4 space-y-2">{list}</ul> : <>
        <h3 className="mt-4 font-display text-lg font-semibold">Meals</h3>
        <ul className="mt-2 space-y-2">
          {day.meals.map((pm, i) => {
            const m = cat.meal(pm.id)
            return <li key={i}><button type="button" onClick={() => setPick({ meal: i })} aria-label={`Change ${SLOT_LABEL[pm.slot]}: ${m.name}`} className={row}>
              <Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={44} />
              <span className="min-w-0 flex-1 leading-tight"><span className="block text-sm font-bold text-ink-soft">{SLOT_LABEL[pm.slot]}</span><span className="block font-display text-lg font-semibold">{m.name}</span></span>
              <span className="text-sm font-bold text-ink-soft">Change</span>
            </button></li>
          })}
        </ul>
        <h3 className="mt-5 font-display text-lg font-semibold">Workout · {day.workout.title}</h3>
        <ul className="mt-2 space-y-2">
          {day.workout.moves.map((id, i) => {
            const mv = cat.move(id)
            return <li key={i} className="flex items-center gap-3 rounded-2xl border-2 border-ink/15 p-2">
              <Plate art={<MoveArt id={mv.id} />} color={KIND_COLOR[mv.kind]} size={44} />
              <span className="min-w-0 flex-1 font-display text-lg font-semibold leading-tight">{mv.name}</span>
              <button type="button" onClick={() => setPick({ move: i })} aria-label={`Replace ${mv.name}`} className="btn !min-h-10 px-3 text-sm">Replace</button>
              <button type="button" onClick={() => set(removeMove(dayIdx, i, today))} aria-label={`Remove ${mv.name}`} className="btn !min-h-10 px-3 text-sm">Remove</button>
            </li>
          })}
          {!day.workout.moves.length && <li className="text-ink-soft">No Moves: a full day off.</li>}
        </ul>
        <button type="button" onClick={() => setPick('add')} className="btn btn-ink mt-3">Add a Move</button>
      </>}
    </dialog>
  )
}
