import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import PanelSequence from '../components/panels/PanelSequence'
import { PROLOGUE_PANELS } from '../data/prologueData'

export default function StoryPage() {
  const setPhase = useGameStore(s => s.setPhase)
  const [showSkip, setShowSkip] = useState(false)
  const [confirmSkip, setConfirmSkip] = useState(false)

  // Show skip button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleSkip = () => {
    if (confirmSkip) {
      setPhase('apartment')
    } else {
      setConfirmSkip(true)
      // Reset confirmation after 3 seconds
      setTimeout(() => setConfirmSkip(false), 3000)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#04040a] overflow-hidden">
      <PanelSequence
        panels={PROLOGUE_PANELS}
        onComplete={() => setPhase('apartment')}
        showProgress
      />

      {/* Skip button - NEW FEATURE: Mobile-friendly */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className="fixed top-4 right-4 z-50 font-mono text-sm tracking-[0.15em] uppercase transition-all cursor-pointer px-5 py-3 border-2 min-h-[48px]"
          style={{
            color: confirmSkip ? '#e05050' : '#8a8a98',
            borderColor: confirmSkip ? '#c0392b' : '#4a4a58',
            background: confirmSkip ? 'rgba(192,57,43,0.15)' : 'rgba(8,8,14,0.9)',
            animation: 'fadeIn 0.5s ease forwards',
            borderRadius: 4,
          }}
        >
          {confirmSkip ? 'Tap again to skip' : 'Skip Prologue'}
        </button>
      )}
    </div>
  )
}
