#!/usr/bin/env python3
"""
Build the game's sound effects from recorded CC0 foley.

Every sound used to be a Web Audio oscillator or a filtered noise burst.
These are real recordings, cut to the moment that matters, faded and
level-matched. Sources (all CC0 unless marked):

  Freesound:  83704/369839 phone vibrating (SpliceSound), 470710 stamp
  (I.fekry), 688735 heartbeat (Cloud-10), 511967 clock (se2001), 751055 pen
  on paper (SSkiba88), 353125 paper rustle (BenjaminNelan), 656546 page turn
  (IENBA), 467200 handset (ThunderQuads), 380138 + 160678 typewriter keys
  (yottasounds, BMacZero), 266894 tack into cork (pfranzen, CC-BY 4.0).
  Kenney RPG Audio / Interface Sounds (CC0): bookPlace, select.

The originals live outside the repo (they're large); SRC points at them.
    .venv-tts/bin/python scripts/build_sfx.py /path/to/w48
"""
import sys
from pathlib import Path
import numpy as np
import soundfile as sf

SRC = Path(sys.argv[1])
OUT = Path(__file__).resolve().parent.parent / 'public' / 'audio' / 'sfx'
SR = 48000


def load(name):
    x, sr = sf.read(SRC / f'{name}.wav', dtype='float32')
    assert sr == SR
    return x if x.ndim == 1 else x.mean(1)


def cut(name, start, dur, fade_in=0.003, fade_out=0.03):
    x = load(name)[int(start * SR):int((start + dur) * SR)].copy()
    fi, fo = int(fade_in * SR), int(fade_out * SR)
    x[:fi] *= np.linspace(0, 1, fi)
    x[-fo:] *= np.linspace(1, 0, fo)
    return x


def peak(x, db):
    return x * (10 ** (db / 20) / (np.abs(x).max() + 1e-9))


def mix(*parts):
    """(signal, offset_seconds) pairs laid on one timeline"""
    n = max(int(o * SR) + len(s) for s, o in parts)
    out = np.zeros(n, dtype='float32')
    for s, o in parts:
        i = int(o * SR); out[i:i + len(s)] += s
    return out


def ringback():
    # North American ringback: 440 + 480 Hz, two seconds on. Real phones make
    # this tone electronically, so synthesising it is the honest version.
    t = np.arange(int(2.0 * SR)) / SR
    x = np.sin(2 * np.pi * 440 * t) + np.sin(2 * np.pi * 480 * t)
    env = np.minimum(1, np.minimum(t / 0.02, (2.0 - t) / 0.05))
    x *= env
    # a little line colour: soft clip and a touch of hiss
    x = np.tanh(x * 0.9) + np.random.default_rng(7).normal(0, 0.01, len(x))
    return x.astype('float32')


SFX = {
    'click':        lambda: peak(cut('k_select_001', 0, 0.05), -14),
    'pin':          lambda: peak(cut('pin_266894', 0, 0.12, fade_out=0.04), -5),
    'stamp':        lambda: peak(cut('stamp_470710', 0.45, 0.5, fade_out=0.12), -2),
    'buzz':         lambda: peak(cut('buzz_369839', 0.40, 1.2, fade_out=0.1), -5),
    'notification': lambda: peak(cut('buzz_369839', 2.43, 0.38, fade_out=0.08), -7),
    'discovery':    lambda: mix((peak(cut('rustle_353125', 0.25, 0.75, fade_out=0.1), -7), 0),
                                (peak(cut('k_bookPlace1', 0.0, 0.26, fade_out=0.08), -6), 0.5)),
    'nodeComplete': lambda: peak(cut('pageturn_656546', 0.04, 0.42, fade_out=0.12), -6),
    'pageTurn':     lambda: peak(cut('pageturn_656546', 2.85, 0.36, fade_out=0.12), -8),
    'error':        lambda: peak(cut('pen_751055', 2.0, 0.4, fade_out=0.08), -9),
    'deduction':    lambda: mix((peak(cut('pen_751055', 0.40, 0.3, fade_out=0.06), -9), 0),
                                (peak(cut('k_bookPlace2', 0.0, 0.3, fade_out=0.1), -5), 0.34)),
    'tick':         lambda: peak(cut('tick_511967', 0.12, 0.42, fade_out=0.05), -9),
    'heartbeat':    lambda: peak(cut('heart_688735', 0.0, 0.62, fade_out=0.08), -4),
    'typewriterKey': lambda: peak(cut('typekey_380138', 0.0, 0.12, fade_out=0.03), -9),
    'typewriterKey2': lambda: peak(cut('typekey_160678', 0.0, 0.12, fade_out=0.03), -9),
    'pickup':       lambda: peak(cut('hangup_467200', 0.15, 0.36, fade_out=0.08), -6),
    'hangup':       lambda: peak(cut('hangup_467200', 0.17, 0.3, fade_out=0.08), -8),
    'ringback':     lambda: peak(ringback(), -16),
}

if __name__ == '__main__':
    OUT.mkdir(parents=True, exist_ok=True)
    for name, make in SFX.items():
        x = make()
        sf.write(OUT / f'{name}.wav', x, SR, subtype='PCM_16')
        print(f'{name:15s} {len(x)/SR:5.2f}s')
