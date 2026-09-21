import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { HEADER_BAR } from '../../styles/nodeStyles'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { wrongCost } from '../../data/caseData'
import { useDiscoveryFeedback } from '../discoveryContext'

export function ConnectNode({ content, onComplete, nodeId = null }) {
  const markWrongGuess = useGameStore(s => s.markWrongGuess)
  const activePath = useGameStore(s => s.activePath)
  const { triggerDiscovery } = useDiscoveryFeedback()
  const [selected, setSelected] = useState(null)
  const [connections, setConnections] = useState([])
  const [feedback, setFeedback] = useState(null)
  const [finishing, setFinishing] = useState(false)
  // Wrong pairings escalate like wrong flags do. Persisted per lead:
  // as plain useState, stepping back to the board and reopening reset the
  // ladder, so every wrong link cost the first-offence 15 minutes forever.
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const feedbackRef = useRef(null)

  // ── The yarn ────────────────────────────────────────────────────
  // This lead is called "draw a connection" in a game whose whole visual
  // language is pins and red string, and it used to draw nothing at all:
  // five flat boxes and four hundred pixels of black under them. Cards are
  // pinned to cork now, and every established link is a real length of
  // yarn between the two pins.
  const boardRef = useRef(null)
  const cardRefs = useRef(new Map())
  const [yarn, setYarn] = useState([])

  const measureYarn = useCallback(() => {
    const board = boardRef.current
    if (!board) return
    const b = board.getBoundingClientRect()
    const pinOf = (id) => {
      const el = cardRefs.current.get(id)
      if (!el) return null
      const r = el.getBoundingClientRect()
      return { x: r.x - b.x + r.width / 2, y: r.y - b.y + 2 }
    }
    setYarn(connections.map(c => {
      const a = pinOf(c.from), z = pinOf(c.to)
      if (!a || !z) return null
      const dx = z.x - a.x
      let mx = (a.x + z.x) / 2, my = (a.y + z.y) / 2
      if (Math.abs(dx) < 60) {
        // stacked (one column, or the same column on a phone): bow the
        // string out past the card edge instead of ruling a line down
        // through the text of whatever sits between them
        mx -= Math.max(70, b.width * 0.32)
      } else {
        // a real string sags; the mid-point drops with the span
        my += Math.min(26, Math.abs(dx) * 0.07 + 8)
      }
      return { d: `M${a.x} ${a.y} Q${mx} ${my} ${z.x} ${z.y}`, key: `${c.from}-${c.to}` }
    }).filter(Boolean))
  }, [connections])

  useLayoutEffect(() => { measureYarn() }, [measureYarn])
  useEffect(() => {
    const ro = new ResizeObserver(() => measureYarn())
    if (boardRef.current) ro.observe(boardRef.current)
    window.addEventListener('resize', measureYarn)
    return () => { ro.disconnect(); window.removeEventListener('resize', measureYarn) }
  }, [measureYarn])

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
      triggerDiscovery(newConns.length >= required.length ? 'major' : 'minor')

      if (newConns.length >= required.length) {
        setFinishing(true)
        setTimeout(onComplete, 1400)
      }
    } else {
      setFeedback({ type: 'wrong', text: `${content.wrongFeedback ?? 'No direct connection between these two. Try a different pair.'} (+${wrongCost(wrongCount + 1)} min)` })
      setSelected(null)
      setWrongCount(wrongCount + 1)
      markWrongGuess(activePath, wrongCount + 1)
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

      <div className="cb-cork cx-cork" style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <div style={{ position: 'relative', zIndex: 3, display: 'flex', flexDirection: 'column', gap: 18 }}>

        {/* Instruction */}
        <p className="hand" style={{ fontSize: 22, color: '#fbeed4', textShadow: '0 2px 4px #000', margin: 0, lineHeight: 1.35 }}>
          {content.boardHint ?? 'Some of these cards share a fact. Tap one, then tap the card it matches.'}
        </p>

        {/* Cards pinned to the cork, yarn strung between the pins */}
        <div ref={boardRef} className="cx-board">
          <svg className="cb-yarn" aria-hidden="true" style={{ zIndex: 4 }}>
            {yarn.map(y => <path key={y.key} className="yarn yarn-closed" d={y.d} />)}
          </svg>
          {content.cards.map(card => {
            const isSelected = selected === card.id
            const isLinked = isInAnyConnection(card.id)

            return (
              <button
                type="button"
                key={card.id}
                ref={el => { if (el) cardRefs.current.set(card.id, el); else cardRefs.current.delete(card.id) }}
                onClick={() => handleCardClick(card.id)}
                disabled={finishing}
                aria-pressed={isSelected}
                aria-label={`${card.label} — ${card.details}${isLinked ? ' (already linked)' : ''}`}
                className={`cx-card ${isSelected ? 'sel' : ''} ${isLinked ? 'linked' : ''}`}
                style={{ '--tilt': `${((card.id.charCodeAt(0) + card.id.length * 7) % 9) - 4}deg` }}
              >
                <span className={`pin ${isLinked ? '' : 'gold'}`} />
                <div className="cx-label">{card.label}</div>
                <div className="cx-detail">{card.details}</div>
                {isSelected && <div className="cx-sel">▸ selected — now pick its pair</div>}
              </button>
            )
          })}
        </div>

        {/* Established connections */}
        {connections.length > 0 && (
          <div className="cx-links">
            <div className="cx-links-h">What the string says</div>
            {connections.map((c, i) => {
              const fromCard = content.cards.find(card => card.id === c.from)
              const toCard = content.cards.find(card => card.id === c.to)
              return (
                <div key={i} className="cx-link">
                  <span className="cx-link-pair">{fromCard?.label} ↔ {toCard?.label}</span>
                  <span className="cx-link-say">{c.label}</span>
                </div>
              )
            })}
          </div>
        )}

        {/* Feedback. A correct link already says itself twice — as yarn
            and as the index card under it — so only misses speak here. */}
        {feedback && feedback.type !== 'correct' && (
          <div role="alert" className={`cx-fb cx-fb-${feedback.type}`}>
            <span aria-hidden="true">{feedback.type === 'correct' ? '✓' : feedback.type === 'wrong' ? '✗' : '·'}</span>
            <span>{feedback.text}</span>
          </div>
        )}

        {finishing && content.completionNote && (
          <p className="cx-done">{content.completionNote}</p>
        )}
        </div>
      </div>
    </div>
  )
}
