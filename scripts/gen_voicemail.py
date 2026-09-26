#!/usr/bin/env python3
"""
Maya's voicemail — the one real voice in the game.

The first version was macOS `say` (Samantha) through a phone filter, and the
player's verdict after a full playthrough was that it "sounds very, very AI".
It did: `say` is a 2000s concatenative voice. This uses Kokoro-82M, an
open-source (Apache-2.0) neural TTS model that runs locally, and builds the
message line by line so the pauses are a person's, not a sentence splitter's.

    .venv-tts/bin/python scripts/gen_voicemail.py            # default voice
    .venv-tts/bin/python scripts/gen_voicemail.py af_bella   # try another

Writes public/audio/maya-voicemail.mp4 (AAC — the Artifact host will not serve
.m4a) and prints the 56-bucket loudness envelope that PrologueArt.jsx draws as
the waveform, so the bars on screen are this recording and not a drawing.

Requires: .venv-tts (kokoro, soundfile, numpy) and `brew install espeak-ng`.
"""

import subprocess
import sys
from pathlib import Path

import numpy as np
import soundfile as sf

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "public" / "audio" / "maya-voicemail.mp4"
SR = 24000                      # Kokoro's native rate
VOICE = sys.argv[1] if len(sys.argv) > 1 else "af_heart"
BUCKETS = 56

# What she says, and the silence after each piece, in seconds. Written to be
# said out loud by someone frightened and trying not to frighten her father:
# she starts, restarts, reassures him, and gets cut off.
SCRIPT = [
    ("Hey Dad, it's me.", 0.55),
    ("Okay.", 0.45),
    ("I need to tell you something, and I should've told you weeks ago. I'm sorry.", 0.40),
    ("It's about the thing I've been working on.", 0.50),
    ("I'm okay. I want you to hear me say that first. I'm okay.", 0.45),
    ("But if I don't call you back tonight, I need you to go to the—", 0.95),   # the knock cuts her off here
    ("Hang on.", 0.70),
    ("Someone's at the door.", 0.25),
    ("One sec.", 1.10),
]
SPEED = 0.96                    # a touch slower than default; she's choosing words
KNOCK_AFTER = "But if I don't call you back tonight, I need you to go to the—"   # knocks start 0.12s into the gap: they interrupt her


def synth_lines():
    from kokoro import KPipeline
    pipe = KPipeline(lang_code="a")          # American English
    out, marks = [], {}
    for text, gap in SCRIPT:
        chunks = [np.asarray(audio, dtype=np.float32) for _, _, audio in pipe(text, voice=VOICE, speed=SPEED)]
        speech = np.concatenate(chunks)
        # Kokoro leaves a little air at each end; trim it so our gaps are the gaps
        speech = trim(speech)
        out.append(speech)
        marks[text] = sum(len(x) for x in out)
        out.append(np.zeros(int(gap * SR), dtype=np.float32))
    return np.concatenate(out), marks


def trim(x, thresh=0.01):
    idx = np.where(np.abs(x) > thresh)[0]
    if not len(idx):
        return x
    return x[max(0, idx[0] - int(0.03 * SR)): idx[-1] + int(0.06 * SR)]


def knock(n_knocks=3):
    """A knuckle on a door heard down a phone: a short low thump with a
    wooden knock on top, decaying fast, three times, unevenly spaced."""
    rng = np.random.default_rng(7)
    parts = []
    for i in range(n_knocks):
        t = np.arange(int(0.12 * SR)) / SR
        thump = np.sin(2 * np.pi * (95 + 20 * rng.random()) * t) * np.exp(-t / 0.022)
        wood = rng.standard_normal(len(t)) * np.exp(-t / 0.008)
        wood = np.convolve(wood, np.ones(6) / 6, mode="same")
        parts.append((0.8 * thump + 0.35 * wood) * (0.9 - 0.12 * i))
        parts.append(np.zeros(int((0.17 + 0.05 * rng.random()) * SR)))
    return np.concatenate(parts).astype(np.float32) * 0.5


def phone_line(x):
    """What a mobile voicemail does to a voice: narrow band, a codec's
    squash, automatic gain, a little line noise and the room behind her."""
    n = len(x)
    spec = np.fft.rfft(x)
    f = np.fft.rfftfreq(n, 1 / SR)
    f = np.maximum(f, 1e-6)
    hp = 1 / np.sqrt(1 + (300 / f) ** 4)
    lp = 1 / np.sqrt(1 + (f / 3400) ** 8)
    presence = 1 + 0.35 * np.exp(-((f - 2200) / 700) ** 2)   # the phone's nasal peak
    y = np.fft.irfft(spec * hp * lp * presence, n)
    # slow AGC: pull quiet words up, loud ones down, the way a phone does
    win = int(0.25 * SR)
    env = np.sqrt(np.convolve(y ** 2, np.ones(win) / win, mode="same")) + 1e-4
    y = y * np.clip(0.06 / env, 0.5, 2.6) ** 0.55
    y = np.tanh(y * 2.2) / 2.2                                  # codec squash
    rng = np.random.default_rng(3)
    hiss = np.fft.irfft(np.fft.rfft(rng.standard_normal(n)) * hp * lp, n) * 0.004
    room = np.convolve(y, np.exp(-np.arange(int(0.05 * SR)) / (0.012 * SR)), mode="same") * 0.06
    return y + hiss + room


def envelope(x, buckets=BUCKETS):
    edges = np.linspace(0, len(x), buckets + 1).astype(int)
    rms = np.array([np.sqrt(np.mean(x[a:b] ** 2)) for a, b in zip(edges[:-1], edges[1:])])
    rms = rms / rms.max()
    return np.round(rms, 2)


def main():
    speech, marks = synth_lines()
    k = knock()
    at = marks[KNOCK_AFTER] + int(0.12 * SR)
    speech[at:at + len(k)] += k[: max(0, len(speech) - at)]
    lead_in = np.zeros(int(0.35 * SR), dtype=np.float32)       # a beat before she speaks
    tail = np.zeros(int(0.6 * SR), dtype=np.float32)
    audio = phone_line(np.concatenate([lead_in, speech, tail]))
    audio = audio / np.abs(audio).max() * 0.89

    wav = OUT.with_suffix(".wav")
    sf.write(wav, audio, SR)
    if OUT.exists():
        OUT.unlink()
    subprocess.run(["afconvert", "-f", "mp4f", "-d", "aac", "-b", "64000", "-c", "1", str(wav), str(OUT)], check=True)
    wav.unlink()

    env = envelope(audio)
    print(f"voice={VOICE}  duration={len(audio) / SR:.2f}s  -> {OUT.relative_to(ROOT)}")
    print("VM_WAVE =", "[" + ", ".join(f"{v:.2f}" for v in env) + "]")


if __name__ == "__main__":
    main()
