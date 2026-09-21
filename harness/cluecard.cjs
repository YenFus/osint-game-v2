// ── cluecard.cjs ─────────────────────────────────────────────────────────
// Finishes lead A3 by typing both answers, then screenshots the clue card
// that should appear in front of the board, and the drawer after taking it.
//   node harness/cluecard.cjs     -> $SHOT_DIR/cluecard/{desktop,mobile}-*.png
const { chromium } = require('playwright')
const fs = require('fs'); const path = require('path')
const S = require('./lib-state.cjs')
const OUT = path.join(process.env.SHOT_DIR || '/tmp/shots', 'cluecard')
const URL = 'http://localhost:5173/osint-game-v2/'
const VPS = { desktop: { width: 1440, height: 950 }, mobile: { width: 390, height: 664, isMobile: true, hasTouch: true } }
;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const b = await chromium.launch({ channel: 'chrome' })
  for (const [vp, o] of Object.entries(VPS)) {
    const p = await (await b.newContext({ viewport: { width: o.width, height: o.height }, isMobile: !!o.isMobile, hasTouch: !!o.hasTouch })).newPage()
    await p.goto(URL)
    const st = S.atLead('A3', { phase: 'investigation', tutorialSeen: true, boardTutorialSeen: true })
    await p.evaluate(s => localStorage.setItem('maya-game-v3-storage', JSON.stringify({ state: s, version: 0 })), st)
    await p.reload(); await p.waitForTimeout(1200)
    for (const a of ['twitter', 'wayback']) {
      const inp = p.locator('input[type=text], input:not([type])').first()
      await inp.fill(a); await inp.press('Enter'); await p.waitForTimeout(1600)
    }
    const cont = p.getByRole('button', { name: /continue/i })
    if (await cont.count()) await cont.first().click()
    await p.waitForTimeout(1500)
    await p.screenshot({ path: path.join(OUT, `${vp}-1-card.png`) })
    const take = p.locator('.cc-take')
    if (await take.count()) { await take.click(); await p.waitForTimeout(900) }
    await p.screenshot({ path: path.join(OUT, `${vp}-2-after.png`) })
  }
  await b.close()
})()
