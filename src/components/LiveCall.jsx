// ─────────────────────────────────────────────────────────────────
// THE CALL, LIVE — the transcript on the ending page, played as it happens.
//
// The climax used to be a button and then a log: you pressed "Pick up the
// phone" and read eleven lines in a box after the verdict. Now it rings,
// Okafor answers, and the lines arrive one at a time at speaking pace, with
// her reaction to each thing you hand her before the next. The words are
// exactly the ones buildCall() writes; only the timing is new. Tap to hurry
// a line; Skip goes straight to the end.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { useAudio } from '../hooks/useAudio'

const WHO_COLOR = { You: '#e0c078', Okafor: '#9ec0d8', Ray: '#e07060', Rosa: '#8aa8e8' }

export function LiveCall({ lines, confront, onDone }) {
  const { playSFX, duckScore } = useAudio()
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  // rings → talking → ended
  const [stage, setStage] = useState(confront || still ? 'talking' : 'ringing')
  const [shown, setShown] = useState(still ? lines.length : 0)
  const [secs, setSecs] = useState(0)
  const listRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => {
    duckScore(true)
    return () => duckScore(false)
  }, [duckScore])

  // two rings, then she picks up
  useEffect(() => {
    if (stage !== 'ringing') return undefined
    playSFX('ringback')
    const t1 = setTimeout(() => playSFX('ringback'), 3200)
    const t2 = setTimeout(() => { playSFX('pickup'); setStage('talking') }, 6000)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [stage, playSFX])

  // the call timer
  useEffect(() => {
    if (stage !== 'talking' || confront) return undefined
    const i = setInterval(() => setSecs(s => s + 1), 1000)
    return () => clearInterval(i)
  }, [stage, confront])

  // one line at a time, at roughly the pace someone would say it
  useEffect(() => {
    if (stage !== 'talking') return undefined
    if (shown >= lines.length) {
      timer.current = setTimeout(() => { if (!confront) playSFX('hangup'); setStage('ended') }, 1400)
      return () => clearTimeout(timer.current)
    }
    const prev = lines[shown - 1]
    const wait = shown === 0 ? 700 : 900 + Math.min(5200, (prev?.text.length ?? 0) * 42)
    timer.current = setTimeout(() => setShown(n => n + 1), wait)
    return () => clearTimeout(timer.current)
  }, [stage, shown, lines, confront, playSFX])

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: still ? 'auto' : 'smooth' })
  }, [shown, still])

  const hurry = () => {
    if (stage === 'ringing') { playSFX('pickup'); setStage('talking'); return }
    if (stage === 'talking' && shown < lines.length) setShown(n => n + 1)
  }
  const skip = () => { setShown(lines.length); setStage('ended') }

  const mm = String(Math.floor(secs / 60)).padStart(2, '0')
  const ss = String(secs % 60).padStart(2, '0')
  const status = confront
    ? 'Outside the building'
    : stage === 'ringing' ? 'Calling…' : stage === 'ended' ? `Call ended · ${mm}:${ss}` : `${mm}:${ss}`

  return (
    <div className="lc-root" onClick={hurry}>
      <div className="lc-phone" role="log" aria-live="polite" aria-label={confront ? 'Outside the building' : 'Your call to Detective Okafor'}>
        <div className="lc-head">
          <div className="lc-name">{confront ? 'Ray' : 'Det. Dana Okafor'}</div>
          <div className="lc-sub">{confront ? 'Marlowe St · the pavement' : 'Millhaven PD · direct line'}</div>
          <div className={`lc-status ${stage}`}>{status}</div>
        </div>
        <div className="lc-lines" ref={listRef}>
          {lines.slice(0, shown).map((l, i) => l.who ? (
            <div key={i} className={`lc-line ${l.who === 'You' ? 'me' : 'them'}`}>
              <span className="lc-who" style={{ color: WHO_COLOR[l.who] ?? '#b0a898' }}>{l.who}</span>
              <p>{l.text}</p>
            </div>
          ) : (
            <p key={i} className="lc-beat">{l.text}</p>
          ))}
          {stage === 'ringing' && <p className="lc-beat">It rings.</p>}
        </div>
        <div className="lc-foot" onClick={e => e.stopPropagation()}>
          {stage === 'ended'
            ? <button className="lc-go" autoFocus onClick={onDone}>{confront ? 'What happened next →' : 'Put the phone down →'}</button>
            : <>
                <span className="lc-hint">tap to hurry</span>
                <button className="lc-skip" onClick={skip}>Skip to the end</button>
              </>}
        </div>
      </div>
    </div>
  )
}
