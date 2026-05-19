import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'
import { useAudio } from '../hooks/useAudio'

// Map game phases to ambient tracks — convergence and ending now have distinct sounds
const PHASE_AUDIO = {
  menu: 'drone',
  story: 'drone',
  apartment: 'apartment',
  investigation: 'investigation',
  convergence: 'convergence',
  ending: 'ending',
}

export function AudioManager() {
  const phase = useGameStore(s => s.phase)
  const { playAmbient, stopAmbient, initAudio } = useAudio()
  const currentTrack = useRef(null)

  // Initialize audio on first user interaction
  useEffect(() => {
    const handleInteraction = () => {
      initAudio()
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
    document.addEventListener('click', handleInteraction)
    document.addEventListener('keydown', handleInteraction)
    return () => {
      document.removeEventListener('click', handleInteraction)
      document.removeEventListener('keydown', handleInteraction)
    }
  }, [initAudio])

  // Change ambient based on phase
  useEffect(() => {
    const newTrack = PHASE_AUDIO[phase]
    if (newTrack !== currentTrack.current) {
      if (currentTrack.current) {
        stopAmbient(currentTrack.current)
      }
      if (newTrack) {
        // Small delay for crossfade effect
        setTimeout(() => playAmbient(newTrack), 300)
      }
      currentTrack.current = newTrack
    }
  }, [phase, playAmbient, stopAmbient])

  return null // This component doesn't render anything
}
