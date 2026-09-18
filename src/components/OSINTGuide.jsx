const TECHNIQUES = [
  {
    code: 'RIS',
    name: 'Reverse Image Search',
    short: 'Find where an image appears online — or who it really belongs to.',
    example: 'A profile photo that looks real might be stolen from another site.',
  },
  {
    code: 'EXIF',
    name: 'Metadata (EXIF) Analysis',
    short: 'Every digital file contains hidden data — timestamps, device info, and sometimes GPS coordinates.',
    example: 'A photo posted online can reveal exactly where and when it was taken.',
  },
  {
    code: 'GEO',
    name: 'Geolocation',
    short: 'Identify a real-world location using only visual clues in a photo or video.',
    example: 'Street signs, architecture, shadows — every detail is a clue.',
  },
  {
    code: 'USER',
    name: 'Username Tracking',
    short: 'People reuse usernames. One handle can link accounts across dozens of platforms.',
    example: '"darkwater_77" on Reddit might be the same person on a forum from 2014.',
  },
  {
    code: 'ARCH',
    name: 'Wayback Machine / Archives',
    short: 'Nothing online is truly deleted. Archived versions of pages and profiles can be recovered.',
    example: 'A deleted Twitter post might still exist in a snapshot from 3 months ago.',
  },
  {
    code: 'REC',
    name: 'Public Records',
    short: 'Property ownership, court cases, business registrations — all publicly searchable.',
    example: 'A name and address can reveal property owned under a shell company.',
  },
]

export default function OSINTGuide({ onClose, onStart }) {
  return (
    <div className="absolute inset-0 bg-[#08080e] bg-opacity-97 z-50 flex items-start justify-center overflow-y-auto p-6 fade-in">
      <div className="max-w-2xl w-full border border-[#1e1e2a] bg-[#0c0c14] my-4">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#1a1a24]">
          <div>
            <div className="font-mono text-xs text-red-600 tracking-[0.25em] uppercase mb-2">
              Field Manual
            </div>
            <h2 className="font-black text-3xl uppercase text-[#f0e8d8] tracking-tight"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}>
              What Is OSINT?
            </h2>
          </div>
          <button onClick={onClose} className="font-mono text-sm text-[#a09888] hover:text-[#e8e0d0] cursor-pointer transition-colors px-4 py-2 border border-[#3a3a48] hover:border-[#5a5a68]">
            ✕ Close
          </button>
        </div>

        {/* Intro */}
        <div className="px-8 py-6 border-b border-[#1a1a24]">
          <p className="text-[#c0b8a8] leading-relaxed mb-4 text-base">
            <strong className="text-[#e8e0d0]">OSINT</strong> stands for Open Source Intelligence — the practice of gathering and connecting information from <strong className="text-[#e8e0d0]">publicly available sources</strong> to answer a specific question.
          </p>
          <p className="text-[#c0b8a8] leading-relaxed mb-4 text-base">
            No hacking. No illegal access. Everything is already out there. The skill is in knowing <em>where to look</em> and <em>how to connect the dots</em>.
          </p>
          <div className="border-l-3 border-amber-700 pl-5 mt-5 bg-amber-950/20 py-3">
            <p className="font-mono text-sm text-[#b09860] leading-relaxed">
              Real-world investigators at organizations like Bellingcat have used OSINT to expose war crimes, track disinformation campaigns, and locate missing persons — using nothing but publicly available information.
            </p>
          </div>
        </div>

        {/* Core concept */}
        <div className="px-8 py-6 border-b border-[#1a1a24] bg-[#0a0a10]">
          <div className="font-mono text-xs text-[#8a8078] tracking-[0.25em] uppercase mb-4">The Core Mechanic</div>
          <div className="flex items-center gap-3 font-mono text-sm text-[#a0a090] flex-wrap">
            {['Find a clue', '→', 'Apply a tool', '→', 'Discover something', '→', 'Pivot to the next lead', '→', 'Connect the chain'].map((t, i) => (
              <span key={i} className={t === '→' ? 'text-red-600 text-lg' : 'text-[#c0b8a0] font-medium'}>{t}</span>
            ))}
          </div>
          <p className="text-[#a09888] text-base mt-4 leading-relaxed">
            One piece of evidence leads to the next. Real OSINT investigators call this <strong className="text-[#d0c8b8]">"pivoting"</strong> — using what you find to discover what you haven't found yet.
          </p>
        </div>

        {/* Techniques grid */}
        <div className="px-8 py-6">
          <div className="font-mono text-xs text-[#8a8078] tracking-[0.25em] uppercase mb-6">
            Techniques You'll Use In This Game
          </div>
          <div className="grid grid-cols-1 gap-4">
            {TECHNIQUES.map((t) => (
              <div key={t.name} className="flex gap-4 p-5 border border-[#242434] hover:border-[#3a3a4a] transition-colors bg-[#0c0c14]">
                <div className="shrink-0 mt-1 font-mono text-[11px] tracking-[0.16em] px-2 py-1 border w-[58px] text-center"
                  style={{ color: '#9ab0d0', borderColor: '#2a3a5a', background: 'rgba(30,45,75,0.25)' }}>{t.code}</div>
                <div>
                  <div className="font-mono text-sm text-[#e8e0d0] tracking-wide uppercase mb-2 font-medium">{t.name}</div>
                  <p className="text-[#b0a898] text-base leading-snug mb-3">{t.short}</p>
                  <p className="font-mono text-sm text-[#909080] italic">
                    e.g. {t.example}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to play */}
        <div className="px-8 py-6 border-t border-[#1a1a24] bg-[#0a0a10]">
          <div className="font-mono text-xs text-[#8a8078] tracking-[0.25em] uppercase mb-5">
            How To Play
          </div>
          <div className="space-y-4 text-[#b0a898] text-base leading-relaxed">
            {[
              ['Work the leads.', 'Your case board holds leads from Maya\'s laptop, her burned notebook and her corkboard. Open one to dig through files, posts, photos and records. Clues aren\'t highlighted — you have to spot them.'],
              ['Pin the clues.', 'Finishing a lead drops a clue in your drawer. Pin each clue to the question on the board it answers. Right answers stick. Wrong ones fall off.'],
              ['Watch the clock.', 'Maya has been missing almost 59 hours. Wrong flags, wrong pins and hints all cost her time.'],
              ['Mind what you say.', 'Your oldest friend, Ray, will be texting. What you tell him matters.'],
              ['Build the case.', 'Close two threads and the board asks the only question left: who took her — and what will you hand the police? Nothing tells you if you\'re right until the call.'],
            ].map(([h, p], i) => (
              <div key={h} className="flex gap-4">
                <span className="font-mono text-red-500 shrink-0 mt-0.5 font-bold text-lg">0{i + 1}</span>
                <p><strong className="text-[#d8d0c0]">{h}</strong> {p}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="px-8 py-6 border-t border-[#1a1a24] flex justify-end">
          <button
            onClick={onStart ?? onClose}
            className="font-mono text-base tracking-widest uppercase border-2 border-red-700 text-red-500 px-8 py-3 hover:bg-red-950 hover:bg-opacity-40 hover:text-red-400 transition-all cursor-pointer font-medium"
          >
            I'm Ready →
          </button>
        </div>
      </div>
    </div>
  )
}
