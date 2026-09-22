// ─────────────────────────────────────────────────────────────────
// APARTMENT ART — her room, photographed.
//
// The plate is generated (scripts/gen_art.py → art/apartment-room.jpg)
// and graded here toward the game's night palette. The three thread
// hotspots are registered against it; re-measure them if the plate is
// re-rolled with a different seed.
// ─────────────────────────────────────────────────────────────────

import { useId } from 'react'

// The room's layout (.room / .room-inner / .room-hot) lives in board.css.
// This file is the only entry point into the apartment phase, and
// ApartmentPage is its own lazy chunk — without this import the stylesheet
// is not part of that chunk's dependency graph, so the hub rendered with
// static-positioned hotspots stacked under the plate.
import '../../styles/board.css'

const BASE = import.meta.env.BASE_URL

export function ApartmentArt({ className, style, fit = 'slice' }) {
  const raw = useId()
  const id = raw.replace(/[^a-zA-Z0-9]/g, '')
  const u = (name) => `${name}-${id}`

  return (
    <svg
      viewBox="0 0 1024 680"
      preserveAspectRatio={`xMidYMid ${fit}`}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%', ...style }}
      aria-hidden="true"
    >
      <defs>
        <filter id={u('grain')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope="0.42" /></feComponentTransfer>
          <feBlend in2="SourceGraphic" mode="multiply" />
        </filter>
        <radialGradient id={u('vig')} cx="0.5" cy="0.45" r="0.78">
          <stop offset="0.5" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.45" />
        </radialGradient>
      </defs>
      {/* her apartment, photographed (scripts/gen_art.py) */}
      <image href={`${BASE}art/apartment-room.jpg`} x="0" y="0" width="1024" height="680"
        preserveAspectRatio={`xMidYMid ${fit}`} />
      <rect width="1024" height="680" fill="#0a0714" opacity="0.18" />
      <rect width="1024" height="680" fill={`url(#${u('vig')})`} />
      <rect width="1024" height="680" filter={`url(#${u('grain')})`} opacity="0.22" />
    </svg>
  )
}

// Registered against public/art/apartment-room.jpg. Re-measure if the
// plate is re-rolled with scripts/gen_art.py.
const ROOM_HOTSPOTS = [
  // Measured against public/art/apartment-room.jpg (seed 417, 1344x896) with
  // the viewBox matching the plate, so these land on the objects themselves.
  { path: 'A', x: 53, y: 54.5, w: 17, h: 19, label: 'Her laptop', sub: 'locked · someone tried to get in' },
  // B is the notebook on her bed, half under her papers; A is the desk and C
  // the corkboard filling the wall above it. Every label is drawn at once on
  // touch, so B hangs above.
  { path: 'B', x: 9, y: 71, w: 16, h: 10, label: 'The notebook', sub: 'half burned, on her bed', tagAbove: true },
  { path: 'C', x: 55, y: 5, w: 43, h: 46, label: 'Her corkboard', sub: 'photographs, string, notes', tagIn: true },
]

export function ApartmentRoom({ paths, onPick }) {
  return (
    <div className="room">
      <div className="room-inner">
      <ApartmentArt fit="slice" />
      {ROOM_HOTSPOTS.map(h => {
        const done = paths?.[h.path]?.completed
        const started = paths?.[h.path]?.started
        return (
          <button
            key={h.path}
            className={`room-hot ${done ? 'done' : started ? 'started' : ''} ${h.tagAbove ? 'tag-above' : ''} ${h.tagIn ? 'tag-in' : ''}`}
            style={{ left: `${h.x}%`, top: `${h.y}%`, width: `${h.w}%`, height: `${h.h}%` }}
            onClick={() => onPick(h.path)}
            aria-label={`${h.label} — ${done ? 'thread closed' : started ? 'in progress' : 'not yet examined'}`}
          >
            <span className="tag">
              <span className="nm">{h.label}</span>
              <span className="sb">{done ? '✓ thread closed' : started ? 'in progress' : h.sub}</span>
            </span>
          </button>
        )
      })}
      </div>
    </div>
  )
}
