// Render every shot for a round: node scripts/stills.mjs 01 [baseUrl]
// Drives the real wizard, ticks a few items, then captures each screen and runs axe-core.
import { launch } from './shot.mjs'
import { mkdirSync, readFileSync } from 'node:fs'
import { createRequire } from 'node:module'

const round = process.argv[2] ?? '00'
const base = process.argv[3] ?? 'http://localhost:5173'
const out = `cook/stills/r${round}`
mkdirSync(out, { recursive: true })
const axe = readFileSync(createRequire(import.meta.url).resolve('axe-core/axe.min.js'), 'utf8')

const b = await launch()
const ctx = await b.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce', deviceScaleFactor: Number(process.env.SCALE ?? 1) })
const p = await ctx.newPage()
// Fake Supabase: the stills never touch the real project. Every *.supabase.co call is answered here.
const sbHost = new URL(readFileSync('.env', 'utf8').match(/VITE_SUPABASE_URL=(\S+)/)[1]).hostname
const sbKey = `sb-${sbHost.split('.')[0]}-auth-token`
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
const exp = Math.floor(Date.now() / 1000) + 86400
const user = { id: '00000000-0000-4000-8000-000000000001', aud: 'authenticated', role: 'authenticated', email: 'sam@example.test', user_metadata: { username: 'sam' }, app_metadata: {}, created_at: new Date().toISOString() }
const session = { access_token: `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64({ sub: user.id, exp, role: 'authenticated' })}.x`, refresh_token: 'fake', token_type: 'bearer', expires_in: 86400, expires_at: exp, user }
const db = { plans: [], logs: [] }
await ctx.route((u) => u.hostname === sbHost, async (route) => {
  const r = route.request(), u = new URL(r.url()), m = u.pathname.match(/\/rest\/v1\/(\w+)/)
  const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
  if (u.pathname.startsWith('/auth/v1/user')) return json(user)
  if (u.pathname.startsWith('/auth/v1/token')) return json(session)
  if (u.pathname.startsWith('/auth/v1/logout')) return route.fulfill({ status: 204 })
  if (!m || !db[m[1]]) return route.abort()
  const t = m[1], key = t === 'plans' ? (x) => x.account_id : (x) => x.account_id + x.day
  if (r.method() === 'GET') return json(db[t])
  if (r.method() === 'POST') { for (const row of [r.postDataJSON()].flat()) { db[t] = db[t].filter((x) => key(x) !== key(row)); db[t].push(row) } return route.fulfill({ status: 201, body: '' }) }
  if (r.method() === 'DELETE') { const days = (u.searchParams.get('day') ?? '').replace(/^in\.\(|\)$/g, '').split(','); db.logs = db.logs.filter((x) => !days.includes(x.day)); return route.fulfill({ status: 204 }) }
  return route.abort()
})
const errors = []
p.on('pageerror', (e) => errors.push(String(e)))
p.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()) })
const a11y = {}
async function shot(name, { full = false } = {}) {
  await p.mouse.move(1, 1)
  await p.waitForTimeout(400)
  await p.screenshot({ path: `${out}/${name}.png`, fullPage: full })
  if (full) return
  await p.addScriptTag({ content: axe })
  a11y[name] = await p.evaluate(async () =>
    (await window.axe.run(document, { runOnly: ['wcag2a', 'wcag2aa'] })).violations.map((v) => `${v.id} x${v.nodes.length}: ${v.nodes[0].target.join(' ')}`))
}

await p.goto(`${base}/#/`)
await p.evaluate(() => localStorage.clear())
await p.reload()
await shot('S01-landing')
await shot('S08-landing-full', { full: true })

await p.goto(`${base}/#/login`)
await shot('S09-login')
await p.goto(`${base}/#/register`)
await shot('S10-register')
await p.evaluate(([k, v]) => localStorage.setItem(k, v), [sbKey, JSON.stringify(session)])
await p.reload() // supabase-js reads the stored session on load

await p.goto(`${base}/#/plan`)
await p.fill('#f-name', 'Sam')
await shot('S03a-wizard-name')
await p.click('text=Next')
await p.click('text=Next')
await shot('S03-wizard-activity')
for (let i = 0; i < 4; i++) await p.click('text=Next')
await shot('S03b-wizard-result')
await p.click('text=Start my plan')
await p.waitForURL(/today/)

const ticks = p.locator('button[aria-label^="Tick "]')
await ticks.first().waitFor()
const n = await ticks.count()
// breakfast, snack, then the first two moves (meals come first in the list)
const mealCount = await p.locator('#menu-h').locator('xpath=../..').locator('li').count()
for (const i of [0, 1, mealCount, mealCount + 1]) if (i < n) await p.locator('button[aria-label^="Tick "], button[aria-label^="Untick "]').nth(i).click()
await p.click('button[aria-label="3 glasses of water"]')
await p.evaluate(() => window.scrollTo(0, 0))
await shot('S04-today')
await shot('S04-today-full', { full: true })

await p.goto(`${base}/#/week`)
await shot('S06-week')
await shot('S06-week-full', { full: true })

await p.goto(`${base}/#/today`)
await p.locator('a[href^="#/meal/"]').first().click()
await shot('S07-meal')

await p.setViewportSize({ width: 375, height: 812 })
await p.reload()
await shot('S07m-meal-mobile')
await p.goto(`${base}/#/`)
await shot('S02-landing-mobile')
await shot('S02-landing-mobile-full', { full: true })
const hscroll = { landing: await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth) }
await p.goto(`${base}/#/today`)
await shot('S05-today-mobile')
await shot('S05-today-mobile-full', { full: true })
hscroll.today = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
await p.goto(`${base}/#/week`)
hscroll.week = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
await p.goto(`${base}/#/plan`)
hscroll.plan = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)
await p.evaluate((k) => localStorage.removeItem(k), sbKey)
await p.goto(`${base}/#/login`)
await p.reload() // hash-only goto keeps the old page and its in-memory session
await shot('S09m-login-mobile')
hscroll.login = await p.evaluate(() => document.documentElement.scrollWidth > window.innerWidth)

await b.close()
console.log(JSON.stringify({ round, errors, hscrollMobile: hscroll, a11y }, null, 1))
