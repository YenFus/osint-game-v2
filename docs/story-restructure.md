# Restructure: the name arrives late

The critic's first finding was that the case is over in minute three: the
prologue names "Ray Callahan", and the first corkboard shows "R. Callahan"
and "Callahan Media". Everything after that confirms what the player already
knows. This is the plan that fixes it.

## The rule

The surname **Callahan** does not appear anywhere a player can reach in the
first hour. It arrives once, late, as a reveal — and it arrives at the end of
whichever thread the player is on, so nobody misses it and nobody gets it early.

## What changes names

| Was | Becomes | Why |
|---|---|---|
| The Callahan Building | **Alder Hall** | The venue must not carry the culprit's surname. |
| Callahan Media (his business) | **Stillwater Media** | Ties to the handle `stillwater_m`, which is the thread the player is already pulling — and names no person. |
| Stillwater Media Inc. (dissolved) | **Alder Hall Trust** | Still a second filing to the same PO box, but it now ties him to the venue instead of duplicating the business. |
| Prologue: "Ray Callahan. My oldest friend" | "Ray. My oldest friend" | Thomas calls his friend by his first name, the way people do. |

## Verified

The earliest any screen can show the surname is **C5, the tenth lead**, and
reaching it means working two threads: A1, A2, A3, A6, A7 (the shielded
registration, which is what gives you a company and a postbox to search on)
and C1–C4. Thread A reaches it at A12 after eleven, thread B at B8 after
fifteen. Three unit tests in `caseData.test.js` hold this: nothing carrying
the name is reachable inside nine leads, nothing is reachable from a single
thread, and the prologue and cast list never say it.

## Where the name lands

Each thread reaches it at its own end, by its own route:

- **Thread A** — A7 finds the WHOIS *privacy shield*, switched on days after Maya
  started asking. A11 links handle → domain → PO box → Stillwater Media. A12
  (new, last in A) pulls the **archived** WHOIS from before the shield went up:
  `R. Callahan`.
- **The gates** — C5 (the registry) and B7 (the cached site) both need A7
  finished first, because you cannot search a registry or pull an archive
  without a company, a postbox or a domain to search on.
- **Thread B** — B8, the archived page source: author `Ray Callahan`, WordPress
  user `rcallahan_admin`.
- **Thread C** — C5, the state registry: Stillwater Media LLC and Alder Hall
  Trust, both filed by `Raymond T. Callahan` to PO Box 441.

Thomas's own line carries the moment, and it is staged: the first record that
carries a surname stops the board and gives him a beat to react in, rather
than printing the name in a table row. The cast list rewrites itself at the
same instant — "Ray" becomes "Raymond T. Callahan".

## The other suspects

The player has to clear two men before the name means anything.

1. **Corey Marsh** — the forum's favourite, pushed there by stillwater_m
   himself. Cleared by A13: his camera puts him in a body shop both nights.
2. **Owen Pryce** — director of the Millhaven Arts Collective, organised that
   night, last person on record to speak to Lena, and he would not give anyone
   the guest list. stillwater_m quietly points at him too. The programme clears
   him: he was on stage introducing Lena at 7:45, while the photographer's kit
   sat in an empty side room.
3. **stillwater_m** — a handle with no face, until the records give it one.

## What the board must not give away

The case board used to show a "Ray · Uneasy" chip and a "Ray → Seattle"
deadline from the first minute, which names the culprit through the UI itself.
Until the player holds a clue that carries the name, the chip is the deadline
only — dawn, and the window Okafor has. Ray still texts, still reacts to what
he is told, and his unease still moves the deadline; the player just isn't told
that the clock and the friend are the same thing. Once the name lands, the chip
becomes Ray, and the dread phase begins.
