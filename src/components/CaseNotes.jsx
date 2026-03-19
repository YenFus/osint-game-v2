// ─────────────────────────────────────────────────────────────────
// CASE NOTES — Investigation progress and summaries
//
// Shows what the player has discovered in each investigation thread.
// Auto-updates with summaries after completing each node.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

const PATH_INFO = {
  A: {
    border: '#4a90d9',
    bg: 'rgba(74, 144, 217, 0.08)',
    label: 'Thread A — Digital Trail',
    icon: '💻',
    description: "Following Maya's digital footprints through her laptop",
  },
  B: {
    border: '#c0392b',
    bg: 'rgba(192, 57, 43, 0.08)',
    label: 'Thread B — Private Notes',
    icon: '📓',
    description: 'Recovering what someone tried to destroy',
  },
  C: {
    border: '#d4a017',
    bg: 'rgba(212, 160, 23, 0.08)',
    label: 'Thread C — Public Record',
    icon: '📌',
    description: 'Connecting the dots through public information',
  },
}

export function CaseNotes({ onClose }) {
  const { paths, caseSummaries, evidence, activePath } = useGameStore()
  const modalRef = useRef(null)

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Count total discoveries
  const totalDiscoveries = Object.values(caseSummaries).flat().length + evidence.length

  return (
    <div
      className="fixed inset-0 z-50 flex"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70" />

      {/* Panel */}
      <div
        ref={modalRef}
        className="relative w-full max-w-lg h-full bg-[#0a0a10] border-r-2 overflow-hidden"
        style={{
          borderColor: activePath ? PATH_INFO[activePath]?.border : '#3a3a48',
          animation: 'slideInFromLeft 0.25s ease forwards',
          boxShadow: '4px 0 30px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="sticky top-0 bg-[#0a0a10] border-b border-[#2a2a38] px-6 py-5 flex items-center justify-between z-10">
          <div>
            <div className="font-mono text-xs text-[#6a6a78] tracking-[0.2em] uppercase mb-1">
              Investigation
            </div>
            <h2
              className="text-xl text-[#e8e0d0] font-bold uppercase tracking-wide"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              Case Notes
            </h2>
            <div className="font-mono text-xs text-[#5a5a68] mt-1">
              {totalDiscoveries} discoveries recorded
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-lg text-[#6a6a78] hover:text-[#b0b0a8] cursor-pointer p-3 border border-[#3a3a48] hover:border-[#5a5a68] transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Close case notes"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[calc(100%-140px)] px-6 py-5">
          {Object.keys(PATH_INFO).map(pathKey => {
            const info = PATH_INFO[pathKey]
            const path = paths[pathKey]
            const summaries = caseSummaries[pathKey] || []
            const pathEvidence = evidence.filter(e => e.path === pathKey)
            const allItems = [...summaries, ...pathEvidence]

            if (!path.started && allItems.length === 0) return null

            return (
              <div key={pathKey} className="mb-8">
                {/* Path header */}
                <div
                  className="flex items-center gap-3 mb-4 pb-3 border-b"
                  style={{ borderColor: `${info.border}40` }}
                >
                  <span className="text-2xl">{info.icon}</span>
                  <div className="flex-1">
                    <div
                      className="font-mono text-sm tracking-[0.1em] uppercase font-semibold"
                      style={{ color: info.border }}
                    >
                      {info.label}
                    </div>
                    <div className="text-sm text-[#7a7a78]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                      {info.description}
                    </div>
                  </div>
                  {path.completed && (
                    <span className="font-mono text-xs text-green-500 bg-green-950/30 px-2 py-1 rounded">
                      ✓ Complete
                    </span>
                  )}
                </div>

                {/* Summaries/Discoveries */}
                {allItems.length === 0 ? (
                  <div
                    className="text-sm italic pl-4 py-3"
                    style={{
                      fontFamily: "'Crimson Pro', serif",
                      color: '#5a5a58',
                      borderLeft: `2px solid ${info.border}30`,
                    }}
                  >
                    {path.started
                      ? 'Investigation in progress. Discoveries will appear here.'
                      : 'Not yet started.'}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {allItems.map((item, i) => (
                      <div
                        key={item.id || `summary-${i}`}
                        className="pl-4 py-3 rounded"
                        style={{
                          borderLeft: `3px solid ${info.border}80`,
                          background: info.bg,
                        }}
                      >
                        {item.title && (
                          <div
                            className="font-mono text-xs uppercase tracking-[0.1em] mb-1"
                            style={{ color: info.border }}
                          >
                            {item.title}
                          </div>
                        )}
                        <div
                          className="text-sm leading-relaxed"
                          style={{
                            fontFamily: "'Crimson Pro', serif",
                            color: '#c8c0b0',
                          }}
                        >
                          {item.text || item.content || item.summary || 'Evidence collected'}
                        </div>
                        {item.source && (
                          <div className="font-mono text-[10px] text-[#6a6a68] mt-2">
                            Source: {item.source}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}

          {/* Empty state */}
          {totalDiscoveries === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4">🔍</div>
              <div className="font-mono text-sm text-[#5a5a58] mb-2">
                No evidence collected yet
              </div>
              <div
                className="text-sm text-[#4a4a48]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Begin an investigation thread from the apartment to start collecting evidence.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-4 bg-[#0a0a10] border-t border-[#1a1a28]">
          <div className="font-mono text-xs text-[#4a4a48] text-center">
            Press <span className="text-[#6a6a68]">ESC</span> or click outside to close
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInFromLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}
