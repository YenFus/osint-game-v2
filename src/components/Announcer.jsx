// ─────────────────────────────────────────────────────────────────
// ANNOUNCER — reads the case aloud to a screen reader.
//
// Settings offered "Screen reader mode" and nothing listened to it; the
// polite live region in App was never written to. With the mode on,
// the moments a sighted player gets as a visual flourish — a clue
// landing, the clock jumping, a message from Ray, a warning — are
// spoken instead. With it off, nothing is announced.
//
// It subscribes to the store rather than reacting in effects: the store
// is the external system, and the announcement is set from its callback.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { useAccessibilityStore } from '../store/accessibilityStore'
import { CLUES, RAY_BEATS } from '../data/caseData'

const WHY = {
  wrong: 'Wrong flag.', theory: 'That theory did not hold.', hint: 'Hint used.', lead: 'Lead read.',
}

// What, if anything, changed between two store snapshots that a
// screen-reader user should hear about.
function describe(next, prev) {
  if (next.lastClue && next.lastClue !== prev.lastClue) {
    const clue = CLUES[next.lastClue.id]
    if (clue) return `New clue: ${clue.title}. ${clue.detail}`
  }
  if (next.lastTimeDelta && next.lastTimeDelta !== prev.lastTimeDelta) {
    const d = next.lastTimeDelta
    return `${WHY[d.reason] ?? ''} The clock moves on ${d.amount} minutes.`.trim()
  }
  if (next.notifications.length > prev.notifications.length) {
    return next.notifications[next.notifications.length - 1]?.msg ?? null
  }
  if (next.rayBeatPending && next.rayBeatPending !== prev.rayBeatPending) {
    const beat = RAY_BEATS.find(b => b.id === next.rayBeatPending)
    if (beat) return `Message from Ray: ${(beat.messages ?? []).map(m => m.text ?? m).join(' ')}`
  }
  return null
}

export function Announcer() {
  const on = useAccessibilityStore(s => s.screenReaderMode)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!on) return undefined
    // Only what happens from here on — never the contents of a loaded save.
    return useGameStore.subscribe((next, prev) => {
      const text = describe(next, prev)
      if (!text) return
      // Clear first so the same sentence twice is still announced twice.
      setMessage('')
      requestAnimationFrame(() => setMessage(text))
    })
  }, [on])

  return (
    <div aria-live="polite" aria-atomic="true" className="sr-only" id="game-announcements">
      {on ? message : ''}
    </div>
  )
}
