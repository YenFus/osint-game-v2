// Which endings this browser has reached, kept apart from the save so a new
// game doesn't wipe it. The game has twelve endings and never said so until
// the last screen; this is what the menu and the ending file count against.
// Storage can be missing or blocked (private windows); then nothing is kept.

const KEY = 'maya-endings-found'

// every ending in EndingPage.jsx, in the order the menu lists them
export const ENDING_IDS = [
  'perfect', 'journalist', 'traced', 'partial', 'fled', 'gone',
  'thin', 'thin_unknown', 'tipoff', 'wrongman', 'lost', 'lost_unknown',
]

export function endingsFound() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? '[]')
    return Array.isArray(v) ? v.filter(id => ENDING_IDS.includes(id)) : []
  } catch {
    return []
  }
}

export function recordEnding(id) {
  try {
    const have = endingsFound()
    if (!have.includes(id)) localStorage.setItem(KEY, JSON.stringify([...have, id]))
  } catch { /* nowhere to keep it */ }
}
