// ─────────────────────────────────────────────────────────────────
// SCENE PLATE — a photograph from the case, shown as a photograph.
//
// This used to be a generated room with the evidence drawn on top in
// vector text: a sign, a clock, a banner, each one a flat rectangle
// pasted wherever the coordinates said. It read exactly like what it
// was. The photographs now carry their own printed matter — the tent
// sign on the table was printed by the same camera that took the
// room — so all this component has to do is hold the picture still
// and put some grain over it.
//
// Every plate is 3:2, which is what the magnifier and the compare
// crops measure their percentages against.
// ─────────────────────────────────────────────────────────────────

import { useId } from 'react'
import { SCENES } from './scenes'

const BASE = import.meta.env.BASE_URL
export function ScenePlate({ name = 'gallery' }) {
  const raw = useId()
  const id = raw.replace(/[^a-zA-Z0-9]/g, '')
  const scene = SCENES[name] ?? SCENES.gallery
  return (
    <svg viewBox="0 0 1350 900" preserveAspectRatio="xMidYMid slice" className="plate-svg" aria-hidden="true">
      <defs>
        <filter id={`grain-${id}`}>
          <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer><feFuncA type="linear" slope="0.2" /></feComponentTransfer>
          <feBlend in2="SourceGraphic" mode="multiply" />
        </filter>
        <radialGradient id={`vig-${id}`} cx="0.48" cy="0.46" r="0.78">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.38" />
        </radialGradient>
      </defs>
      <image href={`${BASE}art/${scene.file}`} x="0" y="0" width="1350" height="900"
        preserveAspectRatio="xMidYMid slice" />
      <rect width="1350" height="900" fill={`url(#vig-${id})`} />
      <rect width="1350" height="900" filter={`url(#grain-${id})`} fill="#8a8272" opacity="0.1" />
    </svg>
  )
}

// The arts night photograph, by its old name — the corkboard and the
// magnifier both ask for it this way.
export function GalleryPlate() {
  return <ScenePlate name="gallery" />
}
