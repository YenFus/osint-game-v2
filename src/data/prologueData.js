// ─────────────────────────────────────────────────────────────────
// PROLOGUE DATA — "A Small Absence"
//
// Diary-style pages: each narrative section is one page.
// Players read the full entry at their own pace, then press
// space / click to advance — no auto-scroll per sentence.
//
// Structure:
//   2 × chapter title cards (auto-advance)
//   7 × diary pages (user-paced)
//   1 × end chapter card (user-paced — deliberate pause before play)
// ─────────────────────────────────────────────────────────────────

export const PROLOGUE_PANELS = [

  // ── Title cards ────────────────────────────────────────────────

  {
    id: 'title',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'What Maya Knew',
      voice: 'chapter',
      wordPause: 90,
      pauseAfter: {},
    },
    autoAdvance: true,
    autoAdvanceDelay: 1400,
  },

  {
    id: 'chapter_one',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Chapter One — A Small Absence',
      voice: 'chapter',
      wordPause: 45,
      pauseAfter: { '—': 350 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1200,
  },

  // ── Diary pages ────────────────────────────────────────────────

  {
    id: 'page_restaurant',
    type: 'diary',
    transition: 'drift',
    date: 'Tuesday, November',
    time: '7:00 pm',
    section: 'The Restaurant',
    lines: [
      { voice: 'thomas', text: 'She said seven. I was there at six-forty-five.' },
      { voice: 'thomas', text: 'The restaurant was the kind that stays half-empty on a Tuesday. She liked it for that.' },
      { voice: 'thomas', text: 'I ordered coffee. I do not drink coffee after noon. Old habit from the years I spent waiting for people who were late.' },
      { voice: 'thomas', text: 'Seven-fifteen. Seven-thirty.' },
      { voice: 'thomas', text: 'She had been late before. Maya was always somewhere between early and somewhere else.' },
    ],
  },

  {
    id: 'page_call',
    type: 'diary',
    transition: 'drift',
    date: 'Tuesday, November',
    time: '8:00 pm',
    section: 'The Call',
    lines: [
      { voice: 'thomas', text: 'Eight o\'clock.' },
      { voice: 'thomas', text: 'I called her. The phone rang out. Not voicemail — just rings. Seven of them. I counted.' },
      { voice: 'thomas', text: 'I texted: "You coming?" Three words. Her last read receipt was from three days ago.' },
      { voice: 'thomas', text: 'Three days ago. I had not noticed.' },
    ],
  },

  {
    id: 'page_morning',
    type: 'diary',
    transition: 'drift',
    date: 'Wednesday, November',
    time: 'Morning',
    section: 'The Next Morning',
    lines: [
      { voice: 'thomas', text: 'Maya\'s professor, Dr. Ayesha Nair, said she had not been in class since Friday.' },
      { voice: 'dialogue', text: '"She emailed me Thursday night about her project. I assumed she was working from home."' },
      { voice: 'thomas', text: 'She had not questioned it. Why would she?' },
      { voice: 'thomas', text: 'I called her roommate. Her best friend from school. Her supervisor at the university paper.' },
      { voice: 'thomas', text: 'Everyone said the same thing. She had been distracted lately. Quieter. Working on something she wouldn\'t talk about.' },
    ],
  },

  {
    id: 'page_drive',
    type: 'diary',
    transition: 'drift',
    date: 'Wednesday, November',
    time: 'Afternoon',
    section: 'The Drive',
    lines: [
      { voice: 'thomas', text: 'I drove to her apartment.' },
      { voice: 'thomas', text: 'Elena would have known what to do. She always did.' },
      { voice: 'thomas', text: 'Maya was six when her mother died. She cried for three days. Then she stopped and started asking questions.' },
      { voice: 'thomas', text: 'She never stopped asking questions after that.' },
    ],
  },

  {
    id: 'page_apartment',
    type: 'diary',
    transition: 'drift',
    date: 'Wednesday, November',
    time: 'Her Apartment',
    section: 'Inside',
    lines: [
      { voice: 'thomas', text: 'Her lights were off.' },
      { voice: 'thomas', text: 'The super let me in. He knew who I was. Maya had talked about me.' },
      { voice: 'thomas', text: 'Everything was in its place. That was the wrong kind of order. The kind that means nobody has been there to disturb it.' },
      { voice: 'thomas', text: 'Her keys. Her wallet. Her transit card.' },
      { voice: 'thomas', text: 'She had not left. She had simply — stopped being there.' },
      { voice: 'thomas', text: 'The bed was made. Maya never made her bed. Her mother used to joke about it.' },
      { voice: 'thomas', text: 'Cold coffee on the nightstand. Half drunk. A book face-down. Two books.' },
    ],
  },

  {
    id: 'page_laptop',
    type: 'diary',
    transition: 'drift',
    date: 'Wednesday, November',
    time: 'Evening',
    section: 'The Laptop',
    lines: [
      { voice: 'thomas', text: 'Her laptop was open.' },
      { voice: 'thomas', text: 'Seventeen tabs. I counted.' },
      { voice: 'thomas', text: 'Research notes in a document titled "Stillwater — thread 4." A social media profile she had been tracking for six months.' },
      { voice: 'thomas', text: 'She had been investigating someone. Someone who knew she was doing it.' },
    ],
  },

  {
    id: 'page_decides',
    type: 'diary',
    transition: 'drift',
    section: 'Thomas Decides',
    lines: [
      { voice: 'thomas', text: 'I am not a detective. I am a journalist.' },
      { voice: 'thomas', text: 'For twenty-three years I made a living from noticing what other people missed.' },
      { voice: 'thomas', text: 'My daughter was trying to tell me something for months. I was not paying attention.' },
      { voice: 'thomas', text: 'I am paying attention now.' },
    ],
  },

  // ── End card — user presses space to enter the game ───────────

  {
    id: 'end_title',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Her apartment. Her work. Start there.',
      voice: 'chapter',
      wordPause: 50,
      pauseAfter: { 'apartment.': 400, 'work.': 400 },
    },
    autoAdvance: false,
  },

]
