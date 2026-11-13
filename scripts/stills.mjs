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

await b.close()
console.log(JSON.stringify({ round, errors, hscrollMobile: hscroll, a11y }, null, 1))
