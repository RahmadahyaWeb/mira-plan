// dev-only contact sheet of every meal drawing
import FoodArt, { artFor } from '../components/FoodArt'
import { MEALS } from '../data/meals'

export default function ArtSheet() {
  return (
    <div className="grid grid-cols-8 gap-3 p-4">
      {MEALS.map((m) => (
        <div key={m.id} className="rounded-xl border p-2 text-center text-xs">
          <div className="mx-auto size-24 rounded-full bg-butter/40 p-2"><FoodArt meal={m} /></div>
          <p className="font-bold">{m.name}</p><p className="text-ink-soft">{artFor(m).kind}</p>
        </div>
      ))}
    </div>
  )
}
