// Which photograph is which. Kept out of the component file so the plate
// module exports components only (fast refresh) — and so a lead can name a
// scene in data without importing React.

export const SCENES = {
  // the side gallery: his table, his sign, the clock on the wall
  gallery: { file: 'gallery-room.jpg', alt: 'A side gallery room at the arts night. A folding table by the door, a framed clock on the brick wall.' },
  // the main hall at the same hour: the banner, and four hundred people
  hall: { file: 'hall-banner.jpg', alt: 'The main hall at the arts night, seen from the doorway: a printed banner above a standing crowd.' },
}
