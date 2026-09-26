#!/usr/bin/env python3
"""
B11's page: the one the fire reached. The briefing says "the fire got most of
them", so most of the sheet has to be gone. FLUX wouldn't reliably leave a
clean surviving strip for the handwriting, so this composites one: the paper
and ruled lines come from a generated page (art/variants/burned-last-42.png),
the char is real texture from another render (burned-most-144.png), and the
burn line between them is ragged, scorched brown for a band above it, with
flakes lifting off. Deterministic.
    .venv-img/bin/python scripts/burn_page.py
"""
from pathlib import Path
import numpy as np
from PIL import Image, ImageEnhance, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
V = ROOT / 'art' / 'variants'
rng = np.random.default_rng(11)

page = Image.open(V / 'burned-last-42.png').convert('RGB').crop((70, 125, 675, 862))
W, H = page.size

def fbm(h, w, octaves=((6, 1.0), (18, 0.5), (60, 0.25))):
    """smooth noise in 0..1 at a few scales"""
    acc = np.zeros((h, w))
    for cells, amp in octaves:
        g = (rng.random((max(2, h * cells // w), cells)) * 255).astype('uint8')
        acc += amp * np.asarray(Image.fromarray(g).resize((w, h), Image.BICUBIC)) / 255.0
    return acc / sum(a for _, a in octaves)

# real char: one burned patch of another render, scaled up (no tiling — a
# mirrored tile read as a kaleidoscope)
src = Image.open(V / 'burned-most-144.png').convert('RGB').crop((360, 190, 640, 740))
char = src.resize((W, int(W * src.height / src.width)), Image.LANCZOS).filter(ImageFilter.GaussianBlur(0.6))
char_top = int(0.40 * H)
canvas = Image.new('RGB', (W, H), (14, 10, 8))
canvas.paste(char.crop((0, 0, W, H - char_top)), (0, char_top))
char = canvas

# the burn line: a ragged edge, lower on the left where the spine held it
x = np.arange(W)
walk = np.cumsum(rng.normal(0, 2.4, W)); walk -= np.linspace(walk[0], walk[-1], W)
walk = np.convolve(walk, np.ones(9) / 9, 'same')   # a torn edge, not a comb
line = 0.46 * H + 0.08 * H * (x / W) + 1.6 * walk + 14 * np.sin(x / 41.0 + 1.3) + 3 * np.sin(x / 13.0)
jag = fbm(H, W, ((30, 1.0), (70, 0.4)))
yy = np.arange(H)[:, None]
d = yy - line[None, :] + (jag - 0.5) * 7     # >0 below the edge

p = np.asarray(page).astype(float) / 255
c = np.asarray(char).astype(float) / 255 * 0.6

# scorch above the edge: a narrow, uneven band going from dark brown at the
# edge to a faint tan, modulated so it isn't a smooth glow
n2 = fbm(H, W, ((4, 1.0), (10, 0.5)))       # slow: the heat varies along the edge, not per column
reach = 16 + 40 * n2                          # how far the heat got
t = np.clip(-d / reach, 0, 1) * (d < 0)       # 0 at the edge .. 1 at the band's top
heat = (1 - t) ** 1.8 * (d < 0)
brown = np.array([0.30, 0.16, 0.06])
out = p * (1 - heat[..., None] * 0.85) + brown * heat[..., None] * 0.85 * (0.6 + 0.4 * n2[..., None])
# a hard black lip right at the edge
lip = np.clip(1 - np.abs(d) / 2.5, 0, 1)[..., None]
out = out * (1 - lip) + np.array([0.03, 0.02, 0.015]) * lip
# below: char, darkest near the edge, with the odd grey ash fleck
below = (d >= 0).astype(float)[..., None]
out = out * (1 - below) + c * below
# near the bottom it's burned right through to the table, in ragged holes
hole = np.clip((d - (0.30 * H + 70 * (fbm(H, W) - 0.5))) / 12, 0, 1)[..., None]
out = out * (1 - hole) + np.array([0.06, 0.045, 0.035]) * hole

img = Image.fromarray((np.clip(out, 0, 1) * 255).astype('uint8'))
img = ImageEnhance.Brightness(img).enhance(0.62)
img = ImageEnhance.Contrast(img).enhance(0.9)
img.save(ROOT / 'public' / 'art' / 'burned-last.jpg', quality=86)
print('burn line mean y = %.1f%%' % (100 * line.mean() / H), img.size)
