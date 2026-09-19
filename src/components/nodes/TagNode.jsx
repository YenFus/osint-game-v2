import { useState, useRef, useEffect } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { CorkPlate } from '../board/CorkPlate'
import { ScenePlate } from '../board/ScenePlate'
import { BUTTON_PRIMARY, BUTTON_FLAG, BUTTON_FLAG_CORRECT, BUTTON_FLAG_WRONG, HEADER_BAR } from '../../styles/nodeStyles'
import { wrongCost } from '../../data/caseData'


// Pick an illustration for a pinned photo from its description
// "[Photo — Lena's Instagram…]" → "Lena's Instagram…"
function caption(text) {
  return text.replace(/^\[(Photo|Detail)\s*—\s*/, '').replace(/\]$/, '')
}


// The photo itself carries the evidence: a banner on the back wall, a
// sign on his table, the clock on the wall. At full size the
// small ones are illegible — you have to zoom, like Maya did.
// Where a hotspot sits, in words, so eight unexamined spots don't all
// read out as the same button.
function whereOnPlate({ x, y, w, h }) {
  const cx = x + w / 2, cy = y + h / 2
  const col = cx < 34 ? 'left' : cx > 66 ? 'right' : 'centre'
  const row = cy < 34 ? 'top' : cy > 66 ? 'bottom' : 'middle'
  return row === 'middle' && col === 'centre' ? 'the centre' : row === 'middle' ? `the middle ${col}` : `the ${row} ${col === 'centre' ? 'centre' : col}`
}

function PhotoPlate({ content, items, tagged, required, examined, focusId, onExamine, interactive }) {
  return (
    <div className="plate">
      {/* a plate is either a photograph or a drawn surface; both magnify */}
      {content.plate === 'cork' ? <CorkPlate /> : <ScenePlate name={content.plate} />}
      {interactive && items.filter(i => i.spot).map((item, n, spots) => {
        const isTaggedCorrect = tagged.includes(item.id) && required.has(item.id)
        const seen = examined.includes(item.id)
        return (
          <button
            key={item.id}
            className={`hotspot ${isTaggedCorrect ? 'flagged' : ''} ${focusId === item.id ? 'focus' : ''} ${seen ? 'seen' : ''}`}
            aria-label={seen ? caption(item.text) : `Examine spot ${n + 1} of ${spots.length}, ${whereOnPlate(item.spot)} of the ${content.plate === 'cork' ? 'board' : 'photo'}`}
            onClick={() => onExamine(item)}
            style={{ left: `${item.spot.x}%`, top: `${item.spot.y}%`, width: `${item.spot.w}%`, height: `${item.spot.h}%` }}
          />
        )
      })}
    </div>
  )
}

export function TagNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [tagged, setTagged] = useLeadProgress(nodeId, 'tagged', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const [examined, setExamined] = useLeadProgress(nodeId, 'examined', [])
  const [focusId, setFocusId] = useState(null)
  const zoomRef = useRef(null)
  const [feedback, setFeedback] = useState(null)
  const [done, setDone] = useState(() => content.requiredTags.every(t => tagged.includes(t)))
  const [penaltyActive, setPenaltyActive] = useState(false)
  const feedbackRef = useRef(null)

  const required = new Set(content.requiredTags)
  const correctTagged = tagged.filter(t => required.has(t))
  const hotspotMode = !!content.plate && content.items.some(i => i.spot)

  useEffect(() => {
    if (feedback && feedbackRef.current) feedbackRef.current.textContent = feedback.text
  }, [feedback])

  const handleTag = (item) => {
    if (tagged.includes(item.id) || penaltyActive) return

    if (required.has(item.id)) {
      const newTagged = [...tagged, item.id]
      setTagged(newTagged)
      const remaining = required.size - newTagged.filter(t => required.has(t)).length
      setFeedback({ type: 'correct', text: item.correctFeedback ?? 'Tagged.' })
      triggerDiscovery(remaining === 0 ? 'major' : 'minor')
      if (remaining === 0) setTimeout(() => setDone(true), 900)
    } else {
      const newWrong = wrongCount + 1
      setWrongCount(newWrong)
      setTagged(prev => [...prev, item.id])
      if (activePath) markWrongGuess(activePath, newWrong)

      // Every wrong flag names its price. The third one is the most
      // expensive and used to be the only one that said nothing.
      const cost = `(+${wrongCost(newWrong)} min)`
      if (newWrong % 3 === 0) {
        setPenaltyActive(true)
        setFeedback({ type: 'penalty', text: `I need to think more carefully about what I'm looking for. ${cost}` })
        setTimeout(() => { setPenaltyActive(false); setFeedback(null) }, 2600)
        return
      }
      setFeedback({ type: 'wrong', text: `${item.wrongFeedback ?? 'Nothing suspicious here. Keep reading.'} ${cost}` })
    }
    setTimeout(() => setFeedback(null), 3600)
  }

  const examine = (item) => {
    setFocusId(item.id)
    if (!examined.includes(item.id)) setExamined(prev => [...prev, item.id])
    // The zoom sits under the plate on a narrow screen. It used to be
    // scrolled to, which pushed the photograph off the top of the screen —
    // you could see the detail or the picture it came from, never both.
    // The plate stays put now and the zoom comes to meet it.
  }

  const flagButton = (item) => {
    const isTaggedCorrect = tagged.includes(item.id) && required.has(item.id)
    const isTaggedWrong = tagged.includes(item.id) && !required.has(item.id)
    return (
      <button
        onClick={() => handleTag(item)}
        disabled={tagged.includes(item.id) || penaltyActive}
        aria-label={isTaggedCorrect ? 'Item flagged as suspicious' : isTaggedWrong ? 'Item marked as not suspicious' : 'Flag this item as suspicious'}
        aria-pressed={tagged.includes(item.id)}
        style={{
          ...(isTaggedCorrect ? BUTTON_FLAG_CORRECT : isTaggedWrong ? BUTTON_FLAG_WRONG : BUTTON_FLAG),
          opacity: penaltyActive ? 0.5 : 1,
          cursor: (tagged.includes(item.id) || penaltyActive) ? 'default' : 'pointer',
        }}
      >
        {isTaggedCorrect ? '✓ Flagged' : isTaggedWrong ? '— Skip' : 'Flag'}
      </button>
    )
  }

  const row = (item) => {
    const isTaggedCorrect = tagged.includes(item.id) && required.has(item.id)
    const isTaggedWrong = tagged.includes(item.id) && !required.has(item.id)
    return (
      <div
        key={item.id}
        style={{
          padding: 'clamp(10px, 2vw, 12px) clamp(14px, 4vw, 24px)',
          borderBottom: '1px solid #0e0e18',
          borderLeft: isTaggedCorrect ? '2px solid #b8860b' : focusId === item.id ? '2px solid #6a90b8' : '2px solid transparent',
          background: isTaggedCorrect ? 'rgba(184,134,11,0.05)' : 'transparent',
          display: 'flex', gap: 16, alignItems: 'flex-start',
          animation: isTaggedCorrect ? 'evidenceGlow 0.6s ease-out' : 'none',
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {item.username && (
            <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#7090a8', marginBottom: 4 }}>{item.username}</div>
          )}
          <p style={{
            fontFamily: 'Crimson Pro, serif', fontStyle: item.handwritten ? 'italic' : 'normal',
            fontSize: 15, color: isTaggedWrong ? '#8a8088' : '#d8d0c0', lineHeight: 1.55, margin: 0,
          }}>
            {hotspotMode ? caption(item.text) : item.text}
          </p>
        </div>
        {flagButton(item)}
      </div>
    )
  }

  const focused = content.items.find(i => i.id === focusId)
  // In the photo, the zoomed-in card already shows the focused detail
  const listItems = hotspotMode ? [] : content.items
  const examinedChips = hotspotMode
    ? examined.filter(id => id !== focusId).map(id => content.items.find(i => i.id === id)).filter(Boolean)
    : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%', position: 'relative' }} role="region" aria-label="Evidence tagging task">
      <div ref={feedbackRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      <div style={HEADER_BAR}>
        <span style={{ letterSpacing: '0.15em', textTransform: 'uppercase' }} aria-hidden="true">
          Flagged: {correctTagged.length} / {content.requiredTags.length}
        </span>
        <div style={{ flex: 1, height: 2, background: '#1a1a28' }} role="progressbar"
          aria-label={`Flagged ${correctTagged.length} of ${content.requiredTags.length}`}
          aria-valuenow={correctTagged.length} aria-valuemin={0} aria-valuemax={content.requiredTags.length}>
          <div style={{ height: '100%', background: '#b8860b', width: `${(correctTagged.length / content.requiredTags.length) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '12px 0' }}>
        {hotspotMode && (
          <div className="photo-lead">
            <div className="photo-main">
              <PhotoPlate
                content={content} items={content.items} tagged={tagged} required={required}
                examined={examined} focusId={focusId} onExamine={examine} interactive
              />
              {/* This used to restate the objective the lead header already
                  prints verbatim, and the footer printed it a third time.
                  It reports progress instead — the one thing neither says. */}
              <p className="photo-hint hand">
                {examined.length} of {content.items.length} details examined
                {correctTagged.length > 0 ? ` · ${correctTagged.length} flagged` : ''}.
              </p>
            </div>

            <div className="photo-side" ref={zoomRef}>
              {focused ? (
                <>
                  <div className="zoomwin">
                    {/* Keep the magnified view inside the photograph. Centring
                        on a detail near an edge used to pan past the frame and
                        fill a third of the panel with black. */}
                    {(() => {
                      const zoom = 3.2
                      const half = 50 / zoom
                      const clamp = (v) => Math.min(100 - half, Math.max(half, v))
                      const cx = clamp(focused.spot.x + focused.spot.w / 2)
                      const cy = clamp(focused.spot.y + focused.spot.h / 2)
                      return (
                        <div
                          className="zoominner"
                          style={{
                            transformOrigin: `${cx}% ${cy}%`,
                            transform: `translate(${50 - cx}%, ${50 - cy}%) scale(var(--zoom, 3.2))`,
                          }}
                        >
                          <PhotoPlate content={content} items={content.items} tagged={tagged} required={required} examined={examined} focusId={null} onExamine={() => {}} />
                        </div>
                      )
                    })()}
                    <span className="zoomlabel">3.2× · {focused.id.toUpperCase()}</span>
                  </div>
                  <div className="zoomcard">
                    <div className="k">What you're looking at</div>
                    <p>{caption(focused.text)}</p>
                    {flagButton(focused)}
                  </div>
                </>
              ) : (
                // An empty right rail used to be a 425×160 box with one
                // sentence in it, floating in a column twice its height.
                // It is a loupe lying on the desk waiting to be used.
                <div className="zoomwin empty loupe">
                  <span className="loupe-glass" aria-hidden="true" />
                  <span className="hand">Nothing under the glass yet.</span>
                  <span className="loupe-sub">3.2× · ready</span>
                </div>
              )}

              {/* What you have already put under the glass. These were a row
                  of bare ids — "CA-01", "CB-TIME" — sitting under the photo;
                  they carry their own caption now and live in the rail, so
                  it is a list of what you have seen rather than a void. */}
              {examinedChips.length > 0 && (
                <div className="seen-list">
                  <div className="seen-h">Already under the glass</div>
                  {examinedChips.map(it => {
                    const ok = tagged.includes(it.id) && required.has(it.id)
                    const no = tagged.includes(it.id) && !required.has(it.id)
                    return (
                      <button key={it.id} onClick={() => examine(it)}
                        className={`seen-chip ${ok ? 'ok' : no ? 'no' : ''}`}
                        aria-label={`Look again at ${caption(it.text).slice(0, 60)}`}>
                        <span className="seen-mark" aria-hidden="true">{ok ? '✓' : no ? '—' : '·'}</span>
                        <span className="seen-cap">{caption(it.text)}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        )}


        {listItems.map(row)}
      </div>

      {feedback && (
        <div
          style={{
            position: 'absolute', bottom: 90, left: '50%', transform: 'translateX(-50%)',
            background: feedback.type === 'correct' ? '#0c140a' : feedback.type === 'penalty' ? '#0a0a18' : '#140a0c',
            border: `2px solid ${feedback.type === 'correct' ? '#d4a84b' : feedback.type === 'penalty' ? '#6a6ac0' : '#8a4050'}`,
            padding: '12px 18px', fontFamily: 'Crimson Pro, serif', fontSize: 15,
            color: feedback.type === 'correct' ? '#f0d060' : feedback.type === 'penalty' ? '#a0a0d0' : '#e09090',
            zIndex: 10, display: 'flex', alignItems: 'flex-start', gap: 10, width: 'min(420px, calc(100vw - 32px))',
          }}
          aria-hidden="true"
        >
          <span style={{ flexShrink: 0, fontSize: 18 }}>{feedback.type === 'correct' ? '✓' : feedback.type === 'penalty' ? '!' : '✗'}</span>
          <span>{feedback.text}</span>
        </div>
      )}

      {done ? (
        <div style={{ borderTop: '1px solid #1a1a28', padding: '18px 24px 24px', background: '#08080c', flexShrink: 0 }}>
          {content.completionNote && (
            <p style={{ fontFamily: 'Crimson Pro, serif', fontStyle: 'italic', fontSize: 16, color: '#a09888', lineHeight: 1.7, margin: '0 0 16px' }}>
              {content.completionNote}
            </p>
          )}
          <button onClick={onComplete} aria-label="Continue to next section" style={BUTTON_PRIMARY}>Continue →</button>
        </div>
      ) : (
        <div style={{ borderTop: '1px solid #1a1a28', padding: '12px 24px 16px', fontFamily: 'Crimson Pro, serif', fontSize: 15, color: '#908878', fontStyle: 'italic', flexShrink: 0 }}>
          {/* The objective is printed at the top of the lead. All this line
              owes the player is the price of being wrong. */}
          The first wrong flag costs 15 minutes. Every one after that costs 30.
        </div>
      )}
    </div>
  )
}
