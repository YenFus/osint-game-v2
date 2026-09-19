import { useState, useEffect, lazy, Suspense, useSyncExternalStore } from 'react'
import { Announcer } from './components/Announcer'
import { useAccessibilityStore } from './store/accessibilityStore'
import { useGameStore } from './store/gameStore'
import MainMenuPage from './pages/MainMenuPage'
import Notifications from './components/Notifications'
import { AudioManager } from './components/AudioManager'
import { ErrorBoundary } from './components/ErrorBoundary'
import { PhaseTransition } from './components/PhaseTransition'
import { DiscoveryFeedbackProvider } from './components/DiscoveryFeedback'

// Everything past the menu is split out: the title screen used to ship
// the case board, all six lead renderers, the case data and every ending
// in one 518 kB chunk before a player had clicked anything.
const StoryPage = lazy(() => import('./pages/StoryPage'))
const ApartmentPage = lazy(() => import('./pages/ApartmentPage'))
const InvestigationPage = lazy(() => import('./pages/InvestigationPage'))
const ConvergencePage = lazy(() => import('./pages/ConvergencePage'))
const EndingPage = lazy(() => import('./pages/EndingPage'))

// A phase change already fades to black behind the transition card, so
// the loading state is that black rather than a spinner.
const PhaseFallback = () => <div style={{ position: 'fixed', inset: 0, background: '#08080e' }} />

const DEV = import.meta.env.DEV

// The store exposed shouldReduceMotion()/getEffectiveGraphicsQuality(), but
// App wrote the raw settings to <html>: the OS reduce-motion preference was
// ignored entirely, and "auto" graphics — the default — stamped
// data-graphics="auto", which no stylesheet matches, so the quality
// auto-detect never lowered anything on a weak device.
const motionQuery = typeof window !== 'undefined' && window.matchMedia
  ? window.matchMedia('(prefers-reduced-motion: reduce)')
  : null
const subscribeMotion = (cb) => {
  if (!motionQuery) return () => {}
  motionQuery.addEventListener('change', cb)
  return () => motionQuery.removeEventListener('change', cb)
}
const systemReducedMotion = () => !!motionQuery?.matches

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
        fontSize: 12,
        color: '#666',
        marginBottom: 4,
        textAlign: 'center',
      }}>
        DEV TOOLS (F12 to hide)
      </div>
      {phases.map(p => (
        <button key={p} onClick={() => setPhase(p)}
          style={{
            fontFamily:'monospace', fontSize: 12, padding:'4px 8px',
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
  // Accessibility preferences were persisted but never applied. These
  // land on <html> so stylesheets can respond to them.
  const a11y = useAccessibilityStore()
  const osReducedMotion = useSyncExternalStore(subscribeMotion, systemReducedMotion, () => false)
  useEffect(() => {
    const el = document.documentElement
    el.dataset.fontSize = a11y.fontSize
    el.dataset.contrast = a11y.highContrast ? 'high' : 'normal'
    el.dataset.motion = (a11y.reducedMotion || osReducedMotion) ? 'reduced' : 'normal'
    el.dataset.graphics = useAccessibilityStore.getState().getEffectiveGraphicsQuality()
  }, [a11y.fontSize, a11y.highContrast, a11y.reducedMotion, a11y.graphicsQuality, osReducedMotion])

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
          {/* Only the board has a nav landmark to jump to. This link shipped on
              every screen pointing at an id that has never existed anywhere. */}
          {phase === 'investigation' && (
            <a href="#navigation" className="skip-link" style={{ left: 150 }}>Skip to navigation</a>
          )}

          {/* Audio manager - handles ambient sound */}
          <AudioManager />

          <PhaseTransition phase={phase}>
            <main id="main-content">
              <ErrorBoundary onReset={() => setPhase('menu')}>
                <Suspense fallback={<PhaseFallback />}>
                {phase === 'menu'          && <MainMenuPage />}
                {phase === 'story'         && <StoryPage />}
                {phase === 'apartment'     && <ApartmentPage />}
                {phase === 'investigation' && <InvestigationPage />}
                {phase === 'convergence'   && <ConvergencePage />}
                {phase === 'ending'        && <EndingPage />}
                </Suspense>
              </ErrorBoundary>
            </main>
          </PhaseTransition>

          <Notifications />
          {DEV && <DevSkip visible={showDevTools} />}

          {/* Screen reader announcements */}
          <Announcer />
        </div>
      </DiscoveryFeedbackProvider>
    </ErrorBoundary>
  )
}
