// ─────────────────────────────────────────────────────────────────
// PROLOGUE — seven screens, one fact each.
//
// Each beat shows the thing Thomas was looking at — his texts, the call,
// the voicemail, the police receipt, Ray's call, his photos of her flat,
// her laptop — and his line says, in plain words, what it told him.
//
// Rewritten after a full playthrough. The player said the old lines read
// as AI-written noir ("Maya is never late twice", "He knew it first") and
// that Lena arrived as one sentence of narration rather than something
// they read. Now the facts are on the screens and Thomas just talks.
//
// Voice: Thomas is a retired crime reporter. He's frightened and keeping
// it together. Short sentences, contractions, no poses. See
// docs/story-bible.md.
// ─────────────────────────────────────────────────────────────────

export const PROLOGUE_BEATS = [
  {
    id: 'messages',
    art: 'messages',
    stamp: 'Tuesday · 8:20 pm',
    lines: [
      { text: 'Maya asked me to dinner. She said she had something to tell me.' },
      { text: "She picked the place. She's an hour late, and she's never late. Not for me." },
    ],
  },
  {
    id: 'calling',
    art: 'calling',
    stamp: 'Tuesday · 8:21 pm',
    lines: [
      { text: 'I called. It rang out.' },
      { text: "Then I saw it. A voicemail from her, from Monday morning. I'd missed it." },
    ],
  },
  {
    id: 'voicemail',
    art: 'voicemail',
    stamp: 'Monday · 7:52 am — unheard',
    // The one beat that plays a real recording. It plays on a press, not on
    // arrival: pressing play on your daughter's last message is the beat.
    audio: {
      src: 'audio/maya-voicemail.mp4',
      label: "Maya's voicemail, Monday 7:52am",
      // exactly what the recording says (checked with a speech recogniser)
      transcript: "Hey Dad, it's me. Okay. I need to tell you something, and I should've told you weeks ago. I'm sorry. It's about the thing I've been working on. I'm okay. I want you to hear me say that first. I'm okay. But if I don't call you back tonight, I need you to go to the— Hang on. Someone's at the door. One sec.",
    },
    lines: [
      { text: 'I thought it was about dinner. It was the last thing she said to anyone.' },
      { text: '"I\'m okay. I want you to hear me say that first."', voice: 'maya' },
      { text: '"Hang on. Someone\'s at the door."', voice: 'maya' },
    ],
  },
  {
    id: 'police',
    art: 'police',
    stamp: 'Wednesday · 9:10 am',
    lines: [
      { text: 'Wednesday morning I reported her missing.' },
      { text: "The officer was kind about it. She's twenty-four, he said. Adults switch their phones off. Give it a few days." },
      { text: "I don't have a few days. I used to do this for a living. I'll do it myself." },
    ],
  },
  {
    id: 'ray',
    art: 'ray',
    stamp: 'Wednesday · 12:04 pm',
    lines: [
      { text: "Ray. My best friend for thirty years. He's Maya's godfather." },
      { text: "He'd heard before I could tell him." },
      { text: '"Tom. Whatever you need, buddy. I mean it. Anything."', voice: 'ray' },
    ],
  },
  {
    id: 'apartment',
    art: 'apartment',
    stamp: 'Wednesday · 6:30 pm — my photos',
    lines: [
      { text: "I've got a key to her place. I photographed everything, the way I used to at a scene." },
      { text: 'Her keys were in the bowl by the door. Her wallet was on the counter, cards still in it.' },
      { text: "She didn't walk out of here. And somebody had tried to burn her notebook." },
    ],
  },
  {
    id: 'laptop',
    art: 'laptop',
    stamp: 'Wednesday · 6:40 pm — her laptop',
    lines: [
      { text: 'Her laptop was open. Seventeen tabs, all about the same woman.' },
      { text: "Lena Vasquez. Missing since last April. I'd never heard her name." },
      { text: "Whatever Maya was working on, she was doing it on her own. I'm going to find out what it was." },
    ],
  },
]
