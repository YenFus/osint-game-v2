// ─────────────────────────────────────────────────────────────────
// CONVERGENCE — the call.
// Review the case you built, then Ray texts: he's downstairs.
// Choose: call the police, go to Rosa + police, or face him.
// ─────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useGameStore } from '../store/gameStore'
import { CLUES, FINAL_SLOTS, SUSPECTS, clockLabel, missingLabel, rayDeadline, effectiveSuspicion } from '../data/caseData'
import { PolaroidArt } from '../components/board/PolaroidArt'
import { RayPhone } from '../components/board/RayPhone'
import { useAudio } from '../hooks/useAudio'
import '../styles/board.css'

export default function ConvergencePage() {
  const { finalCase, clock, clues, journalistUnlocked, raySuspicion } = useGameStore(useShallow(s => ({
    finalCase: s.finalCase, clock: s.clock, clues: s.clues, journalistUnlocked: s.journalistUnlocked, raySuspicion: s.raySuspicion,
  })))
  const gone = clock >= rayDeadline(effectiveSuspicion(raySuspicion))
  const setPhase = useGameStore(s => s.setPhase)
  const setEndingChoice = useGameStore(s => s.setEndingChoice)
  const { playSFX } = useAudio()
  const [stage, setStage] = useState('review') // review → phone → choose → leaving
  const [choice, setChoice] = useState(null)

  const suspect = SUSPECTS.find(s => s.id === finalCase.suspect)
  const filled = FINAL_SLOTS.filter(slot => finalCase.slots[slot.id]).length
  const canRosa = journalistUnlocked || clues.includes('rosa')

  // Heartbeat under the decision
  useEffect(() => {
    if (stage !== 'choose') return
    playSFX('heartbeat')
    const i = setInterval(() => playSFX('heartbeat'), 1500)
    return () => clearInterval(i)
  }, [stage, playSFX])

  const decide = (c) => {
    setChoice(c)
    setEndingChoice(c)
    setStage('leaving')
    playSFX(c === 'confront' ? 'error' : 'stamp')
    setTimeout(() => setPhase('ending'), 2600)
  }

  const OPTIONS = [
    {
      id: 'police',
      label: suspect?.id !== 'ray' && suspect ? `Call Detective Okafor about ${suspect.name}.` : gone ? 'Call Detective Okafor. Now.' : 'Call Detective Okafor. Let the buzzer ring.',
      sub: 'Maya\'s last written words: go straight to the police.',
      color: '#6a9a70',
    },
    canRosa && {
      id: 'journalist',
      label: 'Send everything to Rosa Velasquez — and the police — at the same time.',
      sub: 'Maya trusted her. A published story is hard to bury.',
      color: '#6a8ad0',
    },
    !gone && {
      id: 'confront',
      label: 'Go downstairs. Look him in the eye.',
      sub: 'Thirty years. You\'d know if he was lying.',
      color: '#d04a3a',
    },
  ].filter(Boolean)

  const leavingText = gone ? {
    police: 'You dial. Your hand is shaking now.',
    journalist: 'Two emails. One phone call. Your hand is shaking now.',
  } : {
    police: 'You dial. The buzzer goes again. You let it ring.',
    journalist: 'Two emails. One phone call. The buzzer goes again. You let it ring.',
    confront: 'You take the stairs two at a time.',
  }

  return (
    <div className="fixed inset-0 overflow-y-auto crt" style={{ background: 'radial-gradient(ellipse at 50% 20%, #2a1a10 0%, #0a0604 60%, #050302 100%)' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-8 sm:py-14">
        <div className="font-mono text-[12px] tracking-[0.4em] uppercase text-[#a03a2a] text-center">
          {clockLabel(clock)} · Maya missing {missingLabel(clock)}
        </div>
        <h1 className="text-center font-black uppercase leading-none mt-3 mb-8" style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.4rem, 7vw, 4.5rem)', color: '#f0e2c4' }}>
          The Call
        </h1>

        {/* Your case */}
        <div className="cb-cork" style={{ padding: 22, borderRadius: 2, boxShadow: '0 20px 50px rgba(0,0,0,0.7)' }}>
          <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative" style={{ zIndex: 5 }}>
            <div className="suspect-card" style={{ '--tilt': '-3deg', cursor: 'default', flexShrink: 0 }}>
              <span className="pin" />
              <div className="lead-img"><PolaroidArt scene={suspect?.scene ?? 'forum'} /></div>
              <div className="nm">{suspect?.name ?? '—'}</div>
              <div className="tg">{suspect?.tag}</div>
            </div>
            <div className="flex-1 w-full">
              <div className="hand text-[26px] leading-none text-[#fbeed4] mb-3" style={{ textShadow: '0 2px 4px #000' }}>
                What you're handing over:
              </div>
              <div className="grid gap-3">
                {FINAL_SLOTS.map(slot => {
                  const c = finalCase.slots[slot.id]
                  return (
                    <div key={slot.id} className={`final-slot ${c ? 'filled' : ''}`} style={{ minHeight: 0, cursor: 'default' }}>
                      <span className="lbl" style={{ fontSize: 18 }}>{slot.label}</span>
                      <span className="val" style={{ marginLeft: 10, color: c ? undefined : '#e0a090' }}>
                        {c ? CLUES[c].title : 'nothing pinned — go back and pin a clue'}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {stage === 'review' && (
          <div className="text-center mt-8 fade-in">
            <p className="text-lg italic text-[#b0a088] max-w-xl mx-auto" style={{ fontFamily: "'Crimson Pro', serif" }}>
              Maya wanted three independent sources before she said a word. You're about to say it for her.
            </p>
            {/* You can still make the call with an empty file. You should know
                that is what you are doing before you do it. */}
            {(!finalCase.suspect || filled === 0) && (
              <p className="text-base max-w-xl mx-auto mt-4" style={{ fontFamily: "'Crimson Pro', serif", color: '#e0a090' }}>
                {!finalCase.suspect && filled === 0
                  ? 'You have circled nobody and pinned nothing. Okafor will have a name-less case and a tired man on the phone. Both are fixed on the board.'
                  : !finalCase.suspect
                    ? 'You have not circled anybody. Whatever you read out, he will ask you who you are accusing.'
                    : 'You have pinned nothing under the three questions. He will ask what you have, and you will have to say nothing.'}
              </p>
            )}
            <div className="flex gap-3 justify-center flex-wrap mt-6">
              <button className="cb-btn" onClick={() => setPhase('investigation')}>← Not yet. Back to the board.</button>
              <button className="present-btn" style={{ margin: 0 }} onClick={() => setStage(gone ? 'choose' : 'phone')}>
                {!finalCase.suspect || filled === 0 ? 'Call anyway' : 'Pick up the phone'}
              </button>
            </div>
          </div>
        )}

        {(stage === 'choose' || stage === 'leaving') && (
          <div className="mt-10 fade-in">
            <p className="text-center text-xl italic text-[#e8d8b8]" style={{ fontFamily: "'Crimson Pro', serif" }}>
              {gone ? 'You try Ray first, without meaning to. Straight to voicemail.' : 'The buzzer goes. Once. Then again.'}
            </p>
            <p className="text-center hand text-[26px] text-[#e04a3a] mt-1">{gone ? 'Ray is already gone.' : 'Ray is downstairs.'}</p>
            <div className="grid gap-3 mt-6 max-w-2xl mx-auto">
              {OPTIONS.map(o => (
                <button
                  key={o.id}
                  onClick={() => stage === 'choose' && decide(o.id)}
                  disabled={stage !== 'choose'}
                  className="text-left px-5 py-4 transition-all"
                  style={{
                    border: `2px solid ${o.color}`, background: choice === o.id ? `${o.color}33` : 'rgba(10,6,4,0.7)',
                    opacity: stage === 'leaving' && choice !== o.id ? 0.25 : 1, cursor: stage === 'choose' ? 'pointer' : 'default',
                  }}
                >
                  <div className="type text-[16px]" style={{ color: '#f4e6c8' }}>→ {o.label}</div>
                  <div className="text-sm italic mt-1" style={{ fontFamily: "'Crimson Pro', serif", color: '#a89878' }}>{o.sub}</div>
                </button>
              ))}
            </div>
            {stage === 'leaving' && (
              <p className="text-center italic text-[#c8b898] mt-6 fade-in" style={{ fontFamily: "'Crimson Pro', serif", fontSize: 18 }}>
                {leavingText[choice]}
              </p>
            )}
          </div>
        )}
      </div>

      {stage === 'phone' && <RayPhone mode="final" onDone={() => setStage('choose')} />}
    </div>
  )
}
