import { useState, useEffect, useCallback, useRef} from 'react'
import { useModalFocus } from '../hooks/useModalFocus'
import { useGameStore } from '../store/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { GAME_DATA } from '../data/gameData'
import { withMeta } from '../data/leadMeta'
import { LEAD_TIME_COST, HINT_COST, THREAD_INFO as THREADS, NAME_CLUES } from '../data/caseData'
import { useAudio } from '../hooks/useAudio'
import '../styles/skins.css'

import { NavigateNode } from '../components/nodes/NavigateNode'
import { TagNode } from '../components/nodes/TagNode'
import { InputNode } from '../components/nodes/InputNode'
import { SliderNode } from '../components/nodes/SliderNode'
import { BrowseNode } from '../components/nodes/BrowseNode'
import { ConnectNode } from '../components/nodes/ConnectNode'
import { MapNode } from '../components/nodes/MapNode'
import { TimelineNode } from '../components/nodes/TimelineNode'
import { CompareNode } from '../components/nodes/CompareNode'
import { DiffNode } from '../components/nodes/DiffNode'
import { PhraseNode } from '../components/nodes/PhraseNode'
import { SystemAlertFlash } from '../components/SystemAlertFlash'
import { SaveLoadModal } from '../components/SaveLoadModal'
import { CaseNotes } from '../components/CaseNotes'
import { CaseBoard } from '../components/board/CaseBoard'
import { RayPhone } from '../components/board/RayPhone'
import { PolaroidArt } from '../components/board/PolaroidArt'
import { NameRevealCard } from '../components/board/NameRevealCard'
import { ClueCard } from '../components/board/ClueCard'

const NODE_RENDERERS = {
  navigate: NavigateNode, tag: TagNode, input: InputNode,
  slider: SliderNode, browse: BrowseNode, connect: ConnectNode,
  map: MapNode, timeline: TimelineNode, compare: CompareNode, diff: DiffNode, phrase: PhraseNode,
}

// The edge label names the object this thread came out of. Thread A is
// the laptop; it used to be labelled as the corkboard on all ten leads.
const PANEL_LABEL = {
  A: 'Case file · Maya\'s laptop',
  B: 'Case file · Maya\'s notebook',
  C: 'Case file · Maya\'s corkboard',
}

const NODE_INSTRUCTIONS = {
  navigate: 'Open the files that matter',
  tag: 'Flag what Maya would have circled — wrong flags cost time', input: 'Type what you found',
  slider: 'Recover the burned ink', browse: 'Dig through it — flag what matters',
  connect: 'Link cards that share a fact',
  map: 'Put each photograph where it was taken', timeline: 'Put each photograph on its hour',
  compare: 'Link the details that confirm each other',
  diff: 'Two captures of the same page — mark what changed',
  phrase: 'Mark the words that were never public',
}

function FieldManual({ tip, onClose }) {
  return (
    <div className="lo-manual" role="dialog" aria-label="OSINT field manual">
      <div className="flex justify-between items-start mb-3">
        <div>
          <div className="font-mono text-[12px] tracking-[0.25em] uppercase text-[#6a90c8]">Field manual · real technique</div>
          <h3 className="text-xl font-bold mt-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#d8e4f4' }}>{tip.title}</h3>
        </div>
        <button onClick={onClose} className="cb-btn" style={{ minHeight: 32, padding: '4px 10px' }} aria-label="Close field manual">✕</button>
      </div>
      <p className="text-[15px] leading-relaxed text-[#b8c4d4]" style={{ fontFamily: "'Crimson Pro', serif" }}>{tip.body}</p>
      {tip.steps && (
        <ol className="mt-4 space-y-2">
          {tip.steps.map((st, i) => (
            <li key={i} className="flex gap-3 text-sm text-[#c8d4e4]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              <span className="font-mono text-[#6a90c8]">{i + 1}.</span>{st}
            </li>
          ))}
        </ol>
      )}
      {tip.tools && (
        <div className="mt-5">
          <div className="font-mono text-[12px] tracking-[0.2em] uppercase text-[#6a90c8] mb-2">Tools investigators use</div>
          <div className="flex flex-wrap gap-2">
            {tip.tools.map(t => <span key={t} className="font-mono text-[12px] px-2 py-1 border border-[#2a3a5a] text-[#9ab0d0]">{t}</span>)}
          </div>
        </div>
      )}
      {tip.warning && (
        <div className="mt-5 p-3 border-l-2 border-[#c0a040] bg-[#1a1808] text-sm text-[#d8c890]" style={{ fontFamily: "'Crimson Pro', serif" }}>⚠ {tip.warning}</div>
      )}
    </div>
  )
}

function LeadOverlay({ node, pathKey, isReviewing, onClose, onComplete, onJournalistUnlock }) {
  const dialogRef = useRef(null)
  useModalFocus(dialogRef)
  const buyHint = useGameStore(s => s.buyHint)
  const { playSFX } = useAudio()
  const [hintShown, setHintShown] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  // Every lead opens on a short briefing: what you already know, where each
  // fact came from, and what you're about to do. Then the puzzle gets the
  // whole screen. The player said each screen asked them to read too much at
  // once. The header used to stack Thomas's line, the task and every fact
  // above a puzzle that needs reading of its own. A lead you've finished, or
  // one you've already started, goes straight to the work.
  const hasProgress = useGameStore(s => !!s.nodeProgress?.[node.id])
  const [stage, setStage] = useState(() => (isReviewing || hasProgress ? 'work' : 'brief'))
  const [factsOpen, setFactsOpen] = useState(false)
  // focus Start without scrolling it into view: autoFocus scrolled a short
  // phone's briefing and pushed "← Board" off the top
  const startRef = useRef(null)
  useEffect(() => { if (stage === 'brief') startRef.current?.focus({ preventScroll: true }) }, [stage])
  const Renderer = NODE_RENDERERS[node.type]
  const task = node.content?.prompt ?? NODE_INSTRUCTIONS[node.type]

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') { if (manualOpen) setManualOpen(false); else onClose() } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [manualOpen, onClose])

  const takeHint = () => {
    if (hintShown) return
    if (!isReviewing) buyHint(pathKey)
    setHintShown(true)
  }

  const facts = node.brief?.length > 0 && (
    <ol className="lob-facts">
      {node.brief.map((b, i) => (
        <li key={i}><span className="f">{b.fact}</span><span className="s">from {b.from}</span></li>
      ))}
    </ol>
  )

  return (
    <div ref={dialogRef} className="lo-root" role="dialog" aria-modal="true" aria-label={node.title}>
      <div className={`lo-panel skin-${pathKey}`} data-label={PANEL_LABEL[pathKey]}>
        {stage === 'brief' ? (
          <div className="lob">
            <button onClick={onClose} className="lo-back lob-back font-mono text-xs text-[#a09888] hover:text-[#f0e0c0] uppercase tracking-[0.15em]">← Board</button>
            <div className="lob-inner">
              <div className="lob-top">
                <div className="lob-card"><PolaroidArt scene={node.card?.scene ?? 'document'} /></div>
                <div className="min-w-0">
                  <div className="lob-k" style={{ color: node.timestamp?.urgent ? '#e04a3a' : undefined }}>
                    {THREADS[pathKey].title}{node.timestamp?.text ? ` · ${node.timestamp.text}` : ''}
                  </div>
                  <h2 className="lob-title">{node.title}</h2>
                </div>
              </div>
              {node.monologue && <p className="lob-mono">{node.monologue}</p>}
              {facts && (
                <section className="lob-sec" aria-label="What you know">
                  <div className="lob-sub">What you know</div>
                  {facts}
                </section>
              )}
              <div className="lob-task"><span>Your job</span>{task}</div>
              {/* on a phone only the button is pinned; the task scrolls with the
                  facts, so the footer no longer sits on top of fact 2 */}
              <div className="lob-go">
                <button type="button" className="lob-start" onClick={() => { playSFX('pageTurn'); setStage('work') }} ref={startRef}>Start</button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="lo-head">
              <div className="lo-card hidden sm:block"><PolaroidArt scene={node.card?.scene ?? 'document'} /></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <button onClick={onClose} className="lo-back font-mono text-xs text-[#a09888] hover:text-[#f0e0c0] uppercase tracking-[0.15em]">← Board</button>
                </div>
                <h2 className="text-lg sm:text-2xl font-semibold leading-tight mt-1" style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: '#ecdfc4' }}>
                  {node.title}
                </h2>
                <div className="font-mono text-[12px] tracking-[0.14em] uppercase mt-1 text-[#d4a84b]">▸ {task}</div>
              </div>
              <div className="lo-tools">
                {(facts || node.monologue) && (
                  <button className="cb-btn" aria-expanded={factsOpen} onClick={() => setFactsOpen(o => !o)}>
                    {factsOpen ? 'Hide briefing' : 'Briefing'}
                  </button>
                )}
                {node.osintTip && (
                  <button className="cb-btn" style={{ color: '#8ab0e0', borderColor: '#2a3a5a' }} onClick={() => setManualOpen(o => !o)}><span className="lo-long">Field </span>manual</button>
                )}
                {node.hint && (
                  <button className="cb-btn" style={{ color: hintShown ? '#6a6050' : '#e8c870', borderColor: '#4a3a18' }} onClick={takeHint} disabled={hintShown}>
                    {hintShown ? 'Hint shown' : isReviewing ? 'Hint' : <>Hint · +{HINT_COST}<span className="lo-long"> min</span></>}
                  </button>
                )}
              </div>
            </div>
            {factsOpen && (
              <div className="lo-facts" role="region" aria-label="Briefing">
                {node.monologue && <p className="lo-facts-mono">{node.monologue}</p>}
                {facts}
              </div>
            )}
            {hintShown && <div className="lo-hint" role="status"><span className="lo-hint-k">Hint</span> {node.hint}</div>}
            <div className={`flex-1 min-h-0 flex flex-col overflow-hidden relative src-skin ${node.skin ? `skin-${node.skin}` : ''}`} data-source={node.sourceLabel}>
              {Renderer && (
                <Renderer
                  key={`${node.id}-${isReviewing ? 'review' : 'active'}`}
                  content={node.content}
                  nodeId={isReviewing ? null : node.id}
                  onComplete={onComplete}
                  onJournalistUnlock={onJournalistUnlock}
                  onCinematicTrigger={() => {}}
                  isReviewing={isReviewing}
                />
              )}
              {manualOpen && node.osintTip && <FieldManual tip={node.osintTip} onClose={() => setManualOpen(false)} />}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default function InvestigationPage() {
  const st = useGameStore(useShallow(s => ({
    activePath: s.activePath, currentNodeId: s.currentNodeId, paths: s.paths,
    systemAlertShown: s.systemAlertShown, clues: s.clues, rayBeatPending: s.rayBeatPending,
    nameRevealSeen: s.nameRevealSeen, namePending: s.namePending,
  })))
  // while the name is landing, nothing else is allowed on screen
  const revealPending = (st.namePending || st.clues.some(id => NAME_CLUES.includes(id))) && !st.nameRevealSeen
  const actions = useGameStore(useShallow(s => ({
    setPhase: s.setPhase, openNode: s.openNode, closeNode: s.closeNode, completeNode: s.completeNode,
    addCaseSummary: s.addCaseSummary, addTime: s.addTime, addClue: s.addClue, addSuspicion: s.addSuspicion,
    unlockJournalist: s.unlockJournalist, markSystemAlert: s.markSystemAlert, addNotification: s.addNotification,
    saveGame: s.saveGame, checkRayBeat: s.checkRayBeat, answerRayBeat: s.answerRayBeat,
    markNameRevealSeen: s.markNameRevealSeen,
  })))
  const { playSFX } = useAudio()

  const [systemAlertTrigger, setSystemAlertTrigger] = useState(0)
  // notes waiting to be shown, in the order the leads gave them
  const [clueQueue, setClueQueue] = useState([])
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showJournal, setShowJournal] = useState(false)

  const pathKey = st.activePath
  const node = pathKey && st.currentNodeId
    ? withMeta(GAME_DATA[pathKey].nodes.find(n => n.id === st.currentNodeId))
    : null
  const isReviewing = !!node && st.paths[pathKey].completedNodes.includes(node.id)

  const handleQuickSave = useCallback(() => {
    actions.saveGame(0)
    actions.addNotification('Quick saved', 'success')
  }, [actions])

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); handleQuickSave() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [handleQuickSave])

  // A save can be loaded mid-beat; make sure pending beats surface
  useEffect(() => { if (!node) actions.checkRayBeat() }, [node, actions])

  const handleNodeComplete = () => {
    if (!node) return
    if (isReviewing) { actions.closeNode(); return }

    actions.addCaseSummary(pathKey, {
      id: node.id, title: node.title,
      text: node.summary ?? node.monologue ?? `Examined: ${node.title}`,
      source: node.tool,
    })
    actions.addTime(LEAD_TIME_COST[node.type] ?? 15, 'lead')
    // what finishing this puts on the board, so the card can say where to go next
    const opened = (node.unlocks || [])
      .filter(id => !st.paths[pathKey].unlockedNodes.includes(id))
      .map(id => GAME_DATA[pathKey].nodes.find(n => n.id === id))
      .filter(Boolean)
      .map(n => {
        const req = n.requiresCompleted
        const waits = req && !st.paths[req.path]?.completedNodes?.includes(req.nodeId)
        return { id: n.id, title: n.title, waits: waits ? req.path : null }
      })
    if (node.clue && !st.clues.includes(node.clue)) {
      actions.addClue(node.clue)
      setClueQueue(q => [...q, { clueId: node.clue, opened, path: pathKey }])
      setTimeout(() => playSFX('pin'), 500)
    }
    if (node.raySuspicion) {
      actions.addSuspicion(node.raySuspicion)
      actions.addNotification('You searched court records for his name. Maya\'s notes say he gets told when someone does that.', 'warning')
    }
    if (node.journalistUnlock) {
      actions.unlockJournalist()
      actions.addNotification('Rosa Velasquez, the reporter Maya trusted, is now an option when you make the final call.', 'info')
    }
    if (node.systemAlertAfter && !st.systemAlertShown) {
      setSystemAlertTrigger(n => n + 1)
      actions.markSystemAlert()
      actions.addSuspicion(8)
      setTimeout(() => actions.addNotification('Her laptop just logged a sign-in attempt from another computer. Someone is watching it.', 'warning'), 3600)
    }

    actions.completeNode(pathKey, node.id, node.unlocks || [])
    playSFX('nodeComplete')
    setTimeout(() => {
      actions.closeNode()
      actions.checkRayBeat()
    }, 450)
  }

  return (
    <>
      <CaseBoard
        onOpenLead={(p, id) => actions.openNode(p, id)}
        onSave={() => setShowSaveModal(true)}
        onJournal={() => setShowJournal(true)}
        onApartment={() => actions.setPhase('apartment')}
        onPresent={() => actions.setPhase('convergence')}
      />

      {node && (
        <LeadOverlay
          key={node.id}
          node={node}
          pathKey={pathKey}
          isReviewing={isReviewing}
          onClose={actions.closeNode}
          onComplete={handleNodeComplete}
          onJournalistUnlock={actions.unlockJournalist}
        />
      )}

      {/* One overlay at a time, and the name goes first: Ray's phone used to
          render on top of the reveal card, so the biggest beat in the game
          was covered by a text message. */}
      {/* then the note the lead just gave you, then Ray */}
      {!node && !revealPending && clueQueue.length > 0 && (
        <ClueCard key={clueQueue[0].clueId} clueId={clueQueue[0].clueId} opened={clueQueue[0].opened}
          onOpenLead={clueQueue.length === 1 && !st.rayBeatPending ? (id) => setTimeout(() => actions.openNode(clueQueue[0].path, id), 440) : undefined}
          offerQuiet={st.clues.length >= 4} showHow={st.clues.length <= 2} onDone={() => setClueQueue(q => q.slice(1))} />
      )}
      {!node && st.rayBeatPending && !revealPending && clueQueue.length === 0 && (
        <RayPhone
          key={st.rayBeatPending}
          beatId={st.rayBeatPending}
          onAnswer={(idx) => actions.answerRayBeat(st.rayBeatPending, idx)}
        />
      )}
      {/* the name lands over the record it was read on, not two screens later */}
      {revealPending && (
        <NameRevealCard
          // the record in front of the player, or failing that the one they hold
          source={{ A12: 'whois', B7: 'html_author', B8: 'html_author', C5: 'registry' }[st.currentNodeId]
            ?? NAME_CLUES.find(id => st.clues.includes(id))}
          onDone={() => actions.markNameRevealSeen()} />
      )}
      <SystemAlertFlash trigger={systemAlertTrigger} />
      {showSaveModal && <SaveLoadModal mode="both" onClose={() => setShowSaveModal(false)} />}
      {showJournal && <CaseNotes onClose={() => setShowJournal(false)} />}
    </>
  )
}
