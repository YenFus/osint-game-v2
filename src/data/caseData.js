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
// Clue text rewritten in plain English (2026-09-21). The player matches
// these against the board's questions, so a title has to say what the
// document is and what it shows — "Flickr EXIF — c_marsh_pdx" said neither.
// Ids, scenes and every weight elsewhere are unchanged. None of the
// early-reachable clues carries the surname.
export const CLUES = {
  corey_flickr: {
    title: 'Maya\'s file on Corey Marsh',
    detail: 'Lena\'s ex. stillwater_m kept telling the forum Corey was obsessed with her, and that his photos "look like her street". Maya meant to check.',
    source: 'Maya\'s laptop — c_marsh_crossref.txt',
    spoken: 'her file on Lena\'s ex',
    scene: 'car',
  },
  corey_alibi: {
    title: 'Corey was at work both nights',
    detail: 'The hidden time stamps in Corey\'s own photos put him at a body shop in Tigard on the Friday evening and the Saturday night.',
    source: 'Corey\'s Flickr — c_marsh_pdx',
    spoken: 'the ex-boyfriend\'s own photos — he was at work both nights',
    scene: 'car',
  },
  insider: {
    title: 'Things he shouldn\'t have known',
    detail: 'In his forum posts he mentions Lena\'s Tuesday route, her class schedule and her flatmate\'s first name. None of that was ever public.',
    source: 'stillwater_m\'s forum posts',
    spoken: 'forum posts giving away things only her friends knew',
    scene: 'forum',
  },
  sealed: {
    title: 'He quoted a police statement',
    detail: 'He repeated Priya\'s exact words to the police — "waiting for something to end" — though her statement was never released. He also knew the hall\'s exits.',
    source: 'Priya\'s statement, read against his posts',
    spoken: 'posts quoting a police statement that was never released',
    scene: 'forum',
  },
  deleted: {
    title: 'His accounts went dark',
    detail: 'Two days after Maya asked the forum who he was, his Twitter was deleted and his Flickr went private.',
    source: 'Maya\'s username scan, 1–3 February',
    spoken: 'both his accounts went dark right after she asked about him',
    scene: 'phone',
  },
  flickr_gps: {
    title: 'Where his photos were taken',
    detail: 'The location data in his own photos: the waterfront two streets from Lena\'s flat on Friday 12 April, then Alder Hall at 6:38pm and 8:11pm on the Saturday.',
    source: 'stillwater_m\'s Flickr — Maya\'s saved copy',
    spoken: 'the GPS in his own photographs',
    scene: 'building',
  },
  domain_tweet: {
    title: 'He announced the website',
    detail: '@stillwater_m, 2 March 2024: "stillwater-media.net is finally live." The account and the website belong to the same person.',
    source: 'His Twitter — archived copy',
    spoken: 'a tweet where he announces the website he owns',
    scene: 'phone',
  },
  shield: {
    title: 'Website registration — hidden',
    detail: 'stillwater-media.net is behind a privacy shield, switched on 9 November. It still shows the company, Stillwater Media, and PO Box 441, Millhaven.',
    source: 'WHOIS lookup, run by Maya on 22 January',
    spoken: 'the website registration, hidden five days after she started asking',
    scene: 'shielded',
  },
  whois: {
    title: 'Website registration — before he hid it',
    detail: 'A copy saved on 2 September, before the shield went up: owner R. Callahan, Stillwater Media, PO Box 441, Millhaven.',
    source: 'WHOIS history — 2 September snapshot',
    spoken: 'the website registration from before he hid it, with his name still on it',
    scene: 'domain',
  },
  nightwatch: {
    title: 'His silent second account',
    detail: '@nightwatch_rc: made on 9 November, never posts, follows his company and Corey Marsh. Its header picture is a crop of his own photo.',
    source: 'Twitter — archived profiles',
    spoken: 'a second account he opened, with his initials on it',
    scene: 'phone',
  },
  html_author: {
    title: 'His name in the website\'s code',
    detail: 'The archived website\'s code names who built it: Ray Callahan. Login: rcallahan_admin.',
    source: 'Wayback Machine copy, 20 November',
    spoken: 'the website\'s own code — it names who built it',
    scene: 'code',
  },
  key_wifi: {
    title: 'Notebook: "he has a key"',
    detail: 'Maya\'s notebook, 19 February: "He has a key to Dad\'s house. He knows the WiFi password. If I email Dad, he might see it."',
    source: 'Maya\'s burned notebook',
    spoken: 'a page of her notebook — he has a key to my house',
    scene: 'key',
  },
  draft: {
    title: 'The email she never sent',
    detail: 'Sunday 9 March, 11:47pm, to me: "I know who he is now. I\'m not typing his name." Saved as a draft. Never sent.',
    source: 'Maya\'s email — Drafts',
    spoken: 'the letter she wrote me the night before and never sent',
    scene: 'email',
  },
  map_three: {
    title: 'Maya\'s map: three pins',
    detail: 'On her corkboard, a map of Millhaven with three places joined in red string: the arts night venue, PO Box 441, and the courthouse.',
    source: 'Maya\'s corkboard',
    spoken: 'the map she pinned, three places joined in red',
    scene: 'map',
  },
  table_sign: {
    title: 'The sign on the table',
    detail: 'Zoomed in on the arts night photo: a printed sign saying STILLWATER MEDIA, a stack of business cards, and a screen playing the same landscapes stillwater_m posts.',
    source: 'The arts night photo on Maya\'s corkboard',
    spoken: 'the sign on the table in that photograph, with the same name as the website',
    scene: 'photo',
  },
  same_room: {
    title: '7:47pm, an empty side room',
    detail: 'The clock in the photo says 7:47pm. The programme puts Lena on stage in the main hall at 7:45. His kit was alone in the empty side gallery.',
    source: 'The arts night photo, against the printed programme',
    spoken: 'the clock on the wall in that photograph — seven forty-seven',
    scene: 'clock',
  },
  building_owner: {
    title: 'The venue: Alder Hall',
    detail: 'The arts night was at Alder Hall on Main Street, Millhaven. A family trust has owned it since 1944. The listing doesn\'t say whose family.',
    source: 'Event search',
    spoken: 'the venue — a hall a family trust has owned since the war',
    scene: 'building',
  },
  courier: {
    title: 'Courier: "photography by Stillwater Media"',
    detail: 'The Millhaven Courier, 15 April: "Event photography provided by Stillwater Media." The same piece says Lena was there.',
    source: 'Millhaven Courier archive',
    spoken: 'the Millhaven Courier, naming his company as the photographer that night',
    scene: 'newspaper',
  },
  registry: {
    title: 'State records: the owner\'s name',
    detail: 'Stillwater Media LLC and the Alder Hall Trust are both registered to the same man at PO Box 441: Raymond T. Callahan.',
    source: 'Oregon business registry',
    spoken: 'the state business registry — his company and the hall itself, both in the name of Raymond T. Callahan',
    scene: 'document',
  },
  court: {
    title: 'Court case, 2021',
    detail: 'A restraining order against Raymond T. Callahan: fake accounts to follow her, reading her email, turning up where only her private messages said she\'d be.',
    source: 'Marion County court filing',
    spoken: 'a restraining order against him from four years ago',
    scene: 'court',
  },
  arts_domain: {
    title: 'Two records, one business',
    detail: 'The business on his website\'s registration, Stillwater Media, is the one the Courier credits as the arts night photographer.',
    source: 'Business registry + Millhaven Courier',
    spoken: 'the business on his registration, credited as the photographer that night',
    scene: 'shielded',
  },
  wayback_index: {
    title: 'When the website was archived',
    detail: 'The Wayback Machine saved his website four times, starting in November. That tells you when, not who wrote it.',
    source: 'Wayback Machine',
    spoken: 'the archive dates for his website',
    scene: 'archive',
  },
  chain_sheet: {
    title: 'Maya\'s link diagram',
    detail: 'Five records on her board, joined by five lines in her handwriting. Everything she believed, in one place.',
    source: 'Maya\'s corkboard',
    spoken: 'the diagram she drew linking it together',
    scene: 'yarn',
  },
  rosa: {
    title: 'A reporter\'s name',
    detail: 'Rosa Velasquez, Pacific Reporter, writes about online safety. Maya\'s note next to it: "She\'ll understand."',
    source: 'The back of Maya\'s corkboard',
    spoken: 'the reporter\'s details she kept on the back of her board',
    scene: 'note',
  },
  postbox: {
    title: 'Everything leads to one postbox',
    detail: 'The handle, the website, the company and the mailing address all lead to PO Box 441, Millhaven. Four records, one box, no name on any of them.',
    source: 'Website registration + business records',
    spoken: 'four separate records that all end at the same postbox',
    scene: 'shielded',
  },
  burned_page: {
    title: 'Notebook: November',
    detail: 'Maya\'s notebook, early November: she found Lena\'s case and noticed one account knew more than it should. That was four months before she disappeared.',
    source: 'Maya\'s burned notebook',
    spoken: 'the page from her notebook I got back out of the burn',
    scene: 'note',
  },
  priya_words: {
    title: 'Priya\'s words, on the forum',
    detail: 'Priya\'s exact words to the police turn up in one of his forum posts, before her statement was ever public. Maya wrote two initials in the margin next to it.',
    source: 'Priya\'s statement + the forum',
    spoken: 'a witness statement quoted on a forum before anybody could have read it',
    scene: 'document',
  },
  no_source: {
    title: 'Two claims from nowhere',
    detail: 'Of four things he posted, two had a public source. Two didn\'t come from anywhere public — and in between, he gave the forum its only suspect.',
    source: 'stillwater_m\'s posts, each checked for a source',
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
      question: 'Maya dropped her first suspect, Corey. Was she right to?',
      answer: ['corey_alibi'],
      reveal: 'Yes. Corey was at work in Tigard both nights. Somebody pointed the forum at him.',
    },
    {
      id: 'dA2',
      question: 'Where was stillwater_m the night Lena disappeared?',
      answer: ['flickr_gps'],
      reveal: 'His own photos put him near her flat on the 12th, and inside the hall on the 13th.',
    },
    {
      id: 'dA3',
      question: 'stillwater_m is just a username. What puts a real name to it?',
      pairAnswer: ['domain_tweet', 'whois'],
      // Other pairs that genuinely name the account holder.
      alsoAccept: [['whois', 'registry'], ['whois', 'html_author'], ['registry', 'html_author']],
      hintLine: 'Two notes: one showing the account owns the website, and one showing who registered the website.',
      reveal: 'The account owns the website, and the website\'s old registration names its owner: R. Callahan.',
    },
  ],
  B: [
    {
      id: 'dB1',
      question: 'He says he\'s just a worried stranger following the case. What did he know that a stranger couldn\'t?',
      pairAnswer: ['insider', 'sealed'],
      hintLine: 'Two notes: things only her friends knew, and words only the police had.',
      reveal: 'He quoted a police statement nobody ever released. A worried stranger couldn\'t do that.',
    },
    {
      id: 'dB2',
      question: 'He built his website himself. What did he leave in its code?',
      answer: ['html_author'],
      reveal: 'His name. The code says it was built by Ray Callahan, login rcallahan_admin.',
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
      question: 'Who was working in that side room all evening?',
      pairAnswer: ['table_sign', 'courier'],
      alsoAccept: [['courier', 'same_room'], ['table_sign', 'same_room']],
      hintLine: 'Two notes: the sign on the table in the photo, and the newspaper naming the same company.',
      reveal: 'The sign in the photo and the newspaper credit both name Stillwater Media — the photographer.',
    },
    {
      id: 'dC2',
      question: 'Two records use the same postbox. Which two?',
      pairAnswer: ['map_three', 'registry'],
      hintLine: 'Two notes: the box she marked on her map, and the records registered to it.',
      reveal: 'PO Box 441 is the address for his company — and for the trust that owns Alder Hall.',
    },
    {
      id: 'dC3',
      question: 'Has he done this to a woman before?',
      answer: ['court'],
      reveal: 'Yes. Raymond T. Callahan, 2021: fake accounts, her email, turning up where she\'d only told friends she\'d be.',
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
      court: 'MH-2021-0384. Fake accounts, reading her email, turning up where only her messages said she\'d be. Same playbook. That gets a warrant signed tonight.',
      sealed: 'He quoted a sealed police statement. That\'s access he should never have had.',
      insider: 'He knew her roommate\'s name and her routes before anyone published them. That\'s knowledge he shouldn\'t have.',
      key_wifi: 'He has a key to your house. That\'s access. It isn\'t conduct.',
      draft: 'A frightened letter. It isn\'t a pattern.',
      deleted: 'People delete accounts every day.',
      no_source: 'You sourced every claim he made and two of them come from nowhere a member of the public could reach — and in between them he handed the thread a suspect. That is not a man following a case. That is a man steering one.',
      priya_words: 'He used the flatmate\'s own words before anybody outside the station had them. That is not a coincidence, that is access.',
      burned_page: 'Your daughter flagged that account in November, before anyone else looked at it twice. I take her judgement seriously. It\'s still not proof of what he did.',
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
      'Tom, it\'s Ray. Any news? I keep thinking about her.',
      'I\'m supposed to drive up to Seattle Thursday for a wedding shoot. Say the word and I\'ll cancel. I mean it.',
    ],
    options: [
      { text: 'Go. The police are on it. I\'ll call you.', suspicion: 0, reply: 'Okay buddy. Anything at all, you call me. Day or night.' },
      { text: 'I\'m at her place. Going through her things.', suspicion: 15, reply: 'Good. That\'s good, Tom. Find anything? Tell me if I can help look.' },
      { text: 'Not now, Ray.', suspicion: 5, reply: 'Course. Sorry. I\'m here when you need me.' },
    ],
  },
  {
    id: 'r2',
    after: 6,
    messages: ['How you holding up?', 'I could drive up tonight and ask at that coffee place she goes to on Tuesdays. Somebody might have seen her.'],
    options: [
      { text: 'No news. Sit tight.', suspicion: 0, reply: 'Okay. I\'m right here.' },
      { text: 'How do you know where she goes on Tuesdays?', suspicion: 20, reply: 'She told me! At your place, at dinner. I\'m her godfather, Tom. I listen.' },
      { text: 'Thanks. That would help.', suspicion: -5, reply: 'On my way. I\'ll text you.' },
    ],
  },
  {
    id: 'r3',
    after: 10,
    messages: ['Random question. Did Maya ever talk to you about some project she was doing online?', 'She was asking me funny questions about photography at dinner. Probably nothing.'],
    options: [
      { text: 'Just her thesis.', suspicion: -5, reply: 'Right, the thesis. That makes sense.' },
      { text: 'She was looking into a missing woman.', suspicion: 25, reply: 'A missing woman? God. Which one?' },
      { text: 'What kind of questions?', suspicion: 10, reply: 'Oh, event stuff. Who shoots what around here. Forget it, it\'s nothing.' },
    ],
  },
  {
    id: 'r4',
    after: 13,
    messages: ['You\'ve gone quiet on me, buddy.', 'Tom, you\'re scaring me. I\'m coming over.'],
    options: [
      { text: 'Don\'t. I need to be alone tonight.', suspicion: 5, reply: 'Okay. Okay. Call me before I leave for Seattle, alright?' },
      { text: 'I\'m at the police station.', suspicion: 15, reply: 'The station? Did they find something? Call me.' },
      { text: 'I\'m at Maya\'s. Door\'s open.', suspicion: 30, reply: 'Leaving now. Be there in twenty.' },
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
