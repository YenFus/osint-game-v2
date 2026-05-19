// ─────────────────────────────────────────────────────────────────
// DIARY PANEL — full journal-page layout
//
// Displays all text at once (no typewriter).
// Each page shows a date/time stamp, section label, and multiple
// paragraphs of narration — like reading an actual diary entry.
//
// Signals narration complete immediately so the "press space"
// hint appears and the player can advance when they're ready.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'

// ── Voice → paragraph style ────────────────────────────────────────
function lineStyle(voice) {
  const base = { margin: 0, lineHeight: 1.95 }
  switch (voice) {
    case 'chapter':
      return {
        ...base,
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 10,
        letterSpacing: '0.2em',
        color: '#4a4a58',
        textTransform: 'uppercase',
      }
    case 'dialogue':
      return {
        ...base,
        fontFamily: "'Crimson Pro', serif",
        fontSize: 16,
        fontStyle: 'italic',
        color: '#9a8878',
        paddingLeft: 16,
        borderLeft: '2px solid #242432',
      }
    default: // 'thomas'
      return {
        ...base,
        fontFamily: "'Crimson Pro', serif",
        fontSize: 16,
        color: '#a89880',
      }
  }
}

// ── DiaryPanel ────────────────────────────────────────────────────
export default function DiaryPanel({ panelData, onNarrationComplete }) {
  const [opacity, setOpacity] = useState(0)
  const { date, time, section, lines = [] } = panelData

  useEffect(() => {
    // Start fade-in almost immediately
    const t1 = setTimeout(() => setOpacity(1), 40)
    // Signal "narration done" right away — there's no typewriter to wait for.
    // This lets the advance hint appear as soon as the page is readable.
    const t2 = setTimeout(() => onNarrationComplete?.(), 60)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-y-auto"
      style={{ background: '#04040a', padding: '32px 24px' }}
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          opacity,
          transition: 'opacity 0.5s ease',
        }}
      >

        {/* ── Date / time header ──────────────────────────────── */}
        {(date || time) && (
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.28em',
            color: '#383848',
            textTransform: 'uppercase',
            marginBottom: 5,
          }}>
            {[date, time].filter(Boolean).join('  ·  ')}
          </div>
        )}

        {/* ── Section label ───────────────────────────────────── */}
        {section && (
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.4em',
            color: '#262632',
            textTransform: 'uppercase',
            marginBottom: 22,
          }}>
            {section}
          </div>
        )}

        {/* ── Hairline rule ────────────────────────────────────── */}
        <div style={{
          width: 24,
          height: 1,
          background: '#1c1c28',
          marginBottom: 28,
        }} />

        {/* ── Lines ────────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {lines.map((line, i) => (
            <p key={i} style={lineStyle(line.voice)}>
              {line.text}
            </p>
          ))}
        </div>

      </div>
    </div>
  )
}
