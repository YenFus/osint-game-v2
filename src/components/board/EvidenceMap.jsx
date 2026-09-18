// ─────────────────────────────────────────────────────────────────
// EVIDENCE MAP — coordinates are a reading task; a map is a glance.
// Every flagged photo drops a pin, so the overlap between where a
// man was and where Lena was becomes something you see.
// ─────────────────────────────────────────────────────────────────

import { useId } from 'react'
import { PLACES } from '../../data/places'


export function EvidenceMap({ place, flagged = [], height = 220 }) {
  const raw = useId()
  const id = raw.replace(/[^a-zA-Z0-9]/g, '')
  const here = PLACES[place]
  const pins = [...new Set(flagged)].filter(p => PLACES[p])

  return (
    <div style={{ position: 'relative', width: '100%', height, background: '#0b1016', border: '1px solid #21303c', overflow: 'hidden' }}>
      <svg viewBox="0 0 100 60" preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
        <defs>
          <linearGradient id={`w-${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#13212c" /><stop offset="1" stopColor="#0a1119" />
          </linearGradient>
        </defs>
        <rect width="100" height="60" fill={`url(#w-${id})`} />
        {/* river */}
        <path d="M20 0 q 6 14 2 24 q -5 13 4 22 q 6 7 4 14" fill="none" stroke="#1d3b4e" strokeWidth="2.6" />
        {/* highway south */}
        <path d="M26 16 q 14 14 24 26 q 10 10 20 14" fill="none" stroke="#2b3440" strokeWidth="1.2" strokeDasharray="2 2" />
        {/* city blocks */}
        {[[8, 8], [14, 22], [30, 34], [58, 62], [70, 52], [84, 72]].map(([x, y], i) => (
          <rect key={i} x={x} y={y} width="9" height="7" fill="#141d26" stroke="#1b2833" strokeWidth="0.4" />
        ))}
      </svg>

      {/* labels for the two places that matter */}
      {Object.entries(PLACES).filter(([, p]) => p.fixed).map(([key, p]) => (
        <div key={key} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <div style={{ width: 10, height: 10, margin: '0 auto', borderRadius: '50%', border: '2px solid #d8c070', background: 'rgba(216,192,112,0.25)' }} />
          <div style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: 12, color: '#c8b070', whiteSpace: 'nowrap', marginTop: 3 }}>{p.label}</div>
        </div>
      ))}

      {/* every photo you've flagged so far */}
      {pins.map(key => {
        const p = PLACES[key]
        const isHere = key === place
        return (
          <div key={key} style={{ position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, transform: 'translate(-50%,-100%)' }}>
            <svg width="18" height="24" viewBox="0 0 18 24">
              <path d="M9 24 C9 24 1 14 1 9 A8 8 0 1 1 17 9 C17 14 9 24 9 24 Z"
                fill={isHere ? '#e0453a' : '#a8322a'} stroke="#2a0a08" strokeWidth="1" />
              <circle cx="9" cy="9" r="3" fill="#2a0a08" />
            </svg>
          </div>
        )
      })}

      {/* where this photo was taken */}
      {here && !pins.includes(place) && (
        <div style={{ position: 'absolute', left: `${here.x}%`, top: `${here.y}%`, transform: 'translate(-50%,-50%)' }}>
          <div className="map-ping" />
        </div>
      )}

      {here && (
        <div style={{
          position: 'absolute', left: 8, bottom: 8, right: 8, fontFamily: 'Share Tech Mono, monospace',
          fontSize: 12, color: '#cfe0ee', background: 'rgba(6,10,14,0.82)', padding: '5px 8px', border: '1px solid #21303c',
        }}>
          {here.label}
        </div>
      )}
    </div>
  )
}
