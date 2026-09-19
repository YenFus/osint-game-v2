#!/usr/bin/env python3
"""
Targeted repair of two plates that survive at thumbnail size and fall apart
at full plate size. Nothing here regenerates anything — a re-roll would move
the seed and lose the framing — it repaints the specific places where the
model produced something a camera cannot.

    .venv-img/bin/python scripts/repair_plates.py
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageChops
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
ART = ROOT / "public" / "art"


def feathered(size, boxes, feather):
    """A soft mask over the given boxes/ellipses, so a repair has no edge."""
    m = Image.new("L", size, 0)
    d = ImageDraw.Draw(m)
    for shape, box in boxes:
        (d.ellipse if shape == "e" else d.rectangle)(box, fill=255)
    return m.filter(ImageFilter.GaussianBlur(feather))


def blur_under(im, mask, radius):
    return Image.composite(im.filter(ImageFilter.GaussianBlur(radius)), im, mask)


def clone(im, mask, dx, dy):
    """Pull a patch from (dx, dy) away over the mask — the clone-stamp move."""
    return Image.composite(ImageChops.offset(im, dx, dy), im, mask)


def grain(im, mask, amount=4.0, seed=11):
    """Repainted areas come out smoother than the film around them."""
    rng = np.random.default_rng(seed)
    a = np.asarray(im).astype(np.float32)
    n = rng.normal(0, amount, a.shape[:2])[..., None]
    out = np.clip(a + n, 0, 255).astype(np.uint8)
    return Image.composite(Image.fromarray(out), im, mask)


def maya():
    """
    ph-maya: the mugs bottom-right are the tell — four of them, two melting
    into each other and a saucer, every one carrying a few characters of
    invented writing. They are already far outside the focal plane, so the
    repair is to put them where the lens says they should be: unreadable
    bokeh.
    """
    p = ART / "ph-maya.jpg"
    im = Image.open(p).convert("RGB")
    w, h = im.size
    mugs = feathered((w, h), [
        ("e", (840, 830, 1360, 1030)),   # the right-hand pair and the saucer
        ("e", (560, 880, 900, 1030)),    # the near mug and the handleless bowl
    ], feather=26)
    im = blur_under(im, mugs, 19)
    im = grain(im, mugs, 3.2)

    # The yoke seam across the shoulders was on the list too, and it is left
    # alone on purpose: every mask that covered it also caught the hair or the
    # collar, and the grey smear that came back read worse than the seam. A
    # saddle-shoulder knit has a seam about there. The mugs did not have a
    # defence; this does.

    im.save(p, quality=93, subsampling=0)
    print(f"· {p.name}: mugs defocused (yoke seam left alone — see note)")


def shop():
    """
    ph-shop: the car's front end dissolves into the right-hand wall — there
    is no nose on it, it simply fades — and the rear tyre carries raised
    lettering that spells nothing. The nose is cropped out of frame, which
    is what a person standing in that bay would have framed anyway, and the
    sidewall is cloned over with the rubber beside it.
    """
    p = ART / "ph-shop.jpg"
    im = Image.open(p).convert("RGB")

    # the sidewall, before the crop moves the coordinates
    letters = feathered(im.size, [
        ("e", (760, 600, 850, 760)),   # the right-hand block of characters
        ("e", (640, 620, 700, 780)),   # the left-hand block
        ("e", (676, 556, 790, 610)),   # the brand blob at the top of the arc
    ], feather=9)
    # Cloning rubber across the sidewall dragged the wheel face over the tyre
    # and left it looking motion-blurred, which was worse than the lettering.
    # Real sidewall type is low-contrast moulded rubber; softening it until it
    # reads as raised rubber rather than as characters is the honest repair.
    im = blur_under(im, letters, 4.2)
    im = grain(im, letters, 2.4, seed=5)

    # frame the nose out: keep the rear three-quarter, which is the picture
    w, h = im.size
    keep_w = 1170
    im = im.crop((0, 0, keep_w, int(keep_w * 2 / 3)))
    im = im.resize((w, h), Image.LANCZOS).filter(
        ImageFilter.UnsharpMask(radius=1.6, percent=62, threshold=3))

    im.save(p, quality=93, subsampling=0)
    print(f"· {p.name}: sidewall lettering cloned out, dissolving nose cropped out of frame")


if __name__ == "__main__":
    maya()
    shop()
