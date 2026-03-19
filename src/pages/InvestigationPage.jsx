import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { GAME_DATA } from '../data/gameData'

import { ReadNode } from '../components/nodes/ReadNode'
import { NavigateNode } from '../components/nodes/NavigateNode'
import { TagNode } from '../components/nodes/TagNode'
import { InputNode } from '../components/nodes/InputNode'
import { SliderNode } from '../components/nodes/SliderNode'
import { BrowseNode } from '../components/nodes/BrowseNode'
import { ConnectNode } from '../components/nodes/ConnectNode'
import { TypewriterNode } from '../components/nodes/TypewriterNode'
import { OsintTipPanel } from '../components/OsintTipPanel'
import { IntercutOverlay } from '../components/IntercutOverlay'
import { SystemAlertFlash } from '../components/SystemAlertFlash'
import { SaveLoadModal } from '../components/SaveLoadModal'
import { EvidenceBoard } from '../components/EvidenceBoard'
import { CaseNotes } from '../components/CaseNotes'
import { InvestigationOnboarding } from '../components/InvestigationOnboarding'
import { PathIntro } from '../components/PathIntro'

const NODE_RENDERERS = {
  read: ReadNode,
  navigate: NavigateNode,
  tag: TagNode,
  input: InputNode,
  slider: SliderNode,
  browse: BrowseNode,
  connect: ConnectNode,
  typewriter: TypewriterNode,
}

const PATH_META = {
  A: { label: 'Digital Trail', color: '#4a90d9', dimColor: '#1a3a5a', icon: '💻' },
  B: { label: 'Private Notes', color: '#c0392b', dimColor: '#4a1818', icon: '📓' },
  C: { label: 'Public Record', color: '#d4a017', dimColor: '#4a3a08', icon: '📌' },
}

// Instructions for each node type
const NODE_INSTRUCTIONS = {
  read: { action: 'Scroll down to read', icon: '📄' },
  navigate: { action: 'Click to explore files', icon: '📁' },
  tag: { action: 'Flag suspicious items', icon: '🏷️' },
  input: { action: 'Type your answer', icon: '✏️' },
  slider: { action: 'Adjust sliders to reveal', icon: '🔍' },
  browse: { action: 'Click items to examine', icon: '🌐' },
  connect: { action: 'Link related evidence', icon: '🔗' },
  typewriter: { action: 'Watch carefully', icon: '⌨️' },
}

export default function InvestigationPage() {
  const {
    activePath, systemAlertShown, seenOsintTips, perfectPaths, nodeProgress,
    completePath, setPhase, unlockJournalist, markSystemAlert, markOsintTipSeen,
    saveGame, addNotification, addCaseSummary, setCurrentNodeIndex: storeSetNodeIndex,
  } = useGameStore(useShallow(s => ({
    activePath:       s.activePath,
    systemAlertShown: s.systemAlertShown,
    seenOsintTips:    s.seenOsintTips,
    perfectPaths:     s.perfectPaths,
    nodeProgress:     s.nodeProgress,
    completePath:     s.completePath,
    setPhase:         s.setPhase,
    unlockJournalist: s.unlockJournalist,
    markSystemAlert:  s.markSystemAlert,
    markOsintTipSeen: s.markOsintTipSeen,
    saveGame:         s.saveGame,
    addNotification:  s.addNotification,
    addCaseSummary:   s.addCaseSummary,
    setCurrentNodeIndex: s.setCurrentNodeIndex,
  })))

  const path = activePath || 'A'
  const pathData = GAME_DATA[path]
  const nodes = pathData?.nodes ?? []
  const meta = PATH_META[path]

  // Get saved node index or start at 0
  const savedIndex = nodeProgress[`${path}_index`] ?? 0
  const [currentNodeIndex, setCurrentNodeIndex] = useState(savedIndex)

  const [intercutText, setIntercutText] = useState(null)
  const [intercutVisible, setIntercutVisible] = useState(false)
  const [systemAlertTrigger, setSystemAlertTrigger] = useState(0)
  const [osintTip, setOsintTip] = useState(null)
  const [osintCollapsed, setOsintCollapsed] = useState(false)
  const [pathComplete, setPathComplete] = useState(false)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showCaseNotes, setShowCaseNotes] = useState(false)
  const [isReviewing, setIsReviewing] = useState(false) // When true, user is reviewing previous nodes
  const [highestReachedIndex, setHighestReachedIndex] = useState(savedIndex) // Track highest separately

  // Track which paths have shown their intro using localStorage
  const getPathIntroKey = (p) => `maya-path-intro-${p}`
  const hasSeenPathIntro = (p) => {
    try { return localStorage.getItem(getPathIntroKey(p)) === 'true' } catch { return false }
  }
  const markPathIntroSeen = (p) => {
    try { localStorage.setItem(getPathIntroKey(p), 'true') } catch {}
  }

  // Show path intro if this is first time on this path
  const [showPathIntro, setShowPathIntro] = useState(() => !hasSeenPathIntro(path))

  // Sync node index to store for save/load - only when advancing forward, not reviewing
  useEffect(() => {
    if (!isReviewing && currentNodeIndex > highestReachedIndex) {
      setHighestReachedIndex(currentNodeIndex)
      storeSetNodeIndex(currentNodeIndex)
    } else if (!isReviewing) {
      storeSetNodeIndex(currentNodeIndex)
    }
  }, [currentNodeIndex, isReviewing, highestReachedIndex, storeSetNodeIndex])

  // Quick save keyboard shortcut
  const handleQuickSave = useCallback(() => {
    saveGame(0)
    addNotification('Quick saved', 'success')
  }, [saveGame, addNotification])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleQuickSave()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleQuickSave])

  const currentNode = nodes[currentNodeIndex] ?? null

  const handleNodeComplete = () => {
    if (!currentNode) return

    // Add summary to case notes
    if (currentNode.title) {
      addCaseSummary(path, {
        id: currentNode.id,
        title: currentNode.title,
        text: currentNode.monologue || `Examined: ${currentNode.title}`,
        source: currentNode.tool || currentNode.type,
      })
    }

    // Journalist unlock
    if (currentNode.journalistUnlock) {
      unlockJournalist()
    }

    // System alert
    if (currentNode.systemAlertAfter && !systemAlertShown) {
      setSystemAlertTrigger(prev => prev + 1)
      markSystemAlert()
    }

    // Intercut overlay
    if (currentNode.intercutAfter) {
      setIntercutText(currentNode.intercutAfter)
      setIntercutVisible(true)
    }

    // OSINT tip for next node
    const nextIndex = currentNodeIndex + 1
    if (nextIndex < nodes.length) {
      const nextNode = nodes[nextIndex]
      if (nextNode?.osintTip && !seenOsintTips.includes(nextNode.osintTip.id)) {
        markOsintTipSeen(nextNode.osintTip.id)
        setOsintTip(nextNode.osintTip)
        setOsintCollapsed(false)
      }
    }

    // Advance or complete
    if (currentNodeIndex + 1 >= nodes.length) {
      completePath(path)
      setPathComplete(true)
    } else {
      setCurrentNodeIndex(prev => prev + 1)
    }
  }

  // Show first node's OSINT tip on mount
  useEffect(() => {
    const firstNodeTip = nodes[currentNodeIndex]?.osintTip
    if (!firstNodeTip) return
    const timer = setTimeout(() => {
      const seen = useGameStore.getState().seenOsintTips
      if (!seen.includes(firstNodeTip.id)) {
        markOsintTipSeen(firstNodeTip.id)
        setOsintTip(firstNodeTip)
        setOsintCollapsed(false)
      }
    }, 0)
    return () => clearTimeout(timer)
  }, [path, currentNodeIndex])

  const NodeRenderer = currentNode ? NODE_RENDERERS[currentNode.type] : null
  const isPerfect = perfectPaths[path]
  const instruction = currentNode ? NODE_INSTRUCTIONS[currentNode.type] : null

  // Navigation: use local highestReachedIndex so it doesn't get overwritten
  const canGoBack = currentNodeIndex > 0
  const canGoForward = currentNodeIndex < highestReachedIndex

  const handleNavBack = () => {
    if (canGoBack) {
      setCurrentNodeIndex(prev => prev - 1)
      setIsReviewing(true)
    }
  }

  const handleNavForward = () => {
    if (canGoForward) {
      setCurrentNodeIndex(prev => prev + 1)
      if (currentNodeIndex + 1 >= highestReachedIndex) {
        setIsReviewing(false)
      }
    }
  }

  const handleReturnToCurrent = () => {
    setCurrentNodeIndex(highestReachedIndex)
    setIsReviewing(false)
  }

  // Path complete screen
  if (pathComplete) {
    return (
      <div className="min-h-screen bg-[#08080e] flex flex-col items-center justify-center gap-6 p-8">
        <div className="text-5xl mb-2">{meta.icon}</div>
        <div
          className="font-mono text-xs tracking-[0.3em] uppercase"
          style={{ color: meta.dimColor }}
        >
          {meta.label}
        </div>
        <h1
          className="text-3xl sm:text-4xl font-black uppercase text-center"
          style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#c8b890' }}
        >
          Thread Complete
        </h1>
        {isPerfect && (
          <div
            className="flex items-center gap-2 px-4 py-2 border text-sm"
            style={{
              background: 'rgba(184, 134, 11, 0.1)',
              borderColor: '#b8860b',
              color: '#d4a84b',
            }}
          >
            <span>★</span>
            Perfect Investigation
          </div>
        )}
        <p
          className="text-base text-center max-w-md"
          style={{ fontFamily: "'Crimson Pro', serif", color: '#7a7268', fontStyle: 'italic' }}
        >
          Return to the apartment to explore the other threads. Each path reveals different pieces of the puzzle.
        </p>
        <button
          onClick={() => setPhase('apartment')}
          className="font-mono text-sm px-6 py-3 border-2 transition-all hover:bg-[#1a2030]"
          style={{ borderColor: '#4a90d9', color: '#4a90d9' }}
        >
          ← Return to Apartment
        </button>
      </div>
    )
  }

  return (
    <div className="crt h-screen bg-[#08080e] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-[#1a1a28] px-3 sm:px-4 py-3 flex items-center justify-between gap-2">
        <button
          onClick={() => setPhase('apartment')}
          className="font-mono text-xs sm:text-sm px-3 py-2 border-2 border-[#3a3a48] text-[#a0a098] hover:border-[#5a5a68] hover:text-[#d0d0c8] transition-all min-h-[44px]"
        >
          ← Back
        </button>

        {/* Path indicator */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{meta.icon}</span>
          <span
            className="font-mono text-xs sm:text-sm tracking-[0.1em] uppercase font-semibold hidden sm:inline"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {/* Progress */}
          <div className="font-mono text-xs px-2 py-1 bg-[#1a1a28] rounded" style={{ color: '#6a8aaa' }}>
            {currentNodeIndex + 1}/{nodes.length}
          </div>

          <button
            onClick={() => setShowCaseNotes(true)}
            className="font-mono text-xs px-3 py-2 border-2 min-h-[44px] transition-all"
            style={{
              borderColor: '#5a4030',
              color: '#c09070',
              background: 'rgba(58, 40, 32, 0.3)',
            }}
          >
            Notes
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="font-mono text-xs px-3 py-2 border-2 min-h-[44px] transition-all"
            style={{
              borderColor: '#4a6080',
              color: '#8aa0b8',
              background: 'rgba(42, 48, 64, 0.3)',
            }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Navigation bar - go back to previous discoveries */}
      {(canGoBack || isReviewing) && (
        <div
          className="shrink-0 px-4 py-2 flex items-center justify-between gap-2 border-b"
          style={{ background: '#0c0c14', borderColor: '#2a2a38' }}
        >
          <button
            onClick={handleNavBack}
            disabled={!canGoBack}
            className="font-mono text-xs px-3 py-2 border transition-all min-h-[40px]"
            style={{
              borderColor: canGoBack ? '#3a3a48' : '#1a1a28',
              color: canGoBack ? '#8a8a98' : '#3a3a48',
              background: 'transparent',
              cursor: canGoBack ? 'pointer' : 'default',
            }}
          >
            ← Previous
          </button>

          <div className="font-mono text-xs text-center" style={{ color: '#6a6a78' }}>
            {isReviewing ? (
              <span style={{ color: '#d4a017' }}>Reviewing: {currentNodeIndex + 1} / {nodes.length}</span>
            ) : (
              <span>Evidence {currentNodeIndex + 1} of {nodes.length}</span>
            )}
          </div>

          <div className="flex gap-2">
            {canGoForward && (
              <button
                onClick={handleNavForward}
                className="font-mono text-xs px-3 py-2 border transition-all min-h-[40px]"
                style={{
                  borderColor: '#3a3a48',
                  color: '#8a8a98',
                  background: 'transparent',
                }}
              >
                Next →
              </button>
            )}
            {isReviewing && (
              <button
                onClick={handleReturnToCurrent}
                className="font-mono text-xs px-3 py-2 border-2 transition-all min-h-[40px]"
                style={{
                  borderColor: meta.color,
                  color: meta.color,
                  background: `${meta.color}15`,
                }}
              >
                Return to Current
              </button>
            )}
          </div>
        </div>
      )}

      {/* Task instruction bar - always visible, prominent */}
      {instruction && !isReviewing && (
        <div
          className="shrink-0 px-4 py-4 flex items-center justify-center gap-4 border-b-2"
          style={{
            background: `linear-gradient(90deg, ${meta.color}20, ${meta.color}08)`,
            borderColor: meta.color,
          }}
        >
          <div
            className="flex items-center justify-center w-12 h-12 rounded-lg"
            style={{ background: `${meta.color}25`, border: `2px solid ${meta.color}50` }}
          >
            <span className="text-2xl">{instruction.icon}</span>
          </div>
          <div>
            <div
              className="font-mono text-[10px] tracking-[0.2em] uppercase mb-1"
              style={{ color: meta.color }}
            >
              Your Task
            </div>
            <div
              className="text-base font-semibold"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#e8e0d0', letterSpacing: '0.02em' }}
            >
              {instruction.action}
            </div>
          </div>
        </div>
      )}

      {/* Review mode indicator */}
      {isReviewing && (
        <div
          className="shrink-0 px-4 py-3 flex items-center justify-center gap-3 border-b"
          style={{
            background: 'rgba(212, 160, 23, 0.1)',
            borderColor: '#d4a01750',
          }}
        >
          <span className="text-lg">📖</span>
          <div className="font-mono text-sm" style={{ color: '#d4a017' }}>
            Reviewing previous evidence — read-only mode
          </div>
        </div>
      )}

      {/* Node header */}
      {currentNode && (
        <div className="shrink-0 px-4 sm:px-6 py-4 border-b border-[#1a1a28] bg-[#0a0a12]/50">
          {currentNode.timestamp && (
            <div
              className="font-mono text-xs tracking-[0.15em] uppercase mb-2"
              style={{
                color: currentNode.timestamp.urgent ? '#e04040' : '#6a8aaa',
                fontWeight: currentNode.timestamp.urgent ? 600 : 400,
              }}
            >
              {currentNode.timestamp.urgent ? '⚠ ' : ''}{currentNode.timestamp.text}
            </div>
          )}
          <div className="flex items-baseline justify-between gap-4 flex-wrap">
            <h2
              className="text-lg sm:text-xl font-semibold"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#d8d0c0' }}
            >
              {currentNode.title}
            </h2>
            {currentNode.tool && (
              <span className="font-mono text-[10px] px-2 py-1 bg-[#2a2a38] text-[#6a6a78] rounded uppercase tracking-wider">
                {currentNode.tool}
              </span>
            )}
          </div>
          {currentNode.monologue && (
            <p
              className="text-base mt-3 leading-relaxed"
              style={{ fontFamily: "'Crimson Pro', serif", color: '#a89888', fontStyle: 'italic' }}
            >
              {currentNode.monologue}
            </p>
          )}
        </div>
      )}

      {/* Node content */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {NodeRenderer && currentNode && (
          <NodeRenderer
            key={`${currentNode.id}-${isReviewing ? 'review' : 'active'}`}
            content={currentNode.content}
            onComplete={isReviewing ? handleReturnToCurrent : handleNodeComplete}
            onJournalistUnlock={unlockJournalist}
            onCinematicTrigger={() => setCurrentNodeIndex(prev => prev + 1)}
            isReviewing={isReviewing}
          />
        )}
      </div>

      {/* Evidence Board */}
      <EvidenceBoard />

      {/* OSINT Tip Panel */}
      {osintTip && (
        <OsintTipPanel
          tip={osintTip}
          collapsed={osintCollapsed}
          onDismiss={() => setOsintCollapsed(true)}
          onReopen={() => setOsintCollapsed(false)}
        />
      )}

      {/* Intercut overlay */}
      <IntercutOverlay
        text={intercutText}
        visible={intercutVisible}
        onDismiss={() => {
          setIntercutVisible(false)
          setIntercutText(null)
        }}
      />

      {/* System alert */}
      <SystemAlertFlash trigger={systemAlertTrigger} />

      {/* Save modal */}
      {showSaveModal && (
        <SaveLoadModal mode="save" onClose={() => setShowSaveModal(false)} />
      )}

      {/* Case Notes */}
      {showCaseNotes && (
        <CaseNotes onClose={() => setShowCaseNotes(false)} />
      )}

      {/* Path-specific intro */}
      {showPathIntro && (
        <PathIntro
          path={path}
          onContinue={() => {
            markPathIntroSeen(path)
            setShowPathIntro(false)
          }}
        />
      )}

      {/* General onboarding (first time only) */}
      <InvestigationOnboarding />
    </div>
  )
}
