// ─────────────────────────────────────────────────────────────────
// PROLOGUE DATA — "A Small Absence"
//
// Text-only panels for the prologue chapter.
// Each panel is a chapter card with narration - no images.
// ─────────────────────────────────────────────────────────────────

export const PROLOGUE_PANELS = [

  // ─────────────────────────────────────────────────────────────
  // TITLE
  // ─────────────────────────────────────────────────────────────

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
    autoAdvanceDelay: 1210,
  },

  {
    id: 'chapter_one',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Chapter One — A Small Absence',
      voice: 'chapter',
      wordPause: 40,
      pauseAfter: { '—': 350 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 990,
  },

  // ─────────────────────────────────────────────────────────────
  // THE RESTAURANT
  // ─────────────────────────────────────────────────────────────

  {
    id: 'restaurant_1',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Tuesday. November.',
      voice: 'thomas',
      wordPause: 63,
      pauseAfter: { 'Tuesday.': 600 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 770,
  },

  {
    id: 'restaurant_2',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'She said seven. I was there at six-forty-five.',
      voice: 'thomas',
      wordPause: 32,
      pauseAfter: { 'seven.': 400 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1100,
  },

  {
    id: 'restaurant_3',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'The restaurant was the kind that stays half-empty on a Tuesday. She liked it for that.',
      voice: 'thomas',
      wordPause: 29,
      pauseAfter: { 'Tuesday.': 300 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1320,
  },

  {
    id: 'waiting',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'I ordered coffee. I do not drink coffee after noon. Old habit from the years I spent waiting for people who were late.',
      voice: 'thomas',
      wordPause: 31,
      pauseAfter: { 'coffee.': 280, 'noon.': 400 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1760,
  },

  {
    id: 'waiting_2',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'Seven-fifteen. Seven-thirty.',
      voice: 'thomas',
      wordPause: 72,
      pauseAfter: { 'Seven-fifteen.': 700 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 990,
  },

  {
    id: 'waiting_3',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'She had been late before. Maya was always somewhere between early and somewhere else.',
      voice: 'thomas',
      wordPause: 30,
      pauseAfter: { 'before.': 220 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1430,
  },

  // ─────────────────────────────────────────────────────────────
  // THE CALL
  // ─────────────────────────────────────────────────────────────

  {
    id: 'call_1',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Eight o\'clock.',
      voice: 'thomas',
      wordPause: 72,
      pauseAfter: { 'o\'clock.': 900 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 770,
  },

  {
    id: 'call_2',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'I called her. The phone rang out. Not voicemail — just rings. Seven of them. I counted.',
      voice: 'thomas',
      wordPause: 30,
      pauseAfter: { 'out.': 300, 'them.': 280 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1650,
  },

  {
    id: 'call_3',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'I texted: "You coming?" Three words. Her last read receipt was from three days ago.',
      voice: 'thomas',
      wordPause: 29,
      pauseAfter: { 'coming?"': 300 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1540,
  },

  {
    id: 'call_4',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'Three days ago. I had not noticed.',
      voice: 'thomas',
      wordPause: 38,
      pauseAfter: { 'ago.': 500 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1100,
  },

  // ─────────────────────────────────────────────────────────────
  // THE NEXT MORNING
  // ─────────────────────────────────────────────────────────────

  {
    id: 'chapter_two',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'The next morning',
      voice: 'chapter',
      wordPause: 40,
      pauseAfter: {},
    },
    autoAdvance: true,
    autoAdvanceDelay: 880,
  },

  {
    id: 'professor_1',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Maya\'s professor, Dr. Ayesha Nair, said she had not been in class since Friday.',
      voice: 'thomas',
      wordPause: 29,
      pauseAfter: { 'Nair,': 200 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1540,
  },

  {
    id: 'professor_2',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: '"She emailed me Thursday night about her project. I assumed she was working from home."',
      voice: 'dialogue',
      wordPause: 28,
      pauseAfter: { 'home."': 380 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1430,
  },

  {
    id: 'professor_3',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'She had not questioned it. Why would she?',
      voice: 'thomas',
      wordPause: 31,
      pauseAfter: { 'it.': 300 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1100,
  },

  {
    id: 'calls',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'I called her roommate. Her best friend from school. Her supervisor at the university paper.',
      voice: 'thomas',
      wordPause: 29,
      pauseAfter: { 'roommate.': 200, 'friend.': 200 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1540,
  },

  {
    id: 'everyone',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'Everyone said the same thing. She had been distracted lately. Quieter. Working on something she wouldn\'t talk about.',
      voice: 'thomas',
      wordPause: 29,
      pauseAfter: { 'lately.': 220, 'Quieter.': 280 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1760,
  },

  // ─────────────────────────────────────────────────────────────
  // THE DRIVE
  // ─────────────────────────────────────────────────────────────

  {
    id: 'drive_1',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'I drove to her apartment.',
      voice: 'thomas',
      wordPause: 40,
      pauseAfter: {},
    },
    autoAdvance: true,
    autoAdvanceDelay: 990,
  },

  {
    id: 'drive_2',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Elena would have known what to do. She always did.',
      voice: 'thomas',
      wordPause: 36,
      pauseAfter: { 'do.': 450 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1320,
  },

  {
    id: 'drive_3',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'Maya was six when her mother died. She cried for three days. Then she stopped and started asking questions.',
      voice: 'thomas',
      wordPause: 28,
      pauseAfter: { 'died.': 350, 'days.': 300 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1870,
  },

  {
    id: 'drive_4',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'She never stopped asking questions after that.',
      voice: 'thomas',
      wordPause: 34,
      pauseAfter: {},
    },
    autoAdvance: true,
    autoAdvanceDelay: 1210,
  },

  // ─────────────────────────────────────────────────────────────
  // THE APARTMENT
  // ─────────────────────────────────────────────────────────────

  {
    id: 'apartment_1',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Her lights were off.',
      voice: 'thomas',
      wordPause: 54,
      pauseAfter: { 'off.': 600 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 880,
  },

  {
    id: 'apartment_2',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'The super let me in. He knew who I was. Maya had talked about me.',
      voice: 'thomas',
      wordPause: 31,
      pauseAfter: { 'in.': 240, 'me.': 240 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1430,
  },

  {
    id: 'apartment_3',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Everything was in its place. That was the wrong kind of order.',
      voice: 'thomas',
      wordPause: 30,
      pauseAfter: { 'place.': 300 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1320,
  },

  {
    id: 'apartment_4',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'The kind that means nobody has been there to disturb it.',
      voice: 'thomas',
      wordPause: 30,
      pauseAfter: {},
    },
    autoAdvance: true,
    autoAdvanceDelay: 1210,
  },

  {
    id: 'details_1',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Her keys. Her wallet. Her transit card.',
      voice: 'thomas',
      wordPause: 50,
      pauseAfter: { 'keys.': 350, 'wallet.': 350 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1210,
  },

  {
    id: 'details_2',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'She had not left. She had simply — stopped being there.',
      voice: 'thomas',
      wordPause: 34,
      pauseAfter: { 'left.': 400, '—': 600 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1540,
  },

  {
    id: 'details_3',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'The bed was made. Maya never made her bed. Her mother used to joke about it.',
      voice: 'thomas',
      wordPause: 31,
      pauseAfter: { 'made.': 400, 'bed.': 240 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1540,
  },

  {
    id: 'details_4',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'Cold coffee on the nightstand. Half drunk. A book face-down. Two books.',
      voice: 'thomas',
      wordPause: 36,
      pauseAfter: { 'nightstand.': 250, 'down.': 300 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1430,
  },

  // ─────────────────────────────────────────────────────────────
  // THE LAPTOP
  // ─────────────────────────────────────────────────────────────

  {
    id: 'laptop_1',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Her laptop was open.',
      voice: 'thomas',
      wordPause: 50,
      pauseAfter: { 'open.': 800 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 990,
  },

  {
    id: 'laptop_2',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'Seventeen tabs. I counted.',
      voice: 'thomas',
      wordPause: 29,
      pauseAfter: { 'counted.': 320 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 990,
  },

  {
    id: 'laptop_3',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'Research notes in a document titled "Stillwater — thread 4." A social media profile she had been tracking for six months.',
      voice: 'thomas',
      wordPause: 29,
      pauseAfter: { '4."': 280 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1870,
  },

  {
    id: 'laptop_4',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'She had been investigating someone. Someone who knew she was doing it.',
      voice: 'thomas',
      wordPause: 32,
      pauseAfter: { 'someone.': 380 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1540,
  },

  // ─────────────────────────────────────────────────────────────
  // THOMAS DECIDES
  // ─────────────────────────────────────────────────────────────

  {
    id: 'thomas_1',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'I am not a detective. I am a journalist.',
      voice: 'thomas',
      wordPause: 29,
      pauseAfter: { 'detective.': 400 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1210,
  },

  {
    id: 'thomas_2',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'For twenty-three years I made a living from noticing what other people missed.',
      voice: 'thomas',
      wordPause: 30,
      pauseAfter: {},
    },
    autoAdvance: true,
    autoAdvanceDelay: 1430,
  },

  {
    id: 'thomas_3',
    type: 'chapter',
    transition: 'cut',
    narration: {
      text: 'My daughter was trying to tell me something for months. I was not paying attention.',
      voice: 'thomas',
      wordPause: 30,
      pauseAfter: { 'months.': 360 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1540,
  },

  {
    id: 'thomas_4',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'I am paying attention now.',
      voice: 'thomas',
      wordPause: 40,
      pauseAfter: {},
    },
    autoAdvance: true,
    autoAdvanceDelay: 1210,
  },

  // ─────────────────────────────────────────────────────────────
  // END
  // ─────────────────────────────────────────────────────────────

  {
    id: 'end_title',
    type: 'chapter',
    transition: 'drift',
    narration: {
      text: 'Her apartment. Her work. Start there.',
      voice: 'chapter',
      wordPause: 38,
      pauseAfter: { 'apartment.': 400, 'work.': 400 },
    },
    autoAdvance: true,
    autoAdvanceDelay: 1100,
  },

]
