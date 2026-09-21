import { describe, it, expect } from 'vitest'
import { matchSelection, crossesSentence, MAX_EXTRA } from './phraseMatch'
import { GAME_DATA } from './gameData'

const A2 = GAME_DATA.A.nodes.find(n => n.id === 'A2').content
const post = (id) => A2.posts.find(p => p.id === id).text
const judge = (sel) => {
  const m = matchSelection(sel, A2.phrases)
  return m ? `${m.status}:${m.phrase.id}` : 'miss'
}

// Every contiguous run of words in a post, as the player can drag it.
const runsOf = (text) => {
  const w = text.split(/\s+/).filter(Boolean)
  const out = []
  for (let a = 0; a < w.length; a++) for (let b = a; b < w.length; b++) out.push(w.slice(a, b + 1).join(' '))
  return out
}

describe('phrase selection — a reader who found it is not charged for where they started', () => {
  it('accepts the Tuesday route however it is dragged, as the player reported', () => {
    for (const sel of [
      'her Tuesday route?', 'her Tuesday route', 'Tuesday route?', 'Tuesday route',
      'Tuesday', 'near her Tuesday route?', 'that near her Tuesday route',
      "wasn't that near her Tuesday route?",
    ]) expect(judge(sel), sel).toBe('hit:p-route')
  })

  it('accepts the class schedule and the flatmate the same way', () => {
    for (const sel of ['Her class schedule', 'class schedule', 'Her class schedule should stay off-thread.'])
      expect(judge(sel), sel).toBe('hit:p-class')
    for (const sel of ['Priya', '— Priya —', 'The roommate — Priya', 'Priya — has she been interviewed'])
      expect(judge(sel), sel).toBe('hit:p-priya')
  })

  it('still refuses the sweep: no whole post is ever a hit', () => {
    for (const p of A2.posts) expect(judge(p.text), p.id).not.toMatch(/^hit/)
  })

  it('a sweep that holds the answer is loose, not wrong — told to narrow, never charged', () => {
    expect(judge(post('sm-003'))).toBe('loose:p-route')
    expect(judge(post('sm-008'))).toBe('loose:p-class')
    expect(judge(post('sm-012'))).toBe('loose:p-priya')
  })

  it('never turns a decoy into a hit', () => {
    for (const d of A2.decoys) expect(judge(d.text), d.text).toBe('miss')
  })

  it('"route" on its own is not the private fact', () => {
    expect(judge('route?')).toBe('miss')
    expect(judge('near her')).toBe('miss')
  })

  it('over every run of words in every post, a hit is always one sentence and at most MAX_EXTRA words past the core', () => {
    let hits = 0
    for (const p of A2.posts) for (const sel of runsOf(p.text)) {
      const m = matchSelection(sel, A2.phrases)
      if (m?.status !== 'hit') continue
      hits++
      expect(crossesSentence(sel), sel).toBe(false)
      expect(sel.split(/\s+/).filter(w => /[a-z0-9]/i.test(w)).length, sel).toBeLessThanOrEqual(2 + MAX_EXTRA + 1)
    }
    expect(hits).toBeGreaterThan(10)
  })

  it('sentence boundaries ignore trailing punctuation', () => {
    expect(crossesSentence('her Tuesday route?')).toBe(false)
    expect(crossesSentence('off-thread.')).toBe(false)
    expect(crossesSentence('properly? She was')).toBe(true)
  })
})
