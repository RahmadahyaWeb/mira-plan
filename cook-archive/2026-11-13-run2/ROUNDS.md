# Cook ledger: Mira Planner, run 2

Run 1 (rounds 01 to 07, shipped) is in `cook-archive/2026-11-13/`.

Started: 2026-11-13 11:22 WITA
Time: floor none | cap round 04 (user: "Lanjut ronde 4"; was round 03)
Bar: layout 9 | color 9 | type 9 | detail 9 | mascot 9 | playful 9 (out of 10); axe 0 violations
Calibration offset: none yet
Usage: 5h window, about 20% per hour, never 100%
Gate: stills approved no | final render not started
Best so far: round 04, `cook/stills/r04/`, uncommitted

## Decisions

- 11:22 Skipped re-intake: target, refs and bar carry over from run 1; only the brief changed (Accounts + Supabase), because the user said "oke run baru" and the old brief answers the rest.
- 11:22 Stills never sign in to the real Supabase project. scripts/stills.mjs stubs every *.supabase.co request in Playwright (fake session in localStorage, in-memory plans/logs), because the real project is remote and its credentials must not be used by the harness.
- 11:23 Added shots S09 login, S10 register, S09m login mobile, S07m meal mobile (S07m was missing from run 1's final set).
- 11:24 Round 01 focus = login/register, because they are new pages with no design pass (a bare card on white).
- 12:36 User said only "Lanjut ronde 4" with no stop word. Read it as one more capped round (stop after round 04), because every earlier continue was one round and then stop.

## User feedback inbox

- 11:20 "saya menambahkan fitur yang mempengaruhi halaman ui dari ronde 7" | round 01 | done: all pages re-rendered from the current code, login/register added to the shot list
- 11:21 "oke run baru, tapi stop setelah ronde 1 baru selesai" | round 01 | done: stopped after round 01
- 11:27 "lanjut ronde 2 dan stop" | round 02 | done: stopped after round 02
- 11:31 "lanjut ronde 3, stop setelah ronde 3" | round 03 | done: stopped after round 03
- 12:36 "Lanjut ronde 4" | round 04 | done: stopped after round 04 (see Decisions)
- 12:47 "Stop di sini" | after round 04 | done: run paused at round 04, nothing committed

---

## Round 01

Time: 11:22 to 11:30 WITA | total elapsed 0.1h
Usage: not readable
Focus: S09/S10 login and register, because they are new since run 1 and were the weakest (a bare card on a white page).

Changes:
- New `src/components/AuthStage.tsx`: a pastel stage band (pink on login, butter on register) with outlined sky circle and lilac blob, the mascot at 300px with a speech bubble on desktop, and a 110px mascot beside the bubble on phone.
- `src/pages/Login.tsx`, `src/pages/Register.tsx`: wrapped in AuthStage, card fills its column, h1 text-5xl from sm.
- `scripts/stills.mjs`: Supabase stub, login/register/meal-mobile shots, reloads after the session changes.
- App pages (S01 to S07) unchanged in this round. Versus run-1 round 07 they differ only in the nav (username + Log out) and in date-based meal picks (`cook/compare/r01/r07-vs-r01.jpg`).

Stills: `cook/stills/r01/` | Side by side: `cook/compare/r01/desktop.jpg`, `cook/compare/r01/mobile.jpg`, `cook/compare/r01/r07-vs-r01.jpg`

Scores, eyeballed: 2 fresh critics (general-purpose default model + sonnet), mean of 2, out of 10

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 6.5 | 7 | 7 | 6 | 8 | 7 |
| S03 wizard | 6 | 7 | 6 | 5 | 6.5 | 7 |
| S04 today | 7 | 7.5 | 6 | 7.5 | 6 | 6.5 |
| S06 week | 6.5 | 7 | 5.5 | 7 | 6 | 6 |
| S07 meal | 5.5 | 7 | 6.5 | 5.5 | 5 | 6 |
| S09 login | 4.5 | 6.5 | 6 | 3.5 | 5.5 | 5.5 |
| S10 register | 4 | 6.5 | 6 | 3.5 | 5.5 | 5.5 |
| S02 landing mobile | 5.5 | 6 | 7 | 3.5 | 7 | 5.5 |
| S05 today mobile | 6 | 7 | 6 | 6.5 | 5.5 | 6 |
| S07m meal mobile | 5 | 7 | 6.5 | 4.5 | 5 | 6 |
| S09m login mobile | 6 | 6.5 | 6.5 | 4 | 5.5 | 5.5 |

Critics scored login/register AFTER the AuthStage change (the bare card was never scored).
Spread of 2 on 6 cells (S01 detail, S06 detail, S03 color, S03 playful, S07 mascot, S07m mascot); a third critic was not run because of the cap.
One critic said the reference halves are hard to compare: R03 (Slush) is reused for 4 rows, and the phone refs shrink to a thin strip in a 960x540 cell. Both scored against the general "strong reference = 9" bar.
Own score (logged, never decides): about 6.5.

Measured (command and result):
- node scripts/stills.mjs 01 http://localhost:5175: axe-core wcag2a+aa 0 violations on 13 screens; no horizontal scroll at 375px on landing, today, week, plan, login; 0 console errors.
- npm test: 58/58 pass. npm run build: ok (JS 169.2 kB gzip, up from 110.1 kB in run 1, from @supabase/supabase-js). oxlint: only only-export-components warnings.

Not checked this round:
- Real Supabase sign-in flow (stubbed on purpose). Register's username_available check is aborted by the stub, so its "taken" message is not shown in stills.

Top gaps from critics:
1. S09/S10: band does not fill the fold; white strip below (and above on register). Make the stage fill the viewport height, center the card, add 2 to 3 floating preview stickers (streak chip, meal card) near the mascot.
2. S05/S07m phone nav: "Start a / streak" and "Log / out" wrap onto two lines (confirmed in `cook/stills/r01/S05-today-mobile.png`). This regression came from the new Log out button. Fix: streak pill becomes icon + count, Log out becomes an icon or menu below sm.
3. S04/S06 meta text (slot labels, macros, times) is small and soft on pastel; S07 mascot small at the plate rim; S02 phone landing is a bare stack.

Progress note sent: 11:30
Stop check: bar no (median about 6 vs 9) | cap reached (round 01) | stills approved no | final no -> STOP, waiting for user.
Next focus if the user continues: phone nav wrap (regression), auth stage fills the fold + stickers, meta text size/contrast.

## Round 02 (capped: user said "lanjut ronde 2 dan stop")

Time: 11:27 to 11:29 WITA | total elapsed 0.2h
Usage: not readable
Focus: the three round-01 gaps: phone nav wrap (regression), auth stage does not fill the fold, small meta text.

Changes:
- `src/components/Nav.tsx`: below sm the streak pill shows flame + count only (the full text stays in aria-label and from sm up); Log out and the streak pill get whitespace-nowrap and tighter padding. Proof: `cook/stills/r02/S05-today-mobile.png`, one line.
- `src/components/AuthStage.tsx`: the stage fills the viewport height on md+ (min-h 100svh minus nav), the band runs to the bottom, the card is centered. The mascot is 320px, with two tilted preview stickers: a "5 day streak" chip and a ticked "Berry Oats 380 kcal" meal card (drawn FoodArt).
- `src/pages/Today.tsx`, `src/pages/Week.tsx`: meta lines (slot · kcal, minutes and macros, move kind and dose, how-to, week slot labels) go from text-sm (14px) to text-base (16px).

Stills: `cook/stills/r02/` | Side by side: `cook/compare/r02/desktop.jpg`, `cook/compare/r02/mobile.jpg`, `cook/compare/r02/r01-vs-r02.jpg` (r01 left, r02 right)

Scores, eyeballed: 2 fresh critics (general-purpose default model + sonnet), mean of 2, out of 10

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 7 | 7.5 | 7.5 | 6.5 | 8 | 7.5 |
| S03 wizard | 5.5 | 6.5 | 6.5 | 4.5 | 6 | 6.5 |
| S04 today | 7 | 7 | 6.5 | 7 | 6 | 6.5 |
| S06 week | 6.5 | 7 | 6 | 7 | 5.5 | 6 |
| S07 meal | 6 | 7 | 7 | 5.5 | 5 | 6.5 |
| S09 login | 5.5 | 6.5 | 6.5 | 4 | 6 | 6 |
| S10 register | 5.5 | 6.5 | 6.5 | 4 | 6 | 6 |
| S02 landing mobile | 6 | 4.5 | 7.5 | 4 | 7 | 5 |
| S05 today mobile | 5.5 | 6.5 | 6.5 | 6 | 5.5 | 5.5 |
| S07m meal mobile | 6 | 7 | 6.5 | 4.5 | 5 | 5.5 |
| S09m login mobile | 5.5 | 6 | 6.5 | 4 | 6 | 5 |

Versus round 01 (different critic runs, rough): S09 layout 4.5 -> 5.5, S10 layout 4 -> 5.5, S09/S10 detail 3.5 -> 4, S09/S10 mascot 5.5 -> 6. S05 layout 6 -> 5.5 (critic A flagged the menu card edge, see gap 1). Wizard and landing were not changed; their moves are critic noise.
Spread of 2 to 3 on many cells: critic A gave 8 on S01/S04/S06 where critic B gave 5 to 6. A third critic was not run because of the cap.
Both critics again said the reference column is hard to use (R03 reused, phone refs squashed to a strip). The compare layout for phone refs needs a crop of R04's top (R04-top.png exists) next run.
Own score (logged, never decides): about 6.5.

Measured (command and result):
- node scripts/stills.mjs 02 http://localhost:5175: axe-core wcag2a+aa 0 violations on 13 screens; no horizontal scroll at 375px on landing, today, week, plan, login; 0 console errors.
- npm test: 58/58 pass. npm run build: ok (JS 169.4 kB gzip). oxlint: only old warnings (only-export-components, Mascot set-state-in-effect).

Checked and rejected:
- Critic A: phone landing shows "Log out" to a visitor. Not a bug: the harness is logged in at that point (S02 is captured after the session is seeded).

Top gaps from critics:
1. S05/S07m phone: the Daily menu card and the meal hero card run past the right edge (the right border is missing in `cook/stills/r02/S05-today-mobile.png`; same in r01, so it predates this run). Keep the cards inside the 16px gutter.
2. S03 wizard (now weakest by critic B): a small card in a big pastel field, generic blobs, small mascot. Bigger card, bigger mascot reacting, themed props instead of blobs.
3. S07/S07m meal hero: small food art on a flat slab, mascot half hidden; S02 phone landing is a bare stack (no preview card, no color behind the mascot).

Progress note sent: 11:29
Stop check: bar no (median about 6 vs 9) | cap reached (round 02) | stills approved no | final no -> STOP, waiting for user.
Next focus if the user continues: phone card overflow (S05/S07m), wizard stage, meal hero food art; fix the phone reference crop in the compare sheet.

## Round 03 (capped: user said "lanjut ronde 3, stop setelah ronde 3")

Time: 11:31 to 11:36 WITA | total elapsed 0.2h
Usage: not readable
Focus: the three round-02 gaps: phone card overflow (S05), wizard stage (S03), meal hero food art (S07/S07m).

Changes:
- `src/pages/Today.tsx`: the main grid gets `grid-cols-1`. Cause: the phone grid had one implicit `auto` column, so the nowrap meta line ("Breakfast · 320 kcal" + Done badge) pushed the Daily menu card past the right edge. Proof: `cook/stills/r03/S05-today-mobile.png`, right border back inside the gutter.
- `src/pages/Wizard.tsx`: the generic butter circle and pink squircle are gone. In their place (xl only, side gutters) sit a tilted breakfast plate (drawn FoodArt), a "Daily streaks" sticker, a "7-day menu" sticker and a tilted dumbbell plate (MoveArt). Mascot 220 -> 260px. First try used the jump-rope art; it read as a smiley face, so it was swapped for the dumbbell.
- `src/components/Bits.tsx`: hero Plate (size >= 160) draws the food at 70% of the disc (was 60%), rim ring 72% (was 66%). Fills the plate on meal pages.
- `src/pages/MealPage.tsx`: hero plate 260 -> 300px desktop, 170 -> 190px phone; mascot 170 -> 180px, phone scale 0.7 -> 0.75.

Stills: `cook/stills/r03/` | Side by side: `cook/compare/r03/desktop.jpg`, `cook/compare/r03/mobile.jpg` (phone refs now use `R04-top.png`), `cook/compare/r03/r02-vs-r03.jpg` (r02 left, r03 right)

Scores, eyeballed: 2 fresh critics (general-purpose default model + sonnet), mean of 2, out of 10

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 8 | 7.5 | 8.5 | 8 | 8.5 | 8 |
| S03 wizard | 6.8 | 8 | 7.5 | 6.8 | 7.5 | 7.8 |
| S04 today | 7.5 | 8 | 7.5 | 8.3 | 7 | 7.3 |
| S06 week | 7.5 | 8 | 7.5 | 7.5 | 7.3 | 7.3 |
| S07 meal | 7 | 8 | 8.3 | 6.8 | 6 | 7 |
| S09 login | 6 | 7 | 7.5 | 5 | 6.3 | 6.8 |
| S02 landing mobile | 6.5 | 6 | 7.8 | 4.8 | 7.5 | 5.8 |
| S05 today mobile | 7.3 | 7.5 | 7.5 | 7.5 | 6.5 | 7.3 |
| S07m meal mobile | 7 | 7.5 | 7.8 | 6.3 | 5.8 | 6.5 |
| S09m login mobile | 5.8 | 6.5 | 7.5 | 5 | 5.3 | 6 |

S10 register was not on the compare sheet this round (same AuthStage as S09, unchanged).
Versus round 02 (different critic runs, rough, scores ran higher across the board including unchanged shots, so part of the rise is critic noise): S03 detail 4.5 -> 6.8, S03 layout 5.5 -> 6.8, S05 layout 5.5 -> 7.3, S07 detail 5.5 -> 6.8. Unchanged S01 rose about 1, which sets the noise floor.
Critics agreed within 1 point on most cells; spread 2 on S02 color and S02 playful.
Own score (logged, never decides): about 7.

Measured (command and result):
- node scripts/stills.mjs 03 http://localhost:5176: axe-core wcag2a+aa 0 violations on 13 screens; 0 console errors.
- npm test: 58/58 pass. npm run build: ok (JS 169.5 kB gzip). oxlint: only old only-export-components warnings.

Checked and rejected:
- Both critics: phone bottom tab bar covers the list (S05). The bar is fixed and the page has bottom padding; it covers only what is still scrolled below it. Not a bug.
- Critic B: streak chip shows 0. Correct for the harness (fresh plan, no full day yet).

Top gaps from critics (both agreed):
1. S09/S09m login now weakest: small mascot in a big empty pink field, leftover generic circle and squircle (same blobs the wizard lost), phone mascot sits on the white/pink seam. Fix: bigger mascot on a color blob, 2 to 3 more stickers, drop the blobs, phone mascot fully inside the band.
2. S02 phone landing is a bare stack: none of the desktop hero stickers (Today card, kcal ring, streak tag, meal ticker) reach the phone.
3. S07/S07m meal: mascot still small and tucked at the plate rim; phone title takes 3 lines and pushes macros and "Mark as eaten" below the fold.

Progress note sent: 11:36
Stop check: bar no (median about 7.3 vs 9) | cap reached (round 03) | stills approved no | final no -> STOP, waiting for user.
Next focus if the user continues: login stage (S09/S09m), phone landing hero stickers (S02), meal hero mascot and phone fold (S07m).

## Round 04 (capped: user said "Lanjut ronde 4", read as one round)

Time: 12:36 to 12:45 WITA | total elapsed 0.4h
Usage: not readable
Focus: the three round-03 gaps: login stage (S09/S09m), phone landing hero (S02), meal mascot and phone fold (S07/S07m).

Changes:
- `src/components/AuthStage.tsx`: the corner circle and squircle are gone. A sky disc (340 to 360px) sits behind a bigger mascot (320 -> 360px). New third sticker: a kcal ring card (72%, 1,240 of 1,720). Phone: the band starts right under the nav (no white/pink seam), the stage fills the viewport height, and the mascot (110 -> 120px) sits on a sky disc inside the band.
- `src/pages/Landing.tsx`: phone and tablet get a sky blob behind the mascot, the "6 day streak" sticker (was hidden below lg) and a small kcal ring card. Desktop unchanged.
- `src/pages/MealPage.tsx`: mascot 180 -> 220px with a tilted "Yum!" sticker. Phone: plate back to 170px, title text-5xl -> text-4xl, macros in one row of 4. Proof: `cook/stills/r04/S07m-meal-mobile.png` shows title, all 4 macros and "Eaten today" above the tab bar.

Stills: `cook/stills/r04/` | Side by side: `cook/compare/r04/desktop.jpg` (now with S10), `cook/compare/r04/mobile.jpg`, `cook/compare/r04/r03-vs-r04.jpg` (r03 left, r04 right)

Scores, eyeballed: 2 fresh critics (general-purpose default model + sonnet), mean of 2, out of 10

| Shot | Layout | Color | Type | Detail | Mascot | Playful |
|---|---|---|---|---|---|---|
| S01 landing | 7.5 | 7.5 | 7.8 | 6.8 | 8.3 | 7.5 |
| S03 wizard | 6.8 | 7.8 | 7.5 | 6.3 | 7.5 | 7.8 |
| S04 today | 7.3 | 7.8 | 6.5 | 7.8 | 6 | 7 |
| S06 week | 7.3 | 7.5 | 6.8 | 7.5 | 5.8 | 6.8 |
| S07 meal | 6.8 | 8 | 7.5 | 6.3 | 7.3 | 7.8 |
| S09 login | 7.8 | 8 | 7.5 | 6.5 | 8 | 7.8 |
| S10 register | 7.5 | 7.8 | 7.5 | 6 | 7.5 | 6.8 |
| S02 landing mobile | 7.3 | 7.3 | 8.3 | 5.8 | 8 | 7.3 |
| S05 today mobile | 7.5 | 7.8 | 7.3 | 7.5 | 6.3 | 7 |
| S07m meal mobile | 8 | 8 | 7.5 | 7 | 7.5 | 7.8 |
| S09m login mobile | 7 | 7.8 | 7.5 | 5.5 | 6.3 | 6.8 |

Versus round 03 (different critic runs, rough): S09 layout 6 -> 7.8, S09 mascot 6.3 -> 8, S09 detail 5 -> 6.5; S02 layout 6.5 -> 7.3, S02 color 6 -> 7.3, S02 playful 5.8 -> 7.3; S07m layout 7 -> 8, S07m mascot 5.8 -> 7.5; S07 mascot 6 -> 7.3. Unchanged S01 fell about 0.5 and S04/S06 type fell about 1 (sonnet critic harsher this run), so that is the noise band.
Spread of 2 on S10 detail and S06 mascot/type/playful (sonnet lower).
Own score (logged, never decides): about 7.3.

Measured (command and result):
- node scripts/stills.mjs 04 http://localhost:5176: axe-core wcag2a+aa 0 violations on 13 screens; no horizontal scroll at 375px on landing, today, week, plan, login; 0 console errors.
- npm test: 58/58 pass. npm run build: ok. oxlint: only old warnings (only-export-components, Mascot set-state-in-effect).

Checked and rejected:
- Critic B: S04/S07 cards "clipped" at the bottom. That is the 900px viewport fold, not a clip.
- Critic A: S01 Today card cut by the viewport edge. Not seen in `cook/stills/r04/S01-landing.png` at full size; it is the 960px cell crop. Not changed.

Top gaps from critics:
1. S04/S06/S05 mascot is a small sticker in a banner or panel (mascot 5.8 to 6.3, now the lowest dimension). Make it bigger, let it break the card edge, hold the ring.
2. S09 vs S10 use the same stickers ("5 day streak" on a register page). Give register its own props; S09m mascot still small with empty pink below the card.
3. S03 wizard: tall white strip above the stage; stickers small and few. Run the stage up behind the progress bar, bigger and more props. S07 desktop: empty right side of the hero and leftover white blob shapes.

Progress note sent: 12:45
Stop check: bar no (median about 7.5 vs 9) | cap reached (round 04) | stills approved no | final no -> STOP, waiting for user.
Next focus if the user continues: mascot scale on S04/S05/S06, register props, wizard stage top, meal hero blobs.
