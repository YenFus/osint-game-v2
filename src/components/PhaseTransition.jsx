import { useState, useEffect, useRef } from 'react'

const PHASE_LABELS = {
  menu: 'Main Menu',
  story: 'Chapter One',
  apartment: "Maya's Apartment",
  investigation: 'Investigation',
  convergence: 'Convergence',
  ending: 'The End',
}

export function PhaseTransition({ phase, children }) {
  const [transitioning, setTransitioning] = useState(false)
  const [showLabel, setShowLabel] = useState(false)
  const prevPhase = useRef(phase)

  useEffect(() => {
    if (phase !== prevPhase.current) {
      // Start transition
      setTransitioning(true)
      setShowLabel(true)

      // After fade out completes, fade back in
      const fadeInTimeout = setTimeout(() => {
        setTransitioning(false)
      }, 500)

      // Hide label
      const labelTimeout = setTimeout(() => {
        setShowLabel(false)
      }, 1200)

      prevPhase.current = phase

      return () => {
        clearTimeout(fadeInTimeout)
        clearTimeout(labelTimeout)
      }
    }
  }, [phase])

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
              className="font-mono text-[10px] text-red-800 tracking-[0.4em] uppercase mb-3"
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
