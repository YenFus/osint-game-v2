import { useState, useRef, useEffect } from 'react'
import { useDiscoveryFeedback } from '../DiscoveryFeedback'
import { useGameStore } from '../../store/gameStore'
import { BUTTON_PRIMARY, HEADER_BAR } from '../../styles/nodeStyles'

export function TagNode({ content, onComplete }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [tagged, setTagged] = useState([])
  const [wrongCount, setWrongCount] = useState(0)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(false)
  const [penaltyActive, setPenaltyActive] = useState(false)
  const feedbackRef = useRef(null)

  const required = new Set(content.requiredTags)
  const correctTagged = tagged.filter(t => required.has(t))

  // Announce feedback to screen readers
  useEffect(() => {
    if (feedback && feedbackRef.current) {
      feedbackRef.current.textContent = feedback.text
    }
  }, [feedback])

  const handleTag = (item) => {
    if (tagged.includes(item.id) || penaltyActive) return

    if (required.has(item.id)) {
      const newTagged = [...tagged, item.id]
      setTagged(newTagged)
      const newCorrect = newTagged.filter(t => required.has(t))
      setFeedback({ type: 'correct', text: item.correctFeedback ?? 'Tagged.' })

      // Trigger discovery feedback based on importance
      const remaining = required.size - newCorrect.length
      if (remaining === 0) {
        triggerDiscovery('major') // Last item found
      } else {
        triggerDiscovery('minor') // Found evidence
      }

      if (newCorrect.length >= required.size) {
        setTimeout(() => setDone(true), 900)
      }
    } else {
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)
      setTagged(prev => [...prev, item.id])

      // Mark that this path is no longer perfect
      if (activePath) {
        markWrongGuess(activePath)
      }

      // Check for penalty (3 wrong guesses in a row)
      if (newWrong % 3 === 0) {
        setPenaltyActive(true)
        setFeedback({ type: 'penalty', text: 'I need to think more carefully about what I\'m looking for...' })
        setTimeout(() => {
          setPenaltyActive(false)
          setFeedback(null)
        }, 1500)
        return
      }

      const useHint = newWrong >= (content.wrongTagLimit ?? 5) && item.hintFeedback
      setFeedback({
        type: 'wrong',
        text: useHint ? item.hintFeedback : (item.wrongFeedback ?? 'Nothing suspicious here. Keep reading.'),
        inline: item.whyWrong // Show inline explanation if available
      })
    }

    setTimeout(() => setFeedback(null), 3200)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }} role="region" aria-label="Evidence tagging task">

      {/* Screen reader live region for feedback */}
      <div ref={feedbackRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      {/* Progress bar */}
      <div style={HEADER_BAR}>
        <span style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }} aria-hidden="true">
          Flagged: {correctTagged.length} / {content.requiredTags.length}
        </span>
        <div
          style={{ flex: 1, height: 1, background: '#1a1a28' }}
          role="progressbar"
          aria-valuenow={correctTagged.length}
          aria-valuemin={0}
          aria-valuemax={content.requiredTags.length}
          aria-label={`Progress: ${correctTagged.length} of ${content.requiredTags.length} items flagged`}
        >
          <div style={{
            height: '100%', background: '#2a5040',
            width: `${(correctTagged.length / content.requiredTags.length) * 100}%`,
            transition: 'width 0.4s ease',
          }} />
        </div>
      </div>

      {/* Item list */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {content.items.map(item => {
          const isTaggedCorrect = tagged.includes(item.id) && required.has(item.id)
          const isTaggedWrong = tagged.includes(item.id) && !required.has(item.id)

          return (
            <div
              key={item.id}
              style={{
                padding: '14px 24px',
                borderBottom: '1px solid #0e0e18',
                borderLeft: isTaggedCorrect ? '2px solid #b8860b' : '2px solid transparent',
                background: isTaggedCorrect ? 'rgba(184,134,11,0.05)' : 'transparent',
                display: 'flex', gap: 16, alignItems: 'flex-start',
                transition: 'all 0.3s',
                position: 'relative',
                animation: isTaggedCorrect ? 'evidenceGlow 0.6s ease-out' : 'none',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                {item.subreddit && (
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
                    color: '#6a90b8', letterSpacing: '0.15em', marginBottom: 6,
                  }}>
                    {item.subreddit}
                  </div>
                )}
                {item.threadTitle && (
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
                    color: '#a0b0c0', marginBottom: 6,
                  }}>
                    {item.threadTitle}
                  </div>
                )}
                {item.username && (
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
                    color: '#7090a8', marginBottom: 6,
                  }}>
                    {item.username}
                  </div>
                )}
                <p style={{
                  fontFamily: item.handwritten ? 'Crimson Pro, serif' : 'Crimson Pro, serif',
                  fontStyle: item.handwritten ? 'italic' : 'normal',
                  fontSize: item.handwritten ? 16 : 15,
                  color: isTaggedWrong ? '#8a8088' : '#d8d0c0',
                  lineHeight: 1.75, margin: 0,
                }}>
                  {item.text}
                </p>
                {item.date && (
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
                    color: '#6a6860', marginTop: 8,
                  }}>
                    {item.date}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
                <button
                  onClick={() => handleTag(item)}
                  disabled={tagged.includes(item.id) || penaltyActive}
                  aria-label={
                    isTaggedCorrect
                      ? `Item flagged as suspicious`
                      : isTaggedWrong
                      ? `Item marked as not suspicious`
                      : `Flag this item as suspicious`
                  }
                  aria-pressed={tagged.includes(item.id)}
                  style={{
                    flexShrink: 0,
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
                    letterSpacing: '0.1em', textTransform: 'uppercase',
                    border: isTaggedCorrect
                      ? '2px solid #d4a84b'
                      : isTaggedWrong
                      ? '1px solid #4a3038'
                      : '2px solid #4a4a58',
                    color: isTaggedCorrect ? '#f0c860' : isTaggedWrong ? '#7a5060' : '#a0a098',
                    background: isTaggedCorrect ? 'rgba(212, 168, 75, 0.1)' : 'none',
                    padding: '8px 16px',
                    cursor: (tagged.includes(item.id) || penaltyActive) ? 'default' : 'pointer',
                    transition: 'all 0.2s',
                    minWidth: 80,
                    minHeight: 44,
                    opacity: penaltyActive ? 0.5 : 1,
                    fontWeight: 500,
                  }}
                  onMouseEnter={e => {
                    if (!tagged.includes(item.id) && !penaltyActive) {
                      e.currentTarget.style.color = '#d0c8a0'
                      e.currentTarget.style.borderColor = '#7a7a88'
                    }
                  }}
                  onMouseLeave={e => {
                    if (!tagged.includes(item.id)) {
                      e.currentTarget.style.color = '#a0a098'
                      e.currentTarget.style.borderColor = '#4a4a58'
                    }
                  }}
                >
                  {isTaggedCorrect ? '✓ Flagged' : isTaggedWrong ? '— Skip' : 'Flag'}
                </button>
                {/* Inline wrong explanation */}
                {isTaggedWrong && item.whyWrong && (
                  <div style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontSize: 12,
                    color: '#8a6070',
                    fontStyle: 'italic',
                    maxWidth: 140,
                    textAlign: 'right',
                  }}>
                    {item.whyWrong}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Feedback toast (visual only, screen reader uses live region above) */}
      {feedback && (
        <div
          style={{
            position: 'absolute', bottom: 80, left: '50%', transform: 'translateX(-50%)',
            background: feedback.type === 'correct' ? '#0c140a' : feedback.type === 'penalty' ? '#0a0a18' : '#140a0c',
            border: `2px solid ${feedback.type === 'correct' ? '#d4a84b' : feedback.type === 'penalty' ? '#6a6ac0' : '#8a4050'}`,
            padding: '14px 24px',
            fontFamily: 'Crimson Pro, serif', fontSize: 15,
            color: feedback.type === 'correct' ? '#f0d060' : feedback.type === 'penalty' ? '#a0a0d0' : '#c07080',
            zIndex: 10,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
            maxWidth: 380,
          }}
          aria-hidden="true"
        >
          <span style={{ flexShrink: 0, fontSize: 18 }}>
            {feedback.type === 'correct' ? '✓' : feedback.type === 'penalty' ? '⏳' : '✗'}
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <span>{feedback.text}</span>
            {feedback.type === 'correct' && (
              <span style={{ fontSize: 13, color: '#d4a84b', animation: 'floatUp 0.6s ease-out forwards', fontWeight: 600 }}>
                +1 Evidence
              </span>
            )}
          </div>
        </div>
      )}

      {/* Completion */}
      {done && (
        <div style={{
          borderTop: '1px solid #1a1a28', padding: '18px 24px',
          background: '#08080c',
        }}>
          {content.completionNote && (
            <p style={{
              fontFamily: 'Crimson Pro, serif', fontStyle: 'italic',
              fontSize: 16, color: '#a09888', lineHeight: 1.7,
              margin: '0 0 16px',
            }}>
              {content.completionNote}
            </p>
          )}
          <button
            onClick={onComplete}
            aria-label="Continue to next section"
            style={BUTTON_PRIMARY}
          >
            Continue →
          </button>
        </div>
      )}

      {/* Footer — not done yet */}
      {!done && (
        <div style={{
          borderTop: '1px solid #1a1a28', padding: '14px 24px',
          fontFamily: 'Crimson Pro, serif', fontSize: 15,
          color: '#908878', fontStyle: 'italic',
        }}>
          Read each entry carefully. Click "Flag" on anything that seems suspicious or out of place.
        </div>
      )}
    </div>
  )
}
