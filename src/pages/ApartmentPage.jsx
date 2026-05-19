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
      nodeCount: 13,
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
      nodeCount: 12,
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
      nodeCount: 8,
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
    <div
      className="crt h-screen flex flex-col overflow-hidden"
      style={{
        backgroundImage: `url('${import.meta.env.BASE_URL}images/apartment-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
        backgroundColor: '#08080e',
      }}
    >
      {/* Single dark overlay — mobile gets heavier tint for readability */}
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'rgba(4,4,10,0.55)', zIndex: 0 }} />

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
          Day 6 — No Contact
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
          <div className="px-4 sm:px-8 py-3 sm:py-6 border-b border-[#1a1a28]">
            <p className="text-[#a09888] text-base italic leading-relaxed" style={{ fontFamily: "'Crimson Pro', serif" }}>
              "You haven't been inside since she painted it. There's a monstera on the windowsill you don't recognise. Fairy lights she strung up before Christmas. One shoe by the door — the left one. The right one is nowhere."
            </p>
          </div>

          {/* Objects to investigate */}
          <div className="px-4 sm:px-8 py-3 sm:py-6 flex-1">
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
                              className="font-mono text-sm text-[#6a8aaa] hover:text-[#8ab0d0] transition-colors cursor-pointer px-2 py-1"
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
                            <span className="text-[#808090]">Nodes:</span>
                            <span className="text-[#b0b0c0]">{item.preview.nodeCount}</span>
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
          </div>

          {/* Path tracker + convergence */}
          <div className="px-4 sm:px-8 py-3 sm:py-6 border-t border-[#1a1a28]">
            <div className="font-mono text-xs text-[#908878] tracking-[0.2em] uppercase mb-4">
              Investigation Threads
            </div>
            <div className="flex gap-6 mb-4">
              {['A', 'B', 'C'].map((p) => (
                <div key={p} className="flex flex-col items-center gap-1.5">
                  <span className={`font-mono text-sm tracking-widest transition-all duration-300 font-medium ${
                    paths[p].completed ? 'text-green-500'
                    : paths[p].started ? 'text-amber-500'
                    : 'text-[#4a4a58]'
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
            {completedCount >= 2 && (
              <button
                onClick={() => setPhase('convergence')}
                className="w-full font-mono text-sm text-red-500 hover:text-red-400 px-4 py-3 transition-all cursor-pointer tracking-wider uppercase fade-in pulse-red font-medium text-left"
              >
                Convergence Available →
              </button>
            )}
          </div>
        </div>

        {/* ── THE ROOM (3D) — desktop only ── */}
        <div className="hidden md:flex apartment-3d-container flex-1 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'radial-gradient(ellipse at 50% 50%, transparent 45%, rgba(8,8,14,0.75) 100%)' }}
          />
          <ApartmentScene3D onNavigate={(path) => {
            beginInvestigation(path)
          }} />
        </div>
      </div>

      {/* Save modal */}
      {showSaveModal && (
        <SaveLoadModal mode="save" onClose={() => setShowSaveModal(false)} />
      )}
    </div>
  )
}
