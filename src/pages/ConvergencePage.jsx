import { useState } from 'react'
import { useGameStore } from '../store/gameStore'

const THREAD_PANELS = [
  {
    path: 'A',
    icon: '💻',
    label: 'Thread A — The Digital Trail',
    quote: '"I was wrong. Read the notebook."',
    detail: 'Corey Marsh was a deliberate misdirection. Maya proved it herself — spent three weeks on the obvious suspect while the real one kept watching.',
    borderColor: 'border-amber-900',
    textColor: 'text-amber-800',
    quoteColor: 'text-amber-200',
  },
  {
    path: 'B',
    icon: '📓',
    label: 'Thread B — The Private Notes',
    quote: '"Dad, it\'s Ray."',
    detail: 'An unsent email. Written at 11:47pm on March 9th. Maya disappeared the following morning. She knew — and she stopped herself from sending it.',
    borderColor: 'border-red-900',
    textColor: 'text-red-800',
    quoteColor: 'text-red-200',
  },
  {
    path: 'C',
    icon: '📌',
    label: 'Thread C — The Public Record',
    quote: '"All three lines connect to the same person."',
    detail: 'A PO box in Millhaven. A domain registered under his name. A restraining order for harassment. A forum username that knew things Lena never posted publicly.',
    borderColor: 'border-blue-900',
    textColor: 'text-blue-800',
    quoteColor: 'text-blue-200',
  },
]

export default function ConvergencePage() {
  const { setPhase, paths, evidenceScore, journalistUnlocked, setEndingChoice } = useGameStore()
  const [choice, setChoice] = useState(null)
  const [blockedChoice, setBlockedChoice] = useState(null)

  const handleChoice = (c) => {
    // Gate: "Call Ray" requires at least 2 paths completed
    if (c === 'call' && evidenceScore < 2) {
      setBlockedChoice('call')
      setTimeout(() => setBlockedChoice(null), 3500)
      return
    }
    setChoice(c)
    setEndingChoice(c)
    setTimeout(() => setPhase('ending'), 700)
  }

  return (
    <div className="min-h-screen bg-[#08080e] flex flex-col">

      {/* ── HEADER ── */}
      <div className="shrink-0 border-b border-[#0e0e18] px-8 py-3 flex items-center justify-between">
        <button
          onClick={() => setPhase('apartment')}
          className="font-mono text-[10px] text-[#7a7068] hover:text-[#b0a898] tracking-[0.25em] uppercase transition-colors cursor-pointer"
        >
          ← Apartment
        </button>
        <div className="font-mono text-[10px] text-red-800 tracking-[0.25em] uppercase flicker">
          Convergence
        </div>
      </div>

      {/* ── BODY ── */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-8 py-14 flex flex-col gap-16">

        {/* ── HERO ── */}
        <div className="border-b border-[#0e0e18] pb-12 fade-in">
          <div className="font-mono text-[10px] text-red-900 tracking-[0.4em] uppercase mb-5">
            Case file — convergence
          </div>
          <h1
            className="text-[#e8dcc8] font-black uppercase leading-none tracking-tight mb-5"
            style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            Three Threads.<br />One Name.
          </h1>
          <p className="text-[#7a7268] text-base italic leading-relaxed max-w-2xl">
            You started with three separate objects in Maya's apartment. You followed three separate trails. Every one of them ended in the same place.
          </p>
        </div>

        {/* ── EVIDENCE CARDS ── */}
        <div className="fade-in">
          <div className="font-mono text-[10px] text-[#5a5248] tracking-[0.3em] uppercase mb-6">
            What each thread revealed
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {THREAD_PANELS.map((t) => {
              const done = paths[t.path]?.completed
              return (
                <div
                  key={t.path}
                  className={`border p-5 transition-opacity duration-500 ${t.borderColor} border-opacity-40 ${!done ? 'opacity-30' : ''}`}
                >
                  <div className={`font-mono text-[9px] ${t.textColor} tracking-[0.3em] uppercase mb-3`}>
                    {t.icon} {t.label}
                  </div>
                  <blockquote className={`text-sm italic mb-4 leading-relaxed ${done ? t.quoteColor : 'text-[#3a3830]'}`}>
                    {t.quote}
                  </blockquote>
                  <p className="font-mono text-[10px] text-[#6a6058] leading-relaxed">
                    {t.detail}
                  </p>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── THE NAME ── */}
        <div className="border border-[#1e1e28] bg-[#0c0c14] p-8 fade-in">
          <div className="font-mono text-[10px] text-[#5a5248] tracking-[0.3em] uppercase mb-8">
            The person at the centre of every thread
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

            {/* Left: Identity */}
            <div>
              <h2
                className="text-[#e8dcc8] font-black uppercase tracking-tight mb-1 leading-none"
                style={{ fontFamily: "'Barlow Condensed', sans-serif", fontSize: '2.5rem' }}
              >
                Ray Callahan
              </h2>
              <div className="font-mono text-[11px] text-[#6a6058] mb-7">
                Millhaven, OR — your oldest friend
              </div>

              <div className="space-y-2.5">
                {[
                  ['Forum handle',  'stillwater_m'],
                  ['Online alias',  'nightwatch_rc'],
                  ['Domain',        'stillwater-media.net'],
                  ['PO Box',        '#441, Millhaven Post Office'],
                  ['Prior record',  'Restraining order — harassment (expired)'],
                ].map(([label, val]) => (
                  <div key={label} className="flex gap-4 font-mono text-[10px]">
                    <span className="text-[#4a4848] w-28 shrink-0">{label}</span>
                    <span className="text-[#9a9088]">{val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Chain of evidence */}
            <div className="border-l border-[#1e1e28] pl-8">
              <div className="font-mono text-[10px] text-[#5a5248] tracking-[0.3em] uppercase mb-5">
                Chain of evidence
              </div>
              <div className="space-y-2 font-mono text-[10px]">
                {[
                  { text: 'PO Box #441 → stillwater-media.net', dim: false },
                  { text: '↓', dim: true },
                  { text: 'stillwater-media.net → stillwater_m', dim: false },
                  { text: '↓', dim: true },
                  { text: 'stillwater_m → missing persons forum', dim: false },
                  { text: '↓', dim: true },
                  { text: 'forum → @velvet.echo (Lena)', dim: false },
                  { text: '↓', dim: true },
                  { text: 'Lena → Millhaven Arts Night → Ray, in person', dim: false },
                  { text: '↓', dim: true },
                  { text: 'Maya investigates → Maya disappears', dim: false, highlight: true },
                ].map((item, i) => (
                  <div
                    key={i}
                    className={`${item.dim ? 'text-[#2e2e38] pl-4' : item.highlight ? 'text-[#a09088]' : 'text-[#6a6258]'}`}
                  >
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── WHO IS RAY — emotional beat ── */}
        <div className="border-l-2 border-[#2a2028] pl-8 fade-in">
          <p className="text-[#7a7268] text-sm italic leading-loose">
            Ray Callahan has been in your life for thirty years. He was at your wedding. He sat with you at the hospital the night your wife died. He came to Maya's graduation.
          </p>
          <p className="text-[#7a7268] text-sm italic leading-loose mt-3">
            He has a key to your house. He knows Maya's phone number, her email address, the name of her university. She trusted him because you trusted him.
          </p>
          <p className="text-[#7a7268] text-sm italic leading-loose mt-3">
            Maya stopped herself from sending the email because she knew he had access to your devices. She was afraid that telling you would tell him first.
          </p>
        </div>

        {/* ── MAYA'S QUOTE ── */}
        <div className="border-l-4 border-red-900 pl-8 py-4 fade-in">
          <div className="font-mono text-[10px] text-red-900 tracking-[0.3em] uppercase mb-4">
            From Maya's unsent email — Mar 9, 11:47pm
          </div>
          <blockquote
            className="text-[#d5cdb8] text-3xl italic leading-snug"
            style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}
          >
            "Dad, it's Ray."
          </blockquote>
          <p className="font-mono text-[10px] text-[#5a5248] mt-4">
            She disappeared the following morning. March 10th.
          </p>
        </div>

        {/* ── DECISION ── */}
        <div className="border-t border-[#1a1a24] pt-10 pb-8 fade-in">
          <div className="font-mono text-[10px] text-[#5a5248] tracking-[0.3em] uppercase mb-4">
            What do you do
          </div>
          <p className="text-[#8a8278] text-sm italic leading-relaxed mb-8 max-w-xl">
            You have evidence. Not enough for certainty — but enough to act. Maya thought she needed one more source before going to the police. She never got the chance to find it.
          </p>

          <div className="flex gap-4 flex-wrap">
            <button
              onClick={() => handleChoice('police')}
              disabled={!!choice}
              className="font-mono text-[11px] tracking-widest uppercase border border-green-900 border-opacity-60 text-green-700 px-8 py-3.5 hover:bg-green-950 hover:bg-opacity-20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              → Take it to the police
            </button>
            <button
              onClick={() => handleChoice('call')}
              disabled={!!choice}
              className="font-mono text-[11px] tracking-widest uppercase border border-red-900 border-opacity-60 text-red-700 px-8 py-3.5 hover:bg-red-950 hover:bg-opacity-20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default"
            >
              → Call Ray yourself
            </button>
            {journalistUnlocked && evidenceScore >= 3 && (
              <button
                onClick={() => handleChoice('journalist')}
                disabled={!!choice}
                className="font-mono text-[11px] tracking-widest uppercase border border-blue-900 border-opacity-60 text-blue-700 px-8 py-3.5 hover:bg-blue-950 hover:bg-opacity-20 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-default"
              >
                → Contact Rosa Velasquez
              </button>
            )}
          </div>

          {blockedChoice === 'call' && (
            <p className="font-mono text-[10px] text-red-900 mt-5 fade-in italic">
              You don't have enough to confront him directly. He'll deny it, and then he'll run. Complete more threads first.
            </p>
          )}

          {choice && (
            <p className="font-mono text-[10px] text-[#5a5248] mt-5 fade-in italic">
              {choice === 'police'
                ? 'You dial the non-emergency line. Your hands are steady.'
                : choice === 'call'
                ? "You find his number. It's still in your contacts, under a photo from two Christmases ago."
                : 'You find Rosa Velasquez\'s email in Maya\'s sent folder. You forward everything.'}
            </p>
          )}
        </div>

      </div>
    </div>
  )
}
