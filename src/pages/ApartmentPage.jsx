import { useState, useEffect, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'
import { ApartmentScene3D } from '../components/ApartmentScene3D'
import { SaveLoadModal } from '../components/SaveLoadModal'

const ITEMS = [
  {
    id: 'laptop',
    label: "Maya's Laptop",
    path: 'A',
    desc: 'Screen still on. A folder is open — she was in the middle of something.',
    hint: 'On the desk. The screen casts a blue light on the wall.',
    // position in the room
    style: { bottom: '28%', right: '19%' },
    // Path preview info
    preview: {
      focus: 'Digital Trail',
      techniques: ['Social media analysis', 'Username correlation', 'Post timing'],
      nodeCount: 14,
      difficulty: 'Moderate',
    },
  },
  {
    id: 'notebook',
    label: 'Burned Notebook',
    path: 'B',
    desc: "Sitting in the kitchen sink. Someone tried to burn it. Not everything is gone.",
    hint: 'In the kitchen corner. Partially charred.',
    style: { bottom: '22%', left: '12%' },
    preview: {
      focus: 'Private Notes',
      techniques: ['Document recovery', 'Handwriting analysis', 'Timeline reconstruction'],
      nodeCount: 11,
      difficulty: 'Challenging',
    },
  },
  {
    id: 'board',
    label: 'Investigation Board',
    path: 'C',
    desc: "A corkboard covered in photos and red string. This wasn't here last time you visited.",
    hint: 'On the back wall, above the desk.',
    style: { top: '14%', right: '14%' },
    preview: {
      focus: 'Public Record',
      techniques: ['Court records', 'News archives', 'Public database search'],
      nodeCount: 14,
      difficulty: 'Moderate',
    },
  },
]

export default function ApartmentPage() {
  const { setPhase, beginInvestigation, paths, saveGame, addNotification } = useGameStore()
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
    <div className="crt h-screen bg-[#08080e] flex flex-col overflow-hidden">

      {/* ── HEADER ── */}
      <div className="shrink-0 border-b border-[#1a1a28] px-3 sm:px-4 md:px-8 py-3 sm:py-4 flex items-center justify-between gap-2">
        <button
          onClick={() => setPhase('menu')}
          className="font-mono text-xs sm:text-sm text-[#a0a098] hover:text-[#e0e0d8] hover:bg-[#1a1a28] tracking-[0.1em] sm:tracking-[0.15em] uppercase transition-all cursor-pointer px-2 sm:px-4 py-2 border border-[#3a3a48] hover:border-[#5a5a68] min-h-[44px] whitespace-nowrap"
          aria-label="Return to main menu"
        >
          ← Back
        </button>
        <div className="font-mono text-xs sm:text-sm text-red-600 tracking-[0.1em] sm:tracking-[0.2em] uppercase flicker hidden sm:block font-medium truncate">
          Day 6 — No Contact
        </div>
        <button
          onClick={() => setShowSaveModal(true)}
          className="font-mono text-xs sm:text-sm text-[#8ab0c8] border border-[#4a6080] px-2 sm:px-4 py-2 hover:border-[#6a90b0] hover:text-[#b0d0e8] hover:bg-[#0a1020] transition-all cursor-pointer tracking-[0.05em] sm:tracking-[0.1em] uppercase min-h-[44px] whitespace-nowrap"
          aria-label="Save game (Ctrl+S for quick save)"
          title="Save game (Ctrl+S for quick save)"
        >
          Save
        </button>
      </div>

      {/* ── MAIN LAYOUT ── */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">

        {/* ── LEFT SIDEBAR ── */}
        <div className="apartment-sidebar w-full md:w-80 shrink-0 border-b md:border-b-0 md:border-r border-[#0e0e18] flex flex-col overflow-y-auto max-h-[40vh] md:max-h-none">

          {/* Location */}
          <div className="px-8 py-6 border-b border-[#1a1a28]">
            <div className="font-mono text-xs text-red-600 tracking-[0.25em] uppercase mb-3">
              Location
            </div>
            <h2 className="text-[#f0e8d8] text-3xl font-black uppercase tracking-tight leading-tight mb-3"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              Maya's Apartment
            </h2>
            <div className="font-mono text-sm text-[#908878] leading-relaxed">
              14B Marlowe St, 3rd floor<br />
              Spare key was under the mat
            </div>
          </div>

          {/* Scene note */}
          <div className="px-8 py-6 border-b border-[#1a1a28]">
            <p className="text-[#a09888] text-base italic leading-relaxed" style={{ fontFamily: "'Crimson Pro', serif" }}>
              "You haven't been inside since she painted it. There's a monstera on the windowsill you don't recognise. Fairy lights she strung up before Christmas. One shoe by the door — the left one. The right one is nowhere."
            </p>
          </div>

          {/* Objects to investigate */}
          <div className="px-8 py-6 flex-1">
            <div className="font-mono text-xs text-[#908878] tracking-[0.2em] uppercase mb-5">
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
                      disabled={done}
                      aria-describedby={`preview-${item.id}`}
                      className={`
                        w-full text-left border-2 transition-all duration-200 cursor-pointer
                        ${done
                          ? 'border-[#1a1a24] opacity-50 cursor-default'
                          : isHovered
                          ? 'border-red-700 bg-[#140808]'
                          : 'border-[#2a2a38] hover:border-[#3a3a48]'
                        }
                      `}
                    >
                      <div className="px-5 py-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className={`font-mono text-sm tracking-[0.15em] uppercase transition-colors font-medium ${isHovered && !done ? 'text-[#f0e8d8]' : 'text-[#a09888]'}`}>
                            {item.label}
                          </div>
                          {done && <span className="font-mono text-xs text-green-600">✓ examined</span>}
                          {started && !done && <span className="font-mono text-xs text-amber-600">in progress</span>}
                          {!done && !started && (
                            <span
                              role="button"
                              tabIndex={0}
                              onClick={(e) => {
                                e.stopPropagation()
                                setShowPreview(isShowingPreview ? null : item.id)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  setShowPreview(isShowingPreview ? null : item.id)
                                }
                              }}
                              className="font-mono text-sm text-[#6a8aaa] hover:text-[#8ab0d0] transition-colors cursor-pointer px-2 py-1 border border-[#3a5068] hover:border-[#5a80a8]"
                              aria-label="Preview this investigation path"
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
                          background: '#0a0a14',
                          border: '2px solid #3a4a60',
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
                            <span className="text-[#808090]">Nodes:</span>
                            <span className="text-[#b0b0c0]">{item.preview.nodeCount}</span>
                          </div>
                          <div className="flex justify-between font-mono text-sm">
                            <span className="text-[#808090]">Difficulty:</span>
                            <span className="text-[#b0b0c0]">{item.preview.difficulty}</span>
                          </div>
                        </div>
                        <div className="font-mono text-xs text-[#6090b0] tracking-[0.1em] uppercase mb-2">
                          Techniques:
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {item.preview.techniques.map((tech, i) => (
                            <span
                              key={i}
                              className="font-mono text-xs text-[#80a0c0] bg-[#101828] px-3 py-1"
                            >
                              {tech}
                            </span>
                          ))}
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '10px solid transparent',
                            borderRight: '10px solid transparent',
                            borderTop: '10px solid #3a4a60',
                          }}
                        />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Path tracker + convergence */}
          <div className="px-8 py-6 border-t border-[#1a1a28]">
            <div className="font-mono text-xs text-[#908878] tracking-[0.2em] uppercase mb-4">
              Investigation Threads
            </div>
            <div className="flex gap-3 mb-4">
              {['A', 'B', 'C'].map((p) => (
                <div key={p}
                  className={`w-12 h-12 flex items-center justify-center font-mono text-base border-2 transition-all duration-300 font-medium ${
                    paths[p].completed ? 'border-green-600 text-green-500 bg-green-950/20'
                    : paths[p].started ? 'border-amber-600 text-amber-500 bg-amber-950/20'
                    : 'border-[#3a3a48] text-[#6a6a78]'
                  }`}
                >
                  {p}
                </div>
              ))}
            </div>
            {completedCount >= 2 && (
              <button
                onClick={() => setPhase('convergence')}
                className="w-full font-mono text-sm text-red-500 border-2 border-red-700 px-4 py-3 hover:bg-red-950 hover:bg-opacity-30 transition-all cursor-pointer tracking-wider uppercase fade-in pulse-red font-medium"
              >
                Convergence Available →
              </button>
            )}
          </div>
        </div>

        {/* ── THE ROOM (3D) ── */}
        <div className="apartment-3d-container flex-1 relative overflow-hidden min-h-[50vh] md:min-h-0">
          {/* Vignette — pointer-events-none so clicks pass through to canvas */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,8,14,0.75) 100%)' }}
          />
          <ApartmentScene3D onNavigate={(path) => {
            beginInvestigation(path)
          }} />

          {/* Mobile hint */}
          <div className="md:hidden absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-sm text-[#8a8a98] bg-[#08080e] bg-opacity-90 px-4 py-2 border border-[#3a3a48]">
            Tap objects to investigate
          </div>
        </div>
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <SaveLoadModal mode="save" onClose={() => setShowSaveModal(false)} />
      )}
    </div>
  )
}
