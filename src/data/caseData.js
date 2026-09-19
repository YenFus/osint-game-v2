// ─────────────────────────────────────────────────────────────────
// CASE DATA — clues, deductions, the final case, Ray, the deadline
//
// Leads (nodes in gameData.js) grant CLUES. On the Case Board the
// player pins clues into a thread's three DEDUCTION slots as a
// theory, then tests the theory as a whole: the board only says how
// many pins hold. A correct theory closes the thread. Two closed
// threads plus Maya's unsent draft open THE SUSPECT: name who took
// her and choose three clues for the police. The ending is built
// from that choice, Ray's suspicion, and whether Ray has already
// left town.
//
// Calendar (2025): Lena vanishes Sat 13 Apr 2024 after the arts
// night. Maya drafts "Dad, it's Ray" Sun 9 Mar 2025, 11:47pm; is
// taken Mon 10 Mar, 7:52am; misses dinner Tue 11 Mar; Thomas enters
// her apartment Wed 12 Mar, 18:40 — play begins.
// ─────────────────────────────────────────────────────────────────

export const START_MISSING_MINUTES = 58 * 60 + 48
export const START_CLOCK = { day: 'WED', hour: 18, minute: 40 }

export const THREAD_INFO = {
  A: { title: 'Maya\'s Laptop', sub: 'Thread A · The Digital Trail' },
  B: { title: 'The Burned Notebook', sub: 'Thread B · The Private Notes' },
  C: { title: 'Maya\'s Corkboard', sub: 'Thread C · The Public Record' },
}

// In-game minutes each lead type costs to work through
export const LEAD_TIME_COST = {
  read: 10, navigate: 12, tag: 15, input: 12, slider: 15, browse: 18, connect: 15, typewriter: 5,
  map: 15, timeline: 12, compare: 12, diff: 12, phrase: 12,
}
export const WRONG_GUESS_COST = 15
// Wrong guesses cost 15 the first time and 30 after that. One
// definition so the number charged and the number shown can't drift —
// three node types used to charge silently or quote a stale figure.
export function wrongCost(nth) {
  // 15, then 30, and never more: a bad run shouldn't lose the night
  return WRONG_GUESS_COST * (nth >= 2 ? 2 : 1)
}
export const WRONG_THEORY_COST = 20
export const HINT_COST = 20

// ── The deadline ──────────────────────────────────────────────────
// Ray says he's driving to Seattle before dawn Thursday. He isn't going
// to Seattle. The more nervous he gets, the earlier he leaves.
//
// The budget, so this stays honest when lead costs move:
//   all 27 leads          = 408 min
//   the short route (14)  = 213 min
//   base deadline         = 600 min  (Thu 04:40 — "before dawn")
//   at suspicion 30       = 525      completionist keeps ~2h of slack
//   at suspicion 50       = 420      completionist has ~12 min: talk too
//                                    much to Ray and the full sweep is off
// 780 gave a completionist six clear hours of slack and the short route
// three times what it needed, which is no clock at all.
const BASE_DEADLINE = (24 - START_CLOCK.hour) * 60 - START_CLOCK.minute + 4 * 60 + 40 // Thu 04:40 = 600
export const SUSPICION_STEPS = [
  { at: 30, earlier: 75, text: 'Ray: "Change of plans — heading out a bit earlier. Around three."' },
  { at: 50, earlier: 105, text: 'Ray: "Might just leave tonight. Beat the traffic."' },
]
export function rayDeadline(suspicion) {
  return BASE_DEADLINE - SUSPICION_STEPS.filter(s => suspicion >= s.at).reduce((n, s) => n + s.earlier, 0)
}
export const RAY_ALARM_THRESHOLD = 50

// ── CLUES ──────────────────────────────────────────────────────────
// scene:  which PolaroidArt illustration to draw
// spoken: how Thomas names this on the phone to Okafor. The ending used
//         to read `title` aloud, so he said things like "Where he was the
//         night Lena vanished — Flickr EXIF — stillwater_m." A man on the
//         phone at one in the morning does not speak in field labels.
export const CLUES = {
  corey_flickr: {
    title: 'Suspect file — C. Marsh',
    detail: 'Lena\'s ex. stillwater_m called him obsessive; his photos "look like" her street.',
    source: 'Maya\'s suspect file (laptop)',
    spoken: 'her file on the ex-boyfriend',
    scene: 'car',
  },
  corey_alibi: {
    title: 'Flickr EXIF — c_marsh_pdx',
    detail: 'EXIF: an auto body shop in Tigard. Apr 12, 7:54 and 11:38pm; Apr 13, 9:40pm. At work both nights.',
    source: 'Flickr — c_marsh_pdx',
    spoken: 'the ex-boyfriend\'s own photos — he was at work both nights',
    scene: 'car',
  },
  insider: {
    title: 'Forum posts — flagged set',
    detail: 'He knew Lena\'s Tuesday route, her class schedule and her roommate\'s name. None of it public.',
    source: 'Reddit + PDXmissing forum',
    spoken: 'forum posts that give away things only her circle knew',
    scene: 'forum',
  },
  sealed: {
    title: 'Deep archive — three posts',
    detail: 'He quoted "waiting for something to end" — Priya\'s words to police, never released. And knew the venue\'s exits.',
    source: 'PDXmissing deep archive',
    spoken: 'three posts quoting a police statement that was never released',
    scene: 'forum',
  },
  deleted: {
    title: 'Username scan results',
    detail: 'Twitter deleted, Flickr locked — both within days of Maya asking questions.',
    source: 'Username scan (laptop)',
    spoken: 'both his accounts went dark the week she started asking',
    scene: 'phone',
  },
  flickr_gps: {
    title: 'Flickr EXIF — stillwater_m',
    detail: 'GPS: the waterfront by Lena\'s apartment, Apr 12. The Alder Hall, Apr 13, 6:38 and 8:11pm.',
    source: 'Flickr cache — stillwater_m',
    spoken: 'the GPS buried in his own photographs',
    scene: 'building',
  },
  domain_tweet: {
    title: 'Archived tweet — Nov 3',
    detail: '@stillwater_m, Nov 3: "stillwater-media.net is finally live."',
    source: 'Twitter archive',
    spoken: 'a tweet where he brags about the website he owns',
    scene: 'phone',
  },
  shield: {
    title: 'WHOIS record — shielded',
    detail: 'stillwater-media.net is behind a privacy shield, paid for on 14 November. Organisation: Stillwater Media. PO Box 441, Millhaven.',
    source: 'WHOIS lookup',
    spoken: 'the domain registration, hidden behind a privacy shield five days after she started asking',
    scene: 'shielded',
  },
  whois: {
    title: 'WHOIS record — archived',
    detail: 'The registration as it stood in September, before the shield: R. Callahan, Stillwater Media, PO Box 441, Millhaven.',
    source: 'WHOIS history — September snapshot',
    spoken: 'the domain registration from before he hid it, with his name still on it',
    scene: 'domain',
  },
  nightwatch: {
    title: 'Following list (cached)',
    detail: 'He follows @nightwatch_rc and @stillwater_media — a photography business account.',
    source: 'Twitter archive — following list',
    spoken: 'a second account he follows, carrying his initials',
    scene: 'phone',
  },
  html_author: {
    title: 'Archived page source',
    detail: 'Archived page source: author "Ray Callahan", WordPress user rcallahan_admin.',
    source: 'Wayback Machine — page source',
    spoken: 'the site\'s own source code, archived — it names its author',
    scene: 'code',
  },
  key_wifi: {
    title: 'Notebook, page 13',
    detail: '"He has a key to Dad\'s house. He knows the WiFi password. If I email Dad, he might see it."',
    source: 'Burned notebook',
    spoken: 'page thirteen of her notebook — he has a key to my house',
    scene: 'key',
  },
  draft: {
    title: 'Unsent draft — Mar 9',
    detail: 'Sun 9 Mar, 11:47pm: "I know who he is now. I\'m not typing his name." Never sent.',
    source: 'Maya\'s Gmail',
    spoken: 'the letter she wrote me the night before and never sent',
    scene: 'email',
  },
  map_three: {
    title: 'Corkboard map',
    detail: 'Three pins joined in red: the venue, PO Box 441, the courthouse.',
    source: 'Maya\'s corkboard',
    spoken: 'the map she pinned, three places joined in red',
    scene: 'map',
  },
  table_sign: {
    title: 'Arts night photo — zoom',
    detail: 'Zoomed: a printed sign reading STILLWATER MEDIA, his cards beside it, and a showreel of the same landscapes stillwater_m posts.',
    source: 'Maya\'s corkboard — arts night photo',
    spoken: 'the sign on the table in that photograph, printed with the same name as the website',
    scene: 'photo',
  },
  same_room: {
    title: 'Arts night — photo against programme',
    detail: 'The wall frame reads 7:47 PM. The programme puts Lena on stage in the main hall at 7:45. His kit sat alone in the empty east gallery.',
    source: 'Maya\'s corkboard — photo and programme',
    spoken: 'the clock on the wall in that photograph — seven forty-seven',
    scene: 'clock',
  },
  building_owner: {
    title: 'Event search notes',
    detail: 'The venue is Alder Hall, held by a family trust since 1944. The listing does not name the trustee.',
    source: 'Event search',
    spoken: 'the venue — a hall held by a family trust since the war',
    scene: 'building',
  },
  courier: {
    title: 'Millhaven Courier — Apr 15',
    detail: '"Event photography provided by Stillwater Media." Lena Vasquez is named as having attended.',
    source: 'Millhaven Courier archive',
    spoken: 'the Millhaven Courier, printing his company as the photographer that night',
    scene: 'newspaper',
  },
  registry: {
    title: 'Business registry entry',
    detail: 'Stillwater Media LLC and the Alder Hall Trust — same man, same PO box: Raymond T. Callahan.',
    source: 'Oregon Secretary of State',
    spoken: 'the state business registry — his company and the hall itself, both filed by Raymond T. Callahan',
    scene: 'document',
  },
  court: {
    title: 'County court — 2021 filing',
    detail: 'Restraining order, Raymond T. Callahan: fake accounts, reading her email, following her car.',
    source: 'Marion County court filing',
    spoken: 'a restraining order against him from four years ago',
    scene: 'court',
  },
  arts_domain: {
    title: 'WHOIS record — second lookup',
    detail: 'millhavenartsnight.org — the arts collective, privacy protection on. Nothing here.',
    source: 'WHOIS lookup',
    spoken: 'the arts collective\'s own domain',
    scene: 'shielded',
  },
  wayback_index: {
    title: 'Wayback index — 4 captures',
    detail: 'Four captures since Nov 2024. Crawl dates, not authorship.',
    source: 'Wayback Machine',
    spoken: 'the archive capture dates',
    scene: 'archive',
  },
  chain_sheet: {
    title: 'Maya\'s link sheet',
    detail: 'Five cards, five lines in her hand. A map of what she believed.',
    source: 'Maya\'s corkboard',
    spoken: 'the diagram she drew linking it together',
    scene: 'yarn',
  },
  rosa: {
    title: 'Sticky note — back of board',
    detail: 'Rosa Velasquez, Pacific Reporter, digital safety beat. "She\'ll understand."',
    source: 'Back of Maya\'s corkboard',
    spoken: 'the reporter\'s details she kept on the back of her board',
    scene: 'note',
  },
  // Four leads finished and handed the board nothing: A11, B1 and B5 had no
  // clue at all, and B2 granted `insider`, which A2 already grants. Each of
  // these is the thing its own lead proves and no other lead does. None of
  // them carries the surname — A11, B1, B5 and B2 are all early-reachable.
  postbox: {
    title: 'Ownership chain — one postbox',
    detail: 'Handle, domain, LLC and mailing address all resolve to PO Box 441, Millhaven. Four records, one box, no name on any of them.',
    source: 'WHOIS + Oregon business registry',
    spoken: 'four separate records that all end at the same postbox',
    scene: 'shielded',
  },
  burned_page: {
    title: "Maya's notebook — recovered page",
    detail: 'November, in her hand: she had found Lena\'s case and flagged one account as knowing more than it should. She was eight months ahead of me.',
    source: "Maya's notebook (partially burned)",
    spoken: 'the page from her notebook I got back out of the burn',
    scene: 'note',
  },
  priya_words: {
    title: 'Verbatim match — Priya\'s statement',
    detail: 'The phrasing Priya gave the police appears word for word in a forum post made before the statement was public. Maya wrote two initials in the margin beside it.',
    source: 'Police statement + PDXmissing forum',
    spoken: 'a witness statement quoted on a forum before anybody could have read it',
    scene: 'document',
  },
  no_source: {
    title: 'Sourcing pass — four posts',
    detail: 'Two of his claims trace to a press release or an open album. Two trace nowhere public at all — and between them he handed the thread its only suspect.',
    source: 'PDXmissing forum, sourced',
    spoken: 'two things he said that had no public source anywhere',
    scene: 'forum',
  },
}

// ── THREAD DEDUCTIONS ──────────────────────────────────────────────
// Pins are a theory until tested. A test reports only how many hold.
// Reveals state only what the answer clue itself shows.
export const DEDUCTIONS = {
  A: [
    {
      id: 'dA1',
      question: 'Maya dropped her first suspect. Was she right to?',
      answer: ['corey_alibi'],
      reveal: 'Yes. Corey was in Tigard both nights. He was bait.',
    },
    {
      id: 'dA2',
      question: 'Where was he the night she disappeared?',
      answer: ['flickr_gps'],
      reveal: 'His own photos. Her street on the 12th. Her room on the 13th.',
    },
    {
      id: 'dA3',
      question: 'The account is a handle. How do I put a real name on it?',
      pairAnswer: ['domain_tweet', 'whois'],
      // Other pairs that genuinely name the account holder.
      alsoAccept: [['whois', 'registry'], ['whois', 'html_author'], ['registry', 'html_author']],
      hintLine: 'Two clues: the thing he bragged about owning, and the receipt with a name on it.',
      reveal: 'He owns the domain. The record from before he hid it says who paid: R. Callahan.',
    },
  ],
  B: [
    {
      id: 'dB1',
      question: 'Concern explains reading the forum. What does it not explain?',
      pairAnswer: ['insider', 'sealed'],
      hintLine: 'Two clues: things only her circle knew, and words only the police had.',
      reveal: 'He quoted a sealed statement. That isn\'t following a case.',
    },
    {
      id: 'dB2',
      question: 'He built that website himself. What did he leave in it?',
      answer: ['html_author'],
      reveal: 'Its own source code: author Ray Callahan. Login rcallahan_admin.',
    },
    {
      id: 'dB3',
      question: 'Why didn\'t Maya just tell me?',
      answer: ['key_wifi'],
      reveal: 'He has a key to my house. She was protecting me.',
    },
  ],
  C: [
    {
      id: 'dC1',
      question: 'Who had a reason to be in that room all evening?',
      pairAnswer: ['table_sign', 'courier'],
      alsoAccept: [['courier', 'same_room'], ['table_sign', 'same_room']],
      hintLine: 'Two clues. One is his sign in the photograph; the other is the paper crediting the same company.',
      reveal: 'The press card in the photo, and the paper naming his company as the photographer.',
    },
    {
      id: 'dC2',
      question: 'Two things were filed to the same box. What were they?',
      pairAnswer: ['map_three', 'registry'],
      hintLine: 'Two clues: the box she circled, and the paperwork filed to it.',
      reveal: 'Box 441 registers his company — and the trust that owns Alder Hall.',
    },
    {
      id: 'dC3',
      question: 'Has he done this to a woman before?',
      answer: ['court'],
      reveal: 'Raymond T. Callahan. Fake accounts, her email, her car.',
    },
  ],
}

// ── THE FINAL CASE ─────────────────────────────────────────────────
export const SUSPECTS = [
  { id: 'corey', name: 'Corey Marsh', tag: 'Lena\'s ex-boyfriend', scene: 'car' },
  { id: 'pryce', name: 'Owen Pryce', tag: 'Ran the arts night', scene: 'building' },
  { id: 'unknown', name: 'stillwater_m', tag: 'Identity unconfirmed', scene: 'forum' },
  // Thomas's oldest friend is not a suspect until a record makes him one.
  { id: 'ray', name: 'Ray Callahan', tag: 'Your oldest friend', scene: 'ray', needsName: true },
]

// Who the player can circle: Ray only once something carries his name.
export function suspectsFor(clues = []) {
  const named = (clues ?? []).some(id => NAME_CLUES.includes(id))
  return SUSPECTS.filter(s => !s.needsName || named)
}

// Slot scoring: clue → weight (1 = airtight, 0.5 = supporting, 0 = useless)
// Detective Okafor's reaction to each pick is written into the ending call.
export const FINAL_SLOTS = [
  {
    id: 'who',
    label: 'WHO',
    question: 'Prove who is behind stillwater_m',
    weights: { whois: 1, registry: 1, html_author: 1, nightwatch: 0.5, draft: 0.5, shield: 0.5, postbox: 0.5, chain_sheet: 0.5, domain_tweet: 0.25, priya_words: 0.25, burned_page: 0.25 },
    reactions: {
      whois: 'A WHOIS record with no privacy shield. The registrar can confirm it in an hour.',
      registry: 'State registry — Stillwater Media LLC, Raymond T. Callahan. That\'s your username, filed with the state. That\'s clean.',
      html_author: 'His name in the site\'s own source code, archived by a third party. Good.',
      nightwatch: 'Initials in a Twitter handle. It\'s a pointer, Mr. Reyes, not an identity.',
      draft: 'She says she knew. She doesn\'t say the name. Give me what she had.',
      shield: 'He paid to hide that registration five days after your daughter started asking. That is not a name — but it is a man behaving like one with something to lose.',
      domain_tweet: 'So the account owns a website. Who owns the website?',
      postbox: 'Handle, domain, company, mailbox — four records and they all end at the same slot in the same post office. That is one man, Mr. Reyes. It is not yet a name.',
      chain_sheet: 'Your daughter drew the same diagram I would have drawn. It is good work and it is not a document. Bring me one of the records on it.',
      priya_words: 'Two letters in the margin of a notebook. I know what she meant by them. A judge will ask me how I know.',
      burned_page: 'She wrote that she had found him. She did not write down who he was. I need what she had, not what she concluded.',
      corey_flickr: 'That is a file on a different man, and your daughter stopped believing it before you did.',
      corey_alibi: 'That clears Marsh. Clearing one man does not name another.',
      arts_domain: 'A company is not a person. Who files the paperwork for it?',
      map_three: 'Three pins and a piece of string. It tells me where. It does not tell me who.',
      wayback_index: 'Capture dates tell me when a page changed. They do not tell me whose page it was.',
      rosa: 'A reporter\'s details. That is a phone call you can make, not evidence I can act on.',
    },
    fallback: 'That doesn\'t tell me who runs the account.',
  },
  {
    id: 'there',
    label: 'THERE',
    question: 'Put him at Lena\'s last known location',
    weights: { flickr_gps: 1, courier: 1, same_room: 0.75, table_sign: 0.75, arts_domain: 0.5, map_three: 0.5, building_owner: 0.25 },
    reactions: {
      flickr_gps: 'GPS in his own photos — the venue, eight-eleven, the night she vanished. That\'s placement.',
      courier: 'The Courier credits him as the event photographer. Printed, dated, public. That\'s placement.',
      table_sign: 'A company sign on a table in a photograph. It puts the business in the room. I would want the man.',
      same_room: 'Seven forty-seven. Everyone in the hall for her talk, and his kit left in an empty room. He wasn\'t photographing the talk. That\'s opportunity.',
      building_owner: 'Owning a building isn\'t being in it.',
      arts_domain: 'The registry and the paper name the same business, and the paper puts that business in the hall that night. It places the company. Give me the man and I can use it.',
      map_three: 'Three places, joined in red, and the middle one is the hall. I want to know who put the pins in before I take it to a judge — but it is the right shape.',
      postbox: 'A post office box is an address for letters. She did not disappear from a post office.',
      chain_sheet: 'A diagram of what connects to what. None of it is a sighting.',
      priya_words: 'That is somebody quoting a statement. It does not put him in the room.',
      no_source: 'He knew things he should not have known. Knowing is not standing there.',
      burned_page: 'Her notebook puts her on his trail. It does not put him at the venue.',
      corey_flickr: 'Wrong man, wrong place.',
      corey_alibi: 'That puts Marsh in a body shop in Tigard. I am asking about the arts night.',
      wayback_index: 'An archive crawler was there. He is what I need.',
      rosa: 'A journalist\'s email is not a location.',
    },
    fallback: 'That doesn\'t put him at the arts night.',
  },
  {
    id: 'before',
    label: 'PATTERN',
    question: 'Show this is who he is',
    weights: { court: 1, sealed: 0.75, insider: 0.75, no_source: 0.75, priya_words: 0.75, key_wifi: 0.5, draft: 0.5, burned_page: 0.25, deleted: 0.25 },
    reactions: {
      court: 'MH-2021-0384. Fake accounts, email monitoring, following a woman\'s car. Same playbook. That\'s what gets a warrant signed tonight.',
      sealed: 'He quoted a sealed police statement. That\'s access he should never have had.',
      insider: 'He knew her roommate\'s name and her routes before anyone published them. That\'s knowledge he shouldn\'t have.',
      key_wifi: 'He has a key to your house. That\'s access. It isn\'t conduct.',
      draft: 'A frightened letter. It isn\'t a pattern.',
      deleted: 'People delete accounts every day.',
      no_source: 'You sourced every claim he made and two of them come from nowhere a member of the public could reach — and in between them he handed the thread a suspect. That is not a man following a case. That is a man steering one.',
      priya_words: 'He used the flatmate\'s own words before anybody outside the station had them. That is not a coincidence, that is access.',
      burned_page: 'Your daughter flagged the account in November and she was eight months ahead of all of us. That is her judgement, and I will take it seriously. It is still not his conduct.',
      postbox: 'Renting a mailbox is not a pattern of behaviour.',
      chain_sheet: 'The diagram shows me the structure. I need the history.',
      arts_domain: 'Registering a company is not conduct.',
      map_three: 'Three locations. Show me what he did at them.',
      corey_flickr: 'That is a file on the ex-boyfriend. It is a pattern of your daughter\'s suspicion, not his.',
      corey_alibi: 'Marsh was at work. That is the end of Marsh, not the start of anybody else.',
      wayback_index: 'Four captures of a web page. It is how you prove a change, not a character.',
      rosa: 'Talk to her by all means. It is not evidence.',
    },
    fallback: 'That doesn\'t show me a pattern.',
  },
]

// Okafor has something specific to say about the near-misses too
const DECOY_REACTIONS = {
  arts_domain: 'That domain belongs to the arts collective, and it\'s privacy-shielded. Dead end.',
  wayback_index: 'Capture counts tell me a crawler visited a web page. They don\'t tell me who wrote it.',
  chain_sheet: 'A diagram she drew for herself. I can\'t take a diagram to a judge.',
  // G-4: these two had no reaction at all — pinning them got a generic
  // shrug, which reads as a bug rather than a dead end.
  corey_flickr: 'The ex. Your daughter cleared him in January and so did we. Somebody wanted him looked at. That somebody is the case.',
  rosa: 'A reporter\'s contact details. I have no objection to her, Mr. Reyes, but she is not evidence.',
}
FINAL_SLOTS.forEach(slot => { slot.reactions = { ...DECOY_REACTIONS, ...slot.reactions } })

// ── RAY'S MESSAGES ─────────────────────────────────────────────────
// Fired on the Case Board after the player has finished N leads.
// suspicion: how much Ray's unease rises (can be negative).
//
// `after` MUST ascend down this list: Ray escalates, and the store
// fires the first beat whose threshold is met. A short route closes
// two threads in about fourteen leads, so the last beat has to land
// inside that or a fast player never hears him get frightened.
export const RAY_BEATS = [
  {
    id: 'r1',
    after: 2,
    messages: [
      'Tom. Anything? I can\'t stop thinking about her.',
      'I\'m meant to drive up to Seattle before dawn Thursday for a shoot. Say the word and I\'ll cancel.',
    ],
    options: [
      { text: 'Go. Police are on it. I\'ll call you.', suspicion: 0, reply: 'Okay. Anything at all. I mean it.' },
      { text: 'I\'m at her place. Going through her things.', suspicion: 15, reply: 'Her things? Like what — what are you looking for?' },
      { text: 'Not now, Ray.', suspicion: 5, reply: 'Sure. Sorry. I\'m here.' },
    ],
  },
  {
    id: 'r2',
    after: 6,
    messages: ['Any news?', 'I could drive over tonight. Check that coffee place she goes to on Tuesdays.'],
    options: [
      { text: 'No news. Sit tight.', suspicion: 0, reply: 'Okay. Let me know.' },
      { text: 'How do you know where she goes on Tuesdays?', suspicion: 20, reply: 'She told me at dinner, Tom. I\'m her godfather.' },
      { text: 'Thanks. That would help.', suspicion: -5, reply: 'Heading out now. I\'ll text you.' },
    ],
  },
  {
    id: 'r3',
    after: 10,
    messages: ['Did Maya ever mention a project? Something online?', 'She asked me some odd questions at dinner last week.'],
    options: [
      { text: 'Just her thesis.', suspicion: -5, reply: 'Right. Right, the thesis. Makes sense.' },
      { text: 'She was looking into a missing woman.', suspicion: 25, reply: '...What woman?' },
      { text: 'What kind of questions?', suspicion: 10, reply: 'Photography stuff. Old cases. Forget it, it\'s nothing.' },
    ],
  },
  {
    id: 'r4',
    after: 13,
    messages: ['You\'ve gone quiet on me.', 'Tom, you\'re scaring me. I\'m coming over.'],
    options: [
      { text: 'Don\'t. I need to be alone tonight.', suspicion: 5, reply: 'Okay. Okay. Call me before I go.' },
      { text: 'I\'m at the police station.', suspicion: 15, reply: 'The station? Did they find something?' },
      { text: 'I\'m at Maya\'s. Door\'s open.', suspicion: 30, reply: 'Be there in twenty.' },
    ],
  },
]

// The final beat, when the case is ready and he hasn't left: Ray is downstairs.
export const RAY_FINAL = {
  messages: ['I\'m outside Maya\'s building.', 'Saw your car. Buzz me up? I want to see you before I go.'],
}

export function rayMood(suspicion) {
  if (suspicion >= RAY_ALARM_THRESHOLD) return { label: 'Alarmed', color: '#e04a3a' }
  if (suspicion >= 30) return { label: 'Uneasy', color: '#d4a84b' }
  if (suspicion >= 12) return { label: 'Curious', color: '#b0a070' }
  return { label: 'Calm', color: '#6a9a70' }
}

// ── Clock helpers ─────────────────────────────────────────────────
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
export function clockLabel(clockMinutes) {
  const total = START_CLOCK.hour * 60 + START_CLOCK.minute + clockMinutes
  const dayIdx = (DAYS.indexOf(START_CLOCK.day) + Math.floor(total / 1440)) % 7
  const mins = total % 1440
  const hh = String(Math.floor(mins / 60)).padStart(2, '0')
  const mm = String(mins % 60).padStart(2, '0')
  return `${DAYS[dayIdx]} ${hh}:${mm}`
}
export function missingLabel(clockMinutes) {
  const m = START_MISSING_MINUTES + clockMinutes
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`
}
export function durationLabel(minutes) {
  const m = Math.max(0, minutes)
  return `${Math.floor(m / 60)}h ${String(m % 60).padStart(2, '0')}m`
}
// Kept as a function so the ending/board share one definition
export function effectiveSuspicion(raySuspicion) {
  return Math.min(100, Math.max(0, raySuspicion))
}

// Wrong men: circling either of these hands Okafor somebody the evidence
// does not point at.
export const WRONG_SUSPECTS = ['corey', 'pryce']

// ── Final case evaluation ─────────────────────────────────────────
// Records that carry a real name: even if the player never says it out loud,
// the police can pull that thread themselves.
export const NAME_CLUES = ['whois', 'registry', 'html_author']

export function evaluateCase(finalCase) {
  const suspect = finalCase?.suspect ?? null
  const slots = finalCase?.slots ?? {}
  const perSlot = FINAL_SLOTS.map(slot => {
    const clueId = slots[slot.id] ?? null
    const weight = clueId ? (slot.weights[clueId] ?? 0) : 0
    // Okafor judges the document in front of him, not the name on your lips
    const reaction = clueId ? (slot.reactions[clueId] ?? slot.fallback) : 'You have nothing for this, Mr. Reyes.'
    return { slot, clueId, weight, reaction }
  })
  const strength = perSlot.reduce((s, p) => s + p.weight, 0)
  const namesSomeone = perSlot.some(p => NAME_CLUES.includes(p.clueId))
  // Only a case built against the right man convinces Okafor on the call itself
  return { suspect, perSlot, strength, namesSomeone, caseAgainstRay: suspect === 'ray' ? strength : 0 }
}

// A slot is ready to test when a single question has one pin, or a
// paired question has both of its pins.
export function pinComplete(ded, pin) {
  return ded.pairAnswer ? Array.isArray(pin) && pin.length === 2 : !!pin
}
export function pinCorrect(ded, pin) {
  if (ded.pairAnswer) {
    if (!Array.isArray(pin) || pin.length !== 2) return false
    const got = [...pin].sort().join()
    const sets = [ded.pairAnswer, ...(ded.alsoAccept ?? [])]
    return sets.some(set => [...set].sort().join() === got)
  }
  return !!pin && [...ded.answer, ...(ded.alsoAccept ?? []).flat()].includes(pin)
}
