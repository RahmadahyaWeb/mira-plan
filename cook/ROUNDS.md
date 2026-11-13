# Rounds: Mira Planner run 3

## Decisions
- 14:21 Old run moved to `cook-archive/2026-11-13-run2/`. Brief carried over from run 2; no intake questions (user gave focus and cap).
- 14:24 Dev server: reused the running Vite on :5178 (same folder, preview slots full).
- 14:25 Harness fix: the Supabase stub replaced the whole `plans` row on upsert, so saving a Custom Meal wiped the Plan. It now merges columns like Postgres.
- 14:27 Tap-target bar: phone controls >= 44px, text links >= 24px (WCAG 2.2 AA). Meal names are text links; making them 44px tall would bloat every row.

## Round 01 (capped: user said stop after round 1)

Time: 14:21 to 14:29 WITA
Focus: UI/UX and phone fit on every page, new Library page and Plan day editor first.

Baseline r00 (measured, before fixes): 0 axe, 0 horizontal scroll, but phone tap targets under 44px on Today (Swap/Pick 24px tall, water 30px wide, Edit day 40px), day editor (all buttons 40px), Week (Edit day 40px), Library (Edit/Delete about 32px), meal ingredients 40px. Seen in stills: tab bar "My plan" wraps on every app page; day editor phone squeezes "Jumping Jacks" under Replace/Remove; Library phone pushes Edit off-screen ("Ed" clipped); wizard phone mascot half off the left edge; Week "Edit day" floats outside the card; Library desktop narrower than the nav (max-w-5xl) with a "Built-in" chip on every row.

Changes:
- `src/components/Nav.tsx`: phone tab bar stacks icon over label, nowrap. "My plan" fits on one line.
- `src/pages/Today.tsx`: phone Swap/Pick are 44px pills with labels; name link padded to 24px+; water glasses 4 per row on phone (were 30px wide); workout header: chip by the title, Edit day pushed right, 44px.
- `src/components/DayEditor.tsx`: Done/Replace/Remove 44px; on phone the Move row wraps buttons onto a second line under the name; "Change" is a visible pill.
- `src/pages/Week.tsx`: Edit day sits inside the card corner (bottom right of the workout panel), 44px.
- `src/pages/Library.tsx`: full `wrap` width (aligns with nav); header with counts line, bigger title and mascot on a sky disc (sm+); tabs and "+ Add" in one row (phone label "Add", aria-label "Add a Meal"); only Custom items get a tag, row tinted butter with ink border; Edit/Delete 44px, wrap under the name on phone; section headings get a color dot.
- `src/components/Bits.tsx`: new `MovePlate`: Custom Moves show their emoji on Today and in the day editor (they showed the default stairs drawing; Library already used the emoji).
- `src/pages/Wizard.tsx`: progress track inset on phone so the riding mascot stays on screen at step 1.
- `src/pages/MealPage.tsx`: ingredient rows 44px.
- `src/pages/Library.test.tsx`: Add button found by aria-label (its text is now "+ Add a Move").
- `scripts/stills.mjs`: new shots S03m, S06m, S10m, S11, S11m, S12, S12m, S13, S13m; tap-target check; upsert merge.

Stills: `cook/stills/r01/` | Side by side: `cook/compare/r01/new-pages.jpg`, `cook/compare/r01/mobile.jpg`, `cook/compare/r00-vs-r01.jpg` (r00 left, r01 right)

Measured (command and result):
- node scripts/stills.mjs 01 http://localhost:5178: 0 console errors; axe wcag2a+aa 0 violations on 22 screens; no horizontal scroll at 375px on landing, today, library, week, plan, login, register; tap targets: 0 under the bar on all phone screens.
- npm test: 82/82 pass. npm run build: ok. oxlint: only old warnings (only-export-components, Library autoFocus).

Scores, eyeballed: 2 fresh critics (sonnet + default model), mean of 2, out of 10. Both said the phone reference cells are thin strips, so phone shots were scored on their own merits.

| Shot | Layout | Color | Type | Mascot | Phone fit | Playful |
|---|---|---|---|---|---|---|
| S11 library | 7.5 | 7 | 7 | 6.5 | n/a | 6 |
| S13 day editor | 6.5 | 6 | 6 | 3.5 | n/a | 5 |
| S11m library phone | 7 | 7 | 6.5 | 3.5 | 6.5 | 5.5 |
| S13m day editor phone | 5.5 | 6 | 6 | 2 | 5 | 4 |
| S05 today phone | 6 | 7.5 | 6 | 6.5 | 5 | 6.5 |
| S06m week phone | 6.5 | 7.5 | 7 | 8.5 | 6 | 7.5 |
| S03m wizard phone | 6 | 6.5 | 6.5 | 5 | 6 | 5.5 |
| S12m add form phone | 5.5 | 5 | 5.5 | 1 | 6 | 3 |
| S10m register phone | 7 | 7.5 | 7 | 7 | 6.5 | 6.5 |

Median about 6. Own score (logged, never decides): about 7.

Checked and rejected:
- Both critics: Swap/Pick "about 24px". Measured 44px tall in r01 (tap check, 0 under the bar). The 24px was r00.
- Both critics: bottom tab bar covers cards (S05 Lunch, S03m Male). That is the 812px fold; the page has bottom padding. Not a bug.

Top gaps (both critics agreed):
1. Day editor (S13/S13m): no mascot, dull grey scrim, "Change" pill weaker than Replace/Remove, phone rows two lines tall. Fix: one button style, icon buttons or one-line rows on phone, bottom sheet on phone, mascot peeking over the header, tinted scrim.
2. Library add form (S12m) and Library phone (S11m): plain white form, no mascot (sky-disc mascot is hidden below sm). Fix: tinted form card, mascot with a bubble above the form, mascot on phone header.
3. Today phone (S05): small meta text and dense rows; wizard step 1 progress bar looks empty.

Stop check: bar no (median about 6 vs 9) | cap reached (round 01) | stills approved no | final no -> STOP, waiting for user.
Next focus if the user continues: day editor mascot + phone sheet, Library form and phone mascot, Today phone density.
