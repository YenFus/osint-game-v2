import { useState, useEffect } from 'react'
import { useGameStore } from './store/gameStore'
import MainMenuPage from './pages/MainMenuPage'
import StoryPage from './pages/StoryPage'
import ApartmentPage from './pages/ApartmentPage'
import InvestigationPage from './pages/InvestigationPage'
import ConvergencePage from './pages/ConvergencePage'
import EndingPage from './pages/EndingPage'
import Notifications from './components/Notifications'
import { AudioManager } from './components/AudioManager'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PhaseTransition } from './components/PhaseTransition'
import { DiscoveryFeedbackProvider } from './components/DiscoveryFeedback'

const DEV = import.meta.env.DEV

// Dev tools - only shown when toggled with F12 or button
function DevSkip({ visible }) {
  const setPhase = useGameStore(s => s.setPhase)
  const phase = useGameStore(s => s.phase)
  const phases = ['menu','story','apartment','investigation','convergence','ending']

  if (!visible) return null

  return (
    <div style={{
      position:'fixed', bottom:8, right:8, zIndex:9999,
      display:'flex', gap:4, flexWrap:'wrap', maxWidth:320,
      justifyContent: 'flex-end',
      background: 'rgba(0,0,0,0.9)',
      padding: 8,
      borderRadius: 4,
      border: '1px solid #333',
    }}>
      <div style={{
        width: '100%',
        fontFamily: 'monospace',
        fontSize: 9,
        color: '#666',
        marginBottom: 4,
        textAlign: 'center',
      }}>
        DEV TOOLS (F12 to hide)
      </div>
      {phases.map(p => (
        <button key={p} onClick={() => setPhase(p)}
          style={{
            fontFamily:'monospace', fontSize:9, padding:'4px 8px',
            background: phase===p ? '#c0392b' : '#1a1a28',
            color: phase===p ? '#fff' : '#6a6a88',
            border:'1px solid #2a2a40', borderRadius:2, cursor:'pointer',
            textTransform:'uppercase', letterSpacing:'0.1em',
            minHeight: 32,
          }}>
          {p}
        </button>
      ))}
    </div>
  )
}

export default function App() {
  const phase = useGameStore(s => s.phase)
  const setPhase = useGameStore(s => s.setPhase)
  const [showDevTools, setShowDevTools] = useState(false)

  // Toggle dev tools with F12
  useEffect(() => {
    if (!DEV) return
    const handleKeyDown = (e) => {
      if (e.key === 'F12') {
        e.preventDefault()
        setShowDevTools(prev => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <ErrorBoundary onReset={() => setPhase('menu')}>
      <DiscoveryFeedbackProvider>
        <div className="min-h-screen bg-[#08080e]">
          {/* Skip links for screen reader accessibility */}
          <a href="#main-content" className="skip-link">Skip to main content</a>
          <a href="#navigation" className="skip-link" style={{ left: 150 }}>Skip to navigation</a>

          {/* Audio manager - handles ambient sound */}
          <AudioManager />

          <PhaseTransition phase={phase}>
            <main id="main-content">
              <ErrorBoundary onReset={() => setPhase('menu')}>
                {phase === 'menu'          && <MainMenuPage />}
                {phase === 'story'         && <StoryPage />}
                {phase === 'apartment'     && <ApartmentPage />}
                {phase === 'investigation' && <InvestigationPage />}
                {phase === 'convergence'   && <ConvergencePage />}
                {phase === 'ending'        && <EndingPage />}
              </ErrorBoundary>
            </main>
          </PhaseTransition>

          <Notifications />
          {DEV && <DevSkip visible={showDevTools} />}

          {/* Screen reader announcements */}
          <div aria-live="polite" className="sr-only" id="game-announcements" />
        </div>
      </DiscoveryFeedbackProvider>
    </ErrorBoundary>
  )
}
