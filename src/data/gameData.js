// GAME DATA — What Maya Knew
// Node schema: { id, type, path, title, tool, timestamp, monologue,
//   intercutAfter, systemAlertAfter, journalistUnlock, osintTip,
//   content, nextNode }
// Each node's content shape is specific to its type.

export const GAME_DATA = {

  // ══════════════════════════════════════════════════════════════════════════
  // PATH A — THE DIGITAL TRAIL
  // Entry object: Maya's laptop. Player exposes that "Corey Marsh" is a
  // dead end Maya already proved — and finds the real username.
  // ══════════════════════════════════════════════════════════════════════════
  A: {
    label: 'Thread A — The Digital Trail',
    object: 'laptop',
    nodes: [

      // A1 — Navigate the file system
      {
        id: 'A1',
        type: 'navigate',
        path: 'A',
        title: "Maya's Laptop — File System",
        tool: 'File Browser',
        timestamp: { text: 'Maya\'s files — November to March', urgent: false },
        monologue: "The screen was still on when I found it. She never left it open.",
        osintTip: {
          id: 'file-metadata',
          title: 'File Metadata Analysis',
          body: 'File modification timestamps reveal when a person was active — and what they were focused on. Investigators look for files modified in the days before a disappearance, cluster of new folders, and document naming patterns that suggest a system.',
          steps: [
            'Sort by date modified, not name',
            'Look for recently created subdirectories',
            'Note naming conventions — "DO_NOT_DELETE" is always a clue',
          ],
          tools: ['ExifTool', 'Autopsy (digital forensics)', 'FTK Imager'],
        },
        content: {
          root: {
            name: "Maya's Laptop",
            type: 'folder',
            children: [
              { name: 'thesis_draft_v3.docx', type: 'file', content: '[Document — thesis draft, academic content, modified 4 months ago]' },
              { name: 'uni_notes_s2', type: 'folder', children: [
                { name: 'SOC4102_lecture_notes.txt', type: 'file', content: 'Goffman, erving — the presentation of self in everyday life...\n\nStigma: notes on the management of spoiled identity.' },
                { name: 'assignment_2_feedback.txt', type: 'file', content: '"Strong analytical voice. Your section on digital self-presentation is particularly sharp. — Prof. Chen"' },
              ]},
              { name: 'recipes_saved', type: 'folder', children: [
                { name: 'shakshuka.txt', type: 'file', content: 'Two cans crushed tomatoes. Olive oil, cumin, paprika...\n\nDad makes his with way too much chili. He thinks I can\'t handle spice. I can.' },
              ]},
              { name: 'INVESTIGATION', type: 'folder', children: [
                { name: 'lena_timeline.txt', type: 'file', content: 'LENA VASQUEZ — TIMELINE\n\nPortland apartment. Millhaven University, Tues/Thurs.\n\nApr 13 — last seen: Millhaven Arts Night (@velvet.echo)\nApr 14 — phone off\nApr 15 — reported missing\nApr 16 — police: "no evidence of foul play"\n\nPriya (roommate): she was "waiting for something to end."\nShe told police the same week. Never published.' },
                { name: 'university_docs', type: 'folder', children: [
                  { name: 'SOC340_syllabus_spring.pdf', type: 'file', content: '[PDF Viewer] Sociology 340: Media & Society. Professor H. Vance. Mondays and Wednesdays, 10:00 AM. Final paper constitutes 40% of grade.' },
                  { name: 'tuition_receipt_winter.pdf', type: 'file', content: '[PDF Viewer] Millhaven University. Receipt of Payment. Amount: $4,200.\nStatus: PAID.' },
                  { name: 'thesis_draft_v3.docx', type: 'file', content: 'Title: The Erosion of Privacy in the Digital Panopticon.\n\nAbstract: This paper explores how participatory surveillance platforms reconstruct social norms around expected visibility...' },
                ]},
                { name: 'desktop_archive', type: 'folder', children: [
                  { name: 'IMG_4412.jpg', type: 'file', content: '[Image] Maya and a tabby cat sitting on a couch.' },
                  { name: 'IMG_4413.jpg', type: 'file', content: '[Image] Blurry photo of a coffee cup.' },
                  { name: 'amazon_return_label.pdf', type: 'file', content: '[PDF Viewer] UPS Return Label for "Wireless Ergonomic Mouse".' },
                  { name: 'recipe_lentil_soup.txt', type: 'file', content: '2 cups lentils\n4 cups vegetable broth\n1 onion, chopped\n2 carrots, diced\nSimmer for 45 mins.' },
                ]},
                { name: 'forum_screenshots', type: 'folder', children: [
                  { name: 'velvet_echo_profile.png', type: 'file', content: '[Screenshot — @velvet.echo forum profile, joined 14 months prior, 847 posts, last active April 13]' },
                  { name: 'thread_nov_missing.png', type: 'file', content: '[Screenshot — forum thread: "Still looking for Lena" — 23 replies, mostly concerned community members]' },
                ]},
                { name: 'suspect_research', type: 'folder', children: [
                  { name: 'c_marsh_crossref.txt', type: 'file', handwritten: false, content: 'COREY MARSH — PERSON OF INTEREST\nDec 10 – Jan 3\n\nLena\'s ex. Flagged as obsessive by "stillwater_m".\n\nHis Flickr has photos that look like her street.\nPull the EXIF. If he was outside her apartment, I call the police.' },
                  { name: 'username_scan_results_OLD.txt', type: 'file', content: 'USERNAME SCAN — c_marsh_pdx\nRun: Dec 10\n\nReddit: active · Twitter: active · Flickr: active\nPDXmissing forum: not registered\n\n—\nRun the same scan on stillwater_m.\nIf his Flickr is locked by then — Wayback Machine has the cached version.' },
                ]},
                { name: 'NOTES_DO_NOT_DELETE.txt', type: 'file', handwritten: true, content: 'The account pushing Corey is stillwater_m.\n\nHe knew her coffee shops. Her class schedule. Her roommate\'s name — before any of it was public.\n\nJoined the forum last May. One month after she vanished.\nThe concern sounds real. The knowledge is wrong.\n\nWho is he?\n\n——\nHis Twitter link in the forum bio leads nowhere. Account gone.' },
              ]},
              { name: 'photos', type: 'folder', children: [
                { name: 'us_christmas_2023.jpg', type: 'file', content: '[Photo — Christmas morning. Ray out of focus behind us, his hand on the back of Maya\'s chair.]\n\n"Ray\'s been at every Christmas I can remember. — M"' },
                { name: 'maya_bday_2024.jpg', type: 'file', content: '[Photo — Maya blowing out candles, birthday cake. Ray is leaning in from the right of the frame. He has a hand on Maya\'s shoulder.]' },
              ]},
            ],
          },
          idleNote: 'Her screen was still lit when I let myself in. Whatever she had open, she closed.',
          requiredFiles: ['c_marsh_crossref.txt', 'NOTES_DO_NOT_DELETE.txt'],
        },
        unlocks: ['A2', 'A4', 'A13'],
      },

      // A2 — Reddit: tag 4 relevant posts
      {
        id: 'A2',
        type: 'browse',
        path: 'A',
        title: "Reddit — u/stillwater_m Profile",
        tool: 'Reddit Profile Search',
        timestamp: { text: 'Maya\'s research — January', urgent: false },
        monologue: null,
        osintTip: {
          id: 'post-history',
          title: 'Post History Analysis',
          body: 'Consistent posting patterns across months or years reveal authentic behavior. Anomalies — sudden interest in a specific topic, location mentions that don\'t fit prior history, knowledge about a person that seems too specific — are red flags. Look at timestamps, not just content.',
          steps: [
            'Sort by "new" to see full timeline, not just top posts',
            'Note subreddits — do they match the user\'s claimed identity?',
            'Flag posts showing knowledge the user shouldn\'t have',
            'Cross-reference dates against known events in the case',
          ],
          tools: ['Pushshift API (historical Reddit data)', 'Reddit search: author:username', 'Camas Reddit Search'],
        },
        content: {
          prompt: 'Flag what he knows that was never made public',
          variant: 'reddit-profile',
          username: 'stillwater_m',
          joinDate: '10 months ago',
          karma: 4329,
          posts: [
            { id: 'sm-001', subreddit: 'r/PDXmissing', date: 'Mar 4', text: 'Almost a year. Still thinking about her family.', suspicious: false, wrongFeedback: 'Genuine condolence post. Nothing unusual about the content.' },
            { id: 'sm-002', subreddit: 'r/Portland', date: 'Feb 26', text: 'Cold but clear for cycling the waterfront today.', suspicious: false, wrongFeedback: 'Normal local activity post. No case relevance.' },
            { id: 'sm-003', subreddit: 'r/PDXmissing', date: 'Feb 22', text: 'Those Coava sightings — wasn\'t that near her Tuesday route?', suspicious: true, correctFeedback: "Her Tuesday route was never posted anywhere. He knew it anyway.", tagRequired: true },
            { id: 'sm-004', subreddit: 'r/classiccars', date: 'Feb 14', text: "Found original '67 Chevelle trim. Three months of searching.", suspicious: false, wrongFeedback: "A car post. Plenty of men restore old cars; it doesn't tie him to anything." },
            { id: 'sm-005', subreddit: 'r/PDXmissing', date: 'Feb 9', text: 'Has anyone looked harder at the ex? Corey Marsh. That\'s where I\'d look.', suspicious: false, wrongFeedback: "He's steering people at Corey. Note it — but this lead is about what he knows, not where he points." },
            { id: 'sm-021', subreddit: 'r/PDXmissing', date: 'Jan 28', text: 'Nobody asks why the organiser never released the guest list. Owen Pryce knows who was in that room.', suspicious: false, wrongFeedback: "Now he is pointing at the man who ran the evening. Twice he has pointed somewhere. Remember that — but this lead is about what he knows." },
            { id: 'sm-006', subreddit: 'r/photography', date: 'Feb 1', text: 'Shot this at the Millhaven Arts Night last spring. [photo]', suspicious: true, correctFeedback: "He was at the arts night. So was Lena. It is the last place anyone saw her.", tagRequired: true },
            { id: 'sm-007', subreddit: 'r/Portland', date: 'Jan 19', text: 'Parking on NW 23rd is brutal on Saturdays.', suspicious: false, wrongFeedback: 'Normal local frustration post.' },
            { id: 'sm-008', subreddit: 'r/PDXmissing', date: 'Jan 11', text: 'Careful what we post. Her class schedule should stay off-thread.', suspicious: true, correctFeedback: "He knows her class timetable. Then he asks to take it off the thread.", tagRequired: true },
            { id: 'sm-009', subreddit: 'r/homebrewing', date: 'Dec 30', text: 'Second batch of the pale ale came out much cleaner.', suspicious: false, wrongFeedback: 'Brewing hobby post. Consistent with prior content.' },
            { id: 'sm-010', subreddit: 'r/PDXmissing', date: 'Dec 14', text: 'Her roommate Priya said she was "waiting for something to end." That stayed with me.', suspicious: true, correctFeedback: "Nobody on this forum had posted Priya's name. He used it anyway.", tagRequired: true },
            { id: 'sm-011', subreddit: 'r/Millhaven', date: 'Dec 3', text: 'Good turnout at the winter arts night.', suspicious: false, wrongFeedback: 'Local community post. Could be any Millhaven resident.' },
            { id: 'sm-012', subreddit: 'r/PDXmissing', date: 'May 19', text: 'Just found this place. A month, no answers. Following from Millhaven, OR.', suspicious: false, wrongFeedback: 'His first post, a month after she vanished. Maya wrote that date down too. On its own it names nobody.' },
          ],
          requiredTagIds: ['sm-003', 'sm-006', 'sm-008', 'sm-010'],
          completionNote: "Two days of reading, for this: he knows things that were never public.",
        },
        unlocks: ['A3'],
      },

      // A3 — Input: platform scanner questions
      {
        id: 'A3',
        type: 'input',
        path: 'A',
        title: "Platform Presence Scanner — stillwater_m",
        tool: 'Username Scanner',
        timestamp: { text: 'Maya\'s research — late February', urgent: false },
        monologue: null,
        osintTip: {
          id: 'username-search',
          title: 'Cross-Platform Username Correlation',
          body: 'The same person often reuses usernames across platforms. A deleted account on one platform is itself evidence — it suggests the user became aware they were being investigated. Timing of deletions matters as much as presence.',
          steps: [
            'Search username directly on each platform',
            'Try variations: username_1, username.m, x_username',
            'Check Wayback Machine for deleted profiles',
            'Note which platforms show "account suspended" vs "account not found"',
          ],
          tools: ['Sherlock (username search tool)', 'WhatsMyName.app', 'Wayback Machine', 'social-searcher.com'],
          warning: 'Do not contact or alert the subject. Passive research only.',
        },
        content: {
          questions: [
            {
              prompt: "Maya ran a username scan on stillwater_m across six platforms. On one, the profile doesn't exist at all — not private, not suspended, just gone. Which platform?",
              contextNote: "Check NOTES_DO_NOT_DELETE.txt — Maya noted something about one of the linked accounts while she was building the profile.",
              acceptedAnswers: ['twitter', 'twitter.com', 'x.com', 'x'],
              wrongFeedback: "Maya noticed this in her own notes before running the formal scan.",
              hintFeedback: "In NOTES_DO_NOT_DELETE.txt: 'The link in the forum bio leads nowhere. Username search returns nothing.' She's talking about Twitter.",
            },
            {
              prompt: "The Flickr profile went private before Maya could access it. She recovered the photos anyway. What tool did she use?",
              contextNote: "Maya anticipated this might happen. She left herself a note about it in the earlier scan file.",
              acceptedAnswers: ['wayback', 'wayback machine', 'web.archive.org', 'archive.org', 'internet archive'],
              wrongFeedback: "Look at username_scan_results_OLD.txt — right at the bottom.",
              hintFeedback: "From Maya's note: 'Flickr may have gone private — check Wayback Machine for cached public versions before the profile was locked.'",
            },
          ],
          completionNote: "One account deleted. One locked. Both in the week after she started looking.",
        },
        unlocks: ['A6'],
      },

      // A4 — Map: plot stillwater_m's geotagged photos
      {
        id: 'A4',
        type: 'map',
        path: 'A',
        title: "Flickr — stillwater_m (Cached Archive)",
        tool: 'Flickr Archive · map',
        timestamp: { text: 'Maya\'s research — January', urgent: false },
        monologue: 'Every one of these pictures remembers where it was taken.',
        osintTip: {
          id: 'photo-geotag',
          title: 'Photo Geolocation & EXIF Data',
          body: 'Photos taken on smartphones embed GPS coordinates, device model, timestamp, and camera settings in EXIF metadata — even if the photographer doesn\'t realize it. Many platforms strip EXIF on upload, but cached versions of pages sometimes preserve the original files.',
          steps: [
            'Download the original image (right-click → Save Image As)',
            'Run through ExifTool or Jeffrey\'s Exif Viewer',
            'Look for GPS coordinates, device info, and exact timestamp',
            'Plot the coordinates on a map and see what is nearby',
          ],
          tools: ['ExifTool (command line)', 'Jeffrey\'s Exif Viewer (web)', 'Google Maps (coordinate lookup)', 'Pic2Map'],
        },
        content: {
          prompt: 'Put his April photographs where they were taken',
          photos: [
            { id: 'f-001', filename: 'trail_morning_01.jpg', lat: 45.5530, lon: -122.7470, taken: 'Mar 3 · 7:14am', answer: 'forestpark', pinLabel: 'Mar 3', correctFeedback: 'Forest Park, a Sunday in March. A man who likes a walk. Nothing more.', wrongFeedback: 'Not there. Latitude runs across the sheet; longitude runs down it.' },
            { id: 'f-002', filename: 'river_dusk_07.jpg', lat: 45.5238, lon: -122.6713, taken: 'Apr 12 · 7:52pm', answer: 'waterfront', required: true, pinLabel: 'Apr 12', correctFeedback: 'The waterfront, the night before she vanished. Look what is two streets away from it.', wrongFeedback: 'Not there. Follow the latitude line across first, then the longitude down.' },
            { id: 'f-003', filename: 'fog_hills_02.jpg', lat: 45.4912, lon: -122.8801, taken: 'Jan 18 · 9:02am', answer: 'beaverton', pinLabel: 'Jan 18', correctFeedback: 'The hills west of the city, in January. No bearing on April.', wrongFeedback: 'Not there. Check which side of the river that longitude falls.' },
            { id: 'f-004', filename: 'arts_night_exterior.jpg', lat: 44.9147, lon: -122.9931, taken: 'Apr 13 · 6:38pm', answer: 'venue', required: true, pinLabel: '6:38pm', correctFeedback: 'The Alder Hall, 6:38pm on the 13th. Outside, before the doors opened.', wrongFeedback: 'Not that door. On a street this small, every decimal place counts.' },
            { id: 'f-005', filename: 'main_st_dusk.jpg', lat: 44.9140, lon: -122.9928, taken: 'Dec 3 · 5:17pm', answer: 'mainst', pinLabel: 'Dec 3', correctFeedback: 'Main Street in December. He lives there. That alone proves nothing.', wrongFeedback: 'Not that door. Every decimal place counts here.' },
            { id: 'f-006', filename: 'arts_night_hall.jpg', lat: 44.9147, lon: -122.9931, taken: 'Apr 13 · 8:11pm', answer: 'venue', required: true, pinLabel: '8:11pm', correctFeedback: 'Inside the same building at 8:11pm. Lena was there that evening. So was he.', wrongFeedback: 'Not there. Compare these numbers with the photographs you have already placed.' },
            { id: 'f-007', filename: 'homebrewing_club.jpg', lat: 44.9138, lon: -122.9919, taken: 'Feb 22 · 7:43pm', answer: 'taproom', pinLabel: 'Feb 22', correctFeedback: 'The Tap Room in February. A brewing club. Ordinary.', wrongFeedback: 'Not that door. Read the longitude again.' },
          ],
          sheets: [
            { id: 'pdx', label: 'Portland', lat: [45.48, 45.57], lon: [-122.90, -122.65], tick: { lat: 0.02, lon: 0.05, dp: 2 }, river: 'M 96 0 C 92 25, 95 45, 89 62 S 84 90, 90 100' },
            { id: 'mh', label: 'Millhaven · 40 miles south', lat: [44.9133, 44.9152], lon: [-122.9940, -122.9912], tick: { lat: 0.0005, lon: 0.0005, dp: 4 } },
          ],
          places: [
            { id: 'forestpark', sheet: 'pdx', lat: 45.5530, lon: -122.7470, label: 'Forest Park' },
            { id: 'beaverton', sheet: 'pdx', lat: 45.4912, lon: -122.8801, label: 'Tualatin Hills' },
            { id: 'waterfront', sheet: 'pdx', lat: 45.5238, lon: -122.6713, label: 'Waterfront' },
            { id: 'pdx-x1', sheet: 'pdx', lat: 45.5105, lon: -122.7790, label: 'Hillside' },
            { id: 'pdx-x2', sheet: 'pdx', lat: 45.5460, lon: -122.6960, label: 'Rail yard' },
            { id: 'venue', sheet: 'mh', lat: 44.9147, lon: -122.9931, label: 'Alder Hall' },
            { id: 'mainst', sheet: 'mh', lat: 44.9140, lon: -122.9928, label: 'Main St' },
            { id: 'taproom', sheet: 'mh', lat: 44.9138, lon: -122.9919, label: 'The Tap Room' },
            { id: 'mh-x1', sheet: 'mh', lat: 44.9149, lon: -122.9921, label: 'Church hall' },
            { id: 'mh-x2', sheet: 'mh', lat: 44.9136, lon: -122.9934, label: 'Car park' },
          ],
          landmarks: [
            { id: 'lenaflat', sheet: 'pdx', lat: 45.5335, lon: -122.6790, label: "Lena's flat" },
          ],
          completionNote: "The night before, and the night itself. He stood on the waterfront two streets from her flat. The next evening he was inside the building she never came out of.",
        },
        unlocks: [],
      },


      // A6 — Tag: archived tweets (no highlighting)
      // A6 — Diff: the same profile, twice, five weeks apart. A fourth
      // "flag the suspicious line" became a question with an objective
      // answer: what is missing from the second capture?
      {
        id: 'A6',
        type: 'diff',
        path: 'A',
        title: "Twitter Archive — stillwater_m, Two Captures",
        tool: 'Wayback Machine',
        timestamp: { text: 'Maya\'s research — February', urgent: false },
        monologue: "The archive took a copy in September and another in November. She put them side by side.",
        osintTip: {
          id: 'wayback-diff',
          title: 'Reading an Archive Against Itself',
          body: 'A single archived page tells you what was there. Two captures of the same page tell you what somebody removed, and roughly when. Deletions are rarely random: people take down the things that connect them to something. The gap between two captures is often the most informative part of an account.',
          steps: [
            'Pull the capture list for the profile, not just the latest snapshot',
            'Open two captures either side of the date something changed',
            'Compare them line by line — bios and pinned posts matter as much as posts',
            'Note what is gone, and what was happening the week it went',
          ],
          tools: ['Wayback Machine (web.archive.org)', 'archive.today', 'Wayback Machine diff view', 'Google cache'],
        },
        content: {
          prompt: 'Four things are different. Mark them',
          hint: 'Read one column against the other. Three things are gone and one is new.',
          before: {
            id: 'before', label: '@stillwater_m', when: 'Captured 2 September',
            lines: [
              { id: 'b-bio', meta: 'bio', text: 'Photographer · Millhaven, OR · Stillwater Media', change: 'bio' },
              { id: 'b-1', meta: 'Feb 16', text: 'If anyone asks why I follow that forum — I just care. That\'s allowed.' },
              { id: 'b-2', meta: 'Jan 7', text: 'Happy new year. Quiet one. Me and the cat.' },
              { id: 'b-3', meta: 'Dec 12', text: 'Seven months on the PDXmissing forum. Good people.' },
              { id: 'b-4', meta: 'Nov 3', text: 'stillwater-media.net is finally live. Portfolio for now.', change: 'domain' },
              { id: 'b-5', meta: 'May 3', text: 'Good morning from Millhaven. Coffee, hills, not bad.' },
              { id: 'b-6', meta: 'Apr 30', text: 'Nice Oregonian piece on the Millhaven Arts Collective. Proud of that lot.' },
              { id: 'b-7', meta: 'Apr 13', text: 'Arts night tonight. Working it — come and say hello.', change: 'artsnight' },
            ],
          },
          after: {
            id: 'after', label: '@stillwater_m', when: 'Captured 14 November',
            lines: [
              { id: 'a-bio', meta: 'bio', text: 'Photographer · Pacific Northwest', change: 'bio' },
              { id: 'a-new', meta: 'Oct 20', text: 'Website work is slow going.', change: 'new' },
              { id: 'a-1', meta: 'Feb 16', text: 'If anyone asks why I follow that forum — I just care. That\'s allowed.' },
              { id: 'a-2', meta: 'Jan 7', text: 'Happy new year. Quiet one. Me and the cat.' },
              { id: 'a-3', meta: 'Dec 12', text: 'Seven months on the PDXmissing forum. Good people.' },
              { id: 'a-5', meta: 'May 3', text: 'Good morning from Millhaven. Coffee, hills, not bad.' },
              { id: 'a-6', meta: 'Apr 30', text: 'Nice Oregonian piece on the Millhaven Arts Collective. Proud of that lot.' },
            ],
          },
          changes: [
            { id: 'artsnight', feedback: "Gone. In September he was telling people he worked the arts night; by November that sentence had been taken off the internet. It is the one post that put him in the building." },
            { id: 'domain', feedback: "Gone too — the post where he announced the website. He kept the site and deleted the line that tied this account to it." },
            { id: 'bio', feedback: "The bio lost a town and a company: Millhaven and Stillwater Media, both removed. What is left could be anybody with a camera." },
            { id: 'new', feedback: "New since September, and it says nothing. It is the three things missing that matter, not the one thing added." },
          ],
          completionNote: "Three deletions and a shrug. He took down the arts night, the website and his own town — in the weeks my daughter started asking questions on that forum.",
        },
        unlocks: ['A7', 'A9'],
      },

      // A7 — Read: Maya explains how she verified Twitter identity
      {
        id: 'A7',
        type: 'tag',
        path: 'A',
        title: "WHOIS Lookup — stillwater-media.net",
        tool: 'WHOIS',
        timestamp: { text: 'Maya\'s research — January 22', urgent: false },
        monologue: "She ran the lookup. This is what came back.",
        osintTip: {
          id: 'whois',
          title: 'WHOIS Records',
          body: 'Registering a domain means handing a registrar your name, address, email and phone. By default that goes into the public WHOIS record. Privacy protection hides it behind the registrar\'s details — but it costs money, and plenty of people never switch it on. When it is off, a domain is a name and an address.',
          steps: [
            'Check the privacy status first — it tells you whether anything below is real',
            'Registrant name, organization and address are the identifying fields',
            'Registrar, nameservers and dates describe the purchase, not the person',
            'Cross-check the address against business registries and court filings',
          ],
          tools: ['whois (command line)', 'ICANN Lookup', 'DomainTools', 'ViewDNS.info'],
        },
        content: {
          prompt: 'Flag what this record actually gives you',
          items: [
            { id: 'wh-registrar', text: 'Registrar: NameCheap, Inc.', wrongFeedback: 'Where the domain was bought. Not who bought it.' },
            { id: 'wh-created', text: 'Created: 28 October, five years ago · Expires: 28 October (auto-renew)', wrongFeedback: 'Dates of purchase. They tell me when, not who.' },
            { id: 'wh-privacy', text: 'Privacy protection: ENABLED — Registrant details withheld by Domains By Proxy, LLC', suspicious: true, tagRequired: true, correctFeedback: 'A shield. Paid for, and hiding whoever is behind it.' },
            { id: 'wh-updated', text: 'Record last updated: 14 November — five days after Maya\'s first message to the forum', suspicious: true, tagRequired: true, correctFeedback: 'He put the shield up five days after my daughter started asking questions. It was open before that. Somewhere there will be a copy of it open.' },
            { id: 'wh-name', text: 'Registrant Name: REDACTED FOR PRIVACY', wrongFeedback: 'Redacted. That is the shield doing its job.' },
            { id: 'wh-org', text: 'Registrant Organization: Stillwater Media', suspicious: true, tagRequired: true, correctFeedback: 'The organisation field was left in. A company. Companies file paperwork, and paperwork keeps.' },
            { id: 'wh-address', text: 'Registrant Address: PO Box 441, Millhaven, OR 97411', suspicious: true, tagRequired: true, correctFeedback: 'A PO box in Millhaven — the town Lena was last seen in, forty miles south of here. The shield covered the man and left his postbox showing.' },
            { id: 'wh-ns', text: 'Name servers: dns1.namecheaphosting.com, dns2.namecheaphosting.com', wrongFeedback: 'Plumbing. Every domain on that host has these.' },
            { id: 'wh-status', text: 'Status: clientTransferProhibited', wrongFeedback: 'A registrar lock. It is on almost every domain.' },
          ],
          requiredTags: ['wh-privacy', 'wh-updated', 'wh-org', 'wh-address'],
          wrongTagLimit: 3,
          completionNote: "A company, a postbox, and a shield that went up five days after she started asking. He is hiding. That is not nothing.",
        },
        unlocks: ['A8'],
      },

      // A8 — Input: WHOIS / domain verification
      {
        id: 'A8',
        type: 'input',
        path: 'A',
        title: "WHOIS Cross-Reference",
        tool: 'WHOIS Lookup',
        timestamp: { text: 'Maya\'s research — February 1', urgent: false },
        monologue: null,
        content: {
          questions: [
            {
              prompt: 'The registrar and the newspaper both name the same business. Which business?',
              contextNote: 'Two records, one name in common.',
              acceptedAnswers: ['stillwater media', 'stillwater media llc', 'stillwater'],
              wrongFeedback: 'Look at the Registrant Organization line in the WHOIS results — the shield left that one showing — and at the photo credit in the Courier.',
            },
            {
              prompt: 'What was he doing at the arts night, the evening Lena disappeared?',
              contextNote: 'He had a reason to be in every room that night.',
              acceptedAnswers: ['photographer', 'photography', 'event photographer', 'event photography'],
              wrongFeedback: "Check the Millhaven Courier article from the arts night — look at the photography credit.",
            },
          ],
          completionNote: "Nothing behind the collective's own domain. The credit printed in the paper is the part that holds.",
        },
        requiresCompleted: { path: 'C', nodeId: 'C4', hint: 'Find the newspaper archive in Thread C first — the arts night coverage is what confirms his name.' },
        unlocks: ['A11'],
      },

      // A9 — Browse: Twitter follow list — find stillwater_m follow of nightwatch_rc
      {
        id: 'A9',
        type: 'browse',
        path: 'A',
        title: "stillwater_m — Following List (Cached)",
        tool: 'Twitter Archive',
        timestamp: { text: 'Maya\'s research — January', urgent: false },
        monologue: null,
        content: {
          variant: 'reddit-profile',
          username: 'stillwater_m — Following (47)',
          joinDate: null,
          karma: null,
          posts: [
            { id: 'f-001', subreddit: '@PDXmissing_news', text: 'Local missing persons news aggregator. Millhaven and Portland area.', date: null, wrongFeedback: 'Expected follow for someone engaged with the missing persons community.' },
            { id: 'f-002', subreddit: '@OregonianNews', text: 'The Oregonian — Portland\'s daily newspaper.', date: null, wrongFeedback: 'Major regional news account. No case relevance.' },
            { id: 'f-003', subreddit: '@velvet_echo_fan', text: 'Unofficial fan account for @velvet.echo — art, updates, photography. Not affiliated.', date: null, suspicious: false, wrongFeedback: "A fan account for Lena's work. It existed long before she vanished." },
            { id: 'f-004', subreddit: '@millhaven_arts', text: 'Millhaven Arts Collective — events, exhibitions, community news.', date: null, wrongFeedback: 'Arts community account. Consistent with claimed background.' },
            { id: 'f-005', subreddit: '@nightwatch_rc', text: 'Personal account. Photography, Pacific Northwest. Quiet here.', date: null, suspicious: true, correctFeedback: 'nightwatch_rc. Two initials and nothing else — no name, no posts, no picture. An account kept for watching, not for talking.', tagRequired: true },
            { id: 'f-006', subreddit: '@stillwater_media', text: 'Stillwater Media — Pacific Northwest photography and documentary work. Portfolio: stillwater-media.net', date: null, suspicious: true, correctFeedback: 'And the business account. Whoever this is, he follows his own company.', tagRequired: true },
            { id: 'f-007', subreddit: '@c_marsh_pdx', text: 'Corey Marsh — cars, Portland, Pacific Northwest.', date: null, wrongFeedback: 'He follows Corey Marsh — he knew exactly who to point everyone at.' },
            { id: 'f-008', subreddit: '@rvelasquez_reporter', text: 'Rosa Velasquez — Pacific Reporter. Covering digital safety, online harm, missing persons.', date: null, wrongFeedback: 'A journalist on the missing persons beat. Worth remembering, not suspicious.' },
            { id: 'f-009', subreddit: '@OregonStateRecords', text: 'Oregon Secretary of State — business registry, court records, elections.', date: null, wrongFeedback: 'Public records agency account. Could indicate familiarity with records research.' },
          ],
          requiredTagIds: ['f-005', 'f-006'],
          completionNote: "Two accounts that lead back to the same man: his own company, and a silent one with two initials on it.",
        },
        unlocks: [],
      },


      // A11 — Connect: Final confirmation
      {
        id: 'A11',
        type: 'connect',
        path: 'A',
        title: "Cross-Reference — Evidence Assembly",
        tool: 'Link Analysis',
        timestamp: { text: 'now — Maya\'s apartment', urgent: true },
        monologue: "She laid them out side by side. I have to see what she saw.",
        content: {
          cards: [
            { id: 'whois', label: 'Domain WHOIS', details: 'Shielded since November. Organisation: Stillwater Media. PO Box 441, Millhaven' },
            { id: 'twitter_rc', label: '@nightwatch_rc', details: 'Second Twitter account, follows stillwater_m. Two initials and nothing else' },
            { id: 'business', label: 'Stillwater Media', details: 'The organisation left showing on the registration' },
            { id: 'forum', label: 'stillwater_m', details: 'Forum account with unreleased private knowledge' },
            { id: 'corey', label: 'c_marsh_pdx', details: 'Corey Marsh\'s Flickr — photos from an auto body shop in Tigard' },
          ],
          requiredConnections: [
            { from: 'forum', to: 'whois', label: 'The handle and the domain are the same words' },
            { from: 'whois', to: 'business', label: 'The registration names the business' },
            { from: 'business', to: 'twitter_rc', label: 'A business, and a second account keeping watch on it' },
          ],
          wrongFeedback: 'Look for shared names, initials, or ownership records.',
          completionNote: "A handle, a website, a company and a postbox — all one person, and not one of them a name. Whoever he is, he covered himself in November. Records that old do not disappear, though. Somebody keeps copies.",
        },
        unlocks: ['A12'],
      },


      // A12 — Browse: the WHOIS record as it stood before the shield went up.
      // This is where Thread A finally puts a surname to the handle.
      {
        id: 'A12',
        type: 'browse',
        path: 'A',
        title: "WHOIS History — stillwater-media.net",
        tool: 'WHOIS History',
        timestamp: { text: 'now — Maya\'s apartment', urgent: true },
        monologue: "He shielded it in November. Somebody took a copy in September.",
        osintTip: {
          id: 'whois-history',
          title: 'Historic WHOIS',
          body: 'Privacy protection only hides a record from today onwards. Several services keep dated snapshots of what a domain\'s registration said in the past, and archives of registration data outlive the moment someone decides to hide. If a record is redacted now, look for what it said before.',
          steps: [
            'Look up the domain in a WHOIS history service',
            'Compare each snapshot — note the date the details were withheld',
            'Take the registrant name and address from the last open snapshot',
            'Confirm the name against a second, independent record',
          ],
          tools: ['WhoisFreaks / WhoISrequest history', 'DomainTools Whois History', 'SecurityTrails', 'Wayback Machine (registrar pages)'],
        },
        content: {
          variant: 'records',
          systemName: 'Registration history — stillwater-media.net',
          prompt: 'Open the snapshots. Flag what the shield was covering',
          records: [
            { title: 'Snapshot — 2 September (before the shield)', summary: 'Registrant details public', fields: { 'Captured': '2 September', 'Privacy': 'Not enabled', 'Registrant Name': 'R. Callahan', 'Registrant Organization': 'Stillwater Media', 'Registrant Address': 'PO Box 441, Millhaven, OR 97411' }, body: null, taggable: [
              { id: 'wx-01', text: 'Registrant Name: R. Callahan', suspicious: true, revealsName: true, correctFeedback: "The registration as it stood before he hid it, with a name on it." },
              { id: 'wx-02', text: 'Registrant Address: PO Box 441, Millhaven, OR 97411', suspicious: true, correctFeedback: "The same postbox the shielded record still shows. Same man, before and after." },
              { id: 'wx-03', text: 'Captured 2 September', suspicious: false, wrongFeedback: 'The date of the copy. It matters that it exists, not when it was taken.' },
            ]},
            { title: 'Snapshot — 14 November (after the shield)', summary: 'Registrant details withheld', fields: { 'Captured': '14 November', 'Privacy': 'Enabled — Domains By Proxy, LLC', 'Registrant Name': 'REDACTED FOR PRIVACY', 'Registrant Organization': 'Stillwater Media', 'Registrant Address': 'PO Box 441, Millhaven, OR 97411' }, body: null, taggable: [
              { id: 'wx-04', text: 'Privacy enabled 14 November — five days after Maya\'s first forum message', suspicious: true, correctFeedback: "He hid his name five days after she started asking. He was watching her do it." },
            ]},
          ],
          requiredTagIds: ['wx-01', 'wx-02', 'wx-04'],
          completionNote: "R. Callahan, PO Box 441. And he covered it five days after my daughter asked her first question.",
        },
        unlocks: [],
      },

      // A13 — Timeline: Corey Marsh's photos across both nights (red herring)
      {
        id: 'A13',
        type: 'timeline',
        path: 'A',
        title: "Flickr — c_marsh_pdx",
        tool: 'Flickr Archive · timeline',
        timestamp: { text: 'Maya\'s research — January', urgent: false },
        monologue: 'The forum spent a year on the ex-boyfriend. His camera kept better time than they did.',
        osintTip: null,
        content: {
          prompt: 'Put each photograph on the hour it was really taken',
          note: 'Flickr lists when a photo was uploaded, not when it was taken. The camera wrote its own time into the EXIF, in UTC. Portland in April is seven hours behind UTC.',
          photos: [
            { id: 'cm-001', filename: 'chevelle_primer_01.jpg', where: 'Auto body shop, Tigard', uploaded: 'Apr 13 · 9:12am', exif: '2024:04:13 02:54 UTC', day: 'd12', hour: 19.9, required: true,
              correctFeedback: 'Seven fifty-four on Friday evening, at the shop in Tigard. Across the city from the waterfront.',
              wrongFeedback: 'Not that hour. Take seven hours off the camera\'s clock — and watch the date roll back.',
              traps: [
                { day: 'd13', hour: 9, feedback: 'That\'s when he uploaded it, the next morning. The camera\'s clock says when it was taken.' },
                { day: 'd13', hour: 2, feedback: 'That\'s the camera\'s clock, still in UTC. Portland is seven hours behind — which puts it on the Friday.' },
              ] },
            { id: 'cm-002', filename: 'late_shift_apr12.jpg', where: 'Auto body shop, Tigard', uploaded: 'Apr 13 · 9:14am', exif: '2024:04:13 06:38 UTC', day: 'd12', hour: 23.6, required: true,
              correctFeedback: 'Eleven thirty-eight on Friday night, still at the shop. Somebody was on Lena\'s street that night. It was not him.',
              wrongFeedback: 'Not that hour. Seven hours back from the camera\'s clock.',
              traps: [
                { day: 'd13', hour: 9, feedback: 'That\'s the upload, the next morning. Use the camera\'s time.' },
                { day: 'd13', hour: 6, feedback: 'Still UTC. Take seven hours off — it lands late on the Friday.' },
              ] },
            { id: 'cm-003', filename: 'paint_booth_apr13.jpg', where: 'Auto body shop, Tigard', uploaded: 'Apr 14 · 10:02am', exif: '2024:04:14 04:40 UTC', day: 'd13', hour: 21.7, required: true,
              correctFeedback: 'Twenty to ten on Saturday night, in the paint booth. The arts night was forty miles south.',
              wrongFeedback: 'Not that hour. The EXIF date is the 14th in UTC. Seven hours back is still Saturday.',
              traps: [
                { day: 'd13', hour: 4, feedback: 'That\'s UTC with the date ignored. Seven hours back from 4:40am on the 14th is Saturday night.' },
              ] },
          ],
          days: [
            { id: 'd12', label: 'Friday, April 12' },
            { id: 'd13', label: 'Saturday, April 13' },
          ],
          windows: [
            { day: 'd12', from: 19, to: 24, label: 'Someone photographs Lena\'s street, Portland' },
            { day: 'd13', from: 19, to: 22, label: 'The arts night, Millhaven' },
          ],
          completionNote: "Both nights, the same shop in Tigard, miles from either place. Corey Marsh was never the man.",
        },
        unlocks: [],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PATH B — THE PRIVATE NOTES
  // Entry object: a burned journal. Partially destroyed — player recovers
  // pages using brightness/contrast sliders. Ends with the full email reveal.
  // ══════════════════════════════════════════════════════════════════════════
  B: {
    label: 'Thread B — The Private Notes',
    object: 'notebook',
    nodes: [

      // B1 — Slider: pages 1-3
      {
        id: 'B1',
        type: 'slider',
        path: 'B',
        title: "Burned Notebook — Pages 1–3",
        tool: 'Document Recovery',
        timestamp: { text: 'November — the beginning', urgent: false },
        monologue: "Someone tried to burn it. They didn't get all of it.",
        osintTip: {
          id: 'document-recovery',
          title: 'Physical Document Recovery',
          body: 'Partially burned or damaged documents can be recovered using contrast enhancement and infrared imaging. Digital photos of damaged pages run through brightness/contrast filters can reveal ink that\'s invisible to the naked eye. Forensic labs use multispectral imaging for more complete recovery.',
          steps: [
            'Photograph the damaged document under controlled lighting',
            'Adjust brightness to maximum to reveal dark-on-dark text',
            'Increase contrast to separate ink from char',
            'Try infrared photography if available — ink absorbs IR differently than paper',
          ],
          tools: ['GIMP (brightness/contrast curves)', 'ImageJ (scientific imaging)', 'Adobe Camera Raw', 'Forensic imaging labs'],
        },
        content: {
          pages: [
            {
              id: 'b-p1',
              date: 'November — early',
              text: 'I found the forum through a Reddit thread. @velvet.echo — she went by that name. Lena Vasquez. 29 years old. Missing since April.\n\nThe police file says "no evidence of foul play." The community disagrees. I disagree.\n\nI\'m going to look into this properly.',
              targetBrightness: 145,
              targetContrast: 170,
              tolerance: 30,
            },
            {
              id: 'b-p2',
              date: 'November — later',
              text: 'The forum has hundreds of members. Most are well-meaning but scattered. A few are organized.\n\nOne account keeps coming up: stillwater_m. Joined one month after Lena disappeared. Claims to be from Millhaven.\n\nHe knows things about Lena that I can\'t find anywhere in public posts. Her schedule. Her routine. I don\'t know how.\n\nI\'m going to read every post he\'s ever made.',
              targetBrightness: 135,
              targetContrast: 180,
              tolerance: 28,
            },
            {
              id: 'b-p3',
              date: 'December',
              text: 'Six months of posts from stillwater_m. I\'ve read every one.\n\nHe\'s not a concerned community member. He\'s performing concern. The information is wrong in the wrong places — too specific about private details, deliberately vague about things any genuine follower would know.\n\nI need to find who he is. I\'m going to start with the forum itself.',
              targetBrightness: 150,
              targetContrast: 165,
              tolerance: 32,
            },
          ],
        },
        unlocks: ['B2'],
      },

      // B2 — Browse: forum archive — find 23 stillwater_m posts
      {
        id: 'B2',
        type: 'browse',
        path: 'B',
        title: "PDXmissing Forum — Full Archive",
        tool: 'Forum Archive',
        timestamp: { text: 'December into January', urgent: false },
        monologue: "She read the forum the way I used to read case files. Everything. Every post.",
        osintTip: {
          id: 'forum-archive',
          title: 'Forum & Community Archive Research',
          body: 'Online forums often have public archives accessible through web crawlers. Forum posts reveal patterns of behavior — when a user is online, what they respond to, what they ignore, and how their tone changes over time. Cross-referencing forum activity timestamps against real-world events is a standard OSINT technique.',
          steps: [
            'Search forum usernames with site: operator on Google',
            'Use Wayback Machine for older archived threads',
            'Filter by username to see isolated post history',
            'Map post timestamps against case timeline',
          ],
          tools: ['Google: site:forum.com "username"', 'Wayback Machine', 'Forum-specific search', 'OSINT Framework'],
        },
        content: {
          prompt: 'Flag where he steers the thread toward Corey',
          variant: 'forum',
          forumName: 'PDXmissing — Lena Vasquez thread',
          posts: [
            { id: 'fp-01', username: 'stillwater_m', threadTitle: 'General Discussion', date: 'Dec 2', text: 'Police dropped the ball here. Her people deserve answers.', wrongFeedback: 'Generic community sympathy post. Not specific enough to flag.' },
            { id: 'fp-02', username: 'worried_mom_pdx', threadTitle: 'General Discussion', date: 'Dec 4', text: 'Has anyone tried her university? They\'d have records.', wrongFeedback: "Another community member's post. Not relevant." },
            { id: 'fp-03', username: 'stillwater_m', threadTitle: 'Person of Interest Discussion', date: 'Dec 8', text: 'The ex deserves more attention. Corey Marsh. I\'ve seen things online.', suspicious: true, correctFeedback: "The first time anyone says Corey's name, it's him saying it. Nobody had suspected anyone yet.", tagRequired: true },
            { id: 'fp-04', username: 'PDXtruth99', threadTitle: 'Evidence & Sightings', date: 'Dec 11', text: 'Anyone have photos from the arts night?', wrongFeedback: 'Other forum user asking about photos. Not stillwater_m.' },
            { id: 'fp-05', username: 'stillwater_m', threadTitle: 'Evidence & Sightings', date: 'Dec 15', text: 'I know that building. Happy to help identify faces.', suspicious: true, correctFeedback: 'He offers to put names to faces from that night. How does a stranger know the room that well?', tagRequired: true },
            { id: 'fp-06', username: 'lena_knew_her', threadTitle: 'General Discussion', date: 'Dec 19', text: 'I took a class with her. Quiet. Made this dark ceramic piece I still think about.', wrongFeedback: "Personal memory from a classmate. Not stillwater_m." },
            { id: 'fp-07', username: 'stillwater_m', threadTitle: 'Person of Interest Discussion', date: 'Dec 22', text: 'Corey Marsh\'s Flickr has location data near her neighborhood. Someone should look.', suspicious: true, correctFeedback: "He points everyone at Corey's photographs. He'd have opened them himself. He knows they're pictures of a garage.", tagRequired: true },
            { id: 'fp-08', username: 'PortlandMom412', threadTitle: 'General Discussion', date: 'Dec 27', text: 'Praying for her family. Not at the holidays.', wrongFeedback: 'Holiday sympathy post from another user.' },
            { id: 'fp-09', username: 'stillwater_m', threadTitle: 'Evidence & Sightings', date: 'Jan 4', text: 'Someone told me she had a Tuesday routine — coffee on Burnside before class. Worth checking?', suspicious: true, correctFeedback: "The Tuesday route again. \"Someone told me,\" he says. Nobody posted it. So who told him?", tagRequired: true },
            { id: 'fp-10', username: 'missing_justice_pdx', threadTitle: 'Person of Interest Discussion', date: 'Jan 9', text: 'Keep it to facts. No naming people without evidence.', wrongFeedback: 'Moderating post from another user.' },
            { id: 'fp-11', username: 'stillwater_m', threadTitle: 'Person of Interest Discussion', date: 'Jan 11', text: 'I have screenshots of Corey\'s behavior, if the mods want them.', suspicious: true, correctFeedback: 'More proof against Corey, handed over free. Maya checked it. None of it held.', tagRequired: true },
            { id: 'fp-12', username: 'velvet_watcher', threadTitle: 'Lena Before She Disappeared', date: 'Jan 16', text: 'She posted normally right up to that last arts night photo.', wrongFeedback: 'Community observation from another user.' },
            { id: 'fp-13', username: 'stillwater_m', threadTitle: 'General Discussion', date: 'Jan 20', text: 'Strange to say, but I feel like I knew her. She had a real voice.', suspicious: false, wrongFeedback: "Parasocial attachment. Unsettling, but plenty of followers talk like this." },
          ],
          requiredTagIds: ['fp-03', 'fp-05', 'fp-07', 'fp-09', 'fp-11'],
          completionNote: "Five posts. Three push me toward Corey. Two give away things that were never in the papers. She underlined every one in red.",
        },
        unlocks: ['B4'],
      },


      // B4 — Tag: 3 posts showing insider knowledge (subtle)
      // B4 — Compare: his posts against the statement he should never have read.
      // This was a fourth "flag the row" lead; the evidence is a match between
      // two documents, so the lead is now the matching.
      {
        id: 'B4',
        type: 'compare',
        path: 'B',
        title: "Forum Posts — Against Priya's Statement",
        tool: 'Cross-reference',
        timestamp: { text: 'February — Maya refining her research', urgent: false },
        monologue: "She had the statement Priya gave the police. It was never released. She put it beside his posts.",
        content: {
          prompt: 'Link what he wrote to what only the police had',
          left: {
            title: 'stillwater_m · the deep archive',
            items: [
              { id: 'dp-01', label: 'Nov 20', text: 'Police response has been inadequate from day one.' },
              { id: 'dp-03', label: 'Dec 6', text: "The roommate's name is Priya, right? Has she been interviewed properly?" },
              { id: 'dp-04', label: 'Dec 14', text: 'That venue matters more than people think. Good space, a lot of exits.' },
              { id: 'dp-06', label: 'Jan 19', text: 'She\'d been anxious for weeks. "Waiting for something to end" — that keeps coming up.' },
              { id: 'dp-07', label: 'Feb 3', text: 'Corey Marsh is still my main focus.' },
            ],
          },
          right: {
            title: 'Millhaven PD · witness statement, sealed',
            kicker: 'P. Raman, taken 16 April. Not released to press.',
            items: [
              { id: 'st-name', label: 'Deponent', text: 'Priya Raman, flatmate. Name withheld from all public releases.' },
              { id: 'st-words', label: 'In her words', text: '"She\'d been waiting for something to end. That\'s how she put it."' },
              { id: 'st-exits', label: 'Officer\'s note', text: 'Venue walk-through: two fire exits and a private stair off the east gallery.' },
              { id: 'st-press', label: 'Released publicly', text: 'The university, the date, and the appeal for witnesses. Nothing else.' },
            ],
          },
          pairs: [
            { left: 'dp-03', right: 'st-name', required: true, feedback: "He used her flatmate's name in December. It was in this statement and nowhere else. Not in a paper, not on the forum." },
            { left: 'dp-06', right: 'st-words', required: true, feedback: 'Word for word out of a sealed interview. Reading a case does not give you a sentence nobody printed.' },
            { left: 'dp-04', right: 'st-exits', feedback: 'He knows the exits the officer had to be walked round. You learn that working a room.' },
            { left: 'dp-01', right: 'st-press', feedback: 'Everyone complained about the police. That much was public.' },
          ],
          wrongFeedback: 'Those two do not say the same thing.',
          completionNote: "He had her flatmate's name and her exact words months before anyone printed either. He did not read this case. He was inside it.",
        },
        unlocks: ['B5'],
        systemAlertAfter: true,
      },

      // B5 — Input: pattern analysis
      {
        id: 'B5',
        type: 'input',
        path: 'B',
        title: "Pattern Analysis — stillwater_m Knowledge Sources",
        tool: 'Analysis',
        timestamp: { text: 'February', urgent: false },
        monologue: null,
        content: {
          questions: [
            {
              prompt: "The phrase 'waiting for something to end' appears on the forum. Which document did it originally come from?",
              contextNote: "It wasn't in any news article. Re-read the flagged posts — Maya noted where the exact words were recorded.",
              acceptedAnswers: ['police report', 'police interview', 'police file', 'priyas interview', 'priya interview', 'interview', 'police statement', 'statement'],
              wrongFeedback: "Think about who first said it, and who wrote it down. It was never public.",
              hintFeedback: "Priya said it to the police. It came from her police interview.",
            },
            {
              prompt: "stillwater_m. stillwater-media.net. Where did he get that word?",
              acceptedAnswers: ['company', 'business', 'his company', 'stillwater media', 'the business', 'firm', 'his business', 'company name', 'old company', 'dissolved company'],
              wrongFeedback: "It isn't a lake or a mood. Maya found the same word filed with the state.",
              hintFeedback: "Stillwater Media — the company on the registration. He posts under the name he files paperwork under.",
            },
          ],
          completionNote: "Priya said it to the police. He said it on a forum. Maya put the two in the margin and drew a line between them. I know what the line means.",
        },
        requiresCompleted: { path: 'C', nodeId: 'C5', hint: 'Pull the business registry in Thread C first — Maya checked the name against it.' },
        unlocks: ['B7'],
      },

      // B7 — Navigate: cached Blogger page
      {
        id: 'B7',
        type: 'navigate',
        path: 'B',
        requiresCompleted: { path: 'A', nodeId: 'A7', hint: 'You need the address of the site before you can pull it out of the archive. Thread A has it.' },
        title: "stillwater-media.net — Cached Version",
        tool: 'Wayback Machine',
        timestamp: { text: 'February', urgent: false },
        monologue: "The site's still up. But there's an older copy saved online, from before he cleaned it.",
        osintTip: {
          id: 'page-source',
          title: 'HTML Source Code Inspection',
          body: 'Web page source code contains metadata that\'s invisible to normal users. Developers often leave author names, email addresses, and CMS usernames in meta tags, comments, and template headers. View Source (Ctrl+U) is a basic but powerful technique.',
          steps: [
            'Right-click any web page → View Page Source',
            'Search (Ctrl+F) for: author, name, email, user, admin, id',
            'Look in <meta> tags and HTML comments (<!-- -->)',
            'Check the footer for copyright attributions and template credits',
          ],
          tools: ['Browser → View Page Source (Ctrl+U)', 'BuiltWith.com', 'Wappalyzer', 'Google: cache:url'],
          warning: 'Source code is public by design — viewing it is legal and standard.',
        },
        content: {
          root: {
            name: 'stillwater-media.net (cached Nov 20)',
            type: 'folder',
            children: [
              // What a browser shows you is the page, not its head. The name
              // lives in the source file below, which is the point of the lead.
              { name: 'index.html', type: 'file', content: 'STILLWATER MEDIA\n\nPacific Northwest photography. Documentary work. Available for events across Oregon.\n\nRecent: Millhaven Arts Night · Coastal series · Portland riverfront\n\nEnquiries: the contact form, or PO Box 441, Millhaven OR 97411.\n\n[The page is a single column of photographs. No staff page. No names anywhere on it.]' },
              { name: 'portfolio', type: 'folder', children: [
                { name: 'arts-night-2024.html', type: 'file', content: 'Gallery — Millhaven Arts Night, April 13\n\nCredited: Stillwater Media\n\n[Image gallery — 47 photos from the Millhaven Arts Night. Photo 23 shows the main hall. Photo 31 shows a back staircase marked "private access." There is no photo 32.]' },
                { name: 'landscape-series.html', type: 'file', content: 'Gallery — Pacific Northwest Landscapes\n\nAll photographs © Stillwater Media\n\n[Image gallery — forest trails, river scenes, hill fog. Matches the Flickr albums from stillwater_m.]' },
              ]},
              { name: 'source', type: 'folder', children: [
                { name: 'page-source.txt', type: 'file', revealsName: true, content: 'Full source of index.html:\n\n<meta name="author" content="Ray Callahan">\n<meta name="generator" content="WordPress">\n<meta name="wp-user" content="rcallahan_admin">\n\n<!-- Site built by rcallahan_admin for Stillwater Media -->\n<!-- Admin email: rcallahan@millhavenpost.net -->' },
              ]},
            ],
          },
          requiredFiles: ['index.html', 'page-source.txt'],
        },
        unlocks: ['B8'],
      },

      // B8 — Input: what name in meta tag
      {
        id: 'B8',
        type: 'input',
        path: 'B',
        title: "Source Code — Author Confirmation",
        tool: 'HTML Inspection',
        timestamp: { text: 'February', urgent: false },
        monologue: null,
        content: {
          questions: [
            {
              prompt: 'Who built this website?',
              contextNote: 'Sites carry their author\'s name where visitors never look.',
              revealsName: true, acceptedAnswers: ['ray callahan', 'callahan', 'r callahan'],
              wrongFeedback: 'Look at the <meta name="author" content="..."> tag in the page source.',
            },
            {
              prompt: 'What name did he log in under?',
              contextNote: 'Somewhere a login gets written down.',
              acceptedAnswers: ['rcallahan_admin', 'rcallahan'],
              wrongFeedback: 'Look for the wp-user meta tag and the HTML comment beginning with "<!-- Site built by..."',
            },
          ],
          completionNote: "Ray Callahan. rcallahan_admin. Three records with no reason to agree with each other, and all three say the same name. I've stopped calling it coincidence.",
        },
        unlocks: ['B11'],
      },



      // B11 — Slider: pages 16-18 (system alert fires here)
      {
        id: 'B11',
        type: 'slider',
        path: 'B',
        title: "Burned Notebook — The Last Pages",
        tool: 'Document Recovery',
        timestamp: { text: 'February to March — the last pages', urgent: true },
        monologue: "What's left of it. The fire took most of these.",
        systemAlertAfter: true,
        content: {
          pages: [
            {
              id: 'b-p13',
              date: 'February 19',
              text: 'He has a key to Dad\'s house. Dad gave it to him years ago.\n\nHe knows the WiFi password.\n\nIf I email Dad, he might see it first.',
              targetBrightness: 150,
              targetContrast: 190,
              tolerance: 22,
            },
            {
              id: 'b-p17',
              date: 'March 7',
              text: 'He was at dinner last week. I sat across from him and watched him talk to Dad about football.\n\nYou know what you did. You know I know.',
              targetBrightness: 148,
              targetContrast: 185,
              tolerance: 24,
            },
            {
              id: 'b-p18',
              date: 'March 9 — late',
              text: 'I started the email to Dad.\n\nI got as far as the name. Then I deleted it.\n\nIf he can reach this laptop, he sees the draft before morning.',
              targetBrightness: 165,
              targetContrast: 190,
              tolerance: 22,
            },
          ],
        },
        requiresCompleted: { path: 'C', nodeId: 'C6', hint: "Pull the court record in Thread C first — it's what confirms the name." },
        unlocks: ['B12'],
      },

      // B12 — Navigate: Gmail
      {
        id: 'B12',
        type: 'browse',
        path: 'B',
        title: "Maya's Gmail — Accessed via Browser",
        tool: 'Email Client',
        timestamp: { text: 'March 10 — morning after', urgent: true },
        monologue: "She wrote to me the night before. She never sent it.",
        osintTip: {
          id: 'email-drafts',
          title: 'Email Draft Forensics',
          body: 'Unsent email drafts are often overlooked in digital investigations. They represent the subject\'s last communications — what they intended to say, who they intended to say it to, and when they were interrupted. Draft metadata includes creation time, modification time, and auto-save timestamps.',
          steps: [
            'Check Drafts, Trash, and Spam — not just Inbox and Sent',
            'Review auto-save timestamps on draft emails',
            'Look for sent email confirmations or delivery receipts',
            'Compare draft content against sent folder for changes',
          ],
          tools: ['Gmail full export (Google Takeout)', 'Mail client forensic tools', 'Email header analysis'],
        },
        content: {
          variant: 'gmail',
          folders: [
            {
              name: 'Inbox',
              emails: [
                { from: 'prof.chen@millhaven.edu', subject: 'Re: Essay extension', date: 'Mar 8', preview: 'That\'s fine, Maya — just get it to me by the 15th.', body: 'That\'s fine — get it to me by the 15th. Your writing has been strong this term.\n\n— Prof. Chen' },
                { from: 'university-library@millhaven.edu', subject: 'Library reminder', date: 'Mar 7', preview: '2 items due in 3 days.', body: '2 items due in 3 days:\n— The Art of Disappearing\n— Digital Privacy: A Practical Guide' },
                { from: 'no-reply@millhaven.edu', subject: 'Tuition payment processed', date: 'Mar 3', preview: 'Your spring semester payment has been received.', body: 'Your spring semester tuition payment has been processed. No action required.' },
              ],
            },
            {
              name: 'Sent',
              emails: [
                { to: 'rvelasquez@pacificreporter.org', subject: 'Re: Digital stalking research — potential case', date: 'Mar 6', preview: 'Rosa, I have him. Three sources, all public record...', body: 'Rosa,\n\nI have him. Three sources, all public record.\n\nI need to know my options before I go to the police. Can we speak this weekend?\n\n— M', isJournalistClue: true },
                { to: 'prof.chen@millhaven.edu', subject: 'Essay extension request', date: 'Mar 5', preview: 'Hi Professor Chen, I need a week more on the essay...', body: 'Hi Professor Chen,\n\nI need a week more on the essay — personal situation. Nothing I can explain right now.\n\nThank you,\nMaya' },
              ],
            },
            {
              name: 'Drafts',
              emails: [
                { subject: 'course reflection draft', date: 'Feb 28', preview: 'The relationship between digital identity and...', body: 'The relationship between digital identity and physical surveillance is less well understood than the reverse. We think of online behavior as traceable but bodies as free. The evidence suggests otherwise...\n\n[Draft, unfinished]' },
                { subject: '[no subject]', date: 'Mar 1', preview: 'I keep starting this and stopping.', body: 'I keep starting this and stopping.\n\nI don\'t know how to explain this to you without it breaking something.\n\n[Draft, abandoned]' },
                { subject: 'Dad', date: 'Mar 9', preview: 'I know who he is now. I\'m not typing his name.', isTarget: true, body: "Dad,\n\nI've been working on something since November. A woman who went missing.\n\nI know who he is now. I'm not typing his name. Not in here.\n\nPlease don't call anyone. Not anyone.\n\nGo to Detective Okafor at Millhaven PD. Take my laptop.\n\nI love you. I'm sorry I waited.\n\n— M\n\n[Draft — 11:47pm, March 9. Never sent.]" },
              ],
            },
          ],
          completionNote: "She never sent it. At 7:52 the next morning she called me. Someone was at her door.",
        },
        unlocks: [],
      },
    ],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // PATH C — THE PUBLIC RECORD
  // Entry object: corkboard. Photo analysis, business records, court filing.
  // ══════════════════════════════════════════════════════════════════════════
  C: {
    label: 'Thread C — The Public Record',
    object: 'corkboard',
    nodes: [

      // C1 — Tag: board photos
      {
        id: 'C1',
        type: 'tag',
        path: 'C',
        title: "Investigation Corkboard — Photo Survey",
        tool: 'Photo Analysis',
        timestamp: { text: 'the apartment, before anything', urgent: false },
        monologue: "She had a corkboard. Photographs, strings, notes.",
        osintTip: {
          id: 'photo-analysis',
          title: 'Photo Evidence Analysis',
          body: 'Photographs contain layers of information beyond the subject. Background details, reflections, shadow angles, and visible signage can all place a person at a location. Investigators look at what\'s in the foreground, midground, and background — and what has been circled, annotated, or excluded.',
          steps: [
            'Zoom into backgrounds — signs, windows, storefronts, vehicles',
            'Look for reflections in glass, water, or phone screens',
            'Check shadow angles to approximate time of day',
            'Annotated or circled items were marked for a reason',
          ],
          tools: ['Google Lens (reverse image search)', 'TinEye', 'FotoForensics (error level analysis)', 'Google Maps (location verification)'],
        },
        content: {
          prompt: 'Move across the board. Flag the three things Maya marked in red',
          plate: 'cork',
          items: [
            { id: 'cp-01', spot: { x: 3, y: 6, w: 17, h: 27 }, text: 'Lena\'s profile page, printed off. The handle is ringed in pencil: @velvet.echo.', wrongFeedback: 'Pencil, not red. Lena\'s public profile — Maya kept it for reference.' },
            { id: 'cp-02', spot: { x: 23, y: 4, w: 18, h: 23 }, text: 'A forum screenshot. The first post that account ever made.', wrongFeedback: 'The account Maya was investigating. Already covered in the file system.' },
            { id: 'cp-03', spot: { x: 44, y: 8, w: 30, h: 35 }, text: 'The arts night photograph. She\'s ringed the table by the door in red, hard enough to score the paper. Under it, in her hand: whose is this?', suspicious: true, correctFeedback: "She ringed the table by the door, hard enough to score the paper. She didn't write a name under it. She wrote: whose is this?", tagRequired: true },
            { id: 'cp-04', spot: { x: 77, y: 6, w: 20, h: 31 }, text: 'A map of Millhaven. Three pins in it, and red string run between them.', suspicious: true, correctFeedback: "Three locations, all connected to one person. Maya drew connecting lines between them.", tagRequired: true },
            { id: 'cp-05', spot: { x: 5, y: 40, w: 20, h: 31 }, text: 'Lena\'s last post. Brick and a doorway behind her. Maya has ringed the doorway in red and written under it: same building.', suspicious: true, correctFeedback: "Same brick, same door. The last picture Lena ever posted was taken outside the place she walked into and never came out of. Maya pinned the two together so nobody could argue it.", tagRequired: true },
            { id: 'cp-06', spot: { x: 29, y: 47, w: 23, h: 27 }, text: 'A clipping from the Courier about the arts night. She\'s run a yellow highlighter through the photo credit.', suspicious: false, wrongFeedback: "Yellow highlighter, not red. The credit matters — it's the next lead — but this isn't one of her red marks." },
            { id: 'cp-07', spot: { x: 56, y: 51, w: 21, h: 27 }, text: 'A printout of the domain\'s registration. One line marked in yellow: the address.', wrongFeedback: 'Yellow highlighter, not red. She printed this from the laptop — it\'s background.' },
            { id: 'cp-08', spot: { x: 87, y: 73, w: 11, h: 15 }, text: 'A sticky note, right out on the edge of the board. A journalist\'s name, and an email address.', suspicious: false, wrongFeedback: "No red on it. A journalist's details, pinned at the very edge. Remember the name, though." },
          ],
          requiredTags: ['cp-03', 'cp-04', 'cp-05'],
          wrongTagLimit: 3,
          completionNote: "Three things in red: the table she ringed in the photograph, the string between the map pins, and the doorway on Lena's last post. The pencil and the highlighter are her reading, not her case.",
        },
        unlocks: ['C2'],
      },

      // C2 — Tag: zoom into arts night photo
      {
        id: 'C2',
        type: 'tag',
        path: 'C',
        title: "Arts Night Photo — Detail Analysis",
        tool: 'Photo Analysis',
        timestamp: { text: 'tracing the photo', urgent: false },
        monologue: "She printed this at A3 and pinned it to the board.",
        content: {
          prompt: 'Find the three things that say who worked this room',
          plate: 'gallery',
          imageAlt: 'A side gallery at the arts night: a folding table by the door with a printed sign and a stack of cards, a framed clock on the brick wall, a camera bag on the floor, empty chairs.',
          items: [
            { id: 'ca-sign', spot: { x: 17, y: 54, w: 25, h: 32 }, text: 'A sign standing on the folding table, facing the door.', suspicious: true, correctFeedback: "STILLWATER MEDIA · EVENT PHOTOGRAPHY. The same two words as the handle and the domain, printed and standing on a table forty miles from her flat. He was not a guest here. He was hired.", tagRequired: true },
            { id: 'ca-cards', spot: { x: 21, y: 90, w: 9, h: 9 }, text: 'A stack of business cards on the shelf below the sign.', suspicious: true, correctFeedback: "His cards, put out for anyone who wanted the photographer's details. Whoever worked this room wanted to be found — under that name.", tagRequired: true },
            { id: 'ca-screen', spot: { x: 45.5, y: 33.5, w: 13.5, h: 16 }, text: 'A screen on the brick wall, playing photographs one after another. The one showing is a road at dusk.', suspicious: true, correctFeedback: "A showreel of landscape work, running beside his table. Roads, rivers, trees at first light — the same pictures stillwater_m posts on Flickr. The photographer at this table and the account Maya was chasing take the same photographs.", tagRequired: true },
            { id: 'ca-clock', spot: { x: 36.5, y: 35, w: 8.5, h: 12 }, text: 'A small framed clock on the wall beside the screen.', wrongFeedback: "The clock gives an hour, not a person. Hold on to it, though. It will matter once I know who he is." },
            { id: 'ca-bag', spot: { x: 49, y: 86, w: 19, h: 14 }, text: 'A camera bag on the floor in front of the table, a luggage tag hanging off it.', wrongFeedback: 'The tag has turned over. A bag by the door says somebody is working. It does not say who.' },
            { id: 'ca-chairs', spot: { x: 63, y: 56, w: 18, h: 24 }, text: 'Folding chairs against the far wall, nobody on them.', wrongFeedback: 'Empty chairs. Whatever was happening that evening, it was not happening in this room.' },
            { id: 'ca-bag2', spot: { x: 81.5, y: 69, w: 6, h: 16 }, text: 'A second bag, further along the wall by the curtain.', wrongFeedback: 'Another bag. The room is full of kit and empty of people.' },
            { id: 'ca-door', spot: { x: 88.5, y: 33, w: 9, h: 47 }, text: 'A heavy curtain at the right edge, and past it a strip of bright floor where the light comes in from the next room.', wrongFeedback: 'The light and the noise are through there, not in here. Remember that — but a curtain is not a name.' },
          ],
          requiredTags: ['ca-sign', 'ca-cards', 'ca-screen'],
          wrongTagLimit: 3,
          completionNote: "A printed sign, a stack of his cards, and his pictures playing on the wall. Stillwater Media worked this room. The account, the website and the photographer are one man.",
        },
        unlocks: ['C3'],
      },

      // C3 — Input: event search
      {
        id: 'C3',
        type: 'input',
        path: 'C',
        title: "Event Search — Millhaven Arts Night",
        tool: 'Event Records Search',
        timestamp: { text: 'verifying the venue', urgent: false },
        monologue: null,
        osintTip: {
          id: 'event-search',
          title: 'Event & Permit Record Research',
          body: 'Public events require permits from local government. Event permit applications list venue name, organizer name, dates, and sometimes attendee capacity. These are public records in most US jurisdictions, accessible through city or county clerks.',
          steps: [
            'Search city clerk\'s website for event permit database',
            'Try: "event permit" + venue name + year',
            'News archives often list event organizers by name',
            'Venue websites often have past event archives',
          ],
          tools: ['City Clerk database', 'Local newspaper archives', 'Nexis Uni', 'Google: site:cityname.gov "event permit"'],
        },
        content: {
          questions: [
            {
              prompt: 'Lena\'s last post and the arts night photograph show the same brick building. What is it called? (It is named on Maya\'s corkboard map.)',
              contextNote: "Look at the corkboard map Maya created — she labeled the primary location. Also visible in the photo detail you just analyzed.",
              acceptedAnswers: ['alder hall', 'the alder hall', 'alder'],
              wrongFeedback: "Read the label Maya wrote on the map pin. It is a hall on Main Street.",
            },
            {
              prompt: 'If you wanted to find the official organizer of the Millhaven Arts Night, where would you look first?',
              contextNote: "Any public event with a venue and over ~50 attendees requires a permit filed with the city or county. That application names the official organizer — it's a public record.",
              acceptedAnswers: ['city clerk', 'permit', 'event permit', 'permits', 'county', 'county clerk', 'county records', 'city', 'city records', 'city hall', 'clerk', 'records', 'public records', 'newspaper', 'paper', 'courier', 'millhaven courier', 'news', 'local newspaper', 'archive', 'archives'],
              wrongFeedback: "Think about what public record would list an event's organizer. Hint: large public events require official permits.",
            },
          ],
          completionNote: "Alder Hall, Main Street, Millhaven. An old building somebody's family has kept up since the war. The listing does not say whose.",
        },
        unlocks: ['C4'],
      },

      // C4 — Browse: newspaper archive — find matching building
      {
        id: 'C4',
        type: 'browse',
        path: 'C',
        title: "Millhaven Courier — Archive Search",
        tool: 'Newspaper Archive',
        timestamp: { text: 'verifying through press records', urgent: false },
        monologue: "Local newspapers archive everything. She knew that.",
        osintTip: {
          id: 'newspaper-archive',
          title: 'Local Newspaper Archive Research',
          body: 'Local newspapers publish event listings, business announcements, court summaries, and community notices that never appear in larger outlets. Many have searchable digital archives. Others have been digitized by universities, local libraries, or ProQuest.',
          steps: [
            'Search the newspaper\'s website directly for the person\'s name',
            'Try Google: site:newspaper.com "person name"',
            'Contact the local library — many maintain print archive rooms',
            'ProQuest Historical Newspapers covers some regional papers',
          ],
          tools: ['Newspapers.com', 'ProQuest', 'GenealogyBank', 'Local library archives', 'Chronicling America (Library of Congress)'],
        },
        content: {
          variant: 'news-archive',
          systemName: 'Millhaven Courier — Digital Archive',
          records: [
            { title: 'Arts Collective Celebrates 10th Annual Spring Exhibition', summary: 'Apr 15 — Local coverage of the arts night. Photographer credit listed.', fields: { 'Date': 'April 15', 'Author': 'Staff Reporter, M. Connors', 'Section': 'Community Arts' }, body: 'The Arts Collective\'s tenth Spring Exhibition drew over 400 people to Alder Hall on Saturday. Collective director Owen Pryce, who introduced the evening\'s speakers, declined to release the guest list.\n\nEvent photography provided by Stillwater Media.\n\nWork from 34 local artists. Lena Vasquez, who has not been seen since the event, is noted as having attended.', taggable: [
              { id: 'ta-01', text: '"Event photography provided by Stillwater Media."', suspicious: true, correctFeedback: "Stillwater Media. The same two words as the handle, the domain and the sign on that table. Whoever runs that account was working the room she vanished from." },
              { id: 'ta-02', text: '"Lena Vasquez, who has not been seen since the event, is noted as having attended."', suspicious: true, correctFeedback: "The paper puts Lena at the arts night — the last place anybody saw her, on the record, in print." },
              { id: 'ta-03', text: '"over 400 attendees"', suspicious: false, wrongFeedback: 'Attendance figure. Not relevant to the investigation.' },
              { id: 'ta-06', text: '"Collective director Owen Pryce declined to release the guest list."', suspicious: false, wrongFeedback: "A man protecting his members\u2019 names, or a man with something to hide. Either way the paper does not say he was ever out of that hall." },
            ]},
            { title: 'Alder Hall Listed on Millhaven Historic Register', summary: 'Jun 3 (3 years ago) — Building designation announcement.', fields: { 'Date': '3 years ago', 'Section': 'Local History' }, body: 'Alder Hall joins the Millhaven Historic Register after nearly 80 years of community use.\n\nBuilt in 1944 and held by a family trust ever since. The trust donated partial use of the hall to the Arts Collective in 2014. The Courier\'s request for comment went to a PO box.' },
            { title: 'Harassment Case Settled — Man Ordered to Stay Away', summary: '4 years ago — Court filing summary. Name partially redacted.', fields: { 'Date': '4 years ago', 'Section': 'Court Records' }, body: 'A Millhaven man has been issued a restraining order after a harassment complaint.\n\nThe respondent — case number MH-2021-0384 — must keep 300 yards from the complainant.\n\nThe Courier does not publish names in these cases. The order is on file with the county clerk.', taggable: [
              { id: 'ta-04', text: 'Case number MH-2021-0384 — the restraining order', suspicious: true, correctFeedback: "A case number. Four years old, and she'd written it down." },
              { id: 'ta-05', text: '"ordered to maintain a distance of 300 yards from the complainant"', suspicious: false, wrongFeedback: "Standard restraining order language. Not a specific clue." },
            ]},
          ],
          requiredTagIds: ['ta-01', 'ta-02', 'ta-04'],
          completionNote: "Three items: the photographer credit, Lena's confirmed attendance, and the case number. Three fragments of the same story.",
        },
        unlocks: ['C5', 'C9'],
      },

      // C9 — Compare: the gallery photo against the printed programme
      {
        id: 'C9',
        type: 'compare',
        path: 'C',
        title: "Arts Night — Photo Against Programme",
        tool: 'Cross-reference',
        timestamp: { text: 'the photo again, with a name', urgent: false },
        monologue: "Maya kept the programme from that night pinned beside the photograph. I never asked why.",
        content: {
          prompt: 'Link what the photographs show to what the programme says',
          left: {
            title: 'His room · the side gallery',
            plate: 'gallery',
            items: [
              { id: 'p-clock', label: 'Clock on the wall', text: 'The framed clock reads 7:47', crop: { x: 37.8, y: 37, w: 7, h: 8.5 } },
              { id: 'p-sign', label: 'Sign on his table', text: 'STILLWATER MEDIA · EVENT PHOTOGRAPHY', crop: { x: 18, y: 60, w: 23, h: 25 } },
              { id: 'p-chairs', label: 'The chairs', text: 'Folding chairs along the wall, every one of them empty', crop: { x: 62, y: 55, w: 22, h: 26 } },
              { id: 'p-hall', label: 'The other photograph', text: 'The main hall the same evening: a banner, and four hundred people standing', crop: { x: 12, y: 4, w: 76, h: 60 }, plate: 'hall' },
            ],
          },
          right: {
            title: 'The printed programme',
            kicker: 'Saturday 13 April · Alder Hall',
            items: [
              { id: 'r-doors', label: '7:00 pm', text: 'Doors open. Bar in the foyer.' },
              { id: 'r-talk', label: '7:45 pm', text: 'Artist talk — Lena Vasquez, introduced by Owen Pryce. Main hall. All welcome.' },
              { id: 'r-photo', label: 'Credits', text: 'Photography: Stillwater Media' },
              { id: 'r-title', label: 'Title', text: 'Tenth Spring Exhibition of the Millhaven Arts Collective' },
              { id: 'r-close', label: '10:00 pm', text: 'Close. East gallery open throughout.' },
            ],
          },
          pairs: [
            { left: 'p-clock', right: 'r-talk', required: true, feedback: 'Two minutes into her talk. Everyone in the building was in the main hall — and this photograph was taken somewhere else.' },
            { left: 'p-sign', right: 'r-photo', required: true, feedback: 'His table, his sign, and the credit printed in the programme. He was hired to be in that building with a camera.' },
            { left: 'p-hall', right: 'r-talk', feedback: 'Four hundred people in the hall, listening to her. Nobody had any reason to look anywhere else.' },
            { left: 'p-hall', right: 'r-title', feedback: 'The banner and the programme agree on the evening. True, and never in doubt.' },
            { left: 'p-chairs', right: 'r-close', feedback: 'The side gallery stayed open all evening, and stayed empty. His kit was in here. Where was he?' },
          ],
          wrongFeedback: 'Those two don\'t confirm each other.',
          completionNote: "At 7:47 everyone was in the main hall, listening to Lena. The photographer's kit sat in an empty room by the door. So where was the photographer?",
        },
        unlocks: [],
      },

      // C5 — Browse: business registry
      {
        id: 'C5',
        type: 'browse',
        path: 'C',
        requiresCompleted: { path: 'A', nodeId: 'A7', hint: 'Run the domain registration in Thread A first — the registry needs a company or a postbox to search on, and that is where they are.' },
        title: "Oregon Business Registry — Stillwater Media",
        tool: 'Business Registry',
        timestamp: { text: 'verifying the business', urgent: false },
        monologue: null,
        osintTip: {
          id: 'business-registry',
          title: 'Business Registry Research',
          body: 'Most US states maintain public databases of registered businesses. These list the legal business name, registered agent (often the owner), address, filing date, and status. This is one of the most reliable ways to confirm a real-world identity behind an online alias.',
          steps: [
            'Search the Secretary of State business registry for the state',
            'Look up business name, address, or registered agent name',
            'Note the registered agent — this is usually the owner or their lawyer',
            'Cross-reference the address with WHOIS results',
          ],
          tools: ['Oregon Secretary of State (sos.oregon.gov)', 'OpenCorporates.com', 'State SOS websites', 'PACER (federal court records)'],
        },
        content: {
          variant: 'records',
          systemName: 'Oregon Secretary of State — Business Registry',
          records: [
            { title: 'Stillwater Media LLC', summary: 'Active — limited liability company, Millhaven OR', fields: { 'Business Name': 'Stillwater Media LLC', 'Status': 'Active', 'Registered Agent': 'Raymond T. Callahan', 'Principal Address': 'PO Box 441, Millhaven, OR 97411', 'Filing Date': '6 years ago', 'Entity Type': 'Limited Liability Company', 'Business Type': 'Photography and Media Services' }, body: null, taggable: [
              { id: 'br-01', text: 'Registered Agent: Raymond T. Callahan', suspicious: true, revealsName: true, correctFeedback: "The account is a business, and the business has a man's name on it." },
              { id: 'br-02', text: 'Principal Address: PO Box 441, Millhaven, OR 97411', suspicious: true, correctFeedback: "The same box the domain was registered to. Second record, same address." },
              { id: 'br-03', text: 'Filing Date: 6 years ago', suspicious: false, wrongFeedback: 'The business was filed six years ago. Useful for a timeline, not a name.' },
            ]},
            { title: 'Alder Hall Trust', summary: 'Active — property trust, same principal address', fields: { 'Entity Name': 'Alder Hall Trust', 'Status': 'Active', 'Trustee': 'Raymond T. Callahan', 'Principal Address': 'PO Box 441, Millhaven, OR 97411', 'Filing Date': '1944 — renewed annually', 'Purpose': 'Holds the Alder Hall property, Main Street, Millhaven' }, body: null, taggable: [
              { id: 'br-04', text: 'Trustee: Raymond T. Callahan — Alder Hall Trust', suspicious: true, correctFeedback: "The same man holds the hall itself. He photographed the evening, in a building his family has owned since the war. Nobody in that place would ever question him." },
            ]},
          ],
          requiredTagIds: ['br-01', 'br-02', 'br-04'],
          completionNote: "Raymond T. Callahan.",
        },
        unlocks: ['C6'],
      },

      // C6 — Tag: tag key facts in court record
      {
        id: 'C6',
        type: 'browse',
        path: 'C',
        title: "Marion County Court — Case MH-2021-0384",
        tool: 'Court Records',
        timestamp: { text: 'pulling the court record', urgent: true },
        monologue: "The full filing. Not the redacted newspaper version. The actual document.",
        osintTip: {
          id: 'court-records',
          title: 'Public Court Record Access',
          body: 'Court filings are public records in the US unless specifically sealed by a judge. Restraining orders, civil complaints, and criminal records are searchable through state court portals and PACER (federal cases). Case numbers from newspaper reports can be used to pull the full unredacted filing.',
          steps: [
            'Use the case number from the newspaper or other source',
            'Search the state\'s court case lookup portal',
            'Federal cases: PACER.gov (small fee per page)',
            'Some states provide free access to civil records',
          ],
          tools: ['Oregon eCourt Case Information', 'PACER (federal)', 'CourtListener (free federal)', 'RECAP Archive'],
          warning: 'Sealed records are sealed for legal reasons — do not attempt to access them through unofficial means.',
        },
        content: {
          variant: 'court',
          systemName: 'Marion County Court — Civil Filing',
          records: [
            { title: 'Case MH-2021-0384 — Restraining Order (Civil)', summary: 'Filed 4 years ago. Petitioner: K. Nair. Respondent named in the filing.', fields: { 'Case Number': 'MH-2021-0384', 'Case Type': 'Restraining Order — Civil Harassment', 'Filing Date': '4 years ago', 'Petitioner': 'K. Nair', 'Respondent': 'Raymond T. Callahan, PO Box 441, Millhaven, OR', 'Order Duration': '2 years (expired)', 'Status': 'Closed' }, body: 'PETITION FOR RESTRAINING ORDER\n\nPetitioner states that Respondent, Raymond T. Callahan, has engaged in a pattern of unwanted contact and surveillance over a period of eight months.\n\nSpecific conduct included:\n— Appearing at locations known only through Petitioner\'s private communications\n— Monitoring Petitioner\'s email account without consent\n— Creating online profiles to follow Petitioner\'s activities under pseudonymous accounts\n— Following Petitioner in a vehicle on four documented occasions\n\nRespondent denied all allegations. No criminal charges were filed.\n\nOrder granted. Respondent ordered to maintain 300-yard distance from Petitioner for a period of two years.\n\nOrder expired. No renewal sought.', taggable: [
              { id: 'cr-01', text: 'Respondent: Raymond T. Callahan, PO Box 441, Millhaven, OR', suspicious: true, revealsName: true, correctFeedback: "His full name and his address, filed with a court. Nothing here came from me, or from Maya." },
              { id: 'cr-02', text: '"Creating online profiles to follow Petitioner\'s activities under pseudonymous accounts"', suspicious: true, correctFeedback: "Accounts under names that weren't his. He did it four years ago, and a judge wrote it down." },
              { id: 'cr-03', text: '"Appearing at locations known only through Petitioner\'s private communications" and "Monitoring Petitioner\'s email account without consent"', suspicious: true, correctFeedback: "He read her mail. He turned up in places she had only written down. Ray has had a key to my house for twenty years." },
              { id: 'cr-04', text: 'Order expired. No renewal sought.', suspicious: false, wrongFeedback: "The expiration is significant but not a specific flag. The behavior described in the order is what matters." },
            ]},
          ],
          requiredTagIds: ['cr-01', 'cr-02', 'cr-03'],
          completionNote: "Four years ago. A different woman.",
        },
        unlocks: ['C7'],
      },

      // C7 — Connect: evidence chain
      {
        id: 'C7',
        type: 'connect',
        path: 'C',
        title: "Evidence Chain Assembly",
        tool: 'Analysis',
        timestamp: { text: 'connecting it all', urgent: true },
        monologue: "She drew lines between everything on the board. I'm going to do the same.",
        content: {
          cards: [
            { id: 'domain', label: 'stillwater-media.net', details: 'WHOIS: R. Callahan, PO Box 441, Millhaven' },
            { id: 'business', label: 'Stillwater Media LLC', details: 'Business registry: Raymond T. Callahan, PO Box 441' },
            { id: 'username', label: 'stillwater_m', details: 'Forum account. Insider knowledge of Lena\'s private details.' },
            { id: 'court', label: 'Case MH-2021-0384', details: 'Restraining order: Raymond T. Callahan. Pattern: pseudonymous accounts, email access.' },
            { id: 'photo', label: 'Arts Night Photo', details: 'Ray Callahan, Stillwater Media — official photographer. Present at Lena\'s last location.' },
            { id: 'priya', label: 'Priya (roommate)', details: 'Told police Lena was "waiting for something to end." Reported her missing Apr 15.' },
          ],
          requiredConnections: [
            { from: 'domain', to: 'business', label: 'Same PO Box 441 — same registrant name' },
            { from: 'business', to: 'username', label: 'Stillwater Media → stillwater_m username' },
            { from: 'username', to: 'court', label: 'Pseudonymous accounts — same pattern as restraining order' },
            { from: 'court', to: 'photo', label: 'Same person: Raymond T. Callahan' },
            { from: 'photo', to: 'domain', label: 'Ray Callahan present at arts night — location confirmed by WHOIS city' },
          ],
          wrongFeedback: 'No direct connection between those two. Try a different pair — look for shared names, addresses, or behaviors.',
          completionNote: "Five separate records. One address on all of them.",
        },
        unlocks: ['C8'],
      },

      // C8 — Read: final board survey + journalist unlock
      {
        id: 'C8',
        type: 'navigate',
        path: 'C',
        title: "Corkboard — Final Survey",
        tool: 'Evidence Review',
        timestamp: { text: 'end of the board', urgent: true },
        monologue: "There's one more thing on this board. I almost missed it.",
        journalistUnlock: true,
        content: {
          root: {
            name: 'Corkboard — Maya\'s Investigation',
            type: 'folder',
            children: [
              { name: 'front_of_board.txt', type: 'file', content: 'Main section:\n— Lena\'s photo (circled: arts night)\n— stillwater_m post screenshots\n— WHOIS printout (PO Box 441 highlighted)\n— Court record printout (case # circled)\n\nRed string runs from all four to one card in the middle.\n\nThe card has been torn off. Only the pin is left.' },
              { name: 'map_section.txt', type: 'file', content: 'Map of Millhaven pinned to left panel:\n— Star: Alder Hall (arts night venue)\n— Star: PO Box 441 on Main Street\n— Star: Millhaven Courthouse\n\nHandwritten at the bottom: "All three lines connect to the same person."' },
              { name: 'notes_scraps.txt', type: 'file', content: 'Loose notes pinned around the edges:\n\n"He was at the arts night — official photographer — had access to all areas"\n"Forum account: insider knowledge, never public"\n"Prior restraining order — same behavior pattern"\n"Do NOT email Dad from this laptop"\n"Library computer — Monday morning"' },
              { name: 'sticky_note_back_of_board.txt', type: 'file', handwritten: true, content: 'Sticky note on the back of the corkboard, partially hidden:\n\nRosa Velasquez\nPacific Reporter\nrvelasquez@pacificreporter.org\n"digital safety beat — she\'ll understand"\n\n[Written in different ink — added later]' },
            ],
          },
          requiredFiles: ['front_of_board.txt', 'sticky_note_back_of_board.txt'],
        },
        unlocks: [],
      },
    ],
  },
}
