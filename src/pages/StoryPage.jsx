import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import PanelSequence from '../components/panels/PanelSequence'
import { PROLOGUE_PANELS } from '../data/prologueData'

export default function StoryPage() {
  const setPhase = useGameStore(s => s.setPhase)
  const [showSkip, setShowSkip] = useState(false)

  // Show skip button after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => setShowSkip(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#04040a] overflow-hidden">
      <PanelSequence
        panels={PROLOGUE_PANELS}
        onComplete={() => setPhase('apartment')}
        showProgress
      />

      {showSkip && (
        <button
          onClick={() => setPhase('apartment')}
          className="fixed top-4 right-4 z-50 font-mono text-sm tracking-[0.15em] uppercase transition-all cursor-pointer px-5 py-3 border-2 min-h-[48px]"
          style={{
            color: '#8a8a98',
            borderColor: '#4a4a58',
            background: 'rgba(8,8,14,0.9)',
            borderRadius: 4,
          }}
        >
          Skip Prologue
        </button>
      )}
    </div>
  )
}
