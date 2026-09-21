// ─────────────────────────────────────────────────────────────────
// THE NAME — the one moment the whole case turns on.
//
// It used to arrive as a row in a table on the case board, after the
// lead had already printed the surname three times. It fires now the
// instant the player flags the line that carries it, over the record
// they are reading, so the beat lands where the discovery happens.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { useModalFocus } from '../../hooks/useModalFocus'

export function NameRevealCard({ onDone }) {
  const ref = useRef(null)
  useModalFocus(ref)
  // B8 asks you to type the name and says "press Enter to submit". That same
  // Enter landed on this card's button the instant it mounted and dismissed
  // the biggest beat in the game, permanently, without it ever being seen.
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setArmed(true), 350)
    return () => clearTimeout(t)
  }, [])
  return (
    <div ref={ref} className="cb-tut name-reveal" role="alertdialog" aria-modal="true" aria-label="A name">
      <div className="card">
        <div className="nr-eyebrow">I've read it three times</div>
        <div className="nr-name">Raymond T. Callahan</div>
        <p className="nr-body">
          Ray held my hand the night Carmen died. He taught Maya to drive. And his name is on the
          paperwork behind the man who took her.
        </p>
        <p className="nr-body quiet">
          A name on a form isn't proof. I need to know why it's there.
        </p>
        <div className="row"><span /><span /><button disabled={!armed} onClick={onDone}>Keep working</button></div>
      </div>
    </div>
  )
}
