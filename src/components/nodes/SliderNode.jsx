import { useState, useRef, useEffect } from 'react'
import { BUTTON_PRIMARY, HEADER_BAR } from '../../styles/nodeStyles'
import { useLeadProgress } from '../../hooks/useLeadProgress'

// Check if sliders are close enough to target values
// Increased tolerance to 40 to make it more forgiving
function isReadable(brightness, contrast, page) {
  return (
    Math.abs(brightness - page.targetBrightness) <= (page.tolerance ?? 40) &&
    Math.abs(contrast - page.targetContrast) <= (page.tolerance ?? 40)
  )
}

// The slider ranges the two controls actually travel over.
const BRIGHT_RANGE = 200
const CONTRAST_RANGE = 300

// How close we are to readability (0 = far, 1 = readable).
//
// This used to divide the miss by twice the tolerance, so anything more
// than ~60 units out clamped to zero — which is the entire useful range
// of the puzzle. The bar sat visibly empty while you worked and only
// twitched once you had effectively already solved it, so it read as a
// broken element rather than as guidance. Measure the miss against the
// distance each slider can actually travel instead.
function getReadabilityProgress(brightness, contrast, page) {
  if (isReadable(brightness, contrast, page)) return 1
  const brightMiss = Math.abs(brightness - page.targetBrightness) / BRIGHT_RANGE
  const contrastMiss = Math.abs(contrast - page.targetContrast) / CONTRAST_RANGE
  // the worse axis governs: both have to be right before the ink lifts
  const miss = Math.max(brightMiss, contrastMiss)
  // leave a sliver showing so the bar never looks dead
  return Math.min(0.97, Math.max(0.04, 1 - miss * 1.6))
}

export function SliderNode({ content, onComplete, nodeId = null }) {
  const [pageIndex, setPageIndex] = useLeadProgress(nodeId, 'page', 0)
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
          className="rec-page"
          style={{
            position: 'relative',
            // A flex item shrinks below its content by default, and this one
            // has no overflow of its own — so on a short viewport the page
            // squashed and the recovered handwriting spilled out of the
            // notebook and across the brightness slider. The column above
            // already scrolls; let it.
            flexShrink: 0,
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
            userSelect: readable ? 'text' : 'none',
          }} aria-hidden={!readable}>
            {page.text}
          </p>
          {/* until the ink lifts, a screen reader gets no more than the eye does */}
          {!readable && <p className="sr-only">The ink is still too faint to read. Adjust brightness and contrast.</p>}

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

        {/* Controls - Mobile-friendly sliders */}
        <div style={{
          display: 'flex', flexDirection: 'column', gap: 18,
          padding: '20px 0', flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
              color: '#838170', letterSpacing: '0.15em', textTransform: 'uppercase',
              width: 100, flexShrink: 0,
            }}>
              Brightness
            </span>
            <input
              className="rec-slider"
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
              color: '#838170', letterSpacing: '0.15em', textTransform: 'uppercase',
              width: 100, flexShrink: 0,
            }}>
              Contrast
            </span>
            <input
              className="rec-slider"
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
            fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
            color: '#7c7c8e', letterSpacing: '0.1em', marginBottom: 6,
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
            color: '#7a7a8f',
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
              color: '#7e7b72', fontStyle: 'italic',
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
