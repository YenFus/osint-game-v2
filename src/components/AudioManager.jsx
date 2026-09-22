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

// The score over the room tone: one theme, five treatments.
const PHASE_SCORE = {
  menu: 'theme',
  story: 'theme',
  apartment: 'apartment',
  investigation: 'investigation',
  convergence: 'convergence',
  ending: 'ending',
}

export function AudioManager() {
  const phase = useGameStore(s => s.phase)
  const { playAmbient, stopAmbient, initAudio, playScore } = useAudio()
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

  // The score follows the phase, and starts on the first gesture if the
  // browser wouldn't let it start sooner.
  useEffect(() => {
    const start = () => playScore(PHASE_SCORE[phase])
    start()
    document.addEventListener('pointerdown', start, { once: true })
    document.addEventListener('keydown', start, { once: true })
    return () => {
      document.removeEventListener('pointerdown', start)
      document.removeEventListener('keydown', start)
    }
  }, [phase, playScore])

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
