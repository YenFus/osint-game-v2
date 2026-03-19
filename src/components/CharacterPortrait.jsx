// Character portraits - CSS/SVG noir silhouettes
// Minimal detail, dramatic shadows

export function CharacterPortrait({ character, size = 'medium', mood = 'neutral' }) {
  const sizes = {
    small: { width: 40, height: 48 },
    medium: { width: 64, height: 76 },
    large: { width: 96, height: 114 },
  }

  const { width, height } = sizes[size] || sizes.medium

  const portraits = {
    thomas: <ThomasPortrait mood={mood} />,
    maya: <MayaPortrait mood={mood} />,
    ray: <RayPortrait mood={mood} />,
    lena: <LenaPortrait mood={mood} />,
  }

  return (
    <div
      className="relative overflow-hidden"
      style={{
        width,
        height,
        background: 'linear-gradient(180deg, #0a0a12 0%, #06060c 100%)',
        border: '1px solid #1a1a28',
      }}
    >
      <svg
        viewBox="0 0 64 76"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {portraits[character] || portraits.thomas}
      </svg>
      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 30%, transparent 30%, rgba(0,0,0,0.5) 100%)',
        }}
      />
    </div>
  )
}

// Thomas - older man, tired eyes, hint of fedora
function ThomasPortrait({ mood }) {
  const eyeY = mood === 'concerned' ? 30 : mood === 'determined' ? 28 : 29
  return (
    <g>
      {/* Background glow */}
      <ellipse cx="32" cy="50" rx="35" ry="30" fill="rgba(40,30,20,0.3)" />
      {/* Shoulders */}
      <path d="M 8 76 Q 20 58 32 55 Q 44 58 56 76" fill="#3a2818" />
      {/* Coat collar */}
      <path d="M 18 68 L 24 58 L 32 62 L 40 58 L 46 68" fill="#2a1c10" stroke="#1a1208" strokeWidth="0.5" />
      {/* Neck */}
      <rect x="28" y="50" width="8" height="10" fill="#6a4830" />
      {/* Head shape */}
      <ellipse cx="32" cy="35" rx="16" ry="20" fill="#7a5038" />
      {/* Hat brim shadow */}
      <path d="M 14 28 Q 32 24 50 28 L 48 32 Q 32 29 16 32 Z" fill="#1a1208" opacity="0.7" />
      {/* Hat crown hint */}
      <ellipse cx="32" cy="18" rx="14" ry="8" fill="#2a1c10" />
      {/* Eyes - shadowed */}
      <ellipse cx="26" cy={eyeY} rx="3" ry="2" fill="#0a0806" />
      <ellipse cx="38" cy={eyeY} rx="3" ry="2" fill="#0a0806" />
      {/* Eye highlights */}
      <circle cx="25" cy={eyeY - 0.5} r="0.8" fill="#8a7a68" />
      <circle cx="37" cy={eyeY - 0.5} r="0.8" fill="#8a7a68" />
      {/* Nose shadow */}
      <path d="M 32 32 L 30 40 L 32 42 L 34 40 Z" fill="#5a3a28" />
      {/* Mouth line */}
      <path d="M 27 46 Q 32 47 37 46" stroke="#4a2a1a" strokeWidth="1" fill="none" />
      {/* Jaw line */}
      <path d="M 18 42 Q 20 52 32 55 Q 44 52 46 42" fill="none" stroke="#5a3a28" strokeWidth="0.5" />
    </g>
  )
}

// Maya - young woman, determined posture
function MayaPortrait({ mood }) {
  return (
    <g>
      {/* Background glow - warmer */}
      <ellipse cx="32" cy="50" rx="35" ry="30" fill="rgba(50,35,25,0.3)" />
      {/* Shoulders - narrower */}
      <path d="M 12 76 Q 22 60 32 56 Q 42 60 52 76" fill="#3a2820" />
      {/* Sweater neckline */}
      <path d="M 24 66 Q 32 62 40 66" fill="#2a1a14" stroke="#1a1008" strokeWidth="0.5" />
      {/* Neck - slender */}
      <rect x="29" y="50" width="6" height="8" fill="#8a6048" />
      {/* Head - slightly smaller, rounder */}
      <ellipse cx="32" cy="35" rx="14" ry="17" fill="#9a7058" />
      {/* Hair - dark, frames face */}
      <path d="M 18 36 Q 16 20 32 15 Q 48 20 46 36 Q 44 28 32 26 Q 20 28 18 36" fill="#1a1008" />
      <path d="M 18 36 Q 14 50 20 58" fill="#1a1008" />
      <path d="M 46 36 Q 50 50 44 58" fill="#1a1008" />
      {/* Eyes - brighter, more alert */}
      <ellipse cx="27" cy="32" rx="3" ry="2.5" fill="#0c0a08" />
      <ellipse cx="37" cy="32" rx="3" ry="2.5" fill="#0c0a08" />
      {/* Eye highlights - larger, more life */}
      <circle cx="26" cy="31.5" r="1" fill="#b0a090" />
      <circle cx="36" cy="31.5" r="1" fill="#b0a090" />
      {/* Eyebrows */}
      <path d="M 24 28 Q 27 27 30 28" stroke="#3a2818" strokeWidth="0.8" fill="none" />
      <path d="M 34 28 Q 37 27 40 28" stroke="#3a2818" strokeWidth="0.8" fill="none" />
      {/* Nose */}
      <path d="M 32 34 L 31 40 L 33 40 Z" fill="#7a5040" />
      {/* Slight smile or neutral */}
      <path d={mood === 'determined' ? "M 28 45 Q 32 44 36 45" : "M 28 45 Q 32 46 36 45"} stroke="#6a4030" strokeWidth="0.8" fill="none" />
    </g>
  )
}

// Ray - mostly shadow, menacing, only jaw/shoulder visible
function RayPortrait() {
  return (
    <g>
      {/* Dark, ominous background */}
      <rect x="0" y="0" width="64" height="76" fill="#0a0808" />
      {/* Very subtle shoulder hint */}
      <path d="M 0 76 Q 16 66 32 64 Q 48 66 64 76" fill="#1a1410" />
      {/* Jaw line emerging from shadow */}
      <path d="M 38 52 Q 42 48 44 42" stroke="#4a3a2a" strokeWidth="2" fill="none" opacity="0.6" />
      {/* Collar hint */}
      <path d="M 34 58 L 38 52 Q 42 54 46 58" fill="#141010" stroke="#1a1210" strokeWidth="0.5" />
      {/* Just a hint of eye - gleaming in darkness */}
      <circle cx="36" cy="34" r="1.5" fill="#2a2018" />
      <circle cx="35.5" cy="33.5" r="0.4" fill="#6a5040" />
      {/* Red ambient glow - danger */}
      <ellipse cx="40" cy="40" rx="20" ry="25" fill="rgba(80,20,20,0.15)" />
    </g>
  )
}

// Lena - soft features, artistic vibe
function LenaPortrait() {
  return (
    <g>
      {/* Warmer background */}
      <ellipse cx="32" cy="50" rx="35" ry="30" fill="rgba(45,35,30,0.3)" />
      {/* Shoulders */}
      <path d="M 10 76 Q 22 62 32 58 Q 42 62 54 76" fill="#38302a" />
      {/* V-neck top */}
      <path d="M 26 68 L 32 60 L 38 68" fill="#282018" />
      {/* Neck */}
      <rect x="29" y="52" width="6" height="8" fill="#9a7860" />
      {/* Head */}
      <ellipse cx="32" cy="36" rx="13" ry="16" fill="#a88868" />
      {/* Hair - wavy, artistic */}
      <path d="M 19 38 Q 15 22 32 16 Q 49 22 45 38 Q 42 26 32 24 Q 22 26 19 38" fill="#2a1810" />
      <path d="M 19 38 Q 15 52 22 62" fill="#2a1810" />
      <path d="M 45 38 Q 49 52 42 62" fill="#2a1810" />
      {/* Wavy strand */}
      <path d="M 22 44 Q 18 48 20 54" stroke="#2a1810" strokeWidth="2" fill="none" />
      {/* Eyes - thoughtful */}
      <ellipse cx="27" cy="34" rx="2.5" ry="2" fill="#0c0a08" />
      <ellipse cx="37" cy="34" rx="2.5" ry="2" fill="#0c0a08" />
      <circle cx="26" cy="33.5" r="0.7" fill="#a09080" />
      <circle cx="36" cy="33.5" r="0.7" fill="#a09080" />
      {/* Soft features */}
      <path d="M 32 36 L 31 41 L 33 41 Z" fill="#8a6850" />
      <path d="M 28 46 Q 32 47 36 46" stroke="#7a5040" strokeWidth="0.7" fill="none" />
    </g>
  )
}

// Small inline portrait for text sections
export function InlinePortrait({ character }) {
  return (
    <span className="inline-block align-middle mr-2">
      <CharacterPortrait character={character} size="small" />
    </span>
  )
}
