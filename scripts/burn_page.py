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
char_src = Image.open(V / 'burned-most-144.png').convert('RGB').crop((110, 80, 320, 420))
char = char_src.resize((W, int(W * char_src.height / char_src.width)))
char = char.resize((W, H)) if char.height < H else char.crop((0, 0, W, H))

# a ragged line across the page, lower on the left where the spine held it
x = np.arange(W)
walk = np.cumsum(rng.normal(0, 3.2, W)); walk -= np.linspace(walk[0], walk[-1], W)
line = (0.47 * H + 0.06 * H * (x / W) + walk + 9 * np.sin(x / 23.0)).astype(int)

yy = np.arange(H)[:, None]
d = yy - line[None, :]                      # >0 below the burn line
noise = np.asarray(Image.fromarray((rng.random((H // 4, W // 4)) * 255).astype('uint8')).resize((W, H), Image.BICUBIC)) / 255.0

p = np.asarray(page).astype(float) / 255
c = np.asarray(char).astype(float) / 255
c = c * 0.55                                 # char reads near-black under the lamp

# scorch: brown multiply for a noisy band above the line
band = np.clip(1 - (-d) / (70 + 50 * noise), 0, 1) * (d < 0)
scorch = np.stack([1 - 0.55 * band, 1 - 0.75 * band, 1 - 0.95 * band], -1)
out = p * scorch
# below the line: char, with a lighter crumbling rim
rim = np.clip(1 - d / 14, 0, 1) * (d >= 0)
gone = (d >= 0).astype(float)[..., None]
out = out * (1 - gone) + (c * (1 - 0.35 * rim[..., None]) + 0.18 * rim[..., None] * np.array([0.35, 0.18, 0.08])) * gone
# the far bottom is burned right through: the table shows
through = np.clip((d - 0.28 * H - 40 * noise) / 30, 0, 1)[..., None]
table = np.array([0.07, 0.05, 0.04])
out = out * (1 - through) + table * through

img = Image.fromarray((np.clip(out, 0, 1) * 255).astype('uint8'))
img = ImageEnhance.Brightness(img).enhance(0.62)
img = ImageEnhance.Contrast(img).enhance(0.9)
img.save(ROOT / 'public' / 'art' / 'burned-last.jpg', quality=86)
print('burn line mean y = %.1f%%' % (100 * line.mean() / H), img.size)
