import { useState, useRef, useEffect } from 'react'
import { HEADER_BAR } from '../../styles/nodeStyles'

export function ConnectNode({ content, onComplete }) {
  const [selected, setSelected] = useState(null)
  const [connections, setConnections] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [finishing, setFinishing] = useState(false)
  const feedbackRef = useRef(null)

  // Announce feedback to screen readers
  useEffect(() => {
    if (feedback && feedbackRef.current) {
      feedbackRef.current.textContent = feedback.text
    }
  }, [feedback])

  const required = content.requiredConnections

  const isConnected = (a, b) => connections.some(c =>
    (c.from === a && c.to === b) || (c.from === b && c.to === a)
  )

  const isInAnyConnection = (id) => connections.some(c => c.from === id || c.to === id)

  const handleCardClick = (cardId) => {
    if (finishing) return

    if (!selected) {
      setSelected(cardId)
      return
    }
    if (selected === cardId) {
      setSelected(null)
      return
    }

    const match = required.find(r =>
      (r.from === selected && r.to === cardId) ||
      (r.from === cardId && r.to === selected)
    )

    if (match && isConnected(selected, cardId)) {
      setFeedback({ type: 'info', text: 'Already connected.' })
      setSelected(null)
    } else if (match) {
      const newConn = { from: selected, to: cardId, label: match.label }
      const newConns = [...connections, newConn]
      setConnections(newConns)
      setFeedback({ type: 'correct', text: match.label })
      setSelected(null)

      if (newConns.length >= required.length) {
        setFinishing(true)
        setTimeout(onComplete, 1400)
      }
    } else {
      setFeedback({ type: 'wrong', text: content.wrongFeedback ?? 'No direct connection between these two. Try a different pair.' })
      setSelected(null)
    }

    setTimeout(() => setFeedback(null), 3000)
  }

  const connectedCount = connections.length
  const total = required.length

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }} role="region" aria-label="Evidence connection task">

      {/* Screen reader live region for feedback */}
      <div ref={feedbackRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      {/* Header */}
      <div style={{
        ...HEADER_BAR,
        justifyContent: 'space-between',
      }}>
        <span>Connect the evidence</span>
        <span>{connectedCount} / {total} links established</span>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Instruction */}
        <p style={{
          fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
          color: '#5a5248', letterSpacing: '0.1em', lineHeight: 1.6,
          margin: 0,
        }}>
          Click two cards to draw a connection between them. Read each card carefully — not all pairs connect directly.
        </p>

        {/* Cards grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(content.cards.length, 3)}, 1fr)`,
          gap: 12,
        }}>
          {content.cards.map(card => {
            const isSelected = selected === card.id
            const isLinked = isInAnyConnection(card.id)

            return (
              <div
                key={card.id}
                onClick={() => handleCardClick(card.id)}
                style={{
                  border: isSelected
                    ? '1px solid #4a90d9'
                    : isLinked
                    ? '1px solid #2a5040'
                    : '1px solid #1e1e2a',
                  background: isSelected
                    ? '#08101a'
                    : isLinked
                    ? '#08100c'
                    : '#0a0a12',
                  padding: '14px 16px',
                  cursor: finishing ? 'default' : 'pointer',
                  transition: 'all 0.2s',
                  outline: isSelected ? '1px solid rgba(74,144,217,0.3)' : 'none',
                  outlineOffset: 2,
                }}
                onMouseEnter={e => {
                  if (!isSelected && !finishing) {
                    e.currentTarget.style.borderColor = '#3a4060'
                  }
                }}
                onMouseLeave={e => {
                  if (!isSelected) {
                    e.currentTarget.style.borderColor = isLinked ? '#2a5040' : '#1e1e2a'
                  }
                }}
              >
                <div style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
                  color: isSelected ? '#6a9ad9' : isLinked ? '#5a9060' : '#8a8890',
                  marginBottom: 6, transition: 'color 0.2s',
                }}>
                  {card.label}
                </div>
                <div style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
                  color: '#4a4a58', lineHeight: 1.6,
                }}>
                  {card.details}
                </div>
                {isSelected && (
                  <div style={{
                    marginTop: 8,
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 8,
                    color: '#4a70a0', letterSpacing: '0.2em',
                  }}>
                    ▸ selected — click another card
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Established connections */}
        {connections.length > 0 && (
          <div>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
              color: '#3a5040', letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              Links established:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {connections.map((c, i) => {
                const fromCard = content.cards.find(card => card.id === c.from)
                const toCard = content.cards.find(card => card.id === c.to)
                return (
                  <div key={i} style={{
                    fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
                    color: '#4a6a50', lineHeight: 1.6,
                    paddingLeft: 12, borderLeft: '1px solid #1a3028',
                  }}>
                    {fromCard?.label} ↔ {toCard?.label}
                    <span style={{ color: '#2a4a38', marginLeft: 8 }}>— {c.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div
            role="alert"
            style={{
              padding: '10px 16px',
              background: feedback.type === 'correct' ? '#0a120c' : feedback.type === 'wrong' ? '#120a0c' : '#0c0c14',
              border: `1px solid ${feedback.type === 'correct' ? '#2a5040' : feedback.type === 'wrong' ? '#4a2030' : '#2a2a40'}`,
              fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
              color: feedback.type === 'correct' ? '#6a9070' : feedback.type === 'wrong' ? '#8a4050' : '#5a5a7a',
              letterSpacing: '0.1em',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span aria-hidden="true">
              {feedback.type === 'correct' ? '✓' : feedback.type === 'wrong' ? '✗' : 'ℹ'}
            </span>
            <span>{feedback.text}</span>
          </div>
        )}

        {finishing && content.completionNote && (
          <div style={{
            fontFamily: 'Crimson Pro, serif', fontStyle: 'italic',
            fontSize: 13, color: '#7a7268', lineHeight: 1.7,
          }}>
            {content.completionNote}
          </div>
        )}
      </div>
    </div>
  )
}
