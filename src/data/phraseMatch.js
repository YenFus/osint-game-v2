// ─────────────────────────────────────────────────────────────────
// How a selection in a phrase lead is judged.
//
// This used to be exact string equality on the normalised words, so on A2
// "her Tuesday route" was right and "Tuesday route", "near her Tuesday route"
// and "wasn't that near her Tuesday route" were all wrong and each cost
// fifteen minutes or more. A player who had found the thing that gives him
// away was being charged for where they started dragging.
//
// What the lead actually asks is: did you find the words nobody published?
// So a selection is right if it contains the phrase's CORE — the words that
// carry the private fact, "Tuesday route" and not "her" — and it is still a
// reading rather than a sweep:
//
//   - it stays inside one sentence, and
//   - it carries at most MAX_EXTRA words beyond the core.
//
// Selecting the whole post is what this lead exists to stop, and both rules
// stop it on every post in the game. A selection that contains a core but
// runs past those limits is not wrong, it is loose — the player is told to
// narrow it and is not charged.
// ─────────────────────────────────────────────────────────────────

export const MAX_EXTRA = 4

// Words compare the way a reader compares them: case, punctuation and the
// difference between a hyphen and a dash do not decide whether two phrases
// are the same phrase.
export const norm = (s) => s
  .toLowerCase()
  .replace(/[‘’]/g, "'")
  .replace(/[^a-z0-9'\s]+/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const LEAD_IN = /^(her|his|the|their|a|an) /

// The core of a phrase is its text without a leading possessive or article,
// unless the lead names its cores outright.
export function coresOf(phrase) {
  if (phrase.cores?.length) return phrase.cores.map(norm)
  const n = norm(phrase.text)
  const stripped = n.replace(LEAD_IN, '')
  return [stripped || n]
}

const wordsIn = (n) => (n ? n.split(' ').length : 0)
// Words as the player dragged them — "off-thread" is one word on the page,
// even though normalising the hyphen away makes it two.
const draggedWords = (raw) => raw.split(/\s+/).filter(w => /[a-z0-9]/i.test(w)).length
const containsWords = (hay, needle) => ` ${hay} `.includes(` ${needle} `)

// A sentence boundary inside the raw selection — ".", "?" or "!" with more
// words after it. Trailing punctuation on the last word does not count.
export function crossesSentence(raw) {
  const body = raw.trim().replace(/[.?!…"'”’)\]]+$/, '')
  return /[.?!…]/.test(body)
}

/**
 * Judge a selection against a lead's phrases.
 * @returns {{ phrase, status: 'hit' | 'loose' } | null}
 *   'hit'   — counts as finding the phrase
 *   'loose' — the core is in there, but so is too much else; no charge
 *   null    — the selection does not contain any phrase's core
 */
export function matchSelection(raw, phrases) {
  const text = norm(raw)
  if (!text) return null
  const sprawl = crossesSentence(raw)
  let loose = null
  for (const ph of phrases) {
    for (const core of coresOf(ph)) {
      if (!containsWords(text, core)) continue
      if (!sprawl && draggedWords(raw) - wordsIn(core) <= MAX_EXTRA) return { phrase: ph, status: 'hit' }
      loose = loose ?? { phrase: ph, status: 'loose' }
    }
  }
  return loose
}
