// ─────────────────────────────────────────────────────────────────
// PROLOGUE ART — found media, not illustration.
//
// Every beat is a screen Thomas was actually looking at. No drawn
// people, no depicted rooms: a message thread, a call ringing out, a
// voicemail waveform, a name on an incoming call, his own photographs
// of her apartment, her browser. Flat, high contrast, one accent red.
//
// Photographs appear the way they appear on a phone — a frame, grain,
// a filename, a timestamp — never as a drawing of their contents.
// ─────────────────────────────────────────────────────────────────

import { useId, useState, useEffect } from 'react'


const MONO = "'Share Tech Mono', monospace"
const UI = "'Barlow Condensed', -apple-system, sans-serif"
const HAND = "'Caveat', cursive"

const INK = '#e8ecf4'
const DIM = '#68718a'
const RED = '#d8443a'

// Measured from the recording, 56 RMS buckets normalised to its peak.
const VM_WAVE = [
  0.61, 0.46, 0.63, 0.22, 0.08, 0.75, 0.81, 0.73, 0.46, 0.71, 0.73, 0.78, 0.66, 0.81,
  0.29, 0.08, 0.51, 0.89, 0.81, 0.78, 0.76, 0.08, 0.68, 0.84, 0.32, 0.56, 0.76, 0.72,
  0.75, 0.69, 0.50, 0.08, 0.08, 0.80, 0.77, 1.00, 0.73, 0.65, 0.70, 0.59, 0.57, 0.08,
  0.08, 0.08, 0.08, 0.75, 0.76, 0.08, 0.08, 0.08, 0.44, 0.79, 0.75, 0.58, 0.08, 0.08,
]

// The waveform's geometry, shared with the playhead so the two cannot drift:
// bars of width VM_BAR on a VM_PITCH grid, spanning VM_X0..VM_X1.
const VM_X0 = 556
const VM_PITCH = 8.0
const VM_BAR = 4.6
const VM_X1 = VM_X0 + (VM_WAVE.length - 1) * VM_PITCH + VM_BAR
const VM_SPAN = VM_X1 - VM_X0
const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`

// A phone held in the dark: the screen is the only light in the frame.
function Screen({ children, x = 520, y = 40, w = 560, h = 820 }) {
  return (
    <>
      <rect x={x - 26} y={y - 26} width={w + 52} height={h + 52} rx="58" fill="#0a0b10" />
      <rect x={x - 26} y={y - 26} width={w + 52} height={h + 52} rx="58"
        fill="none" stroke="#262c39" strokeWidth="3" />
      <rect x={x} y={y} width={w} height={h} rx="30" fill="#070a10" />
      <rect x={x + w / 2 - 60} y={y + 16} width="120" height="9" rx="4.5" fill="#161b25" />
      {children}
      <rect x={x + w / 2 - 70} y={y + h - 26} width="140" height="7" rx="3.5" fill="#1c2230" />
    </>
  )
}

function Glow({ u, cx, cy, rx, ry, o = 0.2 }) {
  return <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={`url(#${u('glow')})`} opacity={o} />
}

const SCENES = {
  // ── a thread with his daughter ──────────────────────────────────
  messages: (u) => {
    const X = 520, Wd = 560
    const bubbles = [
      { me: false, t: 'Dinner tuesday? I need to talk to you', y: 196, w: 390 },
      { me: true, t: 'Seven. Your pick.', y: 292, w: 210 },
      { me: false, t: "Don't be late this time", y: 366, w: 270 },
      { me: true, t: "I'm here. Got us the corner table", y: 552, w: 380 },
      { me: true, t: 'Maya?', y: 640, w: 120 },
    ]
    return (
      <>
        <Glow u={u} cx={800} cy={430} rx={520} ry={480} o={0.22} />
        <Screen>
          <text x="800" y="112" textAnchor="middle" fontFamily={UI} fontSize="36" fill={INK}>Maya</text>
          <text x="800" y="144" textAnchor="middle" fontFamily={MONO} fontSize="15" fill={DIM}>daughter · mobile</text>
          <path d="M545 168 H1055" stroke="#161c27" strokeWidth="2" />
          {bubbles.map((b, i) => (
            <g key={i}>
              <rect x={b.me ? X + Wd - b.w - 24 : X + 24} y={b.y} width={b.w} height="56" rx="27"
                fill={b.me ? '#1e3a63' : '#171c28'} />
              <text x={b.me ? X + Wd - 44 : X + 44} y={b.y + 36}
                textAnchor={b.me ? 'end' : 'start'} fontFamily={UI} fontSize="23"
                fill={b.me ? '#d8e5f8' : '#c3cbdc'}>{b.t}</text>
            </g>
          ))}
          <text x="1056" y="446" textAnchor="end" fontFamily={MONO} fontSize="13" fill={DIM}>Read Sunday 11:04</text>
          <text x="1056" y="716" textAnchor="end" fontFamily={MONO} fontSize="13" fill={RED}>Delivered · not read</text>
        </Screen>
      </>
    )
  },

  // ── the call that rings out ─────────────────────────────────────
  calling: (u) => (
    <>
      <Glow u={u} cx={800} cy={400} rx={480} ry={460} o={0.18} />
      <Screen>
        <text x="800" y="256" textAnchor="middle" fontFamily={UI} fontSize="66" fill={INK} letterSpacing="4">MAYA</text>
        <text x="800" y="306" textAnchor="middle" fontFamily={MONO} fontSize="20" fill={DIM}>calling…</text>
        {[0, 1, 2, 3, 4, 5, 6].map(i => (
          <circle key={i} cx={671 + i * 43} cy="378" r="8" fill="#3d4658" />
        ))}
        <text x="800" y="436" textAnchor="middle" fontFamily={MONO} fontSize="17" fill={DIM}>seven rings</text>
        <rect x="600" y="492" width="400" height="82" rx="10" fill="#11161f" stroke="#242b39" strokeWidth="2" />
        <text x="800" y="528" textAnchor="middle" fontFamily={UI} fontSize="22" fill="#98a3b8">This person has not set up</text>
        <text x="800" y="556" textAnchor="middle" fontFamily={UI} fontSize="22" fill="#98a3b8">a voicemail box.</text>
        <circle cx="800" cy="706" r="46" fill={RED} />
        <path d="M778 700 q22 -16 44 0 l-7 18 q-15 -8 -30 0 Z" fill="#0a0b10"
          transform="rotate(134 800 706)" />
      </Screen>
    </>
  ),

  // ── the voicemail that was already waiting ──────────────────────
  // The bars are the RMS envelope of public/audio/maya-voicemail.m4a in 56
  // buckets, measured off the file — so the shape on the screen is the shape
  // of what you are about to hear, including the gap before "hang on".
  voicemail: (u, st = {}) => {
    const prog = Math.max(0, Math.min(1, st.progress ?? 0))
    const cur = st.duration ? st.duration * prog : 0
    return (
      <>
        <Glow u={u} cx={800} cy={420} rx={520} ry={420} />
        <Screen>
          <text x="800" y="150" textAnchor="middle" fontFamily={MONO} fontSize="17" fill={DIM} letterSpacing="5">VOICEMAIL</text>
          <text x="800" y="200" textAnchor="middle" fontFamily={UI} fontSize="36" fill={INK}>Maya</text>
          <text x="800" y="232" textAnchor="middle" fontFamily={MONO} fontSize="15" fill={RED}>
            Mon 7:52 am · {st.played ? 'played' : 'unheard'}
          </text>
          {VM_WAVE.map((v, i) => {
            const h = 10 + v * 120
            const past = (i + 0.5) / VM_WAVE.length <= prog
            return <rect key={i} x={VM_X0 + i * VM_PITCH} y={430 - h / 2} width={VM_BAR} height={h} rx="2.3"
              fill={past ? '#8fb6ea' : '#2b3242'} />
          })}
          {/* the playhead rides the waveform's own extent — it used to run
              556..1000.6 as bars and 596..1004 as a track, so at 0:00 the
              marker sat five unlit bars inside the wave */}
          <path d={`M${VM_X0 + VM_SPAN * prog} 336 v190`} stroke={RED} strokeWidth="3" strokeDasharray="9 7" />
          <path d={`M${VM_X0} 636 H${VM_X1}`} stroke="#1b2130" strokeWidth="4" />
          <path d={`M${VM_X0} 636 H${VM_X0 + VM_SPAN * prog}`} stroke="#8fb6ea" strokeWidth="4" />
          <circle cx={VM_X0 + VM_SPAN * prog} cy="636" r="7" fill="#8fb6ea" />
          <text x={VM_X0} y="672" fontFamily={MONO} fontSize="16" fill={DIM}>{fmt(cur)}</text>
          <text x={VM_X1} y="672" textAnchor="end" fontFamily={MONO} fontSize="16" fill={DIM}>{fmt(st.duration ?? 0)}</text>
        </Screen>
      </>
    )
  },

  // ── who is calling ──────────────────────────────────────────────
  ray: (u) => (
    <>
      <Glow u={u} cx={800} cy={380} rx={460} ry={420} o={0.16} />
      <Screen>
        <text x="800" y="150" textAnchor="middle" fontFamily={MONO} fontSize="16" fill={DIM} letterSpacing="5">INCOMING CALL</text>
        {/* a contact with no picture set — initials only */}
        <circle cx="800" cy="268" r="74" fill="#1a202c" stroke="#2b3342" strokeWidth="2" />
        <text x="800" y="292" textAnchor="middle" fontFamily={UI} fontSize="56" fill="#7d8798">R</text>
        <text x="800" y="396" textAnchor="middle" fontFamily={UI} fontSize="46" fill={INK}>Ray</text>
        <text x="800" y="430" textAnchor="middle" fontFamily={MONO} fontSize="17" fill={DIM}>mobile · favorites</text>
        <circle cx="700" cy="706" r="44" fill="#8e2b24" />
        <path d="M680 700 q20 -15 40 0 l-6 17 q-14 -7 -28 0 Z" fill="#0a0b10" transform="rotate(134 700 706)" />
        <circle cx="900" cy="706" r="44" fill="#2f7a46" />
        <path d="M880 700 q20 -15 40 0 l-6 17 q-14 -7 -28 0 Z" fill="#0a0b10" />
      </Screen>
    </>
  ),

  // ── his own photographs of her apartment ────────────────────────
  apartment: (u) => {
    const shots = [
      { n: 'IMG_4471', c: '#2e2a25', t: '18:31', label: 'keys · still in the bowl' },
      { n: 'IMG_4472', c: '#26242b', t: '18:33', label: 'wallet · cash in it' },
      { n: 'IMG_4476', c: '#1b1815', t: '18:38', label: 'desk · burned pages' },
      { n: 'IMG_4479', c: '#242229', t: '18:41', label: 'bed · not slept in' },
    ]
    return (
      <>
        <Glow u={u} cx={800} cy={420} rx={520} ry={440} o={0.14} />
        <Screen>
          <text x="800" y="120" textAnchor="middle" fontFamily={UI} fontSize="32" fill={INK}>Recents</text>
          <text x="800" y="150" textAnchor="middle" fontFamily={MONO} fontSize="14" fill={DIM}>4 photos · today</text>
          {shots.map((s, i) => {
            const gx = 552 + (i % 2) * 254
            const gy = 190 + Math.floor(i / 2) * 266
            return (
              <g key={s.n}>
                <rect x={gx} y={gy} width="230" height="200" fill={s.c} />
                {/* the photograph is not drawn — only its grain and its label */}
                <rect x={gx} y={gy} width="230" height="200" filter={`url(#${u('grain')})`} opacity="0.55" />
                <rect x={gx} y={gy} width="230" height="200" fill="none" stroke="#1b212d" strokeWidth="2" />
                <text x={gx + 12} y={gy + 30} fontFamily={HAND} fontSize="22" fill="#cbb98e">{s.label}</text>
                <rect x={gx} y={gy + 166} width="230" height="34" fill="rgba(4,6,10,0.85)" />
                <text x={gx + 10} y={gy + 189} fontFamily={MONO} fontSize="13" fill="#9fabc0">{s.n}</text>
                <text x={gx + 220} y={gy + 189} textAnchor="end" fontFamily={MONO} fontSize="13" fill={DIM}>{s.t}</text>
              </g>
            )
          })}
        </Screen>
      </>
    )
  },

  // ── her browser ─────────────────────────────────────────────────
  laptop: (u) => (
    <>
      <Glow u={u} cx={800} cy={400} rx={640} ry={430} />
      <rect x="150" y="86" width="1300" height="728" rx="14" fill="#0a0e15" stroke="#232b39" strokeWidth="3" />
      <rect x="168" y="104" width="1264" height="48" fill="#141a24" />
      {Array.from({ length: 17 }).map((_, i) => (
        <g key={i}>
          <rect x={174 + i * 73} y={110} width="68" height="38" rx="6" fill={i === 4 ? '#1d2634' : '#10151d'} />
          <rect x={182 + i * 73} y={124} width="44" height="6" rx="3" fill={i === 4 ? '#6f8fbe' : '#39435a'} />
        </g>
      ))}
      <text x="1424" y="182" textAnchor="end" fontFamily={MONO} fontSize="15" fill={DIM}>17 tabs</text>
      <rect x="196" y="204" width="1208" height="60" rx="8" fill="#111823" />
      <text x="220" y="242" fontFamily={MONO} fontSize="21" fill="#8fb0dd">pdxmissing.org/threads/lena-vasquez</text>
      <text x="220" y="330" fontFamily={UI} fontSize="50" fill={INK} letterSpacing="1">LENA VASQUEZ</text>
      <text x="220" y="372" fontFamily={UI} fontSize="25" fill="#93a0b6">Missing since April 13 · Millhaven, Oregon</text>
      {/* The poster was an empty grey rectangle with a filename under it —
          at the beat where Thomas first sees who his daughter was chasing.
          It is a scan of a missing poster now: the sheet, the word, and the
          frame where a face would be. No face is drawn; the rule across the
          game is that people are never depicted, only their media. */}
      <rect x="220" y="404" width="300" height="230" fill="#cfc9bd" />
      <text x="370" y="436" textAnchor="middle" fontFamily={UI} fontWeight="700"
        fontSize="30" letterSpacing="3" fill="#8a1410">MISSING</text>
      <rect x="248" y="450" width="244" height="118" fill="#8d8a84" />
      <rect x="248" y="450" width="244" height="118" fill="none" stroke="#b4afa4" strokeWidth="2" />
      <text x="370" y="592" textAnchor="middle" fontFamily={UI} fontSize="21" fill="#241f18">LENA VASQUEZ · 29</text>
      <text x="370" y="616" textAnchor="middle" fontFamily={MONO} fontSize="13" fill="#5d564c">LAST SEEN APR 13 · MILLHAVEN</text>
      <rect x="220" y="404" width="300" height="230" filter={`url(#${u('grain')})`} opacity="0.45" />
      <rect x="220" y="404" width="300" height="230" fill="none" stroke="#2a3140" strokeWidth="2" />
      <text x="232" y="656" fontFamily={MONO} fontSize="13" fill="#8b95a9">missing-poster.jpg</text>
      {[430, 472, 514, 556, 598].map((y, i) => (
        <rect key={y} x="556" y={y} width={780 - (i % 3) * 160} height="12" rx="6" fill="#232a37" />
      ))}
    </>
  ),
}

function useIsPortrait() {
  const q = '(max-aspect-ratio: 3/4)'
  const [p, setP] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches)
  useEffect(() => {
    const mq = window.matchMedia(q)
    const on = e => setP(e.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return p
}

export function PrologueArt({ scene, className, style, playback }) {
  const raw = useId()
  const id = raw.replace(/[^a-zA-Z0-9]/g, '')
  const u = (n) => `${n}-${id}`
  const draw = SCENES[scene] ?? SCENES.messages
  const portrait = useIsPortrait()
  // a phone screen is already portrait — on a phone, frame it whole
  const box = portrait
    ? (scene === 'laptop' ? '150 60 1300 780' : '470 0 660 900')
    : '0 0 1600 900'

  return (
    // `slice` used to crop the landscape frame to fill its box, which cut
    // the top bezel and notch off every phone beat — the subject of the
    // whole prologue was decapitated, and the date stamp landed on the
    // remains. The scene paints its own darkness well past the viewBox, so
    // `meet` frames the phone whole without showing anything behind it.
    <svg viewBox={box} preserveAspectRatio="xMidYMid meet"
      className={className} style={{ display: 'block', width: '100%', height: '100%', ...style }}
      aria-hidden="true">
      <defs>
        <radialGradient id={u('glow')}>
          <stop offset="0" stopColor="#5f86d8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#5f86d8" stopOpacity="0" />
        </radialGradient>
        <filter id={u('grain')} x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
          <feBlend in2="SourceGraphic" mode="multiply" />
        </filter>
      </defs>
      <rect x="-600" y="-400" width="2800" height="1700" fill="#05070c" />
      {draw(u, playback)}
      <rect x="-600" y="-400" width="2800" height="1700" filter={`url(#${u('grain')})`} opacity="0.28" />
    </svg>
  )
}
