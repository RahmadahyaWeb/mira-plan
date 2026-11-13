import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import FoodArt from '../components/FoodArt'
import Mascot from '../components/Mascot'
import { Plate, MovePlate, SLOT_COLOR, SLOT_LABEL, KIND_COLOR, DISH, fmt } from '../components/Bits'
import { useStore } from '../store'
import { catalog, isCustom } from '../lib/catalog'
import { addCustomMeal, addCustomMove, deleteCustomMeal, deleteCustomMove, editCustomMeal, editCustomMove, INTENSITY_MET, type CustomMoveInput, type Intensity } from '../lib/planDay'
import type { Diet, Meal, Slot } from '../data/meals'
import type { Move, MoveKind } from '../data/exercises'

const input = 'w-full rounded-2xl border-[2.5px] border-ink bg-paper px-4 py-2.5 font-display text-lg font-semibold outline-none focus:shadow-pop'
const label = 'mb-1 block font-display text-base font-semibold'
const SLOTS: Slot[] = ['breakfast', 'lunch', 'snack', 'dinner']
const DIETS: [Diet, string][] = [['anything', 'Omnivore'], ['vegetarian', 'Vegetarian'], ['vegan', 'Vegan']]
const blank = { name: '', slot: 'breakfast' as Slot, kcal: '', protein: '', carbs: '', fat: '', diet: 'anything' as Diet, emoji: '', minutes: '', ingredients: '', steps: '' }
const lines = (t: string) => t.split('\n').map((l) => l.trim()).filter(Boolean)

const mealFields = (m: Meal): typeof blank => ({
  name: m.name, slot: m.slot, diet: m.diet, emoji: m.emoji, kcal: String(m.kcal), protein: String(m.protein), carbs: String(m.carbs), fat: String(m.fat),
  minutes: m.minutes ? String(m.minutes) : '', ingredients: m.ingredients.join('\n'), steps: m.steps.join('\n'),
})

function MealForm({ initial, onSave, onCancel }: { initial?: Meal; onSave: (m: Omit<Meal, 'id'>) => void; onCancel: () => void }) {
  const [f, setF] = useState(initial ? mealFields(initial) : blank)
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
      <h2 id="add-meal-h" className="text-3xl font-bold sm:col-span-2">{initial ? 'Edit Meal' : 'Add a Meal'}</h2>
      <div className="sm:col-span-2">
        <label htmlFor="meal-name" className={label}>Name</label>
        <input {...field('name')} required pattern=".*\S.*" maxLength={60} autoFocus className={input} />
      </div>
      <div>
        <label htmlFor="meal-slot" className={label}>Meal slot{initial && <span className="font-normal text-ink-soft"> (fixed: Plan days keep it in this slot)</span>}</label>
        <select {...field('slot')} disabled={!!initial} className={input}>{SLOTS.map((s) => <option key={s} value={s}>{SLOT_LABEL[s]}</option>)}</select>
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

interface RowActions { onEdit: () => void; onDelete: () => void }

/** Built-in items never get these: nobody can change them. */
const Actions = ({ id, name, onEdit, onDelete }: RowActions & { id: string; name: string }) => isCustom(id) ? (
  <div className="flex shrink-0 gap-2 max-sm:w-full max-sm:pl-[60px]">
    <button type="button" onClick={onEdit} aria-label={`Edit ${name}`} className="btn !min-h-11 px-4 text-sm">Edit</button>
    <button type="button" onClick={onDelete} aria-label={`Delete ${name}`} className="btn !min-h-11 px-4 text-sm">Delete</button>
  </div>
) : null

/** Only Custom items get a tag: built-in is the default and needs no label. */
const Tag = ({ id }: { id: string }) => isCustom(id) ? <span className="chip shrink-0 rotate-[-3deg] bg-butter">Custom</span> : null
const row = (id: string) => `flex flex-wrap items-center gap-x-3 gap-y-2 rounded-2xl border-2 p-2.5 ${isCustom(id) ? 'border-ink bg-butter/25' : 'border-ink/15 bg-paper'}`

const KINDS: MoveKind[] = ['warmup', 'cardio', 'strength', 'cooldown']
const KIND_LABEL: Record<MoveKind, string> = { warmup: 'Warm-up', cardio: 'Cardio', strength: 'Strength', cooldown: 'Cool-down' }
const INTENSITIES = Object.keys(INTENSITY_MET) as Intensity[]
const blankMove = { name: '', kind: 'cardio' as MoveKind, intensity: 'moderate' as Intensity, minutes: '', emoji: '', dose: '', how: '' }

const moveFields = (m: Move): typeof blankMove => ({
  name: m.name, kind: m.kind, intensity: INTENSITIES.find((i) => INTENSITY_MET[i] === m.met) ?? 'moderate',
  minutes: String(m.minutes[0]), emoji: m.emoji, how: m.how,
  dose: m.dose[0] === `${m.minutes[0]} min` ? '' : m.dose[0], // a filled-in default, so new minutes refill it
})

function MoveForm({ initial, onSave, onCancel }: { initial?: Move; onSave: (m: CustomMoveInput) => void; onCancel: () => void }) {
  const [f, setF] = useState(initial ? moveFields(initial) : blankMove)
  const field = (k: keyof typeof blankMove) => ({ id: `move-${k}`, value: f[k], onChange: (e: { target: { value: string } }) => setF({ ...f, [k]: e.target.value }) })
  const submit = (e: FormEvent) => {
    e.preventDefault()
    // the browser checks required and min; this guards against spaces-only names and minutes of 0 or less
    if (!f.name.trim() || !(Number(f.minutes) > 0)) return
    onSave({ name: f.name.trim(), kind: f.kind, intensity: f.intensity, minutes: Number(f.minutes), emoji: f.emoji.trim(), dose: f.dose.trim(), how: f.how.trim() })
  }
  return (
    <form onSubmit={submit} className="card mt-6 grid gap-4 p-5 sm:grid-cols-2 sm:p-7" aria-labelledby="add-move-h">
      <h2 id="add-move-h" className="text-3xl font-bold sm:col-span-2">{initial ? 'Edit Move' : 'Add a Move'}</h2>
      <div className="sm:col-span-2">
        <label htmlFor="move-name" className={label}>Name</label>
        <input {...field('name')} required pattern=".*\S.*" maxLength={60} autoFocus className={input} />
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

function MoveRow({ m, ...a }: { m: Move } & RowActions) {
  return (
    <li className={row(m.id)}>
      <MovePlate mv={m} size={48} />
      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-lg font-semibold">{m.name}</p>
        <p className="text-sm font-bold text-ink-soft">{m.minutes[0] === m.minutes[1] ? m.minutes[0] : m.minutes.join('–')} min · {m.dose[0]}</p>
      </div>
      <Tag id={m.id} />
      <Actions id={m.id} name={m.name} {...a} />
    </li>
  )
}

function MealRow({ m, ...a }: { m: Meal } & RowActions) {
  return (
    <li className={row(m.id)}>
      <Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={48} />
      <div className="min-w-0 flex-1">
        <Link to={`/meal/${m.id}`} className="block truncate font-display text-lg font-semibold hover:underline">{m.name}</Link>
        <p className="text-sm font-bold text-ink-soft">{fmt(m.kcal)} kcal · P {m.protein} · C {m.carbs} · F {m.fat}</p>
      </div>
      <Tag id={m.id} />
      <Actions id={m.id} name={m.name} {...a} />
    </li>
  )
}

type Tab = 'meals' | 'moves'

export default function Library() {
  const { state, set } = useStore()
  const [tab, setTab] = useState<Tab>('meals')
  // null: no form; 'new': add form; otherwise the id of the Custom item being edited
  const [editing, setEditing] = useState<string | null>(null)
  const [status, setStatus] = useState<string | null>(null)
  const cat = catalog(state)
  const noun = tab === 'meals' ? 'Meal' : 'Move'
  const done = (msg: string) => { setEditing(null); setStatus(msg) }
  const saved = (name: string) => done(`Saved “${name}” to your ${noun}s.`)
  const pick = (t: Tab) => { setTab(t); setEditing(null); setStatus(null) }
  const open = (id: string) => { setEditing(id); setStatus(null) }
  const remove = (name: string, del: () => void) => {
    if (!window.confirm(`Delete “${name}”? It also leaves your Plan. This cannot be undone.`)) return
    del()
    done(`Deleted “${name}”.`)
  }
  const isNew = editing === 'new'
  return (
    <div className="wrap pb-16 pt-2">
      <div className="flex items-end gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink-soft sm:text-base">{cat.meals.length} Meals · {cat.moves.length} Moves</p>
          <h1 className="text-4xl font-bold sm:text-6xl">Library</h1>
          <p className="mt-1 text-base text-ink-soft sm:text-lg">Every Meal and Move you can put in your Plan. Add your own.</p>
        </div>
        <span className="relative hidden shrink-0 sm:block">
          <span className="absolute inset-x-2 bottom-1 top-6 rounded-full border-[2.5px] border-ink bg-sky" aria-hidden="true" />
          <Mascot size={150} className="relative" />
        </span>
      </div>
      <div className="mt-5 flex items-center gap-2">
        <div role="tablist" aria-label="Library" className="flex gap-2">
          {(['meals', 'moves'] as Tab[]).map((t) => (
            <button key={t} type="button" role="tab" id={`tab-${t}`} aria-selected={tab === t} aria-controls="lib-panel" onClick={() => pick(t)} className={`btn ${tab === t ? 'btn-ink' : ''}`}>{t === 'meals' ? 'Meals' : 'Moves'}</button>
          ))}
        </div>
        {!editing && <button type="button" onClick={() => open('new')} aria-label={`Add a ${noun}`} className="btn btn-pink ml-auto"><span aria-hidden="true">+</span> Add<span className="max-sm:hidden"> a {noun}</span></button>}
      </div>
      <p role="status" className="mt-3 font-bold empty:mt-0">{status}</p>
      <div role="tabpanel" id="lib-panel" aria-labelledby={`tab-${tab}`}>
        {tab === 'meals' ? (<>
          {editing && <MealForm key={editing} initial={cat.meals.find((m) => m.id === editing)} onSave={(m) => { set(isNew ? addCustomMeal(m) : editCustomMeal(editing, m)); saved(m.name) }} onCancel={() => setEditing(null)} />}
          {SLOTS.map((slot) => (
            <section key={slot} className="mt-8" aria-labelledby={`lib-${slot}`}>
              <h2 id={`lib-${slot}`} className="flex items-center gap-2 text-2xl font-bold"><span className={`size-4 rounded-full border-2 border-ink ${SLOT_COLOR[slot]}`} aria-hidden="true" />{SLOT_LABEL[slot]}</h2>
              <ul className="mt-3 grid gap-2 md:grid-cols-2">
                {cat.meals.filter((m) => m.slot === slot).map((m) => <MealRow key={m.id} m={m} onEdit={() => open(m.id)} onDelete={() => remove(m.name, () => set(deleteCustomMeal(m.id)))} />)}
              </ul>
            </section>
          ))}
        </>) : (<>
          {editing && <MoveForm key={editing} initial={cat.moves.find((m) => m.id === editing)} onSave={(m) => { set(isNew ? addCustomMove(m) : editCustomMove(editing, m)); saved(m.name) }} onCancel={() => setEditing(null)} />}
          {KINDS.map((kind) => (
            <section key={kind} className="mt-8" aria-labelledby={`lib-${kind}`}>
              <h2 id={`lib-${kind}`} className="flex items-center gap-2 text-2xl font-bold"><span className={`size-4 rounded-full border-2 border-ink ${KIND_COLOR[kind]}`} aria-hidden="true" />{KIND_LABEL[kind]}</h2>
              <ul className="mt-3 grid gap-2 md:grid-cols-2">
                {cat.moves.filter((m) => m.kind === kind).map((m) => <MoveRow key={m.id} m={m} onEdit={() => open(m.id)} onDelete={() => remove(m.name, () => set(deleteCustomMove(m.id)))} />)}
              </ul>
            </section>
          ))}
        </>)}
      </div>
    </div>
  )
}
