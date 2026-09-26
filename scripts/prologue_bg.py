#!/usr/bin/env python3
"""
Prologue backdrops: the place Thomas was standing, behind each phone screen.

The prologue used to float every screen in a flat black field. These are the
restaurant, the street outside the station and Maya's flat, blurred hard and
darkened so the phone in front stays the brightest thing on screen and any
stray signage the image model invented is unreadable.

    .venv-img/bin/python scripts/prologue_bg.py

Also publishes the chosen prologue photographs (picked by eye from
art/variants/) into public/art as the JPEGs the game loads.
"""

from pathlib import Path
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
VAR = ROOT / "art" / "variants"
ART = ROOT / "public" / "art"

# chosen variant -> published name. Seeds are recorded in gen_art.py.
PICKS = {
    "pro-lena-53.png": "pro-lena.jpg",
    "pro-ray-162.png": "pro-ray.jpg",
    "pro-restaurant-118.png": "pro-restaurant.jpg",
    "pro-street-23.png": "pro-street.jpg",
    "pro-keys-132.png": "pro-keys.jpg",
    "pro-wallet-138.png": "pro-wallet.jpg",
    # pro-bed.jpg and pro-notebook.jpg are now cut from the apartment plate
    # (art/variants/apartment3-502.png) so the prologue shows the same room
    # the player walks into; don't regenerate them from here.
}

# source photo -> backdrop
BACKDROPS = {
    "pro-restaurant.jpg": "pro-bg-restaurant.jpg",
    "pro-street.jpg": "pro-bg-street.jpg",
    "apartment-room.jpg": "pro-bg-flat.jpg",
}


# Repairs, found by looking at each pick at full size:
#  - keys: the booklet in the bowl reads "BANCER LAKEL EO RUK" and the bus
#    pass under it is gibberish too. Generated lettering is the surest tell
#    there is, so both are softened into out-of-focus print.
#  - bed: a phone lay on the duvet. Maya had her phone — she called her
#    father from it at 7:52 — so a phone left in her bed tells the player the
#    wrong story. Cropped to the pillows and the window.
BLUR = {"pro-keys.jpg": [(520, 370, 705, 545), (510, 565, 655, 700)]}
CROP = {"pro-bed.jpg": (0, 0, 1024, 700)}


def publish():
    for src, dst in PICKS.items():
        p = VAR / src
        if not p.exists():
            print(f"  skip {src} (not generated)")
            continue
        im = Image.open(p).convert("RGB")
        for box in BLUR.get(dst, []):
            patch = im.crop(box).filter(ImageFilter.GaussianBlur(3.2))
            im.paste(ImageEnhance.Contrast(patch).enhance(0.85), box[:2])
        if dst in CROP:
            im = im.crop(CROP[dst])
        # square pictures are shown small (a gallery tile, an avatar, a poster):
        # 768px is plenty and keeps the page light
        if im.width == im.height:
            im = im.resize((768, 768), Image.LANCZOS)
        im.save(ART / dst, quality=86, optimize=True, progressive=True)
        print(f"  {src} -> {dst}")


def backdrop(src, dst):
    im = Image.open(ART / src).convert("RGB")
    im = im.resize((1600, int(1600 * im.height / im.width)), Image.LANCZOS)
    im = im.filter(ImageFilter.GaussianBlur(14))
    im = ImageEnhance.Brightness(im).enhance(0.42)
    im = ImageEnhance.Color(im).enhance(0.7)
    im.save(ART / dst, quality=80, optimize=True, progressive=True)
    print(f"  {src} -> {dst} (blurred, darkened)")


if __name__ == "__main__":
    publish()
    for s, d in BACKDROPS.items():
        if (ART / s).exists():
            backdrop(s, d)
