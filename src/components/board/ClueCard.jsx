// ─────────────────────────────────────────────────────────────────
// CLUE CARD — the moment a lead gives you something.
//
// This used to be a small toast in the corner that said "New clue" and a
// title, then faded. After a full playthrough the player said new clues
// were too easy to miss and it was never clear what they were or where
// they had come from. So a finished lead now puts the card in front of
// you: what it says, in plain words, and where it came from. It waits for
// you to take it, and stays marked as new in the drawer until you look.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { useModalFocus } from '../../hooks/useModalFocus'
import { CLUES } from '../../data/caseData'
import { PolaroidArt } from './PolaroidArt'

export function ClueCard({ clueId, onDone }) {
  const clue = CLUES[clueId]
  const dialogRef = useRef(null)
  useModalFocus(dialogRef)
  const [leaving, setLeaving] = useState(false)

  const take = () => {
    if (leaving) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) { onDone(); return }
    setLeaving(true)
    setTimeout(onDone, 420)
  }

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { e.preventDefault(); take() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  })

  if (!clue) return null
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
        <p className="cc-how">
          It goes in your notes. If it answers one of the questions on the board, pin it there.
          Not every note answers something.
        </p>
        <button type="button" className="cc-take" onClick={take} autoFocus>Add to my notes</button>
      </div>
    </div>
  )
}
