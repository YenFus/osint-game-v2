// ─────────────────────────────────────────────────────────────────
// APARTMENT SCENE — Hybrid visual: Blender bg + 3D evidence board
//
// The right panel of the Apartment hub. Shows a Blender-rendered
// noir apartment interior as a background, with a react-three-fiber
// evidence board (corkboard + photos + red string) as the 3D accent.
//
// Navigation stays entirely in the left sidebar — this panel is
// purely atmospheric. No click targets here.
// ─────────────────────────────────────────────────────────────────

import { useRef, useMemo, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Line } from '@react-three/drei'

// ── Evidence Board (3D accent) ────────────────────────────────────
function EvidenceBoard() {
  const groupRef = useRef(null)

  // Slow idle sway — like a board on a wall with air movement
  useFrame(({ clock }) => {
    if (!groupRef.current) return
    const t = clock.elapsedTime
    groupRef.current.rotation.z = Math.sin(t * 0.28) * 0.018
    groupRef.current.rotation.x = Math.sin(t * 0.19) * 0.008
  })

  // Photo positions scattered across the board face
  const photos = useMemo(() => [
    { x: -0.82, y:  0.58, rot: -0.14 },
    { x:  0.15, y:  0.75, rot:  0.07 },
    { x:  0.88, y:  0.50, rot: -0.05 },
    { x: -0.60, y: -0.18, rot:  0.13 },
    { x:  0.52, y: -0.08, rot: -0.17 },
    { x: -0.10, y: -0.68, rot:  0.06 },
    { x:  0.82, y: -0.58, rot: -0.10 },
  ], [])

  // String routes: pairs of photo indices
  const strings = useMemo(() => [
    [0, 1], [1, 2], [2, 4], [0, 3], [3, 5], [1, 4], [4, 6], [3, 6],
  ], [])

  const photoTones = ['#e8dcc8', '#d4c8b4', '#c8bea8']
  const pinColors  = ['#c0392b', '#d4a84b', '#c0392b', '#d4a84b', '#c0392b', '#d4a84b', '#c0392b']

  return (
    <group ref={groupRef}>

      {/* ── Frame (dark wood border) ───────────────────────────── */}
      <mesh position={[0, 0, -0.01]}>
        <boxGeometry args={[3.1, 2.55, 0.06]} />
        <meshStandardMaterial color="#2a1c10" roughness={1.0} metalness={0} />
      </mesh>

      {/* ── Cork board surface ─────────────────────────────────── */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.9, 2.35, 0.07]} />
        <meshStandardMaterial color="#5c3d1e" roughness={0.97} metalness={0} />
      </mesh>

      {/* ── Subtle cork texture overlay (slightly lighter patches) */}
      {[-0.6, 0, 0.7].map((x, i) =>
        [-0.5, 0.5].map((y, j) => (
          <mesh key={`tex-${i}-${j}`} position={[x, y, 0.04]}>
            <planeGeometry args={[0.6, 0.4]} />
            <meshStandardMaterial
              color="#6b4a25"
              roughness={1}
              transparent
              opacity={0.4}
            />
          </mesh>
        ))
      )}

      {/* ── Photos ─────────────────────────────────────────────── */}
      {photos.map((p, i) => (
        <mesh key={`photo-${i}`} position={[p.x, p.y, 0.08]} rotation={[0, 0, p.rot]}>
          <planeGeometry args={[0.52, 0.37]} />
          <meshStandardMaterial
            color={photoTones[i % 3]}
            roughness={0.85}
          />
        </mesh>
      ))}

      {/* ── Pins ───────────────────────────────────────────────── */}
      {photos.map((p, i) => (
        <mesh key={`pin-${i}`} position={[p.x, p.y + 0.18, 0.13]}>
          <sphereGeometry args={[0.032, 10, 10]} />
          <meshStandardMaterial
            color={pinColors[i]}
            emissive={pinColors[i]}
            emissiveIntensity={0.25}
            roughness={0.25}
            metalness={0.6}
          />
        </mesh>
      ))}

      {/* ── Red string ─────────────────────────────────────────── */}
      {strings.map(([ai, bi], i) => {
        const a = photos[ai]
        const b = photos[bi]
        // Add a slight sag in the middle for realism
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2 - 0.04
        return (
          <Line
            key={`string-${i}`}
            points={[
              [a.x, a.y + 0.18, 0.12],
              [mx,  my,         0.12],
              [b.x, b.y + 0.18, 0.12],
            ]}
            color="#a02020"
            lineWidth={1.2}
          />
        )
      })}

    </group>
  )
}

// ── Fallback (shown while Canvas initialises) ─────────────────────
function SceneFallback() {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center"
      style={{ background: 'transparent' }}
    >
      <div style={{
        fontFamily: "'Share Tech Mono', monospace",
        fontSize: 10,
        color: '#2a2a38',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
      }}>
        Loading…
      </div>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────
export function ApartmentScene3D() {
  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        backgroundImage: "url('/images/apartment-bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
      }}
    >
      {/* Dark overlay so the bg is atmospheric, not distracting */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(4, 4, 10, 0.55)', zIndex: 1 }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 40%, rgba(4,4,10,0.8) 100%)',
          zIndex: 2,
        }}
      />

      {/* Three.js canvas — sits above the bg, below the vignette */}
      <div className="absolute inset-0" style={{ zIndex: 2 }}>
        <Suspense fallback={<SceneFallback />}>
          <Canvas
            camera={{ position: [0, 0, 4.2], fov: 48 }}
            style={{ background: 'transparent' }}
            gl={{ alpha: true, antialias: true }}
          >
            {/* Ambient fill — very dim */}
            <ambientLight intensity={0.12} />

            {/* Warm overhead lamp */}
            <pointLight
              position={[0.5, 2, 2]}
              intensity={1.8}
              color="#f0c878"
              distance={8}
              decay={2}
            />

            {/* Cool side fill — moonlight from window */}
            <pointLight
              position={[-3, 1, 2]}
              intensity={0.6}
              color="#8ab0e8"
              distance={6}
              decay={2}
            />

            <EvidenceBoard />
          </Canvas>
        </Suspense>
      </div>

      {/* "Three threads. One answer." — atmospheric caption */}
      <div
        className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <p
          style={{
            fontFamily: "'Crimson Pro', serif",
            fontStyle: 'italic',
            fontSize: 15,
            color: 'rgba(160, 148, 128, 0.5)',
            letterSpacing: '0.04em',
          }}
        >
          Three threads. One answer.
        </p>
      </div>
    </div>
  )
}
