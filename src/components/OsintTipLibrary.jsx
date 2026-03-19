import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

export function OsintTipLibrary({ onClose }) {
  const seenOsintTips = useGameStore(s => s.seenOsintTips)
  const [selectedTip, setSelectedTip] = useState(null)

  // All possible OSINT tips organized by category
  const TIP_CATEGORIES = [
    {
      id: 'social-media',
      name: 'Social Media Analysis',
      tips: [
        { id: 'username-search', title: 'Username Correlation', unlocked: seenOsintTips.includes('username-search') },
        { id: 'post-timing', title: 'Post Timing Analysis', unlocked: seenOsintTips.includes('post-timing') },
        { id: 'metadata-analysis', title: 'Profile Metadata', unlocked: seenOsintTips.includes('metadata-analysis') },
      ],
    },
    {
      id: 'image-forensics',
      name: 'Image Forensics',
      tips: [
        { id: 'exif-data', title: 'EXIF Data Extraction', unlocked: seenOsintTips.includes('exif-data') },
        { id: 'reverse-image', title: 'Reverse Image Search', unlocked: seenOsintTips.includes('reverse-image') },
        { id: 'geolocation', title: 'Visual Geolocation', unlocked: seenOsintTips.includes('geolocation') },
      ],
    },
    {
      id: 'public-records',
      name: 'Public Records',
      tips: [
        { id: 'court-records', title: 'Court Record Search', unlocked: seenOsintTips.includes('court-records') },
        { id: 'property-records', title: 'Property Records', unlocked: seenOsintTips.includes('property-records') },
        { id: 'business-filings', title: 'Business Filings', unlocked: seenOsintTips.includes('business-filings') },
      ],
    },
    {
      id: 'digital-footprint',
      name: 'Digital Footprint',
      tips: [
        { id: 'email-patterns', title: 'Email Pattern Recognition', unlocked: seenOsintTips.includes('email-patterns') },
        { id: 'archive-search', title: 'Web Archive Research', unlocked: seenOsintTips.includes('archive-search') },
        { id: 'forum-analysis', title: 'Forum Post Analysis', unlocked: seenOsintTips.includes('forum-analysis') },
      ],
    },
  ]

  const totalUnlocked = TIP_CATEGORIES.reduce((sum, cat) =>
    sum + cat.tips.filter(t => t.unlocked).length, 0
  )
  const totalTips = TIP_CATEGORIES.reduce((sum, cat) => sum + cat.tips.length, 0)

  return (
    <div
      className="fixed inset-0 bg-[#08080e] bg-opacity-95 z-50 flex items-center justify-center p-4 fade-in"
      role="dialog"
      aria-labelledby="tip-library-title"
    >
      <div className="max-w-2xl w-full max-h-[80vh] border border-[#1a2a40] bg-[#0a0c14] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#1a2a40] shrink-0">
          <div>
            <h2
              id="tip-library-title"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                fontSize: '1.3rem',
                fontWeight: 700,
                color: '#e8dcc8',
                textTransform: 'uppercase',
                margin: 0,
              }}
            >
              OSINT Techniques Library
            </h2>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 10,
              color: '#4a6a8a',
              marginTop: 4,
            }}>
              {totalUnlocked} / {totalTips} techniques discovered
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#5a6a78',
              cursor: 'pointer',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 14,
              padding: 8,
            }}
            aria-label="Close library"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-1 min-h-0">
          {/* Categories list */}
          <div className="w-48 border-r border-[#1a2a40] overflow-y-auto shrink-0">
            {TIP_CATEGORIES.map(category => {
              const unlockedInCategory = category.tips.filter(t => t.unlocked).length
              return (
                <div key={category.id} className="border-b border-[#0e1420]">
                  <div style={{
                    padding: '10px 14px',
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 9,
                    color: '#3a5070',
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    background: '#060810',
                  }}>
                    {category.name}
                    <span style={{ float: 'right', color: '#2a4060' }}>
                      {unlockedInCategory}/{category.tips.length}
                    </span>
                  </div>
                  {category.tips.map(tip => (
                    <button
                      key={tip.id}
                      onClick={() => tip.unlocked && setSelectedTip(tip)}
                      disabled={!tip.unlocked}
                      className={`tip-library-card ${tip.unlocked ? 'unlocked' : 'locked'}`}
                      style={{
                        display: 'block',
                        width: '100%',
                        textAlign: 'left',
                        padding: '8px 14px',
                        border: 'none',
                        borderBottom: '1px solid #0a1018',
                        background: selectedTip?.id === tip.id ? '#0c1420' : 'transparent',
                        fontFamily: 'Share Tech Mono, monospace',
                        fontSize: 10,
                        color: tip.unlocked ? '#8a9aaa' : '#2a3040',
                        cursor: tip.unlocked ? 'pointer' : 'default',
                        transition: 'all 0.2s',
                      }}
                    >
                      <span style={{ marginRight: 8 }}>
                        {tip.unlocked ? '✓' : '?'}
                      </span>
                      {tip.unlocked ? tip.title : '???'}
                    </button>
                  ))}
                </div>
              )
            })}
          </div>

          {/* Tip detail */}
          <div className="flex-1 overflow-y-auto p-5">
            {selectedTip ? (
              <div>
                <h3 style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: 14,
                  color: '#c8b888',
                  margin: '0 0 16px',
                }}>
                  {selectedTip.title}
                </h3>
                <p style={{
                  fontFamily: 'Share Tech Mono, monospace',
                  fontSize: 11,
                  color: '#7a7a8a',
                  lineHeight: 1.8,
                }}>
                  Select a technique from the list to view details about how it works and when to use it in real-world investigations.
                </p>
              </div>
            ) : (
              <div style={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
              }}>
                <div>
                  <div style={{
                    fontSize: 48,
                    marginBottom: 16,
                    opacity: 0.3,
                  }}>
                    🔍
                  </div>
                  <p style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 11,
                    color: '#4a5a6a',
                    lineHeight: 1.7,
                    maxWidth: 280,
                  }}>
                    Discover OSINT techniques by completing investigation nodes. Each technique you learn is added to this library for future reference.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px',
          borderTop: '1px solid #1a2a40',
          fontFamily: 'Crimson Pro, serif',
          fontStyle: 'italic',
          fontSize: 12,
          color: '#5a6878',
          lineHeight: 1.6,
        }}>
          These techniques can be applied to real-world open source intelligence gathering. Always use responsibly and ethically.
        </div>
      </div>
    </div>
  )
}
