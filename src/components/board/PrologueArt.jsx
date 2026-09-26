// ─────────────────────────────────────────────────────────────────
// PROLOGUE ART — what Thomas was looking at.
//
// Each beat is a screen: his texts, the call, the voicemail, a receipt
// from the police, Ray's call, his photos of her apartment, her laptop. Behind
// each phone is the place he was standing, blurred, so the screen is never
// floating in a black void.
//
// An earlier pass had a rule that nobody and nothing was ever depicted —
// photographs were drawn as empty grey boxes with a label, Lena's poster
// as a blank rectangle, and the text on her page as grey bars. After a
// full playthrough the player said the prologue images looked bad, and
// they were right: that was placeholder art. The photographs are real
// now (local FLUX, scripts/gen_art.py) and the text is text.
// ─────────────────────────────────────────────────────────────────

import { useId, useState, useEffect } from 'react'


const MONO = "'Share Tech Mono', monospace"
const UI = "'Barlow Condensed', -apple-system, sans-serif"

const INK = '#e8ecf4'
const DIM = '#98a1b5'
const RED = '#d8443a'

// Measured from the recording, 56 RMS buckets normalised to its peak —
// printed by scripts/gen_voicemail.py every time the voicemail is rebuilt.
const VM_WAVE = [0.04, 0.87, 0.65, 0.39, 0.03, 0.98, 0.36, 0.48, 0.71, 0.75, 0.53, 0.62, 0.74, 0.72, 0.50, 0.03, 0.79, 0.38, 0.57, 0.76, 0.81, 0.79, 0.62, 0.12, 0.44, 0.81, 0.53, 0.84, 0.61, 0.64, 0.14, 0.81, 0.16, 0.61, 0.83, 0.77, 0.54, 0.28, 0.91, 0.80, 0.42, 0.32, 0.27, 0.78, 0.55, 0.03, 0.21, 0.97, 0.72, 0.21, 1.00, 0.36, 0.03, 0.03, 0.03, 0.03]

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

const BASE = import.meta.env.BASE_URL
const art = (f) => `${BASE}art/${f}`

// The place he was standing when he looked at each screen. Pre-blurred and
// darkened by scripts/prologue_bg.py so the phone stays the brightest thing.
const BACKDROP = {
  messages: 'pro-bg-restaurant.jpg',
  calling: 'pro-bg-restaurant.jpg',
  voicemail: 'pro-bg-restaurant.jpg',
  police: 'pro-bg-street.jpg',
  ray: 'pro-bg-street.jpg',
  apartment: 'pro-bg-flat.jpg',
  laptop: 'pro-bg-flat.jpg',
}

function Photo({ u, href, x, y, w, h, r = 0, id }) {
  const clip = u(`clip-${id}`)
  return (
    <>
      <clipPath id={clip}><rect x={x} y={y} width={w} height={h} rx={r} /></clipPath>
      <image href={href} x={x} y={y} width={w} height={h} preserveAspectRatio="xMidYMid slice" clipPath={`url(#${clip})`} />
    </>
  )
}

const SCENES = {
  // ── a thread with his daughter ──────────────────────────────────
  messages: () => {
    const X = 520, Wd = 560
    const bubbles = [
      { me: false, t: 'Dinner tuesday? I need to', t2: 'talk to you about something', y: 190, w: 360, two: true },
      { me: true, t: 'Seven. You pick.', y: 318, w: 220 },
      { me: false, t: "Luigi's on 23rd. don't be", t2: 'late this time dad', y: 392, w: 340, two: true },
      { me: true, t: "I'm here. Got us the corner table", y: 588, w: 420 },
      { me: true, t: 'Maya?', y: 676, w: 124 },
    ]
    return (
      <>
        <Screen>
          <text x="800" y="112" textAnchor="middle" fontFamily={UI} fontSize="38" fill={INK}>Maya</text>
          <text x="800" y="144" textAnchor="middle" fontFamily={MONO} fontSize="17" fill={DIM}>daughter · mobile</text>
          <path d="M545 168 H1055" stroke="#1d2431" strokeWidth="2" />
          <text x="800" y="182" textAnchor="middle" fontFamily={MONO} fontSize="14" fill={DIM}>Sunday</text>
          {bubbles.map((b, i) => {
            const h = b.two ? 92 : 58
            return (
              <g key={i}>
                <rect x={b.me ? X + Wd - b.w - 24 : X + 24} y={b.y} width={b.w} height={h} rx="28"
                  fill={b.me ? '#2456a0' : '#232a38'} />
                <text x={b.me ? X + Wd - 46 : X + 46} y={b.y + 38}
                  textAnchor={b.me ? 'end' : 'start'} fontFamily={UI} fontSize="26" fill="#eef2fa">{b.t}</text>
                {b.two && <text x={b.me ? X + Wd - 46 : X + 46} y={b.y + 72}
                  textAnchor={b.me ? 'end' : 'start'} fontFamily={UI} fontSize="26" fill="#eef2fa">{b.t2}</text>}
              </g>
            )
          })}
          <text x="1056" y="506" textAnchor="end" fontFamily={MONO} fontSize="15" fill={DIM}>Read Sunday 11:04 pm</text>
          <text x="800" y="570" textAnchor="middle" fontFamily={MONO} fontSize="14" fill={DIM}>Tuesday 7:20 pm</text>
          <text x="1056" y="756" textAnchor="end" fontFamily={MONO} fontSize="15" fill={RED}>Delivered · not read</text>
        </Screen>
      </>
    )
  },

  // ── the call that rings out, and the voicemail he'd missed ───────
  calling: () => (
    <>
      <Screen>
        <text x="800" y="236" textAnchor="middle" fontFamily={UI} fontSize="68" fill={INK} letterSpacing="4">MAYA</text>
        <text x="800" y="288" textAnchor="middle" fontFamily={MONO} fontSize="22" fill={DIM}>no answer</text>
        <text x="800" y="330" textAnchor="middle" fontFamily={MONO} fontSize="18" fill={DIM}>call ended · 0:41</text>
        <circle cx="800" cy="470" r="46" fill="#3a4152" />
        <path d="M778 464 q22 -16 44 0 l-7 18 q-15 -8 -30 0 Z" fill="#0a0b10" transform="rotate(134 800 470)" />
        {/* the notification he hadn't looked at since Monday */}
        <rect x="548" y="610" width="504" height="126" rx="20" fill="#1c2230" stroke="#3a4458" strokeWidth="2" />
        <circle cx="600" cy="673" r="24" fill="#2e7d4f" />
        <path d="M590 673 h20 M600 663 v20" stroke="#e8ecf4" strokeWidth="0" />
        <text x="600" y="681" textAnchor="middle" fontFamily={UI} fontSize="22" fill="#e8ecf4">▶</text>
        <text x="640" y="660" fontFamily={UI} fontSize="24" fill={INK}>Voicemail · Maya</text>
        <text x="640" y="694" fontFamily={MONO} fontSize="17" fill={DIM}>Monday 7:52 am · 0:22</text>
        <text x="1036" y="660" textAnchor="end" fontFamily={MONO} fontSize="15" fill={RED}>new</text>
      </Screen>
    </>
  ),

  // ── the voicemail ───────────────────────────────────────────────
  // The bars are the RMS envelope of public/audio/maya-voicemail.mp4 in 56
  // buckets, measured off the file — the shape on the screen is the shape of
  // what you are about to hear, including the gap where the knock is.
  voicemail: (_u, st = {}) => {
    const prog = Math.max(0, Math.min(1, st.progress ?? 0))
    const cur = st.duration ? st.duration * prog : 0
    return (
      <>
        <Screen>
          <text x="800" y="150" textAnchor="middle" fontFamily={MONO} fontSize="18" fill={DIM} letterSpacing="5">VOICEMAIL</text>
          <text x="800" y="200" textAnchor="middle" fontFamily={UI} fontSize="38" fill={INK}>Maya</text>
          <text x="800" y="234" textAnchor="middle" fontFamily={MONO} fontSize="17" fill={RED}>
            Mon 7:52 am · {st.played ? 'played' : 'unheard'}
          </text>
          {VM_WAVE.map((v, i) => {
            const h = 10 + v * 120
            const past = (i + 0.5) / VM_WAVE.length <= prog
            return <rect key={i} x={VM_X0 + i * VM_PITCH} y={430 - h / 2} width={VM_BAR} height={h} rx="2.3"
              fill={past ? '#8fb6ea' : '#3a4356'} />
          })}
          {/* the playhead rides the waveform's own extent */}
          <path d={`M${VM_X0 + VM_SPAN * prog} 336 v190`} stroke={RED} strokeWidth="3" strokeDasharray="9 7" />
          <path d={`M${VM_X0} 636 H${VM_X1}`} stroke="#252c3c" strokeWidth="4" />
          <path d={`M${VM_X0} 636 H${VM_X0 + VM_SPAN * prog}`} stroke="#8fb6ea" strokeWidth="4" />
          <circle cx={VM_X0 + VM_SPAN * prog} cy="636" r="7" fill="#8fb6ea" />
          <text x={VM_X0} y="672" fontFamily={MONO} fontSize="17" fill={DIM}>{fmt(cur)}</text>
          <text x={VM_X1} y="672" textAnchor="end" fontFamily={MONO} fontSize="17" fill={DIM}>{fmt(st.duration ?? 0)}</text>
        </Screen>
      </>
    )
  },

  // ── Wednesday: the report, and the shrug ────────────────────────
  police: () => (
    <>
      <Screen>
        <text x="800" y="112" textAnchor="middle" fontFamily={UI} fontSize="34" fill={INK}>Missing Persons Unit</text>
        <text x="800" y="144" textAnchor="middle" fontFamily={MONO} fontSize="16" fill={DIM}>automated message</text>
        <path d="M545 168 H1055" stroke="#1d2431" strokeWidth="2" />
        <text x="800" y="200" textAnchor="middle" fontFamily={MONO} fontSize="14" fill={DIM}>Wednesday 9:10 am</text>
        <rect x="544" y="224" width="470" height="300" rx="28" fill="#232a38" />
        {[
          'Your missing person report',
          'has been received.',
          '',
          'Report no. 25-081133',
          'Subject: Maya Reyes, 24',
          '',
          'An officer may contact you.',
          'Adults have the right to go',
          'missing. Most return within',
          '72 hours.',
        ].map((line, i) => (
          <text key={i} x="572" y={266 + i * 26} fontFamily={UI} fontSize="23"
            fill={i === 3 || i === 4 ? '#ffffff' : '#dfe5ef'} fontWeight={i === 3 ? 700 : 400}>{line}</text>
        ))}
        <text x="544" y="556" fontFamily={MONO} fontSize="15" fill={DIM}>Replies to this number are not monitored.</text>
      </Screen>
    </>
  ),

  // ── who is calling ──────────────────────────────────────────────
  ray: (u) => (
    <>
      <Screen>
        <text x="800" y="140" textAnchor="middle" fontFamily={MONO} fontSize="18" fill={DIM} letterSpacing="5">INCOMING CALL</text>
        <circle cx="800" cy="290" r="118" fill="#1a202c" />
        <Photo u={u} id="ray" href={art('pro-ray.jpg')} x={682} y={172} w={236} h={236} r={118} />
        <circle cx="800" cy="290" r="118" fill="none" stroke="#3a4458" strokeWidth="3" />
        <text x="800" y="470" textAnchor="middle" fontFamily={UI} fontSize="50" fill={INK}>Ray</text>
        <text x="800" y="506" textAnchor="middle" fontFamily={MONO} fontSize="18" fill={DIM}>mobile · favourites</text>
        <circle cx="700" cy="706" r="46" fill="#a3322a" />
        <path d="M680 700 q20 -15 40 0 l-6 17 q-14 -7 -28 0 Z" fill="#0a0b10" transform="rotate(134 700 706)" />
        <circle cx="900" cy="706" r="46" fill="#34874e" />
        <path d="M880 700 q20 -15 40 0 l-6 17 q-14 -7 -28 0 Z" fill="#0a0b10" />
      </Screen>
    </>
  ),

  // ── his own photographs of her apartment ─────────────────────────────
  apartment: (u) => {
    const shots = [
      { n: 'IMG_4471', f: 'pro-keys.jpg', t: '18:31' },
      { n: 'IMG_4472', f: 'pro-wallet.jpg', t: '18:33' },
      { n: 'IMG_4476', f: 'pro-notebook.jpg', t: '18:35' },
      { n: 'IMG_4479', f: 'pro-bed.jpg', t: '18:38' },
    ]
    return (
      <>
        <Screen>
          <text x="800" y="116" textAnchor="middle" fontFamily={UI} fontSize="34" fill={INK}>Recents</text>
          <text x="800" y="148" textAnchor="middle" fontFamily={MONO} fontSize="16" fill={DIM}>4 photos · today</text>
          {shots.map((s, i) => {
            const gx = 548 + (i % 2) * 256
            const gy = 178 + Math.floor(i / 2) * 290
            return (
              <g key={s.n}>
                <rect x={gx} y={gy} width="248" height="248" fill="#11151c" />
                <Photo u={u} id={s.n} href={art(s.f)} x={gx} y={gy} w={248} h={248} />
                <rect x={gx} y={gy + 212} width="248" height="36" fill="rgba(4,6,10,0.78)" />
                <text x={gx + 10} y={gy + 236} fontFamily={MONO} fontSize="14" fill="#c3cddd">{s.n}</text>
                <text x={gx + 238} y={gy + 236} textAnchor="end" fontFamily={MONO} fontSize="14" fill={DIM}>{s.t}</text>
              </g>
            )
          })}
        </Screen>
      </>
    )
  },

  // ── her browser: the first time Thomas reads Lena's name ────────
  // This is where the player meets Lena, so the page has to be readable:
  // who she is, when and where she was last seen, what the police said.
  // It deliberately does not name the building (thread C finds that).
  laptop: (u, _st, portrait) => (
    <>
      {/* Packed into the top two-thirds of the frame: the caption lines sit
          over the bottom third, and they were covering the poster's "last
          seen" lines — the two facts this beat exists to show. */}
      <rect x="150" y="54" width="1300" height="590" rx="14" fill="#0b0f16" stroke="#2a3342" strokeWidth="3" />
      <rect x="168" y="70" width="1264" height="40" fill="#161c27" />
      {Array.from({ length: 17 }).map((_, i) => (
        <g key={i}>
          <rect x={174 + i * 73} y={75} width="68" height="30" rx="6" fill={i === 4 ? '#243044' : '#121820'} />
          <rect x={182 + i * 73} y={87} width="44" height="6" rx="3" fill={i === 4 ? '#8fb0dd' : '#3d4760'} />
        </g>
      ))}
      <rect x="196" y="122" width="1208" height="42" rx="8" fill="#131a26" />
      <text x="220" y="150" fontFamily={MONO} fontSize="20" fill="#9fbbe6">pdxmissing.org/threads/lena-vasquez</text>
      <text x="1400" y="150" textAnchor="end" fontFamily={MONO} fontSize="16" fill={DIM}>17 tabs</text>
      {/* the poster */}
      <rect x="220" y="184" width="344" height="440" fill="#e9e4d8" />
      <text x="392" y="228" textAnchor="middle" fontFamily={UI} fontWeight="700" fontSize="40" letterSpacing="5" fill="#9a1712">MISSING</text>
      <Photo u={u} id="lena" href={art('pro-lena.jpg')} x={252} y={244} w={280} h={262} />
      <text x="392" y="546" textAnchor="middle" fontFamily={UI} fontWeight="700" fontSize="30" fill="#1f1a14">LENA VASQUEZ, 29</text>
      <text x="392" y="578" textAnchor="middle" fontFamily={MONO} fontSize="17" fill="#3d372d">LAST SEEN SAT 13 APRIL 2024</text>
      <text x="392" y="604" textAnchor="middle" fontFamily={MONO} fontSize="17" fill="#3d372d">MILLHAVEN ARTS NIGHT</text>
      {/* the thread, which says it plainly — on a phone the crop is the
          poster alone, and this column was being sliced mid-word at its edge */}
      {!portrait && <>
      <text x="604" y="226" fontFamily={UI} fontSize="42" fill={INK}>Have you seen Lena?</text>
      <text x="604" y="258" fontFamily={MONO} fontSize="17" fill={DIM}>posted by her friends · 214 replies</text>
      {[
        'Lena is a painter. She lives in Portland, near the',
        'waterfront, and teaches a class at Millhaven',
        'University on Tuesdays and Thursdays.',
        '',
        'She was last seen on Saturday 13 April at the',
        'Millhaven Arts Night, forty miles south of the city.',
        'Her phone was switched off the next day.',
        '',
        'Police say there is "no evidence of foul play."',
        "We don't believe that. Please share.",
      ].map((line, i) => (
        <text key={i} x="604" y={304 + i * 32} fontFamily={UI} fontSize="26" fill="#d9dfea">{line}</text>
      ))}
      </>}
    </>
  ),
}

const PORTRAIT_BOX = {
  messages: '520 70 560 720',
  calling: '520 150 560 620',
  voicemail: '520 110 560 600',
  police: '520 70 560 520',
  ray: '520 110 560 660',
  apartment: '538 92 524 600',
  laptop: '206 176 372 456',
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
  // On a phone the laptop page is cropped to the poster and the first lines
  // of the thread rather than shrunk whole — shrunk, its text was ~7px.
  // On a phone the words take the bottom half and the art fits above them,
  // so each scene is cropped to the part that carries it rather than the
  // whole handset — his four photographs were ~35px each at the full crop.
  const box = portrait ? (PORTRAIT_BOX[scene] ?? '470 0 660 900') : '0 0 1600 900'
  const bg = BACKDROP[scene]

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
      {bg && <image href={art(bg)} x="-160" y="-90" width="1920" height="1080" preserveAspectRatio="xMidYMid slice" />}
      {draw(u, playback, portrait)}
      <rect x="-600" y="-400" width="2800" height="1700" filter={`url(#${u('grain')})`} opacity="0.28" />
    </svg>
  )
}
