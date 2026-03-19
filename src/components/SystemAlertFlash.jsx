import { useEffect, useState } from 'react'

export function SystemAlertFlash({ trigger }) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!trigger) return
    setVisible(true)
    const timer = setTimeout(() => setVisible(false), 3400)
    return () => clearTimeout(timer)
  }, [trigger])

  if (!visible) return null

  return (
    <div style={{
      position: 'fixed', top: 20, right: 20, zIndex: 9999,
      background: '#07010a', border: '1px solid #8a1a20',
      padding: '12px 18px',
      boxShadow: '0 0 24px rgba(180, 30, 40, 0.35)',
      maxWidth: 320,
      animation: 'alertIn 0.2s ease',
    }}>
      <style>{`
        @keyframes alertIn {
          from { opacity: 0; transform: translateX(12px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
      <div style={{
        fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
        color: '#c0392b', letterSpacing: '0.15em', marginBottom: 6,
        textTransform: 'uppercase',
      }}>
        ⚠ Remote session access detected
      </div>
      <div style={{
        fontFamily: 'Share Tech Mono, monospace', fontSize: 9,
        color: '#6a1a20', letterSpacing: '0.1em',
      }}>
        Connecting: 203.0.113.47 — 00:00:03... connection dropped
      </div>
    </div>
  )
}
