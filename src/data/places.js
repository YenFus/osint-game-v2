// ─────────────────────────────────────────────────────────────────
// PLACES — the map's fixed geography. Lives apart from the component
// so the module that draws the map exports only a component (a mixed
// module breaks fast refresh for every lead that renders the map).
// ─────────────────────────────────────────────────────────────────

// Stylised, not to scale: Portland up north, Millhaven 40 miles south
export const PLACES = {
  waterfront:  { x: 30, y: 26, label: 'Willamette waterfront' },
  lenaflat:    { x: 24, y: 20, label: "Lena's apartment", fixed: true },
  forestpark:  { x: 13, y: 13, label: 'Forest Park' },
  beaverton:   { x: 10, y: 33, label: 'Tualatin Hills' },
  tigard:      { x: 17, y: 42, label: 'Tigard — auto body shop' },
  venue:       { x: 72, y: 76, label: 'Alder Hall', fixed: true },
  mainst:      { x: 64, y: 70, label: 'Main St · PO Box 441' },
  taproom:     { x: 78, y: 68, label: 'The Tap Room' },
}
