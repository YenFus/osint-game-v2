import { useState, useEffect } from 'react'

const TUTORIAL_DATA = {
  read: {
    icon: '📄',
    title: 'Read the Document',
    description: 'Scroll down to read the entire document. Pay attention to names, dates, and details — they matter later.',
    action: 'Scroll down to continue',
    tip: 'The "Continue" button appears after you read enough.',
  },
  tag: {
    icon: '🏷️',
    title: 'Flag What Matters',
    description: 'You will see several items. Click the "Flag" button on anything that seems suspicious or important to the investigation.',
    action: 'Click "Flag" on suspicious items',
    tip: 'Not everything is a clue. Think like an investigator.',
  },
  input: {
    icon: '✏️',
    title: 'Answer the Question',
    description: 'Based on what you have read or discovered, type your answer in the text box.',
    action: 'Type your answer, then press Enter',
    tip: 'Answers come from the evidence you have seen.',
  },
  slider: {
    icon: '🔍',
    title: 'Recover the Image',
    description: 'This image is damaged or obscured. Drag the sliders to adjust brightness and contrast until you can read the hidden text.',
    action: 'Drag the sliders left and right',
    tip: 'Look for the sweet spot where text becomes readable.',
  },
  browse: {
    icon: '🌐',
    title: 'Explore Digital Content',
    description: 'You are looking through profiles, folders, or archives. Click on items to open them and examine the contents.',
    action: 'Click items to examine them',
    tip: 'Flag anything that seems connected to the case.',
  },
  connect: {
    icon: '🔗',
    title: 'Connect the Evidence',
    description: 'Draw lines between related pieces of evidence. Click one card, then click another to connect them.',
    action: 'Click two cards to connect them',
    tip: 'Think about cause and effect, or shared details.',
  },
  navigate: {
    icon: '🧭',
    title: 'Choose Your Path',
    description: 'You have reached a decision point. Each choice leads to different evidence. Pick the path that interests you.',
    action: 'Click a choice to continue',
    tip: 'There is no wrong answer — all paths reveal truth.',
  },
  typewriter: {
    icon: '⌨️',
    title: 'Key Discovery',
    description: 'Important information is being revealed. Watch carefully — this is a turning point in the investigation.',
    action: 'Wait for the text to finish',
    tip: 'This connects to what you have already found.',
  },
}

const STORAGE_KEY = 'maya-seen-tutorials'

function getSeenTutorials() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function markTutorialSeen(nodeType) {
  try {
    const seen = getSeenTutorials()
    if (!seen.includes(nodeType)) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...seen, nodeType]))
    }
  } catch {
    // localStorage unavailable
  }
}

export function NodeTutorial({ nodeType, onDismiss }) {
  const [visible, setVisible] = useState(false)
  const tutorial = TUTORIAL_DATA[nodeType]

  useEffect(() => {
    if (!tutorial) return

    const seen = getSeenTutorials()
    if (!seen.includes(nodeType)) {
      setVisible(true)
    }
  }, [nodeType, tutorial])

  const handleDismiss = () => {
    markTutorialSeen(nodeType)
    setVisible(false)
    onDismiss?.()
  }

  if (!visible || !tutorial) return null

  return (
    <div
      className="node-tutorial-overlay"
      role="dialog"
      aria-labelledby="tutorial-title"
      aria-describedby="tutorial-desc"
    >
      <div className="node-tutorial-content" style={{ maxWidth: 480 }}>
        <div className="node-tutorial-icon" aria-hidden="true">
          {tutorial.icon}
        </div>
        <h2 id="tutorial-title" className="node-tutorial-title">
          {tutorial.title}
        </h2>
        <p id="tutorial-desc" className="node-tutorial-desc">
          {tutorial.description}
        </p>

        {/* Clear action instruction */}
        <div style={{
          background: 'rgba(74, 144, 217, 0.15)',
          border: '1px solid rgba(74, 144, 217, 0.4)',
          padding: '14px 20px',
          marginBottom: 16,
          textAlign: 'center',
        }}>
          <div style={{
            fontFamily: 'Share Tech Mono, monospace',
            fontSize: 11,
            color: '#6a8aaa',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            marginBottom: 6,
          }}>
            What to do
          </div>
          <div style={{
            fontFamily: 'Barlow Condensed, sans-serif',
            fontSize: 18,
            color: '#b0d0f0',
            fontWeight: 600,
          }}>
            {tutorial.action}
          </div>
        </div>

        {/* Helpful tip */}
        <p style={{
          fontFamily: 'Crimson Pro, serif',
          fontStyle: 'italic',
          fontSize: 14,
          color: '#8a8a98',
          marginBottom: 24,
        }}>
          Tip: {tutorial.tip}
        </p>

        <button
          className="node-tutorial-dismiss"
          onClick={handleDismiss}
          autoFocus
        >
          Got it — Let's go
        </button>
      </div>
    </div>
  )
}

export function resetTutorials() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    // localStorage unavailable
  }
}
