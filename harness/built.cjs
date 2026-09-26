// ── built.cjs ────────────────────────────────────────────────────────────
// Load the ARTIFACT build (dist-artifact, base ./) the way the artifact host
// serves it, walk a few screens, and report page errors and any 4xx.
//
// Why: the dev server uses an absolute base (/osint-game-v2/), so a url()
// inside a CSS custom property resolves fine there and 404s only on the
// artifact, where it resolves against /assets/. That has shipped twice (the
// cork, then the burned notebook pages). Run this before every republish.
//
//   npx vite build --base=./ --outDir dist-artifact && node harness/built.cjs
const { chromium } = require('playwright')
const http = require('http'), fs = require('fs'), path = require('path')
const S = require('./lib-state.cjs')
const ROOT = path.join(__dirname, '..', 'dist-artifact')
const TYPES = { '.js': 'text/javascript', '.css': 'text/css', '.html': 'text/html', '.jpg': 'image/jpeg', '.png': 'image/png', '.woff2': 'font/woff2', '.wav': 'audio/wav', '.mp4': 'video/mp4' }
const srv = http.createServer((q, r) => {
  const f = path.join(ROOT, decodeURIComponent(q.url.split('?')[0]).replace(/^\/+/, '') || 'index.html')
  fs.readFile(f, (e, d) => { if (e) { r.writeHead(404); r.end() } else { r.writeHead(200, { 'content-type': TYPES[path.extname(f)] ?? 'application/octet-stream' }); r.end(d) } })
}).listen(8766)
;(async () => {
  const b = await chromium.launch({ channel: 'chrome' })
  const p = await (await b.newContext({ viewport: { width: 1280, height: 800 } })).newPage()
  const errs = [], bad = []
  p.on('pageerror', e => errs.push(String(e)))
  p.on('response', r => { if (r.status() >= 400) bad.push(`${r.status()} ${r.url()}`) })
  await p.goto('http://localhost:8766/'); await p.waitForTimeout(1200)
  const states = [S.base({ phase: 'apartment' }), ...S.ALL.map(id => S.atLead(id)),
    S.base({ phase: 'ending', endingChoice: 'police', clues: S.ALL_CLUES, clock: 300, finalCase: { suspect: 'ray', slots: { who: 'registry', there: 'flickr_gps', before: 'court' } } })]
  for (const st of states) {
    await p.evaluate(s => localStorage.setItem('maya-game-v3-storage', JSON.stringify({ state: s, version: 0 })), st)
    await p.reload(); await p.waitForTimeout(700)
    const s = await p.$('button.lob-start'); if (s) { await s.click().catch(() => {}); await p.waitForTimeout(500) }
  }
  await p.mouse.click(5, 5); await p.waitForTimeout(2000) // first gesture: audio loads
  console.log(errs.length || bad.length ? { errs, bad } : `clean: ${states.length} screens on the artifact build, no page errors, no 4xx`)
  await b.close(); srv.close()
})()
