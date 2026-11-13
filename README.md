# Mira · unicorn diet planner

A colorful, playful diet planner with Mira the unicorn as mascot.

- **Plan wizard**: six quick questions, then your daily calories and macros (Mifflin-St Jeor + activity factor).
- **7-day plan**: breakfast, lunch, snack(s) and dinner sized to your number. Anything, vegetarian or vegan. Swap any meal.
- **Daily workouts**: warm-up, main moves and cool-down on 3 to 5 days a week, gentle rest days in between.
- **Tracker**: tick off meals and moves, log water, watch the ring fill and keep your streak. Week view prints.

Everything stays in your browser (localStorage). No account, no server.

## Run it

```bash
npm install
npm run dev
```

Open http://localhost:5173. Tests: `npm test`. Production build: `npm run build`, then `npm run preview`.

## Notes

- Mascot art: `public/unicorn.svg` (your unicorn, background removed and optimized with svgo).
- Food and exercise drawings are made in code (`src/components/FoodArt.tsx`, `MoveArt.tsx`).
- Meals: `src/data/meals.ts` (62). Moves: `src/data/exercises.ts` (28).
- General guidance only, not medical advice.
