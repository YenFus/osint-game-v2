// ─────────────────────────────────────────────────────────────────
// WHO'S WHO — the cast, as Thomas would list it.
//
// Everyone in this case arrives inside a document, which means a
// player can meet a name three leads before anyone explains it. This
// is the reference that stops the guessing: each person appears here
// the moment the game first says their name out loud, and not before.
//
// `from` is the lead id that introduces them, or 'prologue'.
// A person with no `from` is known to Thomas before the game starts.
// ─────────────────────────────────────────────────────────────────

export const CAST = [
  {
    id: 'maya',
    name: 'Maya Reyes',
    relation: 'My daughter',
    line: 'Twenty-four. Missing since Monday morning. She was investigating a stranger and never told me.',
    from: 'prologue',
  },
  {
    id: 'ray',
    // Thomas calls his oldest friend by his first name, the way anyone would.
    // The surname arrives from a record, late, and this entry changes with it.
    name: 'Ray',
    namedAs: 'Raymond T. Callahan',
    namedLine: "Thirty years. Maya's godfather. He taught her to drive. And I've just read his full name on a record behind that account.",
    relation: 'My oldest friend',
    line: "Thirty years. Maya's godfather. He taught her to drive, and he's never once forgotten her birthday.",
    from: 'prologue',
  },
  {
    id: 'lena',
    name: 'Lena Vasquez',
    relation: 'The woman Maya was looking for',
    line: 'Lived in Portland, two streets from the river. Went missing after an arts night in Millhaven, forty miles south. Never found.',
    from: 'prologue',
  },
  {
    id: 'stillwater',
    name: 'stillwater_m',
    relation: 'The account Maya was chasing',
    line: 'Posts about Lena on a missing-persons forum. Knows things that were never made public.',
    from: 'A1',
  },
  {
    id: 'corey',
    name: 'Corey Marsh',
    relation: "Lena's ex-boyfriend",
    line: 'The forum decided he did it. Maya checked, and he was at work both nights.',
    from: 'A1',
  },
  {
    id: 'priya',
    name: 'Priya Raman',
    relation: "Lena's roommate",
    line: 'Gave a statement to the police that was never released. Somebody quoted it anyway.',
    from: 'A1',
  },
  {
    id: 'pryce',
    name: 'Owen Pryce',
    relation: 'Director of the Millhaven Arts Collective',
    line: 'Ran the arts night Lena vanished from, and would not give the paper his guest list. The account has been pointing people at him for a year.',
    from: 'A2',
  },
  {
    id: 'rosa',
    name: 'Rosa Velasquez',
    relation: 'A journalist Maya trusted',
    line: 'Pacific Reporter, digital safety beat. Maya wrote to her before she wrote to me.',
    from: 'A9',
  },
  {
    id: 'okafor',
    name: 'Det. Okafor',
    relation: 'Millhaven PD',
    line: "The detective Maya's unsent letter told me to go to. Not the police who shrugged at Lena.",
    from: 'B12',
  },
]

// Someone is known once the lead that names them has been finished
// (or immediately, if the prologue introduced them).
// Clues that put a surname to the handle. Until the player holds one of
// them, the cast list knows Thomas's friend only as Ray.
const NAMING_CLUES = ['whois', 'registry', 'html_author', 'court']

// A clue can put a name in the drawer before the lead that introduces the
// person has been played — the reporter's sticky note is one. If the player
// is holding the name, the page explains it.
const CLUE_INTRODUCES = { rosa: 'rosa', corey_flickr: 'corey', corey_alibi: 'corey', sealed: 'priya' }

export function knownCast(paths, clues = []) {
  const done = new Set(Object.values(paths ?? {}).flatMap(p => p?.completedNodes ?? []))
  const held = new Set((clues ?? []).map(id => CLUE_INTRODUCES[id]).filter(Boolean))
  const named = (clues ?? []).some(id => NAMING_CLUES.includes(id))
  return CAST.filter(c => c.from === 'prologue' || done.has(c.from) || held.has(c.id))
    .map(c => (named && c.namedAs ? { ...c, name: c.namedAs, line: c.namedLine ?? c.line } : c))
}
