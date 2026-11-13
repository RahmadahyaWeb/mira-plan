# Brief: Mira Planner, run 3 (after Library + Plan day editor)

Target: same colorful, playful unicorn diet planner. New since run 2: Library page (built-in + Custom Meals and Moves, add/edit/delete forms) and the Plan day editor dialog (pick any Meal, replace/add/remove Moves) opened from Today.
Focus this run: UI/UX polish and phone responsiveness on every page.
Stack: Vite + React + Tailwind + Supabase. Pages: landing, login, register, plan wizard, Today (+ day editor), Week, meal detail, Library.
References: cook/refs R01 (mascot), R02 + R04 (Buttondown hero desktop + mobile), R03 (Slush pills), R05. Same quality, own style.
Bar (UI): layout/spacing 9, color 9, typography+components 9, mascot 9, interaction 9, detail density 9 (out of 10, critic median). Measured: 0 axe wcag2a+aa violations, no horizontal scroll at 375px on every page, phone controls >= 44px, text links >= 24px (WCAG 2.2 AA target size).
Calibration offset: none. Run 2 ended about 7.5 by critics.
Rules: as run 2 (no stock photos, code-drawn art, @fontsource, slop ban list, purple only mascot lilac, not-medical-advice line).
Harness rule: stills never sign in to the real Supabase project; scripts/stills.mjs stubs every *.supabase.co request.
Time: hard cap: round 01 (user: "stop round 1 jika sudah selesai"). Started: 2026-11-13 14:21 WITA.
Usage: 5h window, about 20% per hour, never 100%.
Hardware: local Mac, Playwright headless shell.
Deliverable: site runs locally + stills of every page desktop and phone; user approves stills.
Language: English UI, notes to user in Indonesian.
Permissions: download no (except npm), push no, publish no, commit no unless asked.
User's words: "buat round baru. karena ada penambahan fitur dan halaman baru. mulai dari round satu dengan fokus perbaikan ui/ux, responsive mobile tiap halaman. stop round 1 jika sudah selesai"
