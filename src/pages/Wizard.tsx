import { useState, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import Mascot from '../components/Mascot'
import MoveArt from '../components/MoveArt'
import FoodArt from '../components/FoodArt'
import { Bubble, fmt } from '../components/Bits'
import { ArrowLeft, ArrowRight, Check } from '../components/Icons'
import { kcalTarget, macroTargets, tdee, type Profile } from '../lib/calc'
import { generatePlan } from '../lib/plan'
import { dateKey } from '../lib/date'
import { useStore } from '../store'
import { startPlan } from '../lib/planDay'

const blank: Profile = { name: '', sex: 'female', age: 30, heightCm: 165, weightKg: 65, activity: 'light', goal: 'lose', diet: 'anything', level: 0, workoutDays: 3 }

interface Opt<T> { value: T; emoji?: string; art?: ReactNode; label: string; hint?: string }

function Choices<T extends string | number>({ name, value, options, onChange, cols = 2 }: { name: string; value: T; options: Opt<T>[]; onChange: (v: T) => void; cols?: number }) {
  return (
    <div role="radiogroup" aria-label={name} className={`grid gap-3 ${cols === 3 ? 'sm:grid-cols-3' : cols === 4 ? 'grid-cols-2' : 'sm:grid-cols-2'}`}>
      {options.map((o, i) => {
        const on = o.value === value
        const tile = ['bg-pink', 'bg-sky', 'bg-lilac', 'bg-butter'][i % 4]
        return (
          <button key={String(o.value)} type="button" role="radio" aria-checked={on} onClick={() => onChange(o.value)}
            className={`relative flex items-center gap-4 rounded-2xl border-[2.5px] border-ink p-4 text-left transition-[transform,box-shadow,background-color] duration-150 ${on ? 'bg-butter shadow-pop -translate-x-0.5 -translate-y-0.5' : 'bg-paper hover:bg-sky/20'}`}>
            <span className={`grid size-14 shrink-0 place-items-center rounded-xl border-[2.5px] border-ink text-3xl ${tile} ${o.art ? 'p-1.5' : ''}`} aria-hidden="true">{o.art ?? o.emoji}</span>
            {on && <span className="absolute -right-2.5 -top-2.5 grid size-8 animate-pop place-items-center rounded-full border-[2.5px] border-ink bg-pink-deep text-paper" aria-hidden="true"><Check className="size-4" /></span>}
            <span className="leading-tight">
              <span className="block font-display text-xl font-semibold">{o.label}</span>
              {o.hint && <span className="text-[15px] text-ink-soft">{o.hint}</span>}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function NumberField({ label, unit, value, min, max, onChange }: { label: string; unit: string; value: number; min: number; max: number; onChange: (n: number) => void }) {
  const id = `f-${label}`
  const clamp = (n: number) => Math.min(max, Math.max(min, n))
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-display text-lg font-semibold">{label}</label>
      <div className="flex items-stretch overflow-hidden rounded-2xl border-[2.5px] border-ink bg-paper focus-within:shadow-pop">
        <button type="button" aria-label={`Less ${label}`} onClick={() => onChange(clamp(value - 1))} className="w-12 border-r-[2.5px] border-ink bg-lilac font-display text-2xl font-bold">−</button>
        <input id={id} type="number" inputMode="numeric" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))} onBlur={() => onChange(clamp(value || min))}
          className="w-full min-w-0 bg-transparent px-3 py-3 text-center font-display text-2xl font-semibold outline-none" />
        <span className="grid place-items-center pr-3 font-bold text-ink-soft">{unit}</span>
        <button type="button" aria-label={`More ${label}`} onClick={() => onChange(clamp(value + 1))} className="w-12 border-l-[2.5px] border-ink bg-lilac font-display text-2xl font-bold">+</button>
      </div>
    </div>
  )
}

export default function Wizard() {
  const { state, set } = useStore()
  const nav = useNavigate()
  const [p, setP] = useState<Profile>(state.profile ?? blank)
  const [step, setStep] = useState(0)
  const up = <K extends keyof Profile>(k: K) => (v: Profile[K]) => setP((x) => ({ ...x, [k]: v }))

  const steps: { say: ReactNode; title: string; body: ReactNode; valid?: boolean }[] = [
    {
      title: 'Nice to meet you!',
      say: <>Hi, I&apos;m Mira! I&apos;ll build your meals and workouts. What should I call you?</>,
      body: (
        <div className="space-y-6">
          <div>
            <label htmlFor="f-name" className="mb-1.5 block font-display text-lg font-semibold">Your name <span className="font-sans text-base font-medium text-ink-soft">(optional)</span></label>
            <input id="f-name" value={p.name} maxLength={24} onChange={(e) => up('name')(e.target.value)} placeholder="Sam"
              className="w-full rounded-2xl border-[2.5px] border-ink px-4 py-3 font-display text-2xl font-semibold outline-none focus:shadow-pop" />
          </div>
          <div>
            <p className="mb-1.5 font-display text-lg font-semibold">Body type for the calorie formula</p>
            <Choices name="Sex" value={p.sex} onChange={up('sex')} options={[{ value: 'female', emoji: '🌸', label: 'Female' }, { value: 'male', emoji: '🌊', label: 'Male' }]} />
          </div>
        </div>
      ),
    },
    {
      title: 'A few numbers',
      say: <>These help me work out your daily energy. Rough is fine!</>,
      valid: p.age >= 15 && p.age <= 90 && p.heightCm >= 120 && p.heightCm <= 230 && p.weightKg >= 35 && p.weightKg <= 250,
      body: (
        <div className="grid gap-5 sm:grid-cols-3">
          <NumberField label="Age" unit="yrs" value={p.age} min={15} max={90} onChange={up('age')} />
          <NumberField label="Height" unit="cm" value={p.heightCm} min={120} max={230} onChange={up('heightCm')} />
          <NumberField label="Weight" unit="kg" value={p.weightKg} min={35} max={250} onChange={up('weightKg')} />
        </div>
      ),
    },
    {
      title: 'How active are you?',
      say: <>Think about a normal week, not your best one.</>,
      body: <Choices name="Activity" value={p.activity} onChange={up('activity')} options={[
        { value: 'sedentary', art: <MoveArt id="sofa" />, label: 'Mostly sitting', hint: 'Desk job, little exercise' },
        { value: 'light', art: <MoveArt id="brisk-walk" />, label: 'Lightly active', hint: 'Walks, 1 to 3 workouts a week' },
        { value: 'moderate', art: <MoveArt id="cycling" />, label: 'Active', hint: '3 to 5 workouts a week' },
        { value: 'very', art: <MoveArt id="jog" />, label: 'Very active', hint: 'Hard training or a physical job' },
      ]} />,
    },
    {
      title: 'What is your goal?',
      say: <>Every goal is a good goal. Let&apos;s pick yours.</>,
      body: <Choices name="Goal" cols={3} value={p.goal} onChange={up('goal')} options={[
        { value: 'lose', art: <FoodArt meal={{ name: 'Rainbow Buddha Bowl' }} dish="#a9e0f7" />, label: 'Lose weight', hint: 'Gentle 500 kcal deficit' },
        { value: 'maintain', art: <MoveArt id="yoga" />, label: 'Stay balanced', hint: 'Eat what you burn' },
        { value: 'gain', art: <MoveArt id="rows" />, label: 'Build up', hint: 'Small 300 kcal surplus' },
      ]} />,
    },
    {
      title: 'How do you eat?',
      say: <>I have yummy meals for every style.</>,
      body: <Choices name="Diet" cols={3} value={p.diet} onChange={up('diet')} options={[
        { value: 'anything', art: <FoodArt meal={{ name: 'Lemon Herb Chicken & Rice' }} />, label: 'Anything', hint: 'Meat, fish, veggies' },
        { value: 'vegetarian', art: <FoodArt meal={{ name: 'Margherita Flatbread' }} />, label: 'Vegetarian', hint: 'No meat or fish' },
        { value: 'vegan', art: <FoodArt meal={{ name: 'Green Glow Smoothie' }} />, label: 'Vegan', hint: 'Plants only' },
      ]} />,
    },
    {
      title: 'Your workouts',
      say: <>Pick what feels doable. You can always change it.</>,
      body: (
        <div className="space-y-6">
          <Choices name="Level" value={p.level} onChange={up('level')} options={[
            { value: 0, art: <MoveArt id="march" />, label: 'Beginner', hint: 'Shorter sets, easy pace' },
            { value: 1, art: <MoveArt id="jump-rope" />, label: 'Active', hint: 'More reps, longer cardio' },
          ]} />
          <div>
            <p className="mb-1.5 font-display text-lg font-semibold">Workout days per week</p>
            <Choices name="Days per week" cols={3} value={p.workoutDays} onChange={up('workoutDays')} options={[
              { value: 3, emoji: '🌤️', label: '3 days' }, { value: 4, emoji: '☀️', label: '4 days' }, { value: 5, emoji: '🔥', label: '5 days' },
            ]} />
          </div>
        </div>
      ),
    },
  ]

  const last = step === steps.length
  const kcal = kcalTarget(p)
  const macros = macroTargets(p, kcal)

  const finish = () => {
    const today = dateKey()
    const plan = generatePlan(p, today)
    set(startPlan(p, plan, today))
    nav('/today')
  }

  const pct = (Math.min(step, steps.length) / steps.length) * 100

  return (
    <div className="relative isolate">
    {/* pastel stage */}
    <div className="absolute inset-x-0 top-40 -z-10 h-[calc(100%-8rem)] border-y-[2.5px] border-ink bg-sky/35" aria-hidden="true">
      <svg viewBox="0 0 200 200" className="absolute -left-24 top-10 hidden w-96 text-butter lg:block"><circle cx="100" cy="100" r="90" fill="currentColor" stroke="var(--color-ink)" strokeWidth="1.2" /></svg>
      <svg viewBox="0 0 200 200" className="absolute -right-20 bottom-10 hidden w-80 text-pink lg:block"><rect x="20" y="20" width="160" height="160" rx="50" fill="currentColor" stroke="var(--color-ink)" strokeWidth="1.2" transform="rotate(14 100 100)" /></svg>
    </div>
    <div className="wrap max-w-4xl pb-16 pt-4">
      {/* progress track with mascot riding along */}
      <div className="relative mx-auto mb-10 mt-6 h-5 max-w-2xl rounded-full border-[2.5px] border-ink bg-paper" role="progressbar" aria-label="Plan setup progress" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100}>
        <div className="h-full rounded-full bg-pink-deep transition-[width] duration-500" style={{ width: `${pct}%` }} />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 transition-[left] duration-500" style={{ left: `${pct}%` }}>
          <span className="grid size-12 place-items-center overflow-hidden rounded-full border-[2.5px] border-ink bg-sky shadow-pop-sm"><Mascot size={44} view="head" hopKey={step} /></span>
        </div>
      </div>

      <p className="-mt-4 mb-6 text-center font-display text-lg font-semibold">{last ? 'All done!' : `Step ${step + 1} of ${steps.length}`}</p>
      <div className="relative z-10 grid items-end gap-4 md:-mb-16 md:grid-cols-[200px_1fr] md:pl-2">
        <div className="hidden md:block"><Mascot size={220} hopKey={step} /></div>
        <Bubble side="left" className="hidden md:-ml-3 md:mb-28 md:block md:max-w-lg md:self-end md:!text-xl">{last ? <>Ta-da! Here&apos;s your sparkle number{p.name ? `, ${p.name}` : ''}.</> : steps[step].say}</Bubble>
        <Bubble side="bottom" className="md:hidden">{last ? <>Ta-da! Here&apos;s your sparkle number{p.name ? `, ${p.name}` : ''}.</> : steps[step].say}</Bubble>
      </div>

      <section className="card mt-8 p-6 sm:p-9 md:mt-0 md:pt-20" aria-live="polite">
        {!last ? (
          <>
            <h1 className="mb-6 text-4xl font-bold sm:text-5xl">{steps[step].title}</h1>
            {steps[step].body}
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold sm:text-4xl">Your plan is ready</h1>
            <div className="mt-6 grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
              <div className="grid size-48 place-items-center rounded-full border-[2.5px] border-ink bg-butter text-center shadow-pop">
                <div><p className="font-display text-5xl font-bold">{fmt(kcal)}</p><p className="font-bold">kcal a day</p></div>
              </div>
              <div className="space-y-3">
                {([['Protein', macros.protein, 'bg-pink'], ['Carbs', macros.carbs, 'bg-sky'], ['Fat', macros.fat, 'bg-lilac']] as const).map(([n, g, c]) => (
                  <div key={n} className="flex items-center gap-3">
                    <span className="w-20 font-display text-lg font-semibold">{n}</span>
                    <span className="h-5 flex-1 overflow-hidden rounded-full border-[2.5px] border-ink"><span className={`block h-full ${c}`} style={{ width: `${Math.min(100, (g * (n === 'Fat' ? 9 : 4) / kcal) * 200)}%` }} /></span>
                    <span className="w-16 text-right font-bold">{g} g</span>
                  </div>
                ))}
                <p className="pt-1 text-ink-soft">You burn about {fmt(tdee(p))} kcal a day. Plus {p.workoutDays} workouts a week at {p.level ? 'active' : 'beginner'} level.</p>
              </div>
            </div>
            <p className="mt-6 rounded-2xl bg-lilac/40 p-4 text-sm">This is general guidance, not medical advice. If you are pregnant, have a health condition or take medicine, check with a doctor first.</p>
          </>
        )}

        <div className="mt-9 flex items-center justify-between gap-3">
          <button type="button" onClick={() => (step === 0 ? nav(-1) : setStep(step - 1))} className="btn"><ArrowLeft />Back</button>
          {!last ? (
            <button type="button" disabled={steps[step].valid === false} onClick={() => setStep(step + 1)} className="btn btn-ink disabled:opacity-40">Next<ArrowRight /></button>
          ) : (
            <button type="button" onClick={finish} className="btn btn-ink !px-8">{state.plan ? 'Make my new plan' : 'Start my plan'} ✨</button>
          )}
        </div>
      </section>
    </div>
    </div>
  )
}
