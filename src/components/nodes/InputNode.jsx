import { useState, useRef, useEffect } from 'react'
import { useDiscoveryFeedback } from '../DiscoveryFeedback'
import { useGameStore } from '../../store/gameStore'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'

// Strict answer validation - requires exact match (case insensitive)
// Only accepts answers that match exactly, not partial/vague matches
function isAccepted(input, accepted) {
  const normalized = input.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '')
  return accepted.some(a => {
    const normalizedAccepted = a.toLowerCase().trim().replace(/[^a-z0-9\s]/g, '')
    return normalized === normalizedAccepted
  })
}

export function InputNode({ content, onComplete }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [questionIndex, setQuestionIndex] = useState(0)
  const [inputValue, setInputValue] = useState('')
  const [wrongFeedback, setWrongFeedback] = useState(null)
  const [showWhyWrong, setShowWhyWrong] = useState(false)
  const [answers, setAnswers] = useState([])
  const [allDone, setAllDone] = useState(false)
  const [wrongStreak, setWrongStreak] = useState(0)
  const inputRef = useRef(null)
  const feedbackRef = useRef(null)

  useEffect(() => {
    if (inputRef.current && !allDone) inputRef.current.focus()
  }, [questionIndex, allDone])

  const currentQ = content.questions[questionIndex]

  const handleSubmit = () => {
    if (!inputValue.trim()) return

    if (isAccepted(inputValue, currentQ.acceptedAnswers)) {
      const newAnswers = [...answers, { q: currentQ.prompt, a: inputValue }]
      setAnswers(newAnswers)
      setInputValue('')
      setWrongFeedback(null)
      setWrongStreak(0)

      // Trigger discovery feedback
      const isLastQuestion = questionIndex + 1 >= content.questions.length
      triggerDiscovery(isLastQuestion ? 'major' : 'minor')

      if (isLastQuestion) {
        setAllDone(true)
      } else {
        setQuestionIndex(questionIndex + 1)
      }
    } else {
      // Mark wrong guess for perfect investigation tracking
      if (activePath) {
        markWrongGuess(activePath)
      }
      const newStreak = wrongStreak + 1
      setWrongStreak(newStreak)
      const useHint = newStreak >= 2 && currentQ.hintFeedback
      setWrongFeedback({
        text: useHint ? currentQ.hintFeedback : (currentQ.wrongFeedback ?? 'That\'s not right. Re-read the data above.'),
        whyWrong: currentQ.whyWrongExplanation,
        attemptedAnswer: inputValue,
      })
      setShowWhyWrong(false)
      setInputValue('')
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>

        {/* Answered questions */}
        {answers.map((ans, i) => (
          <div key={i} style={{
            marginBottom: 24, padding: '16px 20px',
            borderLeft: '3px solid #4a8060', background: '#0a120c',
          }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
              color: '#7a9a78', letterSpacing: '0.15em', textTransform: 'uppercase',
              marginBottom: 8,
            }}>
              {content.questions[i].prompt}
            </div>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 15,
              color: '#80c090',
            }}>
              → {ans.a}
            </div>
          </div>
        ))}

        {/* Current question */}
        {!allDone && currentQ && (
          <div style={{ marginTop: answers.length > 0 ? 16 : 0 }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
              color: '#7aa0c8', letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: 14,
            }}>
              Question {answers.length + 1} of {content.questions.length}
            </div>
            <p style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20,
              color: '#e0d8c8', lineHeight: 1.5, marginBottom: 16, fontWeight: 500,
            }}>
              {currentQ.prompt}
            </p>
            {currentQ.contextNote && (
              <p style={{
                fontFamily: 'Crimson Pro, serif', fontSize: 14,
                color: '#908878', lineHeight: 1.6, marginBottom: 18,
                paddingLeft: 16, borderLeft: '2px solid #3a3a48', fontStyle: 'italic',
              }}>
                {currentQ.contextNote}
              </p>
            )}
            <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={e => {
                  setInputValue(e.target.value)
                  if (wrongFeedback) {
                    setWrongFeedback(null)
                    setShowWhyWrong(false)
                  }
                }}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                placeholder="Type your answer..."
                style={{
                  flex: 1,
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 15,
                  background: '#0a0a14', border: '2px solid #3a3a50',
                  color: '#d0c8b8', padding: '14px 18px',
                  outline: 'none',
                }}
              />
              <button
                onClick={handleSubmit}
                style={{
                  fontFamily: 'Share Tech Mono, monospace', fontSize: 18,
                  border: '2px solid #4a6080', color: '#8ab0d0',
                  background: 'rgba(74, 96, 128, 0.1)', padding: '14px 20px', cursor: 'pointer',
                  fontWeight: 600,
                }}
                title="Submit answer (or press Enter)"
              >
                →
              </button>
            </div>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 11,
              color: '#5a5a68', marginTop: 10,
            }}>
              Press Enter to submit
            </div>

            {wrongFeedback && (
              <div
                ref={feedbackRef}
                role="alert"
                aria-live="assertive"
                style={{
                  marginTop: 16, padding: '14px 18px',
                  background: '#100a0c', border: '2px solid #6a3040',
                  fontFamily: 'Crimson Pro, serif', fontSize: 15,
                  color: '#c08090', lineHeight: 1.6,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ color: '#c06070', fontSize: 18 }} aria-hidden="true">✗</span>
                  <div style={{ flex: 1 }}>
                    <span>{wrongFeedback.text}</span>
                    {wrongFeedback.whyWrong && !showWhyWrong && (
                      <button
                        onClick={() => setShowWhyWrong(true)}
                        className="why-wrong-link"
                        style={{
                          display: 'block',
                          marginTop: 10,
                          fontFamily: 'Share Tech Mono, monospace',
                          fontSize: 12,
                          color: '#8a6070',
                          textDecoration: 'underline',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          padding: 0,
                        }}
                      >
                        Why was this wrong?
                      </button>
                    )}
                    {wrongFeedback.whyWrong && showWhyWrong && (
                      <div className="why-wrong-explanation" style={{
                        marginTop: 12,
                        padding: '12px 16px',
                        background: '#0c0608',
                        borderLeft: '3px solid #5a3040',
                        fontFamily: 'Crimson Pro, serif',
                        fontSize: 14,
                        color: '#a08088',
                        lineHeight: 1.7,
                        fontStyle: 'italic',
                      }}>
                        {wrongFeedback.whyWrong}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Completion */}
      {allDone && (
        <div style={{
          borderTop: '1px solid #1a1a28', padding: '20px 24px',
          background: '#08080c',
        }}>
          {content.completionNote && (
            <p style={{
              fontFamily: 'Crimson Pro, serif', fontStyle: 'italic',
              fontSize: 16, color: '#a09888', lineHeight: 1.7,
              margin: '0 0 18px',
            }}>
              {content.completionNote}
            </p>
          )}
          <button onClick={onComplete} style={BUTTON_PRIMARY}>
            Continue →
          </button>
        </div>
      )}
    </div>
  )
}
