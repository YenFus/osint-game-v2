import { useState, useEffect, useCallback } from 'react'
import { GAME_DATA } from '../data/gameData'
import { useGameStore } from '../store/gameStore'
import { SaveLoadModal } from '../components/SaveLoadModal'
import { ApartmentArt, ApartmentRoom } from '../components/board/ApartmentArt'
import { clockLabel, missingLabel } from '../data/caseData'

const ITEMS = [
  {
    id: 'laptop',
    label: "Maya's Laptop",
    path: 'A',
    desc: 'Locked. The screen says three wrong passwords, Monday at 8:04am. That wasn\'t her.',
    hint: 'On her desk. Someone tried to get into it.',
    // position in the room
    style: { bottom: '28%', right: '19%' },
    // Path preview info
    preview: {
      focus: 'Digital Trail',
      techniques: ['Social media analysis', 'Username correlation', 'Post timing'],
      difficulty: 'Moderate',
    },
  },
  {
    id: 'notebook',
    label: 'Burned Notebook',
    path: 'B',
    desc: "On her bed. Somebody set it alight, pulled the smoke alarm off the ceiling and left it lying beside it.",
    hint: 'On her bed, next to the smoke alarm. Half burned.',
    style: { bottom: '22%', left: '12%' },
    preview: {
      focus: 'Private Notes',
      techniques: ['Document recovery', 'Handwriting analysis', 'Timeline reconstruction'],
      difficulty: 'Challenging',
    },
  },
  {
    id: 'board',
    label: "Maya's Corkboard",
    path: 'C',
    desc: "Photos and red string all over it. It wasn't here the last time I visited.",
    hint: 'On the wall by her desk. Photos, string, notes.',
    style: { top: '14%', right: '14%' },
    preview: {
      focus: 'Public Record',
      techniques: ['Court records', 'News archives', 'Public database search'],
      difficulty: 'Moderate',
    },
  },
]

export default function ApartmentPage() {
  const { setPhase, beginInvestigation, paths, saveGame, addNotification, clock } = useGameStore()
  const [hovered, setHovered] = useState(null)
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [showPreview, setShowPreview] = useState(null)

  const handleItemClick = (item) => {
    beginInvestigation(item.path)
  }

  const completedCount = Object.values(paths).filter(p => p.completed).length

  // Quick save keyboard shortcut (Ctrl/Cmd + S)
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

  return (
    <div className="apt-root crt h-screen flex flex-col overflow-hidden relative" style={{ backgroundColor: '#08080e' }}>
      {/* Maya's flat at night, drawn rather than rendered */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}><ApartmentArt /></div>
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(6,5,12,0.34)', zIndex: 0 }} />

      {/* ── HEADER ── */}
      <div className="shrink-0 border-b border-[#1a1a28] px-3 sm:px-4 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-2 relative" style={{ zIndex: 1, background: 'rgba(4,4,10,0.70)' }}>
        <button
          onClick={() => setPhase('menu')}
          className="font-mono text-xs sm:text-sm text-[#a0a098] hover:text-[#e0e0d8] tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all cursor-pointer px-2 sm:px-4 py-2 min-h-[44px] whitespace-nowrap opacity-70 hover:opacity-100"
          aria-label="Return to main menu"
        >
          ← Back
        </button>
        <div className="font-mono text-xs sm:text-sm text-red-600 tracking-[0.1em] sm:tracking-[0.2em] uppercase flicker hidden sm:block font-medium truncate">
          {clockLabel(clock)} — Maya missing {missingLabel(clock)}
        </div>
        <button
          onClick={() => setShowSaveModal(true)}
          className="font-mono text-xs sm:text-sm text-[#6a8aaa] hover:text-[#a0c8e0] px-2 sm:px-4 py-2 transition-all cursor-pointer tracking-[0.05em] sm:tracking-[0.1em] uppercase min-h-[44px] whitespace-nowrap opacity-70 hover:opacity-100"
          aria-label="Save game (Ctrl+S for quick save)"
          title="Save game (Ctrl+S for quick save)"
        >
          Save
        </button>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative" style={{ zIndex: 1 }}>

        {/* ── LEFT SIDEBAR ── */}
        <div className="apartment-sidebar w-full md:w-80 shrink-0 md:border-r border-[#1a1a2a] flex flex-col overflow-y-auto flex-1 md:flex-none" style={{ background: 'rgba(4,4,10,0.82)' }}>

          {/* Location */}
          <div className="px-4 sm:px-8 py-3 sm:py-6 border-b border-[#1a1a28]">
            <div className="font-mono text-xs text-red-600 tracking-[0.25em] uppercase mb-3">
              Location
            </div>
            <h1 className="text-[#f0e8d8] text-3xl font-black uppercase tracking-tight leading-tight mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Maya's Apartment
            </h1>
            <div className="font-mono text-sm text-[#908878] leading-relaxed">
              14B Marlowe St, 3rd floor<br />
              I let myself in with the key she gave me.
            </div>
          </div>

          {/* Scene note */}
          <div className="px-4 sm:px-8 py-3 sm:py-6 border-b border-[#1a1a28]">
            <p className="text-[#a09888] text-base italic leading-relaxed" style={{ fontFamily: "'Crimson Pro', serif" }}>
              "Her lamp is still on. Everything looks normal. She's just not here."
            </p>
          </div>

          {/* Objects to investigate. The board exposes eight landmarks and this
              screen exposed one, so assistive tech navigated the two main
              screens of the game in completely different ways. */}
          <section className="px-4 sm:px-8 py-3 sm:py-6 flex-1" aria-labelledby="apt-poi">
            <div id="apt-poi" className="font-mono text-xs text-[#908878] tracking-[0.2em] uppercase mb-5">
              Points of Interest
            </div>
            <div className="space-y-3">
              {ITEMS.map((item) => {
                const done = paths[item.path].completed
                const started = paths[item.path].started
                const isHovered = hovered === item.id
                const isShowingPreview = showPreview === item.id
                return (
                  <div key={item.id} className="relative">
                    <button
                      onMouseEnter={() => setHovered(item.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleItemClick(item)}
                      onFocus={() => !done && setShowPreview(item.id)}
                      onBlur={() => setShowPreview(null)}
                      aria-describedby={`preview-${item.id}`}
                      className={`
                        w-full text-left transition-all duration-200 cursor-pointer
                        border-l-2
                        ${done
                          ? 'border-l-transparent opacity-40 cursor-default'
                          : isHovered
                          ? 'border-l-red-700 bg-red-950/10'
                          : 'border-l-transparent'
                        }
                      `}
                    >
                      <div className="px-5 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`font-mono text-sm tracking-[0.15em] uppercase transition-colors font-medium ${isHovered && !done ? 'text-[#f0e8d8]' : 'text-[#a09888]'}`}>
                            {item.label}
                          </div>
                          {done && <span className="font-mono text-xs text-green-600">✓ closed</span>}
                          {started && !done && <span className="font-mono text-xs text-amber-600">in progress</span>}
                          {/* This "?" was a span[role=button][tabIndex=0] inside
                              the real <button> wrapping the row — interactive
                              inside interactive. It is decorative now: the
                              button's own onFocus already opens the preview for
                              keyboard users, so only the mouse affordance is
                              left and nothing is lost. */}
                          {!done && !started && (
                            <span
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowPreview(isShowingPreview ? null : item.id)
                              }}
                              className="font-mono text-sm text-[#6a8aaa] hover:text-[#8ab0d0] transition-colors cursor-pointer px-2 py-1"
                              aria-hidden="true"
                            >
                              ?
                            </span>
                          )}
                        </div>
                        <div className={`text-sm transition-colors ${isHovered && !done ? 'text-[#b0a898]' : 'text-[#808078]'}`} style={{ fontFamily: "'Crimson Pro', serif" }}>
                          {item.hint}
                        </div>
                        {isHovered && !done && (
                          <div className="mt-3 text-[#b09888] text-sm italic leading-snug slide-in" style={{ fontFamily: "'Crimson Pro', serif" }}>
                            {item.desc}
                          </div>
                        )}
                      </div>
                    </button>

                    {/* Path Preview Tooltip */}
                    {isShowingPreview && item.preview && !done && (
                      <div
                        id={`preview-${item.id}`}
                        className="path-preview-tooltip"
                        style={{
                          position: 'absolute',
                          bottom: 'calc(100% + 12px)',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: 300,
                          background: 'rgba(6,6,16,0.96)',
                          borderTop: '1px solid #2a3a50',
                          padding: 18,
                          zIndex: 70,
                        }}
                      >
                        <div className="font-mono text-xs text-[#6a90b8] tracking-[0.15em] uppercase mb-3">
                          Path Preview
                        </div>
                        <div className="font-mono text-base text-[#e0d0a0] mb-4 font-medium">
                          {item.preview.focus}
                        </div>
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between font-mono text-sm">
                            <span className="text-[#808090]">Leads:</span>
                            <span className="text-[#b0b0c0]">{GAME_DATA[item.id]?.nodes.length ?? '—'}</span>
                          </div>
                          <div className="flex justify-between font-mono text-sm">
                            <span className="text-[#808090]">Difficulty:</span>
                            <span className="text-[#b0b0c0]">{item.preview.difficulty}</span>
                          </div>
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid rgba(6,6,16,0.96)',
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* Path tracker + convergence */}
          <section className="px-4 sm:px-8 py-3 sm:py-6 border-t border-[#1a1a28]" aria-labelledby="apt-threads">
            <div id="apt-threads" className="font-mono text-xs text-[#908878] tracking-[0.2em] uppercase mb-4">
              Investigation Threads
            </div>
            <div className="flex gap-6 mb-4">
              {['A', 'B', 'C'].map((p) => (
                <div key={p} className="flex flex-col items-center gap-1.5">
                  <span className={`font-mono text-sm tracking-widest transition-all duration-300 font-medium ${
                    paths[p].completed ? 'text-green-500'
                    : paths[p].started ? 'text-amber-500'
                    : 'text-[#7a7a8f]'
                  }`}>
                    {p}
                  </span>
                  <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    paths[p].completed ? 'bg-green-500'
                    : paths[p].started ? 'bg-amber-500'
                    : 'bg-[#2a2a38]'
                  }`} />
                </div>
              ))}
            </div>
            {/* On a phone the room takes the top of the screen and this
                button sat ~330px below the fold inside a pane that scrolls
                with no affordance — the only way forward, invisible. It
                sticks to the bottom of the pane on mobile now. */}
            <button
              onClick={() => beginInvestigation(null)}
              className={`apt-cta w-full font-mono text-sm px-4 py-3 transition-all cursor-pointer tracking-wider uppercase font-medium text-left border ${completedCount >= 2 ? 'text-red-400 border-red-800 pulse-red' : 'text-[#e0c890] border-[#5a4a2a] hover:bg-[#2a2010]'}`}
            >
              {completedCount >= 2 ? 'The Suspect is open on the board →' : 'Open the case board →'}
            </button>
          </section>
        </div>

        {/* ── THE ROOM — click what you want to examine ── */}
        <section aria-label="Maya's apartment" className="apt-room flex relative overflow-hidden order-first md:order-none md:flex-1 md:min-h-0">
          <ApartmentRoom paths={paths} onPick={(p) => beginInvestigation(p)} />
          <div className="absolute bottom-6 left-0 right-0 hidden md:flex justify-center pointer-events-none" style={{ zIndex: 5 }}>
            <p className="text-[15px] italic" style={{ fontFamily: "'Crimson Pro', serif", color: 'rgba(180,166,140,0.6)' }}>
              Click something of hers to start.
            </p>
          </div>
        </section>
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <SaveLoadModal mode="both" onClose={() => setShowSaveModal(false)} />
      )}
    </div>
  )
}
