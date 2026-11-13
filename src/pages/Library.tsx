import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import FoodArt from '../components/FoodArt'
import { Plate, SLOT_COLOR, SLOT_LABEL, DISH, fmt } from '../components/Bits'
import { useStore } from '../store'
import { catalog, isCustom } from '../lib/catalog'
import { addCustomMeal } from '../lib/planDay'
import type { Diet, Meal, Slot } from '../data/meals'

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

function MealRow({ m }: { m: Meal }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border-2 border-ink/15 bg-paper p-2.5">
      <Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={48} />
      <div className="min-w-0 flex-1">
        <Link to={`/meal/${m.id}`} className="block truncate font-display text-lg font-semibold hover:underline">{m.name}</Link>
        <p className="text-sm font-bold text-ink-soft">{fmt(m.kcal)} kcal · P {m.protein} · C {m.carbs} · F {m.fat}</p>
      </div>
      <span className={`chip shrink-0 ${isCustom(m.id) ? 'bg-butter' : ''}`}>{isCustom(m.id) ? 'Custom' : 'Built-in'}</span>
    </li>
  )
}

export default function Library() {
  const { state, set } = useStore()
  const [adding, setAdding] = useState(false)
  const [saved, setSaved] = useState<string | null>(null)
  const meals = catalog(state).meals
  const save = (m: Omit<Meal, 'id'>) => {
    set(addCustomMeal(m))
    setAdding(false)
    setSaved(m.name)
  }
  return (
    <div className="wrap max-w-5xl pb-16 pt-2">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold sm:text-5xl">Library</h1>
          <p className="mt-1 text-lg text-ink-soft">Every Meal you can put in your Plan. Add your own.</p>
        </div>
        {!adding && <button type="button" onClick={() => { setAdding(true); setSaved(null) }} className="btn btn-ink">Add a Meal</button>}
      </div>
      <p role="status" className="mt-3 font-bold">{saved && `Saved “${saved}” to your Meals.`}</p>
      {adding && <MealForm onSave={save} onCancel={() => setAdding(false)} />}
      {SLOTS.map((slot) => (
        <section key={slot} className="mt-8" aria-labelledby={`lib-${slot}`}>
          <h2 id={`lib-${slot}`} className="text-2xl font-bold">{SLOT_LABEL[slot]}</h2>
          <ul className="mt-3 grid gap-2 md:grid-cols-2">
            {meals.filter((m) => m.slot === slot).map((m) => <MealRow key={m.id} m={m} />)}
          </ul>
        </section>
      ))}
    </div>
  )
}
