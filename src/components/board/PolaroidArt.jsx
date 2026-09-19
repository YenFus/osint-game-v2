// ─────────────────────────────────────────────────────────────────
// POLAROID ART — small procedural noir illustrations (SVG)
// One scene per clue / lead type. Duotone, grainy, no external art.
// ─────────────────────────────────────────────────────────────────

import { useId } from 'react'

const INK = '#0c0a09'
const PAPER = '#d9cdb4'

function Grain({ id }) {
  return (
    <>
      <filter id={`g-${id}`}>
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.35 0" />
      </filter>
      <rect width="160" height="120" filter={`url(#g-${id})`} />
    </>
  )
}

function Sky({ id, top = '#3a3f52', bottom = '#0e0f16' }) {
  return (
    <>
      <linearGradient id={`s-${id}`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={top} />
        <stop offset="1" stopColor={bottom} />
      </linearGradient>
      <rect width="160" height="120" fill={`url(#s-${id})`} />
    </>
  )
}

const SCENES = {
  maya: (id) => (
    <>
      <Sky id={id} top="#2a2620" bottom="#100e0b" />
      {/* a phone photo, printed at home: heavy grain, the ink running out */}
      <rect x="18" y="10" width="124" height="86" fill="#3b3630" />
      <rect x="18" y="10" width="124" height="86" fill={`url(#grain-${id})`} opacity="0.7" />
      <path d="M18 74 h124 v22 h-124Z" fill="#2a2620" opacity="0.75" />
      <text x="24" y="90" fontFamily="monospace" fontSize="7" fill="#9a8f7e">IMG_3902.HEIC</text>
      <text x="136" y="90" textAnchor="end" fontFamily="monospace" fontSize="7" fill="#6f675b">Mar 2</text>
      <rect x="18" y="10" width="124" height="86" fill="none" stroke="#4b453c" strokeWidth="1.5" />
    </>
  ),
  lena: (id) => (
    <>
      <Sky id={id} top="#232a33" bottom="#0d1014" />
      <rect x="20" y="12" width="120" height="80" fill="#333b45" />
      <rect x="20" y="12" width="120" height="80" fill={`url(#grain-${id})`} opacity="0.7" />
      <rect x="20" y="12" width="120" height="80" fill="none" stroke="#48515d" strokeWidth="1.5" />
      <text x="24" y="106" fontFamily="monospace" fontSize="7" fill="#8b95a3">velvet.echo · last post</text>
    </>
  ),
  ray: (id) => (
    <>
      <Sky id={id} top="#2a2118" bottom="#110d09" />
      {/* a contact with no picture set — the same monogram as his call screen */}
      <circle cx="80" cy="52" r="30" fill="#241d16" stroke="#3a3026" strokeWidth="2" />
      <text x="80" y="62" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif"
        fontSize="30" fill="#8a7c68">RC</text>
      <text x="80" y="100" textAnchor="middle" fontFamily="monospace" fontSize="8" fill="#7d715f">no photo</text>
    </>
  ),
  laptop: (id) => (
    <>
      <Sky id={id} top="#1c2230" bottom="#07080c" />
      <radialGradient id={`gl-${id}`} cx="0.5" cy="0.45" r="0.5">
        <stop offset="0" stopColor="#5a88c0" stopOpacity="0.55" />
        <stop offset="1" stopColor="#5a88c0" stopOpacity="0" />
      </radialGradient>
      <rect width="160" height="120" fill={`url(#gl-${id})`} />
      <path d="M44 28 H116 V78 H44Z" fill="#9ab8dc" opacity="0.85" />
      <path d="M50 36 H96 M50 44 H108 M50 52 H88 M50 60 H100" stroke="#2a3a52" strokeWidth="2.5" />
      <path d="M32 82 H128 L136 92 H24Z" fill="#1a1c22" />
    </>
  ),
  notebook: (id) => (
    <>
      <Sky id={id} top="#2a1c12" bottom="#0a0604" />
      <path d="M38 22 L122 18 L126 100 L42 104Z" fill="#b8a07a" />
      <path d="M38 22 Q60 30 52 48 Q70 44 64 66 Q46 70 58 86 Q44 96 42 104 L38 22Z" fill="#1a0c04" opacity="0.9" />
      <path d="M118 18 Q102 28 110 40 Q98 40 104 56 L126 60Z" fill="#2a1406" opacity="0.85" />
      <path d="M70 40 H112 M68 50 H108 M72 60 H114 M70 70 H104 M74 80 H112" stroke="#3a2a1a" strokeWidth="1.4" opacity="0.8" />
      <circle cx="44" cy="30" r="10" fill="#e05a18" opacity="0.25" />
    </>
  ),
  corkboard: () => (
    <>
      <rect width="160" height="120" fill="#6a4524" />
      <rect x="22" y="18" width="34" height="26" fill={PAPER} transform="rotate(-6 39 31)" />
      <rect x="92" y="14" width="40" height="30" fill={PAPER} transform="rotate(5 112 29)" />
      <rect x="56" y="62" width="44" height="32" fill={PAPER} transform="rotate(-3 78 78)" />
      <path d="M40 22 L112 18 L78 66 Z" stroke="#b01818" strokeWidth="1.6" fill="none" />
      <circle cx="40" cy="22" r="3" fill="#c0392b" /><circle cx="112" cy="18" r="3" fill="#d4a84b" /><circle cx="78" cy="66" r="3" fill="#c0392b" />
    </>
  ),
  forum: (id) => (
    <>
      <Sky id={id} top="#16202a" bottom="#08090c" />
      {[20, 48, 76].map((y, i) => (
        <g key={y}>
          <rect x="18" y={y} width="124" height="22" rx="2" fill={i === 1 ? '#3a1a1a' : '#1e2630'} />
          <rect x="24" y={y + 5} width="12" height="12" rx="6" fill="#4a6a88" />
          <path d={`M42 ${y + 8} H${110 - i * 10} M42 ${y + 15} H${130 - i * 14}`} stroke={i === 1 ? '#c07060' : '#6a7a8a'} strokeWidth="2" />
        </g>
      ))}
    </>
  ),
  phone: (id) => (
    <>
      <Sky id={id} top="#1a1a26" bottom="#060608" />
      <rect x="56" y="10" width="48" height="100" rx="7" fill="#0a0a0e" stroke="#3a3a48" strokeWidth="2" />
      <rect x="61" y="20" width="38" height="78" fill="#1c2a3a" />
      <rect x="64" y="28" width="26" height="9" rx="4" fill="#4a6a90" />
      <rect x="70" y="42" width="26" height="9" rx="4" fill="#7a8a9a" />
      <rect x="64" y="56" width="22" height="9" rx="4" fill="#4a6a90" />
    </>
  ),
  building: (id) => (
    <>
      <Sky id={id} top="#6a4a3a" bottom="#1a1016" />
      <path d="M30 120 V44 L80 22 L130 44 V120Z" fill={INK} />
      {[0, 1, 2].map(r => [0, 1, 2, 3].map(c => (
        <rect key={`${r}${c}`} x={42 + c * 21} y={54 + r * 20} width="9" height="12" fill={(r + c) % 3 === 0 ? '#e8b060' : '#2a2018'} opacity="0.9" />
      )))}
      <rect x="72" y="100" width="16" height="20" fill="#3a2a1a" />
    </>
  ),
  map: () => (
    <>
      <rect width="160" height="120" fill="#d8cfb4" />
      {[20, 46, 72, 98].map(y => <path key={y} d={`M0 ${y} H160`} stroke="#bcb294" strokeWidth="5" />)}
      {[30, 70, 118].map(x => <path key={x} d={`M${x} 0 V120`} stroke="#bcb294" strokeWidth="5" />)}
      <path d="M36 30 L112 40 L70 92 Z" stroke="#b01818" strokeWidth="1.8" fill="rgba(176,24,24,0.08)" />
      {[[36, 30], [112, 40], [70, 92]].map(([x, y]) => <circle key={x} cx={x} cy={y} r="4.5" fill="#c0392b" stroke="#5a0808" />)}
      <text x="8" y="114" fontFamily="Caveat, cursive" fontSize="12" fill="#5a1a14">same person</text>
    </>
  ),
  forest: (id) => (
    <>
      <Sky id={id} top="#8a9098" bottom="#2a3230" />
      {[14, 40, 70, 100, 128, 150].map((x, i) => (
        <path key={x} d={`M${x} ${120} L${x - 10 - (i % 2) * 4} 120 L${x} ${30 + (i % 3) * 14} L${x + 10 + (i % 2) * 4} 120Z`} fill={i % 2 ? '#141a18' : '#1c2420'} />
      ))}
      <rect width="160" height="120" fill="#c8d0d8" opacity="0.18" />
    </>
  ),
  river: (id) => (
    <>
      <Sky id={id} top="#c07a4a" bottom="#3a2030" />
      <circle cx="116" cy="54" r="12" fill="#f0c080" opacity="0.8" />
      <path d="M0 70 H160 V120 H0Z" fill="#1a1824" />
      {[78, 88, 100].map((y, i) => <path key={y} d={`M${20 + i * 14} ${y} H${140 - i * 10}`} stroke="#e0a070" strokeWidth="1.5" opacity={0.6 - i * 0.15} />)}
      <path d="M0 70 L30 58 L52 64 L76 52 L100 62 L130 50 L160 60 V70Z" fill="#0e0c14" />
    </>
  ),
  car: (id) => (
    <>
      <Sky id={id} top="#2a2e36" bottom="#0c0d10" />
      <path d="M0 96 H160 V120 H0Z" fill="#1a1a1c" />
      <path d="M22 88 L38 66 H104 L126 82 L140 84 V96 H20Z" fill="#3a4a5a" />
      <path d="M44 70 H72 V82 H36Z M78 70 H100 L114 82 H78Z" fill="#9ab0c4" opacity="0.5" />
      <circle cx="46" cy="96" r="10" fill={INK} /><circle cx="116" cy="96" r="10" fill={INK} />
      <rect x="4" y="20" width="36" height="46" fill="#e8d8a0" opacity="0.12" />
    </>
  ),
  domain: (id) => (
    <>
      <Sky id={id} top="#0e1a14" bottom="#040806" />
      <text x="12" y="30" fontFamily="monospace" fontSize="9" fill="#5ac07a">$ whois stillwater-</text>
      <text x="12" y="44" fontFamily="monospace" fontSize="9" fill="#5ac07a">  media.net</text>
      <text x="12" y="64" fontFamily="monospace" fontSize="9" fill="#8aa090">Registrant:</text>
      <rect x="12" y="70" width="96" height="12" fill="#c0392b" opacity="0.35" />
      <text x="14" y="79" fontFamily="monospace" fontSize="9" fill="#f0e0d0">REDACTED</text>
      <text x="12" y="98" fontFamily="monospace" fontSize="9" fill="#8aa090">PO Box 441</text>
    </>
  ),
  code: (id) => (
    <>
      <Sky id={id} top="#141420" bottom="#06060a" />
      <text x="10" y="28" fontFamily="monospace" fontSize="8.5" fill="#7a8ab8">&lt;head&gt;</text>
      <text x="18" y="44" fontFamily="monospace" fontSize="8.5" fill="#c0a060">&lt;meta name=</text>
      <text x="18" y="58" fontFamily="monospace" fontSize="8.5" fill="#c0a060">"author"</text>
      <rect x="16" y="64" width="112" height="13" fill="#c0392b" opacity="0.3" />
      <text x="18" y="74" fontFamily="monospace" fontSize="8.5" fill="#f0e0d0">"…"&gt;</text>
      <text x="10" y="96" fontFamily="monospace" fontSize="8.5" fill="#7a8ab8">&lt;/head&gt;</text>
    </>
  ),
  key: (id) => (
    <>
      <Sky id={id} top="#3a3024" bottom="#0e0a08" />
      <circle cx="30" cy="30" r="5" fill="#2a2018" />
      <path d="M30 30 L30 52" stroke="#4a3a2a" strokeWidth="2" />
      <circle cx="30" cy="62" r="11" fill="none" stroke="#c8a860" strokeWidth="4" />
      <path d="M41 62 H96 M84 62 V72 M92 62 V70" stroke="#c8a860" strokeWidth="4" />
      <rect x="104" y="22" width="30" height="48" rx="3" fill="none" stroke="#4a3a2a" strokeWidth="2" strokeDasharray="4 3" />
      <text x="108" y="84" fontFamily="Caveat, cursive" fontSize="12" fill="#a08a6a">spare?</text>
    </>
  ),
  email: (id) => (
    <>
      <Sky id={id} top="#e0d8cc" bottom="#b8b0a4" />
      <rect x="14" y="14" width="132" height="92" fill="#f4efe6" />
      <text x="22" y="32" fontFamily="monospace" fontSize="8" fill="#7a7068">DRAFT · Mar 9 11:47pm</text>
      <text x="22" y="54" fontFamily="Georgia, serif" fontSize="12" fill="#1a1410">Dad —</text>
      {/* the name she typed and deleted — struck out, not readable */}
      <rect x="22" y="66" width="52" height="13" fill="#2a2622" opacity="0.85" />
      <path d="M20 72 H78" stroke="#8a1a14" strokeWidth="2.5" />
      <path d="M22 88 H120 M22 96 H96" stroke="#c0b8a8" strokeWidth="2" />
    </>
  ),
  newspaper: () => (
    <>
      <rect width="160" height="120" fill="#cfc5ae" />
      <text x="12" y="22" fontFamily="Georgia, serif" fontSize="12" fontWeight="bold" fill="#1a1612">MILLHAVEN COURIER</text>
      <path d="M12 28 H148" stroke="#1a1612" strokeWidth="1" />
      <rect x="12" y="34" width="60" height="44" fill="#4a4238" />
      <circle cx="46" cy="50" r="7" fill="#1a1612" /><path d="M34 78 Q46 58 58 78Z" fill="#1a1612" />
      {[36, 44, 52, 60, 68, 76].map(y => <path key={y} d={`M78 ${y} H148`} stroke="#6a6258" strokeWidth="2" />)}
      <rect x="12" y="84" width="136" height="9" fill="#c0392b" opacity="0.35" />
      <text x="14" y="91" fontFamily="Georgia, serif" fontSize="7" fill="#1a1612">Photography: Stillwater Media</text>
      {[100, 108].map(y => <path key={y} d={`M12 ${y} H148`} stroke="#6a6258" strokeWidth="2" />)}
    </>
  ),
  // a domain whose registration is hidden — the dead end, drawn as one
  shielded: (id) => (
    <>
      <Sky id={id} top="#1c2430" bottom="#0b0f15" />
      <rect x="14" y="18" width="132" height="84" fill="#0e141c" stroke="#26303d" strokeWidth="2" />
      <text x="22" y="36" fontFamily="monospace" fontSize="8" fill="#6f8098">$ whois</text>
      {[48, 60, 72].map((y, i) => (
        <rect key={y} x="22" y={y - 7} width={100 - i * 18} height="6" rx="3" fill="#2b3648" />
      ))}
      <rect x="22" y="80" width="116" height="14" fill="#3a2420" />
      <text x="26" y="90" fontFamily="monospace" fontSize="7.5" fill="#d08a7a">Privacy: ENABLED</text>
    </>
  ),
  // an archive index: crawl dates, no authorship
  archive: (id) => (
    <>
      <Sky id={id} top="#20242c" bottom="#0c0e13" />
      <rect x="14" y="18" width="132" height="84" fill="#101419" stroke="#2a313c" strokeWidth="2" />
      <text x="22" y="34" fontFamily="monospace" fontSize="7.5" fill="#7b8a9c">4 captures</text>
      {[0, 1, 2, 3].map(i => (
        <g key={i}>
          <circle cx={30 + i * 28} cy="60" r="5" fill="#3d4a5c" />
          <text x={30 + i * 28} y="78" textAnchor="middle" fontFamily="monospace" fontSize="6" fill="#5d6a7c">
            {['NOV', 'DEC', 'JAN', 'MAR'][i]}
          </text>
        </g>
      ))}
      <path d="M24 60 H132" stroke="#2a313c" strokeWidth="1.5" />
    </>
  ),
  document: () => (
    <>
      <rect width="160" height="120" fill="#e4dccb" />
      <text x="14" y="22" fontFamily="monospace" fontSize="8" fill="#3a3430">OREGON SECRETARY OF STATE</text>
      {[['Stillwater Media LLC', 'Registered agent on file'], ['Alder Hall Trust', 'Trustee on file']].map(([t, who], i) => (
        <g key={t}>
          <text x="14" y={44 + i * 34} fontFamily="monospace" fontSize="8.5" fill="#1a1612">{t}</text>
          <text x="14" y={56 + i * 34} fontFamily="monospace" fontSize="7.5" fill="#6a6258">{who}</text>
        </g>
      ))}
      <ellipse cx="100" cy="78" rx="52" ry="12" fill="none" stroke="#b01818" strokeWidth="1.5" transform="rotate(-4 100 78)" />
    </>
  ),
  court: () => (
    <>
      <rect width="160" height="120" fill="#ddd4c0" />
      <text x="50%" y="22" textAnchor="middle" fontFamily="Georgia, serif" fontSize="9" fill="#1a1612">IN THE CIRCUIT COURT</text>
      <text x="50%" y="36" textAnchor="middle" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#1a1612">MH-2021-0384</text>
      {[48, 56, 64, 72, 80, 88].map(y => <path key={y} d={`M18 ${y} H${y % 16 ? 142 : 120}`} stroke="#7a7064" strokeWidth="2" />)}
      <rect x="96" y="92" width="50" height="18" fill="none" stroke="#8a1a1a" strokeWidth="2" transform="rotate(-8 121 101)" />
      <text x="100" y="105" fontFamily="monospace" fontSize="8" fill="#8a1a1a" transform="rotate(-8 121 101)">GRANTED</text>
    </>
  ),
  // A crop of the arts night photograph: his kit on the table by the door,
  // the press card face-up beside it, ringed in Maya's pencil. Without this
  // the two placement clues fell back to `document` and were illustrated
  // with a business registry filing.
  photo: (id) => (
    <>
      <rect width="160" height="120" fill="#171310" />
      <rect width="160" height="120" fill={`url(#grain-${id})`} opacity="0.5" />
      {/* the lit wall behind, and the doorway he worked beside */}
      <rect x="0" y="0" width="160" height="62" fill="#2c2419" />
      <rect x="6" y="8" width="30" height="54" fill="#0d0b09" />
      {/* the trestle table */}
      <path d="M14 78 H150 v4 H14Z" fill="#3a2c1f" />
      <path d="M26 82 l6 30 M138 82 l-6 30" stroke="#2a2018" strokeWidth="3" />
      {/* his sign, standing on it */}
      <g transform="rotate(-2 74 70)">
        <rect x="42" y="58" width="64" height="20" fill="#cfc6b2" />
        <text x="74" y="68" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif"
          fontSize="7.5" fontWeight="700" fill="#2a251d">STILLWATER MEDIA</text>
        <text x="74" y="75" textAnchor="middle" fontFamily="'Barlow Condensed', sans-serif"
          fontSize="5" letterSpacing="0.8" fill="#4e463a">EVENT PHOTOGRAPHY</text>
      </g>
      {/* the stack of his cards beside it */}
      <g transform="rotate(-4 122 74)">
        <rect x="108" y="66" width="28" height="12" fill="#efe9dc" />
        <rect x="108" y="66" width="28" height="12" fill="none" stroke="#b6ab94" strokeWidth="0.8" />
        <path d="M110 71 H134 M110 74 H128" stroke="#9aa0a8" strokeWidth="1.2" />
      </g>
      {/* she ringed it */}
      <ellipse cx="90" cy="70" rx="54" ry="20" fill="none" stroke="#8a2f24" strokeWidth="2" strokeDasharray="6 4" />
      <text x="14" y="108" fontFamily="Caveat, cursive" fontSize="15" fill="#b9ad96">whose is this?</text>
    </>
  ),
  // The same photograph, read a second time: the digital frame on the wall.
  clock: (id) => (
    <>
      <rect width="160" height="120" fill="#141118" />
      <rect width="160" height="120" fill={`url(#grain-${id})`} opacity="0.5" />
      <rect x="0" y="0" width="160" height="74" fill="#2a2318" />
      {/* the frame, and the hour she was in the room */}
      <rect x="42" y="30" width="76" height="44" rx="2" fill="#0a0f0c" stroke="#54483a" strokeWidth="2.5" />
      <text x="80" y="60" textAnchor="middle" fontFamily="'Share Tech Mono', monospace"
        fontSize="19" fontWeight="700" letterSpacing="1" fill="#8dffc6">7:47</text>
      <text x="80" y="70" textAnchor="middle" fontFamily="'Share Tech Mono', monospace"
        fontSize="7" letterSpacing="2" fill="#4e7d66">PM</text>
      <path d="M0 74 H160" stroke="#171310" strokeWidth="3" />
      <text x="14" y="100" fontFamily="Caveat, cursive" fontSize="15" fill="#b9ad96">she was in the room</text>
    </>
  ),
  note: () => (
    <>
      <rect width="160" height="120" fill="#e8d070" />
      <text x="16" y="36" fontFamily="Caveat, cursive" fontSize="17" fill="#2a2010">Rosa Velasquez</text>
      <text x="16" y="58" fontFamily="Caveat, cursive" fontSize="14" fill="#3a2e18">Pacific Reporter</text>
      <text x="16" y="86" fontFamily="Caveat, cursive" fontSize="14" fill="#6a2a18">"she'll understand"</text>
    </>
  ),
  yarn: () => (
    <>
      <rect width="160" height="120" fill="#6a4524" />
      {[[28, 26], [120, 20], [40, 90], [126, 88], [80, 56]].map(([x, y], i) => (
        <g key={i}><rect x={x - 14} y={y - 10} width="28" height="20" fill={PAPER} /><circle cx={x} cy={y - 8} r="2.5" fill="#c0392b" /></g>
      ))}
      <path d="M28 18 L80 48 L120 12 M80 48 L40 82 M80 48 L126 80" stroke="#b01818" strokeWidth="1.6" fill="none" />
    </>
  ),
}

// Some of these cards stand for things the player has actually looked at —
// the hall, the body shop, the room with the clock in it. Those use the
// photograph rather than a drawing of one: a flat vector car pinned beside
// a photographic case board read as clip-art, which is what it was.
// zoom/cx/cy crop into the frame the way the magnifier does.
const PHOTO_SCENES = {
  // the photograph on the MISSING poster: her father took it, she is turning
  // away from the camera, and it is the only person in this game
  maya: { file: 'ph-maya.jpg' },
  // Lena's last post — the doorway she walked into
  lena: { file: 'ph-venue.jpg', zoom: 2.1, cx: 33, cy: 58 },
  building: { file: 'ph-venue.jpg' },
  car: { file: 'ph-shop.jpg' },
  photo: { file: 'gallery-room.jpg' },
  clock: { file: 'gallery-room.jpg', zoom: 3.4, cx: 41.5, cy: 41 },
  corkboard: { file: 'cork-surface.jpg' },
  // This was a 2.2x crop of the bottom-left corner of the apartment photo,
  // which is a black patch of floor: the thread-B card on the board — one of
  // the first three things a player sees — was a near-black rectangle. It is
  // its own plate now.
  notebook: { file: 'ph-notebook.jpg' },
}

function PhotoScene({ id, shot }) {
  const zoom = shot.zoom ?? 1
  const cx = shot.cx ?? 50
  const cy = shot.cy ?? 50
  // keep the crop inside the frame, as the loupe does
  const half = 50 / zoom
  const clamp = (v) => Math.min(100 - half, Math.max(half, v))
  const x = (50 - clamp(cx)) * 1.6 * zoom
  const y = (50 - clamp(cy)) * 1.2 * zoom
  return (
    <>
      <g transform={`translate(${x} ${y}) scale(${zoom})`}>
        <image href={`${import.meta.env.BASE_URL}art/${shot.file}`} x="0" y="0" width="160" height="120"
          preserveAspectRatio="xMidYMid slice" />
      </g>
      <rect width="160" height="120" fill="#120d08" opacity="0.14" />
      <Grain id={id} />
    </>
  )
}

export function PolaroidArt({ scene = 'document', className, style }) {
  const id = `${scene}-${useId().replace(/[^a-zA-Z0-9]/g, '')}`
  const shot = PHOTO_SCENES[scene]
  const draw = SCENES[scene] ?? SCENES.document
  return (
    <svg viewBox="0 0 160 120" preserveAspectRatio="xMidYMid slice" className={className} style={{ display: 'block', width: '100%', height: '100%', ...style }} aria-hidden="true">
      {shot ? <PhotoScene id={id} shot={shot} /> : <>{draw(id)}<Grain id={id} /></>}
    </svg>
  )
}
