// ─────────────────────────────────────────────────────────────────
// CLUE CARD — the moment a lead gives you something.
//
// This used to be a small toast in the corner that said "New clue" and a
// title, then faded. After a full playthrough the player said new clues
// were too easy to miss and it was never clear what they were or where
// they had come from. So a finished lead now puts the card in front of
// you: what it says, in plain words, and where it came from. It waits for
// you to take it, and stays marked as new in the drawer until you look.
//
// A card that stops play after every lead is right the first time through
// and slow on a replay. So once a player has seen a few, the card offers a
// quieter version: the same title and source in a banner at the top of the
// board that doesn't block anything and goes away by itself. It's the
// player's choice, it's in Settings to undo, and nothing is ever quiet by
// default.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { useModalFocus } from '../../hooks/useModalFocus'
import { useAccessibilityStore } from '../../store/accessibilityStore'
import { CLUES } from '../../data/caseData'
import { PolaroidArt } from './PolaroidArt'

// how long the banner stays when nobody is pointing at or focused on it
const BANNER_MS = 9000

// Finishing a lead used to drop you back on the board with no word on what
// had changed. The card now says which leads just appeared, and which of them
// is waiting on another thread first.
const THREAD_NAME = { A: 'her laptop', B: 'her notebook', C: 'her corkboard' }
function Opened({ opened }) {
  if (!opened?.length) return null
  return (
    <div className="cc-opened">
      <span>{opened.length === 1 ? 'New lead on the board' : `${opened.length} new leads on the board`}</span>
      <ul>
        {opened.map(o => (
          <li key={o.id}>{o.title}{o.waits && <em> — after something in {THREAD_NAME[o.waits]}</em>}</li>
        ))}
      </ul>
    </div>
  )
}

export function ClueCard({ clueId, onDone, offerQuiet = false, showHow = true, opened = [], onOpenLead }) {
  const clue = CLUES[clueId]
  const quiet = useAccessibilityStore(s => s.quietClues)
  const setQuiet = useAccessibilityStore(s => s.setQuietClues)
  // decided once per card, so ticking the box doesn't restyle the card you're reading
  const [banner] = useState(quiet)
  const dialogRef = useRef(null)
  useModalFocus(dialogRef, { active: !banner })
  const [leaving, setLeaving] = useState(false)
  const [held, setHeld] = useState(false)

  const take = () => {
    if (leaving) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { onDone(); return }
    setLeaving(true)
    setTimeout(onDone, banner ? 260 : 420)
  }

  useEffect(() => {
    // The banner doesn't own the keyboard; only the full card answers Escape.
    if (banner) return undefined
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); take() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  // the banner leaves by itself, but never while someone is reading it
  useEffect(() => {
    if (!banner || held || leaving) return undefined
    const t = setTimeout(take, BANNER_MS)
    return () => clearTimeout(t)
  })

  if (!clue) return null

  if (banner) {
    return (
      <div
        className={`cc-banner ${leaving ? 'leaving' : ''}`}
        role="status" aria-live="polite"
        onMouseEnter={() => setHeld(true)} onMouseLeave={() => setHeld(false)}
        onFocus={() => setHeld(true)} onBlur={() => setHeld(false)}
      >
        <div className="cc-banner-text">
          <span className="cc-k">New note</span>
          <strong className="cc-banner-title">{clue.title}</strong>
          <span className="cc-banner-src">from {clue.source}{opened.length > 0 && ` · ${opened.length} new lead${opened.length > 1 ? 's' : ''}`}</span>
        </div>
        <button type="button" className="cc-banner-ok" onClick={take}>Got it</button>
      </div>
    )
  }

  return (
    <div className={`cc-root ${leaving ? 'leaving' : ''}`} onClick={(e) => { if (e.target === e.currentTarget) take() }}>
      <div ref={dialogRef} className="cc-card" role="dialog" aria-modal="true" aria-labelledby="cc-title" aria-describedby="cc-detail">
        <div className="cc-pin" aria-hidden="true" />
        <div className="cc-k">New note</div>
        <div className="cc-body">
          <div className="cc-img" aria-hidden="true"><PolaroidArt scene={clue.scene} /></div>
          <div className="cc-text">
            <h2 id="cc-title" className="cc-title">{clue.title}</h2>
            <p id="cc-detail" className="cc-detail">{clue.detail}</p>
          </div>
        </div>
        <div className="cc-src"><span>Where it came from</span>{clue.source}</div>
        <Opened opened={opened} />
        {/* the how-to is for the first couple of notes; after that it's just more to read */}
        {showHow && (
          <p className="cc-how">
            It goes in your notes. If it answers one of the questions on the board, pin it there.
            Not every note answers something.
          </p>
        )}
        <button type="button" className={`cc-take ${showHow ? '' : 'cc-take-gap'}`} onClick={take} autoFocus>Add to my notes</button>
        {/* one new lead and nothing in its way: go straight to it rather than
            back to the board to find it */}
        {(() => {
          const next = opened.filter(o => !o.waits)
          return onOpenLead && next.length === 1 && (
            <button type="button" className="cc-next" onClick={() => { onOpenLead(next[0].id); take() }}>
              Add it, and open “{next[0].title}” →
            </button>
          )
        })()}
        {offerQuiet && (
          <label className="cc-quiet">
            <input type="checkbox" checked={quiet} onChange={(e) => setQuiet(e.target.checked)} />
            From now on, show new notes as a short banner instead
          </label>
        )}
      </div>
    </div>
  )
}
