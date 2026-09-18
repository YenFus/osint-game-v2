// ─────────────────────────────────────────────────────────────────
// MAP LEAD — geolocation. Read a photograph's GPS coordinates and put
// it where it was taken.
//
// Pick a photo, then the spot where its coordinates cross. The spots are
// unmarked until something is placed on them. Every spot is a real button, so the
// lead plays the same with a mouse, a finger or a keyboard. The map is
// two sheets with their own lat/long grids — the city, and one small
// town forty miles south — because a single scale can't show both a
// river forty miles away and two doors on the same street.
//
// The lead is done when the photographs that matter are placed. Which
// ones matter is the player's call: it is written in their dates.
// ─────────────────────────────────────────────────────────────────

import { useMemo, useState } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { wrongCost } from '../../data/caseData'
import { plateSrc } from '../../data/photoPlates'

// Where a coordinate sits on its sheet, as a percentage of the sheet.
function position(sheet, lat, lon) {
  const x = (lon - sheet.lon[0]) / (sheet.lon[1] - sheet.lon[0])
  const y = (sheet.lat[1] - lat) / (sheet.lat[1] - sheet.lat[0])
  return { x: x * 100, y: y * 100 }
}

function ticks([from, to], step) {
  const out = []
  const first = Math.ceil(from / step) * step
  for (let v = first; v <= to + 1e-9; v += step) out.push(+v.toFixed(6))
  return out
}

const fmtLat = (v) => `${Math.abs(v).toFixed(4)}° ${v >= 0 ? 'N' : 'S'}`
const fmtLon = (v) => `${Math.abs(v).toFixed(4)}° ${v >= 0 ? 'E' : 'W'}`


// Which grid square a marker sits in, said the way the lines on the sheet say
// it: between one ruling and the next.
function cellOf(sheet, pl) {
  const lo = (v, step) => Math.floor(v / step) * step
  const la0 = lo(pl.lat, sheet.tick.lat), lo0 = lo(pl.lon, sheet.tick.lon)
  const dp = sheet.tick.dp
  return `${la0.toFixed(dp)} to ${(la0 + sheet.tick.lat).toFixed(dp)} north, ` +
    `${Math.abs(lo0 + sheet.tick.lon).toFixed(dp)} to ${Math.abs(lo0).toFixed(dp)} west`
}

function Sheet({ sheet, places, placedHere, selected, disabled, onPlace, landmarks }) {
  // lines on the very edge have nowhere to put their label
  const margin = (r) => Math.abs(r[1] - r[0]) * 0.06
  const inner = (r) => (v) => v > Math.min(...r) + margin(r) && v < Math.max(...r) - margin(r)
  const latTicks = ticks(sheet.lat, sheet.tick.lat).filter(inner(sheet.lat))
  const lonTicks = ticks(sheet.lon, sheet.tick.lon).filter(inner(sheet.lon))
  return (
    <figure className="mp-sheet" aria-label={`${sheet.label} map`}>
      <figcaption className="mp-title">{sheet.label}</figcaption>
      <div className="mp-surface">
        {/* the grid is what you read coordinates against */}
        {latTicks.map(t => {
          const { y } = position(sheet, t, sheet.lon[0])
          return (
            <div key={`la${t}`} className="mp-grid h" style={{ top: `${y}%` }} aria-hidden="true">
              <span>{t.toFixed(sheet.tick.dp)}°N</span>
            </div>
          )
        })}
        {lonTicks.map(t => {
          const { x } = position(sheet, sheet.lat[1], t)
          return (
            <div key={`lo${t}`} className="mp-grid v" style={{ left: `${x}%` }} aria-hidden="true">
              <span>{Math.abs(t).toFixed(sheet.tick.dp)}°W</span>
            </div>
          )
        })}

        {sheet.river && (
          <svg className="mp-river" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            <path d={sheet.river} />
          </svg>
        )}

        {landmarks.map(l => {
          const { x, y } = position(sheet, l.lat, l.lon)
          return (
            <div key={l.id} className="mp-landmark" style={{ left: `${x}%`, top: `${y}%` }}>
              <span className="dot" aria-hidden="true" />
              <span className="lbl">{l.label}</span>
            </div>
          )
        })}

        {places.map(pl => {
          const { x, y } = position(sheet, pl.lat, pl.lon)
          const pins = placedHere(pl.id)
          return (
            <button key={pl.id} type="button"
              className={`mp-place ${selected ? 'armed' : ''} ${pins.length ? 'has' : ''} ${x < 14 ? 'edge-l' : x > 86 ? 'edge-r' : ''}`}
              style={{ left: `${x}%`, top: `${y}%` }}
              disabled={disabled}
              onClick={() => onPlace(pl.id)}
              aria-label={`${pins.length ? pl.label : 'Unmarked spot'} in the square ${cellOf(sheet, pl)}${pins.length ? `, ${pins.length} placed here` : ''}`}>
              <span className="ring" aria-hidden="true" />
              {/* a spot is only named once a photograph has put you there */}
              {pins.length > 0 && <span className="lbl">{pl.label}</span>}
              {pins.map(p => <span key={p.id} className="pin-time">{p.pinLabel}</span>)}
            </button>
          )
        })}
      </div>
    </figure>
  )
}

export function MapNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [placed, setPlaced] = useLeadProgress(nodeId, 'placed', {})
  const [wrongCount, setWrongCount] = useLeadProgress(nodeId, 'wrong', 0)
  const [selectedId, setSelectedId] = useState(null)
  const [feedback, setFeedback] = useState(null)

  const required = useMemo(() => content.photos.filter(p => p.required).map(p => p.id), [content.photos])
  const done = required.every(id => placed[id])
  const selected = content.photos.find(p => p.id === selectedId) ?? null

  const placedHere = (placeId) =>
    content.photos.filter(p => placed[p.id] === placeId)

  const handlePlace = (placeId) => {
    if (!selected) {
      setFeedback({ type: 'info', text: 'Pick a photograph first, then the place it was taken.' })
      return
    }
    if (placeId === selected.answer) {
      const next = { ...placed, [selected.id]: placeId }
      setPlaced(next)
      setFeedback({ type: 'correct', text: selected.correctFeedback ?? 'That is where it was taken.' })
      setSelectedId(null)
      const nowDone = required.every(id => next[id])
      triggerDiscovery(nowDone ? 'major' : 'minor')
    } else {
      const nth = wrongCount + 1
      setWrongCount(nth)
      if (activePath) markWrongGuess(activePath, nth)
      setFeedback({
        type: 'wrong',
        text: `${selected.wrongFeedback ?? 'Read the coordinates against the grid again.'} (+${wrongCost(nth)} min)`,
      })
    }
  }

  const placedCount = required.filter(id => placed[id]).length

  return (
    <div className="mp-root">
      <div className="mp-bar" role="status">
        <span>Placed {placedCount} / {required.length}</span>
        <span className="mp-bar-hint">
          {selected ? <>Find <b className="mp-coord">{fmtLat(selected.lat)} · {fmtLon(selected.lon)}</b> on the grid</> : 'Choose a photograph'}
        </span>
      </div>

      <div className="mp-body">
        {/* the photographs, with the metadata that says where they were taken */}
        <ul className="mp-strip" aria-label="Photographs">
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
                aria-label={`${p.filename}, taken ${p.taken}${at ? ', already placed' : ''}`}>
                <span className="thumb">{src && <img src={src} alt="" />}</span>
                <span className="meta">
                  <span className="fn">{p.filename}</span>
                  <span className="exif">{fmtLat(p.lat)}</span>
                  <span className="exif">{fmtLon(p.lon)}</span>
                  <span className="when">{p.taken}</span>
                </span>
              </button>
              </li>
            )
          })}
        </ul>

        <div className="mp-sheets">
          {content.sheets.map(sheet => (
            <Sheet key={sheet.id} sheet={sheet}
              places={content.places.filter(pl => pl.sheet === sheet.id)}
              landmarks={(content.landmarks ?? []).filter(l => l.sheet === sheet.id)}
              placedHere={placedHere}
              selected={selected}
              disabled={done}
              onPlace={handlePlace} />
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
