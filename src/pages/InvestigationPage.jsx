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
import { SystemAlertFlash } from '../components/SystemAlertFlash'
import { SaveLoadModal } from '../components/SaveLoadModal'
import { EvidenceBoard } from '../components/EvidenceBoard'
import { CaseNotes } from '../components/CaseNotes'
import { InvestigationOnboarding } from '../components/InvestigationOnboarding'
import { PathIntro } from '../components/PathIntro'

const NODE_RENDERERS = {
  read: ReadNode, navigate: NavigateNode, tag: TagNode, input: InputNode,
  slider: SliderNode, browse: BrowseNode, connect: ConnectNode, typewriter: TypewriterNode,
}

const PATH_META = {
  A: { label: 'Digital Trail', color: '#4a90d9', dimColor: '#1a3a5a', icon: '💻' },
  B: { label: 'Private Notes', color: '#c0392b', dimColor: '#4a1818', icon: '📓' },
  C: { label: 'Public Record', color: '#d4a017', dimColor: '#4a3a08', icon: '📌' },
}

const NODE_INSTRUCTIONS = {
  read: { action: 'Scroll down to read', icon: '📄' }, navigate: { action: 'Click to explore files', icon: '📁' },
  tag: { action: 'Flag suspicious items', icon: '🏷️' }, input: { action: 'Type your answer', icon: '✏️' },
  slider: { action: 'Adjust sliders to reveal', icon: '🔍' }, browse: { action: 'Click items to examine', icon: '🌐' },
  connect: { action: 'Link related evidence', icon: '🔗' }, typewriter: { action: 'Watch carefully', icon: '⌨️' },
}

function EvidenceBoardButton({ onClick }) {
  const evidence = useGameStore(s => s.evidence)
  const count = evidence.length
  return (
    <button
      onClick={onClick}
      className="font-mono text-xs px-3 py-2 min-h-[44px] transition-all flex items-center gap-1.5 opacity-70 hover:opacity-100"
      style={{ color: count > 0 ? '#d4a84b' : '#6a6a78' }}
    >
      {count > 0 && (
        <span className="flex items-center justify-center rounded-full w-4 h-4 text-[9px] font-bold bg-[#c0392b] text-white">
          {count}
        </span>
      )}
      Board
    </button>
  )
}

export default function InvestigationPage() {
  const {
    activePath, systemAlertShown, perfectPaths, paths,
    completePath, setPhase, unlockJournalist, markSystemAlert,
    saveGame, addNotification, addCaseSummary,
    currentNodeId, openNode, closeNode, completeNode
  } = useGameStore(useShallow(s => ({
    activePath:       s.activePath,
    systemAlertShown: s.systemAlertShown,
    perfectPaths:     s.perfectPaths,
    paths:            s.paths,
    completePath:     s.completePath,
    setPhase:         s.setPhase,
    unlockJournalist: s.unlockJournalist,
    markSystemAlert:  s.markSystemAlert,
    saveGame:         s.saveGame,
    addNotification:  s.addNotification,
    addCaseSummary:   s.addCaseSummary,
    currentNodeId:    s.currentNodeId,
    openNode:         s.openNode,
    closeNode:        s.closeNode,
    completeNode:     s.completeNode,
  })))

  const path = activePath || 'A'
  const pathData = GAME_DATA[path]
  const nodes = pathData?.nodes ?? []
  const meta = PATH_META[path]
  
  const activePathState = paths[path]
  const unlockedNodeIds = activePathState?.unlockedNodes || []
  const completedNodeIds = activePathState?.completedNodes || []
  
  // When all nodes inside the path are completed -> thread is done
  const pathComplete = nodes.length > 0 && completedNodeIds.length === nodes.length

  const [systemAlertTrigger, setSystemAlertTrigger] = useState(0)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showCaseNotes, setShowCaseNotes] = useState(false)
  const [showEvidenceBoard, setShowEvidenceBoard] = useState(false)

  // Track intro
  const getPathIntroKey = (p) => `maya-path-intro-${p}-v2`
  const hasSeenPathIntro = (p) => { try { return localStorage.getItem(getPathIntroKey(p)) === 'true' } catch { return false } }
  const markPathIntroSeen = (p) => { try { localStorage.setItem(getPathIntroKey(p), 'true') } catch {} }
  const [showPathIntro, setShowPathIntro] = useState(() => !hasSeenPathIntro(path))

  const handleQuickSave = useCallback(() => {
    saveGame(0)
    addNotification('Quick saved', 'success')
  }, [saveGame, addNotification])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleQuickSave() }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleQuickSave])

  const currentNode = currentNodeId ? nodes.find(n => n.id === currentNodeId) : null

  const handleNodeComplete = () => {
    if (!currentNode) return

    if (currentNode.title && !completedNodeIds.includes(currentNode.id)) {
      addCaseSummary(path, {
        id: currentNode.id, title: currentNode.title,
        text: currentNode.monologue || `Examined: ${currentNode.title}`,
        source: currentNode.tool || currentNode.type,
      })
    }

    if (currentNode.journalistUnlock) {
      unlockJournalist()
      addNotification("Rosa Velasquez. Maya wrote this after everything else. 'She'll understand.'", 'info')
    }
    if (currentNode.systemAlertAfter && !systemAlertShown) { setSystemAlertTrigger(prev => prev + 1); markSystemAlert() }

    // Commit completion and unlock next wave
    completeNode(path, currentNode.id, currentNode.unlocks || [])

    // Give a brief delay before closing so the final flash/animation resolves
    if (currentNode.type !== 'typewriter') {
      setTimeout(() => closeNode(), 600)
    } else {
      closeNode()
    }
  }

  // Path complete modal triggering
  useEffect(() => {
    if (pathComplete && !activePathState.completed && !currentNode) {
      completePath(path)
    }
  }, [pathComplete, activePathState.completed, currentNode, completePath, path])

  const NodeRenderer = currentNode ? NODE_RENDERERS[currentNode.type] : null
  const instruction = currentNode ? NODE_INSTRUCTIONS[currentNode.type] : null
  
  // RENDER COMPLETE PAGE
  if (activePathState?.completed && !currentNodeId) {
    return (
      <div className="min-h-screen bg-[#08080e] flex flex-col items-center justify-center gap-6 p-8 crt">
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
        {perfectPaths[path] && (
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
          className="font-mono text-sm px-6 py-3 transition-all hover:opacity-100 opacity-70"
          style={{ color: '#4a90d9' }}
        >
          ← Return to Apartment
        </button>
      </div>
    )
  }

  return (
    <div className="crt h-screen bg-[#08080e] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="shrink-0 border-b border-[#1a1a28] px-3 sm:px-4 py-3 relative flex items-center justify-between z-10">
        <button
          onClick={() => currentNode ? closeNode() : setPhase('apartment')}
          className="font-mono text-xs sm:text-sm px-3 py-2 text-[#a0a098] hover:text-[#d0d0c8] transition-all min-h-[44px] opacity-70 hover:opacity-100"
        >
          ← {currentNode ? 'Desktop' : 'Back'}
        </button>

        {/* Path indicator - Absolute centering */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 pointer-events-none">
          <span style={{ fontSize: '18px', lineHeight: '1', display: 'inline-block' }}>{meta.icon}</span>
          <span
            className="font-mono text-xs sm:text-sm tracking-[0.1em] uppercase font-semibold hidden sm:inline"
            style={{ color: meta.color }}
          >
            {meta.label}
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1 sm:gap-2">
          <div className="font-mono text-xs px-2 py-1 bg-[#1a1a28] rounded" style={{ color: '#6a8aaa' }}>
            {completedNodeIds.length}/{nodes.length}
          </div>

          <EvidenceBoardButton onClick={() => setShowEvidenceBoard(true)} />

          <button
            onClick={() => setShowCaseNotes(true)}
            className="font-mono text-xs px-3 py-2 min-h-[44px] transition-all opacity-70 hover:opacity-100"
            style={{ color: '#c09070' }}
          >
            Notes
          </button>

          <button
            onClick={() => setShowSaveModal(true)}
            className="font-mono text-xs px-3 py-2 min-h-[44px] transition-all opacity-70 hover:opacity-100"
            style={{ color: '#8aa0b8' }}
          >
            Save
          </button>
        </div>
      </div>

      {/* Task instruction bar */}
      {instruction && currentNode && (
        <div
          className="shrink-0 px-3 py-1.5 flex items-center gap-2 border-b"
          style={{ background: `${meta.color}12`, borderColor: `${meta.color}40` }}
        >
          <span className="text-sm shrink-0">{instruction.icon}</span>
          <span className="font-mono text-[11px] tracking-[0.12em] uppercase" style={{ color: meta.color }}>
            {instruction.action}
          </span>
        </div>
      )}

      {/* Node content OR Desktop View */}
      {currentNode ? (
        <div className="flex-1 overflow-hidden relative flex flex-col min-h-0 animate-in fade-in duration-300">
          <div className="shrink-0 px-3 sm:px-6 py-2 sm:py-3 border-b border-[#1a1a28] bg-[#0a0a12]/50">
            {currentNode.timestamp && (
              <div className="font-mono text-[10px] tracking-[0.15em] uppercase mb-1" style={{ color: currentNode.timestamp.urgent ? '#e04040' : '#6a8aaa' }}>
                {currentNode.timestamp.urgent ? '⚠ ' : ''}{currentNode.timestamp.text}
              </div>
            )}
            <div className="flex items-baseline justify-between gap-2 flex-wrap">
              <h2 className="text-base sm:text-xl font-semibold" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#d8d0c0' }}>
                {currentNode.title}
              </h2>
              {currentNode.tool && (
                <span className="font-mono text-[10px] px-2 py-0.5 bg-[#2a2a38] text-[#6a6a78] rounded uppercase tracking-wider">
                  {currentNode.tool}
                </span>
              )}
            </div>
            {currentNode.monologue && (
              <p className="hidden sm:block text-sm mt-2 leading-relaxed" style={{ fontFamily: "'Crimson Pro', serif", color: '#a89888', fontStyle: 'italic' }}>
                {currentNode.monologue}
              </p>
            )}
          </div>
          {NodeRenderer && (
             <NodeRenderer
               key={`${currentNode.id}-${completedNodeIds.includes(currentNode.id) ? 'review' : 'active'}`}
               content={currentNode.content}
               onComplete={handleNodeComplete}
               onJournalistUnlock={unlockJournalist}
               onCinematicTrigger={() => {}}
               isReviewing={completedNodeIds.includes(currentNode.id)}
             />
          )}
        </div>
      ) : (
        <div className="flex-1 p-6 overflow-y-auto bg-[#050508] animate-in fade-in duration-300">
           <div className="max-w-4xl mx-auto">
             <div className="mb-8 p-4 border border-[#1a1a28] bg-[#0a0a12]/30 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                   <h2 className="font-mono text-sm tracking-widest text-[#d8d0c0] uppercase">{meta.label} // Desktop</h2>
                   <p className="font-mono text-xs text-[#5a5a68] mt-1">Investigate leads in any order to form connections.</p>
                </div>
                <div className="font-mono text-xs text-[#8a8a98] px-3 py-1">
                   {unlockedNodeIds.filter(id => {
                     const n = nodes.find(nn => nn.id === id)
                     if (!n || completedNodeIds.includes(id)) return false
                     const req = n.requiresCompleted
                     return !req || paths[req.path]?.completedNodes?.includes(req.nodeId)
                   }).length} ACTIVE LEADS
                </div>
             </div>
             
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
               {unlockedNodeIds.map(nodeId => {
                 const node = nodes.find(n => n.id === nodeId)
                 if (!node) return null
                 const isCompleted = completedNodeIds.includes(nodeId)
                 const nodeInst = NODE_INSTRUCTIONS[node.type]

                 // Cross-path lock check
                 const req = node.requiresCompleted
                 const isLocked = req && !paths[req.path]?.completedNodes?.includes(req.nodeId)

                 if (isLocked) {
                   return (
                     <div
                       key={nodeId}
                       className="flex flex-col items-center justify-center p-6 border text-center gap-3 relative"
                       style={{
                         borderColor: '#1e1e26',
                         background: 'rgba(10,10,14,0.7)',
                         opacity: 0.55,
                       }}
                     >
                       <span className="text-3xl" style={{ filter: 'grayscale(100%) opacity(40%)' }}>🔒</span>
                       <div>
                         <div className="font-mono text-xs font-semibold mb-2" style={{ color: '#5a5a68' }}>
                           {node.title}
                         </div>
                         <div className="font-mono text-[9px] leading-relaxed" style={{ color: '#4a4a58' }}>
                           {req.hint}
                         </div>
                       </div>
                     </div>
                   )
                 }

                 return (
                   <button
                     key={nodeId}
                     onClick={() => openNode(nodeId)}
                     className="flex flex-col items-center justify-center p-6 border transition-all text-center gap-4 relative group hover:-translate-y-1 hover:shadow-lg"
                     style={{
                       borderColor: isCompleted ? '#2a3a3a' : '#2a2a38',
                       background: isCompleted ? 'rgba(26,58,42,0.1)' : 'rgba(20,20,30,0.6)',
                       boxShadow: !isCompleted ? 'inset 0 0 20px rgba(0,0,0,0.5)' : 'none'
                     }}
                   >
                     {!isCompleted && (
                       <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[#d4a017] animate-pulse shadow-[0_0_8px_#d4a017]" />
                     )}
                     <span
                        className="text-4xl transition-all"
                        style={{ filter: isCompleted ? 'grayscale(100%) opacity(60%)' : 'drop-shadow(0 0 10px rgba(255,255,255,0.1))' }}
                     >
                       {isCompleted ? '✓' : (nodeInst?.icon || '📄')}
                     </span>
                     <div>
                        <div className="font-mono text-xs font-semibold mb-1" style={{ color: isCompleted ? '#6a8a7a' : '#d8d8e0' }}>
                          {node.title}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-wider" style={{ color: '#5a5a68' }}>
                          {node.tool}
                        </div>
                     </div>
                   </button>
                 )
               })}
             </div>
           </div>
        </div>
      )}

      <EvidenceBoard isOpen={showEvidenceBoard} onClose={() => setShowEvidenceBoard(false)} />

      <SystemAlertFlash trigger={systemAlertTrigger} />
      {showSaveModal && <SaveLoadModal mode="save" onClose={() => setShowSaveModal(false)} />}
      {showCaseNotes && <CaseNotes onClose={() => setShowCaseNotes(false)} />}
      {showPathIntro && <PathIntro path={path} onContinue={() => { markPathIntroSeen(path); setShowPathIntro(false) }} />}
      <InvestigationOnboarding />
    </div>
  )
}
