// ─────────────────────────────────────────────────────────────────
// LEAD META — per-lead additions layered over gameData.js
//   clue:    clue id granted when the lead is finished (see caseData.js)
//   hint:    shown when the player buys a hint (+20 in-game minutes)
//   summary: one-line takeaway written into the journal
//   card:    how the lead is pinned on the Case Board
//   raySuspicion: unease added when finished (Ray watches for this)
//   brief:   what the lead relies on, and where each fact came from — shown
//            in the lead header so no fact arrives without a source
//
// Rewritten in plain English after a full playthrough (2026-09-21). Every
// hint was checked against the lead it belongs to: three were wrong — A6's
// counted a new post that doesn't exist, B5's answered a question the lead
// no longer asks, and A12's miscounted the fields — so a player paid twenty
// minutes to be misled. clue / card / raySuspicion are unchanged.
// ─────────────────────────────────────────────────────────────────

export const LEAD_META = {
  // ── THREAD A — the laptop ──
  A1: {
    brief: [{ fact: 'Lena Vasquez, 29, has been missing since the Millhaven Arts Night on 13 April last year.', from: 'the forum page open on Maya\'s laptop' }],
    clue: 'corey_flickr', card: { kind: 'polaroid', scene: 'laptop' },
    hint: 'Open the INVESTIGATION folder. Two files matter: the one about Corey in suspect_research, and the note Maya told herself never to delete.',
    summary: 'Maya was investigating a forum account called stillwater_m. It knew private things about a missing woman, Lena Vasquez. Her first suspect was Lena\'s ex, Corey Marsh. She never said a word to me.',
  },
  A2: {
    brief: [{ fact: 'stillwater_m is the forum account Maya was investigating. She wrote that it knew things that were never public.', from: 'NOTES_DO_NOT_DELETE.txt, on Maya\'s laptop' }, { fact: 'Already public: Lena\'s name, the arts night, the coffee-shop sightings, and Corey\'s name.', from: 'the news, and the forum itself' }],
    clue: 'insider', card: { kind: 'index', scene: 'forum' },
    hint: 'Ignore the tone. Look for things only someone close to Lena could know: a weekly routine, a timetable, a first name. There are three.',
    summary: 'In four months of posts he mentioned her Tuesday route, her class schedule and her flatmate\'s first name. None of that was ever public.',
  },
  A3: {
    brief: [{ fact: 'On 31 January Maya asked the forum who stillwater_m really was.', from: 'NOTES_DO_NOT_DELETE.txt' }, { fact: 'Back in December she wrote down what she\'d do if his Flickr went private.', from: 'username_scan_results_OLD.txt, on Maya\'s laptop' }],
    clue: 'deleted', card: { kind: 'index', scene: 'phone' },
    hint: 'Q1: the scan and Maya\'s notes both show which account disappeared completely. Q2: her December scan notes (on her laptop) say what she\'d use if his Flickr went private — the Wayback Machine.',
    summary: 'Two days after Maya asked the forum who he was, his Twitter was deleted and his Flickr went private. She\'d already saved his photos.',
  },
  A4: {
    brief: [{ fact: 'Lena lived near the Portland waterfront.', from: 'her friends\' forum page' }, { fact: 'She was last seen at the Millhaven Arts Night, forty miles south, on Saturday 13 April.', from: 'her friends\' forum page' }, { fact: 'His Flickr went private in February, but Maya saved a copy first.', from: 'Maya\'s notes' }],
    clue: 'flickr_gps', card: { kind: 'polaroid', scene: 'building' },
    hint: 'Only the April photos matter. Pick a photo and its coordinates show in the bar. Latitude lines run across the map, longitude lines run down. Put the photo where they cross.',
    summary: 'His own photos put him on the waterfront two streets from Lena\'s flat the night before she vanished — and inside the arts night hall the evening she did.',
  },
  A6: {
    brief: [{ fact: 'Maya posted her first question on the PDXmissing forum on 4 November.', from: 'NOTES_DO_NOT_DELETE.txt' }, { fact: 'The Wayback Machine saved his Twitter page on 2 September, and again on 14 November.', from: 'the archive' }],
    clue: 'domain_tweet', card: { kind: 'index', scene: 'phone' },
    hint: 'Read the September column against the November one, line by line. Two posts were deleted. Two lines were quietly edited: one in his bio, one in an old post.',
    summary: 'Between September and November he deleted the post saying he worked the arts night and the post announcing his website, and took his town out of his bio and an old post.',
  },
  A7: {
    brief: [{ fact: 'stillwater-media.net is the website he announced on Twitter — the same words as his username.', from: 'his Twitter, archived' }, { fact: 'Maya posted her first question on the forum on 4 November.', from: 'NOTES_DO_NOT_DELETE.txt' }],
    clue: 'shield', card: { kind: 'index', scene: 'shielded' },
    hint: 'The name is hidden — that\'s what a privacy shield does. Flag the shield itself, the date it went up, and the two details it didn\'t hide.',
    summary: 'His website\'s registration is hidden behind a privacy shield, switched on 9 November — five days after Maya\'s first question on the forum. It still shows a company, Stillwater Media, and a postbox in Millhaven.',
  },
  A8: {
    brief: [{ fact: 'His website is registered to a company at PO Box 441, Millhaven.', from: 'the WHOIS lookup (thread A)' }, { fact: 'The Millhaven Courier printed everyone who worked the arts night.', from: 'the Courier archive (thread C)' }],
    clue: 'arts_domain', card: { kind: 'index', scene: 'domain' },
    hint: 'Q1: find the one business that\'s on both lists. Q2: in the newspaper\'s list, what job did that business do on the night?',
    summary: 'The business on his website\'s registration is the same one the Courier credits as the arts night photographer: Stillwater Media.',
  },
  A9: {
    clue: 'nightwatch', card: { kind: 'index', scene: 'phone' },
    hint: 'Pick a detail on one side, then the matching one on the other. Three match exactly: a date, a picture and a follow list. The bio and the hours back it up.',
    summary: 'A silent second account, @nightwatch_rc, made the same day he hid his name. It uses a crop of his own photo and follows Corey Marsh.',
  },
  A11: {
    clue: 'postbox', card: { kind: 'index', scene: 'yarn' },
    hint: 'Start from the website. Its name matches the handle, its registration names a business, and that business is what the second account follows.',
    summary: 'The handle, the website, the company and the postbox all lead to one person — but none of them gives a name. He hid the record in November.',
  },
  A12: {
    brief: [{ fact: 'The registration was hidden on 9 November — five days after Maya\'s first forum post.', from: 'the WHOIS lookup' }],
    clue: 'whois', card: { kind: 'index', scene: 'domain' },
    hint: 'Read the two snapshots row by row. There are eight fields. Five are the same in September and November. Three changed: the privacy setting, the owner\'s name, and the date it was last updated.',
    summary: 'The registration as it was in September, before he hid it: R. Callahan, PO Box 441, Millhaven. He changed it on 9 November.',
  },
  A13: {
    brief: [{ fact: 'stillwater_m told the forum someone was watching Lena\'s street on Friday 12 April, and that Corey\'s photos "look like her street".', from: 'c_marsh_crossref.txt, on Maya\'s laptop' }, { fact: 'Lena\'s hours that weekend — shown on the timeline below.', from: 'lena_timeline.txt, on Maya\'s laptop' }],
    clue: 'corey_alibi', card: { kind: 'polaroid', scene: 'car' },
    hint: 'Ignore the upload time. Use the camera\'s time (EXIF) and take off seven hours. 02:54 UTC on the 13th is 7:54pm on the 12th — the 6pm to 8pm block. Do the same for the other two.',
    summary: 'Corey Marsh\'s own photos put him at the body shop in Tigard on both nights. The forum spent a year on the wrong man.',
  },

  // ── THREAD B — the burned notebook ──
  B1: {
    brief: [{ fact: 'Her notebook was half burned, pushed under a pile of papers in her flat.', from: 'your photos of her flat' }],
    clue: 'burned_page', card: { kind: 'polaroid', scene: 'notebook' },
    hint: 'Burned paper and ink are both dark, so brightness alone won\'t do it. Push brightness past halfway, then raise contrast until the writing stands out. Watch the recovery bar.',
    summary: 'Her notebook, November: she found Lena\'s case and noticed one account knew too much. She was on to him four months before she disappeared.',
  },
  B2: {
    brief: [{ fact: 'Maya thought stillwater_m knew things about Lena that were never public.', from: 'her notebook, November' }, { fact: 'The police press release on 18 April gave Lena\'s name, age and what she was wearing — not where she\'d been.', from: 'the police appeal' }],
    clue: 'no_source', card: { kind: 'index', scene: 'forum' },
    hint: 'For each of his posts, ask where he could have learned that, and link it to the source. Two posts have a public source. Two don\'t — both of those go to "Nowhere public".',
    summary: 'He spent months pushing the forum toward Corey Marsh — and twice he mentioned things that weren\'t public anywhere.',
  },
  B4: {
    brief: [{ fact: 'Priya, Lena\'s flatmate, gave Maya her own copy of what she told the police. It was never released.', from: 'Maya\'s notebook, December' }],
    clue: 'sealed', card: { kind: 'index', scene: 'forum' },
    hint: 'Pick one of his posts, then the line in Priya\'s statement that says the same thing. Start with her name, then the words in quotation marks.',
    summary: 'He knew Priya\'s name and quoted her exact words to the police months before anyone published either. He also knew the hall\'s exits.',
  },
  B5: {
    brief: [{ fact: 'Priya told the police Lena was "waiting for something to end".', from: 'Priya\'s statement' }, { fact: 'The word "stillwater" also turns up in the state\'s business records.', from: 'the business registry (thread C)' }],
    clue: 'priya_words', card: { kind: 'index', scene: 'notebook' },
    hint: 'Q1: where were Priya\'s exact words first written down? Q2: the same word is the name of a company registered with the state.',
    summary: 'Priya said those words to the police, and he repeated them on the forum. His username comes from his company\'s name.',
  },
  B7: {
    brief: [{ fact: 'His website is stillwater-media.net.', from: 'the WHOIS lookup (thread A)' }, { fact: 'The live site has been tidied up. The Wayback Machine keeps older copies.', from: 'Maya\'s notes' }],
    clue: 'wayback_index', card: { kind: 'index', scene: 'code' },
    hint: 'Open index.html, then page-source.txt in the source folder.',
    summary: 'An archived copy of his website from 20 November, before he tidied it. The page shows no names. The code underneath does.',
  },
  B8: {
    brief: [{ fact: 'A saved copy of his website from 20 November, with its page code.', from: 'the Wayback Machine (previous lead)' }],
    clue: 'html_author', card: { kind: 'index', scene: 'code' },
    hint: 'Look for the author tag, <meta name="author">, and the wp-user line in page-source.txt.',
    summary: 'The website\'s own code names who built it: Ray Callahan. His login: rcallahan_admin.',
  },
  B11: {
    clue: 'key_wifi', card: { kind: 'note', scene: 'key' },
    hint: 'There\'s hardly anything left of these pages. Push both sliders high and move them in small steps.',
    summary: 'Ray has a key to my house and knows my WiFi password. She didn\'t email me because she thought he\'d see it first.',
  },
  B12: {
    clue: 'draft', card: { kind: 'polaroid', scene: 'email' },
    hint: 'Check the folder people forget about. Messages you never send are kept in Drafts.',
    summary: 'The night before, she wrote to me and never sent it. She knew who he was but wouldn\'t type his name. She said: don\'t call anyone.',
  },

  // ── THREAD C — the corkboard ──
  C1: {
    brief: [{ fact: 'Maya\'s corkboard hangs on the wall by her desk.', from: 'your photos of her flat' }],
    clue: 'map_three', card: { kind: 'polaroid', scene: 'corkboard' },
    hint: 'Look at the colour of each mark under the glass. Red ink is what Maya decided. Pencil and yellow highlighter are just things she read.',
    summary: 'Her corkboard. In red: a table ringed in the arts night photo, a map with three places joined by string, and Lena\'s last post pinned next to a photo of the same brick wall.',
  },
  C2: {
    brief: [{ fact: 'On her corkboard Maya ringed the table by the door in this photo and wrote: whose is this?', from: 'Maya\'s corkboard' }],
    clue: 'table_sign', card: { kind: 'photo', scene: 'photo' },
    hint: 'Zoom in on the table by the door: the sign on it, the cards under it, and what\'s playing on the screen.',
    summary: 'Up close, the table has a sign saying STILLWATER MEDIA, a stack of business cards, and a screen playing the same landscapes stillwater_m posts.',
  },
  C3: {
    brief: [{ fact: 'Lena\'s last post and the arts night photo show the same brick building.', from: 'Maya\'s corkboard' }],
    clue: 'building_owner', card: { kind: 'index', scene: 'building' },
    hint: 'Q1: the name is on Maya\'s corkboard map. Q2: big public events need a permit from the city — or get written up in the local paper.',
    summary: 'The venue is Alder Hall, on Main Street in Millhaven, owned by a family trust since 1944. The listing doesn\'t say whose family.',
  },
  C4: {
    clue: 'courier', card: { kind: 'index', scene: 'newspaper' },
    hint: 'Link each newspaper cutting to the thing it confirms: the photo credit to the website registration, Lena\'s attendance to her last post, and the case number to the court website.',
    summary: 'The Courier credits Stillwater Media as the photographer that night, confirms Lena was there, and prints a court case number from four years ago — without the name.',
  },
  C9: {
    brief: [{ fact: 'Maya pinned the printed programme from the arts night next to this photo.', from: 'Maya\'s corkboard' }],
    clue: 'same_room', card: { kind: 'photo', scene: 'clock' },
    hint: 'Pick a line on one side, then the line on the other that matches. The clock matches a time in the programme; the sign on the table matches a credit.',
    summary: 'Against the programme, the photo shows the time: 7:47pm, two minutes into Lena\'s talk. Everyone was in the main hall. His kit was in an empty side room.',
  },
  C5: {
    brief: [{ fact: 'His website is registered to Stillwater Media, PO Box 441, Millhaven.', from: 'the WHOIS lookup (thread A)' }],
    clue: 'registry', card: { kind: 'index', scene: 'document' },
    hint: 'Open both records. On the first, flag the registered agent and the address. On the second, flag the trustee.',
    summary: 'Stillwater Media LLC and the Alder Hall Trust are both registered to the same man at the same postbox: Raymond T. Callahan. The company behind the account — and the hall where Lena vanished.',
  },
  C6: {
    brief: [{ fact: 'The Courier printed case number MH-2021-0384 but left out the names.', from: 'the Courier archive' }],
    clue: 'court', card: { kind: 'index', scene: 'court' }, raySuspicion: 10,
    hint: 'It\'s the same case in two documents. Compare them line by line. Four lines are different, and each is something the newspaper chose not to print.',
    summary: 'Case MH-2021-0384: Raymond T. Callahan. Fake accounts, reading her email, turning up where only her private messages said she\'d be. He\'s done this before.',
  },
  C7: {
    clue: 'chain_sheet', card: { kind: 'index', scene: 'yarn' },
    hint: 'Link cards that share something: the website and the business (the PO box), the business and the username (the word "Stillwater"), the username and the court case (fake accounts), the court case and the photo (the name), the photo and the website (Millhaven).',
    summary: 'Five records, one address, one name. Three separate trails all end in the same place.',
  },
  C8: {
    clue: 'rosa', card: { kind: 'note', scene: 'note' },
    hint: 'Open the file about the front of the board — then check what\'s stuck on the back.',
    summary: 'On the back of her board, where only someone really looking would find it: Rosa Velasquez, a reporter Maya trusted.',
  },
}

export function withMeta(node) {
  return node ? { ...node, ...(LEAD_META[node.id] ?? {}) } : node
}
