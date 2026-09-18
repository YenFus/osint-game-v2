import { useState, useEffect } from 'react'

const PHASE_LABELS = {
  menu: 'Main Menu',
  story: 'Chapter One',
  apartment: "Maya's Apartment",
  investigation: 'Investigation',
  convergence: 'Convergence',
  ending: 'The End',
}

export function PhaseTransition({ phase, children }) {
  // One value, advanced by a timer, instead of two booleans flipped
  // synchronously inside an effect body (which cascaded a second render
  // on every phase change) and a ref read during render.
  //   'in'   — settled
  //   'fade' — content hidden behind the card
  //   'card' — content back, card still lifting
  const [lastPhase, setLastPhase] = useState(phase)
  const [stage, setStage] = useState('in')
  if (phase !== lastPhase) { setLastPhase(phase); setStage('fade') }

  useEffect(() => {
    if (stage === 'in') return undefined
    const t = setTimeout(
      () => setStage(s => (s === 'fade' ? 'card' : 'in')),
      stage === 'fade' ? 500 : 700,
    )
    return () => clearTimeout(t)
  }, [stage])

  const transitioning = stage === 'fade'
  const showLabel = stage !== 'in'

  return (
    <>
      {/* Content with fade */}
      <div
        style={{
          opacity: transitioning ? 0 : 1,
          transition: 'opacity 0.4s ease-in-out',
        }}
      >
        {/* Render with displayPhase to prevent flash */}
        {children}
      </div>

      {/* Transition overlay */}
      {showLabel && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-none"
          style={{
            background: '#08080e',
            animation: 'phaseTransition 1.2s ease-in-out forwards',
          }}
        >
          <div
            className="text-center"
            style={{
              animation: 'fadeInOut 1.2s ease-in-out forwards',
            }}
          >
            <div
              className="font-mono text-[12px] text-red-800 tracking-[0.4em] uppercase mb-3"
            >
              Loading
            </div>
            <div
              className="text-2xl text-[#c8c0b0] tracking-wider uppercase"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {PHASE_LABELS[phase] || phase}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes phaseTransition {
          0% { opacity: 1; }
          40% { opacity: 1; }
          50% { opacity: 0; }
          100% { opacity: 0; }
        }
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateY(10px); }
          20% { opacity: 1; transform: translateY(0); }
          80% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
      `}</style>
    </>
  )
}
