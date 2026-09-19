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
// Every markable phrase is a button, so it plays by keyboard and touch.
// ─────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { wrongCost } from '../../data/caseData'

export function PhraseNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [marked, setMarked] = useLeadProgress(nodeId, 'marked', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const [feedback, setFeedback] = useState(null)

  const required = useMemo(
    () => content.posts.flatMap(p => p.parts.filter(x => x.id && x.required).map(x => x.id)),
    [content.posts])
  const done = required.every(id => marked.includes(id))

  const mark = (part) => {
    if (done || marked.includes(part.id)) return
    if (part.required) {
      const next = [...marked, part.id]
      setMarked(next)
      setFeedback({ type: 'correct', text: part.correctFeedback ?? 'Nobody published that.' })
      triggerDiscovery(required.every(id => next.includes(id)) ? 'major' : 'minor')
    } else {
      const nth = wrongCount + 1
      setWrongCount(nth)
      if (activePath) markWrongGuess(activePath, nth)
      setFeedback({
        type: 'wrong',
        text: `${part.wrongFeedback ?? 'That was in the papers the first week.'} (+${wrongCost(nth)} min)`,
      })
    }
  }

  return (
    <div className="ph-root">
      <div className="mp-bar" role="status">
        <span>Marked {marked.filter(id => required.includes(id)).length} / {required.length}</span>
        <span className="mp-bar-hint">{content.hint ?? 'Mark the words that were never made public'}</span>
      </div>

      <div className="ph-body">
        {content.posts.map(post => (
          <article key={post.id} className="ph-post">
            <header className="ph-meta">
              <span className="ph-who">{post.who}</span>
              <span className="ph-when">{post.when}</span>
            </header>
            <p className="ph-text">
              {post.parts.map((part, i) => (
                part.id ? (
                  <button key={i} type="button"
                    className={`ph-mark ${marked.includes(part.id) ? (part.required ? 'hit' : 'miss') : ''}`}
                    disabled={done}
                    aria-label={`Mark the phrase "${part.text}"`}
                    onClick={() => mark(part)}>
                    {part.text}
                  </button>
                ) : <span key={i}>{part.text}</span>
              ))}
            </p>
          </article>
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
