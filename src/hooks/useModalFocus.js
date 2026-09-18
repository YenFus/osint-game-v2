// ─────────────────────────────────────────────────────────────────
// useModalFocus — makes a dialog behave like a dialog.
//
// Six overlays in this game carried aria-modal="true" with no focus
// management at all: opening a lead left focus on the card behind it,
// and seven Tab presses walked the whole board before reaching the
// lead's own controls. A keyboard player could not play a lead.
//
// This marks everything outside the dialog `inert`, moves focus
// inside, keeps Tab inside, and puts focus back where it came from.
// ─────────────────────────────────────────────────────────────────

import { useEffect } from 'react'

const TABBABLE = [
  'a[href]', 'button:not([disabled])', 'input:not([disabled])',
  'select:not([disabled])', 'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')


// Pulled out of the hook body so the linter doesn't read these writes as
// mutations of the ref argument.
function setInert(el, value) {
  el.inert = value
}

function collectBackground(dialog) {
  const out = []
  for (let node = dialog; node && node !== document.body; node = node.parentElement) {
    for (const sib of node.parentElement?.children ?? []) {
      if (sib === node || sib.contains(dialog)) continue
      out.push([sib, sib.inert])
    }
  }
  return out
}

export function useModalFocus(ref, { active = true } = {}) {
  useEffect(() => {
    if (!active) return
    const dialog = ref.current
    if (!dialog) return

    const returnTo = document.activeElement
    // Everything that isn't this dialog goes inert. The dialog is nested
    // inside the React root, so walking only document.body's children
    // would find nothing to mark — climb from the dialog and inert the
    // siblings at every level.
    const marked = collectBackground(dialog)
    for (const [el] of marked) setInert(el, true)

    const first = dialog.querySelector(TABBABLE)
    ;(first ?? dialog).focus?.({ preventScroll: true })

    const onKey = (e) => {
      if (e.key !== 'Tab') return
      const items = [...dialog.querySelectorAll(TABBABLE)].filter(el => el.offsetParent !== null)
      if (!items.length) return
      const first = items[0]
      const last = items[items.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault(); first.focus()
      }
    }
    dialog.addEventListener('keydown', onKey)

    return () => {
      dialog.removeEventListener('keydown', onKey)
      for (const [el, was] of marked) setInert(el, was)
      returnTo?.focus?.({ preventScroll: true })
    }
  }, [ref, active])
}
