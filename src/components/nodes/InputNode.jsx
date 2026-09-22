import { useState, useRef, useEffect, useId } from 'react'
import { useDiscoveryFeedback } from '../discoveryContext'
import { useGameStore } from '../../store/gameStore'
import { useLeadProgress } from '../../hooks/useLeadProgress'
import { BUTTON_PRIMARY } from '../../styles/nodeStyles'
import { wrongCost, CLUES } from '../../data/caseData'

// Forgiving answer matching: ignores case, punctuation and filler words,
// accepts an answer phrase anywhere in the input ("it was the Wayback
// Machine"), and tolerates a one- or two-letter typo in longer words.
const FILLER = new Set(['the', 'a', 'an', 'its', 'it', 'was', 'is', 'on', 'at', 'of', 'by', 'from', 'in', 'to', 'i', 'think', 'maybe', 'probably', 'office', 'site', 'website', 'com'])

function normalize(s) {
  return s.toLowerCase().replace(/'s\b/g, 's').replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/).filter(w => w && !FILLER.has(w))
}

function editDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, (_, i) => [i, ...Array(b.length).fill(0)])
  for (let j = 1; j <= b.length; j++) dp[0][j] = j
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
    }
  }
  return dp[a.length][b.length]
}

function wordMatches(w, target) {
  if (w === target) return true
  if (target.length >= 5) return editDistance(w, target) <= (target.length >= 8 ? 2 : 1)
  return false
}

function isAccepted(input, accepted) {
  const words = normalize(input)
  if (!words.length) return false
  return accepted.some(a => {
    const target = normalize(a)
    if (!target.length) return false
    // look for the target phrase as a run of consecutive words
    for (let i = 0; i + target.length <= words.length; i++) {
      if (target.every((t, k) => wordMatches(words[i + k], t))) return true
    }
    // joined forms: "wi fi" vs "wifi", "rcallahan admin" vs "rcallahan_admin"
    const joined = words.join('')
    const tJoined = target.join('')
    return tJoined.length >= 4 && (joined === tJoined || (tJoined.length >= 6 && joined.includes(tJoined)))
  })
}

export function InputNode({ content, onComplete, nodeId = null }) {
  const { triggerDiscovery } = useDiscoveryFeedback()
  const { markWrongGuess, activePath } = useGameStore()
  const [answers, setAnswers] = useLeadProgress(nodeId, 'answers', [])
  const [questionIndex, setQuestionIndex] = useState(() => Math.min(answers.length, content.questions.length - 1))
  const [inputValue, setInputValue] = useState('')
  const [wrongFeedback, setWrongFeedback] = useState(null)
  const [showWhyWrong, setShowWhyWrong] = useState(false)
  const [allDone, setAllDone] = useState(() => answers.length >= content.questions.length)
  // Persisted per lead: as plain useState, backing out to the board and
  // reopening reset the ladder to a first-offence 15 minutes.
  const [wrongStreak, setWrongStreak] = useLeadProgress(nodeId, 'wrong', 0)
  const inputRef = useRef(null)
  // one id per rendered question, so the field's name follows the question it answers
  const baseId = useId()
  const qid = `${baseId}q${answers.length}`
  const feedbackRef = useRef(null)

  useEffect(() => {
    // don't scroll to the field: the records it asks about sit above it now
    if (inputRef.current && !allDone) inputRef.current.focus({ preventScroll: true })
  }, [questionIndex, allDone])

  const currentQ = content.questions[questionIndex]

  const handleSubmit = () => {
    if (!inputValue.trim()) return

    if (isAccepted(inputValue, currentQ.acceptedAnswers)) {
      if (currentQ.revealsName) useGameStore.getState().flagNameSeen()
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
        markWrongGuess(activePath, wrongStreak + 1)
      }
      const newStreak = wrongStreak + 1
      setWrongStreak(newStreak)
      const useHint = newStreak >= 2 && currentQ.hintFeedback
      // This node charged the escalating penalty without ever naming it.
      const body = useHint ? currentQ.hintFeedback : (currentQ.wrongFeedback ?? 'That\'s not right. Re-read the data above.')
      setWrongFeedback({
        text: `${body} (+${wrongCost(newStreak)} min)`,
        whyWrong: currentQ.whyWrongExplanation,
        attemptedAnswer: inputValue,
      })
      setShowWhyWrong(false)
      setInputValue('')
    }
  }

  // Everything Thomas has written down so far, newest first — except the
  // note that simply contains the answer to the question on screen. The
  // column is here so the player does not have to remember what they read
  // in another lead, not so they can copy a line out of it.
  const clues = useGameStore(st => st.clues)
  const accepted = (currentQ?.acceptedAnswers ?? []).map(a => a.toLowerCase())
  const givesItAway = (clue) => {
    const text = `${clue.title} ${clue.detail}`.toLowerCase()
    return accepted.some(a => a.length > 4 && text.includes(a))
  }
  const [openNote, setOpenNote] = useState(null)
  const notes = [...clues].reverse().map(id => CLUES[id]).filter(c => c && !givesItAway(c))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, height: '100%' }}>
      {/* One question and a text box used to sit at the top of an
          otherwise black 1090x550 pane — the emptiest screen in the game,
          and five leads use this renderer. The form is a lit panel on a
          graded ground now, held in the middle of the pane the way the
          records drawer holds its jackets. */}
      <div className="inp-desk">
       <div className="inp-cols">
        <div className="inp-stack">

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
          <div className="inp-sheet" style={{ marginTop: answers.length > 0 ? 16 : 0 }}>
            <div style={{
              fontFamily: 'Share Tech Mono, monospace', fontSize: 13,
              color: '#7aa0c8', letterSpacing: '0.2em', textTransform: 'uppercase',
              marginBottom: 14,
            }}>
              Question {answers.length + 1} of {content.questions.length}
            </div>
            <p id={`${qid}-prompt`} style={{
              fontFamily: 'Barlow Condensed, sans-serif', fontSize: 20,
              color: '#e0d8c8', lineHeight: 1.5, marginBottom: 16, fontWeight: 500,
            }}>
              {currentQ.prompt}
            </p>
            {currentQ.contextNote && (
              <p id={`${qid}-note`} style={{
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
                id={`${qid}-answer`}
                aria-labelledby={`${qid}-prompt`}
                aria-describedby={currentQ.contextNote ? `${qid}-note` : undefined}
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
              fontFamily: 'Share Tech Mono, monospace', fontSize: 12,
              color: '#7c7c8e', marginTop: 10,
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
        {/* The records the question is actually about. A3 and A8 sit early in
            their thread, so the notes column beside them is nearly bare and
            the question was floating over 400px of black — and worse, it was
            asking the player to recall a document rather than read one. */}
        {content.records && (
          <section className="inp-records" aria-label="Records on the desk">
            <div className="inp-records-head">{content.recordsLabel ?? 'On the desk'}</div>
            <div className="inp-records-grid">
              {content.records.map(rec => (
                <article key={rec.label} className="inp-rec">
                  <header>
                    <span className="inp-rec-label">{rec.label}</span>
                    {rec.meta && <span className="inp-rec-meta">{rec.meta}</span>}
                  </header>
                  <dl>
                    {rec.fields.map(([k, v]) => (
                      <div key={k}>
                        <dt>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                  {rec.note && <p className="inp-rec-note">{rec.note}</p>}
                </article>
              ))}
            </div>
          </section>
        )}
        </div>

        {/* What you already have, open beside the question. This renderer used
            to ask the player to remember a line from another lead with the
            journal two clicks away behind the board — a memory test rather
            than an investigation. */}
        <aside className="inp-notes" aria-label="What you have found so far" tabIndex={0}>
          <div className="inp-notes-head">Your notes</div>
          {notes.length === 0 && <p className="inp-notes-empty">Nothing in the drawer yet.</p>}
          {/* Titles only; tap one to read it. Printing every note in full
              put up to a hundred extra words beside a one-line question. */}
          <ul>
            {notes.map(n => (
              <li key={n.title} className={openNote === n.title ? 'open' : ''}>
                <button type="button" className="t" aria-expanded={openNote === n.title}
                  onClick={() => setOpenNote(o => (o === n.title ? null : n.title))}>{n.title}</button>
                {openNote === n.title && (
                  <>
                    <span className="d">{n.detail}</span>
                    <span className="s">{n.source}</span>
                  </>
                )}
              </li>
            ))}
          </ul>
        </aside>
       </div>
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
