"""Judge a voice take without ears: does it say the words, how human is its
pitch and timing, and what does an audio-text model think it sounds like.
    .venv-tts/bin/python harness/voice_eval.py take1.wav take2.wav ...
A proxy, not a verdict: listen before shipping anything."""
import sys, re, numpy as np, librosa, torch, whisper
from transformers import ClapModel, ClapProcessor
REF = ("hey dad it's me okay i need to tell you something and i should've told you weeks ago i'm sorry "
       "it's about the thing i've been working on i'm okay i want you to hear me say that first i'm okay "
       "but if i don't call you back tonight i need you to go to the hang on someone's at the door one sec").split()
LABELS = ["a frightened young woman leaving a voice message", "a natural human voice recorded on a phone",
          "a calm professional narrator reading a script", "a robotic synthetic text to speech voice",
          "an actress performing dramatically"]
def wer(h):
    h = re.sub(r"[^a-z' ]", " ", h.lower()).replace("should have", "should've").split()
    d = np.arange(len(h) + 1)
    for i, r in enumerate(REF, 1):
        prev, d[0] = d.copy(), i
        for j, w in enumerate(h, 1): d[j] = min(prev[j] + 1, d[j - 1] + 1, prev[j - 1] + (r != w))
    return d[len(h)] / len(REF)
asr = whisper.load_model('base')
clap = ClapModel.from_pretrained('laion/clap-htsat-unfused').eval(); pr = ClapProcessor.from_pretrained('laion/clap-htsat-unfused')
with torch.no_grad():
    te = clap.get_text_features(**pr(text=LABELS, return_tensors='pt', padding=True)); te = getattr(te, 'pooler_output', te); te = te / te.norm(dim=-1, keepdim=True)
for f in sys.argv[1:]:
    y, sr = librosa.load(f, sr=16000, mono=True)
    txt = asr.transcribe(y, language='en')['text']
    f0, vf, _ = librosa.pyin(y, fmin=80, fmax=500, sr=sr)
    f0 = f0[vf]; semis = 12 * np.log2(f0 / np.median(f0)) if len(f0) else np.array([0])
    rms = librosa.feature.rms(y=y, hop_length=160)[0]; quiet = rms < 0.1 * rms.max()
    runs = np.diff(np.flatnonzero(np.diff(np.r_[0, quiet.astype(int), 0]))) [::2] * 0.01
    pauses = runs[runs > 0.2]
    y48 = librosa.resample(y, orig_sr=sr, target_sr=48000)
    sims = []
    with torch.no_grad():
        for st in range(0, max(1, len(y48) - 480000 + 1), 240000):
            ae = clap.get_audio_features(**pr(audio=[y48[st:st + 480000]], sampling_rate=48000, return_tensors='pt')); ae = getattr(ae, 'pooler_output', ae); ae = ae / ae.norm(dim=-1, keepdim=True)
            sims.append((ae @ te.T)[0].numpy())
    s = np.mean(sims, 0)
    print(f"\n{f.split('/')[-1]}: {len(y)/sr:.1f}s  WER {wer(txt):.2f}  pitch spread {np.percentile(semis,95)-np.percentile(semis,5):.1f} st  pauses>0.2s {len(pauses)} (max {pauses.max() if len(pauses) else 0:.2f}s)")
    print("  heard:", txt.strip()[:160])
    print("  CLAP:", "; ".join(f"{l[:34]} {v:.2f}" for l, v in sorted(zip(LABELS, s), key=lambda t: -t[1])))
