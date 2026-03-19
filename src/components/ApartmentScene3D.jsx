// ─────────────────────────────────────────────────────────────────
// APARTMENT SCENE — Clean card-based selection
//
// Instead of a messy SVG room, present three clear investigation
// options as cards. Clean, professional, no confusion.
// ─────────────────────────────────────────────────────────────────

import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

const INVESTIGATIONS = [
  {
    id: 'A',
    label: "Maya's Laptop",
    icon: '💻',
    description: 'Her screen was still on when I found it. Seventeen tabs. She was in the middle of something.',
    focus: 'Digital Trail',
    techniques: ['Social media analysis', 'Username correlation', 'File metadata'],
    color: '#4a90d9',
    bgColor: 'rgba(74, 144, 217, 0.08)',
  },
  {
    id: 'B',
    label: 'Burned Notebook',
    icon: '📓',
    description: 'Sitting in the kitchen sink. Someone tried to burn it. Not everything is gone.',
    focus: 'Private Notes',
    techniques: ['Document recovery', 'Handwriting analysis', 'Timeline reconstruction'],
    color: '#c0392b',
    bgColor: 'rgba(192, 57, 43, 0.08)',
  },
  {
    id: 'C',
    label: 'Investigation Board',
    icon: '📌',
    description: "A corkboard covered in photos and red string. This wasn't here last time I visited.",
    focus: 'Public Record',
    techniques: ['Court records', 'News archives', 'Public databases'],
    color: '#d4a017',
    bgColor: 'rgba(212, 160, 23, 0.08)',
  },
]

export function ApartmentScene3D({ onNavigate }) {
  const { paths } = useGameStore()
  const [hoveredId, setHoveredId] = useState(null)
  const [fading, setFading] = useState(false)

  const handleClick = (id) => {
    if (paths[id]?.completed) return
    setFading(true)
    setTimeout(() => {
      onNavigate(id)
    }, 300)
  }

  return (
    <div
      className="relative w-full h-full flex flex-col items-center justify-center p-6"
      style={{ background: 'linear-gradient(180deg, #0c0c14 0%, #08080e 100%)' }}
    >
      {/* Header */}
      <div className="text-center mb-8">
        <p
          className="text-lg sm:text-xl text-[#8a8898] mb-2"
          style={{ fontFamily: "'Crimson Pro', serif", fontStyle: 'italic' }}
        >
          "Three things she left behind. Three threads to pull."
        </p>
        <p className="font-mono text-xs text-[#4a4a58] tracking-[0.2em] uppercase">
          Choose where to begin
        </p>
      </div>

      {/* Investigation cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
        {INVESTIGATIONS.map((item) => {
          const done = paths[item.id]?.completed
          const started = paths[item.id]?.started
          const isHovered = hoveredId === item.id

          return (
            <button
              key={item.id}
              onClick={() => handleClick(item.id)}
              onMouseEnter={() => !done && setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              disabled={done}
              className="text-left transition-all duration-200"
              style={{
                background: done ? '#0a0a12' : isHovered ? item.bgColor : '#0c0c16',
                border: `2px solid ${done ? '#1a1a28' : isHovered ? item.color : '#2a2a3a'}`,
                borderRadius: 8,
                padding: 20,
                opacity: done ? 0.5 : 1,
                cursor: done ? 'default' : 'pointer',
                transform: isHovered && !done ? 'translateY(-4px)' : 'none',
                boxShadow: isHovered && !done ? `0 8px 24px ${item.color}20` : 'none',
              }}
              aria-label={`${item.label}${done ? ' (completed)' : started ? ' (in progress)' : ''}`}
            >
              {/* Icon and status */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">{item.icon}</span>
                {done && (
                  <span className="font-mono text-xs text-green-600 bg-green-950/30 px-2 py-1 rounded">
                    ✓ Complete
                  </span>
                )}
                {started && !done && (
                  <span className="font-mono text-xs text-amber-600 bg-amber-950/30 px-2 py-1 rounded">
                    In Progress
                  </span>
                )}
              </div>

              {/* Title */}
              <h3
                className="text-lg font-bold mb-2"
                style={{
                  fontFamily: "'Barlow Condensed', sans-serif",
                  color: isHovered && !done ? item.color : '#d8d0c0',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {item.label}
              </h3>

              {/* Description */}
              <p
                className="text-sm mb-4 leading-relaxed"
                style={{
                  fontFamily: "'Crimson Pro', serif",
                  color: '#9a9a98',
                  fontStyle: 'italic',
                }}
              >
                {item.description}
              </p>

              {/* Focus area */}
              <div className="mb-3">
                <span
                  className="font-mono text-xs tracking-[0.1em] uppercase"
                  style={{ color: item.color }}
                >
                  {item.focus}
                </span>
              </div>

              {/* Techniques */}
              <div className="flex flex-wrap gap-1">
                {item.techniques.map((tech, i) => (
                  <span
                    key={i}
                    className="font-mono text-[10px] px-2 py-0.5 rounded"
                    style={{
                      background: `${item.color}15`,
                      color: '#7a7a88',
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              {/* CTA */}
              {!done && (
                <div
                  className="mt-4 pt-3 border-t flex items-center justify-between"
                  style={{ borderColor: '#2a2a3a' }}
                >
                  <span
                    className="font-mono text-sm"
                    style={{ color: isHovered ? item.color : '#6a6a78' }}
                  >
                    {started ? 'Continue →' : 'Begin →'}
                  </span>
                </div>
              )}
            </button>
          )
        })}
      </div>

      {/* Fade overlay */}
      <div
        className="absolute inset-0 pointer-events-none bg-black transition-opacity duration-300"
        style={{ opacity: fading ? 1 : 0 }}
      />
    </div>
  )
}
