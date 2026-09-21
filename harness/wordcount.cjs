// ── wordcount.cjs ────────────────────────────────────────────────────────
// How much a player has to read on each lead before they can act. Counts
// the words visible in the viewport (not scrolled-away text) on the
// briefing screen, then on the work screen (header and whole), desktop size.
//   node harness/wordcount.cjs            -> table, wordiest first
const { chromium } = require('playwright')
const S = require('./lib-state.cjs')
const URL = 'http://localhost:5173/osint-game-v2/'
;(async () => {
  const b = await chromium.launch({ channel: 'chrome' })
  const p = await (await b.newContext({ viewport: { width: 1440, height: 950 } })).newPage()
  await p.goto(URL)
  const rows = []
  for (const id of S.ALL) {
    await p.evaluate(s => localStorage.setItem('maya-game-v3-storage', JSON.stringify({ state: s, version: 0 })), S.atLead(id))
    await p.reload(); await p.waitForTimeout(900)
    const count = () => p.evaluate(() => {
      const vis = (root) => {
        if (!root) return 0
        const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
        let n = 0, t
        while ((t = w.nextNode())) {
          const el = t.parentElement
          if (!el || !el.getClientRects().length) continue
          const cs = getComputedStyle(el)
          if (cs.visibility === 'hidden' || cs.display === 'none') continue
          const rc = el.getBoundingClientRect()
          if (rc.bottom < 0 || rc.top > innerHeight) continue
          n += t.textContent.split(/\s+/).filter(x => /[a-z0-9]/i.test(x)).length
        }
        return n
      }
      return { head: vis(document.querySelector('.lo-head')), all: vis(document.querySelector('.lo-panel')) }
    })
    const brief = await count()
    await p.locator('.lob-start').click(); await p.waitForTimeout(400)
    const r = await count()
    rows.push([id, brief.all, r.head, r.all])
  }
  rows.sort((a, b) => b[1] - a[1])
  for (const [id, br, h, a] of rows) console.log(id.padEnd(5), 'briefing', String(br).padStart(4), '  work header', String(h).padStart(4), '  work screen', String(a).padStart(4))
  await b.close()
})()
