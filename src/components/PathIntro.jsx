// ─────────────────────────────────────────────────────────────────
// PATH INTRO — Brief tutorial before each investigation path
//
// Shows what to expect in this specific investigation thread
// and the types of tasks they'll encounter.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'

const PATH_INFO = {
  A: {
    title: "Maya's Laptop",
    icon: '💻',
    color: '#4a90d9',
    description: "You're about to examine Maya's digital footprint. Her laptop was still open when you found it.",
    tasks: [
      { icon: '📄', text: 'Read through documents and notes' },
      { icon: '🌐', text: 'Examine social media profiles' },
      { icon: '✏️', text: 'Answer questions about what you find' },
      { icon: '🔗', text: 'Connect related pieces of evidence' },
    ],
    tip: 'Pay attention to usernames, dates, and any connections between people.',
  },
  B: {
    title: 'Burned Notebook',
    icon: '📓',
    color: '#c0392b',
    description: "Someone tried to destroy this. You'll need to recover what you can from the damaged pages.",
    tasks: [
      { icon: '🔍', text: 'Adjust brightness/contrast to reveal text' },
      { icon: '📄', text: 'Read recovered journal entries' },
      { icon: '🏷️', text: 'Flag suspicious details' },
      { icon: '✏️', text: 'Piece together the timeline' },
    ],
    tip: 'The burned pages hide Maya\'s most private thoughts. Take your time recovering each one.',
  },
  C: {
    title: 'Investigation Board',
    icon: '📌',
    color: '#d4a017',
    description: "Maya was investigating someone. This board shows how far she got.",
    tasks: [
      { icon: '📄', text: 'Review public records and news articles' },
      { icon: '🌐', text: 'Cross-reference information sources' },
      { icon: '🔗', text: 'Connect the dots between evidence' },
      { icon: '✏️', text: 'Draw conclusions from the facts' },
    ],
    tip: 'Public records never lie, but they don\'t tell the whole story either.',
  },
}

export function PathIntro({ path, onContinue }) {
  const [visible, setVisible] = useState(true)
  const info = PATH_INFO[path]

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleContinue()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleContinue = () => {
    setVisible(false)
    setTimeout(() => onContinue(), 300)
  }

  if (!info) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 4, 10, 0.98)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 100,
        padding: 16,
        opacity: visible ? 1 : 0,
        transition: 'opacity 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          background: '#0a0a14',
          border: `2px solid ${info.color}`,
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          background: `linear-gradient(180deg, ${info.color}15 0%, transparent 100%)`,
          padding: '32px 28px 24px',
          textAlign: 'center',
          borderBottom: `1px solid ${info.color}40`,
        }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>{info.icon}</div>
          <h2 style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 32,
            fontWeight: 700,
            color: '#f0e8d8',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: 8,
          }}>
            {info.title}
          </h2>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 12,
            color: info.color,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}>
            Investigation Thread {path}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px' }}>
          {/* Description */}
          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontSize: 18,
            color: '#b0a898',
            lineHeight: 1.7,
            marginBottom: 24,
            fontStyle: 'italic',
          }}>
            {info.description}
          </p>

          {/* What you'll do */}
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 11,
            color: '#6a6a78',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            What you'll do
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 10,
            marginBottom: 24,
          }}>
            {info.tasks.map((task, i) => (
              <div key={i} style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '10px 12px',
                background: '#08080e',
                borderRadius: 4,
                border: '1px solid #2a2a38',
              }}>
                <span style={{ fontSize: 18 }}>{task.icon}</span>
                <span style={{
                  fontFamily: 'Crimson Pro, serif',
                  fontSize: 14,
                  color: '#a0a098',
                }}>
                  {task.text}
                </span>
              </div>
            ))}
          </div>

          {/* Tip */}
          <div style={{
            padding: '14px 16px',
            background: `${info.color}10`,
            borderLeft: `3px solid ${info.color}`,
            borderRadius: '0 4px 4px 0',
            marginBottom: 24,
          }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 10,
              color: info.color,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}>
              💡 Tip
            </div>
            <div style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: 15,
              color: '#c8c0b0',
              lineHeight: 1.6,
            }}>
              {info.tip}
            </div>
          </div>

          {/* Button */}
          <button
            onClick={handleContinue}
            style={{
              width: '100%',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 16,
              color: '#f0e8d8',
              background: info.color,
              border: 'none',
              padding: '16px 32px',
              cursor: 'pointer',
              borderRadius: 4,
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              minHeight: 56,
            }}
          >
            Begin Investigation →
          </button>

          {/* Keyboard hint */}
          <div style={{
            marginTop: 12,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 11,
            color: '#4a4a60',
            textAlign: 'center',
          }}>
            Press Enter to begin
          </div>
        </div>
      </div>
    </div>
  )
}
