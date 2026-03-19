// ─────────────────────────────────────────────────────────────────
// PANEL SEQUENCE — manages the flow of comic panels
//
// Handles:
//   • Current / previous panel state for transition overlaps
//   • Transition types: cut | drift | slide | ink_wipe | color_bleed
//   • Input: spacebar, enter, arrow-right → advance
//   • Click anywhere → if narrating, skip to end; else advance
//   • Tracks narration completion per panel
//   • Calls onComplete when all panels are exhausted
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, useRef } from 'react'
import ComicPanel from './ComicPanel'

// ── Transition → CSS class mapping ───────────────────────────────
const TRANSITION_CLASSES = {
  cut:        '',                  // instant — no animation
  drift:      'panel-drift-in',
  slide:      'panel-slide-in',
  ink_wipe:   'ink-wipe',
  color_bleed: 'panel-drift-in',  // drift variant; tinted wash handles color
}

// ── Hint text (bottom-right corner) ──────────────────────────────
function AdvanceHint({ visible, narrationDone }) {
  return (
    <div
      className="absolute bottom-5 right-5 z-30 pointer-events-none select-none"
      style={{
        opacity: visible ? 0.45 : 0,
        transition: 'opacity 0.6s ease',
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: '11px',
        letterSpacing: '0.12em',
        color: '#5a5248',
        textTransform: 'uppercase',
      }}
    >
      {narrationDone ? 'SPACE to continue' : 'click to skip'}
    </div>
  )
}

// ── Progress dots ─────────────────────────────────────────────────
function ProgressDots({ total, current }) {
  if (total <= 1) return null
  return (
    <div className="absolute top-4 left-0 right-0 z-30 flex justify-center gap-[5px] pointer-events-none">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: i === current ? 16 : 5,
            height: 2,
            borderRadius: 1,
            background: i === current ? '#5a5248' : '#2a2432',
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  )
}

// ── Main PanelSequence component ──────────────────────────────────
export default function PanelSequence({
  panels = [],
  onComplete,
  showProgress = true,
}) {
  const [idx, setIdx]                     = useState(0)
  const [prevIdx, setPrevIdx]             = useState(null)
  const [narrationDone, setNarrationDone] = useState(false)
  const [skipToEnd, setSkipToEnd]         = useState(false)
  const [hintVisible, setHintVisible]     = useState(false)
  const [transitioning, setTransitioning] = useState(false)
  const transitionTimer                   = useRef(null)
  const hintTimer                         = useRef(null)

  const currentPanel = panels[idx]
  const prevPanel    = prevIdx !== null ? panels[prevIdx] : null

  // Show hint after a brief delay when panel becomes active
  useEffect(() => {
    setHintVisible(false)
    clearTimeout(hintTimer.current)
    hintTimer.current = setTimeout(() => setHintVisible(true), 1800)
    return () => clearTimeout(hintTimer.current)
  }, [idx])

  // ── Advance to next panel ─────────────────────────────────────
  const advance = useCallback(() => {
    if (transitioning) return

    const next = idx + 1
    if (next >= panels.length) {
      // End of sequence
      onComplete?.()
      return
    }

    setTransitioning(true)
    setPrevIdx(idx)
    setIdx(next)
    setNarrationDone(false)
    setSkipToEnd(false)
    setHintVisible(false)

    // Give transition animation time to settle, then clear prev
    const dur = getTransitionDuration(panels[next]?.transition ?? 'cut')
    clearTimeout(transitionTimer.current)
    transitionTimer.current = setTimeout(() => {
      setPrevIdx(null)
      setTransitioning(false)
    }, dur + 80)
  }, [idx, panels, onComplete, transitioning])

  // ── Skip typewriter → then on second action advance ──────────
  const handleInteraction = useCallback(() => {
    if (!narrationDone) {
      // First: skip to end of typewriter
      setSkipToEnd(true)
    } else {
      // Second: advance
      advance()
    }
  }, [narrationDone, advance])

  // ── Keyboard handler ──────────────────────────────────────────
  useEffect(() => {
    const onKey = (e) => {
      if (['Space', 'Enter', 'ArrowRight'].includes(e.code)) {
        e.preventDefault()
        handleInteraction()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleInteraction])

  // ── Cleanup on unmount ────────────────────────────────────────
  useEffect(() => {
    return () => {
      clearTimeout(transitionTimer.current)
      clearTimeout(hintTimer.current)
    }
  }, [])

  // ── When narration completes ──────────────────────────────────
  const handleNarrationComplete = useCallback(() => {
    setNarrationDone(true)
    setSkipToEnd(false)

    // Auto-advance for chapter panels — use a ref-safe version of advance
    // so the timeout always fires with current state
    if (currentPanel?.type === 'chapter' && currentPanel?.autoAdvance) {
      const delay = currentPanel.autoAdvanceDelay ?? 1200
      clearTimeout(transitionTimer.current)
      transitionTimer.current = setTimeout(() => {
        // Clear transitioning flag before advancing to prevent deadlock
        setTransitioning(false)
        setIdx(prev => {
          const next = prev + 1
          if (next >= panels.length) { onComplete?.(); return prev }
          setPrevIdx(prev)
          setNarrationDone(false)
          setSkipToEnd(false)
          setHintVisible(false)
          setTransitioning(true)
          const dur = getTransitionDuration(panels[next]?.transition ?? 'cut')
          transitionTimer.current = setTimeout(() => {
            setPrevIdx(null)
            setTransitioning(false)
          }, dur + 80)
          return next
        })
      }, delay)
    }
  }, [currentPanel, panels, onComplete])

  if (!currentPanel) return null

  const transitionClass = TRANSITION_CLASSES[currentPanel.transition ?? 'drift'] ?? ''

  return (
    <div
      className="relative w-full h-full overflow-hidden cursor-pointer select-none"
      onClick={handleInteraction}
    >
      {/* ── Previous panel (fading out during transition) ──── */}
      {prevPanel && (
        <div
          key={`prev-${prevIdx}`}
          className="absolute inset-0"
          style={{ zIndex: 9, opacity: 1 }}
        >
          <ComicPanel
            panelData={prevPanel}
            isActive={false}
            skipToEnd
          />
        </div>
      )}

      {/* ── Current panel ───────────────────────────────────── */}
      <div
        key={`panel-${idx}`}
        className="absolute inset-0"
        style={{ zIndex: 10 }}
      >
        <ComicPanel
          panelData={currentPanel}
          isActive
          transitionClass={transitionClass}
          onNarrationComplete={handleNarrationComplete}
          skipToEnd={skipToEnd}
        />
      </div>

      {/* ── Progress dots ────────────────────────────────────── */}
      {showProgress && (
        <ProgressDots total={panels.length} current={idx} />
      )}

      {/* ── Advance hint ─────────────────────────────────────── */}
      <AdvanceHint visible={hintVisible} narrationDone={narrationDone} />
    </div>
  )
}

// Return transition animation duration in ms
function getTransitionDuration(type) {
  switch (type) {
    case 'ink_wipe':    return 650
    case 'slide':       return 500
    case 'drift':       return 800
    case 'color_bleed': return 900
    case 'cut':         return 0
    default:            return 400
  }
}
