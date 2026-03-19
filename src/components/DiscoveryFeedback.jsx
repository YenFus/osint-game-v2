import { useState, useCallback, createContext, useContext } from 'react'
import { useAudio } from '../hooks/useAudio'
import { useAccessibilityStore } from '../store/accessibilityStore'

const DiscoveryContext = createContext(null)

// Configuration for different discovery intensities
const DISCOVERY_CONFIG = {
  minor: { flashDuration: 150, shakeDuration: 200, particleCount: 8 },
  major: { flashDuration: 250, shakeDuration: 300, particleCount: 16 },
  critical: { flashDuration: 350, shakeDuration: 400, particleCount: 24 },
}

// Pre-generate random values for particles (deterministic based on index)
function getParticleData(count) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: (i / count) * 360,
    delay: (i * 12.5) % 100, // Deterministic delay based on index
    size: 3 + ((i * 1.7) % 4), // Deterministic size based on index
  }))
}

function Particles({ count, active }) {
  // Generate particles data (deterministic, no Math.random)
  const particleData = count > 0 ? getParticleData(count) : []

  if (!active || count === 0) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-[9998] overflow-hidden">
      {particleData.map(p => (
        <div
          key={p.id}
          className="absolute left-1/2 top-1/2 rounded-full"
          style={{
            width: p.size,
            height: p.size,
            background: 'radial-gradient(circle, #d4a030 0%, #8a6020 100%)',
            boxShadow: '0 0 8px rgba(212, 160, 48, 0.6)',
            animation: `particleBurst 0.6s ease-out forwards`,
            animationDelay: `${p.delay}ms`,
            '--angle': `${p.angle}deg`,
          }}
        />
      ))}
    </div>
  )
}

export function DiscoveryFeedbackProvider({ children }) {
  const [flash, setFlash] = useState(false)
  const [shake, setShake] = useState(false)
  const [particles, setParticles] = useState({ active: false, count: 0 })
  const { playSFX } = useAudio()
  const { reducedMotion } = useAccessibilityStore()

  const triggerDiscovery = useCallback((type = 'minor') => {
    const config = DISCOVERY_CONFIG[type] || DISCOVERY_CONFIG.minor

    // Play sound
    playSFX('discovery')

    if (reducedMotion) {
      // Minimal feedback for reduced motion
      setFlash(true)
      setTimeout(() => setFlash(false), 100)
      return
    }

    // Flash
    setFlash(true)
    setTimeout(() => setFlash(false), config.flashDuration)

    // Shake
    setShake(true)
    setTimeout(() => setShake(false), config.shakeDuration)

    // Particles
    setParticles({ active: true, count: config.particleCount })
    setTimeout(() => setParticles({ active: false, count: 0 }), 800)
  }, [playSFX, reducedMotion])

  return (
    <DiscoveryContext.Provider value={{ triggerDiscovery }}>
      {children}

      {/* Flash overlay */}
      {flash && (
        <div
          className="fixed inset-0 pointer-events-none z-[9999]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(212,160,48,0.3) 0%, transparent 70%)',
            animation: 'screenFlash 0.25s ease-out forwards',
          }}
        />
      )}

      {/* Shake wrapper */}
      {shake && (
        <style>{`
          body { animation: screenShake 0.3s ease-out; }
        `}</style>
      )}

      {/* Particles */}
      <Particles count={particles.count} active={particles.active} />
    </DiscoveryContext.Provider>
  )
}

export function useDiscoveryFeedback() {
  const context = useContext(DiscoveryContext)
  if (!context) {
    // Fallback when used outside provider
    return { triggerDiscovery: () => {} }
  }
  return context
}
