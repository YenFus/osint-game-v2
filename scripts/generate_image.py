"""
ComfyUI image generator — "What Maya Knew" OSINT game assets
Saves to: /Users/mohit/Projects/osint-game-v2/public/assets/
Prefix: osint_ (to distinguish from 3D workflow outputs)

Usage: python3 generate_image.py <asset_name> [seed]
  e.g. python3 generate_image.py corkboard-full 42
"""

import json
import sys
import time
import uuid
import urllib.request
import urllib.parse
from pathlib import Path

COMFYUI_URL = "http://127.0.0.1:8000"
CLIENT_ID   = str(uuid.uuid4())

# All game assets go here — never in the 3D Workflow output folder
GAME_ASSETS_DIR = Path("/Users/mohit/Projects/osint-game-v2/public/assets")

# ComfyUI SaveImage prefix — distinguishes these from the 3D workflow jobs
COMFY_PREFIX = "osint"


def build_workflow(positive, negative, width, height, steps, cfg, seed):
    return {
        "1": {
            "class_type": "UnetLoaderGGUF",
            "inputs": {"unet_name": "flux1-dev-Q8_0.gguf"}
        },
        "2": {
            "class_type": "DualCLIPLoader",
            "inputs": {
                "clip_name1": "clip_l.safetensors",
                "clip_name2": "t5xxl_fp8_e4m3fn.safetensors",
                "type": "flux"
            }
        },
        "3": {
            "class_type": "VAELoader",
            "inputs": {"vae_name": "ae.safetensors"}
        },
        "4": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": positive, "clip": ["2", 0]}
        },
        "5": {
            "class_type": "CLIPTextEncode",
            "inputs": {"text": negative, "clip": ["2", 0]}
        },
        "6": {
            "class_type": "EmptyLatentImage",
            "inputs": {"width": width, "height": height, "batch_size": 1}
        },
        "7": {
            "class_type": "KSampler",
            "inputs": {
                "model": ["1", 0],
                "positive": ["4", 0],
                "negative": ["5", 0],
                "latent_image": ["6", 0],
                "seed": seed,
                "control_after_generate": "fixed",
                "steps": steps,
                "cfg": cfg,
                "sampler_name": "euler",
                "scheduler": "simple",
                "denoise": 1.0
            }
        },
        "8": {
            "class_type": "VAEDecode",
            "inputs": {"samples": ["7", 0], "vae": ["3", 0]}
        },
        "9": {
            "class_type": "SaveImage",
            "inputs": {"images": ["8", 0], "filename_prefix": COMFY_PREFIX}
        }
    }


def queue_job(workflow):
    payload = json.dumps({"prompt": workflow, "client_id": CLIENT_ID}).encode()
    req = urllib.request.Request(
        f"{COMFYUI_URL}/prompt", data=payload,
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        resp = json.loads(r.read())
        if "error" in resp:
            raise RuntimeError(f"ComfyUI error: {resp['error']}")
        return resp["prompt_id"]


def wait_for_job(prompt_id, timeout=600):
    print(f"  Queued [{prompt_id[:8]}]", end="", flush=True)
    start = time.time()
    while time.time() - start < timeout:
        time.sleep(4)
        with urllib.request.urlopen(f"{COMFYUI_URL}/history/{prompt_id}") as r:
            history = json.loads(r.read())
        if prompt_id in history:
            entry = history[prompt_id]
            status = entry.get("status", {})
            if status.get("completed"):
                print(" ✓")
                return entry
            if status.get("status_str") == "error":
                msgs = entry.get("status", {}).get("messages", [])
                raise RuntimeError(f"Job failed: {msgs}")
        print(".", end="", flush=True)
    raise TimeoutError(f"Timed out after {timeout}s")


def download_output(history_entry, out_path):
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    for _, node_out in history_entry.get("outputs", {}).items():
        for img in node_out.get("images", []):
            params = urllib.parse.urlencode({
                "filename": img["filename"],
                "subfolder": img.get("subfolder", ""),
                "type":      img.get("type", "output")
            })
            urllib.request.urlretrieve(f"{COMFYUI_URL}/view?{params}", out_path)
            return str(out_path)
    raise RuntimeError("No image found in job output")


def generate(asset_name, positive, negative, width, height, steps=28, cfg=3.5, seed=1337):
    """Generate one image and save it to the game's assets folder."""
    out_path = GAME_ASSETS_DIR / f"{asset_name}.jpg"

    print(f"\n── osint-game asset: {asset_name} ──────────────────────────")
    print(f"  Output : {out_path}")
    print(f"  Size   : {width}×{height}  Steps: {steps}  CFG: {cfg}  Seed: {seed}")
    print(f"  Prompt : {positive[:120].strip()}...")

    wf = build_workflow(positive, negative, width, height, steps, cfg, seed)
    pid = queue_job(wf)
    entry = wait_for_job(pid)
    saved = download_output(entry, out_path)
    print(f"  Saved  → {saved}")
    return saved


# ── Asset definitions ─────────────────────────────────────────────────────────

ASSETS = {

    "corkboard-full": dict(
        positive="""A real cork bulletin board photographed straight-on,
wood frame, warm amber desk lamp light from upper-left casting subtle pin-shadows on natural cork texture.
Five items pinned to the board:
upper-left — a 4x6 glossy color photograph of an indoor art gallery event, crowd of people in evening attire, pinned with a red pushpin;
center — a small white business card with black text, pinned with a yellow thumbtack;
right side — a yellow sticky Post-it note with handwritten blue pen text, slightly tilted, silver tack;
lower-left — a printed A4 paper street map, a location circled in red ballpoint pen;
lower-right — a printed forum screenshot, yellow highlighter over a username.
Realistic investigative documentary photography, flat frontal perspective, slight natural vignette at corners.""",
        negative="cartoon, illustration, digital art, anime, 3d render, cgi, watermark, logo, empty board, no items, overhead angle, distorted",
        width=1024, height=1024, steps=28, cfg=3.5, seed=2024
    ),

    "arts-night-evidence": dict(
        positive="""Candid indoor event photograph, 2021 arts gala, warm gallery lighting.
Background: a large vinyl event banner on the wall reading MILLHAVEN ARTS NIGHT 2021 in bold white letters.
Foreground: a man in his early 50s with salt-and-pepper hair, dark navy blazer, partially turned away from camera,
wearing a blue printed event lanyard around his neck.
Other guests blurred naturally in background. Gallery walls with framed artwork.
Camera timestamp burnt into lower-right corner: 2021:03:15 20:44:31 in amber monospace digits.
Slightly grainy, authentic candid event photography, DSLR, photojournalism style.""",
        negative="cartoon, illustration, painting, anime, render, 3d, cgi, oversaturated, fake, stock photo, watermark, text overlay outside image, overexposed faces, posed portrait",
        width=1344, height=896, steps=30, cfg=3.5, seed=5555
    ),

}

if __name__ == "__main__":
    asset_name = sys.argv[1] if len(sys.argv) > 1 else "corkboard-full"
    seed_override = int(sys.argv[2]) if len(sys.argv) > 2 else None

    if asset_name not in ASSETS:
        print(f"Unknown asset '{asset_name}'. Available: {list(ASSETS.keys())}")
        sys.exit(1)

    params = ASSETS[asset_name].copy()
    if seed_override is not None:
        params["seed"] = seed_override

    generate(asset_name, **params)
