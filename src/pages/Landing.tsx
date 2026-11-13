import type { ReactNode } from 'react'
import MoveArt from '../components/MoveArt'
import { Link } from 'react-router-dom'
import Mascot from '../components/Mascot'
import FoodArt from '../components/FoodArt'
import Ring from '../components/Ring'
import { Plate, Swoosh, SLOT_COLOR, DISH, SLOT_LABEL, KIND_COLOR, fmt } from '../components/Bits'
import { Check, Flame } from '../components/Icons'
import { generatePlan } from '../lib/plan'
import { MEALS, MEAL_BY_ID } from '../data/meals'
import { MOVE_BY_ID } from '../data/exercises'
import { moveKcal, type Profile } from '../lib/calc'

const demo: Profile = { name: 'Sam', sex: 'female', age: 29, heightCm: 166, weightKg: 68, activity: 'light', goal: 'lose', diet: 'vegetarian', level: 0, workoutDays: 4 }
const sample = generatePlan(demo, '2026-01-05', 11)
const sampleDay = sample.days[0]
const BAND = MEALS.filter((_, i) => i % 4 === 1).slice(0, 14)

function Blob({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <path fill="currentColor" stroke="var(--color-ink)" strokeWidth="1.1" d="M45.6,-62.3C58.4,-53.3,67.6,-39.2,72.6,-23.5C77.6,-7.8,78.4,9.5,72.3,24C66.2,38.5,53.3,50.2,38.9,59.1C24.5,68,8.6,74.1,-8.1,75.6C-24.8,77.1,-42.3,74,-54.8,64C-67.3,54,-74.8,37.1,-77.4,19.9C-80,2.7,-77.7,-14.8,-69.6,-28.6C-61.5,-42.4,-47.6,-52.5,-33.5,-61.2C-19.4,-69.9,-5.1,-77.2,9.6,-78.5C24.3,-79.8,32.8,-71.3,45.6,-62.3Z" transform="translate(100 100)" />
    </svg>
  )
}

function MiniItem({ art, color, title, sub, done }: { art: ReactNode; color: string; title: string; sub: string; done: boolean }) {
  return (
    <li className="flex items-center gap-3">
      <Plate art={art} color={color} size={44} />
      <span className="min-w-0 flex-1 leading-tight">
        <span className={`block truncate font-bold ${done ? 'line-through decoration-2 opacity-60' : ''}`}>{title}</span>
        <span className="text-sm text-ink-soft">{sub}</span>
      </span>
      <span className={`grid size-7 shrink-0 place-items-center rounded-full border-[2.5px] border-ink ${done ? 'bg-pink-deep text-paper' : 'bg-paper'}`}>{done && <Check className="size-4" />}</span>
    </li>
  )
}

const features = [
  { color: 'bg-pink', emoji: '🥗', title: 'A meal plan that fits you', text: 'Seven days of breakfasts, lunches, snacks and dinners sized to your calorie number. Anything, vegetarian or vegan. Swap any meal with one tap.' },
  { color: 'bg-sky', emoji: '🏃‍♀️', title: 'Daily workouts, sorted', text: 'Warm-up, main moves and a cool-down every training day, plus gentle rest days. Beginner or active, 3 to 5 days a week.' },
  { color: 'bg-butter', emoji: '✅', title: 'Tick it off, keep the streak', text: 'Check off every meal and move, sip your water, and watch your ring fill. Finish the day and Mira does a happy hop.' },
]

const steps = [
  { emoji: '👋', color: 'bg-lilac', title: 'Tell Mira about you', text: 'Age, height, weight, how active you are and what you want.' },
  { emoji: '✨', color: 'bg-pink', title: 'Get your sparkle number', text: 'Your daily calories and macros, worked out with the Mifflin-St Jeor formula.' },
  { emoji: '🗓️', color: 'bg-sky', title: 'Follow your week', text: 'Meals and workouts for every day, ready to tick off and print.' },
]

export default function Landing() {
  return (
    <>
      {/* hero: stacked on phones, two columns on laptops, centered with flanking art on wide screens */}
      <section className="relative flex min-h-[min(calc(100svh-5rem),780px)] flex-col">
        {/* flat pastel blobs behind the side art */}
        <Blob className="pointer-events-none absolute left-[max(-6rem,calc(50%-50rem))] top-[8%] hidden w-[420px] text-butter xl:block" />
        <Blob className="pointer-events-none absolute right-[max(-5rem,calc(50%-49rem))] top-[4%] hidden w-[520px] rotate-[140deg] text-sky lg:block" />
        <div className="wrap relative grid flex-1 items-center gap-6 pb-12 pt-4 text-center lg:grid-cols-[1fr_auto] lg:pb-20 lg:text-left xl:pb-6 xl:static xl:flex xl:flex-col xl:justify-center xl:text-center">
          <div className="relative z-10 xl:mx-auto xl:max-w-[640px]">
            <h1 className="text-[clamp(3.3rem,8.5vw,6rem)] font-bold xl:text-[6.75rem] leading-[0.95]">
              Eat happy.<br />Move daily.<br />
              <span className="relative inline-block">
                Sparkle on.
                <Swoosh className="absolute -bottom-3 left-0 h-5 w-full sm:-bottom-4 sm:h-6" />
              </span>
            </h1>
            <p className="mx-auto mt-8 max-w-xl text-lg font-medium text-ink/80 sm:text-xl lg:mx-0 xl:mx-auto">
              Mira the unicorn builds your 7-day meal plan and daily workouts, then cheers you on while you tick them off.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start xl:justify-center">
              <Link to="/plan" className="btn btn-ink !min-h-14 !px-8 !text-xl max-sm:w-full">Make my free plan</Link>
              <a href="#sample" onClick={(e) => { e.preventDefault(); document.getElementById('sample')?.scrollIntoView({ behavior: 'smooth' }) }} className="btn !min-h-14 !px-7 !text-xl max-sm:w-full">See a sample day</a>
            </div>
            <p className="mt-7"><span className="sticker rotate-[-3deg] bg-sky text-base">No sign-up. Saved on your device.</span></p>
          </div>

          {/* mascot */}
          <div className="pointer-events-none relative mx-auto -mb-2 w-[200px] max-lg:order-first sm:w-[300px] lg:mb-0 lg:w-[380px] xl:absolute xl:right-[max(1rem,calc(50%-45rem))] xl:top-[9%] xl:w-[clamp(360px,28vw,430px)]">
            <Mascot fluid bob />
            <span className="sticker absolute bottom-[6%] left-[2%] rotate-[-4deg] bg-butter text-base max-lg:hidden sm:text-lg"><Flame className="mr-1 inline size-5 text-pink-deep" />6 day streak</span>
          </div>

          {/* left floating tracker cards, wide screens only */}
          <div className="pointer-events-none absolute left-[max(2rem,calc(50%-42rem))] top-[17%] hidden w-80 xl:block" aria-hidden="true">
            <div className="card -rotate-6 p-4 text-left">
              <p className="mb-3 font-display text-xl font-semibold">Today</p>
              <ul className="space-y-3">
                <MiniItem art={<FoodArt meal={{ name: 'Rainbow Berry Oats' }} dish={DISH.breakfast} />} color="bg-butter" title="Rainbow Berry Oats" sub="380 kcal" done />
                <MiniItem art={<MoveArt id="jog" />} color="bg-pink" title="Sparkle Cardio" sub="25 min" done />
                <MiniItem art={<FoodArt meal={{ name: 'Lentil Bolognese' }} dish={DISH.dinner} />} color="bg-sky" title="Lentil Bolognese" sub="540 kcal" done={false} />
              </ul>
            </div>
            <div className="card ml-20 mt-8 flex w-fit rotate-[5deg] items-center gap-3 p-3 pr-5">
              <Ring value={0.72} size={76} stroke={12}><span className="font-display text-base font-bold">72%</span></Ring>
              <div className="text-left leading-tight"><p className="font-display text-xl font-bold">1,240</p><p className="text-sm text-ink-soft">of 1,720 kcal</p></div>
            </div>
          </div>
        </div>

        {/* meal band: a taste of the menu, scrolls slowly, static with reduced motion */}
        <div className="relative z-10 overflow-hidden border-y-[2.5px] border-ink bg-pink py-3" aria-hidden="true">
          <div className="flex w-max animate-[band_60s_linear_infinite] gap-3">
            {[...BAND, ...BAND].map((m, i) => (
              <span key={i} className="flex items-center gap-2 rounded-full border-2 border-ink bg-paper py-1 pl-1 pr-4 font-display font-semibold">
                <span className="grid size-9 place-items-center rounded-full bg-butter p-1"><FoodArt meal={m} dish={DISH[m.slot]} /></span>{m.name}<span className="font-sans text-sm font-bold text-ink-soft">{m.kcal} kcal</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* features */}
      <section className="py-20 sm:py-28">
        <div className="wrap">
          <h2 className="mx-auto max-w-3xl text-balance text-center text-4xl font-bold leading-tight sm:text-5xl">Three things, one very happy unicorn</h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {features.map((f, i) => (
              <article key={f.title} className={`card relative p-7 ${f.color} ${i === 1 ? 'md:translate-y-10' : ''}`}>
                {i === 1 && <Mascot size={120} className="absolute -top-24 right-4 hidden md:block" />}
                <span className="grid size-20 place-items-center rounded-full border-[2.5px] border-ink bg-paper text-4xl shadow-pop-sm" aria-hidden="true">{f.emoji}</span>
                <h3 className="mt-5 text-2xl font-semibold leading-tight">{f.title}</h3>
                <p className="mt-3 text-ink/80">{f.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* sample day */}
      <section id="sample" className="scroll-mt-6 bg-sky/40 py-20 sm:py-28">
        <div className="wrap">
          <div className="flex flex-col items-center gap-4 text-center">
            <h2 className="text-4xl font-bold sm:text-5xl">A sample day with Mira</h2>
            <p className="max-w-xl text-lg text-ink-soft">For a 29-year-old vegetarian who wants to lose a little weight: {fmt(sample.target)} kcal a day, four workouts a week.</p>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-[1.25fr_1fr]">
            <div className="card p-6">
              <h3 className="text-2xl font-semibold">Menu</h3>
              <ul className="mt-4 divide-y-2 divide-dashed divide-ink/15">
                {sampleDay.meals.map((pm) => {
                  const m = MEAL_BY_ID[pm.id]
                  return (
                    <li key={pm.id} className="flex items-center gap-4 py-3">
                      <Plate art={<FoodArt meal={m} dish={DISH[m.slot]} />} color={SLOT_COLOR[m.slot]} size={52} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-ink-soft">{SLOT_LABEL[m.slot]}</p>
                        <Link to={`/meal/${m.id}`} className="font-display text-xl font-semibold hover:underline">{m.name}</Link>
                      </div>
                      <span className="chip">{fmt(m.kcal * sampleDay.scale)} kcal</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="text-2xl font-semibold">{sampleDay.workout.title}</h3>
              <ul className="mt-4 divide-y-2 divide-dashed divide-ink/15">
                {sampleDay.workout.moves.map((id, i) => {
                  const mv = MOVE_BY_ID[id]
                  return (
                    <li key={i} className="flex items-center gap-4 py-3">
                      <Plate art={<MoveArt id={mv.id} />} color={KIND_COLOR[mv.kind]} size={44} />
                      <div className="min-w-0 flex-1">
                        <p className="font-display text-lg font-semibold leading-tight">{mv.name}</p>
                        <p className="text-sm text-ink-soft">{mv.dose[0]} · about {moveKcal(mv.met, demo.weightKg, mv.minutes[0])} kcal</p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* how it works */}
      <section className="py-20 sm:py-28">
        <div className="wrap">
          <h2 className="text-center text-4xl font-bold sm:text-5xl">Ready in about a minute</h2>
          <ol className="mt-14 grid gap-10 md:grid-cols-3">
            {steps.map((s) => (
              <li key={s.title} className="flex flex-col items-center text-center">
                <span className={`grid size-24 place-items-center rounded-full border-[2.5px] border-ink text-5xl shadow-pop ${s.color}`} aria-hidden="true">{s.emoji}</span>
                <h3 className="mt-6 text-2xl font-semibold">{s.title}</h3>
                <p className="mt-2 max-w-xs text-ink-soft">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* cta band */}
      <section className="pb-20 sm:pb-28">
        <div className="wrap">
          <div className="card relative flex flex-col items-center gap-6 overflow-hidden bg-pink px-6 py-12 text-center md:flex-row md:px-14 md:text-left">
            <Mascot size={230} className="shrink-0" />
            <div className="flex-1">
              <h2 className="text-4xl font-bold leading-tight sm:text-5xl">Your first sparkly week starts today</h2>
              <p className="mt-3 text-lg">Free, no account, and you can remake it any time.</p>
            </div>
            <Link to="/plan" className="btn btn-ink !min-h-14 !px-8 !text-xl">Let&apos;s go</Link>
          </div>
        </div>
      </section>

      <footer className="border-t-[2.5px] border-ink py-10">
        <div className="wrap flex flex-col gap-3 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between">
          <p className="font-display text-lg font-semibold text-ink">Mira 🦄</p>
          <p className="max-w-xl">Mira gives general guidance, not medical advice. Talk to a doctor or dietitian before big changes to how you eat or exercise.</p>
        </div>
      </footer>
    </>
  )
}
