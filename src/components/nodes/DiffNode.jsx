// ─────────────────────────────────────────────────────────────────
// DIFF LEAD — two captures of the same page, months apart.
//
// Thirteen of this game's leads were "read a document, click the
// suspicious line". This one asks a question with an objective answer
// instead: what is different between September and November? You are
// not judging whether a post is sinister. You are checking one column
// against the other and noticing that three things are missing and one
// is new — which is exactly what a person does with an archive.
//
// The story lands afterwards, in what he chose to delete.
//
// Lines are buttons, so it plays with a keyboard and on a phone.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useMemo, useState } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { wrongCost } from '../../data/caseData'

// Two columns side by side is the right shape for a diff on a desk and the
// wrong one on a phone: stacked, the captures are 700px apart and you are
// asked to remember a column rather than compare it. Narrow screens get the
// same information interleaved — each date once, both versions under it.
function useNarrow(query = '(max-width: 760px)') {
  const [narrow, setNarrow] = useState(() =>
    typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const on = (e) => setNarrow(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [query])
  return narrow
}

export function DiffNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [found, setFound] = useLeadProgress(nodeId, 'found', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const [feedback, setFeedback] = useState(null)

  const narrow = useNarrow()
  const changes = useMemo(() => content.changes ?? [], [content.changes])

  // one row per entry, in the order the earlier capture had them, with
  // anything that only exists in the later capture slotted in after
  const merged = useMemo(() => {
    const rows = content.before.lines.map(line => ({
      key: line.meta ?? line.id,
      meta: line.meta,
      before: line,
      after: content.after.lines.find(l => l.meta === line.meta) ?? null,
    }))
    for (const line of content.after.lines) {
      if (!content.before.lines.some(l => l.meta === line.meta)) {
        rows.unshift({ key: line.meta ?? line.id, meta: line.meta, before: null, after: line })
      }
    }
    return rows
  }, [content.before.lines, content.after.lines])
  const done = changes.every(c => found.includes(c.id))

  const mark = (line) => {
    if (done) return
    if (!line.change) {
      const nth = wrongCount + 1
      setWrongCount(nth)
      if (activePath) markWrongGuess(activePath, nth)
      setFeedback({
        type: 'wrong',
        text: `${line.wrongFeedback ?? 'That line is in both captures, word for word.'} (+${wrongCost(nth)} min)`,
      })
      return
    }
    if (found.includes(line.change)) {
      setFeedback({ type: 'info', text: 'You have that one already.' })
      return
    }
    const change = changes.find(c => c.id === line.change)
    // A12 is where thread A finally puts a surname on the handle, and the
    // name-reveal card is armed by the lead that shows it, not by the lead's
    // type. A browse lead did this through its taggable items; a diff does it
    // through the change the player just uncovered.
    if (change?.revealsName) useGameStore.getState().flagNameSeen()
    const next = [...found, line.change]
    setFound(next)
    setFeedback({ type: 'correct', text: change?.feedback ?? 'Changed between the two captures.' })
    triggerDiscovery(changes.every(c => next.includes(c.id)) ? 'major' : 'minor')
  }

  const column = (side) => (
    <section className={`df-col df-${side.id}`} aria-label={`${side.label} — ${side.when}`}>
      <header className="df-head">
        <span className="df-when">{side.when}</span>
        <span className="df-label">{side.label}</span>
      </header>
      <ul className="df-list">
        {side.lines.map(line => {
          const got = line.change && found.includes(line.change)
          return (
            <li key={line.id}>
              <button type="button"
                className={`df-line ${line.kind ? `is-${line.kind}` : ''} ${got ? 'got' : ''}`}
                disabled={done}
                onClick={() => mark(line)}>
                {got && <span className="df-tick" aria-hidden="true">✓</span>}
                {line.meta && <span className="df-meta">{line.meta}</span>}
                <span className="df-text">{line.text}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )

  return (
    <div className="df-root">
      <div className="mp-bar" role="status">
        <span>Found {found.length} / {changes.length}</span>
        <span className="mp-bar-hint">{content.hint ?? 'Mark every line that is not in both captures'}</span>
      </div>

      {narrow ? (
        <div className="df-body df-merged">
          {merged.map(row => (
            <div key={row.key} className="df-row">
              <div className="df-rowmeta">{row.meta}</div>
              {[['before', content.before, row.before], ['after', content.after, row.after]].map(([side, col, line]) => (
                <div key={side} className="df-half">
                  <span className="df-side">{col.when.replace(/^Captured /, '')}</span>
                  {line ? (
                    <button type="button"
                      className={`df-line ${line.change && found.includes(line.change) ? 'got' : ''}`}
                      disabled={done}
                      onClick={() => mark(line)}>
                      {line.change && found.includes(line.change) && <span className="df-tick" aria-hidden="true">✓</span>}
                      <span className="df-text">{line.text}</span>
                    </button>
                  ) : (
                    <span className="df-absent">not in this capture</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="df-body">
          {column(content.before)}
          {column(content.after)}
        </div>
      )}

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
