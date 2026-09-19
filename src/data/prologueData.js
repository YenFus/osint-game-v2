// ─────────────────────────────────────────────────────────────────
// PROLOGUE — six screens off Thomas's phone and his daughter's laptop.
//
// Nothing here is a depicted scene. You are looking at what he was
// looking at: a message thread, a call that rings out, a voicemail,
// a name on an incoming call, photographs he took himself, her
// browser. Found media, the way the rest of the game works.
//
// It also has one job besides mood: say plainly who everyone is
// before the investigation starts. Maya is his daughter. Ray is his
// oldest friend. Lena is the woman Maya was looking for.
// ─────────────────────────────────────────────────────────────────

export const PROLOGUE_BEATS = [
  {
    id: 'messages',
    art: 'messages',
    stamp: 'Tuesday · 8:20 pm',
    lines: [
      { text: 'My daughter Maya asked me to dinner. She picked the place.' },
      { text: 'She is an hour late, and Maya is never late twice.' },
    ],
  },
  {
    id: 'calling',
    art: 'calling',
    stamp: 'Tuesday · 8:21 pm',
    lines: [
      { text: 'Seven rings. She never did set up her voicemail.' },
      { text: 'The last message she opened was on Sunday.' },
    ],
  },
  {
    id: 'voicemail',
    art: 'voicemail',
    stamp: 'Monday · 7:52 am — unheard',
    // The one beat in this game that wanted a recording rather than a
    // waveform drawn with Math.sin. It plays on a press, not on arrival:
    // pressing play on your daughter's last message is the beat.
    audio: {
      src: 'audio/maya-voicemail.mp4',
      label: "Maya's voicemail, Monday 7:52am",
      // what is actually said, for anyone who cannot or will not hear it
      transcript: "Dad, it's me. I need to tell you something, and I should have told you weeks ago. It's about what I've been working on. I'm okay. I want you to hear me say that first. But if I don't call you back tonight, I need you to — hang on. Someone's at the door.",
    },
    lines: [
      { text: 'There was one waiting for me. From the morning before.' },
      { text: '"Dad, it\'s me. I need to tell you something—"', voice: 'maya' },
      { text: '"—hang on. Someone\'s at the door."', voice: 'maya' },
    ],
  },
  {
    id: 'ray',
    art: 'ray',
    stamp: 'Wednesday · 12:04 pm',
    lines: [
      { text: 'Ray. My oldest friend, thirty years of him.' },
      { text: 'He heard before I could call him.' },
      { text: '"Whatever you need, Tom. I mean it."', voice: 'ray' },
    ],
  },
  {
    id: 'apartment',
    art: 'apartment',
    stamp: 'Wednesday · 6:30 pm — my photos',
    lines: [
      { text: 'I let myself into her apartment and photographed everything.' },
      { text: 'Her keys. Her wallet. Her bed not slept in.' },
      { text: 'Her notebook was half burned, shoved under a pile of paper.' },
    ],
  },
  {
    id: 'laptop',
    art: 'laptop',
    stamp: 'Wednesday · 6:40 pm — her laptop',
    lines: [
      { text: 'Seventeen tabs. All of them the same missing woman.' },
      { text: 'Lena Vasquez. Lived across the river from here. Gone a year, after a night forty miles south.' },
      { text: 'My daughter was hunting someone. He knew it first.' },
    ],
  },
]
