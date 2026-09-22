// ── shotall.cjs ──────────────────────────────────────────────────────────
// Screenshots the entire game — every screen, and one frame after every
// interaction that changes anything — so the result can be judged by eye.
//
// Assertions pass while the game looks broken. This project has shipped a
// 1.01:1 reveal card, placeholder squiggles under a magnifier, a notched
// phrase highlight and a magnified view nobody could see, all green.
//
//   node harness/shotall.cjs                 both viewports, everything
//   node harness/shotall.cjs desktop         one viewport
//   node harness/shotall.cjs mobile leads    one viewport, one section
//
// Sections: menu prologue apartment board leads reveal converge ending modals
const { chromium } = require('playwright')
const fs = require('fs')
const path = require('path')
const S = require('./lib-state.cjs')

const OUT = process.env.SHOT_DIR || '/tmp/shots'
const URL = 'http://localhost:5173/osint-game-v2/'
const VPS = {
  desktop: { width: 1440, height: 950, isMobile: false, hasTouch: false },
  // 664 not 844: a real phone loses 150-200px to browser chrome, and this
  // project has shipped bugs that only exist in that band.
  mobile:  { width: 390,  height: 664, isMobile: true,  hasTouch: true },
}

let n = 0
const errs = []

async function shot(p, tag, vp) {
  n++
  const file = path.join(OUT, vp, `${String(n).padStart(3, '0')}-${tag.replace(/[^\w.-]+/g, '_')}.png`)
  fs.mkdirSync(path.dirname(file), { recursive: true })
  await p.screenshot({ path: file })
  return file
}
const seed = (p, st) => p.evaluate(s => localStorage.setItem('maya-game-v3-storage', JSON.stringify({ state: s, version: 0 })), st)
const load = async (p, st, wait = 900) => { await seed(p, st); await p.reload(); await p.waitForTimeout(wait) }
// .tap() needs a touch-enabled context; on desktop it throws and every
// interaction silently produces no screenshot. Use whichever the context has.
let TOUCH = true
const tap = async (p, h, w = 650) => {
  try {
    if (TOUCH) await h.tap({ timeout: 2500 })
    else await h.click({ timeout: 2500 })
    await p.waitForTimeout(w); return true
  } catch { return false }
}

async function sections(p, vp, want) {
  const has = (s) => !want.length || want.includes(s)

  // ── menu, guide, settings ──────────────────────────────────────────────
  if (has('menu')) {
    await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(1300)
    await shot(p, 'menu', vp)
    for (const re of [/osint guide|guide/i, /settings/i, /how to play|tutorial/i]) {
      const h = await p.$(`text=${re.source}`).catch(() => null)
      if (h) { if (await tap(p, h, 900)) { await shot(p, `menu-${re.source.split('|')[0].replace(/\W/g,'')}`, vp)
        const close = await p.$('[aria-label*="lose" i], button:has-text("Close"), button:has-text("Back")')
        if (close) await tap(p, close) } }
    }
  }

  // ── prologue, beat by beat ─────────────────────────────────────────────
  if (has('prologue')) {
    await p.evaluate(() => localStorage.clear()); await p.reload(); await p.waitForTimeout(1200)
    const start = await p.$('text=/new investigation|begin|start/i')
    if (start) await tap(p, start, 1200)
    for (let i = 0; i < 24; i++) {
      await shot(p, `prologue-${String(i).padStart(2, '0')}`, vp)
      if (await p.evaluate(() => !!document.querySelector('.apartment-sidebar'))) break
      // the full-screen advance control, not "the first button" — on a phone
      // the first button in the DOM is Skip, which ended the capture at beat 2
      // and not a tap at the centre either: on the voicemail beat the Play
      // button sits there and takes the tap. The prologue listens for
      // ArrowRight, so advance the way a keyboard player does.
      if (!(await p.$('.pro-root'))) break
      await p.keyboard.press('ArrowRight'); await p.waitForTimeout(700)
    }
  }

  // ── apartment, fresh and mid-run ───────────────────────────────────────
  if (has('apartment')) {
    await load(p, S.base({ phase: 'apartment', prevPhase: 'story',
      paths: { A:{started:false,completed:false,unlockedNodes:S.A,completedNodes:[]},
               B:{started:false,completed:false,unlockedNodes:S.B,completedNodes:[]},
               C:{started:false,completed:false,unlockedNodes:S.C,completedNodes:[]} }, clock: 0 }), 1300)
    await shot(p, 'apartment-fresh', vp)
    await p.evaluate(() => { const s = document.querySelector('.apartment-sidebar'); if (s) s.scrollTop = s.scrollHeight })
    await p.waitForTimeout(400); await shot(p, 'apartment-fresh-scrolled', vp)
    await load(p, S.base({ phase: 'apartment', clues: S.ALL_CLUES.slice(0, 9), clock: 140,
      paths: { A:{started:true,completed:true,unlockedNodes:S.A,completedNodes:S.A},
               B:{started:true,completed:false,unlockedNodes:S.B,completedNodes:['B1','B2']},
               C:{started:false,completed:false,unlockedNodes:S.C,completedNodes:[]} } }), 1300)
    await shot(p, 'apartment-midrun', vp)
  }

  // ── the board, in the states it actually passes through ────────────────
  if (has('board')) {
    await load(p, S.base({ seenBoardTutorial: false, clues: [] }), 1400)
    await shot(p, 'board-tutorial-1', vp)
    for (let i = 2; i <= 4; i++) {
      const nx = await p.$('button:has-text("NEXT"), button:has-text("Next")')
      if (!nx || !(await tap(p, nx, 700))) break
      await shot(p, `board-tutorial-${i}`, vp)
    }
    await load(p, S.base({ clues: [] }), 1300); await shot(p, 'board-fresh', vp)
    await load(p, S.base({ clues: S.ALL_CLUES.slice(0, 6), clock: 120,
      paths: { A:{started:true,completed:false,unlockedNodes:S.A,completedNodes:S.A.slice(0,5)},
               B:{started:true,completed:false,unlockedNodes:S.B,completedNodes:['B1']},
               C:{started:true,completed:false,unlockedNodes:S.C,completedNodes:[]} } }), 1300)
    await shot(p, 'board-partway', vp)
    await load(p, S.base({ clues: S.ALL_CLUES.slice(0, 14), clock: 240,
      paths: { A:{started:true,completed:true,unlockedNodes:S.A,completedNodes:S.A},
               B:{started:true,completed:false,unlockedNodes:S.B,completedNodes:['B1','B2','B4']},
               C:{started:true,completed:false,unlockedNodes:S.C,completedNodes:[]} } }), 1300)
    await shot(p, 'board-one-thread-closed', vp)
    await load(p, S.base({ clues: S.ALL_CLUES, clock: 300,
      paths: { A:{started:true,completed:true,unlockedNodes:S.A,completedNodes:S.A},
               B:{started:true,completed:true,unlockedNodes:S.B,completedNodes:S.B},
               C:{started:true,completed:true,unlockedNodes:S.C,completedNodes:S.C} } }), 1400)
    await shot(p, 'board-all-closed', vp)
    // the clue drawer open
    const dt = await p.$('.drawer-toggle, [aria-label*="clue" i]')
    if (dt && await tap(p, dt, 800)) await shot(p, 'board-clue-drawer-open', vp)
  }

  // ── every lead: at rest, mid-interaction, and its overlays ─────────────
  if (has('leads')) {
    for (const id of S.ALL) {
      await load(p, S.atLead(id), 1200)
      // every lead opens on its briefing; shoot it, then start the work
      await shot(p, `lead-${id}-brief`, vp)
      const start = p.locator('.lob-start')
      if (await start.count()) { await start.click(); await p.waitForTimeout(500) }
      await shot(p, `lead-${id}-rest`, vp)

      const hotspots = await p.$$('.hotspot')
      const ranges = await p.$$('input[type=range]')
      const textin = await p.$('input[type=text]')

      if (hotspots.length) {
        for (const i of [0, Math.floor(hotspots.length / 2)]) {
          if (await tap(p, hotspots[i], 800)) await shot(p, `lead-${id}-zoom${i}`, vp)
        }
      } else if (ranges.length) {
        for (const [b, c] of [[95, 100], [160, 175]]) {
          await p.evaluate(([b, c]) => {
            const rs = [...document.querySelectorAll('input[type=range]')]
            const set = (el, v) => { const s = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set
              s.call(el, String(v)); el.dispatchEvent(new Event('input', { bubbles: true })) }
            if (rs[0]) set(rs[0], b); if (rs[1]) set(rs[1], c)
          }, [b, c])
          await p.waitForTimeout(500); await shot(p, `lead-${id}-slider-${b}`, vp)
        }
      } else if (textin) {
        await (TOUCH ? textin.tap() : textin.click()).catch(() => {})
        await p.keyboard.type('wayback machine'); await p.waitForTimeout(350)
        await shot(p, `lead-${id}-typed`, vp)
        await p.keyboard.press('Enter'); await p.waitForTimeout(900)
        await shot(p, `lead-${id}-submitted`, vp)
      } else {
        // connect / compare / diff / browse / navigate
        const live = await p.$$('[role="dialog"] button:not([disabled])')
        let taken = 0
        for (const h of live) {
          const lab = (await h.getAttribute('aria-label')) || (await h.textContent()) || ''
          if (/board|hint|manual|journal|save|close/i.test(lab)) continue
          if (await tap(p, h, 700)) { taken++; await shot(p, `lead-${id}-act${taken}`, vp) }
          if (taken >= 2) break
        }
      }
      // the two overlays every lead has
      const fm = await p.$('button:has-text("Field manual"), button:has-text("FIELD MANUAL")')
      if (fm && await tap(p, fm, 800)) {
        await shot(p, `lead-${id}-fieldmanual`, vp)
        const cl = await p.$('[role="dialog"] button:has-text("Close"), button[aria-label*="lose" i]')
        if (cl) await tap(p, cl)
      }
      const hint = await p.$('button:has-text("HINT"), button:has-text("Hint")')
      if (hint && await tap(p, hint, 800)) await shot(p, `lead-${id}-hint`, vp)
    }
  }

  // ── the name reveal ────────────────────────────────────────────────────
  if (has('reveal')) {
    await load(p, S.atLead('C5', { nameRevealSeen: false, namePending: true }), 1400)
    await shot(p, 'name-reveal', vp)
  }

  // ── convergence ────────────────────────────────────────────────────────
  if (has('converge')) {
    const full = { phase: 'convergence', prevPhase: 'investigation', clues: S.ALL_CLUES, clock: 300, theoryTests: 1,
      paths: { A:{started:true,completed:true,unlockedNodes:S.A,completedNodes:S.A},
               B:{started:true,completed:true,unlockedNodes:S.B,completedNodes:S.B},
               C:{started:true,completed:true,unlockedNodes:S.C,completedNodes:S.C} } }
    await load(p, S.base(full), 1400); await shot(p, 'convergence', vp)
    await p.evaluate(() => window.scrollTo(0, 99999)); await p.waitForTimeout(400)
    await shot(p, 'convergence-bottom', vp)
    await load(p, S.base({ ...full, finalCase: { suspect: 'ray', slots: { who: 'whois', there: 'flickr_gps', before: 'court' } } }), 1400)
    await shot(p, 'convergence-pinned', vp)
  }

  // ── endings ────────────────────────────────────────────────────────────
  if (has('ending')) {
    const done = { A:{started:true,completed:true,unlockedNodes:S.A,completedNodes:S.A},
                   B:{started:true,completed:true,unlockedNodes:S.B,completedNodes:S.B},
                   C:{started:true,completed:true,unlockedNodes:S.C,completedNodes:S.C} }
    const CASES = [
      ['best',      { suspect:'ray', slots:{who:'whois',there:'flickr_gps',before:'court'}, choice:'police', susp:0, clock:200 }],
      ['journalist',{ suspect:'ray', slots:{who:'whois',there:'flickr_gps',before:'court'}, choice:'journalist', susp:0, clock:200 }],
      ['confront',  { suspect:'ray', slots:{who:'whois',there:'flickr_gps',before:'court'}, choice:'confront', susp:0, clock:200 }],
      ['fled',      { suspect:'ray', slots:{who:'whois',there:'flickr_gps',before:'court'}, choice:'police', susp:95, clock:100 }],
      ['thin',      { suspect:'ray', slots:{who:'nightwatch',there:'building_owner',before:'deleted'}, choice:'police', susp:0, clock:200 }],
      ['wrongman',  { suspect:'corey', slots:{who:'whois',there:'flickr_gps',before:'court'}, choice:'police', susp:0, clock:200 }],
      ['toolate',   { suspect:'ray', slots:{who:'whois',there:'flickr_gps',before:'court'}, choice:'police', susp:0, clock:990 }],
    ]
    for (const [name, c] of CASES) {
      await load(p, S.base({ phase:'ending', prevPhase:'convergence', paths:done, clues:S.ALL_CLUES,
        endingChoice:c.choice, evidenceScore:3, journalistUnlocked:true, theoryTests:1,
        raySuspicion:c.susp, clock:c.clock, finalCase:{suspect:c.suspect, slots:c.slots} }), 1100)
      // the call plays live first (LiveCall.jsx): shoot it mid-call, skip, hang up
      await p.waitForTimeout(8500)
      await shot(p, `ending-${name}-call`, vp)
      await p.click('.lc-skip', { timeout: 3000 }).catch(() => {})
      await p.waitForTimeout(600)
      await p.click('.lc-go', { timeout: 3000 }).catch(() => {})
      await p.waitForTimeout(1100)
      await shot(p, `ending-${name}-reveal`, vp)
      await p.keyboard.press('Enter'); await p.waitForTimeout(1100)
      await shot(p, `ending-${name}-file`, vp)
      await p.evaluate(() => window.scrollTo(0, 99999)); await p.waitForTimeout(500)
      await shot(p, `ending-${name}-bottom`, vp)
    }
  }

  // ── save / load, journal, settings in play ─────────────────────────────
  if (has('modals')) {
    await load(p, S.base({ clues: S.ALL_CLUES.slice(0, 8), clock: 150,
      saveSlots: [{ phase:'investigation', clock:120, savedAt:Date.now(), label:'slot' }, null, null] }), 1300)
    for (const [re, tag] of [[/save/i,'save'],[/journal/i,'journal']]) {
      const h = await p.$(`button:has-text("${re.source.replace(/[^\w]/g,'')}")`)
      if (h && await tap(p, h, 900)) {
        await shot(p, `modal-${tag}`, vp)
        const del = await p.$('button:has-text("Delete")')
        if (del && tag === 'save') { await tap(p, del, 500); await shot(p, 'modal-save-delete-armed', vp) }
        const cl = await p.$('button[aria-label*="lose" i], button:has-text("Close")')
        if (cl) await tap(p, cl, 500)
      }
    }
  }
}

;(async () => {
  const args = process.argv.slice(2)
  const vps = Object.keys(VPS).filter(v => !args.length || args.includes(v))
  const want = args.filter(a => !VPS[a])
  const b = await chromium.launch({ channel: 'chrome', headless: true })
  for (const vp of (vps.length ? vps : Object.keys(VPS))) {
    const ctx = await b.newContext({ viewport: { width: VPS[vp].width, height: VPS[vp].height },
      isMobile: VPS[vp].isMobile, hasTouch: VPS[vp].hasTouch, reducedMotion: 'reduce', deviceScaleFactor: 1 })
    const p = await ctx.newPage()
    TOUCH = VPS[vp].hasTouch
    p.on('pageerror', e => errs.push(`[${vp}] ${e.message}`))
    await p.goto(URL)
    await sections(p, vp, want)
    await ctx.close()
  }
  await b.close()
  console.log(`${n} screenshots -> ${OUT}`)
  console.log(errs.length ? `PAGE ERRORS:\n  ${[...new Set(errs)].join('\n  ')}` : 'no page errors')
})()
