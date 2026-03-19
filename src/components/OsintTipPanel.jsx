// OSINT Tip Panel - Educational sidebar with real-world techniques
// NEW FEATURE: Mobile-friendly with bottom sheet on mobile, sidebar on desktop

import { useState, useEffect } from 'react'

export function OsintTipPanel({ tip, collapsed, onDismiss, onReopen }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!tip) return null

  // Collapsed state - show a button to reopen
  if (collapsed) {
    return (
      <button
        onClick={onReopen}
        title="Open OSINT method"
        aria-label="Open OSINT techniques panel"
        style={{
          position: 'fixed',
          ...(isMobile
            ? { bottom: 16, right: 16 }
            : { right: 0, top: '50%', transform: 'translateY(-50%)' }
          ),
          background: '#0a0a14',
          border: '2px solid #4a80b0',
          color: '#8ac0f0',
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 14,
          padding: isMobile ? '14px 20px' : '14px 10px',
          cursor: 'pointer',
          zIndex: 100,
          letterSpacing: '0.1em',
          writingMode: isMobile ? 'horizontal-tb' : 'vertical-rl',
          textTransform: 'uppercase',
          fontWeight: 600,
          minHeight: 48,
          minWidth: 48,
          borderRadius: isMobile ? 8 : 0,
          borderRight: isMobile ? '2px solid #4a80b0' : 'none',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        }}
      >
        💡 Tips
      </button>
    )
  }

  // Mobile: Bottom sheet
  // Desktop: Right sidebar
  const panelStyle = isMobile
    ? {
        position: 'fixed',
        left: 8,
        right: 8,
        bottom: 8,
        maxHeight: '70vh',
        background: '#0a0a14',
        border: '2px solid #3a5070',
        borderRadius: 12,
        zIndex: 100,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 -8px 30px rgba(0,0,0,0.6)',
      }
    : {
        position: 'fixed',
        right: 0,
        top: 0,
        bottom: 0,
        width: 340,
        background: '#08080e',
        borderLeft: '2px solid #3a5070',
        zIndex: 40,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }

  return (
    <div
      role="complementary"
      aria-label="OSINT techniques panel"
      style={panelStyle}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid #2a3a50',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexShrink: 0,
        background: isMobile ? '#0c0c18' : 'transparent',
      }}>
        <span style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 14,
          color: '#8ac0f0',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          💡 OSINT Method
        </span>
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: '2px solid #4a5a70',
            color: '#9aaac0',
            cursor: 'pointer',
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 16,
            lineHeight: 1,
            padding: '10px 14px',
            minHeight: 48,
            minWidth: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          aria-label="Close panel"
        >
          ✕
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: '20px 20px 32px', overflowY: 'auto' }}>
        {/* Title */}
        <h3 style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 22,
          color: '#f0e0b0',
          margin: '0 0 16px',
          lineHeight: 1.3,
          fontWeight: 700,
        }}>
          {tip.title}
        </h3>

        {/* Description */}
        <p style={{
          fontFamily: 'Crimson Pro, serif',
          fontSize: 17,
          color: '#b0b0c0',
          lineHeight: 1.7,
          margin: '0 0 28px',
        }}>
          {tip.body}
        </p>

        {/* Steps */}
        {tip.steps && (
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 13,
              color: '#6a90b0',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 14,
              fontWeight: 600,
            }}>
              Method:
            </div>
            {tip.steps.map((step, i) => (
              <div key={i} style={{
                display: 'flex',
                gap: 12,
                marginBottom: 12,
                fontFamily: 'Crimson Pro, serif',
                fontSize: 16,
                color: '#a0a0b0',
                lineHeight: 1.6,
              }}>
                <span style={{
                  color: '#6ab0e8',
                  flexShrink: 0,
                  fontFamily: 'Share Tech Mono, monospace',
                  fontWeight: 700,
                  fontSize: 15,
                }}>
                  {i + 1}.
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        )}

        {/* Tools */}
        {tip.tools && (
          <div style={{ marginBottom: 24 }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 13,
              color: '#6a90b0',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 14,
              fontWeight: 600,
            }}>
              Real-world tools:
            </div>
            {tip.tools.map((t, i) => (
              <div key={i} style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 15,
                color: '#8ac0f0',
                marginBottom: 10,
                paddingLeft: 14,
                borderLeft: '3px solid #3a5070',
              }}>
                {t}
              </div>
            ))}
          </div>
        )}

        {/* Warning */}
        {tip.warning && (
          <div style={{
            marginTop: 20,
            padding: '16px 18px',
            border: '2px solid #6a5040',
            background: '#140e08',
            fontFamily: 'Crimson Pro, serif',
            fontSize: 16,
            color: '#d0a080',
            lineHeight: 1.6,
            borderRadius: 4,
          }}>
            ⚠️ {tip.warning}
          </div>
        )}
      </div>
    </div>
  )
}
