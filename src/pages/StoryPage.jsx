import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'
import { PrologueSequence } from '../components/PrologueSequence'
import { PROLOGUE_BEATS } from '../data/prologueData'

export default function StoryPage() {
  const setPhase = useGameStore(s => s.setPhase)
  const [showSkip, setShowSkip] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowSkip(true), 2500)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="fixed inset-0 bg-[#06050a] overflow-hidden">
      <PrologueSequence beats={PROLOGUE_BEATS} onComplete={() => setPhase('apartment')} />
      {showSkip && (
        <button
          onClick={() => setPhase('apartment')}
          className="fixed top-4 right-4 z-50 font-mono text-xs tracking-[0.2em] uppercase px-4 py-3 border min-h-[44px]"
          style={{ color: '#9a8f80', borderColor: '#3a3242', background: 'rgba(8,6,12,0.85)', borderRadius: 4 }}
        >
          Skip
        </button>
      )}
    </div>
  )
}
