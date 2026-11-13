# Brief: Mira Planner, run 2 (after login + cloud save)

Target: the same colorful, playful unicorn diet planner, now with Accounts. Visitors register and log in (username + password, Supabase auth); Profile, Plan and Log save to the cloud per Account. Daily calories, 7-day meal plan, daily exercise schedule, daily checker/tracker with progress and streaks.
Stack: Vite + React + Tailwind + Supabase (auth + tables plans, logs).
Pages: landing (unicorn hero), login, register, plan wizard, Today tracker, weekly plan, meal detail.
References: cook/refs/R01 (unicorn.jpeg, mascot look), R02 + R04 (Buttondown hero desktop + mobile: playful illustrations flanking big chunky headline, sticker tags), R03 (Slush: black-outlined pill buttons, characters flanking a huge headline), R05. Same quality, own style. Mascot art = user's unicorn.svg.
Bar (UI mapping): layout/spacing [9/10], color [9/10], typography+components [9/10], mascot fidelity vs R01 [9/10], interaction/motion [9/10], detail density [9/10]. Lighthouse/axe accessibility: 0 axe wcag2a+aa violations (measured).
Calibration offset: none yet. Run 1 ended at about 6 to 7 by critics; the user shipped it there.
Rules: no stock photos, meal art drawn in code. Self-hosted fonts via @fontsource. Default slop ban list. Purple only as the mascot's lilac, no purple gradients. Calorie math: Mifflin-St Jeor + activity factor, "not medical advice" line. Meal data: hand-written local JSON.
Harness rule: stills never sign in to the real Supabase project. scripts/stills.mjs stubs every *.supabase.co request inside Playwright with a fake session and an in-memory plans/logs table, so no credentials or data leave the machine.
Time: hard cap: round 01 (user: "stop setelah ronde 1 baru selesai"). Started: 2026-11-13 11:22 WITA.
Usage: 5h window, about 20% per hour, never 100%.
Hardware: local Mac. Screenshots with Playwright (playwright-core + headless shell).
Deliverable: site runs locally + screenshots of every page; user approves stills.
Language: English (UI). Notes to the user in Indonesian.
Permissions: download no (except npm packages), push no, publish no.
User's words: "saya menambahkan fitur yang mempengaruhi halaman ui dari ronde 7" / "oke run baru, tapi stop setelah ronde 1 baru selesai"
Carried over from run 1 (open gaps): bigger filled food art, loose stickers and doodles on app pages, week meal names wrapping, small page headings.
