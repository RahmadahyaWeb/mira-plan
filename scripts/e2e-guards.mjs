// Visitor-side route checks in a real browser. Usage: npm run dev, then node scripts/e2e-guards.mjs [baseUrl]
import assert from 'node:assert/strict'
import { launch } from './shot.mjs'

const base = process.argv[2] ?? 'http://localhost:5173/'
const b = await launch()
const p = await b.newPage()
const hash = () => new URL(p.url()).hash
for (const r of ['plan', 'today', 'week', 'meal/x']) {
  await p.goto(`${base}#/${r}`)
  await p.waitForFunction(() => location.hash === '#/login')
  assert.equal(hash(), '#/login', `/${r} should redirect to login`)
}
await p.goto(base)
await p.getByRole('link', { name: 'Make my free plan' }).click()
await p.waitForFunction(() => location.hash === '#/register')
await p.goto(base)
assert.equal(await p.getByText('Saved on your device').count(), 0)
assert.equal(await p.getByRole('navigation', { name: 'Main' }).count(), 0)
await b.close()
console.log('guards e2e ok')
