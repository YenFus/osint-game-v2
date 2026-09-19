// ─────────────────────────────────────────────────────────────────
// The pure rules of the case: which pins count, what the final
// handover is worth, which ending that earns, and when Ray leaves.
//
// These exist because a bug here is invisible — the game keeps
// playing and quietly scores the player wrong. The deduction checker
// shipped for several rounds rejecting answers that were correct.
// ─────────────────────────────────────────────────────────────────

import { describe, it, expect } from 'vitest'
import {
  DEDUCTIONS, CLUES, FINAL_SLOTS, RAY_BEATS, LEAD_TIME_COST,
  pinCorrect, pinComplete, evaluateCase, rayDeadline, wrongCost,
} from './caseData'
import { GAME_DATA } from './gameData'
import { LEAD_META } from './leadMeta'
import { PROLOGUE_BEATS } from './prologueData'
import { CAST } from './castData'

const ded = (id) => Object.values(DEDUCTIONS).flat().find(d => d.id === id)
const allLeads = () => ['A', 'B', 'C'].flatMap(k => GAME_DATA[k].nodes)

describe('pinCorrect', () => {
  it('accepts the canonical pair', () => {
    expect(pinCorrect(ded('dA3'), ['domain_tweet', 'whois'])).toBe(true)
  })

  it('accepts a pair in either order', () => {
    expect(pinCorrect(ded('dA3'), ['whois', 'domain_tweet'])).toBe(true)
  })

  // The bug this file was written for: two records that both put his real
  // name on the account were scored wrong and charged 20 minutes.
  it('accepts other pairs that genuinely answer the question', () => {
    expect(pinCorrect(ded('dA3'), ['registry', 'html_author'])).toBe(true)
    expect(pinCorrect(ded('dA3'), ['whois', 'registry'])).toBe(true)
  })

  it('still rejects a pair that does not answer it', () => {
    expect(pinCorrect(ded('dA3'), ['whois', 'courier'])).toBe(false)
    expect(pinCorrect(ded('dC1'), ['court', 'rosa'])).toBe(false)
  })

  it('rejects a half-finished pair', () => {
    expect(pinCorrect(ded('dA3'), ['whois'])).toBe(false)
    expect(pinComplete(ded('dA3'), ['whois'])).toBe(false)
    expect(pinComplete(ded('dA3'), ['whois', 'registry'])).toBe(true)
  })

  it('handles single-answer deductions', () => {
    expect(pinCorrect(ded('dC3'), 'court')).toBe(true)
    expect(pinCorrect(ded('dC3'), 'rosa')).toBe(false)
    expect(pinCorrect(ded('dC3'), null)).toBe(false)
  })
})

describe('the case against him', () => {
  it('scores a full, airtight handover', () => {
    const e = evaluateCase({ suspect: 'ray', slots: { who: 'whois', there: 'flickr_gps', before: 'court' } })
    expect(e.namesSomeone).toBe(true)
    expect(e.strength).toBeGreaterThanOrEqual(2.5)
  })

  it('scores a weak handover below a strong one', () => {
    const strong = evaluateCase({ suspect: 'ray', slots: { who: 'whois', there: 'flickr_gps', before: 'court' } })
    const weak = evaluateCase({ suspect: 'ray', slots: { who: 'nightwatch', there: 'building_owner', before: 'deleted' } })
    expect(weak.strength).toBeLessThan(strong.strength)
  })

  it('gives every slot a reaction, never silence', () => {
    for (const slot of FINAL_SLOTS) {
      for (const clue of Object.keys(CLUES)) {
        const e = evaluateCase({ suspect: 'ray', slots: { [slot.id]: clue } })
        const answered = e.perSlot.find(p => p.reaction)
        expect(answered, `${slot.id} + ${clue} produced no reaction`).toBeTruthy()
      }
    }
  })

  it('does not credit a case against the wrong man', () => {
    const e = evaluateCase({ suspect: 'corey', slots: { who: 'whois', there: 'flickr_gps', before: 'court' } })
    expect(e.caseAgainstRay).toBe(0)
  })
})

describe("Ray's deadline", () => {
  it('comes forward as he gets nervous', () => {
    expect(rayDeadline(0)).toBeGreaterThan(rayDeadline(30))
    expect(rayDeadline(30)).toBeGreaterThan(rayDeadline(50))
  })

  // A thorough player once could not win: the leads alone cost more
  // than the clock allowed.
  it('leaves room to examine every lead', () => {
    const total = allLeads().reduce((n, node) => n + (LEAD_TIME_COST[node.type] ?? 0), 0)
    expect(total).toBeLessThan(rayDeadline(0))
    expect(total).toBeLessThan(rayDeadline(50))
  })

  it('fires his messages in escalating order', () => {
    const gates = RAY_BEATS.map(b => b.after)
    expect([...gates].sort((a, b) => a - b)).toEqual(gates)
  })

  it('reaches his last message before the shortest route ends', () => {
    const shortest = Math.min(...['A', 'B', 'C'].map(k => GAME_DATA[k].nodes.length)) +
      Math.min(...['A', 'B', 'C'].map(k => GAME_DATA[k].nodes.length))
    expect(Math.max(...RAY_BEATS.map(b => b.after))).toBeLessThanOrEqual(shortest)
  })
})

describe('wrongCost', () => {
  it('gets more expensive each time, so guessing is not free', () => {
    expect(wrongCost(2)).toBeGreaterThan(wrongCost(1))
  })
  it('is capped, so one bad lead cannot end the night', () => {
    expect(wrongCost(3)).toBe(wrongCost(2))
    expect(wrongCost(12)).toBeLessThanOrEqual(30)
  })
})

describe('the case data holds together', () => {
  it('sources every clue from some lead', () => {
    const granted = new Set(Object.values(LEAD_META).map(m => m.clue).filter(Boolean))
    const orphans = Object.keys(CLUES).filter(c => !granted.has(c))
    expect(orphans).toEqual([])
  })

  it('can answer every deduction with clues the player can hold', () => {
    const granted = new Set(Object.values(LEAD_META).map(m => m.clue).filter(Boolean))
    for (const d of Object.values(DEDUCTIONS).flat()) {
      for (const clue of [...(d.answer ?? []), ...(d.pairAnswer ?? []), ...(d.alsoAccept ?? []).flat()]) {
        expect(granted.has(clue), `${d.id} needs ${clue}, which no lead grants`).toBe(true)
      }
    }
  })

  it('leaves every lead reachable from its thread entry', () => {
    for (const k of ['A', 'B', 'C']) {
      const nodes = GAME_DATA[k].nodes
      const seen = new Set([nodes[0].id])
      const queue = [nodes[0].id]
      while (queue.length) {
        const id = queue.shift()
        for (const next of nodes.find(n => n.id === id)?.unlocks ?? []) {
          if (!seen.has(next)) { seen.add(next); queue.push(next) }
        }
      }
      expect(nodes.filter(n => !seen.has(n.id)).map(n => n.id)).toEqual([])
    }
  })

  it('only asks the player to flag things that exist', () => {
    const ids = (o, acc = new Set()) => {
      if (!o || typeof o !== 'object') return acc
      if (Array.isArray(o)) { o.forEach(x => ids(x, acc)); return acc }
      if (typeof o.id === 'string') acc.add(o.id)
      Object.values(o).forEach(v => ids(v, acc))
      return acc
    }
    for (const node of allLeads()) {
      const present = ids(node.content)
      for (const t of [...(node.content?.requiredTags ?? []), ...(node.content?.requiredTagIds ?? [])]) {
        expect(present.has(t), `${node.id} requires ${t}, which is not in its content`).toBe(true)
      }
    }
  })


  it('never repeats an id inside one lead, so React keys stay unique', () => {
    const ids = (o, acc = []) => {
      if (!o || typeof o !== 'object') return acc
      if (Array.isArray(o)) { o.forEach(x => ids(x, acc)); return acc }
      if (typeof o.id === 'string') acc.push(o.id)
      Object.values(o).forEach(v => ids(v, acc))
      return acc
    }
    for (const node of allLeads()) {
      const seen = ids(node.content)
      const dup = seen.filter((x, i) => seen.indexOf(x) !== i)
      expect([...new Set(dup)], `${node.id} repeats an id`).toEqual([])
    }
  })

  it('keeps hotspots from overlapping, so a click lands on what it looks at', () => {
    for (const node of allLeads()) {
      const spots = (node.content?.items ?? []).filter(i => i.spot)
      for (let i = 0; i < spots.length; i++) {
        for (let j = i + 1; j < spots.length; j++) {
          const a = spots[i].spot, b = spots[j].spot
          const apart = a.x + a.w <= b.x || b.x + b.w <= a.x || a.y + a.h <= b.y || b.y + b.h <= a.y
          expect(apart, `${node.id}: ${spots[i].id} overlaps ${spots[j].id}`).toBe(true)
        }
      }
    }
  })
})

describe('map, timeline and compare leads', () => {
  const of = (type) => allLeads().filter(n => n.type === type)
  const inside = (v, [a, b]) => v >= Math.min(a, b) && v <= Math.max(a, b)

  it('every lead type has a time cost', () => {
    for (const node of allLeads()) expect(LEAD_TIME_COST[node.type], node.id).toBeTypeOf('number')
  })

  it('map: every answer is a place, on a sheet that contains the photo\'s coordinates', () => {
    for (const node of of('map')) {
      const { photos, sheets, places } = node.content
      expect(photos.some(p => p.required), node.id).toBe(true)
      for (const p of photos) {
        const place = places.find(pl => pl.id === p.answer)
        expect(place, `${node.id}: ${p.id} answers ${p.answer}`).toBeTruthy()
        const sheet = sheets.find(s => s.id === place.sheet)
        expect(inside(p.lat, sheet.lat) && inside(p.lon, sheet.lon), `${p.id} is off its sheet`).toBe(true)
        // the nearest place to the photo must be its answer, or the grid lies
        const d = (pl) => Math.hypot(pl.lat - p.lat, pl.lon - p.lon)
        const nearest = places.filter(pl => pl.sheet === sheet.id).sort((a, b) => d(a) - d(b))[0]
        expect(nearest.id, `${p.id}: nearest place is ${nearest.id}`).toBe(p.answer)
      }
      for (const pl of [...places, ...(node.content.landmarks ?? [])]) {
        const sheet = sheets.find(s => s.id === pl.sheet)
        expect(sheet && inside(pl.lat, sheet.lat) && inside(pl.lon, sheet.lon), `${pl.id} is off its sheet`).toBe(true)
      }
    }
  })

  it('timeline: every photo sits on a real day, and its hour is its EXIF time in Portland time (UTC-7)', () => {
    for (const node of of('timeline')) {
      const days = node.content.days.map(d => d.id)
      for (const p of node.content.photos) {
        expect(days, p.id).toContain(p.day)
        const m = p.exif.match(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}) UTC/)
        expect(m, `${p.id} has no readable EXIF time`).toBeTruthy()
        const local = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5]) - 7 * 3600e3)
        expect(`d${local.getUTCDate()}`, `${p.id}: wrong day`).toBe(p.day)
        const h = local.getUTCHours() + local.getUTCMinutes() / 60
        expect(Math.abs(h - p.hour), `${p.id}: ${p.exif} vs hour ${p.hour}`).toBeLessThan(0.05)
        for (const t of p.traps ?? []) expect(Math.floor(t.hour / 2) === Math.floor(p.hour / 2) && t.day === p.day, `${p.id}: a trap sits on the answer`).toBe(false)
      }
    }
  })

  it('compare: every pair links a real left item to a real right item, and one is required', () => {
    for (const node of of('compare')) {
      const L = node.content.left.items.map(i => i.id)
      const R = node.content.right.items.map(i => i.id)
      expect(node.content.pairs.some(p => p.required), node.id).toBe(true)
      for (const p of node.content.pairs) {
        expect(L, node.id).toContain(p.left)
        expect(R, node.id).toContain(p.right)
      }
    }
  })
})

// The case used to be over in minute three: the prologue named Ray Callahan
// and the fifth lead printed it again. The surname now has to be earned, and
// this is the test that keeps it that way.
describe('the reveal stays late', () => {
  const nodes = Object.fromEntries(allLeads().map(n => [n.id, n]))
  const unlockerOf = {}
  for (const n of allLeads()) for (const u of n.unlocks ?? []) unlockerOf[u] = n.id

  // every lead that must be FINISHED before this one can be opened
  const prerequisites = (id, out = new Set()) => {
    const add = (x) => { if (x && !out.has(x)) { out.add(x); prerequisites(x, out) } }
    add(unlockerOf[id])
    if (nodes[id].requiresCompleted) add(nodes[id].requiresCompleted.nodeId)
    return out
  }

  const carriesTheName = (node) => /Callahan/.test(JSON.stringify(node.content))

  it('no lead shows the surname until nine others have been finished', () => {
    for (const node of allLeads().filter(carriesTheName)) {
      expect(prerequisites(node.id).size, `${node.id} shows the name too early`).toBeGreaterThanOrEqual(9)
    }
  })

  it('reaching it means working more than one thread', () => {
    for (const node of allLeads().filter(carriesTheName)) {
      const threads = new Set([...prerequisites(node.id)].map(id => nodes[id].path))
      expect(threads.size, `${node.id} is reachable from a single thread`).toBeGreaterThan(1)
    }
  })

  it('keeps the name out of the prologue and the cast list', () => {
    expect(JSON.stringify(PROLOGUE_BEATS)).not.toContain('Callahan')
    expect(CAST.find(c => c.id === 'ray').name).toBe('Ray')
  })
})

// A8 once asked for "Callahan Media", a company that had been renamed out of
// the game — so the lead could not be answered at all, and every attempt cost
// the player time. Nothing typed should be unfindable.
describe('typed answers exist somewhere in the game', () => {
  const haystack = JSON.stringify(allLeads()).toLowerCase()

  it('every accepted answer appears in something the player can read', () => {
    for (const node of allLeads()) {
      for (const q of node.content?.questions ?? []) {
        const findable = q.acceptedAnswers.filter(a => haystack.includes(a.toLowerCase()))
        expect(findable.length, `${node.id}: none of ${JSON.stringify(q.acceptedAnswers)} appears anywhere in the game`).toBeGreaterThan(0)
      }
    }
  })
})

// Owen Pryce was first named in A2 but the Who's Who did not introduce him
// until C4, and Rosa in A9 against C8 — so the player met two names the
// reference page refused to explain. That is the exact complaint the cast
// page exists to answer.
describe("the cast page keeps up with the script", () => {
  const nodes = Object.fromEntries(allLeads().map(n => [n.id, n]))
  const unlockerOf = {}
  for (const n of allLeads()) for (const u of n.unlocks ?? []) unlockerOf[u] = n.id
  const depth = (id, seen = new Set()) => {
    const add = (x) => { if (x && !seen.has(x)) { seen.add(x); depth(x, seen) } }
    add(unlockerOf[id])
    if (nodes[id]?.requiresCompleted) add(nodes[id].requiresCompleted.nodeId)
    return seen.size
  }
  const mentions = (node, name) => JSON.stringify(node.content).includes(name)

  it('introduces everyone no later than the lead that first says their name', () => {
    for (const person of CAST) {
      if (person.from === 'prologue') continue
      const surname = person.name.split(' ').pop()
      const first = allLeads()
        .filter(n => mentions(n, person.name) || mentions(n, surname))
        .sort((a, b) => depth(a.id) - depth(b.id))[0]
      if (!first) continue
      expect(depth(person.from), `${person.name} is named in ${first.id} but introduced at ${person.from}`)
        .toBeLessThanOrEqual(depth(first.id))
    }
  })
})

describe('diff leads', () => {
  const diffs = allLeads().filter(n => n.type === 'diff')

  it('every marked line points at a real change, and every change is markable', () => {
    for (const node of diffs) {
      const { before, after, changes } = node.content
      const lines = [...before.lines, ...after.lines]
      const ids = new Set(changes.map(c => c.id))
      for (const line of lines) {
        if (line.change) expect(ids, `${node.id}: line ${line.id} names an unknown change`).toContain(line.change)
      }
      for (const change of changes) {
        expect(lines.some(l => l.change === change.id), `${node.id}: change ${change.id} is on no line`).toBe(true)
      }
    }
  })

  it('leaves unchanged lines to mark wrongly, or there is no reading to do', () => {
    for (const node of diffs) {
      const lines = [...node.content.before.lines, ...node.content.after.lines]
      expect(lines.filter(l => !l.change).length, `${node.id} has no unchanged lines`).toBeGreaterThan(3)
    }
  })

  it('keeps the two captures honest: an unchanged line reads the same in both', () => {
    for (const node of diffs) {
      const after = new Map(node.content.after.lines.filter(l => !l.change).map(l => [l.text, l]))
      for (const line of node.content.before.lines.filter(l => !l.change)) {
        expect(after.has(line.text), `${node.id}: "${line.text.slice(0, 40)}" is only in one capture but is not marked as a change`).toBe(true)
      }
    }
  })
})

describe('phrase leads', () => {
  const leads = allLeads().filter(n => n.type === 'phrase')

  it('asks for phrases that are inside the post they belong to', () => {
    for (const node of leads) {
      for (const post of node.content.posts) {
        const marks = post.parts.filter(p => p.id)
        expect(marks.length, `${node.id}: ${post.id} has nothing to mark`).toBeGreaterThan(0)
        for (const m of marks) expect(m.text.trim().length, `${node.id}: an empty phrase`).toBeGreaterThan(1)
      }
    }
  })

  it('keeps decoys, so marking is a judgement and not a sweep', () => {
    for (const node of leads) {
      const marks = node.content.posts.flatMap(p => p.parts.filter(x => x.id))
      const req = marks.filter(m => m.required)
      expect(req.length, `${node.id} has no required phrases`).toBeGreaterThan(1)
      expect(marks.length - req.length, `${node.id} has no wrong phrases to mark`).toBeGreaterThan(1)
      for (const m of marks) {
        expect(m.required ? m.correctFeedback : m.wrongFeedback, `${node.id}: "${m.text}" has no feedback`).toBeTruthy()
      }
    }
  })
})
