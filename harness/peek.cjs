// ── peek.cjs ─────────────────────────────────────────────────────────────
// Screenshot a few leads at work, seeded as a player would reach them.
// The quick look after a visual change; shotall.cjs is the full sweep.
//
//   SHOT_DIR=/tmp/peek node harness/peek.cjs desktop A2 A6 C6
//   SHOT_DIR=/tmp/peek node harness/peek.cjs mobile A7
//   ... board | reveal | call | ending   (non-lead screens)
//   BRIEF=1 stays on each lead's briefing instead of pressing Start
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const S = require('./lib-state.cjs')

const OUT = process.env.SHOT_DIR || '/tmp/peek'
const URL = 'http://localhost:5173/osint-game-v2/'
const VPS = {
  desktop: { width: 1440, height: 950, isMobile: false, hasTouch: false },
  mobile: { width: 390, height: 664, isMobile: true, hasTouch: true },
}
const [vpName = 'desktop', ...ids] = process.argv.slice(2)
const seed = (p, st) => p.evaluate(s => localStorage.setItem('maya-game-v3-storage', JSON.stringify({ state: s, version: 0 })), st)

;(async () => {
  const b = await chromium.launch({ channel: 'chrome' })
  const ctx = await b.newContext({ viewport: { width: VPS[vpName].width, height: VPS[vpName].height }, isMobile: VPS[vpName].isMobile, hasTouch: VPS[vpName].hasTouch, deviceScaleFactor: 1 })
  const p = await ctx.newPage()
  const errs = []
  p.on('pageerror', e => errs.push(String(e)))
  await p.goto(URL); await p.waitForTimeout(600)
  fs.mkdirSync(OUT, { recursive: true })
  for (const id of ids) {
    let st
    if (id === 'board') st = S.base({ clues: S.ALL_CLUES.slice(0, 6) })
    else if (id === 'fresh') st = S.base({ clues: [], paths: { A: { started: true, completed: false, unlockedNodes: ['A1'], completedNodes: [] }, B: { started: true, completed: false, unlockedNodes: ['B1'], completedNodes: [] }, C: { started: true, completed: false, unlockedNodes: ['C1'], completedNodes: [] } } })
    else if (id === 'reveal') st = S.atLead('C5', { namePending: true, nameRevealSeen: false, clues: [...S.priorOf('C5').map(g => g[1]), 'registry'] })
    else if (id === 'call' || id === 'ending') st = S.base({ phase: 'ending', endingChoice: 'police', clues: S.ALL_CLUES, clock: 300, finalCase: { suspect: 'ray', slots: { who: 'registry', there: 'flickr_gps', before: 'court' } } })
    else st = S.atLead(id)
    await seed(p, st); await p.reload(); await p.waitForTimeout(1100)
    const start = await p.$('button.lob-start')
    if (start && id !== 'reveal' && !process.env.BRIEF) { await start.click({ timeout: 4000 }).catch(() => {}); await p.waitForTimeout(700) }
    if (id === 'reveal') await p.waitForTimeout(9500)
    if (id === 'call') await p.waitForTimeout(9000)
    const file = path.join(OUT, `${vpName}-${id}.png`)
    await p.screenshot({ path: file })
    console.log(file)
  }
  if (errs.length) console.log('PAGE ERRORS:', errs)
  await b.close()
})()
