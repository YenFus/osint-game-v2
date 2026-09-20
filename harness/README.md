# harness/

Checks that live in the repo because they catch a class of bug the review
process kept missing. Everything else still lives in the session scratchpad.

Run against the dev server on :5173.

## mobplay.cjs — interaction-state layout on real phone sizes

```bash
node harness/mobplay.cjs           # all 28 leads x 3 viewports
node harness/mobplay.cjs C1 B1     # just these
```

### Why this exists

Two bugs shipped that a player hit in the first ten minutes on a phone:

- tapping a detail on a photo lead put the magnified view somewhere you
  could not see it;
- the burned notebook spilled its recovered text across the brightness slider.

Fifteen rounds of review missed both, and so did every probe in the loop,
because they all share one signature:

> **They need an interaction AND a short viewport at the same time.**

Every earlier check measured the *resting* state at *390x844*. A real phone
gives a page 600-670px after browser chrome, and neither bug exists until you
tap a hotspot or drag a slider. Testing one without the other finds nothing.

### What it does

For each lead, at 390x844, 390x664 and 360x600, it captures the state at rest,
then drives that lead's own interaction (hotspots, sliders, text entry, or the
first few live controls), and re-checks. It reports only what the interaction
*introduced*.

Four invariants:

| | |
|---|---|
| **A** | every control is on screen or can be scrolled to |
| **B** | no text paints over a control that cannot be scrolled clear of it |
| **C** | nothing is clipped by an `overflow:hidden` ancestor with no scrollable ancestor above it |
| **D** | zero-size controls |

### The four false-positive traps, and how they are handled

Getting these wrong is what makes a harness worse than no harness. The first
version of this one reported 737 findings, almost all of them noise.

1. **Cross-layer geometry.** Controls behind an open modal are correctly
   covered and inert. Comparing a dialog's geometry with the board's produces
   overlaps that do not exist to a player. → every candidate must be in the
   same layer (`inLayer`).
2. **`elementFromPoint` returns children.** A hit on a child span of a button
   is not an obstruction. → containment is checked both ways.
3. **Sticky bars always overlap something mid-scroll.** A pinned footer sitting
   over a row is normal. It is only a defect if the control cannot be scrolled
   clear. → on a hit, scroll the control to centre and re-test; report only if
   it is *still* obscured.
4. **Collapsed drawers keep their contents in the DOM.** The mobile clue drawer
   holds ~24 cards clipped to a zero-height box. Those are behind a toggle, not
   unreachable. → `collapsed()` walks for a clipping ancestor the element lies
   outside of.

### Rules of use

- **A finding is a lead, not a verdict.** Every one in this file's history that
  looked real and was not turned out to be one of the four traps above. Open a
  screenshot before you change code.
- **Tap the survivors.** Geometry says a control is obscured; a tap says whether
  a player can use it. `taptest.cjs` and `bars.cjs` in the scratchpad do this.
- **Add a viewport, not an assertion,** when a new bug is reported from a real
  device. The height is usually the thing that reproduces it.


## shotall.cjs — the whole game, as a player sees it

```bash
SHOT_DIR=/tmp/shots node harness/shotall.cjs              # everything, both viewports
SHOT_DIR=/tmp/shots node harness/shotall.cjs mobile leads # one viewport, one section
```

Sections: `menu prologue apartment board leads reveal converge ending modals`.
Viewports: desktop 1440x950, and mobile **390x664** — a real phone *after*
browser chrome, not the 390x844 that fifteen rounds of review used.

Captures every screen and one frame after every interaction that changes
anything: ~355 images, numbered in the order a player meets them. Then **look
at them**. That is the whole point — this project has shipped a 1.01:1 climax
card, placeholder squiggles under a magnifier, a notched phrase highlight and a
magnified view nobody could see, every one of them with green assertions.

Notes:
- `.tap()` needs a touch context; the script switches to `.click()` on desktop.
  The first run of this harness silently produced no interaction frames on
  desktop because of it.
- Contact sheets are for scanning only. **Crop and zoom the actual file** before
  calling anything a defect — a sheet made the A13 timeline look like it
  overflowed when it was the sheet's own crop, and made a working edge fade look
  absent when it was painting.


## ink.py — how empty is a panel, really

```bash
.venv-img/bin/python harness/ink.py '/tmp/shots/desktop/*lead-*-rest.png'
```

Measures the largest run of blank rows by **local gradient**: a flat fill of any
colour has none, text and graphics have plenty.

Every simpler measure has failed on this layout, and each failure looked
plausible first:
- a DOM walk reports the outermost container, which always fills — ~18px of
  slack for every lead, including ones that are half black;
- a per-row median fails because the panels are two columns with different
  backgrounds, so a blank row reads as half-deviating;
- and the **seed matters more than the instrument** — with `clues: []`, three
  input leads measured 42–45% empty and 3% with the clue pool a player would
  actually hold. Use `lib-state.cjs`'s `atLead()`, which seeds each lead with
  its predecessors.

## A note on where these live

**The session scratchpad is not storage.** It was wiped between two sessions of
this project and took the whole screenshot set and the `r10.cjs` regression
suite with it. Anything worth running twice belongs in this directory.
