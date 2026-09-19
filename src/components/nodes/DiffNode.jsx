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

import { useMemo, useState } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { wrongCost } from '../../data/caseData'

export function DiffNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [found, setFound] = useLeadProgress(nodeId, 'found', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const [feedback, setFeedback] = useState(null)

  const changes = useMemo(() => content.changes ?? [], [content.changes])
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
    const next = [...found, line.change]
    setFound(next)
    setFeedback({ type: 'correct', text: change?.feedback ?? 'Changed between the two captures.' })
    triggerDiscovery(changes.every(c => next.includes(c.id)) ? 'major' : 'minor')
  }

  const column = (side) => (
    <section className={`df-col df-${side.id}`} aria-label={`${side.label}, captured ${side.when}`}>
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

      <div className="df-body">
        {column(content.before)}
        {column(content.after)}
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
