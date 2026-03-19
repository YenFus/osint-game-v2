import { useState, useRef, useEffect } from 'react'
import { CharacterPortrait } from '../CharacterPortrait'
import { BUTTON_PRIMARY, BUTTON_DISABLED } from '../../styles/nodeStyles'

export function ReadNode({ content, onComplete, isReviewing = false }) {
  const [canContinue, setCanContinue] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollRef = useRef(null)

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    // If content is short enough, allow continue immediately
    if (el.scrollHeight <= el.clientHeight + 10) {
      setCanContinue(true)
      setScrollProgress(100)
      return
    }
    const handler = () => {
      const ratio = el.scrollTop / (el.scrollHeight - el.clientHeight)
      setScrollProgress(Math.round(ratio * 100))
      if (ratio >= (content.requiredScrollRatio ?? 0.85)) setCanContinue(true)
    }
    el.addEventListener('scroll', handler)
    return () => el.removeEventListener('scroll', handler)
  }, [content.requiredScrollRatio])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, height: '100%' }} role="article" aria-label="Document to read">
      <div
        ref={scrollRef}
        style={{
          flex: 1, overflowY: 'auto', padding: '20px 24px',
          background: '#0a0a12', border: '1px solid #1a1a28',
          maxHeight: 420,
        }}
        tabIndex={0}
        aria-label={`Document content. ${canContinue ? 'Fully read.' : `Scroll to read more. ${scrollProgress}% complete.`}`}
      >
        {content.sections.map((s, i) => (
          <section key={i} style={{ marginBottom: 24 }}>
            {s.heading && (
              <h3 style={{
                fontFamily: 'Barlow Condensed, sans-serif', fontSize: 14,
                color: '#7aa0c8', letterSpacing: '0.2em', textTransform: 'uppercase',
                marginBottom: 12, fontWeight: 600,
              }}>
                {s.heading}
              </h3>
            )}
            {/* Maya's voice sections have portrait indicator */}
            {s.voice === 'maya' ? (
              <div style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, width: 36 }}>
                  <CharacterPortrait character="maya" size={36} />
                </div>
                <div style={{
                  flex: 1,
                  padding: '14px 18px',
                  borderLeft: '3px solid #c8c0a8',
                  background: 'rgba(168, 160, 144, 0.08)',
                }}>
                  <div style={{
                    fontFamily: 'Share Tech Mono, monospace',
                    fontSize: 12,
                    color: '#a09888',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    marginBottom: 10,
                    fontWeight: 500,
                  }}>
                    Maya's Notes
                  </div>
                  <p style={{
                    fontFamily: 'Crimson Pro, serif',
                    fontStyle: 'italic',
                    fontSize: 17,
                    color: '#c8c0a8',
                    lineHeight: 1.8,
                    whiteSpace: 'pre-wrap',
                    margin: 0,
                  }}>
                    {s.body}
                  </p>
                </div>
              </div>
            ) : (
              <p style={{
                fontFamily: s.handwritten ? 'Crimson Pro, serif' : 'Crimson Pro, serif',
                fontStyle: s.handwritten ? 'italic' : 'normal',
                fontSize: s.handwritten ? 17 : 16,
                color: '#d8d0c0', lineHeight: 1.85,
                whiteSpace: 'pre-wrap',
              }}>
                {s.body}
              </p>
            )}
          </section>
        ))}
        <div style={{ height: 40 }} aria-hidden="true" />
      </div>

      {/* Screen reader announcement */}
      <div className="sr-only" aria-live="polite">
        {canContinue && 'Document fully read. Continue button is now available.'}
      </div>

      {isReviewing ? (
        <button
          onClick={onComplete}
          style={{ ...BUTTON_PRIMARY, alignSelf: 'flex-start', borderColor: '#d4a017', color: '#d4a017', background: 'rgba(212, 160, 23, 0.1)' }}
        >
          Return to Current →
        </button>
      ) : (
        <button
          disabled={!canContinue}
          onClick={onComplete}
          aria-label={canContinue ? 'Continue to next section' : 'Scroll down to read more before continuing'}
          style={{ ...(canContinue ? BUTTON_PRIMARY : BUTTON_DISABLED), alignSelf: 'flex-start' }}
        >
          {canContinue ? 'Continue →' : '▼ Scroll down to read more'}
        </button>
      )}
    </div>
  )
}
