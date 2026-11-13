// Screenshot helper: node scripts/shot.mjs <url> <out.png> <w> <h> [fullPage]
import { chromium } from 'playwright-core'
import os from 'node:os'
const exe = `${os.homedir()}/Library/Caches/ms-playwright/chromium_headless_shell-1254/chrome-headless-shell-mac-arm64/chrome-headless-shell`
export async function launch() { return chromium.launch({ executablePath: exe }) }
if (process.argv[1].endsWith('shot.mjs')) {
  const [url, out, w = 1440, h = 900, full] = process.argv.slice(2)
  const b = await launch(); const p = await b.newPage({ viewport: { width: +w, height: +h } })
  await p.goto(url); await p.waitForTimeout(800)
  await p.screenshot({ path: out, fullPage: !!full }); await b.close()
}
