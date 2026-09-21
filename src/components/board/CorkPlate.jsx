// ─────────────────────────────────────────────────────────────────
// CORK PLATE — Maya's corkboard drawn as one continuous surface, so
// the magnifier has something real to magnify. Every pinned item sits
// at a fixed percentage of the board and matches a hotspot in the
// lead data; zooming re-renders this same SVG under a CSS transform,
// which is why the small print has to actually be drawn, not faked.
// ─────────────────────────────────────────────────────────────────

import { useId } from 'react'

const BASE = import.meta.env.BASE_URL
import { GalleryPlate } from './ScenePlate'


// x/y/w/h are percentages of the board, and must stay in step with the
// `spot` values in gameData's C1 items.
const CORK_ITEMS = {
  'cp-01': { x: 3, y: 6, w: 17, h: 27, rot: -2.2 },
  'cp-02': { x: 23, y: 4, w: 18, h: 23, rot: 1.6 },
  'cp-03': { x: 44, y: 8, w: 30, h: 35, rot: -1.1 },
  'cp-04': { x: 77, y: 6, w: 20, h: 31, rot: 2.4 },
  'cp-05': { x: 5, y: 40, w: 20, h: 31, rot: 1.9 },
  'cp-06': { x: 29, y: 47, w: 23, h: 27, rot: -1.7 },
  'cp-07': { x: 56, y: 51, w: 21, h: 27, rot: 2.1 },
  'cp-08': { x: 87, y: 73, w: 11, h: 15, rot: -6 },
}

const W = 1350
const H = 900
const px = (i) => ({ x: (i.x / 100) * W, y: (i.y / 100) * H, w: (i.w / 100) * W, h: (i.h / 100) * H })

function Pin({ x, y, u }) {
  return (
    <g>
      <ellipse cx={x + 1.5} cy={y + 4} rx="6" ry="3" fill="rgba(0,0,0,0.45)" />
      <circle cx={x} cy={y} r="7" fill={`url(#${u('pin')})`} />
      <circle cx={x - 2} cy={y - 2.5} r="2.2" fill="#ffd9d2" opacity="0.8" />
    </g>
  )
}

// A pinned sheet of paper: shadow, slight rotation, a pin through the top.
function Sheet({ id, tint = '#f2ece0', children, u }) {
  const p = px(CORK_ITEMS[id])
  const cx = p.x + p.w / 2
  return (
    <g transform={`rotate(${CORK_ITEMS[id].rot} ${cx} ${p.y + p.h / 2})`}>
      <rect x={p.x + 4} y={p.y + 6} width={p.w} height={p.h} fill="rgba(0,0,0,0.4)" />
      <rect x={p.x} y={p.y} width={p.w} height={p.h} fill={tint} />
      <g>{children(p)}</g>
      <Pin x={cx} y={p.y + 9} u={u} />
    </g>
  )
}

const mono = "'Share Tech Mono', monospace"
const hand = "'Caveat', cursive"
const serif = 'Georgia, serif'

// Ruled lines standing in for body text at board scale — they read as
// paragraphs from across the room and as ruling under the magnifier.
//
// Placeholder ruling is fine for the margins of a page. It is not fine for
// the documents themselves: a magnifier that enlarges a grey smudge is
// theatre. MicroText sets real sentences at a size that is a smudge at 1:1
// and legible at 3.2x, which is the whole point of the loupe.
function MicroText({ x, y, lines, size = 7.4, gap = 10.5, color = '#2a251d', family }) {
  return lines.map((line, i) => (
    <text key={i} x={x} y={y + i * gap} fontFamily={family} fontSize={size} fill={color}>{line}</text>
  ))
}

export function CorkPlate() {
  const raw = useId()
  const id = raw.replace(/[^a-zA-Z0-9]/g, '')
  const u = (n) => `${n}-${id}`
  const map = px(CORK_ITEMS['cp-04'])

  return (
    <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid slice"
      className="plate-svg" aria-hidden="true">
      <defs>
        <linearGradient id={u('cork')} x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#9a6f3f" /><stop offset="1" stopColor="#6d4a26" />
        </linearGradient>
        <radialGradient id={u('pin')}>
          <stop offset="0" stopColor="#e8564a" /><stop offset="1" stopColor="#8e1f18" />
        </radialGradient>
        <filter id={u('grain')}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope="0.5" /></feComponentTransfer>
          <feBlend in2="SourceGraphic" mode="multiply" />
        </filter>
        <clipPath id={u('crowd')}>
          <rect {...(() => { const p = px(CORK_ITEMS['cp-03']); return { x: p.x + 8, y: p.y + 22, width: p.w - 16, height: p.h - 52 } })()} />
        </clipPath>
      </defs>

      {/* the board itself is a photograph of cork (scripts/gen_art.py) */}
      <image href={`${BASE}art/cork-surface.jpg`} x="0" y="0" width={W} height={H}
        preserveAspectRatio="xMidYMid slice" />
      <rect width={W} height={H} fill="#2a1a0a" opacity="0.18" />

      {/* cp-01 — Lena's Instagram profile, printed, handle ringed in pencil (not red) */}
      <Sheet id="cp-01" u={u}>{p => (<>
        <text x={p.x + 12} y={p.y + 30} fontFamily={mono} fontSize="12" fill="#6a6258">instagram.com</text>
        <rect x={p.x + 14} y={p.y + 44} width="34" height="34" fill="#3a3630" />
        <rect x={p.x + 14} y={p.y + 44} width="34" height="34" fill="none" stroke="#b9b0a0" strokeWidth="1.2" />
        <text x={p.x + 56} y={p.y + 60} fontFamily={serif} fontSize="15" fill="#1d1812">@velvet.echo</text>
        <ellipse cx={p.x + 100} cy={p.y + 55} rx="52" ry="16" fill="none" stroke="#5e5850" strokeWidth="1.6" opacity="0.8" />
        <text x={p.x + 56} y={p.y + 80} fontFamily={mono} fontSize="10" fill="#7a7268">412 posts · 1,208 followers</text>
        <MicroText x={p.x + 14} y={p.y + 106} family={mono} color="#4a453c" lines={[
          'velvet.echo · Millhaven Arts Collective',
          'Ceramics and print. Shows at Alder Hall.',
          'Last post: 13 April — "doors at seven"',
          'Account untouched since that evening.',
        ]} />
      </>)}</Sheet>

      {/* cp-02 — the forum thread */}
      <Sheet id="cp-02" tint="#eae6dc" u={u}>{p => (<>
        <rect x={p.x} y={p.y} width={p.w} height="22" fill="#3b4a5e" />
        <text x={p.x + 8} y={p.y + 16} fontFamily={mono} fontSize="11" fill="#d6e0ec">PDXmissing · thread</text>
        <text x={p.x + 10} y={p.y + 44} fontFamily={mono} fontSize="12" fill="#1d1812">u/stillwater_m</text>
        <MicroText x={p.x + 10} y={p.y + 56} family={mono} color="#3c3830" lines={[
          'u/stillwater_m · joined May',
          '"Police dropped the ball here."',
          '"The ex deserves more attention."',
          '"I know that building. Happy to',
          'help identify faces."',
          '4,329 karma · 211 comments',
          'All of it on one missing woman.',
        ]} />
      </>)}</Sheet>

      {/* cp-03 — the arts night photograph, the table ringed in red */}
      <Sheet id="cp-03" tint="#efe7d6" u={u}>{p => (<>
        <rect x={p.x + 8} y={p.y + 22} width={p.w - 16} height={p.h - 52} fill="#0d0d12" />
        <foreignObject x={p.x + 8} y={p.y + 22} width={p.w - 16} height={p.h - 52}>
          {/* nested copy: neutralise the plate positioning so it fills this
              pinned photo rather than the whole board */}
          <div className="cb-crowd"><GalleryPlate /></div>
        </foreignObject>
        {/* she ringed the table by the door, where his kit was */}
        {/* registered against the nested photograph's own box, so it keeps
            pointing at the sign table if cp-03 ever moves */}
        <ellipse cx={p.x + 8 + 0.28 * (p.w - 16)} cy={p.y + 22 + 0.74 * (p.h - 52)}
          rx="30" ry="24" fill="none" stroke="#b8241c" strokeWidth="3" strokeDasharray="7 5" />
        <text x={p.x + 12} y={p.y + p.h - 12} fontFamily={hand} fontSize="19" fill="#3a2a1e">whose is this?</text>
      </>)}</Sheet>

      {/* cp-04 — three pins and the string between them */}
      <Sheet id="cp-04" tint="#e8e0cc" u={u}>{p => (<>
        <rect x={p.x + 8} y={p.y + 24} width={p.w - 16} height={p.h - 40} fill="#ddd4bb" />
        {/* street grid, a river and the highway in — a town, read at a glance */}
        {[0, 1, 2, 3].map(i => (
          <path key={`h${i}`} d={`M${p.x + 10} ${p.y + 48 + i * 34} H${p.x + p.w - 10}`}
            stroke="#c2b79a" strokeWidth="2.4" fill="none" />
        ))}
        {[0, 1, 2, 3].map(i => (
          <path key={`v${i}`} d={`M${p.x + 26 + i * 46} ${p.y + 26} V${p.y + p.h - 18}`}
            stroke="#c2b79a" strokeWidth="2.4" fill="none" />
        ))}
        <path d={`M${p.x + 18} ${p.y + 30} q26 40 10 76 q-14 32 8 62`}
          fill="none" stroke="#9fb8bd" strokeWidth="6" opacity="0.85" />
        <path d={`M${p.x + 8} ${p.y + 96} q60 -22 ${p.w - 20} 26`}
          fill="none" stroke="#b09a6a" strokeWidth="4" strokeDasharray="8 5" />
        <text x={p.x + 10} y={p.y + 18} fontFamily={mono} fontSize="10" fill="#5a5248">MILLHAVEN</text>
      </>)}</Sheet>


      {/* cp-05 — Lena's last post, the same facade as the venue */}
      <Sheet id="cp-05" u={u}>{p => (<>
        <rect x={p.x + 8} y={p.y + 22} width={p.w - 16} height={p.h - 56} fill="#151b24" />
        {/* a brick facade at night: cornice, tall sash windows, lit doorway */}
        <rect x={p.x + 22} y={p.y + 44} width={p.w - 44} height={p.h - 100} fill="#4a3b33" />
        <rect x={p.x + 16} y={p.y + 38} width={p.w - 32} height="10" fill="#6a574a" />
        <rect x={p.x + 20} y={p.y + 50} width={p.w - 40} height="5" fill="#5c4a3f" />
        {[0, 1, 2].map(r => [0, 1, 2].map(c => (
          <g key={`${r}${c}`}>
            <rect x={p.x + 34 + c * 30} y={p.y + 62 + r * 26} width="18" height="20" rx="1.5"
              fill={(r + c) % 3 === 0 ? '#e0c78e' : '#26303c'} opacity={(r + c) % 3 === 0 ? 0.85 : 1} />
            <path d={`M${p.x + 43 + c * 30} ${p.y + 62 + r * 26} v20`} stroke="#1a1410" strokeWidth="1.2" />
          </g>
        )))}
        <rect x={p.x + p.w / 2 - 13} y={p.y + p.h - 76} width="26" height="30" rx="2" fill="#d9b877" opacity="0.8" />
        <path d={`M${p.x + 20} ${p.y + p.h - 46} H${p.x + p.w - 20}`} stroke="#2a2018" strokeWidth="4" />
        {/* her red ring round the doorway */}
        <ellipse cx={p.x + p.w / 2} cy={p.y + p.h - 61} rx="24" ry="24" fill="none" stroke="#b8241c" strokeWidth="3" />
        <text x={p.x + 12} y={p.y + p.h - 14} fontFamily={hand} fontSize="18" fill="#3a2a1e">same building</text>
      </>)}</Sheet>

      {/* cp-06 — the newspaper clipping, credit line not legible at this size */}
      <Sheet id="cp-06" tint="#d9cfb6" u={u}>{p => (<>
        <text x={p.x + 10} y={p.y + 26} fontFamily={serif} fontSize="15" fontWeight="bold" fill="#231c14">MILLHAVEN COURIER</text>
        <path d={`M${p.x + 10} ${p.y + 33} H${p.x + p.w - 10}`} stroke="#231c14" strokeWidth="1.2" />
        <rect x={p.x + 10} y={p.y + 42} width={p.w * 0.42} height={p.h * 0.34} fill="#4a4238" />
        <MicroText x={p.x + p.w * 0.48} y={p.y + 46} size={6.6} gap={9} family={serif} color="#2e2820" lines={[
          'The Collective\u2019s tenth Spring',
          'Exhibition drew over 400 people',
          'to Alder Hall on Saturday.',
          'Work from 34 local artists.',
          'Lena Vasquez, who has not been',
          'seen since the event, is noted',
          'as having attended.',
        ]} />
        <rect x={p.x + 10} y={p.y + p.h - 44} width={p.w - 20} height="11" fill="#e8d24a" opacity="0.5" />
        <text x={p.x + 13} y={p.y + p.h - 35} fontFamily={serif} fontSize="6.4" fill="#231c14">Photography: Stillwater Media</text>
      </>)}</Sheet>

      {/* cp-07 — the WHOIS printout */}
      <Sheet id="cp-07" tint="#f0ece2" u={u}>{p => (<>
        <text x={p.x + 10} y={p.y + 26} fontFamily={mono} fontSize="11" fill="#2a3a5a">$ whois stillwater-media.net</text>
        <text x={p.x + 10} y={p.y + 48} fontFamily={mono} fontSize="5.6" fill="#4a453c">Registrar: NameCheap</text>
        <text x={p.x + 10} y={p.y + 60} fontFamily={mono} fontSize="5.6" fill="#4a453c">Privacy: ENABLED 9 Nov</text>
        <text x={p.x + 10} y={p.y + 72} fontFamily={mono} fontSize="5.6" fill="#4a453c">Registrant: REDACTED</text>
        <rect x={p.x + 10} y={p.y + 88} width={p.w - 24} height="13" fill="#e8d24a" opacity="0.5" />
        <text x={p.x + 13} y={p.y + 98} fontFamily={mono} fontSize="9" fill="#2a2418">PO Box 441, Millhaven OR</text>
        <MicroText x={p.x + 10} y={p.y + 112} size={6.8} gap={9} family={mono} color="#4a453c" lines={[
          'Created: 11 May, four years ago',
          'Updated: 9 Nov — five days after',
          'her first message to the forum',
        ]} />
      </>)}</Sheet>

      {/* cp-08 — the corner of a sticky note poking out from BEHIND the
          board. C8 finds the whole note on the back; the front only ever
          showed this torn edge (it used to show the full note, which made
          C8's "on the back" a contradiction). */}
      <Sheet id="cp-08" tint="#e4d98a" u={u}>{p => (<>
        <path d={`M${p.x} ${p.y + p.h} L${p.x + p.w} ${p.y + p.h} L${p.x + p.w} ${p.y + p.h * 0.35} L${p.x + p.w * 0.55} ${p.y + p.h * 0.5} Z`} fill="#0f0c08" opacity="0.28" />
        <text x={p.x + 8} y={p.y + 30} fontFamily={hand} fontSize="15" fill="#2a2414">Rosa V—</text>
      </>)}</Sheet>

      {/* the red string: the three map pins, joined */}
      <g stroke="#b8241c" strokeWidth="2.6" fill="none" opacity="0.9">
        <path d={`M${map.x + 40} ${map.y + 70} L${map.x + 120} ${map.y + 120} L${map.x + 56} ${map.y + 180} Z`} />
      </g>
      {[[40, 70], [120, 120], [56, 180]].map(([dx, dy]) => (
        <Pin key={`${dx}`} x={map.x + dx} y={map.y + dy} u={u} />
      ))}
      {/* her labels on the three pins: C3 sends the player here for the hall's name */}
      <g fontFamily={hand} fill="#8d1c12" fontSize="15">
        <text x={map.x + 50} y={map.y + 66}>Alder Hall</text>
        <text x={map.x + 62} y={map.y + 146}>PO Box 441</text>
        <text x={map.x + 66} y={map.y + 196}>Courthouse</text>
      </g>
    </svg>
  )
}
