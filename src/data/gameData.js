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
        monologue: "I got in first try. Her password's still her mum's birthday.",
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
                { name: 'lena_timeline.txt', type: 'file', content: "LENA VASQUEZ \u2014 what I know, and where it's from\n\npainter. flat in portland near the waterfront.\nteaches at millhaven uni, tues + thurs.            (her friends' forum page)\n\nFRI 12 APR\n  5:40pm   leaves her studio                         (police appeal)\n  11:10pm  phone stops moving, at the flat            (priya)\n\nSAT 13 APR \u2014 millhaven arts night\n  6:41pm   last post, from the hall doorway           (her insta, @velvet.echo)\n  7:45pm   she's on stage, giving a talk              (the programme)\n  10pm     hall closes. nobody saw her leave          (police appeal)\n\nSUN 14    phone switched off\nMON 15    priya reports her missing\nTUE 16    police: \"no evidence of foul play\"\n\npriya told the police lena was \"waiting for something to end\".\nshe told me herself. it was never printed anywhere." },
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
                  { name: 'c_marsh_crossref.txt', type: 'file', handwritten: false, content: "COREY MARSH \u2014 lena's ex\nchecking him: dec 10 \u2013 jan 3\n\nstillwater_m keeps telling the forum corey was obsessed with her.\nhe says someone was watching her street the night before the\narts night \u2014 friday 12 april \u2014 and that corey's flickr photos\n\"look like her street\".\n\nok. pull the EXIF (the hidden time + place data) off corey's photos.\nif he was outside her flat that friday, I go straight to the police." },
                  { name: 'username_scan_results_OLD.txt', type: 'file', content: "USERNAME SCAN \u2014 c_marsh_pdx\nrun dec 10\n\nreddit: active \u00b7 twitter: active \u00b7 flickr: active\npdxmissing forum: NOT registered  (so corey isn't even on the forum)\n\n\u2014\nnext: run the same scan on stillwater_m.\nif his flickr is locked by then, the Wayback Machine will have a saved copy." },
                ]},
                { name: 'NOTES_DO_NOT_DELETE.txt', type: 'file', handwritten: true, content: "do NOT delete this.\n\nthe account pushing corey = stillwater_m\n\nhe knew her tuesday route. her class schedule. her ROOMMATE'S NAME.\nnone of that was public. I checked. twice.\n\njoined the forum last may \u2014 a month after she went missing.\nhe sounds worried, fine. but he knows way too much.\n\nwho IS he??\n\n\u2014 log \u2014\nnov 4    posted my first question on the forum\njan 31   asked the forum straight out: does anyone know who stillwater_m is?\nfeb 1    ran the username scan on him\nfeb 2    one of his accounts is GONE. not locked. gone.\nfeb 3    flickr's locked now too. (saved the photos first. see my old scan notes)" },
              ]},
              { name: 'photos', type: 'folder', children: [
                { name: 'us_christmas_2023.jpg', type: 'file', content: '[Photo — Christmas morning. Ray out of focus behind us, his hand on the back of Maya\'s chair.]\n\n"Ray\'s been at every Christmas I can remember. — M"' },
                { name: 'maya_bday_2024.jpg', type: 'file', content: '[Photo — Maya blowing out candles, birthday cake. Ray is leaning in from the right of the frame. He has a hand on Maya\'s shoulder.]' },
              ]},
            ],
          },
          idleNote: 'Nothing\'s open. Just her folders — school, recipes, photos, and one called INVESTIGATION.',
          requiredFiles: ['c_marsh_crossref.txt', 'NOTES_DO_NOT_DELETE.txt'],
        },
        unlocks: ['A2', 'A4', 'A13'],
      },

      // A2 — Reddit: tag 4 relevant posts
      // A2 — Phrase: the words, not the row. "Click the suspicious post" was
      // this game's most-used verb and it let a player skim; the damning
      // post here is ordinary except for three or four words in it.
      {
        id: 'A2',
        type: 'phrase',
        path: 'A',
        title: "Reddit — u/stillwater_m",
        tool: 'Reddit',
        timestamp: { text: 'Maya\'s research — December to February', urgent: false },
        monologue: "Maya was looking for things he couldn't have known.",
        osintTip: {
          id: 'insider-knowledge',
          title: 'What Only an Insider Could Know',
          body: 'Comparing a person\'s claims against the public record is the core of open-source work. Anyone can repeat what the papers printed. The useful question is narrower: which specific details in this account were never published anywhere? Routines, names of witnesses, interior layouts and timetables are rarely in press releases, and they are exactly what somebody close to an event knows without thinking.',
          steps: [
            'Build a list of what was actually published, and when',
            'Read the account against it, phrase by phrase rather than post by post',
            'Flag specifics: names, routes, times, layouts',
            'Check the date the detail was said against the date it became public',
          ],
          tools: ['News archives', 'Police press releases', 'Wayback Machine', 'Court dockets'],
        },
        content: {
          prompt: 'Mark the words nobody published',
          hint: 'Pick the first word of a phrase, then its last word, then Mark. Look for private details: routines, names, timetables.',
          // Nothing on this page is marked. Six posts, every word selectable,
          // three phrases that could only have come from watching her.
          posts: [
            { id: 'sm-003', who: 'u/stillwater_m', when: 'r/PDXmissing · Feb 22',
              text: "Those Coava sightings — wasn't that near her Tuesday route?" },
            { id: 'sm-008', who: 'u/stillwater_m', when: 'r/PDXmissing · Jan 11',
              text: 'Careful what we post. Her class schedule should stay off-thread.' },
            { id: 'sm-006', who: 'u/stillwater_m', when: 'r/photography · Feb 1',
              text: 'Shot this at the Millhaven Arts Night last spring. Good crowd, bad light.' },
            { id: 'sm-005', who: 'u/stillwater_m', when: 'r/PDXmissing · Feb 9',
              text: "Has anyone looked harder at the ex? Corey Marsh. That's where I'd look." },
            { id: 'sm-012', who: 'u/stillwater_m', when: 'r/PDXmissing · Dec 6',
              text: 'The roommate — Priya — has she been interviewed properly? She was the last one in that flat.' },
            { id: 'sm-002', who: 'u/stillwater_m', when: 'r/Portland · Feb 26',
              text: 'Cold but clear for cycling the waterfront today.' },
          ],
          phrases: [
            // "Tuesday" alone is the private fact — a weekly routine. "route"
            // alone is not, so it is not a core.
            { id: 'p-route', text: 'her Tuesday route', cores: ['Tuesday route', 'Tuesday'], correctFeedback: "Her Tuesday route. She walked it every week and never posted about it. Her flatmate knew. Her mother knew. Nobody else should have." },
            { id: 'p-class', text: 'Her class schedule', correctFeedback: "Her class schedule. It wasn't in the paper or on her profile — and he's the one telling people not to post it." },
            { id: 'p-priya', text: 'Priya', correctFeedback: "He uses her flatmate's first name like everybody knows it. It was in one police statement and no newspaper." },
          ],
          // The readings that are worth answering rather than just refusing.
          decoys: [
            { text: 'Millhaven Arts Night', feedback: 'The arts night was in every news story about the case. Worth remembering that he was there — but it wasn\'t a secret.' },
            { text: 'Corey Marsh', feedback: "Everyone on the forum knew Corey's name by then. He's repeating it, not revealing it. (Who started saying it is another question.)" },
            { text: 'cycling the waterfront', feedback: 'A man went for a bike ride. Half the city posts this.' },
            { text: 'Coava', feedback: 'A busy coffee shop. The sightings there were in the very first news report.' },
            { text: 'Those Coava sightings', feedback: 'The sightings were public within a week. It\'s what he says next that isn\'t.' },
            { text: 'the roommate', feedback: 'Everyone knew she had a flatmate. Read on — it\'s the next word he shouldn\'t have known.' },
            { text: 'the last one in that flat', feedback: 'The police said that much at the first press conference.' },
            { text: 'the ex', feedback: 'Half the forum was saying "the ex" by February. That was no secret.' },
            { text: 'Good crowd, bad light', feedback: "A photographer moaning about the lighting. It tells you he was working there, not that he was watching her." },
          ],
          missFeedback: 'That was in the news the first week. Anyone could have known it.',
          completionNote: "Three details in under three months: her route, her timetable, her flatmate's name. You'd only know those by watching her. He posted them like small talk.",
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
          recordsLabel: 'Open on her desktop',
          records: [
            {
              label: 'Username scan — stillwater_m',
              meta: 'six platforms',
              fields: [
                ['Reddit', '200 · active — 412 posts, last one Jan 30'],
                ['Instagram', '200 · active — last post November'],
                ['Vimeo', '200 · active — four landscape reels'],
                ['Flickr', '403 · private — album locked Feb 3'],
                ['Tumblr', '403 · suspended by the platform, 2019'],
                ['Twitter / X', '404 · no such account'],
              ],
              note: '200 means the account is there and public. 403 means it exists but you\'re not allowed to see it. 404 means there\'s no account there at all.',
            },
            {
              label: 'NOTES_DO_NOT_DELETE.txt',
              meta: 'modified Feb 3',
              fields: [
                ['Jan 31', 'asked the forum straight out: does anyone know who stillwater_m is?'],
                ['Feb 1', 'ran the username scan on him'],
                ['Feb 2', 'one of his accounts is GONE. not locked. gone.'],
                ['Feb 3', "flickr's locked now too. (saved the photos first. see my old scan notes)"],
              ],
            },
          ],
          questions: [
            {
              prompt: "Maya searched six websites for the username stillwater_m. On one of them the account doesn't exist at all — not hidden, not suspended, just gone. Which website?",
              contextNote: "Read the scan results. The number next to each site says what happened to the account.",
              acceptedAnswers: ['twitter', 'twitter.com', 'x.com', 'x'],
              wrongFeedback: "Look at the scan again. Which result means there's no account there at all?",
              hintFeedback: "404 means there's no account. That's Twitter.",
            },
            {
              prompt: "His Flickr went private, but Maya had already saved his photos. What did she use to get them?",
              contextNote: "She planned for this back in December. Her old scan notes on her laptop (username_scan_results_OLD.txt) say what she'd use.",
              acceptedAnswers: ['wayback', 'wayback machine', 'web.archive.org', 'archive.org', 'internet archive'],
              wrongFeedback: "It's the last line of username_scan_results_OLD.txt, in her laptop's suspect_research folder.",
              hintFeedback: "Her December note says: if his Flickr is locked, the Wayback Machine will have a saved copy.",
            },
          ],
          completionNote: "One account deleted, one locked — two days after she asked the forum who he was. He was reading that forum.",
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
        monologue: 'Phone photos keep a note of where they were taken. He never switched it off.',
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
            { id: 'f-002', filename: 'river_dusk_07.jpg', lat: 45.5238, lon: -122.6713, taken: 'Apr 12 · 7:52pm', answer: 'waterfront', required: true, pinLabel: 'Apr 12', correctFeedback: 'The waterfront, the night before she vanished — two streets from Lena\'s flat.', wrongFeedback: 'Not there. Follow the latitude line across first, then the longitude down.' },
            { id: 'f-003', filename: 'fog_hills_02.jpg', lat: 45.4912, lon: -122.8801, taken: 'Jan 18 · 9:02am', answer: 'beaverton', pinLabel: 'Jan 18', correctFeedback: 'The hills west of the city, in January. No bearing on April.', wrongFeedback: 'Not there. Check which side of the river that longitude falls.' },
            { id: 'f-004', filename: 'arts_night_exterior.jpg', lat: 44.9147, lon: -122.9931, taken: 'Apr 13 · 6:38pm', answer: 'venue', required: true, pinLabel: '6:38pm', correctFeedback: 'Alder Hall, 6:38pm on the 13th — outside, just before the doors opened.', wrongFeedback: 'Not that door. On a street this small, every decimal place counts.' },
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
          completionNote: "The night before, he was on the waterfront two streets from her flat. The next evening he was inside the hall she never came out of.",
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
        monologue: "An archive saved his Twitter page twice. Maya compared them.",
        osintTip: {
          id: 'wayback-diff',
          title: 'Two Copies of One Page, Side by Side',
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
          hint: 'Two posts were deleted. Two lines were edited.',
          before: {
            id: 'before', label: '@stillwater_m', when: 'Captured 2 September',
            lines: [
              { id: 'b-bio', meta: 'bio', text: 'Photographer · Millhaven, OR · Stillwater Media', change: 'bio' },
              { id: 'b-1', meta: 'Aug 20', text: 'If anyone asks why I follow that forum — I just care. That\'s allowed.' },
              { id: 'b-2', meta: 'Jul 6', text: 'Quiet weekend. Me and the cat.' },
              { id: 'b-3', meta: 'Jun 12', text: 'A month on the PDXmissing forum now. Good people.' },
              { id: 'b-5', meta: 'May 3', text: 'Good morning from Millhaven. Coffee, hills, not bad.', change: 'town' },
              { id: 'b-6', meta: 'Apr 30', text: 'Nice Oregonian piece on the Millhaven Arts Collective. Proud of that lot.' },
              { id: 'b-7', meta: 'Apr 13', text: 'Arts night tonight. Working it — come and say hello.', change: 'artsnight' },
              { id: 'b-4', meta: 'Mar 2', text: 'stillwater-media.net is finally live. Portfolio for now.', change: 'domain' },
            ],
          },
          after: {
            id: 'after', label: '@stillwater_m', when: 'Captured 14 November',
            lines: [
              { id: 'a-bio', meta: 'bio', text: 'Photographer · Pacific Northwest', change: 'bio' },
              { id: 'a-1', meta: 'Aug 20', text: 'If anyone asks why I follow that forum — I just care. That\'s allowed.' },
              { id: 'a-2', meta: 'Jul 6', text: 'Quiet weekend. Me and the cat.' },
              { id: 'a-3', meta: 'Jun 12', text: 'A month on the PDXmissing forum now. Good people.' },
              { id: 'a-5', meta: 'May 3', text: 'Good morning. Coffee, hills, not bad.', change: 'town' },
              { id: 'a-6', meta: 'Apr 30', text: 'Nice Oregonian piece on the Millhaven Arts Collective. Proud of that lot.' },
            ],
          },
          changes: [
            { id: 'artsnight', feedback: "Deleted. In September he was telling people he was working at the arts night. By November the post was gone — the one post that put him in that building." },
            { id: 'domain', feedback: "Deleted too — the post announcing his website. He kept the website and removed the post that tied this account to it." },
            { id: 'bio', feedback: "His bio lost a town and a company: Millhaven and Stillwater Media. Now it could be anyone with a camera." },
            { id: 'town', feedback: "Read it twice. In September it said \"Good morning from Millhaven\". In November it just says \"Good morning\". He went back and took his town out of an old post about coffee." },
          ],
          completionNote: "Two posts deleted and two lines quietly edited: the arts night, the website and his own town, all gone — in the same weeks Maya started asking questions on that forum.",
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
        monologue: "Maya looked up who owns his website.",
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
          prompt: 'Flag the details that actually tell you something',
          items: [
            { id: 'wh-registrar', text: 'Registrar: NameCheap, Inc.', wrongFeedback: 'Where the domain was bought. Not who bought it.' },
            { id: 'wh-created', text: 'Created: 11 May, four years ago · Expires: 11 May (auto-renew)', wrongFeedback: 'Dates of purchase. They tell me when, not who.' },
            { id: 'wh-privacy', text: 'Privacy protection: ENABLED — Registrant details withheld by Domains By Proxy, LLC', suspicious: true, tagRequired: true, correctFeedback: 'A privacy shield. He paid to hide who owns the site.' },
            { id: 'wh-updated', text: 'Record last updated: 9 November', suspicious: true, tagRequired: true, correctFeedback: 'Changed on 9 November — five days after Maya\'s first post on the forum (4 November, in her notes). He hid it after she started asking. So before that it was open, and somewhere there\'ll be a copy.' },
            { id: 'wh-name', text: 'Registrant Name: REDACTED FOR PRIVACY', wrongFeedback: 'Redacted. That is the shield doing its job.' },
            { id: 'wh-org', text: 'Registrant Organization: Stillwater Media', suspicious: true, tagRequired: true, correctFeedback: 'The company name was left showing: Stillwater Media. Companies have to register with the state, so there\'ll be paperwork.' },
            { id: 'wh-address', text: 'Registrant Address: PO Box 441, Millhaven, OR 97411', suspicious: true, tagRequired: true, correctFeedback: 'A PO box in Millhaven — the town where Lena was last seen. The shield hid his name and left his postbox showing.' },
            { id: 'wh-ns', text: 'Name servers: dns1.namecheaphosting.com, dns2.namecheaphosting.com', wrongFeedback: 'Technical settings. Every site on that host has these.' },
            { id: 'wh-status', text: 'Status: clientTransferProhibited', wrongFeedback: 'A standard lock. Almost every domain has one.' },
          ],
          requiredTags: ['wh-privacy', 'wh-updated', 'wh-org', 'wh-address'],
          wrongTagLimit: 3,
          completionNote: "A company, a postbox, and a shield he put up five days after she started asking. He's hiding something.",
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
        monologue: 'His website names a company. The paper named the arts night staff.',
        content: {
          recordsLabel: 'Two records, side by side',
          records: [
            {
              label: 'Oregon Business Registry',
              meta: 'registered to PO Box 441, Millhaven',
              fields: [
                ['Cascade Sign & Print', 'Inactive — dissolved 2019'],
                ['Harbour Lane Rentals', 'Active — registered 2016'],
                ['Stillwater Media LLC', 'Active — registered 2018'],
              ],
            },
            {
              label: 'Millhaven Courier',
              meta: 'Arts Night write-up, credits line',
              fields: [
                ['Catering', 'Rosewood Kitchen'],
                ['Sound', 'Vale Audio'],
                ['Photography', 'Stillwater Media'],
                ['Flowers', 'Harbour & Vine'],
              ],
            },
          ],
          questions: [
            {
              prompt: 'The state records and the newspaper both name the same business. Which one?',
              acceptedAnswers: ['stillwater media', 'stillwater media llc', 'stillwater'],
              wrongFeedback: 'Look for the one name that appears on both lists.',
            },
            {
              prompt: 'What job did that business do at the arts night?',
              acceptedAnswers: ['photographer', 'photography', 'event photographer', 'event photography'],
              wrongFeedback: "Look at the Courier's list. Which job has that business next to it?",
            },
          ],
          completionNote: "Stillwater Media — the company on his website — was the official photographer at the arts night. He had a reason to be in every room.",
        },
        requiresCompleted: { path: 'C', nodeId: 'C4', hint: 'Find the newspaper archive in Thread C first — the arts night coverage is what confirms his name.' },
        unlocks: ['A11'],
      },

      // A9 — Browse: Twitter follow list — find stillwater_m follow of nightwatch_rc
      {
        id: 'A9',
        type: 'compare',
        path: 'A',
        title: "@nightwatch_rc and stillwater_m",
        tool: 'Twitter Archive',
        timestamp: { text: 'Maya\'s research — January', urgent: false },
        monologue: "He follows 47 accounts. One has never posted. Maya saved its page.",
        osintTip: {
          id: 'sock-puppets',
          title: 'Tying a Quiet Account to a Loud One',
          body: 'A second account kept for watching rather than talking leaves very little to search for: no posts, no photograph, no name. What it cannot help leaving is circumstance. Creation dates, the exact set of accounts it follows, a header image cropped from somewhere else and the hours it is active are all set by the same person on the same day, and they line up with the account they were made to watch from.',
          steps: [
            'Note the creation date and compare it against events in the loud account\'s history',
            'Compare the following lists — a watching account usually follows a small, telling subset',
            'Reverse image search the avatar and header; they are often crops of the other account\'s own pictures',
            'Compare posting hours and time zone across both accounts',
          ],
          tools: ['Wayback Machine (profile captures)', 'Reverse image search (TinEye, Google Lens)', 'Twitter advanced search', 'Account creation date lookups'],
        },
        // This was the fourth "read a list, flag two rows" in thread A. The
        // evidence is not that @nightwatch_rc looks odd — it is that four
        // separate things about it match stillwater_m exactly, and a match is
        // a thing you hold two documents up against each other to find.
        content: {
          prompt: 'Two profiles — link each detail to the one that matches it',
          left: {
            title: '@nightwatch_rc — the quiet account',
            items: [
              { id: 'n-created', label: 'Account created', text: '9 November — no posts since, ever' },
              { id: 'n-follows', label: 'Following (6)', text: '@stillwater_m · @stillwater_media · @c_marsh_pdx · @PDXmissing_news · @rvelasquez_reporter · @OregonStateRecords' },
              { id: 'n-header', label: 'Header image', text: 'A folding table under a brick wall. No caption. Uploaded the day the account was made' },
              { id: 'n-bio', label: 'Bio', text: 'Empty. No name, no location, no photograph. Two initials in the handle and nothing else' },
              { id: 'n-hours', label: 'Active hours', text: 'Reads the timeline between 11pm and 2am, Pacific' },
            ],
          },
          right: {
            title: 'stillwater_m — what Maya had on him',
            kicker: 'Each line says where she got it',
            items: [
              { id: 's-shield', label: 'WHOIS lookup', text: 'Privacy shield switched on 9 November, five days after Maya\'s first forum message' },
              { id: 's-corey', label: 'Forum posts, Dec 8 and Dec 22', text: 'The first person to name Corey Marsh, and the first to point anyone at his photographs' },
              { id: 's-gallery', label: 'His Flickr, April (Maya\'s saved copy)', text: 'His own photograph of the side gallery at the arts night: his kit on a folding table by the door' },
              { id: 's-handle', label: 'The handle', text: 'stillwater_m — the domain, the company and the forum account, all the same two words' },
              { id: 's-posts', label: 'Maya\'s log of his posts', text: '91 of his 104 forum posts went up between 11pm and 2am' },
            ],
          },
          pairs: [
            { left: 'n-created', right: 's-shield', required: true, feedback: 'Made on 9 November — the same day he put the shield up. He hid one account and opened another in the same sitting.' },
            { left: 'n-header', right: 's-gallery', required: true, feedback: "That is his own photograph. The header on the silent account is a crop of the picture stillwater_m posted from the arts night — the table, the brick, the same wall." },
            { left: 'n-follows', right: 's-corey', required: true, feedback: "Six accounts, and one of them is Corey Marsh. This is the account watching the man stillwater_m spent December pointing everybody at." },
            { left: 'n-hours', right: 's-posts', feedback: 'The same hours, down to the window. One man, awake at the same time, on two accounts.' },
            { left: 'n-bio', right: 's-handle', feedback: 'Two initials against two words. It is a pointer, not a name — but it is the only thing on the account he chose himself.' },
          ],
          wrongFeedback: 'Those two do not say the same thing. Look for a date, an image or a list that appears on both sides.',
          completionNote: "A silent account, opened the same day he hid his name, using a crop of his own photo, watching the man he spent December accusing. He made himself somewhere to watch from.",
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
        monologue: "Maya laid these out side by side. I need to see what she saw.",
        content: {
          cards: [
            { id: 'whois', label: 'Domain WHOIS', details: 'Shielded since November. Organisation: Stillwater Media. PO Box 441, Millhaven' },
            { id: 'twitter_rc', label: '@nightwatch_rc', details: 'Second Twitter account. Follows @stillwater_media, the company\'s own page. Two initials and nothing else' },
            { id: 'business', label: 'Stillwater Media', details: 'The organisation left showing on the registration' },
            { id: 'forum', label: 'stillwater_m', details: 'The forum account that knew private details about Lena' },
            { id: 'corey', label: 'c_marsh_pdx', details: 'Corey Marsh\'s Flickr — photos from an auto body shop in Tigard' },
          ],
          requiredConnections: [
            { from: 'forum', to: 'whois', label: 'The handle and the domain are the same words' },
            { from: 'whois', to: 'business', label: 'The registration names the business' },
            { from: 'business', to: 'twitter_rc', label: 'A business, and a second account keeping watch on it' },
          ],
          wrongFeedback: 'Look for shared names, initials, or ownership records.',
          completionNote: "A username, a website, a company and a postbox — all one person, and none of them a name. The record's hidden now. Maybe an older copy isn't.",
        },
        unlocks: ['A12'],
      },


      // A12 — Browse: the WHOIS record as it stood before the shield went up.
      // This is where Thread A finally puts a surname to the handle.
      {
        id: 'A12',
        type: 'diff',
        path: 'A',
        title: "WHOIS History — stillwater-media.net",
        tool: 'WHOIS History',
        timestamp: { text: 'now — Maya\'s apartment', urgent: true },
        monologue: "He hid the registration in November. A September copy survived.",
        osintTip: {
          id: 'whois-history',
          title: 'Historic WHOIS',
          body: 'Privacy protection only hides a record from today onwards. Several services keep dated snapshots of what a domain\'s registration said in the past, and archives of registration data outlive the moment someone decides to hide. If a record is redacted now, look for what it said before.',
          steps: [
            'Look up the domain in a WHOIS history service',
            'Put the snapshots side by side and read them field against field',
            'Take the registrant name and address from the last open snapshot',
            'Confirm the name against a second, independent record',
          ],
          tools: ['WhoisFreaks / WhoISrequest history', 'DomainTools Whois History', 'SecurityTrails', 'Wayback Machine (registrar pages)'],
        },
        // This used to be a third "open a record, flag the suspicious line".
        // Two dated snapshots of one registration is a comparison with an
        // objective answer: four fields say the same thing in September and
        // November, and three do not. You are not judging a record. You are
        // reading one column against the other, which is the whole technique.
        content: {
          prompt: 'Two snapshots of one registration — mark every field that changed',
          hint: 'Eight fields, saved ten weeks apart. Compare each row across.',
          before: {
            id: 'before', label: 'Snapshot — registration open', when: 'Captured 2 September',
            lines: [
              { id: 'b1', meta: 'Domain', text: 'stillwater-media.net' },
              { id: 'b2', meta: 'Privacy service', text: 'Not enabled', change: 'ch-shield' },
              { id: 'b3', meta: 'Registrant name', text: 'R. Callahan', change: 'ch-name' },
              { id: 'b4', meta: 'Registrant organisation', text: 'Stillwater Media' },
              { id: 'b5', meta: 'Registrant address', text: 'PO Box 441, Millhaven, OR 97411' },
              { id: 'b6', meta: 'Registrar', text: 'Namecheap, Inc.', wrongFeedback: 'The registrar is the same in both. He did not move the domain, he covered it.' },
              { id: 'b7', meta: 'Created', text: '11 May, four years ago', wrongFeedback: 'A creation date cannot change. That is the one field a registration can never rewrite.' },
              { id: 'b8', meta: 'Updated', text: '11 May, four years ago', change: 'ch-updated' },
            ],
          },
          after: {
            id: 'after', label: 'Snapshot — registration shielded', when: 'Captured 14 November',
            lines: [
              { id: 'a1', meta: 'Domain', text: 'stillwater-media.net' },
              { id: 'a2', meta: 'Privacy service', text: 'Enabled — Domains By Proxy, LLC', change: 'ch-shield' },
              { id: 'a3', meta: 'Registrant name', text: 'REDACTED FOR PRIVACY', change: 'ch-name' },
              { id: 'a4', meta: 'Registrant organisation', text: 'Stillwater Media', wrongFeedback: 'The company name survived the shield in both captures. It is the thing he forgot to hide, not the thing he changed.' },
              { id: 'a5', meta: 'Registrant address', text: 'PO Box 441, Millhaven, OR 97411', wrongFeedback: 'The same postbox, before and after. Same man — it is not what changed.' },
              { id: 'a6', meta: 'Registrar', text: 'Namecheap, Inc.' },
              { id: 'a7', meta: 'Created', text: '11 May, four years ago' },
              { id: 'a8', meta: 'Updated', text: '9 November', change: 'ch-updated' },
            ],
          },
          changes: [
            { id: 'ch-name', revealsName: true, feedback: "R. Callahan. That is what the registration said in September, and it is what the shield went up to cover." },
            { id: 'ch-shield', feedback: 'A privacy service, switched on between the two captures. Somebody decided in November that this record should stop being readable.' },
            { id: 'ch-updated', feedback: "Updated on 9 November. Maya posted her first question on the forum on 4 November. He took five days to think about it." },
          ],
          completionNote: "Three fields changed and five didn't. The company stayed, the postbox stayed — and the name went. R. Callahan, PO Box 441. He hid it five days after my daughter asked her first question.",
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
        monologue: 'The forum blamed the ex-boyfriend. His own camera says where he was.',
        osintTip: null,
        content: {
          prompt: 'Put each photograph in the two-hour block it was really taken',
          note: 'Flickr shows when a photo was uploaded, not when it was taken. The camera writes the real time into the photo\'s hidden data (EXIF), in UTC. Portland in April is seven hours behind UTC.',
          photos: [
            { id: 'cm-001', filename: 'chevelle_primer_01.jpg', where: 'Auto body shop, Tigard', uploaded: 'Apr 13 · 9:12am', exif: '2024:04:13 02:54 UTC', day: 'd12', hour: 19.9, required: true,
              correctFeedback: '7:54pm on Friday, at the body shop in Tigard — nowhere near her street.',
              wrongFeedback: 'Not that block. Take seven hours off the camera\'s clock — and watch the date roll back.',
              traps: [
                { day: 'd13', hour: 9, feedback: 'That\'s when he uploaded it, the next morning. The camera\'s clock says when it was taken.' },
                { day: 'd13', hour: 2, feedback: 'That\'s the camera\'s clock, still in UTC. Portland is seven hours behind — which puts it on the Friday.' },
              ] },
            { id: 'cm-002', filename: 'late_shift_apr12.jpg', where: 'Auto body shop, Tigard', uploaded: 'Apr 13 · 9:14am', exif: '2024:04:13 06:38 UTC', day: 'd12', hour: 23.6, required: true,
              correctFeedback: '11:38pm on Friday, still at the shop. Whoever was near her flat that night, it wasn\'t Corey.',
              wrongFeedback: 'Not that block. Seven hours back from the camera\'s clock.',
              traps: [
                { day: 'd13', hour: 9, feedback: 'That\'s the upload, the next morning. Use the camera\'s time.' },
                { day: 'd13', hour: 6, feedback: 'Still UTC. Take seven hours off — it lands late on the Friday.' },
              ] },
            { id: 'cm-003', filename: 'paint_booth_apr13.jpg', where: 'Auto body shop, Tigard', uploaded: 'Apr 14 · 10:02am', exif: '2024:04:14 04:40 UTC', day: 'd13', hour: 21.7, required: true,
              correctFeedback: '9:40pm on Saturday, in the paint booth. The arts night was forty miles south.',
              wrongFeedback: 'Not that block. The EXIF date is the 14th in UTC. Seven hours back is still Saturday.',
              traps: [
                { day: 'd13', hour: 4, feedback: 'That\'s UTC with the date ignored. Seven hours back from 4:40am on the 14th is Saturday night.' },
              ] },
          ],
          // What the case already knows about those two nights. The strip used
          // to be twelve empty cells over a quarter-panel of nothing; the
          // hours are what you are placing the photographs against, so they
          // belong on the page rather than in the hint.
          days: [
            // Every fact here now says where it came from. The player asked,
            // fairly, how they were meant to rule Corey out against Lena's hours
            // before anything had shown them Lena's hours — and one line used to
            // describe a photograph only thread A's map lead reveals.
            { id: 'd12', label: 'Friday, April 12', facts: [
              { at: '5:40pm', text: 'Lena leaves her studio.', from: 'lena_timeline.txt' },
              { at: 'evening', text: 'The forum says someone was watching her street tonight — and blames Corey.', from: 'c_marsh_crossref.txt' },
              { at: '11:10pm', text: 'Her phone stops moving, at her flat.', from: 'lena_timeline.txt' },
            ] },
            { id: 'd13', label: 'Saturday, April 13', facts: [
              { at: '6:41pm', text: 'Her last post, from the doorway of the hall.', from: 'lena_timeline.txt' },
              { at: '7:45pm', text: 'She gives a talk in the main hall.', from: 'lena_timeline.txt' },
              { at: '10:00pm', text: 'The hall closes. Nobody saw her leave.', from: 'lena_timeline.txt' },
            ] },
          ],
          windows: [
            { day: 'd12', from: 19, to: 24, label: 'When someone was said to be watching her street' },
            { day: 'd13', from: 19, to: 22, label: 'The arts night, Millhaven' },
          ],
          completionNote: "Both nights he was at the same body shop in Tigard, miles from either place. Corey Marsh wasn't the man.",
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
        monologue: "Somebody set fire to her notebook and pulled the smoke alarm down. They didn't stay to watch it burn.",
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
              text: "found the forum through a reddit thread. a missing woman \u2014 lena vasquez, 29. went by @velvet.echo. missing since april.\n\npolice say \"no evidence of foul play\". the forum doesn't buy it. neither do I.\n\nposted my first question tonight (nov 4). going to do this properly.",
              targetBrightness: 145,
              targetContrast: 170,
              tolerance: 30,
            },
            {
              id: 'b-p2',
              date: 'November — later',
              text: "hundreds of people on this forum. most of them mean well. most of them are all over the place.\n\none account keeps turning up: stillwater_m. joined a month after she went missing. says he's from millhaven.\n\nhe knows stuff about lena I can't find ANYWHERE public. her schedule. her routine. how??\n\nreading every single thing he's ever posted.",
              targetBrightness: 135,
              targetContrast: 180,
              tolerance: 28,
            },
            {
              id: 'b-p3',
              date: 'December',
              text: "six months of his posts. read every one.\n\nhe acts worried, fine. but he's weirdly exact about private stuff nobody posted, and vague about stuff everyone knows. that's backwards.\n\npriya (lena's flatmate) says she'll meet me. she's giving me her own copy of what she told the police.\n\nneed to find out who he is. starting with the forum.",
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
        type: 'connect',
        path: 'B',
        title: "PDXmissing Forum — What He Should Not Have Known",
        tool: 'Forum Archive',
        timestamp: { text: 'December into January', urgent: false },
        monologue: "Maya went through the forum post by post, like a court file.",
        osintTip: {
          id: 'forum-archive',
          title: 'Checking an Account Next to What Was Public',
          body: 'Forum archives are easy to collect and hard to use. The useful pass is not "which post sounds sinister" — tone proves nothing — but "what does this post contain, and where else does that detail exist?" Build the public record first: press releases, published statements, what the forum itself already said and on what date. Then every claim either has a public source or it does not, and the ones that do not are the whole case.',
          steps: [
            'Pull the account\'s full post history with dates',
            'Establish what was public, and on what date it became public',
            'Separate a detail that was repeated from one that was introduced',
            'Treat "someone told me" as a claim about a person, not a citation',
          ],
          tools: ['Google: site:forum.com "username"', 'Wayback Machine', 'Police press releases', 'Court dockets'],
        },
        // Was a fifth "read the thread, flag five rows", which is a tone
        // judgement. Four of his posts, four places a detail could have come
        // from: you are asked to source each claim, and two of them have no
        // source that is not her.
        content: {
          prompt: 'Where could he have learned that?',
          boardHint: 'Four of his posts. For each one, pin the post, then the place he could have learned it.',
          cards: [
            { id: 'q-route', label: 'Jan 4 — stillwater_m', details: '"Someone told me she had a Tuesday routine — coffee on Burnside before class. Worth checking?"' },
            { id: 'q-corey', label: 'Dec 8 — stillwater_m', details: '"The ex deserves more attention. Corey Marsh. I\'ve seen things online."' },
            { id: 'q-room', label: 'Dec 15 — stillwater_m', details: '"I know that building. Happy to help identify faces."' },
            { id: 'q-flickr', label: 'Dec 22 — stillwater_m', details: '"Corey Marsh\'s Flickr has location data near her neighborhood. Someone should look."' },
            { id: 'src-press', label: 'Police press release, Apr 18', details: 'Name, age, the evening she was last seen, what she was wearing. No venue, no address, nothing about her week.' },
            { id: 'src-thread', label: 'The forum thread, before Dec 8', details: 'Two hundred posts, and nobody had named a suspect.' },
            { id: 'src-flickr', label: 'c_marsh_pdx on Flickr', details: 'A public photo album with location data left on. Open a photo and it shows where it was taken.' },
            { id: 'src-nowhere', label: 'Nowhere public', details: 'Not in a paper, not on her profile, not in the thread. Known to her flatmate, her mother, and whoever was watching her.' },
          ],
          requiredConnections: [
            { from: 'q-route', to: 'src-nowhere', label: "Her Tuesday route has no public source — and \"someone told me\" has no name on it" },
            { from: 'q-room', to: 'src-nowhere', label: 'Nobody publishes what the inside of that hall looks like. He knows the room.' },
            { from: 'q-corey', to: 'src-thread', label: 'Nobody had named a suspect before him. He didn\'t repeat Corey\'s name — he introduced it.' },
            { from: 'q-flickr', to: 'src-flickr', label: "He had opened Corey's photographs himself before he sent everybody to them" },
          ],
          wrongFeedback: "He couldn't have learned that there. Ask where that detail was public — the press release, the forum, an open photo album — or whether it wasn't public anywhere.",
          completionNote: "Two of his posts had a public source. Two didn't come from anywhere public — and between them he gave the forum a suspect nobody had mentioned. Maya underlined every one in red.",
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
        title: "Forum Posts and Priya's Statement",
        tool: 'Cross-reference',
        timestamp: { text: 'February — Maya refining her research', urgent: false },
        monologue: "Maya put Priya's statement next to his posts.",
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
            kicker: 'Priya Raman\'s own copy, taken 16 April. Never released to the press.',
            items: [
              { id: 'st-name', label: 'Deponent', text: 'Priya Raman, flatmate. Name withheld from all public releases.' },
              { id: 'st-words', label: 'In her words', text: '"She\'d been waiting for something to end. That\'s how she put it."' },
              { id: 'st-exits', label: 'Officer\'s note', text: 'Venue walk-through: two fire exits and a private stair off the east gallery.' },
              { id: 'st-press', label: 'Released publicly', text: 'The university, the date, and the appeal for witnesses. Nothing else.' },
            ],
          },
          pairs: [
            { left: 'dp-03', right: 'st-name', required: true, feedback: "He used her flatmate's name in December. It was in this statement and nowhere else. Not in a paper, not on the forum." },
            { left: 'dp-06', right: 'st-words', required: true, feedback: 'Word for word from her police interview. You can\'t learn a sentence nobody ever printed.' },
            { left: 'dp-04', right: 'st-exits', feedback: 'He knows the exits the officer had to be shown. You only learn that by working in the building.' },
            { left: 'dp-01', right: 'st-press', feedback: 'Everyone complained about the police. That much was public.' },
          ],
          wrongFeedback: 'Those two do not say the same thing.',
          completionNote: "He had her flatmate's name and her exact words months before anyone printed either. He knew things only someone close to Lena could know.",
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
        monologue: 'Maya wrote two notes beside his posts. Where did each come from?',
        content: {
          questions: [
            {
              prompt: "He wrote 'waiting for something to end' on the forum. Where were those words first written down?",
              contextNote: "They were never in the news. Think about who first said them, and to whom.",
              acceptedAnswers: ['police report', 'police interview', 'police file', 'priyas interview', 'priya interview', 'interview', 'police statement', 'statement'],
              wrongFeedback: "Think about who first said it, and who wrote it down. It was never public.",
              hintFeedback: "Priya said it to the police. It came from her police interview.",
            },
            {
              prompt: "stillwater_m, stillwater-media.net. Where does the word 'stillwater' come from?",
              acceptedAnswers: ['company', 'business', 'his company', 'stillwater media', 'the business', 'firm', 'his business', 'company name', 'old company', 'dissolved company'],
              wrongFeedback: "It's not a place or a mood. The same word is registered with the state, as a business.",
              hintFeedback: "Stillwater Media — the company on the registration. He posts under the name he files paperwork under.",
            },
          ],
          completionNote: "Priya said it to the police. He said it on a forum. Maya wrote both in the margin and drew a line between them. He'd read her statement.",
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
        monologue: "Maybe the old copy still shows what he removed.",
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
          idleBody: [
            "The live site is four photos and a contact form. Somebody tidied it.",
            "This copy was saved in November, before he did. Don't read the page. Look at the code underneath it.",
          ],
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
        monologue: "His site shows no names. Its code might.",
        content: {
          questions: [
            {
              prompt: 'Who built this website?',
              contextNote: 'Websites often name their author in the code, where visitors don\'t look.',
              revealsName: true, acceptedAnswers: ['ray callahan', 'callahan', 'r callahan'],
              wrongFeedback: 'Look at the <meta name="author" content="..."> tag in the page source.',
            },
            {
              prompt: 'What name did he log in under?',
              contextNote: 'Somewhere in the code there\'s a login name.',
              acceptedAnswers: ['rcallahan_admin', 'rcallahan'],
              wrongFeedback: 'Look for the wp-user meta tag and the HTML comment beginning with "<!-- Site built by..."',
            },
          ],
          completionNote: "Ray Callahan. Login: rcallahan_admin. My best friend's name, in the code of the website behind that account.",
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
        monologue: "The last pages. The fire got most of them.",
        systemAlertAfter: true,
        content: {
          // presentation only: the last pages are the ones the fire reached
          paper: 'last',
          pages: [
            {
              id: 'b-p13',
              date: 'feb 19',
              text: 'he has a key to dad\'s house. dad gave it to him years ago.\n\nhe knows the wifi password.\n\nif I email dad, he might see it first.',
              targetBrightness: 150,
              targetContrast: 190,
              tolerance: 22,
            },
            {
              id: 'b-p17',
              date: 'mar 7',
              text: 'he was at dinner last week. I sat across from him and watched him talk to dad about football.\n\nI think he knows I know.',
              targetBrightness: 148,
              targetContrast: 185,
              tolerance: 24,
            },
            {
              id: 'b-p18',
              date: 'mar 9, late',
              text: 'started the email to dad.\n\ngot as far as his name. deleted it.\n\nif he can get into this laptop he sees the draft before morning.',
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
        monologue: "She wrote to me the night before. I never got to read it.",
        osintTip: {
          id: 'email-drafts',
          title: 'Mailbox Forensics',
          body: 'A mailbox is not its inbox. Mail clients file messages into folders that a casual reader never opens, and each folder means something different about intent: what was received, what was answered, what was begun. Timestamps matter more than content — creation, modification and auto-save each place a person at a keyboard at a known moment.',
          steps: [
            'Enumerate every folder the account has before reading any of them',
            'Read metadata first: created, modified, auto-saved, last opened',
            'Build a timeline of activity and find where it stops',
            'Ask what a message\'s folder says about what the writer meant to do',
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
        monologue: "She kept a corkboard on the wall by her desk. Photos, string, notes.",
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
          prompt: 'Move the glass across the board. Flag the three things Maya marked in red',
          plate: 'cork',
          items: [
            { id: 'cp-01', spot: { x: 3, y: 6, w: 17, h: 27 }, text: 'Lena\'s profile page, printed off. The handle is ringed: @velvet.echo.', wrongFeedback: 'Pencil, not red. Lena\'s public profile — Maya kept it for reference.' },
            { id: 'cp-02', spot: { x: 23, y: 4, w: 18, h: 23 }, text: 'A forum screenshot. The first post that account ever made.', wrongFeedback: 'The account Maya was investigating. Background — not one of her red marks.' },
            { id: 'cp-03', spot: { x: 44, y: 8, w: 30, h: 35 }, text: 'The arts night photograph. She has ringed the table by the door, hard enough to score the paper. Under it, in her hand: whose is this?', suspicious: true, correctFeedback: "She ringed the table by the door, hard enough to score the paper. She didn't write a name under it. She wrote: whose is this?", tagRequired: true },
            { id: 'cp-04', spot: { x: 77, y: 6, w: 20, h: 31 }, text: 'A map of Millhaven. Three pins joined with string, each labelled in her hand.', suspicious: true, correctFeedback: "A map of Millhaven with three places joined by red string.", tagRequired: true },
            { id: 'cp-05', spot: { x: 5, y: 40, w: 20, h: 31 }, text: 'Lena\'s last post. Brick and a doorway behind her. Maya has ringed the doorway and written under it: same building.', suspicious: true, correctFeedback: "Same brick, same door. Lena's last post was taken outside the building she walked into and never came out of. Maya pinned the two together.", tagRequired: true },
            { id: 'cp-06', spot: { x: 29, y: 47, w: 23, h: 27 }, text: 'A clipping from the Courier about the arts night. She has run a highlighter through the photo credit.', suspicious: false, wrongFeedback: "Yellow highlighter, not red. The credit matters — it's the next lead — but this isn't one of her red marks." },
            { id: 'cp-07', spot: { x: 56, y: 51, w: 21, h: 27 }, text: 'A printout of the domain\'s registration. One line is marked: the address.', wrongFeedback: 'Yellow highlighter, not red. She printed this from the laptop — it\'s background.' },
            { id: 'cp-08', spot: { x: 87, y: 73, w: 11, h: 15 }, text: 'The corner of a yellow sticky note, poking out from behind the board. A name starts on it: Rosa V—', suspicious: false, wrongFeedback: "No red on it. It's tucked behind the board. Worth turning the board over later." },
          ],
          requiredTags: ['cp-03', 'cp-04', 'cp-05'],
          wrongTagLimit: 3,
          completionNote: "Three things in red: the table ringed in the photo, the map with its string, and the doorway in Lena's last post. The pencil and highlighter were just her reading.",
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
        monologue: "She printed the arts night photo big and pinned it up.",
        content: {
          prompt: 'Find the three things that say who worked this room',
          plate: 'gallery',
          imageAlt: 'A side gallery at the arts night: a folding table by the door with a printed sign and a stack of cards, a framed clock on the brick wall, a camera bag on the floor, empty chairs.',
          items: [
            { id: 'ca-sign', spot: { x: 17, y: 54, w: 25, h: 32 }, text: 'A sign standing on the folding table, facing the door.', suspicious: true, correctFeedback: "STILLWATER MEDIA · EVENT PHOTOGRAPHY — the same words as the username and the website. He wasn't a guest here. He was hired.", tagRequired: true },
            { id: 'ca-cards', spot: { x: 21, y: 90, w: 9, h: 9 }, text: 'A stack of business cards on the shelf below the sign.', suspicious: true, correctFeedback: "Business cards for anyone who wanted the photographer's details. Whoever worked this room was working under that name.", tagRequired: true },
            { id: 'ca-screen', spot: { x: 45.5, y: 33.5, w: 13.5, h: 16 }, text: 'A screen on the brick wall, playing photographs one after another. The one showing is a road at dusk.', suspicious: true, correctFeedback: "A slideshow of landscape photos beside his table — the same kind of pictures stillwater_m posts on Flickr. The photographer at this table and the account Maya was chasing take the same photos.", tagRequired: true },
            { id: 'ca-clock', spot: { x: 36.5, y: 35, w: 8.5, h: 12 }, text: 'A small framed clock on the wall beside the screen.', wrongFeedback: "A clock gives you a time, not a person. Remember it, though." },
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
        monologue: "I need to know what that building is called.",
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
              contextNote: "Maya labelled the main place on her corkboard map.",
              acceptedAnswers: ['alder hall', 'the alder hall', 'alder'],
              wrongFeedback: "Read the label Maya wrote on the map pin. It is a hall on Main Street.",
            },
            {
              prompt: 'Where would you look to find out who officially organised the Millhaven Arts Night?',
              contextNote: "Big public events need a permit from the city, and the permit names the organiser. The local paper covers them too.",
              acceptedAnswers: ['city clerk', 'permit', 'event permit', 'permits', 'county', 'county clerk', 'county records', 'city', 'city records', 'city hall', 'clerk', 'records', 'public records', 'newspaper', 'paper', 'courier', 'millhaven courier', 'news', 'local newspaper', 'archive', 'archives'],
              wrongFeedback: "Think about what public record would list an event's organizer. Hint: large public events require official permits.",
            },
          ],
          completionNote: "Alder Hall, on Main Street in Millhaven. A family trust has owned it since 1944. The listing doesn't say which family.",
        },
        unlocks: ['C4'],
      },

      // C4 — Browse: newspaper archive — find matching building
      {
        id: 'C4',
        type: 'connect',
        path: 'C',
        title: "Millhaven Courier — Archive Search",
        tool: 'Newspaper Archive',
        timestamp: { text: 'verifying through press records', urgent: false },
        monologue: "Maya found three pieces in the Courier's archive.",
        osintTip: {
          id: 'newspaper-archive',
          title: 'Local Newspaper Archive Research',
          body: 'Local newspapers publish event listings, business announcements, court summaries and community notices that never appear in larger outlets. Read singly they are trivia. Read against each other they are a record of who was where and who owned what, because a small paper covers the same few streets for decades — and a credit line, a property notice and a court summary will name the same postbox without ever naming the man.',
          steps: [
            'Search the newspaper\'s website directly for the person\'s name and their company',
            'Try Google: site:newspaper.com "person name"',
            'Read the small print — credits, notices and summaries carry the detail the story does not',
            'Contact the local library; many maintain print archive rooms',
          ],
          tools: ['Newspapers.com', 'ProQuest', 'GenealogyBank', 'Local library archives', 'Chronicling America (Library of Congress)'],
        },
        // Was a sixth "open a record, flag the suspicious line". The Courier
        // pieces mean nothing apart and everything together, which is what
        // the lead now asks for: join each cutting to the thing it confirms.
        content: {
          prompt: 'Match each newspaper cutting to a record Maya kept',
          boardHint: 'Pin a cutting, then the thing it confirms.',
          cards: [
            { id: 'cut-credit', label: 'Apr 15 — the arts night (Spring Exhibition)', details: '"Event photography provided by Stillwater Media." 400 attended. Director Owen Pryce declined to release the guest list' },
            { id: 'cut-lena', label: 'Apr 15 — same piece', details: '"Lena Vasquez, who has not been seen since the event, is noted as having attended"' },
            { id: 'cut-hall', label: '3 years ago — Historic Register', details: 'Alder Hall, built 1944, held by a family trust. "The Courier\'s request for comment went to a PO box"' },
            { id: 'cut-court', label: '4 years ago — Court Records', details: '"A Millhaven man" issued a restraining order. Case MH-2021-0384. "The Courier does not publish names in these cases"' },
            { id: 'brd-domain', label: 'stillwater-media.net', details: 'The registration printout on Maya\'s corkboard. Company: Stillwater Media. PO Box 441, Millhaven' },
            { id: 'brd-lastseen', label: 'Last confirmed sighting', details: 'From Maya\'s corkboard: Lena\'s last post, from the doorway of a hall, the night she disappeared' },
            { id: 'brd-clerk', label: 'Marion County Court website', details: 'Type in any case number and you get the full filing — including the names the paper leaves out' },
          ],
          requiredConnections: [
            { from: 'cut-credit', to: 'brd-domain', label: 'The paper credits the same company that\'s on the website registration. Whoever runs that account was working the night she vanished.' },
            { from: 'cut-lena', to: 'brd-lastseen', label: 'The paper puts Lena at the arts night. Her own last post puts her in the doorway of it' },
            { from: 'cut-court', to: 'brd-clerk', label: 'The paper left out the name but printed the case number. The court website will show the name.' },
          ],
          wrongFeedback: 'Those two do not confirm each other. Look for the same company, the same place, or the same reference number.',
          completionNote: "The photo credit, Lena at the arts night, and a court case number the paper printed instead of a name. Three pieces of the same story.",
        },
        unlocks: ['C5', 'C9'],
      },

      // C9 — Compare: the gallery photo against the printed programme
      {
        id: 'C9',
        type: 'compare',
        path: 'C',
        title: "Arts Night — Photo and Programme",
        tool: 'Cross-reference',
        timestamp: { text: 'the photo again, with a name', urgent: false },
        monologue: "Maya kept the printed programme from that night pinned next to the photo.",
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
        monologue: 'Companies must register with the state, under a real name.',
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
          completionNote: "Raymond T. Callahan. On both of them.",
        },
        unlocks: ['C6'],
      },

      // C6 — Tag: tag key facts in court record
      {
        id: 'C6',
        type: 'diff',
        path: 'C',
        title: "Marion County Court — Case MH-2021-0384",
        tool: 'Court Records',
        timestamp: { text: 'pulling the court record', urgent: true },
        monologue: "The paper left the names out. The court's copy doesn't.",
        osintTip: {
          id: 'court-records',
          title: 'Public Court Record Access',
          body: 'Court filings are public records in the US unless specifically sealed by a judge. Newspapers routinely withhold names in harassment and civil-protection cases as a matter of editorial policy — the court does not. A case number printed in a press summary is the key to the unredacted filing behind it, and the difference between the two documents is often the whole story.',
          steps: [
            'Take the case number out of the newspaper summary',
            'Search the state\'s court case lookup portal for that number',
            'Read the filing against the published summary, line for line',
            'Federal cases: PACER.gov, or CourtListener for free copies',
          ],
          tools: ['Oregon eCourt Case Information', 'PACER (federal)', 'CourtListener (free federal)', 'RECAP Archive'],
          warning: 'Sealed records are sealed for legal reasons — do not attempt to access them through unofficial means.',
        },
        // Was a fourth "open a record, flag the suspicious line". The Courier
        // told you in C4 that it does not publish names in these cases; this
        // is that sentence made playable. Same case, two documents, and what
        // the paper left out is the entire point.
        content: {
          prompt: 'The printed summary against the clerk\'s copy — mark what the paper withheld',
          hint: 'Same case, same day, seven lines each. Read the paper against the filing.',
          before: {
            id: 'before', label: 'Millhaven Courier — court summary', when: 'As printed',
            lines: [
              { id: 'p1', meta: 'Case', text: 'Case number MH-2021-0384', wrongFeedback: 'The case number is identical in both — it is how you found the filing in the first place.' },
              { id: 'p2', meta: 'Respondent', text: '"A Millhaven man"', change: 'ch-resp' },
              { id: 'p3', meta: 'Petitioner', text: '"the complainant"', change: 'ch-pet' },
              { id: 'p4', meta: 'Conduct alleged', text: '"a harassment complaint"', change: 'ch-conduct' },
              { id: 'p5', meta: 'Method', text: '— not reported —', change: 'ch-method' },
              { id: 'p6', meta: 'Order', text: 'Must keep 300 yards from the complainant', wrongFeedback: 'The distance is in both documents. Standard order language, printed as filed.' },
              { id: 'p7', meta: 'Outcome', text: 'Order granted, two years. Expired, no renewal sought.', wrongFeedback: 'Both say the order was granted and left to expire. Nothing was held back here.' },
            ],
          },
          after: {
            id: 'after', label: 'Marion County Court — civil filing', when: 'As filed',
            lines: [
              { id: 'c1', meta: 'Case', text: 'Case number MH-2021-0384' },
              { id: 'c2', meta: 'Respondent', text: 'Raymond T. Callahan, PO Box 441, Millhaven, OR', change: 'ch-resp' },
              { id: 'c3', meta: 'Petitioner', text: 'K. Nair', change: 'ch-pet' },
              { id: 'c4', meta: 'Conduct alleged', text: '"a pattern of unwanted contact and surveillance over a period of eight months"', change: 'ch-conduct' },
              { id: 'c5', meta: 'Method', text: '"Creating online profiles to follow Petitioner\'s activities under pseudonymous accounts"; "Monitoring Petitioner\'s email account without consent"; "Appearing at locations known only through Petitioner\'s private communications"', change: 'ch-method' },
              { id: 'c6', meta: 'Order', text: 'Must keep 300 yards from the complainant' },
              { id: 'c7', meta: 'Outcome', text: 'Order granted, two years. Expired, no renewal sought.' },
            ],
          },
          changes: [
            { id: 'ch-resp', revealsName: true, feedback: "The paper said \"a Millhaven man\". The court names Raymond T. Callahan, PO Box 441." },
            { id: 'ch-pet', feedback: 'K. Nair. She has a name too, and she went to a judge four years before any of this.' },
            { id: 'ch-conduct', feedback: 'The paper says "a harassment complaint". The filing says eight months of contact and surveillance. The summary isn\'t wrong — it\'s just easy to skim past.' },
            { id: 'ch-method', feedback: "Fake accounts. Reading her email. Turning up where she'd only written that she'd be. The paper printed none of it. A judge wrote it all down four years ago. And Ray has had a key to my house for twenty years." },
          ],
          completionNote: "Four years ago, a different woman. He denied it, no charges were filed, and the order ran out after two years. The same things he's doing now — and the Courier just called him \"a Millhaven man\".",
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
            { id: 'domain', label: 'stillwater-media.net', details: 'Registration printout on her board: Stillwater Media, PO Box 441, Millhaven' },
            { id: 'business', label: 'Stillwater Media LLC', details: 'Business registry: Raymond T. Callahan, PO Box 441' },
            { id: 'username', label: 'stillwater_m', details: 'The forum account that knew Lena\'s private details.' },
            { id: 'court', label: 'Case MH-2021-0384', details: 'Restraining order against Raymond T. Callahan: fake accounts, reading her email.' },
            { id: 'photo', label: 'Arts Night Photo', details: 'Stillwater Media, Ray Callahan\'s company, was the official photographer at Alder Hall in Millhaven, where Lena was last seen.' },
            { id: 'priya', label: 'Priya (roommate)', details: 'Told police Lena was "waiting for something to end." Reported her missing Apr 15.' },
          ],
          requiredConnections: [
            { from: 'domain', to: 'business', label: 'Same company, same PO Box 441' },
            { from: 'business', to: 'username', label: 'Stillwater Media → stillwater_m username' },
            { from: 'username', to: 'court', label: 'Fake accounts — the same thing the court order describes' },
            { from: 'court', to: 'photo', label: 'Same person: Raymond T. Callahan' },
            { from: 'photo', to: 'domain', label: 'Both in Millhaven: the photographer and the website\'s postbox' },
          ],
          wrongFeedback: 'No direct connection between those two. Try a different pair — look for shared names, addresses, or behaviors.',
          completionNote: "All five records give the same address.",
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
          idleBody: [
            "I've read everything on the front of this board. It's all in my notes already.",
            "So I'm turning it over. Whatever she didn't want on show is on the back.",
          ],
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
