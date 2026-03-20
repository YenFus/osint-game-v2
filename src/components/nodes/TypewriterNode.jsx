import { useState, useEffect, useRef } from 'react'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { useAudio } from '../../hooks/useAudio'

export function TypewriterNode({ content, onComplete }) {
  const [displayed, setDisplayed] = useState('')
  const [segmentIndex, setSegmentIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [phase, setPhase] = useState('typing') // 'typing' | 'pausing' | 'monologue' | 'done'
  const [monologueIndex, setMonologueIndex] = useState(0)
  const [shownMonologue, setShownMonologue] = useState([])
  const { playSFX } = useAudio()
  const keyCountRef = useRef(0)

  // Typing phase
  useEffect(() => {
    if (phase !== 'typing') return
    if (segmentIndex >= content.segments.length) {
      const pause = content.postTypingPause ?? 800
      setTimeout(() => setPhase(content.monologueLines?.length ? 'monologue' : 'done'), pause)
      return
    }

    const seg = content.segments[segmentIndex]

    if (charIndex >= seg.text.length) {
      if (seg.pauseAfter) {
        setPhase('pausing')
        setTimeout(() => {
          setPhase('typing')
          setSegmentIndex(prev => prev + 1)
          setCharIndex(0)
        }, seg.pauseAfter)
      } else {
        setSegmentIndex(prev => prev + 1)
        setCharIndex(0)
      }
      return
    }

    const timer = setTimeout(() => {
      setDisplayed(prev => prev + seg.text[charIndex])
      setCharIndex(prev => prev + 1)
      // Play key click every 2 characters — realistic typing rhythm without being too busy
      keyCountRef.current++
      if (keyCountRef.current % 2 === 0 && seg.text[charIndex] !== ' ') {
        playSFX('typewriterKey')
      }
    }, seg.delay ?? 65)

    return () => clearTimeout(timer)
  }, [phase, segmentIndex, charIndex, content.segments, content.monologueLines, content.postTypingPause])

  // Monologue phase
  useEffect(() => {
    if (phase !== 'monologue') return
    const lines = content.monologueLines ?? []
    if (monologueIndex >= lines.length) {
      setTimeout(() => setPhase('done'), 600)
      return
    }
    const line = lines[monologueIndex]
    const timer = setTimeout(() => {
      setShownMonologue(prev => [...prev, line.text])
      setMonologueIndex(prev => prev + 1)
    }, line.delay ?? 1500)
    return () => clearTimeout(timer)
  }, [phase, monologueIndex, content.monologueLines])

  const isFullscreen = content.fullscreen ?? false

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', height: '100%',
      background: isFullscreen ? '#030306' : 'transparent',
      padding: isFullscreen ? 'clamp(20px, 5vw, 48px) clamp(16px, 8vw, 64px)' : '20px 24px',
      gap: 24,
    }}>
      {/* Email header */}
      {content.header && (
        <div style={{
          borderBottom: '1px solid #1a1a28', paddingBottom: 16, marginBottom: 8,
        }}>
          {content.header.map((line, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12,
              fontFamily: 'Share Tech Mono, monospace', fontSize: 10,
              color: '#4a4a58', marginBottom: 4,
            }}>
              <span style={{ color: '#3a3a48', width: 40, flexShrink: 0 }}>{line.label}</span>
              <span style={{ color: '#6a6268' }}>{line.value}</span>
            </div>
          ))}
        </div>
      )}

      {/* Typed text */}
      <div style={{ flex: 1 }}>
        <pre style={{
          fontFamily: 'Crimson Pro, serif',
          fontSize: isFullscreen ? 'clamp(14px, 2vw, 17px)' : 14,
          lineHeight: 1.9,
          color: '#c8bea8',
          whiteSpace: 'pre-wrap',
          margin: 0,
        }}>
          {displayed}
          {phase !== 'done' && (
            <span style={{
              display: 'inline-block', width: 2, height: '1em',
              background: '#c8bea8', marginLeft: 1,
              animation: 'blink 1s step-end infinite',
            }} />
          )}
        </pre>

        <style>{`
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0; }
          }
        `}</style>
      </div>

      {/* Monologue lines */}
      {shownMonologue.length > 0 && (
        <div style={{
          borderTop: '1px solid #1a1a28', paddingTop: 20,
          display: 'flex', flexDirection: 'column', gap: 10,
        }}>
          {shownMonologue.map((line, i) => (
            <p key={i} style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
              color: '#6a6260', letterSpacing: '0.08em', lineHeight: 1.7,
              margin: 0,
              animation: 'fadeIn 0.6s ease',
            }}>
              {line}
            </p>
          ))}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {phase === 'done' && (
        <button
          onClick={onComplete}
          style={{ ...BUTTON_PRIMARY, alignSelf: 'flex-start', animation: 'fadeIn 0.6s ease' }}
        >
          Continue →
        </button>
      )}
    </div>
  )
}
