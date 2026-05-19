// ─────────────────────────────────────────────────────────────────
// COMIC PANEL — Text-only chapter cards
//
// Displays narration text centered on a dark background.
// Used for the text-only prologue sequence.
//
// Supports two panel types:
//   'chapter' — centered single-line typewriter narration
//   'diary'   — full journal-page layout (DiaryPanel)
// ─────────────────────────────────────────────────────────────────

import { useRef } from 'react'
import NarrationBox from './NarrationBox'
import DiaryPanel from './DiaryPanel'

// ── Chapter panel (full black, centered typewriter text) ──────────
function ChapterPanel({ panelData, onNarrationComplete, skipToEnd }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center"
      style={{ background: '#04040a' }}
    >
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
      {panelData.type === 'diary' ? (
        <DiaryPanel
          panelData={panelData}
          onNarrationComplete={onNarrationComplete}
        />
      ) : (
        <ChapterPanel
          panelData={panelData}
          onNarrationComplete={onNarrationComplete}
          skipToEnd={skipToEnd}
        />
      )}
    </div>
  )
}
