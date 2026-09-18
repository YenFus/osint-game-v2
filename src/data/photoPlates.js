// ─────────────────────────────────────────────────────────────────
// PHOTO PLATES — which generated image stands in for which cached
// photograph (scripts/gen_art.py). Shared by every lead that shows
// someone's photos, so two leads can never disagree about a picture.
// ─────────────────────────────────────────────────────────────────

const PHOTO_PLATE = {
  trail_morning_01: 'ph-trail',
  river_dusk_07: 'ph-river',
  fog_hills_02: 'ph-fog',
  arts_night_exterior: 'ph-venue',
  main_st_dusk: 'ph-mainst',
  // the second frame from that evening — the hall, from the doorway
  arts_night_hall: 'hall-banner',
  homebrewing_club: 'ph-taproom',
  chevelle_primer_01: 'ph-shop',
  // a different hour and angle — A13 asks the player to tell these apart
  late_shift_apr12: 'ph-shop-late',
  paint_booth_apr13: 'ph-booth',
}

export function plateFor(filename = '') {
  return PHOTO_PLATE[filename.replace(/\.[a-z]+$/i, '')] ?? null
}

export function plateSrc(filename) {
  const plate = plateFor(filename)
  return plate ? `${import.meta.env.BASE_URL}art/${plate}.jpg` : null
}
