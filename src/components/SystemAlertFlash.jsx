import { useEffect, useState } from 'react'
import { useAudio } from '../hooks/useAudio'

export function SystemAlertFlash({ trigger }) {
  // The alert is derived from the trigger rather than mirrored into state
  // on every render pass: `dismissed` only ever records the trigger that
  // has already had its four seconds, so nothing is set during an effect
  // body and the flash cannot cascade a second render on mount.
  const [dismissed, setDismissed] = useState(null)
  const { playSFX } = useAudio()
  const visible = !!trigger && dismissed !== trigger

  useEffect(() => {
    if (!trigger) return undefined
    playSFX('error')
    const timer = setTimeout(() => setDismissed(trigger), 3400)
    return () => clearTimeout(timer)
  }, [trigger, playSFX])

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
        fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
        color: '#e04a3a', letterSpacing: '0.15em', marginBottom: 6,
        textTransform: 'uppercase',
      }}>
        ⚠ Remote session access detected
      </div>
      <div style={{
        fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
        color: '#b06060', letterSpacing: '0.1em',
      }}>
        Connecting: 203.0.113.47 — 00:00:03... connection dropped
      </div>
    </div>
  )
}
