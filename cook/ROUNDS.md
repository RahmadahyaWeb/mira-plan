# Cook ledger: Mira Planner


Started: 2026-11-13 00:31 WITA
Time: hard cap: round 07 (user, 2026-11-13 08:29) | no floor
Bar: layout 9 | color 9 | type+components 9 | mascot 9 | motion 9 | detail 9 (out of 10); a11y >= 95 measured
Calibration offset: none yet
Usage: 5h window, about 20% per hour, never 100%
Gate: stills approved yes (round 07, 08:37) | final rendered (08:38), `cook/stills/rfinal/`
Best so far: round 07, `cook/stills/r07/`

## Decisions

Made without asking, one line each.
- 00:40 Fonts self-hosted via @fontsource, because a playful rounded display face is core to the look and the brief allows npm packages.
- 00:40 UI refs taken from Inspo archive (Buttondown, Slush) since user gave a style ("colorful and playful") not screens.
- 00:40 English UI (user picked defaults for language).
- 00:40 Mascot = user's unicorn.svg with its #FEFEFE background rect removed.
- 01:13 User set a hard cap of 1 round (round 06), then stop and wait. Floor dropped for this run.
- 08:29 User said "lanjut ronde 7 lalu stop": one more round, cap moved to round 07.
- 08:37 User said "oke finalkan": round 07 stills approved, ship now.

## User feedback inbox

Exact words. Close an item only when a still or clip proves it.
- 00:35 "semua yang anda sebutkan dan ada jadwal olahraga harian serta menu harian. dibuat seperti checker/tracker" | open
- 00:35 "colorful and playful style, dengan unicorn sebagai mascot" | open
- 01:13 "lanjut, tapi CUKUP 1 RONDE SAJA (ronde 6), lalu berhenti" + focus: halaman resep, ruang kosong di atas pita menu landing, gelembung bicara wizard | handled in round 06, waiting on user

---

## Round 01

Time: 00:31 to 00:45 WITA | total elapsed 0.25h
Usage: not readable
Focus: first build of every page + harness, because nothing existed.

Changes:
- Vite + React + Tailwind v4 app at project root. Pages: landing, wizard (6 steps + result), Today tracker (meals, workouts, water, ring, streak, energy+macros), week, meal detail.
- Data: 62 meals (src/data/meals.ts), 28 moves (src/data/exercises.ts). Logic in src/lib (Mifflin-St Jeor, plan generator with portion scale, swap, streak, local date keys).
- Mascot: unicorn.svg minus background rect, svgo 355K -> 138K, served from public/, cropped with #svgView fragments.
- Harness: scripts/shot.mjs + scripts/stills.mjs (drives wizard, ticks items, axe-core, h-scroll check). Fixed: harness counted ticks before render.

Stills: `cook/stills/r01/` | Side by side: `cook/compare/r01/`

Scores, eyeballed: critic median (2 critics: general-purpose default model + sonnet), out of 10

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 7 | 7 | 8 | 6.8 | 7.5 | 7.5 |
| S03 wizard | 6.8 | 6.8 | 7.8 | 6.3 | 6.8 | 6.8 |
| S04 today | 7.3 | 7.3 | 7.5 | 7 | 6.5 | 7.3 |
| S06 week | 6.3 | 7.8 | 6.3 | 6.3 | 4 | 7.3 |
| S07 meal | 6 | 7.3 | 7.5 | 5.8 | 6 | 6.5 |
| S02 landing mobile | 6.3 | 6.3 | 7.8 | 6 | 4.5 | 6.3 |
| S05 today mobile | 6.5 | 7.3 | 7.5 | 6.3 | 6.3 | 7 |
| S07 mascot fidelity | - | 9 | - | 9 | 8.8 | 8 |

Own score (logged, never decides): about 7.

Measured (command and result):
- vitest: 25/25 pass.
- axe-core wcag2a+aa on 9 screens: 0 violations.
- horizontal scroll at 375px: none on landing, today, week, plan.
- console errors during harness run: 0 (after fixing scrollTo Promise crash).

Top gaps from critics:
1. Mascot use in UI: one small pose, absent on week, hidden by tab bar on phone hero.
2. Landing hero: dead white band under CTAs, side art clipped at edges, flat white background.
3. Week: 7 narrow columns, tiny wrapped text (already rebuilt as rows during round, not yet scored).
4. Meal page: empty ingredients card (data fixed), hero art small, no action.
5. Today: "0 day streak" reads wrong on day one; nested borders busy; streak chip wraps on phone; arrows wrap.

Stop check: bar no | floor no | stills approved no | final no -> next round
Next focus: mascot presence on every page, hero fill, meal page action, streak copy.

## Round 02

Time: 00:45 to 00:53 WITA | total elapsed 0.4h
Usage: not readable
Focus: critic round-1 gaps: mascot presence, hero dead space, Today/phone polish.

Changes:
- Landing: hero art anchored to full-width section, pastel blobs, meal band at the bottom of the first screen, equal-width phone CTAs, tab bar hidden on landing.
- Wizard: icon tiles, check badge on selected option, "Step N of 6", mascot sits on the card corner.
- Today: rows tinted per meal slot, swap button visible, streak copy "Start a streak!", rest/complete badge on mascot, phone header arrows inline.
- Week: rebuilt as one row per day + lilac mascot banner. Meal page: mascot by plate, "Mark as eaten", "More ideas" row, muffin data fixed.

Scores, eyeballed: 2 critics (default + sonnet), spread > 1 on several rows, so round 3 uses 3 critics.

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 7.5 | 7.5 | 8.3 | 7 | 8 | 7.8 |
| S03 wizard | 6.5 | 6.3 | 6.8 | 6.5 | 7.5 | 6.5 |
| S04 today | 7 | 7.3 | 7 | 6.8 | 6.3 | 7.5 |
| S06 week | 6.3 | 7 | 6.8 | 6 | 5.3 | 6.3 |
| S07 meal | 6 | 7.5 | 7 | 5.8 | 4.8 | 6.8 |
| S02 landing mobile | 7.3 | 6.8 | 7.8 | 6.8 | 6.5 | 6.8 |
| S05 today mobile | 6.8 | 7.3 | 7.3 | 6.3 | 6.8 | 7.3 |

Measured: axe 0 violations on 9 screens; no h-scroll at 375px; 0 console errors; vitest 25/25.

Top gaps: system emoji used as main food/exercise art (generic); mascot small on week/meal; week rows box-heavy; phone Today menu below the fold.
Stop check: bar no | floor no | approved no | final no -> next round

## Round 03

Time: 00:53 to 01:00 WITA | total elapsed 0.5h
Usage: not readable
Focus: weakest per critics = system emoji as main art; mascot small on week/meal; phone Today order.

Changes:
- src/components/FoodArt.tsx: 18 flat food drawings (bowl, jar, glass, wrap, toast, stack, muffin, sandwich, taco, sushi, pizza, noodles, egg, apple, banana, berry, handful, plate) picked by meal name, ink outline like the mascot. Contact sheet: cook/stills/art-sheet.png (dev route /#/_art).
- src/components/MoveArt.tsx: 13 exercise drawings mapped by move id.
- Today: stats as icon rows, bigger water cups, phone order menu-first with progress strip. Week: lighter rows, bigger mascot banner, "Soon" for future days. Meal: tinted card headers. Landing: colored feature cards with mascot peek, outlined blobs, hero capped at 780px.
- vite base './' (dist served from any subfolder; still needs a server, file:// blocks module scripts: checked, renders blank).

Scores, eyeballed: 3 critics (default, sonnet, haiku), median

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 7 | 8 | 8 | 7 | 8 | 8 |
| S03 wizard | 7 | 7 | 7 | 7 | 8 | 7 |
| S04 today | 8 | 8 | 7 | 8 | 6 | 8 |
| S06 week | 7 | 8 | 7 | 8 | 7 | 8 |
| S07 meal | 7 | 8 | 7 | 6.5 | 7 | 7 |
| S02 landing mobile | 6 | 7 | 8 | 6 | 6.5 | 7 |
| S05 today mobile | 6 | 8 | 7 | 7 | 5 | 7 |

Measured: axe 0 violations; no h-scroll at 375px; 0 console errors; vitest 25/25; npm run build ok (JS 108.6 kB gzip).
Top gaps: mascot is an avatar on app screens; phone hero mascot below fold; phone meal names wrap 3 lines; wizard emoji icons; header CTA differs per page.
Stop check: bar no | floor no | approved no | final no -> next round

## Round 04

Time: 01:00 to 01:03 WITA | total elapsed 0.55h
Focus: mascot as avatar on app screens (3/3 critics), phone hero mascot below fold, phone meal names wrapping.
Changes: Today mascot card 176px breaking out of the card; phone progress strip with full mascot + cheer line; phone swap moved under the title; phone stats card; landing phone mascot above headline; week banner mascot 180px; meal mascot peeks from behind plate; done rows dimmed; nav shows streak chip on app pages; week workout chips + "+N more"; wizard tiles use drawn icons (new 'sofa' drawing).

Scores, eyeballed: 3 critics, median

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 7 | 8 | 8 | 6 | 8 | 8 |
| S03 wizard | 6 | 7 | 7 | 6 | 7 | 7 |
| S04 today | 7 | 7 | 7 | 7 | 7 | 7 |
| S06 week | 7 | 8 | 7 | 7 | 7 | 8 |
| S07 meal | 6 | 8 | 7 | 6 | 5 | 7 |
| S02 landing mobile | 7 | 7 | 8 | 6 | 8 | 7 |
| S05 today mobile | 7 | 8 | 7 | 7 | 7 | 8 |

Note: scores plateau around 7. Critics read downscaled 960px cells; several "8px text" claims are artifacts of downscaling (body text is 15 to 17px, measured in CSS).
Measured: axe 0 violations, no h-scroll, 0 console errors, vitest 25/25.
Top gaps: repeated bowl art, wizard on empty white canvas, grey secondary text, done rows look disabled.

## Round 05

Time: 01:03 to 01:06 WITA | total elapsed 0.6h
Focus: round-4 gaps.
Changes: ink-soft darkened to #4a4058; thicker macro bars, bold macro values; hero plates get a white rimmed plate; wizard pastel stage with outlined shapes, bigger step title and bar; bowl split into soup / salad / rice drawings; done rows keep dark text plus an ink "Done" stamp (white on pink failed axe contrast, fixed).
Scores: not measured this round (critics not run yet).
Measured: axe 0 violations on 9 screens, no h-scroll at 375px, 0 console errors, vitest 25/25, build ok.
Stop check: bar no (median about 7 vs 9) | floor no (0.6h of 8h) | approved no | final no -> waiting on user feedback on stills, then next round
Next focus: meal page hero composition, landing dead band above marquee, wizard bubble attached to card.

## Round 06 (capped: last round until user says more)

Time: 01:13 to 01:19 WITA | total elapsed 0.8h
Usage: not readable
Focus: user-named weak spots from round 05: recipe page hero, dead band above the landing menu band, wizard speech bubble.

Changes:
- Meal page (src/pages/MealPage.tsx): hero is now one tinted stage card per meal slot (butter/sky/lilac/pink at 45%) with ink border, pop shadow and outlined white shapes like the wizard stage. Plate 260px desktop, 170px phone (two copies, one hidden per breakpoint, because Plate sizes by prop). Mascot flipped to face the plate, leaning on its rim at lower right instead of hiding behind the top-left. Macro tiles 2x2 on phone (4 across from sm), fixes "62 g" wrapping.
- Landing (src/pages/Landing.tsx): headline 6.75rem on xl (was capped at 6rem), xl bottom padding 80px to 24px, side art moved down (mascot top 9%, cards top 17%). Gap from the sticker to the menu band went from about 120px to about 85px, now close to the top margin (about 75px), so the hero reads centered instead of leaving a dead band.
- Wizard (src/pages/Wizard.tsx): bubble pulled toward the mascot (tail at the snout), raised to mouth height, text-xl, max-w-lg so it stays on one line. First try (-ml-10) covered the mascot face; fixed in the same round.

Stills: `cook/stills/r06/` | Side by side: `cook/compare/r06/desktop.jpg`, `cook/compare/r06/mobile.jpg`

Scores, eyeballed: 2 critics (general-purpose default model + sonnet), mean of 2, out of 10

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 7.5 | 7.5 | 7.5 | 6 | 8 | 7.5 |
| S03 wizard | 7 | 7 | 6.5 | 6 | 7 | 7 |
| S04 today | 7 | 7 | 6.5 | 7 | 6 | 6 |
| S06 week | 6.5 | 6.5 | 6 | 6.5 | 5.5 | 5.5 |
| S07 meal | 6.5 | 7.5 | 7 | 6.5 | 6 | 6.5 |
| S02 landing mobile | 7 | 6.5 | 7.5 | 5 | 7 | 6.5 |
| S05 today mobile | 6 | 7 | 6 | 6.5 | 6 | 6.5 |
| S07m meal mobile | 6 | 7 | 7 | 5.5 | 6.5 | 6.5 |

Spread > 1.0 on 4 cells (S01 detail 7 vs 5, S07 type 8 vs 6, S07 mascot 7 vs 5, S05 mascot 7 vs 5). Rule says add a third critic; not run because of the 1-round cap.
S07m was scored on the 260px phone plate; both critics said the plate pushed the title below the fold. Fixed after scoring (170px phone plate, title now above the fold in `cook/stills/r06/S07-meal-mobile.png`). Not re-scored.
Versus round 04 (last scored round): S07 mascot 5 -> 6, S07 layout 6 -> 6.5, S03 layout 6 -> 7. Different critic runs, so treat as rough.

Own score (logged, never decides): about 7.

Measured (command and result):
- node scripts/stills.mjs 06: axe-core wcag2a+aa 0 violations on 9 screens; no horizontal scroll at 375px on landing, today, week, plan; 0 console errors.
- npm test: 25/25 pass. npm run build: ok (JS 109.8 kB gzip). oxlint: only old only-export-components warnings.

Top gaps from critics (both agree):
1. Week (S06) is weakest: spreadsheet-like rows, small mascot in a mostly empty banner, thin borders.
2. Phone bottom tab bar covers content on Today and meal pages; needs bottom padding equal to the bar plus a solid backing.
3. Tracker screens (S04, S05) read as a dashboard: mascot in a corner card, no stickers. Phone meal meta "Breakfast · 288 kcal" wraps.
4. Landing: unicorn disc looks pasted on; few doodles around the headline; phone hero has no backdrop blob.
5. Wizard: hard seam between white top and blue stage; question headline small next to the landing headline.

Stop check: bar no (median about 6.5 to 7 vs 9) | cap reached (1 round) | stills approved no | final no -> STOP, waiting for user. Round 07 not started.
Next focus if the user continues: week page rebuild (S06), then phone tab bar padding (S05, S07m).

## Round 07 (capped: user said "lanjut ronde 7 lalu stop")

Time: 08:29 to 08:31 WITA by the system clock (resumed after a break) | total elapsed: not tracked across the break
Focus: carried over from round 06: week page rebuild (S06), phone tab bar (S05, S07m), phone meal meta wrap.

Changes:
- Week (src/pages/Week.tsx): every day row now has a full ink border and a small pop shadow (it was ink/25). Today gets the big shadow, a pink ring with an offset, and a tilted "Today" sticker. The day column has an ink divider and a 4xl day name. Meal plates are 52px (were 40), slot labels are text-sm, meal names text-lg. The workout cell is tinted (pink, or lilac on rest days) and its chips are outlined white pills. The banner mascot is 220px and the banner now carries stickers: 7 days / N meals / N workout days.
- Phone tab bar (src/components/Nav.tsx): the pop shadow now has a second layer, a solid paper band 12px wide, so content scrolling under the bar no longer shows at its edges.
- Today (src/pages/Today.tsx): "Breakfast · 384 kcal" no longer wraps (whitespace-nowrap).

Stills: `cook/stills/r07/` | Side by side: `cook/compare/r07/desktop.jpg`, `cook/compare/r07/mobile.jpg` (r06 vs r07); critic images `cook/compare/r07/critic-desktop.jpg`, `cook/compare/r07/critic-mobile.jpg`

Scores, eyeballed: 2 critics (general-purpose default model + sonnet), mean of 2, out of 10, only for the changed shots

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S06 week | 6.5 | 7 | 6.5 | 5.5 | 6.5 | 5.5 |
| S04 today | 6.5 | 7 | 6.5 | 5.5 | 6.5 | 5 |
| S05 today mobile | 6.5 | 7 | 7 | 6 | 5.5 | 5 |

S06 against round 06: color 6.5 -> 7, type 6 -> 6.5, mascot 5.5 -> 6.5, detail 6.5 -> 5.5, layout and playful flat. These come from different critic runs, so treat them as rough. Other shots were not re-scored.
Own score (logged, never decides): about 7.

Measured (command and result):
- node scripts/stills.mjs 07: axe-core wcag2a+aa 0 violations on 9 screens; no horizontal scroll at 375px on landing, today, week, plan; 0 console errors.
- npm test: 25/25 pass. npm run build: ok (JS 110.1 kB gzip).

Top gaps from critics (both agree):
1. No loose art around the layout: the unicorn is the only illustration. The references scatter tilted stickers and doodles over the content edges.
2. Food icons are small thin line drawings (40 to 52px); they need bigger, filled, chunky food art.
3. Week grid: long meal names wrap ("Mango Coconut Chia / Pudding") and break the row alignment; the Today cell is cramped. Page headings ("Your week", "Today") are small next to the landing headline.

Stop check: bar no (median about 6 to 6.5 vs 9) | cap reached (round 07) | stills approved no | final no -> STOP, waiting for user.
Next focus if the user continues: loose stickers and doodles around app pages, bigger filled food art, no wrapping in week meal names.

## Ship (08:38 WITA)

The user approved the round 07 stills ("oke finalkan").
Final deliverable: the site runs locally (`npm run dev`, http://localhost:5173), plus a final set of screenshots at 2x scale in `cook/stills/rfinal/` (14 PNGs: desktop 2880x1800, phone 750x1624, plus full-page captures).
Command: SCALE=2 node scripts/stills.mjs final (scripts/stills.mjs now reads an optional SCALE env var).
Checked: all 14 files open with the expected sizes (sips); axe 0 violations on 9 screens; no horizontal scroll at 375px; 0 console errors; npm run build ok. Spot-checked S01-landing.png by eye.
Not in the final set: a phone screenshot of the meal page (stills.mjs never captured it; the round 06 one was a manual capture).
Final scores, eyeballed: about 6 to 7 out of 10 against a bar of 9. The bar was NOT met; the user chose to ship at the cap.
Open gaps for a later run: bigger filled food art, loose stickers and doodles on app pages, week meal names wrapping, small page headings.
Stop check: bar no | cap reached | approved yes | final rendered and checked -> SHIPPED. A new /cook run moves cook/ to cook-archive/<date>/.
