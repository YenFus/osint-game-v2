// ─────────────────────────────────────────────────────────────────
// PHRASE LEAD — mark the words, not the row.
//
// "Click the suspicious post" is the verb this game leans on hardest,
// and it lets you skim: the damning one is usually the longest, or the
// one with a name in it. This asks for the actual words. A post can be
// entirely ordinary except for three of them, and those three are the
// reason it matters — the route nobody published, the flatmate's name,
// the timetable that was never online.
//
// This used to hand the answer over. Six phrases carried a dashed
// underline at rest, one per post, three of them right: the reading was
// already done, and what was left was picking three of six labelled
// options. Every word is selectable now and nothing is marked. You
// choose the first word and the last word of a phrase and put it up,
// which is the actual motion of reading a page against what you know.
//
// Every word is a button, so it plays by keyboard and touch; within a
// post the words are one tab stop with arrow-key travel, so six posts
// cost six tab stops rather than eighty.
// ─────────────────────────────────────────────────────────────────

import { useMemo, useRef, useState } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { wrongCost } from '../../data/caseData'
import { norm, matchSelection } from '../../data/phraseMatch'


// A token is selectable if it has something to read in it. Bare punctuation
// — the em dashes around a name, a lone question mark — is scenery: it can
// sit inside a selection but it is not a place to start one.
const READABLE = /[a-z0-9]/i
const tokenize = (text) => text.split(/(\s+)/).filter(t => t !== '').map((t, i) => ({
  i, text: t, space: /^\s+$/.test(t), pick: !/^\s+$/.test(t) && READABLE.test(t),
}))

// ── One post, with its own roving focus ───────────────────────────
function Post({ post, tokens, sel, hits, disabled, onPick, onClear, onMark }) {
  const [active, setActive] = useState(() => tokens.find(t => t.pick)?.i ?? 0)
  const ref = useRef(null)
  const picks = useMemo(() => tokens.filter(t => t.pick).map(t => t.i), [tokens])

  const inSel = (i) => sel && i >= sel.from && i <= sel.to
  const selText = sel ? tokens.slice(sel.from, sel.to + 1).map(t => t.text).join('') : ''

  const move = (delta) => {
    const at = picks.indexOf(active)
    const next = picks[Math.min(picks.length - 1, Math.max(0, (at < 0 ? 0 : at) + delta))]
    if (next === undefined) return
    setActive(next)
    ref.current?.querySelector(`[data-i="${next}"]`)?.focus()
  }

  const onKeyDown = (e) => {
    const map = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }
    if (map[e.key]) { e.preventDefault(); move(map[e.key]); return }
    if (e.key === 'Home') { e.preventDefault(); setActive(picks[0]); ref.current?.querySelector(`[data-i="${picks[0]}"]`)?.focus() }
    if (e.key === 'End') { const l = picks[picks.length - 1]; e.preventDefault(); setActive(l); ref.current?.querySelector(`[data-i="${l}"]`)?.focus() }
    if (e.key === 'Escape' && sel) { e.preventDefault(); onClear() }
  }

  return (
    <article className="ph-post">
      <header className="ph-meta">
        <span className="ph-who">{post.who}</span>
        <span className="ph-when">{post.when}</span>
      </header>
      {/* the keydown handler is the roving-focus travel for the word buttons
          inside; the paragraph itself is not a control. */}
      <p className="ph-text" ref={ref} onKeyDown={onKeyDown}>
        {tokens.map(t => {
          const hit = hits.some(h => t.i >= h.from && t.i <= h.to)
          const on = inSel(t.i)
          if (!t.pick) {
            return <span key={t.i} className={`ph-gap ${on ? 'sel' : ''} ${hit ? 'hit' : ''}`}>{t.text}</span>
          }
          return (
            <button key={t.i} type="button" data-i={t.i}
              className={`ph-w ${on ? 'sel' : ''} ${hit ? 'hit' : ''}`}
              tabIndex={t.i === active ? 0 : -1}
              aria-pressed={on}
              disabled={disabled || hit}
              onFocus={() => setActive(t.i)}
              onClick={() => onPick(t.i)}>
              {/* The highlight paints on this inline span, not on the button:
                  a <button> is always inline-block in Chrome, so its box and a
                  space span's box never quite agree, and the stripe came out
                  notched at every gap. Two inline spans in the same font do. */}
              <span className="ph-ink">{t.text}</span>
            </button>
          )
        })}
      </p>
      {sel && !disabled && (
        <div className="ph-sel-bar">
          <span className="ph-sel-t">“{selText.trim()}”</span>
          <button type="button" className="ph-mark-btn" onClick={onMark}
            aria-label={`Put up the phrase “${selText.trim()}”`}>Mark this ↵</button>
          <button type="button" className="ph-clear-btn" onClick={onClear}
            aria-label="Clear the selected words">Clear</button>
        </div>
      )}
    </article>
  )
}

export function PhraseNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [found, setFound] = useLeadProgress(nodeId, 'found', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  // { postId, anchor, from, to } — the anchor is the word you chose first
  const [sel, setSel] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const posts = useMemo(() => content.posts.map(p => ({ ...p, tokens: tokenize(p.text) })), [content.posts])
  const phrases = useMemo(
    () => content.phrases.map(ph => ({ ...ph, norm: norm(ph.text) })), [content.phrases])
  const decoys = useMemo(
    () => (content.decoys ?? []).map(d => ({ ...d, norm: norm(d.text) })), [content.decoys])
  const done = phrases.every(ph => found.includes(ph.id))

  // Where each found phrase sits, so its words stay marked on the page.
  const hitsFor = useMemo(() => {
    const out = {}
    posts.forEach(p => {
      out[p.id] = []
      phrases.filter(ph => found.includes(ph.id)).forEach(ph => {
        const words = p.tokens.filter(t => t.pick)
        for (let a = 0; a < words.length; a++) {
          for (let b = a; b < words.length; b++) {
            const run = p.tokens.slice(words[a].i, words[b].i + 1).map(t => t.text).join('')
            if (norm(run) === ph.norm) { out[p.id].push({ from: words[a].i, to: words[b].i }); return }
          }
        }
      })
    })
    return out
  }, [posts, phrases, found])

  const pick = (postId, i) => {
    setFeedback(null)
    setSel(cur => (cur && cur.postId === postId)
      ? { postId, anchor: cur.anchor, from: Math.min(cur.anchor, i), to: Math.max(cur.anchor, i) }
      : { postId, anchor: i, from: i, to: i })
  }

  const mark = (post) => {
    if (!sel || sel.postId !== post.id) return
    const raw = post.tokens.slice(sel.from, sel.to + 1).map(t => t.text).join('')
    const text = norm(raw)
    setSel(null)
    // Judged on whether the selection holds the words that give him away, not
    // on where the drag started — see phraseMatch.js.
    const m = matchSelection(raw, phrases)
    if (m && found.includes(m.phrase.id)) {
      setFeedback({ type: 'info', text: 'You have already put that one up.' })
      return
    }
    if (m?.status === 'hit') {
      const next = [...found, m.phrase.id]
      setFound(next)
      setFeedback({ type: 'correct', text: m.phrase.correctFeedback ?? 'Nobody published that.' })
      triggerDiscovery(phrases.every(ph => next.includes(ph.id)) ? 'major' : 'minor')
      return
    }
    if (m?.status === 'loose') {
      // Right words, too many of them. Not a wrong reading, so not charged.
      setFeedback({ type: 'info', text: content.looseFeedback ?? "It's in there — but so is a lot else. Narrow it to the words that give him away." })
      return
    }
    const nth = wrongCount + 1
    setWrongCount(nth)
    if (activePath) markWrongGuess(activePath, nth)
    const decoy = decoys.find(d => d.norm === text)
    setFeedback({
      type: 'wrong',
      text: `${decoy?.feedback ?? content.missFeedback ?? 'Nothing in those words was ever private.'} (+${wrongCost(nth)} min)`,
    })
  }

  return (
    <div className="ph-root">
      <div className="mp-bar" role="status">
        <span>Marked {found.length} / {phrases.length}</span>
        <span className="mp-bar-hint">{content.hint ?? 'Pick the first word of a phrase, then its last word'}</span>
      </div>

      <div className="ph-body">
        {posts.map(post => (
          <Post key={post.id} post={post} tokens={post.tokens}
            sel={sel && sel.postId === post.id ? sel : null}
            hits={hitsFor[post.id] ?? []}
            disabled={done}
            onPick={(i) => pick(post.id, i)}
            onClear={() => setSel(null)}
            onMark={() => mark(post)} />
        ))}
      </div>

      {feedback && (
        <div className={`mp-feedback ${feedback.type}`} role="status" aria-live="polite">{feedback.text}</div>
      )}

      {done && (
        <div className="mp-done">
          {content.completionNote && <p>{content.completionNote}</p>}
          <button type="button" onClick={onComplete} style={BUTTON_PRIMARY}>Continue →</button>
        </div>
      )}
    </div>
  )
}
