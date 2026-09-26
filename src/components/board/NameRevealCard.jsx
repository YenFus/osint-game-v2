// ─────────────────────────────────────────────────────────────────
// THE NAME — the one moment the whole case turns on.
//
// It used to arrive as a row in a table on the case board, after the
// lead had already printed the surname three times. It fires now the
// instant the player flags the line that carries it, over the record
// they are reading, so the beat lands where the discovery happens.
//
// Then it was a small card over a dimmed lead, the same size as a tutorial
// tip. Now the room goes dark and the music drops out, the name types itself
// out a key at a time, and Thomas says three things, one after another.
// Reduced motion gets all of it at once.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { useModalFocus } from '../../hooks/useModalFocus'
import { useAudio } from '../../hooks/useAudio'

// The name is typed exactly as the record in front of the player prints it,
// and the card says which record that is. It used to type "Raymond T.
// Callahan" whatever you were reading, so a player who found him in the old
// WHOIS ("R. Callahan") was handed a first name and an initial from nowhere.
const SOURCES = {
  whois: { name: 'R. Callahan', from: 'The September registration, before he hid it' },
  html_author: { name: 'Ray Callahan', from: 'In the code of his website' },
  registry: { name: 'Raymond T. Callahan', from: 'Oregon business registry' },
}
const LINES = [
  'Ray held my hand the night my wife died. He taught Maya to drive.',
  'And his name is on the account that was watching Lena.',
  "A name on a form isn't proof. I need to know why it's there.",
]

export function NameRevealCard({ source = 'registry', onDone }) {
  const { name: NAME, from } = SOURCES[source] ?? SOURCES.registry
  const ref = useRef(null)
  useModalFocus(ref)
  const { playSFX, duckScore } = useAudio()
  const still = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  const [typed, setTyped] = useState(still ? NAME.length : 0)
  const [lines, setLines] = useState(still ? LINES.length : 0)
  // B8 asks you to type the name and says "press Enter to submit". That same
  // Enter landed on this card's button the instant it mounted and dismissed
  // the biggest beat in the game, permanently, without it ever being seen.
  // The button only exists once the last line is up.
  const done = typed >= NAME.length && lines >= LINES.length

  useEffect(() => {
    duckScore(true)
    return () => duckScore(false)
  }, [duckScore])

  useEffect(() => {
    if (typed >= NAME.length) return undefined
    const ch = NAME[typed]
    // a beat before the first key, and a longer one at the space before the surname
    const wait = typed === 0 ? 1100 : ch === ' ' || NAME[typed - 1] === '.' ? 260 : 95 + Math.random() * 70
    const t = setTimeout(() => {
      if (ch !== ' ') playSFX(typed % 2 ? 'typewriterKey2' : 'typewriterKey')
      setTyped(n => n + 1)
    }, wait)
    return () => clearTimeout(t)
  }, [typed, playSFX, NAME])

  useEffect(() => {
    if (typed < NAME.length || lines >= LINES.length) return undefined
    const t = setTimeout(() => setLines(n => n + 1), lines === 0 ? 1300 : 2100)
    return () => clearTimeout(t)
  }, [typed, lines, NAME.length])

  // a tap or a key shows the rest at once — but never dismisses on the same press
  const hurry = () => { if (!done) { setTyped(NAME.length); setLines(LINES.length) } }

  return (
    <div ref={ref} className="name-reveal" role="alertdialog" aria-modal="true" aria-label={`A name: ${NAME}`}
      tabIndex={-1} onClick={hurry}
      onKeyDown={(e) => { if (!done && ['Enter', ' ', 'Escape'].includes(e.key)) { e.preventDefault(); hurry() } }}>
      <div className="nr-stage">
        <div className="nr-eyebrow">{from} · I've read it three times</div>
        <div className="nr-name" aria-hidden="true">
          {NAME.slice(0, typed)}<span className={`nr-caret ${typed >= NAME.length ? 'off' : ''}`} />
        </div>
        <div className="nr-lines">
          {LINES.map((l, i) => (
            <p key={i} className={`nr-body ${i === LINES.length - 1 ? 'quiet' : ''} ${i < lines ? 'on' : ''}`} aria-hidden={i >= lines}>{l}</p>
          ))}
        </div>
        <div className="nr-actions">
          {done && <button autoFocus onClick={(e) => { e.stopPropagation(); onDone() }}>Keep working</button>}
        </div>
      </div>
    </div>
  )
}
