// ─────────────────────────────────────────────────────────────────
// LEAD META — per-lead additions layered over gameData.js
//   clue:    clue id granted when the lead is finished (see caseData.js)
//   hint:    shown when the player buys a hint (+20 in-game minutes)
//   summary: one-line takeaway written into the journal
//   card:    how the lead is pinned on the Case Board
//   raySuspicion: unease added when finished (Ray watches for this)
// ─────────────────────────────────────────────────────────────────

export const LEAD_META = {
  // ── THREAD A — the laptop ──
  A1: {
    clue: 'corey_flickr', card: { kind: 'polaroid', scene: 'laptop' },
    hint: 'Open the INVESTIGATION folder. The files that matter are in suspect_research, plus the note Maya told herself never to delete.',
    summary: 'She was investigating an account called stillwater_m, and she never said a word to me. It knew private things about a missing woman named Lena Vasquez. Her first suspect was Lena\'s ex.',
  },
  A2: {
    clue: 'insider', card: { kind: 'index', scene: 'forum' },
    hint: 'Read for specifics, not for tone. A route, a timetable and a first name are the three things in here that were never published.',
    summary: 'Three phrases across four months: her Tuesday route, her class schedule, her flatmate\'s first name. None of it was ever public.',
  },
  A3: {
    clue: 'deleted', card: { kind: 'index', scene: 'phone' },
    hint: 'Both answers are in Maya\'s own files: NOTES_DO_NOT_DELETE.txt and username_scan_results_OLD.txt.',
    summary: 'His Twitter went dark and his Flickr went private, both in the week after she started looking. She got the photographs back anyway.',
  },
  A4: {
    clue: 'flickr_gps', card: { kind: 'polaroid', scene: 'building' },
    hint: 'Only the April photographs matter. Pick one; its coordinates show in the bar. Latitude lines run across the map, longitude lines run down it. Tap the unmarked spot where the two cross.',
    summary: 'His own photographs put him on her street the night before she vanished, and inside that building while she was in it.',
  },
  A6: {
    clue: 'domain_tweet', card: { kind: 'index', scene: 'phone' },
    hint: 'Read the September column against the November one. Three posts and one detail of the bio did not survive; one post is new.',
    summary: 'Between September and November he deleted the post that put him at the arts night, the post announcing his website, and his own town from his bio.',
  },
  A7: {
    clue: 'shield', card: { kind: 'index', scene: 'shielded' },
    hint: 'The name is redacted — that is the point. Flag the shield itself, the date it went up, and the two registrant fields it failed to cover.',
    summary: 'The registration is hidden behind a privacy shield, switched on five days after Maya started asking. It still shows a company and a postbox.',
  },
  A8: {
    clue: 'arts_domain', card: { kind: 'index', scene: 'domain' },
    hint: 'Q1 is the Registrant Organization in Maya\'s WHOIS notes. Q2 is the photo credit in the Millhaven Courier\'s arts night article (Thread C).',
    summary: 'Nothing behind the arts collective\'s own domain — shielded, dead. The credit printed in the paper is the part that holds.',
  },
  A9: {
    clue: 'nightwatch', card: { kind: 'index', scene: 'phone' },
    hint: 'Pick a detail on either side, then the one on the other side that matches it. A date, an image and a following list all line up exactly; the bio and the hours are supporting, not proof.',
    summary: 'A silent second account, opened the day he hid his name, wearing a crop of his own photograph and watching Corey Marsh.',
  },
  A11: {
    card: { kind: 'index', scene: 'yarn' },
    hint: 'Work outward from the domain: the handle is in its name, the registration names the business, and the business is what the second account watches.',
    summary: 'A handle, a domain, a company and a postbox — one man, and not one of them a name. He shielded the record in November.',
  },
  A12: {
    clue: 'whois', card: { kind: 'index', scene: 'domain' },
    hint: 'Read the two captures field against field. Four of the eight say the same thing in September and November. Three do not — the privacy service, the registrant name, and the date the record was last touched.',
    summary: 'The registration as it stood in September, before he hid it: R. Callahan, PO Box 441, Millhaven. Updated on 9 November.',
  },
  A13: {
    clue: 'corey_alibi', card: { kind: 'polaroid', scene: 'car' },
    hint: 'Ignore the upload time. Take the EXIF time and subtract seven hours: 02:54 UTC on the 13th is 7:54pm on the 12th, which goes in the 6pm block. Do the same for the other two.',
    summary: 'Corey Marsh\'s own photographs put him in a body shop in Tigard both nights. The forum spent a year on the wrong man.',
  },

  // ── THREAD B — the burned notebook ──
  B1: {
    card: { kind: 'polaroid', scene: 'notebook' },
    hint: 'Char and ink are both black — brightness alone won\'t do it. Lift brightness past the midpoint, then push contrast until the writing separates from the burn. Watch the recovery bar.',
    summary: 'November. She found Lena\'s case, and she noticed straight away that one account knew more than it should.',
  },
  B2: {
    clue: 'insider', card: { kind: 'index', scene: 'forum' },
    hint: 'For each of his four posts, ask where that detail could have come from and join it to that source. Two have a public source. Two have none — those both go to the same card.',
    summary: 'He spent months pointing that forum at Corey Marsh, and twice he said things that had no public source at all.',
  },
  B4: {
    clue: 'sealed', card: { kind: 'index', scene: 'forum' },
    hint: 'Take a line from his posts, then the line in the statement that says the same thing. The flatmate\'s name is the first pair; the phrase in quotation marks is the second.',
    summary: 'He quoted a police interview nobody released, and he described the exits of a room he shouldn\'t have known.',
  },
  B5: {
    card: { kind: 'index', scene: 'notebook' },
    hint: 'Q1: which document held Priya\'s exact words? Q2: the two letters in @nightwatch_rc.',
    summary: 'Priya said those words to the police. He said them on a forum. Maya wrote the initials in the margin.',
  },
  B7: {
    clue: 'wayback_index', card: { kind: 'index', scene: 'code' },
    hint: 'Open index.html, then the page-source file in the source folder.',
    summary: 'Four captures of the site since November. Crawl dates tell me a robot visited. They don\'t tell me who wrote it.',
  },
  B8: {
    clue: 'html_author', card: { kind: 'index', scene: 'code' },
    hint: 'Look at the <meta name="author"> tag, and the wp-user line in page-source.txt.',
    summary: 'The site names its own author in the source: Ray Callahan. The login is rcallahan_admin.',
  },
  B11: {
    clue: 'key_wifi', card: { kind: 'note', scene: 'key' },
    hint: 'Almost nothing left to work with: push both high and move in small steps.',
    summary: 'Ray has a key to my house and my WiFi password. She deleted his name out of the email rather than risk him reading it.',
  },
  B12: {
    clue: 'draft', card: { kind: 'polaroid', scene: 'email' },
    hint: 'Check the folder investigators forget. Unsent messages live in Drafts.',
    summary: 'She wrote to me the night before and never sent it. She knew who he was. She wouldn\'t type the name. Don\'t call anyone, she said.',
  },

  // ── THREAD C — the corkboard ──
  C1: {
    clue: 'map_three', card: { kind: 'polaroid', scene: 'corkboard' },
    hint: 'Look at the colour of each mark under the glass, not at what the paper is. Red is hers. Pencil and yellow highlighter are things she read, not things she concluded.',
    summary: 'Her corkboard. She ringed the table by the door on the arts night photograph, pinned a map with three locations strung together, and hung Lena\'s last post beside a photo of the same brick.',
  },
  C2: {
    clue: 'table_sign', card: { kind: 'photo', scene: 'photo' },
    hint: 'Zoom in on his kit, not the room: the sign standing on the table, the cards stacked under it, and what is playing on the screen.',
    summary: 'Zoomed in close: a sign reading STILLWATER MEDIA, his cards stacked beside it, and a showreel of the same landscapes stillwater_m posts.',
  },
  C3: {
    clue: 'building_owner', card: { kind: 'index', scene: 'building' },
    hint: 'Q1: it\'s on Maya\'s corkboard map. Q2: big public events need official paperwork — or get covered by the local paper.',
    summary: 'The venue is Alder Hall on Main Street, Millhaven — a hall some family trust has kept up since the war. The listing does not say whose.',
  },
  C4: {
    clue: 'courier', card: { kind: 'index', scene: 'newspaper' },
    hint: 'Three cuttings, three things already on your board. Join the photographer credit to the registration, Lena\'s attendance to her last post, and the case number to the court portal.',
    summary: 'The Courier credits him as the photographer that night, confirms Lena was there, and carries a harassment case number from four years back.',
  },
  C9: {
    clue: 'same_room', card: { kind: 'photo', scene: 'clock' },
    hint: 'Tap a line on one side, then the line on the other that says the same thing. The clock on the wall matches a time in the programme; the sign on the table matches a credit.',
    summary: 'Against the programme, the photograph tells the time: 7:47, two minutes into Lena\'s talk, with his company\'s sign on the table.',
  },
  C5: {
    clue: 'registry', card: { kind: 'index', scene: 'document' },
    hint: 'Open both filings. Flag the registered agent, the principal address, and the trustee on the second one.',
    summary: 'Stillwater Media LLC and the Alder Hall Trust, both filed by Raymond T. Callahan to the same postbox. The company behind the account, and the hall she vanished from.',
  },
  C6: {
    clue: 'court', card: { kind: 'index', scene: 'court' }, raySuspicion: 10,
    hint: 'The paper and the filing are the same case. Read them line against line: four lines differ, and every one of them is something the Courier chose not to print.',
    summary: 'Case MH-2021-0384. Raymond T. Callahan. Accounts under false names, her email read, her car followed. He did this before.',
  },
  C7: {
    clue: 'chain_sheet', card: { kind: 'index', scene: 'yarn' },
    hint: 'Follow shared details: domain↔business (PO Box), business↔username (Stillwater), username↔court (fake accounts), court↔photo (the name), photo↔domain (Millhaven).',
    summary: 'Five links, one address, one name. Three separate trails and they all stop in the same place.',
  },
  C8: {
    clue: 'rosa', card: { kind: 'note', scene: 'note' },
    hint: 'Open the front of the board — then check what\'s stuck on the back.',
    summary: 'Pinned to the back of the board where only someone really looking would find it: Rosa Velasquez, a journalist she trusted.',
  },
}

export function withMeta(node) {
  return node ? { ...node, ...(LEAD_META[node.id] ?? {}) } : node
}
