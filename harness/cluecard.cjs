// ── cluecard.cjs ─────────────────────────────────────────────────────────
// What happens when a lead is finished, and what a lead looks like when you
// arrive. shotall.cjs never finishes a lead, so it can't see any of this.
//
//   1-brief-arrive   A13 on arrival: the brief is open (phones included)
//   2-brief-touched  after the first touch on the puzzle: folded on phones
//   3-card           A3 finished with 4+ notes held: the full card, with the
//                    opt-in "short banner" choice
//   4-after          after "Add to my notes": the drawer marks it new
//   5-banner         the same finish with quiet notes on: the banner
//
//   node harness/cluecard.cjs     -> $SHOT_DIR/cluecard/{desktop,mobile}-*.png
const { chromium } = require('playwright')
const fs = require('fs'); const path = require('path')
const S = require('./lib-state.cjs')
const OUT = path.join(process.env.SHOT_DIR || '/tmp/shots', 'cluecard')
const URL = 'http://localhost:5173/osint-game-v2/'
const VPS = { desktop: { width: 1440, height: 950 }, mobile: { width: 390, height: 664, isMobile: true, hasTouch: true } }
const SEEN = { phase: 'investigation', tutorialSeen: true, seenBoardTutorial: true, boardTutorialSeen: true }

async function finishA3(p, quiet) {
  const st = S.atLead('A3', { ...SEEN, clues: ['corey_flickr', 'insider', 'flickr_gps', 'shield'] })
  await p.evaluate(([s, q]) => {
    localStorage.setItem('maya-game-v3-storage', JSON.stringify({ state: s, version: 0 }))
    localStorage.setItem('maya-accessibility', JSON.stringify({ state: { quietClues: q }, version: 0 }))
  }, [st, quiet])
  await p.reload(); await p.waitForTimeout(1200)
  for (const a of ['twitter', 'wayback']) {
    const inp = p.locator('input[type=text], input:not([type])').first()
    await inp.fill(a); await inp.press('Enter'); await p.waitForTimeout(1600)
  }
  const cont = p.getByRole('button', { name: /continue/i })
  if (await cont.count()) await cont.first().click()
  await p.waitForTimeout(1500)
}

;(async () => {
  fs.mkdirSync(OUT, { recursive: true })
  const b = await chromium.launch({ channel: 'chrome' })
  for (const [vp, o] of Object.entries(VPS)) {
    const p = await (await b.newContext({ viewport: { width: o.width, height: o.height }, isMobile: !!o.isMobile, hasTouch: !!o.hasTouch })).newPage()
    const snap = (n) => p.screenshot({ path: path.join(OUT, `${vp}-${n}.png`) })
    await p.goto(URL)

    await p.evaluate(s => localStorage.setItem('maya-game-v3-storage', JSON.stringify({ state: s, version: 0 })), S.atLead('A13', SEEN))
    await p.reload(); await p.waitForTimeout(1200)
    await snap('1-brief-arrive')
    const box = await p.locator('.lo-panel').boundingBox()
    await p.mouse.click(box.x + box.width / 2, box.y + box.height - 40)
    await p.waitForTimeout(500)
    await snap('2-brief-touched')

    await finishA3(p, false)
    await snap('3-card')
    const take = p.locator('.cc-take')
    if (await take.count()) { await take.click(); await p.waitForTimeout(900) }
    await snap('4-after')

    await finishA3(p, true)
    await snap('5-banner')
  }
  await b.close()
})()
