import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import FoodArt from '../components/FoodArt'
import MoveArt from '../components/MoveArt'
import { Plate, SLOT_COLOR, SLOT_LABEL, KIND_COLOR, DISH, fmt } from '../components/Bits'
import { useStore } from '../store'
import { catalog, isCustom } from '../lib/catalog'
import { addCustomMeal, addCustomMove, INTENSITY_MET, type CustomMoveInput, type Intensity } from '../lib/planDay'
import type { Diet, Meal, Slot } from '../data/meals'
import type { Move, MoveKind } from '../data/exercises'

const input = 'w-full rounded-2xl border-[2.5px] border-ink bg-paper px-4 py-2.5 font-display text-lg font-semibold outline-none focus:shadow-pop'
const label = 'mb-1 block font-display text-base font-semibold'
const SLOTS: Slot[] = ['breakfast', 'lunch', 'snack', 'dinner']
const DIETS: [Diet, string][] = [['anything', 'Omnivore'], ['vegetarian', 'Vegetarian'], ['vegan', 'Vegan']]
const blank = { name: '', slot: 'breakfast' as Slot, kcal: '', protein: '', carbs: '', fat: '', diet: 'anything' as Diet, emoji: '', minutes: '', ingredients: '', steps: '' }
const lines = (t: string) => t.split('\n').map((l) => l.trim()).filter(Boolean)

function MealForm({ onSave, onCancel }: { onSave: (m: Omit<Meal, 'id'>) => void; onCancel: () => void }) {
  const [f, setF] = useState(blank)
  const field = (k: keyof typeof blank) => ({ id: `meal-${k}`, value: f[k], onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }) })
  const num = (k: 'kcal' | 'protein' | 'carbs' | 'fat' | 'minutes', min: number, required = true) => (
    <div>
      <label htmlFor={`meal-${k}`} className={label}>{k === 'kcal' ? 'Calories (kcal)' : k === 'minutes' ? 'Minutes to make' : `${k[0].toUpperCase()}${k.slice(1)} (g)`}</label>
      <input {...field(k)} type="number" inputMode="decimal" min={min} step="any" required={required} className={input} />
    </div>
  )
  const submit = (e: FormEvent) => {
    e.preventDefault()
    // the browser checks required and min; this guards the name against spaces only
    if (!f.name.trim()) return
    onSave({
      name: f.name.trim(), slot: f.slot, diet: f.diet, emoji: f.emoji.trim() || '🍽️',
      kcal: Number(f.kcal), protein: Number(f.protein), carbs: Number(f.carbs), fat: Number(f.fat),
      minutes: Number(f.minutes) || 0, ingredients: lines(f.ingredients), steps: lines(f.steps),
    })
  }
  return (
    <form onSubmit={submit} className="card mt-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-7" aria-labelledby="add-meal-h">
      <h2 id="add-meal-h" className="text-3xl font-bold sm:col-span-2">Add a Meal</h2>
      <div className="sm:col-span-2">
        <label htmlFor="meal-name" className={label}>Name</label>
        <input {...field('name')} required pattern=".*\S.*" maxLength={60} className={input} />
      </div>
      <div>
        <label htmlFor="meal-slot" className={label}>Meal slot</label>
        <select {...field('slot')} className={input}>{SLOTS.map((s) => <option key={s} value={s}>{SLOT_LABEL[s]}</option>)}</select>
      </div>
      <div>
        <label htmlFor="meal-diet" className={label}>Diet it fits</label>
        <select {...field('diet')} className={input}>{DIETS.map(([d, l]) => <option key={d} value={d}>{l}</option>)}</select>
      </div>
      {num('kcal', 1)}
      {num('protein', 0)}
      {num('carbs', 0)}
      {num('fat', 0)}
      <div>
        <label htmlFor="meal-emoji" className={label}>Emoji <span className="font-normal text-ink-soft">(optional)</span></label>
        <input {...field('emoji')} maxLength={8} className={input} />
      </div>
      {num('minutes', 0, false)}
      <div>
        <label htmlFor="meal-ingredients" className={label}>Ingredients <span className="font-normal text-ink-soft">(optional, one per line)</span></label>
        <textarea {...field('ingredients')} rows={4} className={input} />
      </div>
      <div>
        <label htmlFor="meal-steps" className={label}>Steps <span className="font-normal text-ink-soft">(optional, one per line)</span></label>
        <textarea {...field('steps')} rows={4} className={input} />
      </div>
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button type="submit" className="btn btn-ink">Save Meal</button>
        <button type="button" onClick={onCancel} className="btn">Cancel</button>
      </div>
    </form>
  )
}

const Tag = ({ id }: { id: string }) => <span className={`chip shrink-0 ${isCustom(id) ? 'bg-butter' : ''}`}>{isCustom(id) ? 'Custom' : 'Built-in'}</span>

const KINDS: MoveKind[] = ['warmup', 'cardio', 'strength', 'cooldown']
const KIND_LABEL: Record<MoveKind, string> = { warmup: 'Warm-up', cardio: 'Cardio', strength: 'Strength', cooldown: 'Cool-down' }
const INTENSITIES = Object.keys(INTENSITY_MET) as Intensity[]
const blankMove = { name: '', kind: 'cardio' as MoveKind, intensity: 'moderate' as Intensity, minutes: '', emoji: '', dose: '', how: '' }

function MoveForm({ onSave, onCancel }: { onSave: (m: CustomMoveInput) => void; onCancel: () => void }) {
  const [f, setF] = useState(blankMove)
  const field = (k: keyof typeof blankMove) => ({ id: `move-${k}`, value: f[k], onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }) })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    // the browser checks required and min; this guards against spaces-only names and minutes of 0 or less
    if (!f.name.trim() || !(Number(f.minutes) > 0)) return
    onSave({ name: f.name.trim(), kind: f.kind, intensity: f.intensity, minutes: Number(f.minutes), emoji: f.emoji.trim(), dose: f.dose.trim(), how: f.how.trim() })
  }
  return (
    <form onSubmit={submit} className="card mt-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-7" aria-labelledby="add-move-h">
      <h2 id="add-move-h" className="text-3xl font-bold sm:col-span-2">Add a Move</h2>
      <div className="sm:col-span-2">
        <label htmlFor="move-name" className={label}>Name</label>
        <input {...field('name')} required pattern=".*\S.*" maxLength={60} className={input} />
      </div>
      <div>
        <label htmlFor="move-kind" className={label}>Kind</label>
        <select {...field('kind')} className={input}>{KINDS.map((k) => <option key={k} value={k}>{KIND_LABEL[k]}</option>)}</select>
      </div>
      <div>
        <label htmlFor="move-intensity" className={label}>Intensity</label>
        <select {...field('intensity')} className={input}>{INTENSITIES.map((i) => <option key={i} value={i}>{i[0].toUpperCase() + i.slice(1)}</option>)}</select>
      </div>
      <div>
        <label htmlFor="move-minutes" className={label}>Minutes</label>
        <input {...field('minutes')} type="number" inputMode="decimal" min={0.1} step="any" required className={input} />
      </div>
      <div>
        <label htmlFor="move-emoji" className={label}>Emoji <span className="font-normal text-ink-soft">(optional)</span></label>
        <input {...field('emoji')} maxLength={8} className={input} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="move-dose" className={label}>Dose <span className="font-normal text-ink-soft">(optional, like “3 × 10”)</span></label>
        <input {...field('dose')} maxLength={40} className={input} />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="move-how" className={label}>How to do it <span className="font-normal text-ink-soft">(optional)</span></label>
        <textarea {...field('how')} rows={3} className={input} />
      </div>
      <div className="flex flex-wrap gap-3 sm:col-span-2">
        <button type="submit" className="btn btn-ink">Save Move</button>
        <button type="button" onClick={onCancel} className="btn">Cancel</button>
      </div>
    </form>
  )
}

function MoveRow({ m }: { m: Move }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border-2 border-ink/15 bg-paper p-2.5">
      {isCustom(m.id) ? <Plate emoji={m.emoji} color={KIND_COLOR[m.kind]} size={48} /> : <Plate art={<MoveArt id={m.id} />} color={KIND_COLOR[m.kind]} size={48} />}
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-semibold">{m.name}</p>
        <p className="text-sm font-bold text-ink-soft">{m.minutes[0] === m.minutes[1] ? m.minutes[0] : m.minutes.join('–')} min · {m.dose[0]}</p>
      </div>
      <Tag id={m.id} />
    </li>
  )
}

function MealRow({ m }: { m: Meal }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border-2 border-ink/15 bg-paper p-2.5">
      <Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={48} />
      <div className="min-w-0 flex-1">
        <Link to={`/meal/${m.id}`} className="block truncate font-display text-lg font-semibold hover:underline">{m.name}</Link>
        <p className="text-sm font-bold text-ink-soft">{fmt(m.kcal)} kcal · P {m.protein} · C {m.carbs} · F {m.fat}</p>
      </div>
      <Tag id={m.id} />
    </li>
  )
}

type Tab = 'meals' | 'moves'

export default function Library() {
  const { state, set } = useStore()
  const [tab, setTab] = useState<Tab>('meals')
  const [adding, setAdding] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const cat = catalog(state)
  const done = (name: string) => { setAdding(false); setSaved(name) }
  const pick = (t: Tab) => { setTab(t); setAdding(false); setSaved(null) }
  const noun = tab === 'meals' ? 'Meal' : 'Move'
  return (
    <div className="wrap max-w-5xl pb-16 pt-2">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">Library</h1>
          <p className="mt-1 text-lg text-ink-soft">Every Meal and Move you can put in your Plan. Add your own.</p>
        </div>
        {!adding && <button type="button" onClick={() => { setAdding(true); setSaved(null) }} className="btn btn-ink">Add a {noun}</button>}
      </div>
      <div role="tablist" aria-label="Library" className="mt-5 flex gap-2">
        {(['meals', 'moves'] as Tab[]).map((t) => (
          <button key={t} type="button" role="tab" id={`tab-${t}`} aria-selected={tab === t} aria-controls="lib-panel" onClick={() => pick(t)} className={`btn ${tab === t ? 'btn-ink' : ''}`}>{t === 'meals' ? 'Meals' : 'Moves'}</button>
        ))}
      </div>
      <p role="status" className="mt-3 font-bold">{saved && `Saved “${saved}” to your ${noun}s.`}</p>
      <div role="tabpanel" id="lib-panel" aria-labelledby={`tab-${tab}`}>
        {tab === 'meals' ? (<>
          {adding && <MealForm onSave={(m) => { set(addCustomMeal(m)); done(m.name) }} onCancel={() => setAdding(false)} />}
          {SLOTS.map((slot) => (
            <section key={slot} className="mt-8" aria-labelledby={`lib-${slot}`}>
              <h2 id={`lib-${slot}`} className="text-2xl font-bold">{SLOT_LABEL[slot]}</h2>
              <ul className="mt-3 grid gap-2 md:grid-cols-2">
                {cat.meals.filter((m) => m.slot === slot).map((m) => <MealRow key={m.id} m={m} />)}
              </ul>
            </section>
          ))}
        </>) : (<>
          {adding && <MoveForm onSave={(m) => { set(addCustomMove(m)); done(m.name) }} onCancel={() => setAdding(false)} />}
          {KINDS.map((kind) => (
            <section key={kind} className="mt-8" aria-labelledby={`lib-${kind}`}>
              <h2 id={`lib-${kind}`} className="text-2xl font-bold">{KIND_LABEL[kind]}</h2>
              <ul className="mt-3 grid gap-2 md:grid-cols-2">
                {cat.moves.filter((m) => m.kind === kind).map((m) => <MoveRow key={m.id} m={m} />)}
              </ul>
            </section>
          ))}
        </>)}
      </div>
    </div>
  )
}
