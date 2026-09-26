"""Contact sheet: many screenshots on one image, for scanning only.
    .venv-img/bin/python harness/sheet.py "/tmp/shots/mobile/*brief*.png" out.png [cols] [width]
Crop and open the real file before calling anything a defect."""
import sys, glob
from PIL import Image, ImageDraw
files = sorted(glob.glob(sys.argv[1])); out = sys.argv[2]
cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6; w = int(sys.argv[4]) if len(sys.argv) > 4 else 300
ims = [Image.open(f).convert('RGB') for f in files]
h = int(w * ims[0].height / ims[0].width); rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * (h + 18)), 'white'); d = ImageDraw.Draw(sheet)
for i, (f, im) in enumerate(zip(files, ims)):
    x = (i % cols) * w; y = (i // cols) * (h + 18)
    sheet.paste(im.resize((w, h)), (x, y + 18)); d.text((x + 3, y + 3), f.split('/')[-1][:40], fill='black')
sheet.save(out); print(out, sheet.size)
