// ─────────────────────────────────────────────────────────────────
// TIMELINE LEAD — put photographs on the hours they were taken, and
// see what those hours overlap.
//
// Each day is a strip of two-hour slots. The hours that matter to the
// case are shaded on the strip with what happened in them. Pick a
// photograph, then a slot. When the photographs are placed, the strip
// shows at a glance whether someone could have been where the case
// needs them to be.
//
// Slots are buttons, so this plays with a keyboard and on a phone.
// ─────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { wrongCost } from '../../data/caseData'
import { plateSrc } from '../../data/photoPlates'

const SLOT_HOURS = 2

function slotOf(hour) {
  return Math.floor(hour / SLOT_HOURS) * SLOT_HOURS
}

function clock(h) {
  const hr = ((h + 11) % 12) + 1
  return `${hr}${h < 12 || h === 24 ? 'am' : 'pm'}`
}

export function TimelineNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [placed, setPlaced] = useLeadProgress(nodeId, 'placed', {})
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const [selectedId, setSelectedId] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const required = useMemo(() => content.photos.filter(p => p.required).map(p => p.id), [content.photos])
  const done = required.every(id => placed[id])
  const selected = content.photos.find(p => p.id === selectedId) ?? null
  const slots = useMemo(() => Array.from({ length: 24 / SLOT_HOURS }, (_, i) => i * SLOT_HOURS), [])

  const windowAt = (day, start) =>
    (content.windows ?? []).find(w => w.day === day && start < w.to && start + SLOT_HOURS > w.from)

  const handleSlot = (day, start) => {
    if (!selected) {
      setFeedback({ type: 'info', text: 'Pick a photograph first, then the hour it was taken.' })
      return
    }
    const right = selected.day === day && slotOf(selected.hour) === start
    // the tempting wrong readings — the upload time, the unconverted clock —
    // get told apart from a plain miss, so the player learns what fooled them
    const trap = (selected.traps ?? []).find(t => t.day === day && slotOf(t.hour) === start)
    if (right) {
      const next = { ...placed, [selected.id]: `${day}:${start}` }
      setPlaced(next)
      setFeedback({ type: 'correct', text: selected.correctFeedback ?? 'That is when it was taken.' })
      setSelectedId(null)
      triggerDiscovery(required.every(id => next[id]) ? 'major' : 'minor')
    } else {
      const nth = wrongCount + 1
      setWrongCount(nth)
      if (activePath) markWrongGuess(activePath, nth)
      setFeedback({
        type: 'wrong',
        text: `${trap?.feedback ?? selected.wrongFeedback ?? 'Read the time it was taken again — and which day.'} (+${wrongCost(nth)} min)`,
      })
    }
  }

  const placedCount = required.filter(id => placed[id]).length

  return (
    <div className="tl-root">
      <div className="mp-bar" role="status">
        <span>Placed {placedCount} / {required.length}</span>
        <span className="mp-bar-hint">{selected ? 'Now choose the two-hour block it falls in' : 'Choose a photograph'}</span>
      </div>

      <div className="tl-body">
        <div className="tl-side">
        {content.note && <p className="tl-note">{content.note}</p>}
        <ul className="tl-photos" aria-label="Photographs">
          {content.photos.map(p => {
            const at = placed[p.id]
            const src = plateSrc(p.filename)
            return (
              <li key={p.id}>
                <button type="button"
                  className={`mp-photo ${selectedId === p.id ? 'sel' : ''} ${at ? 'done' : ''}`}
                  aria-pressed={selectedId === p.id}
                  disabled={!!at || done}
                  onClick={() => { setSelectedId(p.id); setFeedback(null) }}
                  aria-label={`${p.filename}, uploaded ${p.uploaded}, camera time ${p.exif}${at ? ', already placed' : ''}`}>
                  <span className="thumb">{src && <img src={src} alt="" />}</span>
                  <span className="meta">
                    <span className="fn">{p.filename}</span>
                    <span className="up">Uploaded {p.uploaded}</span>
                    <span className="exif">EXIF {p.exif}</span>
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
        </div>

        <div className="tl-days">
          {content.days.map(day => (
            <section key={day.id} className="tl-day" aria-label={day.label}>
              <h3 className="tl-day-h">{day.label}</h3>
              <div className="tl-strip">
                {slots.map(start => {
                  const win = windowAt(day.id, start)
                  const here = content.photos.filter(p => placed[p.id] === `${day.id}:${start}`)
                  return (
                    <button key={start} type="button"
                      className={`tl-slot ${win ? 'win' : ''} ${here.length ? 'has' : ''} ${selected ? 'armed' : ''}`}
                      disabled={done}
                      onClick={() => handleSlot(day.id, start)}
                      aria-label={`${day.label}, ${clock(start)} to ${clock(start + SLOT_HOURS)}${win ? `, ${win.label}` : ''}${here.length ? `, ${here.length} placed` : ''}`}>
                      <span className="tl-hour">{clock(start)}–{clock(start + SLOT_HOURS)}</span>
                      {here.map(p => (
                        <span key={p.id} className="tl-pin">
                          {plateSrc(p.filename) && <img src={plateSrc(p.filename)} alt="" />}
                        </span>
                      ))}
                    </button>
                  )
                })}
              </div>
              {(content.windows ?? []).filter(w => w.day === day.id).map(w => (
                <p key={w.label} className="tl-window-note">
                  <span className="sw" aria-hidden="true" /> {clock(w.from)}–{clock(w.to)} · {done ? w.label : 'hours the case needs accounted for'}
                </p>
              ))}
              {/* the hours you are placing photographs against, on the page
                  rather than in a hint — and the quarter-panel of blank that
                  used to sit under each strip is where they go */}
              {day.facts && (
                <ol className="tl-facts">
                  {day.facts.map(f => (
                    <li key={f.at}><span className="tl-at">{f.at}</span><span className="tl-fact">{f.text}</span></li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>
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
