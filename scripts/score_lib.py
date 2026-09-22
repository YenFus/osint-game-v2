"""Sample library for scripts/compose_score.py: finds each sample's real pitch."""
import json, re
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import resample_poly

SR = 44100


def f0(x, sr):
    """Fundamental by harmonic product spectrum over a steady stretch."""
    a = int(0.15 * sr); seg = x[a:a + int(0.6 * sr)]
    if len(seg) < 4096: seg = x[:int(0.6 * sr)]
    seg = seg * np.hanning(len(seg))
    n = 1 << 17
    sp = np.abs(np.fft.rfft(seg, n))
    hps = sp.copy()
    for h in (2, 3, 4):
        d = sp[::h]; hps[:len(d)] *= d
    freqs = np.fft.rfftfreq(n, 1 / sr)
    lo, hi = np.searchsorted(freqs, [25, 2500])
    return freqs[lo + np.argmax(hps[lo:hi])]


def midi_of(f): return 69 + 12 * np.log2(f / 440)


def load_dir(d, pattern, cache):
    """-> list of (midi_float, samples) for files matching pattern"""
    d = Path(d); out = []
    for p in sorted(d.glob(pattern)):
        key = str(p)
        x, sr = sf.read(p, dtype='float32')
        if x.ndim > 1: x = x.mean(1)
        if sr != SR: x = resample_poly(x, SR, sr).astype('float32')
        if key not in cache: cache[key] = float(midi_of(f0(x, SR)))
        out.append((cache[key], x))
    return out


class Instrument:
    def __init__(self, samples, release=0.35):
        self.samples = sorted(samples, key=lambda s: s[0]); self.release = release

    def note(self, midi, dur, vel=0.7):
        m, x = min(self.samples, key=lambda s: abs(s[0] - midi))
        ratio = 2 ** ((midi - m) / 12)             # >1 = play faster = higher
        # resample by ratio with linear interpolation
        n_out = int(min(len(x) / ratio, (dur + self.release) * SR))
        idx = np.arange(n_out) * ratio
        i0 = idx.astype(int); fr = idx - i0
        i1 = np.minimum(i0 + 1, len(x) - 1)
        y = x[i0] * (1 - fr) + x[i1] * fr
        # release at the end of the written duration
        rel = int(self.release * SR); end = int(dur * SR)
        env = np.ones(len(y), dtype='float32')
        if end < len(y):
            r = min(rel, len(y) - end)
            env[end:end + r] = np.linspace(1, 0, r) ** 2
            env[end + r:] = 0
        env[:32] *= np.linspace(0, 1, 32)
        return (y * env * vel).astype('float32')
