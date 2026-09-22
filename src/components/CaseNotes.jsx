// ─────────────────────────────────────────────────────────────────
// CASE NOTES — Investigation progress and summaries
//
// Shows what the player has discovered in each investigation thread.
// Auto-updates with summaries after completing each node.
// ─────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '../store/gameStore'
import { knownCast } from '../data/castData'

// Thread accents, pulled into the board's warm range. The originals were
// Tailwind-bright — a #4a90d9 edge on the drawer read as a different app
// sitting on top of the corkboard.
const PATH_INFO = {
  A: {
    border: '#5d7fa8',
    bg: 'rgba(93, 127, 168, 0.08)',
    label: 'Thread A — Digital Trail',
    icon: 'A',
    description: "Following Maya's digital footprints through her laptop",
  },
  B: {
    border: '#a0503f',
    bg: 'rgba(160, 80, 63, 0.08)',
    label: 'Thread B — Private Notes',
    icon: 'B',
    description: 'Recovering what someone tried to destroy',
  },
  C: {
    border: '#b08a3a',
    bg: 'rgba(176, 138, 58, 0.08)',
    label: 'Thread C — Public Record',
    icon: 'C',
    description: 'Connecting the dots through public information',
  },
}

export function CaseNotes({ onClose }) {
  const { paths, caseSummaries, activePath, clues } = useGameStore()
  const modalRef = useRef(null)
  // Everyone in this case arrives inside a document. This is the page
  // that stops the player guessing who is who.
  const [tab, setTab] = useState('leads')
  const cast = knownCast(paths, clues)

  // Close on escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Count total discoveries
  const totalDiscoveries = Object.values(caseSummaries).flat().length

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
        className="relative w-full max-w-lg h-full bg-[#0d0906] border-r-2 flex flex-col"
        style={{
          borderColor: activePath ? PATH_INFO[activePath]?.border : '#3a2c20',
          animation: 'slideInFromLeft 0.25s ease forwards',
          boxShadow: '4px 0 30px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-[#0d0906] border-b border-[#3a2c20] px-6 py-5 flex items-center justify-between z-10">
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
            <div className="font-mono text-xs text-[#7c7c8e] mt-1">
              {tab === 'cast'
                ? `${cast.length} ${cast.length === 1 ? 'person' : 'people'} named so far`
                : `${totalDiscoveries} discoveries recorded`}
            </div>
            <div className="flex gap-2 mt-3">
              {[['leads', 'What I found'], ['cast', "Who's who"]].map(([k, label]) => (
                <button key={k} onClick={() => setTab(k)}
                  aria-pressed={tab === k}
                  className="font-mono text-[12px] tracking-[0.12em] uppercase px-3 py-2 border cursor-pointer"
                  style={{
                    color: tab === k ? '#1a1408' : '#b9a67d',
                    background: tab === k ? '#d8c79a' : 'transparent',
                    borderColor: tab === k ? '#d8c79a' : '#4a3f2c',
                  }}>
                  {label}{k === 'cast' ? ` \u00b7 ${cast.length}` : ''}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="font-mono text-lg text-[#b8a88a] hover:text-[#f0e0c0] cursor-pointer p-3 border border-[#3a2c20] hover:border-[#7a5a3a] transition-colors min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Close case notes"
          >
            ✕
          </button>
        </div>

        {/* Content — flex-1 so it fills remaining space, overflow-y-scroll for iOS touch scroll */}
        <div className="flex-1 overflow-y-scroll px-6 py-5" style={{ WebkitOverflowScrolling: 'touch' }}>
          {tab === 'cast' && (
            <div className="space-y-4">
              {/* Ray's entry used to be edged in red from the first minute, next to
                  everyone else's brown. It turns red when a record names him. */}
              {cast.map(person => (
                <div key={person.id} className="border-l-2 pl-4 py-1"
                  style={{ borderColor: person.namedAs && person.name === person.namedAs ? '#8a1410' : '#4a3f2c' }}>
                  <div className="text-[#ecdfc4] text-lg leading-tight"
                    style={{ fontFamily: "'Crimson Pro', Georgia, serif" }}>{person.name}</div>
                  <div className="font-mono text-[12px] tracking-[0.1em] uppercase text-[#b9a67d] mt-1">
                    {person.relation}
                  </div>
                  <p className="text-[#a8a294] text-[15px] leading-relaxed mt-2"
                    style={{ fontFamily: "'Crimson Pro', serif" }}>{person.line}</p>
                </div>
              ))}
              <p className="font-mono text-[12px] text-[#7c7c8e] pt-2">
                Names are added here as the case turns them up.
              </p>
            </div>
          )}
          {tab === 'leads' && Object.keys(PATH_INFO).map(pathKey => {
            const info = PATH_INFO[pathKey]
            const path = paths[pathKey]
            const summaries = caseSummaries[pathKey] || []
            const allItems = summaries

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
                          <div className="font-mono text-[12px] text-[#6a6a68] mt-2">
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
              
              <div className="font-mono text-sm text-[#5a5a58] mb-2">
                No evidence collected yet
              </div>
              <div
                className="text-sm text-[#4a4a48]"
                style={{ fontFamily: "'Crimson Pro', serif" }}
              >
                Open a lead on the case board to start collecting evidence.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex-shrink-0 px-6 py-4 bg-[#0d0906] border-t border-[#2a2018]">
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
