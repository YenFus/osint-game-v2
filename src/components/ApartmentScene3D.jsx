// ─────────────────────────────────────────────────────────────────
// APARTMENT SCENE — transparent window into the shared background
//
// The outer ApartmentPage div holds the background image spanning
// the full screen. This panel is just a pass-through — lighter
// overlay so the room shows through more clearly on the right.
// ─────────────────────────────────────────────────────────────────

export function ApartmentScene3D() {
  return (
    <div className="relative w-full h-full overflow-hidden">

      {/* Lighten the right side slightly vs the sidebar — same image, less tint */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'rgba(4,4,10,0.18)', zIndex: 1 }}
      />

      {/* Vignette — softens edges, draws eye to centre */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at 50% 50%, transparent 35%, rgba(4,4,10,0.55) 100%)',
          zIndex: 2,
        }}
      />

      {/* Top fade into header */}
      <div
        className="absolute inset-x-0 top-0 h-20 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(4,4,10,0.5), transparent)', zIndex: 3 }}
      />

      {/* Atmospheric caption */}
      <div
        className="absolute bottom-8 left-0 right-0 flex justify-center pointer-events-none"
        style={{ zIndex: 10 }}
      >
        <p style={{
          fontFamily: "'Crimson Pro', serif",
          fontStyle: 'italic',
          fontSize: 15,
          color: 'rgba(160, 148, 128, 0.40)',
          letterSpacing: '0.04em',
        }}>
          Day 6. No contact.
        </p>
      </div>
    </div>
  )
}
