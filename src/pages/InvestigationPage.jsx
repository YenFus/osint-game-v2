import { useState, useEffect, useCallback, useRef} from 'react'
import { useModalFocus } from '../hooks/useModalFocus'
import { useGameStore } from '../store/gameStore'
import { useShallow } from 'zustand/react/shallow'
import { GAME_DATA } from '../data/gameData'
import { withMeta } from '../data/leadMeta'
import { LEAD_TIME_COST, HINT_COST, THREAD_INFO as THREADS, NAME_CLUES } from '../data/caseData'
import { useAudio } from '../hooks/useAudio'

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
  const [hintShown, setHintShown] = useState(false)
  const [manualOpen, setManualOpen] = useState(false)
  // On a phone the brief opens when you arrive, so you read it before you
  // start, and folds itself away the first time you touch the puzzle, which
  // gives the puzzle its screen back. One tap on the summary brings it back.
  // (It used to start folded, which hid the sources behind a tap nobody made.)
  const [narrow] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 640px)').matches)
  const [briefOpen, setBriefOpen] = useState(true)
  const briefAutoFolded = useRef(false)
  const foldBriefOnWork = () => {
    if (!narrow || briefAutoFolded.current) return
    briefAutoFolded.current = true
    setBriefOpen(false)
  }
  const Renderer = NODE_RENDERERS[node.type]

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

  return (
    <div ref={dialogRef} className="lo-root" role="dialog" aria-modal="true" aria-label={node.title}>
      <div className={`lo-panel skin-${pathKey}`} data-label={PANEL_LABEL[pathKey]}>
        <div className="lo-head">
          <div className="lo-card hidden sm:block"><PolaroidArt scene={node.card?.scene ?? 'document'} /></div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <button onClick={onClose} className="lo-back font-mono text-xs text-[#a09888] hover:text-[#f0e0c0] uppercase tracking-[0.15em]">← Board</button>
              <span className="hidden sm:inline font-mono text-[12px] tracking-[0.2em] uppercase" style={{ color: node.timestamp?.urgent ? '#e04a3a' : '#8a7a60' }}>
                {THREADS[pathKey].title} · {node.timestamp?.text}
              </span>
            </div>
            <h2 className="text-lg sm:text-2xl font-semibold leading-tight mt-1" style={{ fontFamily: "'Crimson Pro', Georgia, serif", color: '#ecdfc4' }}>
              {node.title}
            </h2>
            {node.monologue && (
              <p className="hidden sm:block text-base mt-1 italic" style={{ fontFamily: "'Crimson Pro', serif", color: '#b0a088' }}>{node.monologue}</p>
            )}
            {/* a lead can name its own objective; otherwise the verb does */}
            <div className="font-mono text-[12px] tracking-[0.14em] uppercase mt-1 text-[#d4a84b]">▸ {node.content?.prompt ?? NODE_INSTRUCTIONS[node.type]}</div>
            {/* What this lead relies on, and where each fact came from. After a
                full playthrough the player said facts turned up with no source —
                A13 asked them to rule Corey out against Lena's hours before
                anything had shown them Lena's hours. Threads can be played in
                any order, so every lead carries its own sources. */}
            {node.brief?.length > 0 && (
              <details className="lo-brief" open={briefOpen} onToggle={(e) => setBriefOpen(e.currentTarget.open)}>
                <summary>What you're working from <span className="n">{node.brief.length}</span></summary>
                <ul>
                  {node.brief.map((b, i) => (
                    <li key={i}><span className="f">{b.fact}</span> <span className="s">{b.from}</span></li>
                  ))}
                </ul>
              </details>
            )}
          </div>
          <div className="lo-tools">
            {node.osintTip && (
              <button className="cb-btn" style={{ color: '#8ab0e0', borderColor: '#2a3a5a' }} onClick={() => setManualOpen(o => !o)}>Field manual</button>
            )}
            {node.hint && (
              <button className="cb-btn" style={{ color: hintShown ? '#6a6050' : '#e8c870', borderColor: '#4a3a18' }} onClick={takeHint} disabled={hintShown}>
                {hintShown ? 'Hint shown' : isReviewing ? 'Hint' : `Hint · +${HINT_COST} min`}
              </button>
            )}
          </div>
        </div>
        {hintShown && <div className="lo-hint" role="status"><span className="lo-hint-k">Hint</span> {node.hint}</div>}
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden relative" onPointerDownCapture={foldBriefOnWork}>
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
    if (node.clue && !st.clues.includes(node.clue)) {
      actions.addClue(node.clue)
      setClueQueue(q => [...q, node.clue])
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
        <ClueCard key={clueQueue[0]} clueId={clueQueue[0]} offerQuiet={st.clues.length >= 4} onDone={() => setClueQueue(q => q.slice(1))} />
      )}
      {!node && st.rayBeatPending && !revealPending && clueQueue.length === 0 && (
        <RayPhone
          key={st.rayBeatPending}
          beatId={st.rayBeatPending}
          onAnswer={(idx) => actions.answerRayBeat(st.rayBeatPending, idx)}
        />
      )}
      {/* the name lands over the record it was read on, not two screens later */}
      {revealPending && <NameRevealCard onDone={() => actions.markNameRevealSeen()} />}
      <SystemAlertFlash trigger={systemAlertTrigger} />
      {showSaveModal && <SaveLoadModal mode="both" onClose={() => setShowSaveModal(false)} />}
      {showJournal && <CaseNotes onClose={() => setShowJournal(false)} />}
    </>
  )
}
