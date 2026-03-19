import { useState, useEffect } from 'react'
import { useGameStore } from '../store/gameStore'

// Derive ending type from state
function deriveEnding(evidenceScore, journalistUnlocked, endingChoice) {
  if (endingChoice === 'call') return 'tipoff'
  if (endingChoice === 'journalist' && journalistUnlocked && evidenceScore >= 3) return 'journalist'
  if (endingChoice === 'police') {
    if (evidenceScore >= 3) return 'perfect'
    if (evidenceScore >= 2) return 'partial'
    return 'cold'
  }
  return 'cold'
}

// Ending configurations with strong visual differentiation
const ENDINGS = {
  perfect: {
    rating: 'S',
    ratingLabel: 'Perfect Investigation',
    ratingColor: '#4a9060',
    ratingBg: 'rgba(74, 144, 96, 0.15)',
    icon: '★',
    heading: 'The Right Call',
    subheading: 'Three threads. One name. Complete evidence.',
    mayaStatus: 'FOUND ALIVE — 31 HOURS',
    mayaStatusColor: '#5a9060',
    rayStatus: 'ARRESTED',
    outcome: 'Maya is found 31 hours later in a storage unit off Route 9, Millhaven. She is dehydrated and frightened, but alive. Ray Callahan is arrested at a motel in Grants Pass the same night.',
    detail: 'Your complete evidence package — three independent sources, cross-verified — gave Detective Reyes enough for an immediate warrant. No delays. No second-guessing. Maya\'s own research, finished by you.',
    callLines: [
      { speaker: 'You', text: '"Detective Reyes. This is Tom Reyes — Maya Reyes is my daughter. I have evidence. I need you to listen."' },
      { speaker: 'Reyes', text: '"Mr. Reyes. Go ahead."' },
      { speaker: 'You', text: '"Three separate investigations. The domain stillwater-media.net is registered to Ray Callahan, PO Box 441, Millhaven. That\'s WHOIS — public record. The county business registry confirms it under Callahan Media LLC. There\'s a prior restraining order, case MH-2021-0384 — harassment, pseudonymous online accounts, email monitoring. Same pattern. And his Flickr puts him at the arts night the night Lena disappeared, location data confirmed."' },
      { speaker: 'Reyes', text: '"...Ray Callahan. As in—"' },
      { speaker: 'You', text: '"As in he was at your wife\'s funeral. As in he has a key to my house. Yes."' },
      { speaker: '—silence—', text: null },
      { speaker: 'Reyes', text: '"Stay where you are. Don\'t contact him. We\'re dispatching now."' },
    ],
    coda: '"She built a complete case. Three independent source types, all converging. In twenty years of investigations I haven\'t seen civilian work this thorough. She saved herself by doing it right — and you finished it by doing the same."',
    codaAttrib: '— Detective I. Reyes, Millhaven PD',
  },

  journalist: {
    rating: 'S',
    ratingLabel: 'Hidden Ending Unlocked',
    ratingColor: '#4a7ab0',
    ratingBg: 'rgba(74, 122, 176, 0.15)',
    icon: '📰',
    heading: 'The Public Record',
    subheading: 'You gave Maya\'s work to someone who knew how to use it.',
    mayaStatus: 'FOUND ALIVE — 61 HOURS',
    mayaStatusColor: '#4a7ab0',
    rayStatus: 'ARRESTED — CASE MADE PUBLIC',
    outcome: 'Rosa Velasquez publishes a documented piece in the Pacific Reporter 61 hours later. Ray Callahan is arrested before it goes live. Maya is found that afternoon. The case becomes a national story about online safety.',
    detail: 'The simultaneous pressure of documented journalism and police investigation creates a window where Callahan cannot maneuver. The journalism doesn\'t replace law enforcement — it prevents the case from being quietly shelved.',
    callLines: [
      { speaker: 'You', text: '"Rosa Velasquez. This is Tom Reyes. My daughter Maya contacted you about the Lena Vasquez case. She found everything. I\'m going to forward it to you and to Detective Reyes simultaneously."' },
      { speaker: 'Rosa', text: '"Mr. Reyes. I\'ve been waiting for this call. Maya told me she was close. Send everything."' },
      { speaker: 'You', text: '"WHOIS records. Flickr geolocation. Business registry. A court filing from four years ago — harassment, pseudonymous accounts, email access. And the unsent email she wrote the night she disappeared."' },
      { speaker: 'Rosa', text: '"I can have something ready to publish within 48 hours if the police move. Is Detective Reyes aware?"' },
      { speaker: 'You', text: '"Calling them next."' },
    ],
    coda: '"Maya\'s research was airtight. Verifiable, cross-referenced, sourced. She understood that evidence has to be able to withstand scrutiny. She was right about everything."',
    codaAttrib: '— Rosa Velasquez, Pacific Reporter',
  },

  partial: {
    rating: 'A',
    ratingLabel: 'Good Investigation',
    ratingColor: '#7a9a50',
    ratingBg: 'rgba(122, 154, 80, 0.15)',
    icon: '◆',
    heading: 'Enough',
    subheading: 'Not everything. But enough to act.',
    mayaStatus: 'FOUND ALIVE — 54 HOURS',
    mayaStatusColor: '#7a9a50',
    rayStatus: 'ARRESTED',
    outcome: 'Maya is found 54 hours later. The investigation takes longer than it might have — the police need time to build a warrant from two sources rather than three. But they get there.',
    detail: 'The restraining order — which you didn\'t find — would have confirmed the prior pattern of surveillance immediately. Without it, investigators have to locate it themselves. It adds time. Those 23 extra hours are their own kind of cost.',
    callLines: [
      { speaker: 'You', text: '"I have evidence about my daughter\'s disappearance. The person responsible. His name is Ray Callahan."' },
      { speaker: 'Reyes', text: '"What kind of evidence?"' },
      { speaker: 'You', text: '"A domain registration in his name. Location data placing him at the scene. He operated under a fake username — stillwater_m — and he knew things about the victim that were never public. I have the WHOIS record and the Flickr archive."' },
      { speaker: 'Reyes', text: '"That\'s... that\'s substantive. Where are you?"' },
      { speaker: 'You', text: '"Maya\'s apartment."' },
      { speaker: 'Reyes', text: '"Don\'t leave. And don\'t call Callahan. We\'re coming."' },
    ],
    coda: '"You gave us enough to start. That\'s what mattered. The third thread was already in the county system — we would have found it. But finding it first ourselves took time you didn\'t have."',
    codaAttrib: '— From the case review, May 2026',
  },

  cold: {
    rating: 'C',
    ratingLabel: 'Incomplete Investigation',
    ratingColor: '#8a7060',
    ratingBg: 'rgba(138, 112, 96, 0.15)',
    icon: '◇',
    heading: 'The Thin File',
    subheading: 'You gave them a name. You couldn\'t give them the evidence.',
    mayaStatus: 'FOUND ALIVE — 11 DAYS',
    mayaStatusColor: '#a07050',
    rayStatus: 'ARRESTED (DELAYED)',
    outcome: 'The police open a supplementary file with Ray\'s name. Without a warrant, they can only conduct informal inquiries. He has time.',
    detail: 'Maya is found eleven days later. She is alive. In the investigation that follows, every piece of evidence Maya built — the WHOIS record, the Flickr data, the court filing — is recovered from her laptop. It was all there. It just needed someone to follow it.',
    callLines: [
      { speaker: 'You', text: '"I think I know who took my daughter. His name is Ray Callahan."' },
      { speaker: 'Reyes', text: '"What\'s your evidence, Mr. Reyes?"' },
      { speaker: 'You', text: '"He — he was at the arts night. He has a key to my house. I found a name. A username. I think it\'s him."' },
      { speaker: 'Reyes', text: '"That\'s not going to be enough for a warrant. Is there anything else? A document, a record, something verifiable?"' },
      { speaker: '—silence—', text: null },
      { speaker: 'Reyes', text: '"Mr. Reyes. We\'ll note the name. But we need something more than belief."' },
    ],
    coda: '"The evidence was in the apartment the whole time. In her files. Her notebooks. She had documented everything. We just needed someone to hand it to us."',
    codaAttrib: '— Detective I. Reyes, post-case debrief',
  },

  tipoff: {
    rating: 'D',
    ratingLabel: 'Critical Mistake',
    ratingColor: '#a03030',
    ratingBg: 'rgba(160, 48, 48, 0.15)',
    icon: '✗',
    heading: 'Too Close',
    subheading: 'He heard something in your voice. He moved.',
    mayaStatus: 'FOUND ALIVE — 6 DAYS',
    mayaStatusColor: '#c04040',
    rayStatus: 'FLED — ARRESTED LATER',
    outcome: 'You call the police two minutes later. They reach Ray\'s listed address in Millhaven within 40 minutes. The location where Maya was being held is already empty.',
    detail: 'Maya is found six days later in a secondary location. She is alive. Ray Callahan is apprehended the following week in Nevada. The case closes. But the six days between your call and her rescue are their own kind of cost.',
    callLines: [
      { speaker: 'You', text: '"Ray. I\'ve been going through Maya\'s things. Her investigation. I found some things."' },
      { speaker: 'Ray', text: '"Tom. Hey. What kind of things?"' },
      { speaker: 'You', text: '"She found your name. The domain. The forum account. The restraining order."' },
      { speaker: '—silence—', text: null },
      { speaker: 'Ray', text: '"I don\'t know what she told you, but—"' },
      { speaker: 'You', text: '"Where is she, Ray?"' },
      { speaker: '—call ended—', text: null },
    ],
    coda: '"He had a monitoring app on his phone flagging public records searches on his name. He would have known you were close regardless. But calling him confirmed it immediately."',
    codaAttrib: '— From the police report, April 2026',
  },
}

const PATH_NAMES = {
  A: { icon: '💻', name: 'Digital Trail', color: '#4a90d9' },
  B: { icon: '📓', name: 'Private Notes', color: '#c0392b' },
  C: { icon: '📌', name: 'Public Record', color: '#d4a017' },
}

export default function EndingPage() {
  const { endingChoice, evidenceScore, journalistUnlocked, paths, perfectPaths, caseSummaries } = useGameStore()
  const endingType = deriveEnding(evidenceScore, journalistUnlocked, endingChoice)
  const ending = ENDINGS[endingType]

  const [phase, setPhase] = useState('reveal') // 'reveal' -> 'details'
  const [showCall, setShowCall] = useState(false)

  // Auto-advance from reveal to details
  useEffect(() => {
    const timer = setTimeout(() => setPhase('details'), 4000)
    return () => clearTimeout(timer)
  }, [])

  const handleRestart = () => {
    useGameStore.getState().resetGame()
    useGameStore.setState({ phase: 'menu' })
  }

  // Calculate stats
  const completedPaths = Object.keys(paths).filter(k => paths[k].completed)
  const perfectCount = Object.keys(perfectPaths).filter(k => paths[k].completed && perfectPaths[k]).length
  const totalClues = Object.values(caseSummaries).flat().length

  // Reveal phase - dramatic "MAYA FOUND" moment
  if (phase === 'reveal') {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center p-8"
        style={{ background: `radial-gradient(circle at center, ${ending.ratingBg} 0%, #08080e 70%)` }}
      >
        <div className="text-center animate-fadeIn">
          {/* Status */}
          <div
            className="font-mono text-xs tracking-[0.4em] uppercase mb-6 animate-pulse"
            style={{ color: ending.mayaStatusColor }}
          >
            Maya Reyes
          </div>

          {/* Main status */}
          <h1
            className="font-black uppercase tracking-tight mb-4"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(3rem, 10vw, 6rem)',
              color: ending.mayaStatusColor,
              textShadow: `0 0 60px ${ending.mayaStatusColor}40`,
            }}
          >
            {ending.mayaStatus}
          </h1>

          {/* Ray status */}
          <div className="font-mono text-sm tracking-[0.2em] uppercase" style={{ color: '#8a8a88' }}>
            Ray Callahan: <span style={{ color: endingType === 'tipoff' ? '#a03030' : '#5a9060' }}>{ending.rayStatus}</span>
          </div>

          {/* Click hint */}
          <div className="font-mono text-xs text-[#4a4a58] mt-12 animate-pulse">
            Click anywhere to continue
          </div>
        </div>

        {/* Click to advance */}
        <div
          className="fixed inset-0 cursor-pointer z-10"
          onClick={() => setPhase('details')}
        />

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fadeIn { animation: fadeIn 1.5s ease forwards; }
        `}</style>
      </div>
    )
  }

  // Details phase - full ending with stats
  return (
    <div className="min-h-screen bg-[#08080e] flex flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-[#1a1a28] px-6 py-4 flex items-center justify-between">
        <div className="font-mono text-xs text-[#4a4a58] tracking-[0.2em] uppercase">
          What Maya Knew
        </div>
        <div className="flex items-center gap-3">
          <span
            className="text-2xl"
            style={{ filter: `drop-shadow(0 0 8px ${ending.ratingColor})` }}
          >
            {ending.icon}
          </span>
          <div className="font-mono text-xs tracking-[0.15em]" style={{ color: ending.ratingColor }}>
            {ending.ratingLabel}
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full px-6 py-10 flex flex-col gap-10">

          {/* ═══ RATING BANNER ═══ */}
          <div
            className="border-2 p-8 text-center"
            style={{ borderColor: ending.ratingColor, background: ending.ratingBg }}
          >
            <div
              className="text-8xl font-black mb-2"
              style={{
                fontFamily: "'Barlow Condensed', sans-serif",
                color: ending.ratingColor,
                textShadow: `0 0 30px ${ending.ratingColor}50`,
              }}
            >
              {ending.rating}
            </div>
            <div className="font-mono text-sm tracking-[0.2em] uppercase" style={{ color: ending.ratingColor }}>
              {ending.ratingLabel}
            </div>
            <h1
              className="text-3xl sm:text-4xl font-black uppercase mt-6 mb-2"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#e8e0d0' }}
            >
              {ending.heading}
            </h1>
            <p className="text-base" style={{ fontFamily: "'Crimson Pro', serif", color: '#a0a098', fontStyle: 'italic' }}>
              {ending.subheading}
            </p>
          </div>

          {/* ═══ YOUR INVESTIGATION STATS ═══ */}
          <div className="border border-[#2a2a38] p-6">
            <div className="font-mono text-xs text-[#6a6a78] tracking-[0.2em] uppercase mb-6">
              Your Investigation
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              {/* Threads completed */}
              <div className="text-center">
                <div className="text-4xl font-black mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#d8d0c0' }}>
                  {completedPaths.length}/3
                </div>
                <div className="font-mono text-xs text-[#6a6a78]">Threads</div>
              </div>

              {/* Clues found */}
              <div className="text-center">
                <div className="text-4xl font-black mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: '#d8d0c0' }}>
                  {totalClues}
                </div>
                <div className="font-mono text-xs text-[#6a6a78]">Discoveries</div>
              </div>

              {/* Perfect paths */}
              <div className="text-center">
                <div className="text-4xl font-black mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: perfectCount === 3 ? '#d4a84b' : '#d8d0c0' }}>
                  {perfectCount}
                </div>
                <div className="font-mono text-xs text-[#6a6a78]">Perfect Threads</div>
              </div>

              {/* Time taken (maya found) */}
              <div className="text-center">
                <div className="text-4xl font-black mb-1" style={{ fontFamily: "'Barlow Condensed', sans-serif", color: ending.mayaStatusColor }}>
                  {ending.mayaStatus.split('—')[1]?.trim() || 'SAFE'}
                </div>
                <div className="font-mono text-xs text-[#6a6a78]">Maya Found</div>
              </div>
            </div>

            {/* Thread breakdown */}
            <div className="mt-8 pt-6 border-t border-[#1a1a28]">
              <div className="font-mono text-xs text-[#5a5a68] mb-4">Threads Completed</div>
              <div className="flex flex-wrap gap-3">
                {['A', 'B', 'C'].map(p => {
                  const done = paths[p]?.completed
                  const perfect = perfectPaths[p] && done
                  const info = PATH_NAMES[p]
                  return (
                    <div
                      key={p}
                      className="flex items-center gap-2 px-4 py-2 border"
                      style={{
                        borderColor: done ? info.color : '#2a2a38',
                        background: done ? `${info.color}10` : 'transparent',
                        opacity: done ? 1 : 0.3,
                      }}
                    >
                      <span className="text-lg">{info.icon}</span>
                      <span className="font-mono text-xs" style={{ color: done ? info.color : '#5a5a68' }}>
                        {info.name}
                      </span>
                      {perfect && <span className="text-xs text-[#d4a84b]">★</span>}
                      {done && !perfect && <span className="text-xs text-[#5a9060]">✓</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ═══ WHAT HAPPENED ═══ */}
          <div>
            <div className="font-mono text-xs text-[#6a6a78] tracking-[0.2em] uppercase mb-4">
              What Happened
            </div>
            <p className="text-lg leading-relaxed mb-4" style={{ fontFamily: "'Crimson Pro', serif", color: '#c8c0b0' }}>
              {ending.outcome}
            </p>
            <p className="text-base leading-relaxed" style={{ fontFamily: "'Crimson Pro', serif", color: '#8a8278', fontStyle: 'italic' }}>
              {ending.detail}
            </p>
          </div>

          {/* ═══ THE CALL (expandable) ═══ */}
          <div className="border border-[#1a1a28] bg-[#0a0a10]">
            <button
              onClick={() => setShowCall(!showCall)}
              className="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-[#0c0c14] transition-colors"
            >
              <div className="font-mono text-xs text-[#6a6a78] tracking-[0.2em] uppercase">
                The Call — Full Transcript
              </div>
              <span className="font-mono text-lg text-[#4a4a58]">{showCall ? '−' : '+'}</span>
            </button>

            {showCall && (
              <div className="px-6 pb-6 space-y-4 border-t border-[#1a1a28]">
                <div className="h-4" />
                {ending.callLines.map((line, i) => {
                  const isSystem = line.text === null
                  return (
                    <div key={i} className={`flex gap-4 ${isSystem ? 'my-2' : ''}`}>
                      {isSystem ? (
                        <div className="font-mono text-xs text-[#3a3a48] tracking-widest pl-28 italic">
                          {line.speaker}
                        </div>
                      ) : (
                        <>
                          <span className="font-mono text-xs shrink-0 w-24 pt-0.5" style={{
                            color: line.speaker === 'You' ? '#8a7040'
                              : line.speaker === 'Ray' ? '#7a2020'
                              : line.speaker === 'Rosa' ? '#3a6080'
                              : '#6a6a78',
                          }}>
                            {line.speaker}
                          </span>
                          <p className="text-sm italic leading-relaxed" style={{ fontFamily: "'Crimson Pro', serif", color: '#c0b8a8' }}>
                            {line.text}
                          </p>
                        </>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* ═══ CLOSING QUOTE ═══ */}
          <div
            className="pl-6 py-4"
            style={{ borderLeft: `3px solid ${ending.ratingColor}` }}
          >
            <blockquote
              className="text-lg italic leading-relaxed mb-3"
              style={{ fontFamily: "'Crimson Pro', serif", color: ending.ratingColor }}
            >
              {ending.coda}
            </blockquote>
            <div className="font-mono text-xs text-[#5a5a68]">{ending.codaAttrib}</div>
          </div>

          {/* ═══ OTHER ENDINGS HINT ═══ */}
          {(endingType !== 'perfect' && endingType !== 'journalist') && (
            <div className="border border-[#2a2a38] border-dashed p-6 text-center">
              <div className="font-mono text-xs text-[#5a5a68] tracking-[0.15em] uppercase mb-3">
                Other Endings Exist
              </div>
              <p className="text-sm text-[#6a6a78]" style={{ fontFamily: "'Crimson Pro', serif" }}>
                {evidenceScore < 3
                  ? `Complete all 3 investigation threads for a better outcome. You found ${evidenceScore}.`
                  : endingType === 'tipoff'
                    ? 'Never contact the suspect directly. Always go to the authorities first.'
                    : 'Find the journalist contact in Maya\'s research for a hidden ending.'}
              </p>
              <div className="flex justify-center gap-4 mt-4">
                {['A', 'B', 'C'].map(p => {
                  const done = paths[p]?.completed
                  return (
                    <div
                      key={p}
                      className="w-8 h-8 flex items-center justify-center rounded border"
                      style={{
                        borderColor: done ? PATH_NAMES[p].color : '#3a3a48',
                        color: done ? PATH_NAMES[p].color : '#3a3a48',
                        background: done ? `${PATH_NAMES[p].color}10` : 'transparent',
                      }}
                    >
                      {done ? '✓' : '?'}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* ═══ PLAY AGAIN ═══ */}
          <div className="border-t border-[#1a1a28] pt-8 pb-4 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <div className="font-mono text-xs text-[#3a3a48] tracking-[0.2em] uppercase mb-1">
                What Maya Knew — End
              </div>
              <div className="font-mono text-xs text-[#5a5a68]">
                Thank you for playing
              </div>
            </div>
            <button
              onClick={handleRestart}
              className="font-mono text-sm tracking-[0.15em] uppercase border-2 px-8 py-3 transition-all hover:bg-[#1a1a28] min-h-[48px]"
              style={{ borderColor: '#4a90d9', color: '#4a90d9' }}
            >
              ← Play Again
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
