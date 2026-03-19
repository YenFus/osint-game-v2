// Investigation Onboarding - Practical UI guide for first-time players
// Shows actual interface elements and explains what they do

import { useState, useEffect } from 'react'

const STORAGE_KEY = 'maya-investigation-onboarded'

function hasSeenOnboarding() {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function markOnboardingSeen() {
  try {
    localStorage.setItem(STORAGE_KEY, 'true')
  } catch {}
}

export function resetOnboarding() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {}
}

// Practical steps that show actual UI elements
const STEPS = [
  {
    title: 'Your Investigation Screen',
    content: "Let's walk through the interface so you know where everything is.",
    visual: 'overview',
  },
  {
    title: 'The Back Button',
    content: "In the top-left corner, you'll see '← Apartment'. This takes you back to Maya's apartment if you need to switch to a different investigation thread.",
    highlight: 'back',
    visual: 'header',
  },
  {
    title: 'Your Progress',
    content: "The dots in the top-right show how far you are in this thread. Each dot is a piece of evidence you'll examine.",
    highlight: 'progress',
    visual: 'header',
  },
  {
    title: 'Save Your Game',
    content: "Click 'Save' anytime to save your progress. You can also press Ctrl+S (or Cmd+S on Mac) for a quick save.",
    highlight: 'save',
    visual: 'header',
  },
  {
    title: 'The Evidence',
    content: "The main area shows the current evidence. Read everything carefully — documents, posts, notes. Scroll down to see more.",
    visual: 'content',
  },
  {
    title: 'OSINT Tips',
    content: "A blue panel on the right (or bottom on mobile) shows real OSINT techniques. These teach you actual investigation methods used by professionals.",
    highlight: 'tips',
    visual: 'sidebar',
  },
  {
    title: 'How to Progress',
    content: "Each evidence type has instructions. Usually: scroll to read, then click 'Continue' when you're done. Some require you to select items or enter answers.",
    visual: 'action',
  },
  {
    title: "You're Ready",
    content: "Take your time. Pay attention to details. Everything you discover builds toward the truth about Maya.",
    visual: 'ready',
  },
]

export function InvestigationOnboarding({ onComplete }) {
  const [visible, setVisible] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!hasSeenOnboarding()) {
      setVisible(true)
    }
  }, [])

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else {
      markOnboardingSeen()
      setVisible(false)
      onComplete?.()
    }
  }

  const handleSkip = () => {
    markOnboardingSeen()
    setVisible(false)
    onComplete?.()
  }

  useEffect(() => {
    if (!visible) return

    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        handleNext()
      } else if (e.key === 'Escape') {
        handleSkip()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [visible, step])

  if (!visible) return null

  const currentStep = STEPS[step]

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(4, 4, 10, 0.98)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 16,
      }}
      role="dialog"
      aria-labelledby="onboarding-title"
      aria-describedby="onboarding-content"
    >
      <div
        style={{
          maxWidth: 520,
          width: '100%',
          background: '#0a0a14',
          border: '2px solid #4a6080',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        {/* Visual demonstration area */}
        <div style={{
          background: '#06060c',
          padding: 24,
          borderBottom: '1px solid #2a3a50',
          minHeight: 140,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <UIVisual visual={currentStep.visual} highlight={currentStep.highlight} />
        </div>

        {/* Content */}
        <div style={{ padding: '24px 28px' }}>
          {/* Progress dots */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 24,
          }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                style={{
                  width: i === step ? 32 : 8,
                  height: 6,
                  borderRadius: 3,
                  background: i <= step ? '#4a90d9' : '#2a3a50',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>

          {/* Step number */}
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 12,
            color: '#6a90b0',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}>
            Step {step + 1} of {STEPS.length}
          </div>

          {/* Title */}
          <h2
            id="onboarding-title"
            style={{
              fontFamily: 'Barlow Condensed, sans-serif',
              fontSize: 26,
              fontWeight: 700,
              color: '#f0e8d8',
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              marginBottom: 14,
            }}
          >
            {currentStep.title}
          </h2>

          {/* Content */}
          <p
            id="onboarding-content"
            style={{
              fontFamily: 'Crimson Pro, serif',
              fontSize: 18,
              color: '#b0a898',
              lineHeight: 1.7,
              marginBottom: 28,
            }}
          >
            {currentStep.content}
          </p>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 12, justifyContent: 'space-between' }}>
            <button
              onClick={handleSkip}
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 14,
                color: '#6a6a78',
                background: 'none',
                border: '2px solid #3a3a50',
                padding: '14px 24px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                minHeight: 48,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#5a5a70'; e.currentTarget.style.color = '#9a9ab0' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#3a3a50'; e.currentTarget.style.color = '#6a6a78' }}
            >
              Skip Tutorial
            </button>
            <button
              onClick={handleNext}
              style={{
                fontFamily: 'Share Tech Mono, monospace',
                fontSize: 15,
                color: '#8ac0f0',
                background: 'rgba(74, 144, 217, 0.15)',
                border: '2px solid #4a90d9',
                padding: '14px 32px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontWeight: 600,
                minHeight: 48,
              }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(74, 144, 217, 0.3)'; e.currentTarget.style.color = '#b0d8ff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(74, 144, 217, 0.15)'; e.currentTarget.style.color = '#8ac0f0' }}
              autoFocus
            >
              {step < STEPS.length - 1 ? 'Next →' : 'Start Investigating'}
            </button>
          </div>

          {/* Keyboard hint */}
          <div style={{
            marginTop: 16,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 12,
            color: '#4a4a60',
            textAlign: 'center',
          }}>
            Press Enter to continue • Escape to skip
          </div>
        </div>
      </div>
    </div>
  )
}

// Visual UI mockups to show interface elements
function UIVisual({ visual, highlight }) {
  // Header mockup
  if (visual === 'header' || visual === 'overview') {
    return (
      <div style={{
        width: '100%',
        maxWidth: 400,
        background: '#08080e',
        border: '1px solid #2a3a50',
        borderRadius: 4,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '10px 16px',
          borderBottom: '1px solid #1a2030',
        }}>
          <div style={{
            padding: '6px 12px',
            border: `2px solid ${highlight === 'back' ? '#4a90d9' : '#3a3a50'}`,
            background: highlight === 'back' ? 'rgba(74, 144, 217, 0.15)' : 'transparent',
            borderRadius: 4,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 11,
            color: highlight === 'back' ? '#8ac0f0' : '#8a8a98',
          }}>
            ← Apartment
          </div>
          <div style={{
            display: 'flex',
            gap: 4,
            padding: '4px 8px',
            border: `2px solid ${highlight === 'progress' ? '#4a90d9' : 'transparent'}`,
            background: highlight === 'progress' ? 'rgba(74, 144, 217, 0.1)' : 'transparent',
            borderRadius: 4,
          }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%',
                background: i <= 2 ? '#2a5040' : i === 3 ? '#4a90d9' : '#1a1a28',
              }} />
            ))}
          </div>
          <div style={{
            padding: '6px 12px',
            border: `2px solid ${highlight === 'save' ? '#4a90d9' : '#4a6080'}`,
            background: highlight === 'save' ? 'rgba(74, 144, 217, 0.15)' : 'transparent',
            borderRadius: 4,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 11,
            color: highlight === 'save' ? '#8ac0f0' : '#8ab0c8',
          }}>
            Save
          </div>
        </div>
        {visual === 'overview' && (
          <div style={{
            padding: 16,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
            <div style={{
              flex: 1,
              height: 60,
              background: '#0c0c14',
              borderRadius: 4,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'Share Tech Mono, monospace',
              fontSize: 10,
              color: '#4a4a60',
            }}>
              Evidence Area
            </div>
          </div>
        )}
      </div>
    )
  }

  // Content area mockup
  if (visual === 'content') {
    return (
      <div style={{
        width: '100%',
        maxWidth: 360,
        background: '#08080e',
        border: '2px solid #4a90d9',
        borderRadius: 4,
        padding: 20,
      }}>
        <div style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 10,
          color: '#6a90b0',
          letterSpacing: '0.15em',
          marginBottom: 8,
        }}>
          DOCUMENT
        </div>
        <div style={{
          fontFamily: 'Barlow Condensed, sans-serif',
          fontSize: 16,
          color: '#d8d0c0',
          marginBottom: 12,
        }}>
          Maya's Research Notes
        </div>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
        }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              height: 8,
              background: '#2a2a38',
              borderRadius: 2,
              width: `${100 - i * 15}%`,
            }} />
          ))}
        </div>
        <div style={{
          marginTop: 12,
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 10,
          color: '#4a4a60',
          textAlign: 'center',
        }}>
          Scroll to read more ↓
        </div>
      </div>
    )
  }

  // Sidebar mockup
  if (visual === 'sidebar') {
    return (
      <div style={{
        width: '100%',
        maxWidth: 340,
        display: 'flex',
        gap: 12,
      }}>
        <div style={{
          flex: 1,
          background: '#08080e',
          border: '1px solid #2a3a50',
          borderRadius: 4,
          padding: 16,
          height: 80,
        }}>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 9,
            color: '#4a4a60',
          }}>
            Evidence
          </div>
        </div>
        <div style={{
          width: 120,
          background: '#0a0a14',
          border: '2px solid #4a80b0',
          borderRadius: 4,
          padding: 12,
        }}>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 10,
            color: '#8ac0f0',
            marginBottom: 8,
          }}>
            💡 OSINT Tip
          </div>
          <div style={{
            height: 6,
            background: '#2a4060',
            borderRadius: 2,
            marginBottom: 4,
          }} />
          <div style={{
            height: 6,
            background: '#2a4060',
            borderRadius: 2,
            width: '70%',
          }} />
        </div>
      </div>
    )
  }

  // Action mockup
  if (visual === 'action') {
    return (
      <div style={{
        width: '100%',
        maxWidth: 320,
        background: '#08080e',
        border: '1px solid #2a3a50',
        borderRadius: 4,
        padding: 20,
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 8,
          marginBottom: 16,
        }}>
          {[1,2,3].map(i => (
            <div key={i} style={{
              height: 8,
              background: '#2a2a38',
              borderRadius: 2,
              width: `${100 - i * 10}%`,
            }} />
          ))}
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            padding: '10px 24px',
            border: '2px solid #4a90d9',
            background: 'rgba(74, 144, 217, 0.15)',
            borderRadius: 4,
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 12,
            color: '#8ac0f0',
          }}>
            Continue →
          </div>
        </div>
      </div>
    )
  }

  // Ready checkmark
  if (visual === 'ready') {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 12,
      }}>
        <div style={{
          width: 64,
          height: 64,
          border: '3px solid #4a90d9',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
        }}>
          ✓
        </div>
        <div style={{
          fontFamily: 'Share Tech Mono, monospace',
          fontSize: 12,
          color: '#6a90b0',
          letterSpacing: '0.2em',
        }}>
          READY TO BEGIN
        </div>
      </div>
    )
  }

  return null
}
