import { useEffect } from 'react'

export function IntercutOverlay({ text, visible, onDismiss }) {
  useEffect(() => {
    if (!visible) return
    const timer = setTimeout(onDismiss, 4200)
    return () => clearTimeout(timer)
  }, [visible, onDismiss])

  return (
    <div
      onClick={onDismiss}
      style={{
        position: 'fixed', inset: 0,
        background: '#000',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 9000,
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'all' : 'none',
        transition: 'opacity 0.4s ease',
        cursor: 'pointer',
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, maxWidth: 400, padding: '0 40px' }}>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, transparent, #444)',
        }} />
        <p style={{
          fontFamily: 'Share Tech Mono, monospace',
          color: '#6a6868',
          fontSize: 12, letterSpacing: '0.15em',
          textAlign: 'center', lineHeight: 2,
          margin: 0,
        }}>
          {text}
        </p>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to top, transparent, #444)',
        }} />
        <span style={{
          fontFamily: 'Share Tech Mono, monospace', fontSize: 8,
          color: '#2a2a2a', letterSpacing: '0.3em', textTransform: 'uppercase',
        }}>
          click to continue
        </span>
      </div>
    </div>
  )
}
