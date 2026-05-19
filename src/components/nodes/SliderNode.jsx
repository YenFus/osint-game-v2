import { useState, useRef, useEffect } from 'react'
import { BUTTON_PRIMARY, HEADER_BAR } from '../../styles/nodeStyles'

// Check if sliders are close enough to target values
// Increased tolerance to 40 to make it more forgiving
function isReadable(brightness, contrast, page) {
  return (
    Math.abs(brightness - page.targetBrightness) <= (page.tolerance ?? 40) &&
    Math.abs(contrast - page.targetContrast) <= (page.tolerance ?? 40)
  )
}

// Calculate how close we are to readability (0 = far, 1 = readable)
function getReadabilityProgress(brightness, contrast, page) {
  const tolerance = page.tolerance ?? 40
  const brightDiff = Math.abs(brightness - page.targetBrightness)
  const contrastDiff = Math.abs(contrast - page.targetContrast)
  const maxDiff = Math.max(brightDiff, contrastDiff)
  // Return 0-1 progress where 1 is fully readable
  return Math.max(0, 1 - (maxDiff / (tolerance * 2)))
}

export function SliderNode({ content, onComplete }) {
  const [pageIndex, setPageIndex] = useState(0)
  const [brightness, setBrightness] = useState(15)
  const [contrast, setContrast] = useState(80)
  const [pagesRead, setPagesRead] = useState([])
  const [transitioning, setTransitioning] = useState(false)
  const statusRef = useRef(null)
  const prevReadable = useRef(false)

  const page = content.pages[pageIndex]
  const readable = isReadable(brightness, contrast, page)
  const readabilityProgress = getReadabilityProgress(brightness, contrast, page)
  const isLast = pageIndex + 1 >= content.pages.length

  // Announce when text becomes readable
  useEffect(() => {
    if (readable && !prevReadable.current && statusRef.current) {
      statusRef.current.textContent = 'Text recovered! You can now read the content.'
    }
    prevReadable.current = readable
  }, [readable])

  const handleNext = () => {
    if (!readable) return
    const newRead = [...pagesRead, page.id]
    setPagesRead(newRead)
    setTransitioning(true)

    setTimeout(() => {
      if (isLast) {
        onComplete()
      } else {
        setPageIndex(pageIndex + 1)
        setBrightness(15)
        setContrast(80)
        setTransitioning(false)
      }
    }, 400)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, flex: 1, minHeight: 0, overflow: 'hidden' }} role="region" aria-label="Document recovery task">

      {/* Screen reader status */}
      <div ref={statusRef} className="sr-only" aria-live="polite" aria-atomic="true" />

      {/* Header */}
      <div style={{
        ...HEADER_BAR,
        justifyContent: 'space-between',
      }}>
        <span>Burned notebook — recovery mode</span>
        <span>{pageIndex + 1} / {content.pages.length}</span>
      </div>

      {/* Page content */}
      <div style={{ flex: 1, minHeight: 0, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div
          style={{
            position: 'relative',
            filter: `brightness(${brightness}%) contrast(${contrast}%)`,
            background: '#1a0e06',
            padding: '28px 32px',
            minHeight: 200,
            opacity: transitioning ? 0 : 1,
            transition: 'opacity 0.35s ease',
          }}
        >
          {/* Paper texture lines */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute', left: 32, right: 32,
              top: 52 + i * 24,
              height: 1, background: 'rgba(90, 60, 30, 0.18)',
              pointerEvents: 'none',
            }} />
          ))}

          {page.date && (
            <div style={{
              fontFamily: 'Crimson Pro, serif', fontStyle: 'italic',
              fontSize: 12, color: readable ? '#8a6040' : '#3a1808',
              marginBottom: 14, letterSpacing: '0.05em',
              transition: 'color 0.4s',
            }}>
              {page.date}
            </div>
          )}

          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontStyle: 'italic',
            fontSize: 15,
            lineHeight: 1.85,
            color: readable ? '#c8b888' : '#2a1206',
            margin: 0,
            transition: 'color 0.4s ease',
            position: 'relative', zIndex: 1,
          }}>
            {page.text}
          </p>

          {/* Burn vignette */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(0,0,0,0.65) 100%)',
            pointerEvents: 'none',
          }} />

          {/* Edge char marks */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to right, rgba(0,0,0,0.5) 0%, transparent 8%, transparent 92%, rgba(0,0,0,0.5) 100%)',
            pointerEvents: 'none',
          }} />
        </div>

        {/* Controls - NEW FEATURE: Mobile-friendly sliders */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 18,
          padding: '20px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
              color: '#7a7868', letterSpacing: '0.15em', textTransform: 'uppercase',
              width: 100, flexShrink: 0,
            }}>
              Brightness
            </span>
            <input
              type="range" min={0} max={200} value={brightness}
              onChange={e => setBrightness(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#6a90b8', height: 44, minWidth: 120 }}
              aria-label={`Brightness: ${brightness}%`}
              aria-valuemin={0}
              aria-valuemax={200}
              aria-valuenow={brightness}
            />
            <span style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 14,
              color: '#8a8a9a', width: 40, textAlign: 'right',
            }}>
              {brightness}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
              color: '#7a7868', letterSpacing: '0.15em', textTransform: 'uppercase',
              width: 100, flexShrink: 0,
            }}>
              Contrast
            </span>
            <input
              type="range" min={0} max={300} value={contrast}
              onChange={e => setContrast(Number(e.target.value))}
              style={{ flex: 1, accentColor: '#6a90b8', height: 44, minWidth: 120 }}
              aria-label={`Contrast: ${contrast}%`}
              aria-valuemin={0}
              aria-valuemax={300}
              aria-valuenow={contrast}
            />
            <span style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 14,
              color: '#8a8a9a', width: 40, textAlign: 'right',
            }}>
              {contrast}
            </span>
          </div>
        </div>

        {/* Progress indicator */}
        <div style={{ marginBottom: 12 }}>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
            color: '#5a5a68', letterSpacing: '0.1em', marginBottom: 6,
            textTransform: 'uppercase',
          }}>
            Recovery progress
          </div>
          <div style={{
            height: 4, background: '#1a1a28', borderRadius: 2, overflow: 'hidden',
          }}>
            <div style={{
              width: `${readabilityProgress * 100}%`,
              height: '100%',
              background: readable ? '#5a9060' : '#6a90b8',
              transition: 'all 0.2s ease',
            }} />
          </div>
        </div>

        {/* Per-page recalibration note — only after page 1 */}
        {pageIndex > 0 && (
          <p style={{
            fontFamily: 'Crimson Pro, serif',
            fontStyle: 'italic',
            fontSize: 13,
            color: '#4a4a58',
            margin: '0 0 4px',
          }}>
            Each page burned differently — recalibrate the sliders.
          </p>
        )}

        {/* CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          {readable ? (
            <button onClick={handleNext} style={BUTTON_PRIMARY}>
              {isLast ? 'Done →' : 'Next page →'}
            </button>
          ) : (
            <span style={{
              fontFamily: 'Crimson Pro, serif', fontSize: 15,
              color: '#6a6860', fontStyle: 'italic',
            }}>
              {readabilityProgress > 0.3
                ? 'Getting closer... keep adjusting'
                : 'Increase brightness and contrast to recover the burned text'}
            </span>
          )}
          {readable && (
            <span
              role="status"
              style={{
                fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
                color: '#5a9060', letterSpacing: '0.1em',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <span aria-hidden="true">✓</span>
              <span>Text recovered</span>
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
