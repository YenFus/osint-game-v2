import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

const PATH_META = {
  A: { label: 'Digital Trail', color: '#b8860b', className: 'path-a' },
  B: { label: 'Private Notes', color: '#8b1a1a', className: 'path-b' },
  C: { label: 'Public Record', color: '#1a3a6a', className: 'path-c' },
}

export function EvidenceBoard() {
  const [isOpen, setIsOpen] = useState(false)
  const evidence = useGameStore(s => s.evidence)
  const paths = useGameStore(s => s.paths)

  // Group evidence by path
  const groupedEvidence = evidence.reduce((acc, item) => {
    const path = item.path || 'unknown'
    if (!acc[path]) acc[path] = []
    acc[path].push(item)
    return acc
  }, {})

  const totalEvidence = evidence.length
  const hasEvidence = totalEvidence > 0

  if (!hasEvidence && !isOpen) {
    return null
  }

  if (!isOpen) {
    return (
      <button
        className="evidence-board-trigger"
        onClick={() => setIsOpen(true)}
        aria-label={`Open evidence board. ${totalEvidence} pieces of evidence collected.`}
        title="Maya's Evidence Board"
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            background: '#c0392b',
            color: '#fff',
            borderRadius: '50%',
            width: 16,
            height: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 9,
            fontWeight: 'bold',
          }}>
            {totalEvidence}
          </span>
          Evidence
        </span>
      </button>
    )
  }

  return (
    <div
      className="evidence-board-panel"
      role="dialog"
      aria-label="Evidence Board"
    >
      <div className="evidence-board-header">
        <div>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 8,
            color: '#8a6040',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            marginBottom: 4,
          }}>
            Maya's Investigation
          </div>
          <div style={{
            fontFamily: "'Barlow Condensed', sans-serif",
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#e8dcc8',
            textTransform: 'uppercase',
          }}>
            Evidence Board
          </div>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          style={{
            background: 'none',
            border: 'none',
            color: '#5a5048',
            cursor: 'pointer',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 14,
            padding: 8,
          }}
          aria-label="Close evidence board"
        >
          ✕
        </button>
      </div>

      {/* Path progress indicators */}
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid #2a1a14',
        display: 'flex',
        gap: 8,
      }}>
        {['A', 'B', 'C'].map(p => {
          const meta = PATH_META[p]
          const pathData = paths[p]
          const count = groupedEvidence[p]?.length || 0

          return (
            <div
              key={p}
              style={{
                flex: 1,
                padding: '8px 10px',
                border: `1px solid ${pathData.completed ? meta.color : '#2a2028'}`,
                background: pathData.completed ? `${meta.color}10` : 'transparent',
                textAlign: 'center',
              }}
            >
              <div style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 9,
                color: pathData.completed ? meta.color : '#4a4040',
                letterSpacing: '0.15em',
              }}>
                {meta.label}
              </div>
              <div style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 14,
                color: pathData.completed ? '#c8b888' : '#3a3030',
                marginTop: 2,
              }}>
                {count}
              </div>
            </div>
          )
        })}
      </div>

      {/* Evidence list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {totalEvidence === 0 ? (
          <div style={{
            padding: '40px 20px',
            textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 11,
              color: '#4a4040',
              lineHeight: 1.7,
            }}>
              No evidence collected yet.
              <br />
              Investigate the apartment to find clues.
            </div>
          </div>
        ) : (
          ['A', 'B', 'C'].map(path => {
            const items = groupedEvidence[path] || []
            if (items.length === 0) return null

            const meta = PATH_META[path]

            return (
              <div key={path}>
                <div style={{
                  padding: '10px 20px',
                  borderBottom: '1px solid #1a1408',
                  background: '#08060a',
                  position: 'sticky',
                  top: 0,
                }}>
                  <span style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 9,
                    color: meta.color,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                  }}>
                    Thread {path}: {meta.label}
                  </span>
                </div>
                {items.map((item, i) => (
                  <div key={i} className="evidence-item">
                    {item.timestamp && (
                      <div style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: 9,
                        color: '#3a3830',
                        marginBottom: 4,
                      }}>
                        {item.timestamp}
                      </div>
                    )}
                    <div className="evidence-item-text">
                      {item.text || item.description}
                    </div>
                    {item.source && (
                      <div style={{
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: 9,
                        color: '#4a4840',
                        marginTop: 6,
                        fontStyle: 'italic',
                      }}>
                        Source: {item.source}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })
        )}
      </div>

      {/* Footer hint */}
      <div style={{
        padding: '12px 20px',
        borderTop: '1px solid #2a1a14',
        fontFamily: 'Crimson Pro, serif',
        fontStyle: 'italic',
        fontSize: 12,
        color: '#5a5048',
        lineHeight: 1.6,
      }}>
        Evidence collected across all investigation threads. Complete more paths to unlock the convergence.
      </div>
    </div>
  )
}
