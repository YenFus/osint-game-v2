import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

const LINES = [
  'MISSING PERSONS CASE FILE',
  '— UNOFFICIAL —',
  '',
  'Subject: MAYA REYES, 24',
  'Missing since: March 10',
  'Reported by: Father',
  '',
  'You are the father.',
  "You are not a detective.",
  "You are the only one looking.",
]

export default function IntroPage() {
  const setPhase = useGameStore(s => s.setPhase)
  const [visibleLines, setVisibleLines] = useState(0)
  const [showButton, setShowButton] = useState(false)

  useEffect(() => {
    if (visibleLines < LINES.length) {
      const t = setTimeout(() => setVisibleLines(v => v + 1), visibleLines === 0 ? 600 : 280)
      return () => clearTimeout(t)
    } else {
      const t = setTimeout(() => setShowButton(true), 800)
      return () => clearTimeout(t)
    }
  }, [visibleLines])

  return (
    <div className="crt min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-6">
      {/* Top rule */}
      <div className="w-full max-w-lg mb-8">
        <div className="h-px bg-red-800 opacity-60" />
        <div className="h-px bg-red-900 opacity-30 mt-0.5" />
      </div>

      {/* Terminal block */}
      <div className="w-full max-w-lg font-mono text-sm leading-relaxed">
        {LINES.slice(0, visibleLines).map((line, i) => (
          <div
            key={i}
            className="fade-in"
            style={{ animationDelay: `${i * 0.05}s` }}
          >
            {line === '' ? (
              <div className="h-4" />
            ) : (
              <div
                className={
                  line.startsWith('Subject') || line.startsWith('Missing') || line.startsWith('Reported')
                    ? 'text-[#c8c0b0]'
                    : line.startsWith('—') || line.startsWith('MISSING')
                    ? 'text-red-700 tracking-widest text-xs'
                    : line.startsWith('You')
                    ? 'text-[#e8e0d0] text-base'
                    : 'text-[#6b6460]'
                }
              >
                {line}
                {i === visibleLines - 1 && visibleLines < LINES.length && (
                  <span className="blink text-red-600 ml-1">█</span>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Bottom rule */}
      <div className="w-full max-w-lg mt-8 mb-10">
        <div className="h-px bg-red-900 opacity-30" />
        <div className="h-px bg-red-800 opacity-60 mt-0.5" />
      </div>

      {/* Start button */}
      {showButton && (
        <div className="fade-in">
          <button
            onClick={() => setPhase('apartment')}
            className="
              font-mono text-xs tracking-[0.25em] uppercase
              border border-red-900 text-red-700
              px-8 py-3
              hover:bg-red-900 hover:bg-opacity-20 hover:text-red-500
              transition-all duration-300
              cursor-pointer
            "
          >
            Enter Maya's Apartment
          </button>
          <p className="text-center text-[#3a3430] font-mono text-xs mt-4 tracking-widest">
            — contains themes of violence and disappearance —
          </p>
        </div>
      )}

      {/* Game title watermark */}
      <div
        className="
          fixed bottom-6 right-8
          font-condensed font-black text-[#1a1a22] text-4xl
          tracking-tight uppercase select-none pointer-events-none
          flicker
        "
        style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
      >
        WHAT MAYA KNEW
      </div>
    </div>
  )
}
