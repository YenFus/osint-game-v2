// ─────────────────────────────────────────────────────────────────
// RAY'S PHONE — Ray Callahan texts Thomas mid-investigation.
// The player picks a reply; some replies make Ray nervous.
// mode 'beat'  → a RAY_BEATS message with reply options
// mode 'final' → Ray is outside the building (no options; onDone)
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { useModalFocus } from '../../hooks/useModalFocus'
import { RAY_BEATS, RAY_FINAL } from '../../data/caseData'
import { PolaroidArt } from './PolaroidArt'
import { useAudio } from '../../hooks/useAudio'

const MOOD_LINE = (delta) =>
  delta >= 20 ? { text: 'That was a mistake. He\'s paying attention now.', color: '#e04a3a' }
    : delta >= 10 ? { text: 'He\'s uneasy. Careful.', color: '#d4a84b' }
      : delta > 0 ? { text: 'He noticed something. Maybe.', color: '#c8b890' }
        : { text: 'He bought it.', color: '#6a9a70' }

export function RayPhone({ beatId, mode = 'beat', onAnswer, onDone }) {
  const dialogRef = useRef(null)
  useModalFocus(dialogRef)
  const beat = mode === 'final' ? { messages: RAY_FINAL.messages, options: [] } : RAY_BEATS.find(b => b.id === beatId)
  const { playSFX } = useAudio()
  const [shown, setShown] = useState([]) // [{who, text}]
  const [typing, setTyping] = useState(true)
  const [stage, setStage] = useState('incoming') // incoming → choose → replying → done
  const [picked, setPicked] = useState(null)
  const listRef = useRef(null)
  const timers = useRef([])

  useEffect(() => {
    playSFX('buzz')
    let t = 700
    beat.messages.forEach((text, i) => {
      timers.current.push(setTimeout(() => {
        setShown(prev => [...prev, { who: 'them', text }])
        playSFX('notification')
        if (i === beat.messages.length - 1) {
          setTyping(false)
          setStage(mode === 'final' ? 'done' : 'choose')
        }
      }, t))
      t += 1100 + text.length * 18
    })
    const list = timers.current
    return () => list.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' })
  }, [shown, typing])

  const choose = (idx) => {
    const opt = beat.options[idx]
    setPicked(idx)
    setShown(prev => [...prev, { who: 'me', text: opt.text }])
    setStage('replying')
    setTyping(true)
    timers.current.push(setTimeout(() => {
      setTyping(false)
      setShown(prev => [...prev, { who: 'them', text: opt.reply }])
      playSFX('notification')
      setStage('done')
    }, 1600))
  }

  const finish = () => {
    if (mode === 'final') onDone?.()
    else onAnswer?.(picked)
  }

  if (!beat) return null
  const mood = picked !== null ? MOOD_LINE(beat.options[picked].suspicion) : null

  return (
    <div ref={dialogRef} className="rp-root" role="dialog" aria-modal="true" aria-label="Text messages from Ray">
      <div className="rp-phone buzz">
        <div className="rp-top">
          <div className="rp-av"><PolaroidArt scene="ray" /></div>
          <div className="rp-name">Ray</div>
          <div className="rp-sub">{typing ? 'typing…' : 'iMessage'}</div>
        </div>
        <div className="rp-msgs" ref={listRef} aria-live="polite">
          {shown.map((m, i) => <div key={i} className={`rp-b ${m.who}`}>{m.text}</div>)}
          {typing && <div className="rp-typing" aria-label="Ray is typing"><i /><i /><i /></div>}
        </div>
        {stage === 'choose' && (
          <div className="rp-opts">
            {beat.options.map((o, i) => (
              <button key={i} className="rp-opt" onClick={() => choose(i)}>{o.text}</button>
            ))}
          </div>
        )}
        {stage === 'done' && (
          <>
            {mood && <div className="rp-mood" style={{ color: mood.color }}>{mood.text}</div>}
            {mode === 'final' && <div className="rp-note">He's downstairs. He's never once been late.</div>}
            <button className="rp-done" onClick={finish}>{mode === 'final' ? 'Put the phone down' : 'Back to the board'}</button>
          </>
        )}
      </div>
    </div>
  )
}
