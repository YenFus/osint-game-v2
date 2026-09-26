#!/usr/bin/env python3
"""
Maya's voicemail, take two: Orpheus-3B (Apache-2.0, local via mlx-audio).

Kokoro said every word right and still sounded like a narrator. Orpheus is a
speech LLM trained on conversational audio; it breathes, hesitates, and takes
<sigh>/<gasp> tags, which is what a frightened 24-year-old on the phone at
7:52am sounds like. Same line-by-line build, same gaps, same knock and phone
line as scripts/gen_voicemail.py (imported from there), so only the voice
changes.

    .venv-mlxaudio/bin/python scripts/gen_voicemail_orpheus.py tara [seed] [outdir]

With an outdir it writes candidates there (raw + phone-filtered WAVs) for
auditioning; without one it writes public/audio/maya-voicemail.mp4 and prints
the waveform envelope for PrologueArt.jsx.
"""
import sys, subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
import mlx.core as mx

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gen_voicemail as base   # SCRIPT gaps, knock(), phone_line(), envelope(), trim()

VOICE = sys.argv[1] if len(sys.argv) > 1 else 'tara'
SEED = int(sys.argv[2]) if len(sys.argv) > 2 else 1
OUTDIR = Path(sys.argv[3]) if len(sys.argv) > 3 else None
SR = base.SR

# What Orpheus is asked to say for each line of base.SCRIPT. The words are the
# same; the tags are hers — a breath before she starts, a catch at the knock.
SAY = {
    "Hey Dad, it's me.": "Hey Dad, it's me.",
    "Okay.": "<sigh> Okay.",
    "Hang on.": "<gasp> Hang on.",
}

def main():
    from mlx_audio.tts.utils import load_model
    mx.random.seed(SEED)
    model = load_model('mlx-community/orpheus-3b-0.1-ft-8bit')
    out, marks = [], {}
    for text, gap in base.SCRIPT:
        prompt = SAY.get(text, text).replace('—', '...')
        chunks = [np.asarray(r.audio, dtype=np.float32) for r in model.generate(text=prompt, voice=VOICE, temperature=0.7, top_p=0.9, max_tokens=1600)]
        speech = base.trim(np.concatenate(chunks))
        out.append(speech)
        marks[text] = sum(len(x) for x in out)
        out.append(np.zeros(int(gap * SR), dtype=np.float32))
    speech = np.concatenate(out)
    k = base.knock()
    at = marks[base.KNOCK_AFTER] + int(0.12 * SR)
    speech[at:at + len(k)] += k[: max(0, len(speech) - at)]
    raw = np.concatenate([np.zeros(int(0.35 * SR), np.float32), speech, np.zeros(int(0.6 * SR), np.float32)])
    audio = base.phone_line(raw)
    audio = audio / np.abs(audio).max() * 0.89
    if OUTDIR:
        OUTDIR.mkdir(parents=True, exist_ok=True)
        sf.write(OUTDIR / f'orpheus-{VOICE}-{SEED}-raw.wav', raw / np.abs(raw).max() * 0.89, SR)
        sf.write(OUTDIR / f'orpheus-{VOICE}-{SEED}.wav', audio, SR)
        print('wrote', VOICE, SEED, f'{len(audio)/SR:.1f}s')
        return
    wav = base.OUT.with_suffix('.wav'); sf.write(wav, audio, SR)
    if base.OUT.exists(): base.OUT.unlink()
    subprocess.run(['afconvert', '-f', 'mp4f', '-d', 'aac', '-b', '64000', '-c', '1', str(wav), str(base.OUT)], check=True)
    wav.unlink()
    print(f'voice=orpheus/{VOICE} seed={SEED} duration={len(audio)/SR:.2f}s')
    print('VM_WAVE =', '[' + ', '.join(f'{v:.2f}' for v in base.envelope(audio)) + ']')

if __name__ == '__main__':
    main()
