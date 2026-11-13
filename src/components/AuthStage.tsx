import type { ReactNode } from 'react'
import Mascot from './Mascot'
import FoodArt from './FoodArt'
import Ring from './Ring'
import { Bubble, DISH } from './Bits'
import { CheckCircle, Flame } from './Icons'

/** Pastel stage shared by Login and Register: mascot, speech bubble and preview stickers beside the form card. */
export default function AuthStage({ say, tint, children }: { say: string; tint: 'bg-pink/35' | 'bg-butter/45'; children: ReactNode }) {
  return (
    <div className="relative isolate min-h-[calc(100svh-5rem)] overflow-x-clip">
      <div className={`absolute inset-x-0 bottom-0 top-0 -z-10 border-t-[2.5px] border-ink md:top-10 ${tint}`} aria-hidden="true" />
      <div className="wrap grid max-w-5xl items-center gap-6 py-8 md:min-h-[calc(100svh-5rem)] md:grid-cols-[1fr_minmax(0,28rem)] md:gap-10 md:py-16">
        <div className="relative isolate flex items-center gap-4 md:hidden">
          <span className="absolute -left-3 top-1/2 -z-10 size-32 -translate-y-1/2 rounded-full border-[2.5px] border-ink bg-sky" aria-hidden="true" />
          <Mascot size={120} bob className="shrink-0" />
          <Bubble side="left">{say}</Bubble>
        </div>
        <div className="relative isolate hidden flex-col items-start gap-5 md:flex" aria-hidden="true">
          <Bubble side="bottom" className="ml-6 !text-xl">{say}</Bubble>
          {/* color disc anchors the mascot, same move as the landing hero */}
          <span className="absolute left-0 top-28 -z-10 size-[340px] rounded-full border-[2.5px] border-ink bg-sky lg:size-[360px]" />
          <Mascot size={360} bob />
          {/* preview stickers: what waits after login */}
          <span className="sticker absolute right-0 top-28 flex rotate-[6deg] items-center gap-2 bg-butter text-lg lg:-right-2"><Flame className="size-5 text-pink-deep" />5 day streak</span>
          <span className="card absolute right-4 top-48 flex rotate-[-5deg] items-center gap-2 p-2 pr-4 lg:-right-4">
            <Ring value={0.72} size={52} stroke={9}><span className="text-xs font-bold">72%</span></Ring>
            <span className="leading-tight"><span className="block font-display text-lg font-bold">1,240</span><span className="text-sm font-bold text-ink-soft">of 1,720 kcal</span></span>
          </span>
          <span className="card absolute -bottom-2 right-2 flex rotate-[-4deg] items-center gap-3 !rounded-2xl p-2.5 pr-4 lg:right-6">
            <span className="grid size-12 place-items-center rounded-full border-[2.5px] border-ink bg-pink p-1"><FoodArt meal={{ name: 'Rainbow Berry Oats' }} dish={DISH.breakfast} /></span>
            <span className="leading-tight"><span className="block font-display text-lg font-bold">Berry Oats</span><span className="text-base font-bold text-ink-soft">380 kcal</span></span>
            <CheckCircle className="size-7 text-pink-deep" />
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}
