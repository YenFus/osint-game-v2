// ─────────────────────────────────────────────────────────────────
// NARRATION BOX — Typewriter text reveal for story panels
// Fixed: Centered layout, larger text for readability
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'

// Word-by-word text reveal hook
function useTypewriter(text, wordPause, pauseAfter, onComplete, skip) {
  const [visibleCount, setVisibleCount] = useState(0)
  const timeoutsRef = useRef([])
  const words = text ? text.split(' ') : []

  const clearAll = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  useEffect(() => {
    if (!text) return
    clearAll()
    setVisibleCount(0)

    let elapsed = 400 // initial delay

    words.forEach((word, i) => {
      const prev = words[i - 1]
      if (prev) {
        const key = Object.keys(pauseAfter).find(k =>
          prev.endsWith(k) || prev === k
        )
        if (key) elapsed += pauseAfter[key]
      }

      const t = setTimeout(() => {
        setVisibleCount(i + 1)
        if (i === words.length - 1 && onComplete) onComplete()
      }, elapsed)

      timeoutsRef.current.push(t)
      elapsed += wordPause
    })

    return clearAll
  }, [text])

  useEffect(() => {
    if (skip && visibleCount < words.length) {
      clearAll()
      setVisibleCount(words.length)
      if (onComplete) onComplete()
    }
  }, [skip])

  const visible = words.slice(0, visibleCount).join(' ')
  const hidden = words.slice(visibleCount).join(' ')
  const isComplete = visibleCount >= words.length

  return { visible, hidden, isComplete, words }
}

export default function NarrationBox({
  text,
  position = 'bottom',
  voice = 'thomas',
  wordPause = 65,
  pauseAfter = {},
  onComplete,
  skipToEnd = false,
  visible = true,
  centered = false, // Force centered layout regardless of voice
}) {
  const [boxDrawn, setBoxDrawn] = useState(false)

  const { visible: visibleText, hidden: hiddenText, isComplete } = useTypewriter(
    text,
    wordPause,
    pauseAfter,
    onComplete,
    skipToEnd
  )

  useEffect(() => {
    if (!visible || !text) { setBoxDrawn(false); return }
    setBoxDrawn(false)
    const t = setTimeout(() => setBoxDrawn(true), 80)
    return () => clearTimeout(t)
  }, [text, visible])

  if (!text || !visible) return null

  // Chapter title cards — bold, dramatic, uppercase
  if (voice === 'chapter') {
    return (
      <div
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center p-8"
        style={{
          opacity: boxDrawn ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <div className="text-center max-w-2xl">
          <p
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(28px, 6vw, 48px)',
              fontWeight: 700,
              fontStyle: 'normal',
              color: '#e8dcc8',
              lineHeight: 1.2,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              textShadow: '0 2px 30px rgba(0,0,0,0.8)',
            }}
          >
            {visibleText}
            {!isComplete && (
              <span
                className="inline-block w-[3px] h-[0.8em] bg-[#e8dcc8] opacity-60 ml-1 align-middle"
                style={{ animation: 'blink 1s infinite' }}
              />
            )}
          </p>
        </div>
      </div>
    )
  }

  // Centered narration (thomas/dialogue/maya voice in a full-panel card) — intimate serif
  if (centered) {
    const isDialogue = voice === 'dialogue'
    const isMaya = voice === 'maya'
    return (
      <div
        className="absolute inset-0 z-20 pointer-events-none flex items-center justify-center px-10"
        style={{
          opacity: boxDrawn ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
      >
        <p
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontSize: 'clamp(19px, 2.5vw, 26px)',
            fontWeight: 400,
            fontStyle: isMaya || isDialogue ? 'italic' : 'normal',
            color: '#cec6b4',
            lineHeight: 1.7,
            textAlign: 'center',
            maxWidth: '54ch',
            textShadow: '0 1px 12px rgba(0,0,0,0.9)',
          }}
        >
          {visibleText}
          {!isComplete && hiddenText && (
            <span className="opacity-0" aria-hidden="true">{' ' + hiddenText}</span>
          )}
          {!isComplete && (
            <span
              className="inline-block w-[2px] h-[0.85em] bg-[#cec6b4] opacity-40 ml-1 align-middle"
              style={{ animation: 'blink 1s infinite' }}
            />
          )}
        </p>
      </div>
    )
  }

  // Thomas/Maya narrative style
  const isDialogue = voice === 'dialogue'
  const isMaya = voice === 'maya'

  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0' : 'bottom-0'} left-0 right-0 z-20 pointer-events-none`}
      style={{
        opacity: boxDrawn ? 1 : 0,
        transition: 'opacity 0.2s',
      }}
    >
      <div className="mx-4 sm:mx-8 mb-6 mt-6">
        <div
          style={{
            background: 'rgba(8, 8, 14, 0.95)',
            borderLeft: `3px solid ${isMaya ? '#5a3838' : isDialogue ? '#4a4038' : '#3a3848'}`,
            padding: '16px 20px',
          }}
        >
          <p
            style={{
              fontFamily: "'Crimson Pro', serif",
              fontSize: 17,
              lineHeight: 1.75,
              color: '#d8d0c0',
              fontStyle: isDialogue || isMaya ? 'italic' : 'normal',
              margin: 0,
            }}
          >
            {visibleText}
            {!isComplete && hiddenText && (
              <span className="opacity-0" aria-hidden="true">
                {' ' + hiddenText}
              </span>
            )}
            {!isComplete && (
              <span
                className="inline-block w-[2px] h-[0.85em] bg-[#d8d0c0] opacity-50 ml-1 align-middle"
                style={{ animation: 'blink 1s infinite' }}
              />
            )}
          </p>
        </div>
      </div>
    </div>
  )
}
