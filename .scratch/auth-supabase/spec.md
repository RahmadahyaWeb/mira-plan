# Spec: Login and Register (Accounts backed by Supabase)

Status: ready-for-agent

## Problem Statement

Mira Planner has no concept of a person. Anyone who opens the app lands in a single shared browser store. A Plan, Profile and Log live only on one device, are lost when the browser is cleared, and are visible to whoever uses that browser. A person cannot keep their Plan across devices, and two people sharing a browser see each other's data.

## Solution

Visitors create an Account with a Username, an Email and a password, then sign in with their Username and password. Every planning feature requires being signed in. Each Account's Profile, Plan and Log are stored in the cloud, private to that Account, and follow it across devices. The landing page stays public so new people can see the product first.

## User Stories

1. As a Visitor, I want to see the landing page without signing in, so that I can judge the product before committing.
2. As a Visitor, I want the main "Make my plan" button to take me to registration, so that I know how to start.
3. As a Visitor, I want to register with a Username, Email and password, so that I get my own Account.
4. As a Visitor, I want to be told when my Username is already taken before I submit, so that I can pick another quickly.
5. As a Visitor, I want "Mira" and "mira" treated as the same Username, so that nobody can impersonate another Account by changing capitals.
6. As a Visitor, I want clear rules for a valid Username (3 to 20 characters, letters, digits and underscore), so that I know what to type.
7. As a Visitor, I want my Username normalised to lowercase, so that I never worry about capitals when signing in.
8. As a Visitor, I want a clear error when my Email is invalid, so that I can fix it.
9. As a Visitor, I want a clear error when my password is shorter than 8 characters, so that I can fix it.
10. As a Visitor, I want to show and hide my password while typing, so that I avoid typos.
11. As a Visitor, I want to be signed in immediately after registering, so that I can start my Plan without a confirmation step.
12. As an Account holder, I want to sign in with my Username and password, so that I do not have to remember my Email.
13. As an Account holder, I want a vague "wrong username or password" error on failure, so that strangers cannot learn which Usernames exist.
14. As an Account holder, I want to stay signed in after closing and reopening the browser, so that I do not log in every visit.
15. As an Account holder, I want to sign out from the header, so that I can protect my Account on a shared device.
16. As an Account holder, I want my Username shown in the header, so that I know which Account I am using.
17. As a Visitor, I want opening a protected page to send me to login, so that I understand why I cannot see it.
18. As a Visitor, I want to land on the page I originally wanted after signing in, so that login does not lose my place.
19. As an Account holder who is signed in, I want visiting login or register to send me on to the app, so that I do not see pointless forms.
20. As an Account holder, I want my Profile and Plan saved to my Account, so that they survive clearing the browser.
21. As an Account holder, I want to open Mira on another device and see the same Plan, so that I can follow it anywhere.
22. As an Account holder, I want my Log (ticked items and water) to sync across devices, so that my streak is the same everywhere.
23. As an Account holder, I want making a new Plan to still clear Log entries from today onward, so that behaviour matches today's app.
24. As an Account holder, I want my data to be invisible to every other Account, so that my body details stay private.
25. As an Account holder, I want a visible warning if saving fails, so that I do not lose progress silently.
26. As an Account holder, I want a loading state while my data loads, so that I never see "No plan yet" by mistake.
27. As a Visitor on a phone, I want login and register to be usable at narrow widths, so that I can sign up from my phone.
28. As a keyboard or screen-reader user, I want labelled fields and announced errors, so that the forms are accessible.
29. As the owner, I want an inactive "Forgot password?" spot on login, so that the layout is ready for the later feature.
30. As the owner, I want no password reset or email confirmation yet, so that scope stays small (tracked in the backlog).

## Implementation Decisions

- Backend is Supabase (Auth plus Postgres). The project is new and empty. The owner runs the SQL themselves in the SQL Editor; the agent does not execute it. The owner must also turn off "Confirm email".
- Sign-in identity: Supabase Auth is email-based. The Username is stored with the Account; sign-in first resolves a Username to its Email through a database function, then authenticates with that Email and the password.
- The Username-to-Email function is callable by Visitors, returns an Email for exactly one given Username and nothing else, and never lists Accounts. Unknown Username and wrong password produce the same message.
- Username rules: 3 to 20 characters, lowercase letters, digits and underscore; stored lowercase; unique case-insensitively at the database level. The Username travels with the sign-up request so the Account and its Username are created together, atomically.
- A "username available" check, callable by Visitors, backs the instant taken-or-free feedback. The database uniqueness rule remains the real guard against races.
- Registration collects Username, Email and password only. Password minimum 8 characters, no composition rules, no confirmation field, with a show/hide toggle.
- An auth module exposes the current Account (id and Username), a loading flag, and sign-in, sign-up and sign-out actions. It restores the session on load.
- Route access: only landing, login and register are public. All planning routes redirect Visitors to login and remember the intended destination. Signed-in Accounts visiting login or register are redirected into the app. Guards also wait for data to finish loading.
- Landing and other entry buttons that start planning point to register when signed out. Landing copy that promises "no sign-up, saved on your device" is replaced.
- Header: signed out shows Log in and Sign up. Signed in shows Username and Log out; on phones the Username may be hidden but Log out stays. Mobile bottom tab bar and desktop section links only show when signed in.
- Data model: one row per Account holding Profile and Plan (as documents), and one row per Account per day for the Log (done ids and water, keyed by date string). All tables have Row Level Security allowing an Account to read and write only its own rows. No insert path exists for another Account's rows.
- The existing store interface (`state`, `set(updater)`) is kept so pages change little. `set` updates in-memory state immediately, then persists only what changed: the Profile/Plan row if either changed, and per-day Log rows that were added, changed or removed.
- Persistence failures set a visible error state shown as a small banner; data is not silently dropped.
- Old browser storage under the previous key is deleted on first load and never imported.
- Environment: the Supabase URL and anon key come from a local env file that is git-ignored; an example env file documents the variable names.
- UI is English, uses the existing Mira styling, mascot and button classes, and meets the app's accessibility bar.

## Testing Decisions

- A good test checks external behaviour of pure logic only, with no mocking of internals.
- One test seam: pure functions. (a) Username validation: accepted and rejected inputs, lowercase normalisation, length bounds. (b) The Log diff used by persistence: given previous and next Log, which days to upsert and which to delete (including the "new Plan clears today onward" case).
- Prior art: the existing vitest suite for pure library code, which runs without a DOM.
- Not unit-tested: Supabase calls, Row Level Security and the Username lookup function. These are verified manually with the owner's SQL Editor and a two-Account walkthrough (Account B cannot see Account A's data).
- Final gates: build, lint and tests pass.

## Out of Scope

- Password reset and "Forgot password" behaviour (placeholder link only).
- Email confirmation.
- Social sign-in such as Google.
- Importing old browser data.
- Changing Username or Email after registration, deleting an Account.
- Offline support or conflict resolution between two devices editing at once (last write wins).

## Further Notes

- Terms follow `GLOSSARY.md`: Account, Username, Email, Visitor, Plan, Profile, Log.
- Deferred work is recorded in `docs/backlog.md`.
- The Username-to-Email lookup deliberately reveals an Email to anyone who knows a Username. This was accepted to allow Username sign-in; revisit if that becomes a privacy concern.
