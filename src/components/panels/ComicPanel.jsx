// ─────────────────────────────────────────────────────────────────
// COMIC PANEL — Text-only chapter cards
//
// Displays narration text centered on a dark background.
// Used for the text-only prologue sequence.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import NarrationBox from './NarrationBox'

// ── Chapter panel (full black, centered text) ─────────────────────
function ChapterPanel({ panelData, onNarrationComplete, skipToEnd }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ background: '#04040a' }}
    >
      {/* Subtle horizontal rule above */}
      <div className="absolute" style={{
        top: '50%', left: '8%', right: '8%', height: '1px',
        background: 'linear-gradient(90deg, transparent, #2a2432, transparent)',
        transform: 'translateY(-28px)',
      }} />

      <NarrationBox
        text={panelData.narration?.text}
        voice={panelData.narration?.voice ?? 'chapter'}
        position="center"
        centered={true}
        wordPause={panelData.narration?.wordPause ?? 90}
        pauseAfter={panelData.narration?.pauseAfter ?? {}}
        onComplete={onNarrationComplete}
        skipToEnd={skipToEnd}
      />

      {/* Subtle horizontal rule below */}
      <div className="absolute" style={{
        top: '50%', left: '8%', right: '8%', height: '1px',
        background: 'linear-gradient(90deg, transparent, #2a2432, transparent)',
        transform: 'translateY(28px)',
      }} />
    </div>
  )
}

// ── Main ComicPanel ───────────────────────────────────────────────
export default function ComicPanel({
  panelData,
  isActive = true,
  onNarrationComplete,
  skipToEnd = false,
  transitionClass = '',
}) {
  const panelRef = useRef(null)

  if (!panelData) return null

  return (
    <div
      ref={panelRef}
      className={`absolute inset-0 ${transitionClass}`}
      style={{ zIndex: 10 }}
    >
      <ChapterPanel
        panelData={panelData}
        onNarrationComplete={onNarrationComplete}
        skipToEnd={skipToEnd}
      />
    </div>
  )
}
