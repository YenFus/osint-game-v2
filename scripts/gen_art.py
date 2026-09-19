#!/usr/bin/env python3
"""
Every picture in this game is supposed to be a photograph somebody in the
story took — on a phone, at night, without thinking about composition. That
is the whole art direction, and it is why the earlier passes failed: a
render looks like a render, and a caption pasted on top of a render looks
like a caption pasted on top of a render.

So: one camera, one town, one week of weather, and any writing the player
has to read is *printed inside the scene* — a tent card on a table, a clock
on a wall — where the lens can bend it and the lights can fall across it.

Model: FLUX.1-schnell (4-bit) through mflux, on the local machine.
    python3 scripts/gen_art.py            # everything that is missing
    python3 scripts/gen_art.py ph-river   # one asset
    python3 scripts/gen_art.py --all      # re-roll everything
    python3 scripts/gen_art.py --variants 4 gallery-room   # seed hunting

Variants land in art/variants/<name>-<seed>.png for picking by eye; the
chosen seed is the one recorded in ASSETS, and that is what ships.

A seed does not survive a change of resolution — re-rolling gallery-room at
2016px produced a different room with garbled signage — so the two plates the
magnifier zooms into (gallery-room, hall-banner) are generated here at 1344px
and enlarged 2x with Lanczos + unsharp afterwards. Re-roll them and you must
re-measure the hotspots in gameData.js.
"""

import argparse
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "art"
VARIANTS = ROOT / "art" / "variants"
MFLUX = Path("/Users/mohit/Projects/World Animator/.venv/bin/mflux-generate")
MODEL = ["--model", "madroid/flux.1-schnell-mflux-4bit", "--base-model", "schnell"]

# ── The look, in words the model understands ──────────────────────────
# Kept in one string so no asset can drift away from the others.
# Asking for tilt, grain and motion blur produced pictures that looked like
# an effect rather than a photograph, so the brief asks for the plain thing a
# phone actually does: available light, no styling, nothing composed. The
# game adds its own grain and vignette over the top (ScenePlate.jsx).
CAMERA = (
    "Shot on a phone by an ordinary person, not a photographer: no styling, "
    "no arranged composition, nothing lit for the camera. Available light "
    "only, muted colour, no colour grading, no HDR, no lens flare."
)
NIGHT = "Available light only — tungsten bulbs and street sodium, deep shadows, nothing lit evenly."
DAY = "Overcast Pacific Northwest daylight, flat grey sky, damp ground."
# Corey's car has to be the same car in all three of his photographs, or the
# timeline lead is comparing pictures of two different projects.
COREY_CAR = (
    "a 1967 Chevrolet Chevelle two-door coupe in dull grey primer, no paint, no chrome "
    "trim, no badges, bare metal patches on the rear quarter panel, plain black steel "
    "wheels with no hubcaps"
)
NEG = (
    "professional photography, studio lighting, cinematic color grade, HDR, "
    "sharp bokeh portrait, symmetrical composition, poster, watermark, caption, "
    "text overlay, illustration, 3d render, cgi, painting"
)

# ── The assets ────────────────────────────────────────────────────────
# seed: the roll that was kept. size: 3:2 unless the game crops it square.
ASSETS = {
    # The room the whole case turns on. The evidence is *in* the photograph:
    # the tent sign, the wall clock, the tag on the bag. Nothing is added later.
    "gallery-room": dict(
        seed=11, w=1344, h=896,
        prompt=(
            "Candid iPhone photo of a small side gallery in an old brick community hall "
            "during an arts evening, 2024. The room is empty of people. In the foreground "
            "on the left, a folding table by the doorway holds a white printed tent sign "
            'reading "STILLWATER MEDIA" in bold black capitals with smaller text '
            '"EVENT PHOTOGRAPHY" beneath it, a stack of business cards, and a black camera '
            "bag with a small luggage tag. On the far brick wall hangs a digital photo frame "
            'showing a landscape picture with a small green clock in its corner reading "7:47 PM", '
            "and beside it a long cloth banner. Framed pictures on the brick, folding chairs "
            "stacked against the wall, a doorway to the right glowing with light and blurred "
            "movement from the main hall. " + NIGHT + " " + CAMERA
        ),
    ),
    # The second frame from that evening: the doorway into the main hall, with
    # the event's own banner over it. The banner carries the name of the night;
    # the side-room photo carries the business and the clock. One photograph
    # cannot hold three pieces of printed evidence and stay legible.
    "hall-banner": dict(
        seed=209, w=1344, h=896,
        prompt=(
            "Candid iPhone photo taken from a doorway at a small-town art evening, 2024. "
            "Across the top of the far wall hangs a long printed cloth banner reading "
            '"MILLHAVEN ARTS COLLECTIVE" in large capitals. Below it a crowded room: '
            "people seen from behind and in motion blur, nobody facing the camera, all "
            "turned towards a speaker at the far end. Exposed brick, framed pictures, "
            "folding chairs. " + NIGHT + " " + CAMERA
        ),
    ),
    # The photograph on the MISSING poster, and the one thing in this game
    # that is a person. Her father took it; she is not posing for it and her
    # face is turned away, which is both the art direction and the reason it
    # does not read as a generated portrait.
    "ph-maya": dict(
        seed=88, w=1344, h=896,
        prompt=(
            "Candid snapshot taken by a parent at a kitchen table: a young woman in her "
            "twenties seen from behind and slightly to one side, turning away towards a "
            "window, dark hair, grey jumper, laughing at something out of frame. Her face "
            "is not visible to the camera. Mugs and papers on the table, warm lamp light, "
            "ordinary evening. Slightly out of focus, taken without warning. " + CAMERA
        ),
    ),
    "apartment-room": dict(
        seed=29, w=1344, h=896,
        prompt=(
            "iPhone photo of a young woman's small studio apartment, photographed by her "
            "father the evening she was reported missing. Unmade bed, a desk under the window "
            "with a closed laptop and papers, a corkboard on the wall, mug left on a side table, "
            "clothes over a chair. Nobody in the room. Evening, one lamp on, grey light at the "
            "window. " + CAMERA
        ),
    ),
    "cork-surface": dict(
        seed=3, w=1344, h=896,
        prompt=(
            "Photograph taken square-on of an old cork noticeboard that fills the whole "
            "frame, edge to edge, completely empty. Close enough to see the grain of the "
            "cork, hundreds of old pin holes, a rusted staple, one torn paper corner still "
            "pinned. Even indoor light, no lamp glare, no wall visible, no objects. " + CAMERA
        ),
    ),
    # stillwater_m's Flickr — a man who photographs places, competently.
    "ph-trail": dict(seed=41, w=1344, h=896, prompt=(
        "Amateur photo of a wet forest trail among tall Douglas firs, early morning light "
        "through the trunks, ferns, no people. " + DAY + " " + CAMERA)),
    "ph-river": dict(seed=52, w=1344, h=896, prompt=(
        "Amateur phone photo of a city riverfront path at dusk, bare handrail, the water "
        "reflecting the last light, apartment windows on the far bank, no people. " + CAMERA)),
    "ph-fog": dict(seed=311, w=1344, h=896, prompt=(
        "Amateur phone photo taken from a hillside road looking down over wooded suburban "
        "hills in winter: bare trees in the foreground with clear branches, houses and a "
        "road below half lost in low fog, a ridge of firs behind. " + DAY + " " + CAMERA)),
    "ph-venue": dict(seed=203, w=1344, h=896, prompt=(
        "Amateur phone photo at dusk of a two-storey brick community hall on a small-town "
        'main street. One painted board sign over the entrance, reading exactly: ALDER HALL. '
        "No other signs, no other lettering anywhere in the picture. Lit windows, wet "
        "pavement, two people going in, seen from behind and blurred. " + NIGHT + " " + CAMERA)),
    "ph-mainst": dict(seed=85, w=1344, h=896, prompt=(
        "Amateur phone photo of a small American main street at dusk in December, painted "
        "shopfronts, parked pickup truck, wet road, one distant figure walking away. " + CAMERA)),
    "ph-taproom": dict(seed=96, w=1344, h=896, prompt=(
        "Amateur phone photo inside a small-town taproom, wooden bar, beer taps, a few people "
        "at the far end seen from behind and out of focus, warm light. " + NIGHT + " " + CAMERA)),
    # Corey's Flickr — a man restoring a car in a body shop.
    "ph-shop": dict(seed=404, w=1344, h=896, prompt=(
        "Amateur phone photo inside a small auto body shop in the evening: " + COREY_CAR +
        " standing on the shop floor seen from the side, tools on a rolling cart beside it, "
        "strip lights overhead, nobody in frame. Only this one car in the picture. " + CAMERA)),
    "ph-shop-late": dict(seed=405, w=1344, h=896, prompt=(
        "Amateur phone photo inside a small auto body shop late at night: " + COREY_CAR +
        " standing on the shop floor seen from the front corner, every strip light switched "
        "off except one work lamp on a stand, black windows, deep shadows, nobody in frame. "
        "Only this one car in the picture. " + CAMERA)),
    "ph-booth": dict(seed=118, w=1344, h=896, prompt=(
        "Amateur phone photo of " + COREY_CAR + " inside a spray paint booth, white booth "
        "walls, masking paper and tape over the windows and wheels, bright extraction "
        "lighting, nobody in frame. " + CAMERA)),
}


def run(name, spec, seed=None, out=None):
    seed = seed if seed is not None else spec["seed"]
    out = out or (OUT / f"{name}.jpg")
    out.parent.mkdir(parents=True, exist_ok=True)
    # mflux refuses to overwrite: it writes name_1.jpg beside the original and
    # the game keeps loading the stale picture. Clear the way first.
    if out.exists():
        out.unlink()
    cmd = [str(MFLUX), *MODEL, "--steps", "4", "--seed", str(seed),
           "--width", str(spec["w"]), "--height", str(spec["h"]),
           "--mlx-cache-limit-gb", "12", "--prompt", spec["prompt"],
           "--negative-prompt", NEG, "--output", str(out)]
    print(f"· {out.name} (seed {seed})", flush=True)
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        print(r.stdout[-2000:], r.stderr[-2000:], file=sys.stderr)
        raise SystemExit(f"generation failed for {name}")
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("names", nargs="*", help="assets to generate (default: the missing ones)")
    ap.add_argument("--all", action="store_true", help="re-roll every asset")
    ap.add_argument("--variants", type=int, default=0, help="roll N seeds into art/variants for picking")
    args = ap.parse_args()

    names = args.names or list(ASSETS)
    for n in names:
        if n not in ASSETS:
            raise SystemExit(f"unknown asset {n}; known: {', '.join(ASSETS)}")

    for name in names:
        spec = ASSETS[name]
        if args.variants:
            VARIANTS.mkdir(parents=True, exist_ok=True)
            base = spec["seed"]
            for i in range(args.variants):
                seed = base + i * 101
                run(name, spec, seed=seed, out=VARIANTS / f"{name}-{seed}.png")
            continue
        target = OUT / f"{name}.jpg"
        if target.exists() and not args.all and args.names == []:
            continue
        run(name, spec)


if __name__ == "__main__":
    main()
