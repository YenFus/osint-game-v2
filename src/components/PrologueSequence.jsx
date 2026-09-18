// ─────────────────────────────────────────────────────────────────
// PROLOGUE SEQUENCE — a drawn beat, a line or two, a tap to move on.
// Lines fade in on their own; tapping reveals the rest at once, then
// advances. The whole opening is under a hundred words.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { PrologueArt } from './board/PrologueArt'
import { useAudio } from '../hooks/useAudio'
import '../styles/prologue.css'

const LINE_DELAY = 1500

export function PrologueSequence({ beats, onComplete }) {
  const [beat, setBeat] = useState(0)
  const [shown, setShown] = useState(1)
  const { playSFX } = useAudio()
  const timer = useRef(null)
  const current = beats[beat]
  const allShown = shown >= current.lines.length

  // Reveal the next line on its own, until the beat is fully shown
  useEffect(() => {
    if (allShown) return
    timer.current = setTimeout(() => setShown(n => n + 1), LINE_DELAY)
    return () => clearTimeout(timer.current)
  }, [shown, allShown, beat])

  const advance = useCallback(() => {
    clearTimeout(timer.current)
    if (!allShown) { setShown(current.lines.length); return }
    playSFX('click')
    if (beat + 1 >= beats.length) { onComplete?.(); return }
    setBeat(b => b + 1)
    setShown(1)
  }, [allShown, beat, beats.length, current.lines.length, onComplete, playSFX])

  useEffect(() => {
    const onKey = (e) => {
      if (['Space', 'Enter', 'ArrowRight'].includes(e.code)) { e.preventDefault(); advance() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [advance])

  return (
    <div className="pro-root" onClick={advance} role="button" tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter') advance() }} aria-label="Prologue — tap to continue">
      {beats.map((b, i) => (
        <div key={b.id} className={`pro-art ${i === beat ? 'on' : ''}`} aria-hidden={i !== beat}>
          <PrologueArt scene={b.art} />
        </div>
      ))}
      <div className="pro-shade" />

      <div className="pro-stamp type">{current.stamp}</div>

      <div className="pro-lines">
        {current.lines.slice(0, shown).map((l, i) => (
          <p key={`${current.id}-${i}`} className={`pro-line ${l.voice ? `v-${l.voice}` : ''}`}>{l.text}</p>
        ))}
      </div>

      <div className="pro-dots" aria-hidden="true">
        {beats.map((b, i) => <span key={b.id} className={i === beat ? 'on' : ''} />)}
      </div>
      <div className="pro-hint type">{allShown ? 'tap to continue' : 'tap to skip'}</div>
    </div>
  )
}
