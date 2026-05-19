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
        timestamp: { text: '3 days before Maya disappeared', urgent: false },
        monologue: "The screen was still on when I found it. She was in the middle of a search.",
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
                { name: 'lena_timeline.txt', type: 'file', content: 'LENA VASQUEZ — TIMELINE\n\nApr 14 — Last confirmed location: Millhaven Arts Night (Instagram post, @velvet.echo)\nApr 15 — No posts, no replies, phone off\nApr 16 — Reported missing by flatmate\nApr 17 — Police file: "no evidence of foul play"\n\nFlatmate said she\'d been anxious for weeks. Said she was "waiting for something to end."' },
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
                  { name: 'velvet_echo_profile.png', type: 'file', content: '[Screenshot — @velvet.echo forum profile, joined 14 months prior, 847 posts, last active April 14]' },
                  { name: 'thread_nov_missing.png', type: 'file', content: '[Screenshot — forum thread: "Still looking for Lena" — 23 replies, mostly concerned community members]' },
                ]},
                { name: 'suspect_research', type: 'folder', children: [
                  { name: 'c_marsh_crossref.txt', type: 'file', handwritten: false, content: 'COREY MARSH — PERSON OF INTEREST\nCreated: Feb 4\nLast modified: Feb 15\n\nCorey Marsh. Lena\'s ex-boyfriend from before she moved to Portland.\n\nInitially flagged by forum member "stillwater_m" as obsessive.\nWent through his Reddit, Twitter archive, Flickr.\n\nHis Flickr has photos that look like they were taken near Lena\'s street. I need to pull the EXIF data from those photos. If he\'s taking pictures outside her apartment, I\'m calling the police.' },
                  { name: 'username_scan_results_OLD.txt', type: 'file', content: 'USERNAME SCAN — c_marsh_pdx\nRun: Feb 4\n\nReddit: Active (u/c_marsh_pdx) — r/classiccars, r/Portland, r/mechanicadvice\nTwitter: Active\nFlickr: Active (c_marsh_pdx)\nForum (PDXmissing): Not registered\n\n—\n\nNeed to run the same scan on stillwater_m.\nFlickr may have gone private by now — check Wayback Machine for cached public versions before the profile was locked.' },
                ]},
                { name: 'NOTES_DO_NOT_DELETE.txt', type: 'file', handwritten: true, content: 'The account pushing Corey as a suspect is stillwater_m.\n\nThis account knew Lena went to specific coffee shops she never mentioned online.\nKnew her university schedule.\nKnew her flatmate\'s name before I posted it anywhere.\n\nWho is stillwater_m?\n\nStarted forum account 14 months ago — one month after Lena disappeared.\nPost history is too clean. The concern sounds real but the knowledge is wrong.\n\nI need to find the person behind this handle.\n\n——\n\nChecked for a Twitter account. The link in the forum bio leads nowhere. Username search returns nothing — account is gone.' },
              ]},
              { name: 'photos', type: 'folder', children: [
                { name: 'us_christmas_2023.jpg', type: 'file', content: '[Photo — Tom and Maya at the kitchen table, Christmas morning. Ray Callahan visible in the background, out of focus, holding a cup of coffee. His hand rests on the back of Maya\'s chair.]\n\nMetadata: "Ray\'s been at every Christmas since I was twelve. He was always around. — M"' },
                { name: 'maya_bday_2024.jpg', type: 'file', content: '[Photo — Maya blowing out candles, birthday cake. Ray Callahan is leaning in from the right side of the frame. He has a hand on Maya\'s shoulder.]' },
              ]},
            ],
          },
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
        timestamp: { text: '3 days before Maya disappeared', urgent: false },
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
          variant: 'reddit-profile',
          username: 'stillwater_m',
          joinDate: '14 months ago',
          karma: 4329,
          posts: [
            { id: 'sm-001', subreddit: 'r/PDXmissing', date: 'Apr 28', text: 'A year since Lena disappeared. Still thinking about her family. The forum has done more than the police ever did.', suspicious: false, wrongFeedback: 'Genuine condolence post. Nothing unusual about the content.' },
            { id: 'sm-002', subreddit: 'r/Portland', date: 'Apr 12', text: 'Great weather for cycling the waterfront trail today. Anyone else doing the loop?', suspicious: false, wrongFeedback: 'Normal local activity post. No case relevance.' },
            { id: 'sm-003', subreddit: 'r/PDXmissing', date: 'Mar 22', text: 'I keep thinking about those coffee shop sightings. People reported seeing her at Coava but the timestamps never matched. Wasn\'t that near her Tuesday route?', suspicious: true, correctFeedback: "Lena's Tuesday route was never posted publicly. How does this account know it?", tagRequired: true },
            { id: 'sm-004', subreddit: 'r/classiccars', date: 'Mar 14', text: "Finally tracked down a set of original '67 Chevelle trim pieces. Worth the three months of searching.", suspicious: false, wrongFeedback: "Classic car enthusiasm. This matches Corey Marsh's posts, not this user's pattern." },
            { id: 'sm-005', subreddit: 'r/PDXmissing', date: 'Mar 9', text: 'Has anyone else looked closely at the ex-boyfriend angle? The things I\'ve read about Corey Marsh... I think he\'s the one the police should be looking at.', suspicious: false, wrongFeedback: "Pushing the Corey angle. Maya already eliminated him. But the post itself isn't suspicious by content — it's the misdirection." },
            { id: 'sm-006', subreddit: 'r/photography', date: 'Feb 28', text: 'Shot this at the Millhaven Arts Night last spring. Loved the way the old building caught the dusk light.', suspicious: true, correctFeedback: "Stillwater_m was at the Millhaven Arts Night. So was Lena — it was her last confirmed location.", tagRequired: true },
            { id: 'sm-007', subreddit: 'r/Portland', date: 'Feb 19', text: 'Parking enforcement on NW 23rd is brutal on Saturdays. Learned that the hard way.', suspicious: false, wrongFeedback: 'Normal local frustration post.' },
            { id: 'sm-008', subreddit: 'r/PDXmissing', date: 'Jan 30', text: 'Someone posted about her university — I want to be careful what we share publicly. Her schedule and campus info should stay off-thread for her family\'s sake.', suspicious: true, correctFeedback: "Mentions knowing her university schedule — then says to keep it off-thread. The account already has this information.", tagRequired: true },
            { id: 'sm-009', subreddit: 'r/homebrewing', date: 'Jan 22', text: 'Second batch of the pale ale is much better. Reduced the hop additions in the last 10 mins and it\'s cleaner.', suspicious: false, wrongFeedback: 'Brewing hobby post. Consistent with prior content.' },
            { id: 'sm-010', subreddit: 'r/PDXmissing', date: 'Dec 14', text: 'I\'ve been following this case from the beginning. Her flatmate Priya said she was "waiting for something to end." That phrase has stayed with me.', suspicious: true, correctFeedback: "Priya's name was never posted to this forum. This account knew her name before it was public.", tagRequired: true },
            { id: 'sm-011', subreddit: 'r/Millhaven', date: 'Dec 3', text: 'Good turnout at the arts night last night. Always good to see the local scene staying active.', suspicious: false, wrongFeedback: 'Local community post. Could be any Millhaven resident.' },
            { id: 'sm-012', subreddit: 'r/PDXmissing', date: 'Nov 18', text: 'Just found this forum. Hard to believe it\'s been months with no answers. Following from Millhaven, OR. Hope someone finds something.', suspicious: false, wrongFeedback: 'First post, introduction. Locating as Millhaven is notable but not alone sufficient.' },
          ],
          requiredTagIds: ['sm-003', 'sm-006', 'sm-008', 'sm-010'],
          completionNote: "Maya spent two days reading everything. The account knew things that were never public.",
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
        timestamp: { text: '3 days before Maya disappeared', urgent: false },
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
              wrongFeedback: "Maya noticed this in her own notes before running the formal scan. Check what she wrote about the forum bio link.",
              hintFeedback: "In NOTES_DO_NOT_DELETE.txt: 'The link in the forum bio leads nowhere. Username search returns nothing.' She's talking about Twitter.",
            },
            {
              prompt: "The Flickr profile went private before Maya could access it. She recovered the photos anyway. What tool did she use?",
              contextNote: "Maya anticipated this might happen. She left herself a note about it in the earlier scan file.",
              acceptedAnswers: ['wayback', 'wayback machine', 'web.archive.org', 'archive.org', 'internet archive'],
              wrongFeedback: "Look at username_scan_results_OLD.txt — right at the bottom. Maya wrote a note to herself about how to handle a private Flickr profile.",
              hintFeedback: "From Maya's note: 'Flickr may have gone private — check Wayback Machine for cached public versions before the profile was locked.'",
            },
          ],
          completionNote: "One account deleted. One gone private. Both changes happened after she started looking.",
        },
        unlocks: ['A6'],
      },

      // A4 — Browse: Flickr — find 3 geotagged photos
      {
        id: 'A4',
        type: 'browse',
        path: 'A',
        title: "Flickr — stillwater_m (Cached Archive)",
        tool: 'Flickr Archive',
        timestamp: { text: '2 days before Maya disappeared', urgent: false },
        monologue: null,
        osintTip: {
          id: 'photo-geotag',
          title: 'Photo Geolocation & EXIF Data',
          body: 'Photos taken on smartphones embed GPS coordinates, device model, timestamp, and camera settings in EXIF metadata — even if the photographer doesn\'t realize it. Many platforms strip EXIF on upload, but cached versions of pages sometimes preserve the original files.',
          steps: [
            'Download the original image (right-click → Save Image As)',
            'Run through ExifTool or Jeffrey\'s Exif Viewer',
            'Look for GPS coordinates, device info, and exact timestamp',
            'Cross-reference coordinates with known locations in the case',
          ],
          tools: ['ExifTool (command line)', 'Jeffrey\'s Exif Viewer (web)', 'Google Maps (coordinate lookup)', 'Pic2Map'],
        },
        content: {
          variant: 'flickr',
          username: 'stillwater_m',
          albums: [
            {
              id: 'album-landscapes',
              name: 'Pacific Northwest Landscapes',
              photos: [
                { id: 'f-001', filename: 'trail_morning_01.jpg', exif: { 'GPS Latitude': '45.5231° N', 'GPS Longitude': '122.6765° W', 'Taken': 'March 3, 7:14am', 'Device': 'iPhone 13', 'Location (resolved)': 'Forest Park, Portland' }, caption: 'Early light through the Douglas firs. This trail never gets old.', wrongFeedback: 'Forest Park — public trail. No case relevance.' },
                { id: 'f-002', filename: 'river_dusk_07.jpg', exif: { 'GPS Latitude': '45.5238° N', 'GPS Longitude': '122.6713° W', 'Taken': 'April 13, 7:52pm', 'Device': 'iPhone 13', 'Location (resolved)': 'Willamette Waterfront, Portland' }, caption: 'Last light on the water. Good evening for a walk.', correctFeedback: 'April 13th — the night before Lena disappeared. The waterfront is two blocks from her apartment.', suspicious: true },
                { id: 'f-003', filename: 'fog_hills_02.jpg', exif: { 'GPS Latitude': '45.4912° N', 'GPS Longitude': '122.8801° W', 'Taken': 'January 18, 9:02am', 'Device': 'iPhone 13', 'Location (resolved)': 'Tualatin Hills, Beaverton' }, caption: 'Hill fog this time of year is always worth the drive.', wrongFeedback: 'Beaverton, January. No case connection.' },
              ],
            },
            {
              id: 'album-millhaven',
              name: 'Millhaven',
              photos: [
                { id: 'f-004', filename: 'arts_night_exterior.jpg', exif: { 'GPS Latitude': '44.9147° N', 'GPS Longitude': '122.9931° W', 'Taken': 'April 14, 6:38pm', 'Device': 'iPhone 13', 'Location (resolved)': 'Callahan Building, Millhaven, OR' }, caption: 'Always good to come back to Millhaven for the arts night.', correctFeedback: "April 14th — the night of Lena's disappearance. Same building. The GPS confirms it.", suspicious: true },
                { id: 'f-005', filename: 'main_st_dusk.jpg', exif: { 'GPS Latitude': '44.9140° N', 'GPS Longitude': '122.9928° W', 'Taken': 'December 3, 5:17pm', 'Device': 'iPhone 13', 'Location (resolved)': 'Main Street, Millhaven, OR' }, caption: 'The old hardware store finally got a new coat of paint.', wrongFeedback: 'Main Street, Millhaven. Establishes residency but not suspicious on its own.' },
              ],
            },
            {
              id: 'album-events',
              name: 'Events',
              photos: [
                { id: 'f-006', filename: 'arts_night_crowd.jpg', exif: { 'GPS Latitude': '44.9147° N', 'GPS Longitude': '122.9931° W', 'Taken': 'April 14, 8:11pm', 'Device': 'iPhone 13', 'Location (resolved)': 'Callahan Building, Millhaven, OR' }, caption: 'Good crowd this year. Some faces I hadn\'t seen in a while.', correctFeedback: "8:11pm at the same location. Lena was photographed at this event at 7:47pm. He was there while she was there.", suspicious: true },
                { id: 'f-007', filename: 'homebrewing_club.jpg', exif: { 'GPS Latitude': '44.9138° N', 'GPS Longitude': '122.9919° W', 'Taken': 'February 22, 7:43pm', 'Device': 'iPhone 13', 'Location (resolved)': 'The Tap Room, Millhaven, OR' }, caption: 'Monthly brewing club meetup. Third batch is the best one yet.', wrongFeedback: 'Local bar, brewing club. Normal community activity.' },
              ],
            },
          ],
          requiredPhotoIds: ['f-002', 'f-004', 'f-006'],
          completionNote: "Three photos. The night before she disappeared, and the night of. Same location.",
        },
        unlocks: ['A5'],
      },

      // A5 — Read: Brief working notes after cross-checking both Flickr archives
      {
        id: 'A5',
        type: 'read',
        path: 'A',
        title: "Maya's Notebook — Feb 15",
        tool: 'Document Viewer',
        timestamp: { text: '2 days before Maya disappeared', urgent: false },
        monologue: null,
        content: {
          requiredScrollRatio: 0.75,
          sections: [
            {
              heading: null,
              body: 'c_marsh_pdx — Tigard. 4414 Burnside Ave. Both nights.\n\nNot him.\n\nBack to stillwater_m.',
              handwritten: true,
            },
            {
              heading: null,
              body: 'stillwater-media.net\n\nWhoever owns that domain registered it under a real name. WHOIS lookup next.\n\nIf there\'s no privacy protection, I have a name.',
              handwritten: true,
            },
          ],
        },
        unlocks: [],
      },

      // A6 — Tag: archived tweets (no highlighting)
      {
        id: 'A6',
        type: 'tag',
        path: 'A',
        title: "Twitter Archive — stillwater_m (Cached)",
        tool: 'Twitter Archive',
        timestamp: { text: '1 day before Maya disappeared', urgent: false },
        monologue: null,
        osintTip: {
          id: 'twitter-archive',
          title: 'Archived Social Media',
          body: 'Deleted accounts and posts can survive in several places: web archive crawls, third-party archiving services, and screenshots shared by other users. The Wayback Machine crawls Twitter periodically. Specialized tools like Bellingcat\'s Social Media Archiver preserved public tweet content before platform changes.',
          steps: [
            'Search web.archive.org for the profile URL',
            'Try archive.today (formerly archive.is) for snapshots',
            'Search Google for cached pages: site:twitter.com username',
            'Look for third-party retweet or quote-tweet caches',
          ],
          tools: ['Wayback Machine', 'archive.today', 'Google Cache', 'Twint (now legacy)', 'snscrape'],
        },
        content: {
          items: [
            { id: 't-001', subreddit: null, username: '@stillwater_m · May 3', text: 'Good morning from Millhaven. Coffee and the view of the hills. Not a bad start.', date: null, wrongFeedback: 'Normal local morning post. No case relevance.' },
            { id: 't-002', username: '@stillwater_m · Apr 30', text: 'Interesting piece in the Oregonian about the Millhaven Arts Collective. Always been proud to be part of that community.', wrongFeedback: 'Arts community engagement. Consistent with prior content.' },
            { id: 't-003', username: '@stillwater_m · Apr 14', text: 'Back in Millhaven for the arts night. Some old friends, some new faces. Good to be home.', date: null, suspicious: true, correctFeedback: 'April 14th tweet — confirms he was at the arts night in his own words. Posted the night Lena disappeared.', tagRequired: true },
            { id: 't-004', username: '@stillwater_m · Apr 10', text: 'Prepping for the weekend. Long drive but worth it for the people.', wrongFeedback: 'Pre-travel post. Fits with the arts night trip but not suspicious on its own.' },
            { id: 't-005', username: '@stillwater_m · Mar 24', text: 'Went looking for that old Millhaven Courier piece about the building registry. Amazing what you can find in county records.', suspicious: true, correctFeedback: 'Checking county records — specifically building registry. The Callahan Building is in the county registry. This suggests he knows how to research ownership.', tagRequired: true },
            { id: 't-006', username: '@stillwater_m · Mar 15', text: 'The coffee here has gotten better since that new place opened on Main Street. Small town improvements.', wrongFeedback: 'Local coffee shop post. No case relevance.' },
            { id: 't-007', username: '@stillwater_m · Feb 28', text: 'Sometimes I think about the people who slip through the cracks. Nobody looking for them. Just... gone.', suspicious: false, wrongFeedback: 'Vague and ominous but not specific enough to flag. This alone proves nothing.' },
            { id: 't-008', username: '@stillwater_m · Feb 19', text: 'If someone asks why I follow this missing persons forum — I just care. That\'s allowed.', suspicious: true, correctFeedback: "Defensive self-justification unprompted. No one publicly questioned why he follows the forum — so who was he addressing?", tagRequired: true },
            { id: 't-009', username: '@stillwater_m · Jan 7', text: 'Happy new year. Quiet one. Just me and the cat and a decent bottle of Oregon pinot.', wrongFeedback: 'Holiday post. Nothing suspicious.' },
            { id: 't-010', username: '@stillwater_m · Dec 12', text: 'Saw the PDXmissing forum mentioned in a Reddit thread. Joined to follow along. These communities do important work.', wrongFeedback: 'Account origin story — but this contradicts his Reddit first post which says he joined "to help." Minor inconsistency.' },
            { id: 't-011', username: '@stillwater_m · Nov 23', text: 'stillwater-media.net is finally live. Just a portfolio site for now. Got big plans for it eventually.', suspicious: true, correctFeedback: "He owns stillwater-media.net. A domain registered to the same username used in the forum and on this account.", tagRequired: true },
            { id: 't-012', username: '@stillwater_m · Oct 31', text: 'Website work is slow going. Might just keep it as a landing page for a while.', wrongFeedback: 'Website update. Low importance on its own.' },
          ],
          requiredTags: ['t-003', 't-005', 't-008', 't-011'],
          wrongTagLimit: 3,
          completionNote: "A domain has a WHOIS record. A WHOIS record has a registrant address.",
        },
        unlocks: ['A7', 'A9'],
      },

      // A7 — Read: Maya explains how she verified Twitter identity
      {
        id: 'A7',
        type: 'read',
        path: 'A',
        title: "Maya's Notes — Domain Research",
        tool: 'Document Viewer',
        timestamp: { text: '1 day before Maya disappeared', urgent: false },
        monologue: null,
        content: {
          requiredScrollRatio: 0.8,
          sections: [
            {
              heading: 'DOMAIN: stillwater-media.net',
              body: 'He announced it himself: "stillwater-media.net is finally live."\n\nWhen you register a domain, you submit personal information to the registrar — name, email, address, phone. This is public by default unless you pay for privacy protection (WHOIS privacy). A lot of people don\'t.\n\nI ran the WHOIS lookup.',
            },
            {
              heading: 'WHOIS RESULTS',
              body: 'Registrar: NameCheap\nRegistration date: October 28\nExpiry: October 28 (next year, auto-renewed)\nPrivacy protection: No\n\nRegistrant Name: R. Callahan\nRegistrant Organization: Callahan Media\nRegistrant Address: PO Box 441, Millhaven, OR 97411\nRegistrant Email: rcallahan@[redacted by me]\n\nCallahan.\n\nNot a common name. The Millhaven Arts Night gets local press coverage every year. I need to pull the newspaper archive and check for a photographer credit. If the name matches, the domain, the Twitter, and the newspaper are three independent sources.',
              handwritten: false,
            },
            {
              heading: null,
              body: 'I know a Ray Callahan.\n\nI\'ve known him my whole life.\n\nI need to make sure before I say anything. I need one more source.',
              handwritten: true,
            },
          ],
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
        timestamp: { text: '1 day before Maya disappeared', urgent: false },
        monologue: null,
        content: {
          questions: [
            {
              prompt: 'The WHOIS record lists a PO box in Millhaven, OR. What is the business name registered to that address?',
              contextNote: 'From Maya\'s notes: "Registrant Organization: Callahan Media / Registrant Address: PO Box 441, Millhaven, OR 97411"',
              acceptedAnswers: ['callahan media', 'callahan'],
              wrongFeedback: 'Look at the registrant organization field in the WHOIS results Maya recorded.',
            },
            {
              prompt: 'You found Ray Callahan\'s name in the Millhaven Courier archive. What role is listed next to his name in the arts night coverage?',
              contextNote: 'From the Millhaven Courier article you found in Thread C: look at the credit line for event photography.',
              acceptedAnswers: ['photographer', 'photography', 'event photographer', 'event photography'],
              wrongFeedback: "Check the Millhaven Courier article from the arts night — look at the photography credit.",
            },
          ],
          completionNote: "Callahan Media. The photographer.",
        },
        requiresCompleted: { path: 'C', nodeId: 'C4', hint: 'Find the newspaper archive in Thread C first — the arts night coverage is what confirms his name.' },
        unlocks: ['A10'],
      },

      // A9 — Browse: Twitter follow list — find stillwater_m follow of nightwatch_rc
      {
        id: 'A9',
        type: 'browse',
        path: 'A',
        title: "stillwater_m — Following List (Cached)",
        tool: 'Twitter Archive',
        timestamp: { text: '1 day before Maya disappeared', urgent: false },
        monologue: null,
        content: {
          variant: 'reddit-profile',
          username: 'stillwater_m — Following (47)',
          joinDate: null,
          karma: null,
          posts: [
            { id: 'f-001', subreddit: '@PDXmissing_news', text: 'Local missing persons news aggregator. Millhaven and Portland area.', date: null, wrongFeedback: 'Expected follow for someone engaged with the missing persons community.' },
            { id: 'f-002', subreddit: '@OregonianNews', text: 'The Oregonian — Portland\'s daily newspaper.', date: null, wrongFeedback: 'Major regional news account. No case relevance.' },
            { id: 'f-003', subreddit: '@velvet_echo_fan', text: 'Unofficial fan account for @velvet.echo — art, updates, photography. Not affiliated.', date: null, suspicious: false, wrongFeedback: "A fan account for Lena's public persona — but this account existed before her disappearance as a legitimate arts follower." },
            { id: 'f-004', subreddit: '@millhaven_arts', text: 'Millhaven Arts Collective — events, exhibitions, community news.', date: null, wrongFeedback: 'Arts community account. Consistent with claimed background.' },
            { id: 'f-005', subreddit: '@nightwatch_rc', text: 'Personal account. Photography, Pacific Northwest. Quiet here.', date: null, suspicious: true, correctFeedback: 'nightwatch_rc — initials RC. Ray Callahan. stillwater_m is following his own second account.', tagRequired: true },
            { id: 'f-006', subreddit: '@stillwater_media', text: 'Callahan Media — Pacific Northwest photography and documentary work. Portfolio: stillwater-media.net', date: null, suspicious: true, correctFeedback: 'The official business account — confirming the link between stillwater_m and Callahan Media.', tagRequired: true },
            { id: 'f-007', subreddit: '@c_marsh_pdx', text: 'Corey Marsh — cars, Portland, Pacific Northwest.', date: null, wrongFeedback: "stillwater_m follows Corey Marsh. This is consistent with him using Corey as a deliberate misdirection — he already knew who Corey was." },
            { id: 'f-008', subreddit: '@rvelasquez_reporter', text: 'Rosa Velasquez — Pacific Reporter. Covering digital safety, online harm, missing persons.', date: null, wrongFeedback: 'Journalist covering missing persons. Relevant to note — Maya later contacted Rosa — but not suspicious as a follow.' },
            { id: 'f-009', subreddit: '@OregonStateRecords', text: 'Oregon Secretary of State — business registry, court records, elections.', date: null, wrongFeedback: 'Public records agency account. Could indicate familiarity with records research.' },
          ],
          requiredTagIds: ['f-005', 'f-006'],
          completionNote: "Two accounts. Same person.",
        },
        unlocks: [],
      },

      // A10 — Read: Evidence summary — Maya's final analysis
      {
        id: 'A10',
        type: 'read',
        path: 'A',
        title: "Maya's Investigation Summary — Path A",
        tool: 'Document Viewer',
        timestamp: { text: 'night before Maya disappeared', urgent: true },
        monologue: "This was the last thing she wrote on the laptop. The timestamp is March 9. 11:23pm.",
        content: {
          requiredScrollRatio: 0.88,
          sections: [
            {
              heading: 'WHAT I KNOW — MARCH 9',
              body: 'Account: stillwater_m\nDomain: stillwater-media.net\nRegistrant: R. Callahan / Callahan Media / PO Box 441, Millhaven, OR\n\nSecond account: @nightwatch_rc (RC?)\n\nLocation data from Flickr:\n— Night before Lena disappeared: near her apartment\n— Night of disappearance: at the arts night, same venue\n\nPrior knowledge of Lena\'s private details:\n— Her flatmate\'s name\n— Her Tuesday route\n— The phrase "waiting for something to end"\n\nDeleted Twitter account: same week the forum started questioning him.\nMisdirected me toward Corey for three weeks.',
            },
            {
              heading: 'WHAT I NEED',
              body: 'One more source. I need the court records — there was something in the Millhaven records I found earlier. A name that matched. I need to confirm.\n\nI\'m going to check the county records database tomorrow morning.\n\nIf it matches, I need to be certain before I do anything.',
            },
          ],
        },
        unlocks: ['A11'],
      },

      // A11 — Connect: Final confirmation
      {
        id: 'A11',
        type: 'connect',
        path: 'A',
        title: "Cross-Reference — Evidence Assembly",
        tool: 'Link Analysis',
        timestamp: { text: 'night before Maya disappeared', urgent: true },
        monologue: "She was waiting for one more piece. She never got to look for it in the morning. I have to put it together myself.",
        content: {
          cards: [
            { id: 'whois', label: 'Domain WHOIS', details: 'Registrant: R. Callahan, PO Box 441, Millhaven' },
            { id: 'twitter_rc', label: '@nightwatch_rc', details: 'Second Twitter account following stillwater_m' },
            { id: 'business', label: 'Callahan Media', details: 'Business listed on the domain registration' },
            { id: 'forum', label: 'stillwater_m', details: 'Forum account with unreleased private knowledge' }
          ],
          requiredConnections: [
            { from: 'whois', to: 'twitter_rc', label: 'R. Callahan matches RC' },
            { from: 'whois', to: 'business', label: 'Name matches listed business' },
            { from: 'forum', to: 'whois', label: 'stillwater_m registered the domain' }
          ],
          wrongFeedback: 'Look for shared names, initials, or ownership records.',
          completionNote: "A single name connects the forum account, the Twitter, and the domain. R. Callahan.",
        },
        unlocks: ['A12'],
      },

      // A12 — Read: Bridge — path locked
      {
        id: 'A12',
        type: 'read',
        path: 'A',
        title: "Maya's Last Note",
        tool: 'Document Viewer',
        timestamp: { text: 'night before Maya disappeared', urgent: true },
        monologue: null,
        content: {
          requiredScrollRatio: 0.5,
          sections: [
            {
              heading: null,
              body: 'I was wrong about Corey.\n\nRead the notebook.',
              handwritten: true,
            },
            {
              heading: null,
              body: 'She was right about everything except Corey.\n\nThe trail runs cold here. But she knew that too — she left the notebook open on the desk for a reason.',
              handwritten: false,
            },
          ],
        },
        unlocks: [],
      },

      // A13 — Browse: Corey Marsh Flickr (Red Herring)
      {
        id: 'A13',
        type: 'browse',
        path: 'A',
        title: "Flickr — c_marsh_pdx",
        tool: 'Flickr Archive',
        timestamp: { text: '3 days before Maya disappeared', urgent: false },
        monologue: null,
        osintTip: null,
        content: {
          variant: 'flickr',
          username: 'c_marsh_pdx',
          albums: [
            {
              id: 'album-restorations',
              name: 'Pacific Restorations — 2023',
              photos: [
                {
                  id: 'cm-001',
                  filename: 'chevelle_primer_01.jpg',
                  exif: { 'GPS Location': '4414 Burnside Ave, Tigard, OR — Pacific Restorations Auto Body', 'Taken': 'Apr 13, 2023 — 7:54 PM', 'Device': 'iPhone 11' },
                  caption: '1967 Chevelle Quarter Panel — primer coat done. Long night ahead.',
                  suspicious: false,
                  wrongFeedback: "Auto body shop in Tigard, April 13th. He was at work — 35 miles from Lena's apartment.",
                },
                {
                  id: 'cm-002',
                  filename: 'late_shift_apr13.jpg',
                  exif: { 'GPS Location': '4414 Burnside Ave, Tigard, OR — Pacific Restorations Auto Body', 'Taken': 'Apr 13, 2023 — 11:38 PM', 'Device': 'iPhone 11' },
                  caption: 'Still here. Worth it though.',
                  suspicious: false,
                  wrongFeedback: "Same shop, 11:38pm on April 13th. Still at work. The night before Lena disappeared.",
                },
                {
                  id: 'cm-003',
                  filename: 'paint_booth_apr14.jpg',
                  exif: { 'GPS Location': '4414 Burnside Ave, Tigard, OR — Pacific Restorations Auto Body', 'Taken': 'Apr 14, 2023 — 3:12 PM', 'Device': 'iPhone 11' },
                  caption: 'Into the booth finally. Three months of work.',
                  suspicious: false,
                  wrongFeedback: "April 14th — the day Lena disappeared. He's photographed at the shop in Tigard at 3pm. He has an alibi.",
                },
              ],
            },
          ],
          requiredPhotoIds: ['cm-001', 'cm-002'],
          completionNote: "April 13th, 11:38pm. April 14th, 3:12pm. Both at 4414 Burnside, Tigard — an auto body shop. Corey Marsh was at work on both critical dates. He couldn't have been following Lena. stillwater_m pointed me here knowing I'd waste weeks.",
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
        timestamp: { text: 'months into Maya\'s investigation', urgent: false },
        monologue: "Someone tried to burn it. They didn't get all of it. I need to see what's still there.",
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
          variant: 'forum',
          forumName: 'PDXmissing — Lena Vasquez thread',
          posts: [
            { id: 'fp-01', username: 'stillwater_m', threadTitle: 'General Discussion', date: 'Dec 2', text: 'I\'ve been following this case closely. The police really dropped the ball on this one. Her community deserves answers.', wrongFeedback: 'Generic community sympathy post. Not specific enough to flag.' },
            { id: 'fp-02', username: 'worried_mom_pdx', threadTitle: 'General Discussion', date: 'Dec 4', text: 'Has anyone contacted her university? They might have records of who she was in contact with before she went missing.', wrongFeedback: "Another community member's post. Not relevant." },
            { id: 'fp-03', username: 'stillwater_m', threadTitle: 'Person of Interest Discussion', date: 'Dec 8', text: 'I think the ex-boyfriend angle deserves more attention. Corey Marsh. I\'ve seen some things online that concern me.', suspicious: true, correctFeedback: "First mention of Corey — pushing the misdirection before the forum had much traction on any suspect.", tagRequired: true },
            { id: 'fp-04', username: 'PDXtruth99', threadTitle: 'Evidence & Sightings', date: 'Dec 11', text: 'Anyone have the photos from the arts night? I heard there were community photos posted.', wrongFeedback: 'Other forum user asking about photos. Not stillwater_m.' },
            { id: 'fp-05', username: 'stillwater_m', threadTitle: 'Evidence & Sightings', date: 'Dec 15', text: 'I found some cached photos from the arts night. The venue is in Millhaven — I know the building. Happy to help identify faces if useful.', suspicious: true, correctFeedback: 'Offering to identify faces from the venue where Lena disappeared. Why does he know the building?', tagRequired: true },
            { id: 'fp-06', username: 'lena_knew_her', threadTitle: 'General Discussion', date: 'Dec 19', text: 'I was in her art class for a semester. She was really quiet but thoughtful. She made this ceramic piece for a project — it was this dark abstract shape. I think about it.', wrongFeedback: "Personal memory from a classmate. Not stillwater_m." },
            { id: 'fp-07', username: 'stillwater_m', threadTitle: 'Person of Interest Discussion', date: 'Dec 22', text: 'More I look at Corey Marsh the more I think he\'s the key. His Flickr has location data near her neighborhood. Someone should look at that.', suspicious: true, correctFeedback: "Steering the forum toward Corey's Flickr. This is deliberate misdirection — he knows those photos are of a car shop.", tagRequired: true },
            { id: 'fp-08', username: 'PortlandMom412', threadTitle: 'General Discussion', date: 'Dec 27', text: 'Praying for her family. No family should have to go through this during the holidays.', wrongFeedback: 'Holiday sympathy post from another user.' },
            { id: 'fp-09', username: 'stillwater_m', threadTitle: 'Evidence & Sightings', date: 'Jan 4', text: 'I heard from someone who knew her that she had a Tuesday routine — coffee before her morning class at a specific shop on Burnside. Has anyone looked at that location?', suspicious: true, correctFeedback: "The Tuesday route again. Never posted publicly anywhere. He's presenting inside knowledge as if received from a third party.", tagRequired: true },
            { id: 'fp-10', username: 'missing_justice_pdx', threadTitle: 'Person of Interest Discussion', date: 'Jan 9', text: 'Can we keep this thread focused on facts? Let\'s not name people without evidence.', wrongFeedback: 'Moderating post from another user.' },
            { id: 'fp-11', username: 'stillwater_m', threadTitle: 'Person of Interest Discussion', date: 'Jan 11', text: 'I understand the caution, but Corey Marsh\'s behavior online has been consistent with someone who was obsessively following her. I have screenshots if the mods want them.', suspicious: true, correctFeedback: 'Offering fabricated or misinterpreted evidence. Maya later confirmed Corey was innocent.', tagRequired: true },
            { id: 'fp-12', username: 'velvet_watcher', threadTitle: 'Lena Before She Disappeared', date: 'Jan 16', text: 'She was posting normally right up until that last arts night photo. The Instagram was cheerful. No signs of distress I could see.', wrongFeedback: 'Community observation from another user.' },
            { id: 'fp-13', username: 'stillwater_m', threadTitle: 'General Discussion', date: 'Jan 20', text: 'I know this sounds strange but I feel like I knew her. Not personally. But from following her online presence for so long. She had a real voice.', suspicious: false, wrongFeedback: "Parasocial attachment. Disturbing in context but not specifically incriminating on its own — many missing persons followers feel this way." },
          ],
          requiredTagIds: ['fp-03', 'fp-05', 'fp-07', 'fp-09', 'fp-11'],
          completionNote: "Five posts. Each one either pushing the Corey angle or disclosing information that was never public. Maya underlined them all in red.",
        },
        unlocks: ['B3'],
      },

      // B3 — Slider: pages 4-6
      {
        id: 'B3',
        type: 'slider',
        path: 'B',
        title: "Burned Notebook — Pages 4–6",
        tool: 'Document Recovery',
        timestamp: { text: 'January', urgent: false },
        monologue: null,
        content: {
          pages: [
            {
              id: 'b-p4',
              date: 'January 15',
              text: 'Five posts. Five instances of knowledge he shouldn\'t have.\n\nThe forum pushed me toward Corey. I followed that for three weeks. Wasted time I didn\'t have.\n\nI\'m going back to the source. Who is stillwater_m?',
              targetBrightness: 140,
              targetContrast: 175,
              tolerance: 30,
            },
            {
              id: 'b-p5',
              date: 'January 22',
              text: 'He has a domain. stillwater-media.net.\n\nWHOIS says: R. Callahan. Callahan Media. PO Box 441, Millhaven, OR.\n\nI know that name.\n\nI need to keep going. I need more.',
              targetBrightness: 155,
              targetContrast: 160,
              tolerance: 28,
            },
            {
              id: 'b-p6',
              date: 'February 1',
              text: 'Cross-referenced with the newspaper archive. Ray Callahan photographed the arts night. He was the official event photographer.\n\nHe had access to every corner of the Callahan Building. He knew Lena\'s schedule because he photographed the opening.\n\nHe knows my dad. He\'s been at our house.',
              targetBrightness: 145,
              targetContrast: 180,
              tolerance: 32,
            },
          ],
        },
        requiresCompleted: { path: 'C', nodeId: 'C4', hint: 'Check the newspaper archive in Thread C first — Maya cross-referenced it in this notebook entry.' },
        unlocks: ['B4'],
      },

      // B4 — Tag: 3 posts showing insider knowledge (subtle)
      {
        id: 'B4',
        type: 'tag',
        path: 'B',
        title: "Forum Posts — stillwater_m Deep Archive",
        tool: 'Forum Archive',
        timestamp: { text: 'February — Maya refining her research', urgent: false },
        monologue: "She went back through everything. Looking for the things she'd missed the first time.",
        content: {
          items: [
            { id: 'dp-01', username: 'stillwater_m · Nov 20', text: 'The police response to this case has been inadequate from the start. Small town, minimal resources. I understand but it\'s not acceptable.', wrongFeedback: 'Criticism of police response. Consistent with most forum members.' },
            { id: 'dp-02', username: 'stillwater_m · Nov 26', text: 'I keep looking at that last Instagram photo. The building behind her — does anyone know what that is?', suspicious: false, wrongFeedback: "Asking about the building. He already knows — this is performed ignorance." },
            { id: 'dp-03', username: 'stillwater_m · Dec 6', text: 'The flatmate\'s name is Priya, right? Has she been interviewed extensively? I ask because flatmates often notice behavioral changes that family misses.', suspicious: true, correctFeedback: "Priya's name was only in the police report — not publicly available. This account named her without a source.", tagRequired: true },
            { id: 'dp-04', username: 'stillwater_m · Dec 14', text: 'I think the arts night location matters more than people are saying. I\'ve been to events there. Good venue but lots of exit points.', suspicious: true, correctFeedback: 'He describes the venue\'s exit points — knowledge a photographer with full access would have, not a distant community member.', tagRequired: true },
            { id: 'dp-05', username: 'stillwater_m · Jan 3', text: 'She was at Millhaven University, yeah? I know someone who might have taken a class with her.', suspicious: false, wrongFeedback: "Millhaven University was mentioned in multiple news articles. Not insider knowledge." },
            { id: 'dp-06', username: 'stillwater_m · Jan 19', text: 'From what I understand, she\'d been anxious for several weeks before the disappearance. "Waiting for something to end" — that phrase keeps coming up from people who knew her.', suspicious: true, correctFeedback: "That exact phrase came from Priya's police interview. Not a public document — not reported in any news coverage. He has access to it.", tagRequired: true },
            { id: 'dp-07', username: 'stillwater_m · Feb 3', text: 'Corey Marsh is still my main focus. The location overlaps are hard to explain otherwise.', wrongFeedback: 'Still pushing the Corey misdirection. At this point Maya had already started to see through it.' },
            { id: 'dp-08', username: 'stillwater_m · Feb 10', text: 'Has anyone looked at her email contacts? There might be someone there who knew her movements.', wrongFeedback: 'General investigation suggestion. Too vague to flag.' },
          ],
          requiredTags: ['dp-03', 'dp-04', 'dp-06'],
          wrongTagLimit: 3,
          completionNote: "Three posts. The flatmate's name. The venue exit points. The exact phrase from a sealed police interview. Maya underlined these in green and wrote: 'He has access to things he shouldn't have access to.'",
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
              prompt: "The phrase 'waiting for something to end' appears in the forum. Where did stillwater_m get it from, based on the evidence in Maya's notes?",
              contextNote: "Maya's research shows this phrase came from Priya's police interview — not published in any news article or posted publicly.",
              acceptedAnswers: ['police', 'police report', 'interview', 'priya', 'priya\'s interview', 'police interview', 'sealed'],
              wrongFeedback: "Think about which document contained that exact phrase. It wasn't public.",
            },
            {
              prompt: "Maya identifies three usernames used by the same person. What is the pattern connecting stillwater_m, nightwatch_rc, and Callahan Media?",
              acceptedAnswers: ['initials', 'rc', 'callahan', 'ray callahan', 'same person', 'same name', 'same initials'],
              wrongFeedback: "Look at the initials in nightwatch_rc and the name in the WHOIS record. What do they share?",
            },
          ],
          completionNote: "The police report. RC = Ray Callahan. Maya wrote both answers in the margin of her notebook and drew a line between them.",
        },
        unlocks: ['B6'],
      },

      // B6 — Input: WHOIS domain
      {
        id: 'B6',
        type: 'input',
        path: 'B',
        title: "WHOIS Lookup — stillwater-media.net",
        tool: 'WHOIS Lookup',
        timestamp: { text: 'February', urgent: false },
        monologue: null,
        content: {
          questions: [
            {
              prompt: "The WHOIS record lists a city in Oregon. Which city is in the registrant address for stillwater-media.net?",
              contextNote: "From Maya's notes: 'Registrant Address: PO Box 441, Millhaven, OR 97411'",
              acceptedAnswers: ['millhaven', 'millhaven or', 'millhaven oregon'],
              wrongFeedback: "Read the registrant address in Maya's WHOIS notes carefully.",
            },
          ],
          completionNote: "Millhaven. He never left. He's still there.",
        },
        unlocks: ['B7'],
      },

      // B7 — Navigate: cached Blogger page
      {
        id: 'B7',
        type: 'navigate',
        path: 'B',
        title: "stillwater-media.net — Cached Version",
        tool: 'Wayback Machine',
        timestamp: { text: 'February', urgent: false },
        monologue: "The site is still live. But the Wayback Machine has an older version from before he cleaned it up.",
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
            name: 'stillwater-media.net (cached Oct 3)',
            type: 'folder',
            children: [
              { name: 'index.html', type: 'file', content: '<!DOCTYPE html>\n<html>\n<head>\n  <meta name="author" content="Ray Callahan">\n  <meta name="description" content="Callahan Media — Pacific Northwest documentary photography">\n  <title>Callahan Media | Stillwater</title>\n</head>\n<body>\n  <h1>Callahan Media</h1>\n  <p>Pacific Northwest photography. Documentary work. Available for events and editorial.</p>\n  <p>Based in Millhaven, Oregon.</p>\n  <p>Contact: via PO Box 441 or the form below.</p>\n</body>\n</html>' },
              { name: 'portfolio', type: 'folder', children: [
                { name: 'arts-night-2024.html', type: 'file', content: '<!-- Gallery: Millhaven Arts Night 2024 -->\n<!-- Photographer: Ray Callahan / Callahan Media -->\n<!-- Event date: April 14 -->\n\n[Image gallery — 47 photos from the Millhaven Arts Night. Photo 23 shows the main hall. Photo 31 shows a back staircase marked "private access."]' },
                { name: 'landscape-series.html', type: 'file', content: '<!-- Gallery: Pacific Northwest Landscapes -->\n<!-- All photos copyright Ray Callahan -->\n\n[Image gallery — forest trails, river scenes, hill fog. Matches the Flickr albums from stillwater_m.]' },
              ]},
              { name: 'source', type: 'folder', children: [
                { name: 'page-source.txt', type: 'file', content: 'Full source of index.html:\n\n<meta name="author" content="Ray Callahan">\n<meta name="generator" content="WordPress">\n<meta name="wp-user" content="rcallahan_admin">\n\n<!-- Site built by rcallahan_admin for Callahan Media -->\n<!-- Admin email: rcallahan@millhavenpost.net -->' },
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
              prompt: 'What name appears in the HTML author meta tag on the stillwater-media.net cached page?',
              contextNote: 'Read the page-source.txt file you just opened.',
              acceptedAnswers: ['ray callahan', 'callahan', 'r callahan'],
              wrongFeedback: 'Look at the <meta name="author" content="..."> tag in the page source.',
            },
            {
              prompt: 'What is the WordPress username listed in the page source?',
              contextNote: 'Check the wp-user meta tag and the HTML comment at the bottom.',
              acceptedAnswers: ['rcallahan_admin', 'rcallahan'],
              wrongFeedback: 'Look for the wp-user meta tag and the HTML comment beginning with "<!-- Site built by..."',
            },
          ],
          completionNote: "Ray Callahan. rcallahan_admin. The same name in every layer — the WHOIS, the HTML, the newspaper archive. This isn't circumstantial anymore.",
        },
        unlocks: ['B9'],
      },

      // B9 — Slider: pages 12-15
      {
        id: 'B9',
        type: 'slider',
        path: 'B',
        title: "Burned Notebook — Pages 12–15",
        tool: 'Document Recovery',
        timestamp: { text: 'February — mounting dread', urgent: false },
        monologue: "These pages are worse than the earlier ones. More of the char got to them.",
        content: {
          pages: [
            {
              id: 'b-p12',
              date: 'February 14',
              text: 'It\'s Ray.\n\nI keep writing it and I keep hoping it stops making sense.\n\nIt\'s Ray. It has to be.',
              targetBrightness: 160,
              targetContrast: 185,
              tolerance: 25,
            },
            {
              id: 'b-p13',
              date: 'February 19',
              text: 'He has a key to our apartment. Dad gave it to him years ago. He can walk in whenever he wants.\n\nDad\'s devices are on our home network. Ray knows the WiFi password.\n\nIf I send Dad an email, Ray might see it.',
              targetBrightness: 150,
              targetContrast: 190,
              tolerance: 22,
            },
            {
              id: 'b-p14',
              date: 'February 25',
              text: 'I need a court record. The county filing system has public access. There was a restraining order — I found the case number in a Millhaven Courier archive from four years ago. "Harassment." The name is redacted in the article but the case number isn\'t.\n\nIf it\'s him, I\'ll have three independent sources.',
              targetBrightness: 145,
              targetContrast: 175,
              tolerance: 28,
            },
            {
              id: 'b-p15',
              date: 'March 1',
              text: 'I went back to the corkboard.\n\nThe sticky note. On the back of the board — I almost missed it. She has a journalist contact.\n\nI wrote down the name.\n\nRosa Velasquez. Pacific Reporter.',
              targetBrightness: 155,
              targetContrast: 180,
              tolerance: 26,
            },
          ],
        },
        requiresCompleted: { path: 'C', nodeId: 'C8', hint: 'Explore the corkboard in Thread C first — Maya found something there.' },
        unlocks: ['B10'],
      },

      // B10 — Input: who has access to what
      {
        id: 'B10',
        type: 'input',
        path: 'B',
        title: "Security Analysis — Communication Risk",
        tool: 'Analysis',
        timestamp: { text: 'February', urgent: false },
        monologue: "She was afraid to tell me. She had a reason.",
        content: {
          questions: [
            {
              prompt: "Why didn't Maya simply email her father directly when she identified Ray?",
              contextNote: "From page 13 of the notebook: 'Dad's devices are on our home network. Ray knows the WiFi password. If I send Dad an email, Ray might see it.'",
              acceptedAnswers: ['wifi', 'network', 'access', 'ray could see', 'home network', 'key', 'email', 'see it', 'monitor'],
              wrongFeedback: "Re-read page 13. Maya explains exactly why she was afraid to contact her father directly.",
            },
          ],
          completionNote: "She was trying to protect him. By protecting him, she protected Ray. And Ray saw her coming.",
        },
        unlocks: ['B11'],
      },

      // B11 — Slider: pages 16-18 (system alert fires here)
      {
        id: 'B11',
        type: 'slider',
        path: 'B',
        title: "Burned Notebook — Pages 16–18",
        tool: 'Document Recovery',
        timestamp: { text: 'March — the last days', urgent: true },
        monologue: "The last pages.",
        systemAlertAfter: true,
        content: {
          pages: [
            {
              id: 'b-p16',
              date: 'March 5',
              text: 'The court record confirms it.\n\nThe redacted name in the harassment case — I cross-referenced the case number with the county clerk\'s full filing. The full name is Ray Callahan.\n\nThe victim was a woman in her twenties. The restraining order lasted two years. It expired.\n\nThree sources. All the same name.',
              targetBrightness: 155,
              targetContrast: 180,
              tolerance: 26,
            },
            {
              id: 'b-p17',
              date: 'March 7',
              text: 'He was at dinner last week. I watched him. I sat across from him and I watched him talk to Dad about football and I kept thinking: you know what you did. You know I know.\n\nI don\'t think he knows yet. But I think he suspects I\'m close.\n\nI\'m going to write it all up tonight. Email to Dad, set to send in the morning. But I need to route it through Rosa first.',
              targetBrightness: 148,
              targetContrast: 185,
              tolerance: 24,
            },
            {
              id: 'b-p18',
              date: 'March 9 — late',
              text: 'I started writing the email.\n\nI got as far as "Dad, it\'s Ray."\n\nI stopped.\n\nHe has access to things he shouldn\'t have access to. If he checks the laptop remotely tonight — if he has a way in — he\'ll see the draft before morning.\n\nI\'m going to sleep. I\'ll send it from the library computer tomorrow.',
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
        monologue: "She was going to send it in the morning. It's still in the Drafts folder.",
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
                { from: 'prof.chen@millhaven.edu', subject: 'Re: Essay extension', date: 'Mar 8', preview: 'That\'s fine, Maya — just get it to me by the 15th.', body: 'Maya,\n\nThat\'s fine. Just get it to me by the 15th. Your writing has been strong this term.\n\n— Prof. Chen' },
                { from: 'university-library@millhaven.edu', subject: 'Library reminder', date: 'Mar 7', preview: '2 items due in 3 days.', body: 'Dear Maya,\n\nYou have 2 items due in 3 days:\n— The Art of Disappearing (Reference)\n— Digital Privacy: A Practical Guide\n\nRenew online or at the front desk.' },
                { from: 'no-reply@millhaven.edu', subject: 'Tuition payment processed', date: 'Mar 3', preview: 'Your spring semester payment has been received.', body: 'Your spring semester tuition payment has been processed. No action required.' },
              ],
            },
            {
              name: 'Sent',
              emails: [
                { to: 'rvelasquez@pacificreporter.org', subject: 'Re: Digital stalking research — potential case', date: 'Mar 6', preview: 'Rosa, I have three independent sources now...', body: 'Rosa,\n\nI have three independent sources. WHOIS, court record (harassment, case #MH-2021-0384), and direct photographic evidence placing this person at the last known location of the victim.\n\nI know who he is. I need to understand my options before I go to the police.\n\nCan we speak Thursday?\n\n— M', isJournalistClue: true },
                { to: 'prof.chen@millhaven.edu', subject: 'Essay extension request', date: 'Mar 5', preview: 'Hi Professor Chen, I need a week more on the essay...', body: 'Hi Professor Chen,\n\nI need a week more on the essay — personal situation. Nothing I can explain right now.\n\nThank you,\nMaya' },
              ],
            },
            {
              name: 'Drafts',
              emails: [
                { subject: 'course reflection draft', date: 'Feb 28', preview: 'The relationship between digital identity and...', body: 'The relationship between digital identity and physical surveillance is less well understood than the reverse. We think of online behavior as traceable but bodies as free. The evidence suggests otherwise...\n\n[Draft, unfinished]' },
                { subject: '[no subject]', date: 'Mar 1', preview: 'I keep starting this and stopping.', body: 'I keep starting this and stopping.\n\nI don\'t know how to explain this to you without it breaking something.\n\n[Draft, abandoned]' },
                { subject: 'Dad', date: 'Mar 9', preview: 'I don\'t know how to write this.', isTarget: true, body: "Dad,\n\nI don't know how to write this.\n\nI've been working on a case for three months. A woman named Lena Vasquez. She went missing from Millhaven last April and the police have nothing.\n\nI found something.\n\nI know you'd have been upset that I didn't tell you sooner. I'm sorry. I needed to be sure.\n\nDad — it's Ray.\n\nI know how that sounds. I've verified it three independent ways:\n\n— The domain stillwater-media.net is registered to R. Callahan / Callahan Media at PO Box 441, Millhaven, OR. That's a WHOIS lookup. Public record.\n\n— The county court filing for case #MH-2021-0384 (harassment, restraining order) names Ray Callahan as the respondent. The victim was a woman in her late twenties. The order lasted two years.\n\n— His Flickr account has location data from April 13 (the night before Lena disappeared, near her apartment) and April 14 (the arts night, same venue, overlapping time window).\n\nHe was there. He had a restraining order. He knew things about her that were never public.\n\nI wasn't going to say anything until I had the court record. I have it now.\n\nHe has a key to the apartment. He knows the WiFi password. I don't know what he can see. That's why I didn't email sooner.\n\nI'm sending this from the library tomorrow morning.\n\nPlease don't call him. Please go straight to Detective Reyes at the Millhaven PD.\n\nI love you.\n\n— M\n\n[Draft — 11:47pm, March 9]" },
              ],
            },
          ],
          completionNote: null,
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
        monologue: "She had a corkboard. Photographs, strings, notes. The kind of thing you build when you're trying to make sense of something.",
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
          items: [
            { id: 'cp-01', text: '[Photo — Lena\'s Instagram profile page, printed. Her handle circled in red: @velvet.echo]', wrongFeedback: 'The starting point — Lena\'s public profile. Maya pinned this as reference, not evidence.' },
            { id: 'cp-02', text: '[Photo — Forum screenshot: @stillwater_m\'s first post]', wrongFeedback: 'The account Maya was investigating. Already covered in the file system.' },
            { id: 'cp-03', text: '[Photo — Arts night group photo. A crowd in an exhibition space. One figure in the background has been circled in pencil — out of focus, male, 50s, holding a camera bag]', suspicious: true, correctFeedback: "Someone in this photo has been circled by Maya. A man with a camera bag, standing near the exit. She identified him as significant.", tagRequired: true },
            { id: 'cp-04', text: '[Photo — Map of Millhaven with three locations marked: the Callahan Building, PO Box 441 on Main Street, and a courthouse]', suspicious: true, correctFeedback: "Three locations, all connected to one person. Maya drew connecting lines between them.", tagRequired: true },
            { id: 'cp-05', text: '[Photo — Lena\'s last Instagram post. The exterior of the Callahan Building in the background. The same building visible in Flickr photo f-004]', suspicious: true, correctFeedback: "Same building in both photos. Maya pinned these side by side. She was proving the venue was the location.", tagRequired: true },
            { id: 'cp-06', text: '[Photo — A newspaper clipping: "Callahan Media covers Millhaven Arts Night — third year running." Photo credit visible.]', suspicious: false, wrongFeedback: "The newspaper credit. Important evidence but not what Maya circled — she had this as background reference." },
            { id: 'cp-07', text: '[Photo — Screenshot of WHOIS results for stillwater-media.net. The registrant address highlighted]', wrongFeedback: 'WHOIS results Maya printed. Already known from the laptop investigation.' },
            { id: 'cp-08', text: '[Photo — A sticky note, handwritten, pinned to the far edge of the board: "Rosa Velasquez / Pacific Reporter / rvelasquez@pacificreporter.org / digital safety beat"]', suspicious: false, wrongFeedback: "The journalist contact. This is important but you haven't found it yet — you'll need Thread C to discover it properly." },
          ],
          requiredTags: ['cp-03', 'cp-04', 'cp-05'],
          wrongTagLimit: 3,
          completionNote: "Three photos. The circled figure. The map. The building match. Maya built this board to show the same person in three places. You're going to find out who he is.",
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
        monologue: "She printed this at A3 and pinned it to the board. She had zoomed in on four things.",
        content: {
          items: [
            { id: 'ca-01', text: '[Detail — Upper left corner of the photo. A banner visible on the wall: "Millhaven Arts Collective — Spring Exhibition"]', suspicious: true, correctFeedback: "The banner text identifies the event and venue. Maya needed this to confirm the building name.", tagRequired: true },
            { id: 'ca-02', text: '[Detail — Center. Lena Vasquez visible in profile, talking to another person. Timestamp on the digital frame: 7:47pm]', wrongFeedback: "Lena's presence is already known. The timestamp is important but not what Maya circled." },
            { id: 'ca-03', text: '[Detail — Background right. The circled figure. Holding a Canon camera body with a long lens. A lanyard around his neck. The lanyard tag is partially visible: "PRESS / CAL—"]', suspicious: true, correctFeedback: "Press lanyard. 'CAL—' — the beginning of Callahan. Maya was reading the lanyard in a zoomed photo.", tagRequired: true },
            { id: 'ca-04', text: '[Detail — Far left. A display table with a sign: "Callahan Media — Event Photography"]', suspicious: true, correctFeedback: "Callahan Media table. This is the business card display for the event photographer. Same name as the WHOIS record.", tagRequired: true },
            { id: 'ca-05', text: '[Detail — Floor. A camera bag on the ground near the exit. "CM" initials embroidered on the side]', wrongFeedback: 'The camera bag. CM = Callahan Media, but Maya flagged the display table, not the bag.' },
          ],
          requiredTags: ['ca-01', 'ca-03', 'ca-04'],
          wrongTagLimit: 3,
          completionNote: "The banner. The lanyard. The table. Three details in the same photo. She was building the case that Callahan Media — the photographer — was present at the venue when Lena disappeared.",
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
              prompt: 'The banner in the photo reads "Millhaven Arts Collective — Spring Exhibition." What is the name of the building visible in Lena\'s last Instagram post and the Flickr photos?',
              contextNote: "Look at the corkboard map Maya created — she labeled the primary location. Also visible in the photo detail you just analyzed.",
              acceptedAnswers: ['callahan building', 'the callahan building', 'callahan'],
              wrongFeedback: "The building has a name that matches the photographer's business. Look at the corkboard map.",
            },
            {
              prompt: 'If you wanted to find the official organizer of the Millhaven Arts Night, where would you look first?',
              contextNote: "Any public event with a venue and over ~50 attendees requires a permit filed with the city or county. That application names the official organizer — it's a public record.",
              acceptedAnswers: ['city clerk', 'permit', 'event permit', 'county', 'newspaper', 'millhaven courier', 'news', 'local newspaper', 'archive'],
              wrongFeedback: "Think about what public record would list an event's organizer. Hint: large public events require official permits.",
            },
          ],
          completionNote: "The Callahan Building. Named after the family. Ray Callahan's family. He wasn't just the photographer — he grew up there.",
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
            { title: 'Arts Collective Celebrates 10th Annual Spring Exhibition', summary: 'Apr 16 — Local coverage of the arts night. Photographer credit listed.', fields: { 'Date': 'April 16', 'Author': 'Staff Reporter, M. Connors', 'Section': 'Community Arts' }, body: 'The Millhaven Arts Collective celebrated its tenth annual Spring Exhibition on Saturday, drawing over 400 attendees to the Callahan Building on Main Street.\n\nEvent photography provided by Ray Callahan / Callahan Media, whose family has owned and donated use of the building for the Collective since its founding.\n\n"We\'re grateful to the Callahan family," said Collective director Anne Proctor. "This building has been the heart of the community arts program for a decade."\n\nThe exhibition featured work from 34 local artists. Lena Vasquez, who disappeared the following morning, is noted as having attended.', taggable: [
              { id: 'ta-01', text: '"Event photography provided by Ray Callahan / Callahan Media, whose family has owned and donated use of the building."', suspicious: true, correctFeedback: "Ray Callahan is the event photographer AND his family owns the Callahan Building. He had complete access." },
              { id: 'ta-02', text: '"Lena Vasquez, who disappeared the following morning, is noted as having attended."', suspicious: true, correctFeedback: "The newspaper confirms Lena attended the arts night — the same event where Ray was the photographer." },
              { id: 'ta-03', text: '"over 400 attendees"', suspicious: false, wrongFeedback: 'Attendance figure. Not relevant to the investigation.' },
            ]},
            { title: 'Callahan Building Listed on Millhaven Historic Register', summary: 'Jun 3 (3 years ago) — Building designation announcement.', fields: { 'Date': '3 years ago', 'Section': 'Local History' }, body: 'The Callahan Building on Main Street has been added to the Millhaven Historic Register, recognizing its architectural significance and nearly 80 years of community use.\n\nThe building was constructed by Thomas Callahan Sr. in 1944 and has remained in the family since. Current trustee Ray Callahan donated partial use to the Millhaven Arts Collective in 2014.' },
            { title: 'Harassment Case Settled — Man Ordered to Stay Away', summary: '4 years ago — Court filing summary. Name partially redacted.', fields: { 'Date': '4 years ago', 'Section': 'Court Records' }, body: 'A Millhaven man has been issued a restraining order following a harassment complaint, according to county court records.\n\nThe respondent — identified in court records by case number MH-2021-0384 — was ordered to maintain a distance of 300 yards from the complainant.\n\nThe Courier does not publish names in harassment cases to protect the victim. The order is on file with the county clerk.', taggable: [
              { id: 'ta-04', text: 'Case number MH-2021-0384 — the restraining order', suspicious: true, correctFeedback: "This is the case number Maya referenced in her email draft. The newspaper's partial report matches what she found in the full county records." },
              { id: 'ta-05', text: '"ordered to maintain a distance of 300 yards from the complainant"', suspicious: false, wrongFeedback: "Standard restraining order language. Not a specific clue." },
            ]},
          ],
          requiredTagIds: ['ta-01', 'ta-02', 'ta-04'],
          completionNote: "Three items: the photographer credit, Lena's confirmed attendance, and the case number. Three fragments of the same story.",
        },
        unlocks: ['C5'],
      },

      // C5 — Browse: business registry
      {
        id: 'C5',
        type: 'browse',
        path: 'C',
        title: "Oregon Business Registry — Callahan Media",
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
            { title: 'Callahan Media LLC', summary: 'Active — Registered agent: Raymond T. Callahan', fields: { 'Business Name': 'Callahan Media LLC', 'Status': 'Active', 'Registered Agent': 'Raymond T. Callahan', 'Principal Address': 'PO Box 441, Millhaven, OR 97411', 'Filing Date': '6 years ago', 'Entity Type': 'Limited Liability Company', 'Business Type': 'Photography and Media Services' }, body: null, taggable: [
              { id: 'br-01', text: 'Registered Agent: Raymond T. Callahan', suspicious: true, correctFeedback: "Full legal name: Raymond T. Callahan. This matches the WHOIS registrant 'R. Callahan' and the newspaper credit 'Ray Callahan.'" },
              { id: 'br-02', text: 'Principal Address: PO Box 441, Millhaven, OR 97411', suspicious: true, correctFeedback: "PO Box 441 — identical to the WHOIS address for stillwater-media.net. This is the third source confirming the same address." },
              { id: 'br-03', text: 'Filing Date: 6 years ago', suspicious: false, wrongFeedback: 'The business was registered 6 years ago. Useful for timeline but not a specific clue.' },
            ]},
            { title: 'Stillwater Media Inc. (DISSOLVED)', summary: 'Dissolved 3 years ago — same registered agent', fields: { 'Business Name': 'Stillwater Media Inc.', 'Status': 'Dissolved', 'Registered Agent': 'Raymond T. Callahan', 'Principal Address': 'PO Box 441, Millhaven, OR 97411', 'Dissolution Date': '3 years ago' }, body: null, taggable: [
              { id: 'br-04', text: 'Business Name: Stillwater Media Inc. — same address, same agent', suspicious: true, correctFeedback: "Stillwater Media — the origin of the username 'stillwater_m'. The domain is stillwater-media.net. All three names come from the same registered business." },
            ]},
          ],
          requiredTagIds: ['br-01', 'br-02', 'br-04'],
          completionNote: "Raymond T. Callahan. PO Box 441. Callahan Media and Stillwater Media — both his, same address. The username was his old company name.",
        },
        unlocks: ['C6'],
      },

      // C6 — Tag: tag key facts in court record
      {
        id: 'C6',
        type: 'browse',
        path: 'C',
        title: "Multnomah County Court — Case MH-2021-0384",
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
          systemName: 'Multnomah County Court — Civil Filing',
          records: [
            { title: 'Case MH-2021-0384 — Restraining Order (Civil)', summary: 'Filed 4 years ago. Petitioner: K. Nair. Respondent: Raymond T. Callahan.', fields: { 'Case Number': 'MH-2021-0384', 'Case Type': 'Restraining Order — Civil Harassment', 'Filing Date': '4 years ago', 'Petitioner': 'K. Nair', 'Respondent': 'Raymond T. Callahan, PO Box 441, Millhaven, OR', 'Order Duration': '2 years (expired)', 'Status': 'Closed' }, body: 'PETITION FOR RESTRAINING ORDER\n\nPetitioner states that Respondent, Raymond T. Callahan, has engaged in a pattern of unwanted contact and surveillance over a period of eight months.\n\nSpecific conduct included:\n— Appearing at locations known only through Petitioner\'s private communications\n— Monitoring Petitioner\'s email account without consent\n— Creating online profiles to follow Petitioner\'s activities under pseudonymous accounts\n— Following Petitioner in a vehicle on four documented occasions\n\nRespondent denied all allegations. No criminal charges were filed.\n\nOrder granted. Respondent ordered to maintain 300-yard distance from Petitioner for a period of two years.\n\nOrder expired. No renewal sought.', taggable: [
              { id: 'cr-01', text: 'Respondent: Raymond T. Callahan, PO Box 441, Millhaven, OR', suspicious: true, correctFeedback: "Full name and address — confirming what the business registry and WHOIS records said. Three independent sources, identical identity." },
              { id: 'cr-02', text: '"Creating online profiles to follow Petitioner\'s activities under pseudonymous accounts"', suspicious: true, correctFeedback: "Pseudonymous online accounts. This is the same behavior pattern Maya documented — stillwater_m, nightwatch_rc." },
              { id: 'cr-03', text: '"Appearing at locations known only through Petitioner\'s private communications" and "Monitoring Petitioner\'s email account without consent"', suspicious: true, correctFeedback: "Email monitoring and location surveillance. Maya wrote that Ray had access to her father's devices — this is the pattern repeating." },
              { id: 'cr-04', text: 'Order expired. No renewal sought.', suspicious: false, wrongFeedback: "The expiration is significant but not a specific flag. The behavior described in the order is what matters." },
            ]},
          ],
          requiredTagIds: ['cr-01', 'cr-02', 'cr-03'],
          completionNote: "Four years ago. A different woman, a different city. The same pattern: pseudonymous accounts, email monitoring, showing up where she shouldn't be. He's done this before.",
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
            { id: 'business', label: 'Callahan Media LLC', details: 'Business registry: Raymond T. Callahan, PO Box 441' },
            { id: 'username', label: 'stillwater_m', details: 'Forum account. Insider knowledge of Lena\'s private details.' },
            { id: 'court', label: 'Case MH-2021-0384', details: 'Restraining order: Raymond T. Callahan. Pattern: pseudonymous accounts, email access.' },
            { id: 'photo', label: 'Arts Night Photo', details: 'Ray Callahan, Callahan Media — official photographer. Present at Lena\'s last location.' },
          ],
          requiredConnections: [
            { from: 'domain', to: 'business', label: 'Same PO Box 441 — same registrant name' },
            { from: 'business', to: 'username', label: 'Stillwater Media → stillwater_m username' },
            { from: 'username', to: 'court', label: 'Pseudonymous accounts — same pattern as restraining order' },
            { from: 'court', to: 'photo', label: 'Same person: Raymond T. Callahan' },
            { from: 'photo', to: 'domain', label: 'Ray Callahan present at arts night — location confirmed by WHOIS city' },
          ],
          wrongFeedback: 'No direct connection between those two. Try a different pair — look for shared names, addresses, or behaviors.',
          completionNote: "All five connections. One address. One name. Three independent trails from three separate starting points — and they all end in the same place.",
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
              { name: 'front_of_board.txt', type: 'file', content: 'Main section:\n— Lena\'s photo (circled: arts night)\n— stillwater_m post screenshots\n— WHOIS printout (PO Box 441 highlighted)\n— Callahan Media business card (photographed)\n— Court record printout (case # circled)\n\nRed string connecting all five to a central index card labeled: RAY CALLAHAN' },
              { name: 'map_section.txt', type: 'file', content: 'Map of Millhaven pinned to left panel:\n— Star: Callahan Building (arts night venue)\n— Star: PO Box 441 on Main Street\n— Star: Millhaven Courthouse\n\nHandwritten at the bottom: "All three lines connect to the same person."' },
              { name: 'notes_scraps.txt', type: 'file', content: 'Loose notes pinned around the edges:\n\n"He was at the arts night — official photographer — had access to all areas"\n"Forum account: insider knowledge, never public"\n"Prior restraining order — same behavior pattern"\n"Do NOT email Dad from this laptop"\n"Library computer — Thursday morning"' },
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
