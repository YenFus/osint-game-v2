#!/usr/bin/env python3
"""
Produced ambience beds for the phase soundtrack.

The game had a complete per-phase ambient system already, but every track was
raw Web Audio oscillators and a noise buffer — which is what the audio
sub-score was measuring. These are the same rooms, rendered properly: filtered
noise layers with real movement, a low bed with beating partials, and
seam-free loops.

Everything here is numpy. The only audio tools on this machine are `afconvert`
and `say` (no ffmpeg, no sox), so the WAVs are converted to AAC in an .mp4
container — the Artifact host does not serve .m4a.

    .venv-img/bin/python scripts/gen_ambience.py
    .venv-img/bin/python scripts/gen_ambience.py investigation

Each bed is written to public/audio/amb-<name>.mp4 and loops cleanly: the
render is LOOP + TAIL seconds long and the tail is crossfaded back over the
head, so the loop point has no click and no audible seam.
"""

import subprocess
import sys
import wave
from pathlib import Path

import numpy as np

SR = 32000          # plenty for room tone, and keeps the files small
LOOP = 36.0         # seconds of usable loop
TAIL = 4.0          # crossfaded back over the head
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio"

rng = np.random.default_rng(20260919)


# ── building blocks ──────────────────────────────────────────────────────

def noise(n, kind="white"):
    """White, pink (-3dB/oct) or brown (-6dB/oct) noise via spectral shaping."""
    x = rng.standard_normal(n)
    if kind == "white":
        return x
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    f[0] = f[1]
    spec /= f ** (0.5 if kind == "pink" else 1.0)
    out = np.fft.irfft(spec, n)
    return out / (np.abs(out).max() + 1e-9)


def band(x, lo, hi, order=2):
    """Zero-phase Butterworth-ish band-pass, done in the frequency domain."""
    n = len(x)
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    f = np.maximum(f, 1e-6)
    hp = 1.0 / np.sqrt(1.0 + (lo / f) ** (2 * order))
    lp = 1.0 / np.sqrt(1.0 + (f / hi) ** (2 * order))
    return np.fft.irfft(spec * hp * lp, n)


def lfo(n, hz, lo=0.0, hi=1.0, phase=0.0):
    t = np.arange(n) / SR
    return lo + (hi - lo) * (0.5 + 0.5 * np.sin(2 * np.pi * hz * t + phase))


def tone(n, hz, amp=1.0, drift=0.0):
    """A sine with slow frequency drift, so nothing sits perfectly still."""
    t = np.arange(n) / SR
    f = hz * (1.0 + drift * np.sin(2 * np.pi * 0.013 * t))
    return amp * np.sin(2 * np.pi * np.cumsum(f) / SR)


def swells(n, count, lo_hz, hi_hz, width, amp):
    """Distant traffic / weather: band-passed noise under slow gaussian humps."""
    out = np.zeros(n)
    src = band(noise(n, "brown"), lo_hz, hi_hz)
    for _ in range(count):
        c = rng.uniform(0, n)
        w = width * SR * rng.uniform(0.6, 1.5)
        env = np.exp(-0.5 * ((np.arange(n) - c) / w) ** 2)
        out += src * env * rng.uniform(0.4, 1.0)
    return out * amp


EDGE = 0.045        # seconds of equal-power fade at each end


def crossfade_loop(x, loop_s=LOOP, tail_s=TAIL):
    """Fold the tail back over the head with an equal-power crossfade.

    That alone makes the loop point continuous in the *source*, but AAC adds
    priming and padding samples that no sample-exact construction survives:
    measured on the first render, the decoded seam sat at -9.4 dB relative to
    programme, which clicks once every loop. A short equal-power fade at both
    ends absorbs whatever the codec leaves behind. On broadband noise a 12 ms
    dip is inaudible; a step discontinuity is not.
    """
    loop_n, tail_n = int(loop_s * SR), int(tail_s * SR)
    body = x[:loop_n].copy()
    tail = x[loop_n:loop_n + tail_n]
    if len(tail) < tail_n:
        tail = np.pad(tail, (0, tail_n - len(tail)))
    t = np.linspace(0, 1, tail_n)
    body[:tail_n] = body[:tail_n] * np.sqrt(t) + tail * np.sqrt(1 - t)
    e = int(EDGE * SR)
    ramp = np.sqrt(np.linspace(0, 1, e))
    body[:e] *= ramp
    body[-e:] *= ramp[::-1]
    return body


def finish(left, right, peak=0.5):
    st = np.stack([left, right], axis=1)
    st -= st.mean(axis=0)
    st = np.tanh(st * 1.2) / 1.2                  # soften anything spiky
    st *= peak / (np.abs(st).max() + 1e-9)
    return st


def write(name, stereo):
    OUT.mkdir(parents=True, exist_ok=True)
    wav = OUT / f"amb-{name}.wav"
    mp4 = OUT / f"amb-{name}.mp4"
    pcm = (np.clip(stereo, -1, 1) * 32767).astype("<i2")
    with wave.open(str(wav), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(pcm.tobytes())
    if mp4.exists():
        mp4.unlink()
    subprocess.run(
        ["afconvert", "-f", "mp4f", "-d", "aac", "-b", "64000", str(wav), str(mp4)],
        check=True,
    )
    wav.unlink()
    print(f"  {mp4.relative_to(ROOT)}  {mp4.stat().st_size / 1024:.0f} KB")


# ── the rooms ────────────────────────────────────────────────────────────

def investigation(n):
    """Her desk at night. Fan, building hum, the street a long way down."""
    bed = band(noise(n, "brown"), 26, 150) * 0.85
    bed *= lfo(n, 0.031, 0.65, 1.0)
    fan = band(noise(n, "pink"), 180, 900) * 0.16 * lfo(n, 0.047, 0.7, 1.0, 1.1)
    # mains hum, slightly detuned against itself so it beats rather than sits
    hum = tone(n, 60, 0.020, 0.0004) + tone(n, 120, 0.009) + tone(n, 179.6, 0.004)
    street = swells(n, 7, 60, 400, 2.6, 0.30)
    mix = bed * 0.5 + fan + hum + street
    wide = band(noise(n, "pink"), 300, 1400) * 0.05
    return mix + wide * 0.5, mix - wide * 0.5


def apartment(n):
    """Her flat, rain on the glass, the fridge two rooms away."""
    # heard from inside: the window takes the top off the rain
    rain = band(noise(n, "pink"), 500, 3200) * 0.075 * lfo(n, 0.024, 0.75, 1.0)
    patter = band(noise(n, "white"), 1800, 5200) * 0.016 * lfo(n, 0.09, 0.5, 1.0)
    glass = band(noise(n, "pink"), 180, 900) * 0.085
    room = band(noise(n, "brown"), 28, 150) * 2.2 * lfo(n, 0.019, 0.7, 1.0)
    fridge = tone(n, 99.5, 0.020, 0.001) * lfo(n, 0.008, 0.0, 1.0)
    gusts = swells(n, 5, 120, 1400, 3.0, 0.42)
    mix = rain + patter + glass + room + fridge + gusts
    spread = band(noise(n, "pink"), 900, 4000) * 0.022
    return mix + spread, mix - spread


def convergence(n):
    """Everything on one board. The room tightens: same bed, a fifth above."""
    bed = band(noise(n, "brown"), 24, 130) * 0.8 * lfo(n, 0.037, 0.6, 1.0)
    pulse = tone(n, 55, 0.026, 0.0006) + tone(n, 82.5, 0.017) + tone(n, 110, 0.010)
    breath = band(noise(n, "pink"), 400, 2200) * 0.05 * lfo(n, 0.071, 0.3, 1.0)
    tick = np.zeros(n)
    step = int(SR * 1.5)
    click = np.exp(-np.arange(int(SR * 0.05)) / (SR * 0.006))
    for i in range(step, n - len(click), step):
        tick[i:i + len(click)] += click * 0.02
    tick = band(tick, 900, 4000)
    mix = bed * 0.55 + pulse + breath + tick
    return mix, mix * 0.97 + band(noise(n, "pink"), 500, 3000) * 0.02


def ending(n):
    """After. A low pad that resolves and stops asking."""
    bed = band(noise(n, "brown"), 22, 110) * 0.6 * lfo(n, 0.015, 0.7, 1.0)
    pad = (tone(n, 52, 0.030, 0.0003)
           + tone(n, 78, 0.018)
           + tone(n, 104, 0.012) * lfo(n, 0.011, 0.2, 1.0)
           + tone(n, 156, 0.006) * lfo(n, 0.009, 0.0, 1.0))
    air = band(noise(n, "pink"), 600, 3500) * 0.035 * lfo(n, 0.013, 0.5, 1.0)
    mix = bed * 0.5 + pad + air
    return mix, mix * 0.96 + air * 0.4


BEDS = {
    "investigation": investigation,
    "apartment": apartment,
    "convergence": convergence,
    "ending": ending,
}


def main():
    want = sys.argv[1:] or list(BEDS)
    n = int((LOOP + TAIL) * SR)
    for name in want:
        if name not in BEDS:
            sys.exit(f"unknown bed {name!r}; have {', '.join(BEDS)}")
        print(f"rendering {name} ({LOOP:.0f}s loop)")
        left, right = BEDS[name](n)
        write(name, finish(crossfade_loop(left), crossfade_loop(right)))


if __name__ == "__main__":
    main()
