// ─────────────────────────────────────────────────────────────────
// PROLOGUE SEQUENCE — a drawn beat, a line or two, a tap to move on.
// Lines fade in on their own; tapping reveals the rest at once, then
// advances. The whole opening is under a hundred words.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import { PrologueArt } from './board/PrologueArt'
import { useAudio } from '../hooks/useAudio'
import { useAudioStore } from '../store/audioStore'
import '../styles/prologue.css'

const LINE_DELAY = 1500

// ── The one recording in the game ─────────────────────────────────
// Everything else this game makes is oscillators and noise buffers, which
// is right for a click and a pin drop and completely wrong for the message
// Maya left. This is a file. It plays when the player presses play — never
// on arrival, because a browser would refuse it anyway and because pressing
// play on it yourself is the beat.
function useVoicemail(audio, active) {
  const el = useRef(null)
  const { muted, masterVolume } = useAudioStore()
  const [state, setState] = useState({ playing: false, progress: 0, duration: 0, played: false })

  useEffect(() => {
    if (!audio || !active) return undefined
    const a = new Audio(`${import.meta.env.BASE_URL}${audio.src}`)
    a.preload = 'auto'
    el.current = a
    const tick = () => setState(s => ({
      ...s, progress: a.duration ? a.currentTime / a.duration : 0, duration: a.duration || 0,
    }))
    const onEnd = () => setState(s => ({ ...s, playing: false, progress: 1, played: true }))
    a.addEventListener('timeupdate', tick)
    a.addEventListener('loadedmetadata', tick)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', tick)
      a.removeEventListener('loadedmetadata', tick)
      a.removeEventListener('ended', onEnd)
      a.pause()
      el.current = null
    }
  }, [audio, active])

  // leaving the beat, or muting mid-message, stops it
  useEffect(() => {
    const a = el.current
    if (!a) return
    a.volume = muted ? 0 : masterVolume
  }, [muted, masterVolume])

  const toggle = useCallback(() => {
    const a = el.current
    if (!a) return
    if (a.paused) {
      a.volume = muted ? 0 : masterVolume
      a.play().then(() => setState(s => ({ ...s, playing: true, played: true })))
        .catch(() => setState(s => ({ ...s, playing: false })))
    } else {
      a.pause()
      setState(s => ({ ...s, playing: false }))
    }
  }, [muted, masterVolume])

  return [state, toggle]
}

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

  const [vm, toggleVm] = useVoicemail(current.audio, true)

  return (
    /* This whole sequence used to be one screen-sized role="button" with a
       tabIndex on it — a screen reader announced eleven children as the name
       of a single control. The advance affordance is its own real button now,
       laid over the art and under the words, so the semantics are one button
       and the prose stays prose. */
    <section className="pro-root" aria-label="Prologue">
      <h1 className="sr-only">Prologue — What Maya Knew</h1>
      <button type="button" className="pro-tap" onClick={advance}
        aria-label={allShown ? 'Continue to the next scene' : 'Show the rest of this scene'} />
      {beats.map((b, i) => (
        <div key={b.id} className={`pro-art ${i === beat ? 'on' : ''}`} aria-hidden={i !== beat}>
          <PrologueArt scene={b.art} playback={i === beat ? vm : undefined} />
        </div>
      ))}
      <div className="pro-shade" />

      <div className="pro-stamp type">{current.stamp}</div>

      {/* The recording, with the words for anyone who will not hear it.
          It sits above the advance layer so a press plays rather than skips. */}
      {current.audio && (
        <div className="pro-audio">
          <button type="button" className={`pro-play ${vm.playing ? 'on' : ''}`} onClick={toggleVm}
            aria-label={vm.playing ? `Pause ${current.audio.label}` : `Play ${current.audio.label}`}>
            <span className="glyph" aria-hidden="true">{vm.playing ? '❚❚' : '▶'}</span>
            <span className="lbl">{vm.playing ? 'Playing' : vm.played ? 'Play again' : 'Play message'}</span>
          </button>
          <p className="sr-only">Transcript: {current.audio.transcript}</p>
        </div>
      )}

      <div className="pro-lines">
        {current.lines.slice(0, shown).map((l, i) => (
          <p key={`${current.id}-${i}`} className={`pro-line ${l.voice ? `v-${l.voice}` : ''}`}>{l.text}</p>
        ))}
      </div>

      <div className="pro-dots" aria-hidden="true">
        {beats.map((b, i) => <span key={b.id} className={i === beat ? 'on' : ''} />)}
      </div>
      <div className="pro-hint type">{allShown ? 'tap to continue' : 'tap to skip'}</div>
    </section>
  )
}
