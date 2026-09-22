// ─────────────────────────────────────────────────────────────────
// PROLOGUE SEQUENCE — a drawn beat, a line or two, a tap to move on.
// Lines fade in on their own; tapping reveals the rest at once, then
// advances. The whole opening is under a hundred words.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react'
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
  const { duckScore } = useAudio()
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
    const onEnd = () => { duckScore(false); setState(s => ({ ...s, playing: false, progress: 1, played: true })) }
    a.addEventListener('timeupdate', tick)
    a.addEventListener('loadedmetadata', tick)
    a.addEventListener('ended', onEnd)
    return () => {
      a.removeEventListener('timeupdate', tick)
      a.removeEventListener('loadedmetadata', tick)
      a.removeEventListener('ended', onEnd)
      a.pause()
      duckScore(false)
      el.current = null
    }
  }, [audio, active, duckScore])

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
      duckScore(true)
      a.play().then(() => setState(s => ({ ...s, playing: true, played: true })))
        .catch(() => { duckScore(false); setState(s => ({ ...s, playing: false })) })
    } else {
      a.pause()
      duckScore(false)
      setState(s => ({ ...s, playing: false }))
    }
  }, [muted, masterVolume, duckScore])

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

  // The art used to reserve a fixed 26% of the screen for the words. A
  // three-line caption on a phone is taller than that, so the words printed
  // over the bottom of the picture — over Lena's "last seen" lines and the
  // bottom row of his photographs. Measure where the words start instead.
  const captionRef = useRef(null)
  const [artBottom, setArtBottom] = useState(null)
  useLayoutEffect(() => {
    const el = captionRef.current
    if (!el) return undefined
    const measure = () => {
      const audioEl = el.parentElement?.querySelector('.pro-audio')
      const top = Math.min(el.getBoundingClientRect().top, audioEl ? audioEl.getBoundingClientRect().top : Infinity)
      setArtBottom(Math.max(0, Math.round(window.innerHeight - top + 10)))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [beat])

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
        <div key={b.id} className={`pro-art ${i === beat ? 'on' : ''}`} aria-hidden={i !== beat}
          style={artBottom != null ? { bottom: artBottom } : undefined}>
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
          {/* what she's saying, as she says it — for anyone with the sound off */}
          {vm.played && current.audio.captions && (() => {
            const t = vm.progress * vm.duration
            const line = [...current.audio.captions].reverse().find(([at]) => t >= at)
            return <p className="pro-cc" aria-hidden="true">{line ? line[1] : '…'}</p>
          })()}
        </div>
      )}

      {/* Every line of the beat is laid out from the start and the unshown
          ones are invisible, so the caption's height is fixed for the beat
          and the art above it doesn't jump each time a line appears. */}
      <div className="pro-caption" ref={captionRef}>
        <div className="pro-lines">
          {current.lines.map((l, i) => (
            <p key={`${current.id}-${i}`}
              className={`pro-line ${l.voice ? `v-${l.voice}` : ''} ${i < shown ? '' : 'pending'}`}
              aria-hidden={i >= shown}>{l.text}</p>
          ))}
        </div>
      </div>

      <div className="pro-dots" aria-hidden="true">
        {beats.map((b, i) => <span key={b.id} className={i === beat ? 'on' : ''} />)}
      </div>
      <div className="pro-hint type">{allShown ? 'tap to continue' : 'tap to skip'}</div>
    </section>
  )
}
