// ─────────────────────────────────────────────────────────────────
// COMPARE LEAD — two documents side by side. Link the detail in one
// to the line in the other that confirms it.
//
// This replaces a second pass over the same photograph with the same
// hotspots. The photograph is still there, but the work is new: hold
// it against a printed record and find where they agree. Pick a detail
// on either side, then its match on the other. A wrong pairing costs
// time, as a wrong flag does.
//
// Everything is a button, so it plays by keyboard and on a phone.
// ─────────────────────────────────────────────────────────────────

import { useMemo, useRef, useState } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { wrongCost } from '../../data/caseData'
import { ScenePlate } from '../board/ScenePlate'

const key = (a, b) => [a, b].sort().join('|')

// A magnified piece of the plate. The detail is read off the picture, not
// handed over as text: the crop box is a percentage rectangle of the photo
// (3:2), and the full plate is scaled up behind it so that box fills it.
function Crop({ crop, plate = 'gallery' }) {
  return (
    <span className="cp-crop" style={{ aspectRatio: `${crop.w * 1.5} / ${crop.h}` }} aria-hidden="true">
      <span className="cp-crop-in" style={{
        width: `${10000 / crop.w}%`, left: `${(-crop.x / crop.w) * 100}%`, top: `${(-crop.y / crop.h) * 100}%`,
      }}>
        <span className="plate"><ScenePlate name={plate} /></span>
      </span>
    </span>
  )
}

export function CompareNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [linked, setLinked] = useLeadProgress(nodeId, 'linked', [])
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const [pick, setPick] = useState(null) // { side: 'left' | 'right', id }
  const [feedback, setFeedback] = useState(null)
  const leftCol = useRef(null)
  const rightCol = useRef(null)

  const valid = useMemo(() => new Map((content.pairs ?? []).map(p => [key(p.left, p.right), p])), [content.pairs])
  const required = useMemo(() => (content.pairs ?? []).filter(p => p.required).map(p => key(p.left, p.right)), [content.pairs])
  const done = required.every(k => linked.includes(k))

  const isLinked = (id) => linked.some(k => k.split('|').includes(id))

  const choose = (side, id) => {
    if (done) return
    if (!pick || pick.side === side) {
      const next = pick?.id === id ? null : { side, id }
      setPick(next)
      setFeedback(null)
      // stacked on a phone, the other side is off screen — bring it up
      if (next && window.matchMedia?.('(max-width: 760px)').matches) {
        (side === 'left' ? rightCol : leftCol).current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      return
    }
    const left = side === 'left' ? id : pick.id
    const right = side === 'right' ? id : pick.id
    const k = key(left, right)
    setPick(null)
    if (linked.includes(k)) {
      setFeedback({ type: 'info', text: 'You have already linked those two.' })
      return
    }
    const pair = valid.get(k)
    if (pair) {
      const next = [...linked, k]
      setLinked(next)
      setFeedback({ type: 'correct', text: pair.feedback })
      triggerDiscovery(required.every(r => next.includes(r)) ? 'major' : 'minor')
    } else {
      const nth = wrongCount + 1
      setWrongCount(nth)
      if (activePath) markWrongGuess(activePath, nth)
      setFeedback({
        type: 'wrong',
        text: `${content.wrongFeedback ?? 'Those two don\'t say the same thing.'} (+${wrongCost(nth)} min)`,
      })
    }
  }

  const found = required.filter(k => linked.includes(k)).length
  const picked = pick
    ? (pick.side === 'left' ? content.left.items : content.right.items).find(i => i.id === pick.id)
    : null

  const item = (side, it) => {
    const on = pick?.side === side && pick.id === it.id
    const done_ = isLinked(it.id)
    return (
      <li key={it.id}>
        <button type="button"
          className={`cp-item ${it.crop ? 'has-crop' : ''} ${on ? 'sel' : ''} ${done_ ? 'linked' : ''} ${pick && pick.side !== side ? 'armed' : ''}`}
          aria-pressed={on}
          disabled={done}
          onClick={() => choose(side, it.id)}>
          {done_ && <span className="cp-tick" aria-hidden="true">✓</span>}
          {it.crop && <Crop crop={it.crop} plate={it.plate ?? content.left.plate} />}
          <span className="cp-k">{it.label}</span>
          {/* a cropped detail is read by eye; its words are there for a screen reader only */}
          <span className={it.crop ? 'sr-only' : 'cp-v'}>{it.text}</span>
        </button>
      </li>
    )
  }

  return (
    <div className="cp-root">
      {/* On a phone the thing you just picked is scrolled off the screen by
          the time you reach the other column — and for a cropped detail its
          words are sr-only, so there was nothing on screen saying what you
          were holding. It travels with you now. */}
      <div className="mp-bar" role="status">
        <span>Confirmed {found} / {required.length}</span>
        {picked ? (
          <span className="cp-pick">
            {picked.crop && <Crop crop={picked.crop} plate={picked.plate ?? content.left.plate} />}
            <span className="cp-pick-t">
              <b>{picked.label}</b>
              <i>{picked.text}</i>
            </span>
            <span className="mp-bar-hint">now its match on the {pick.side === 'left' ? 'right' : 'left'}</span>
          </span>
        ) : (
          <span className="mp-bar-hint">Choose a detail on either side</span>
        )}
      </div>

      <div className="cp-body">
        <section ref={leftCol} className="cp-col cp-photo" aria-label={content.left.title}>
          <h3 className="cp-h">{content.left.title}</h3>
          {content.left.plate && (
            <div className="cp-plate"><ScenePlate name={content.left.plate} /></div>
          )}
          <ul className="cp-list">{content.left.items.map(it => item('left', it))}</ul>
        </section>

        <section ref={rightCol} className="cp-col cp-paper" aria-label={content.right.title}>
          <h3 className="cp-h">{content.right.title}</h3>
          {content.right.kicker && <p className="cp-kicker">{content.right.kicker}</p>}
          <ul className="cp-list">{content.right.items.map(it => item('right', it))}</ul>
        </section>
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
