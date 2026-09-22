import { useRef, useCallback, useEffect } from 'react'
import { useAudioStore } from '../store/audioStore'

// Build a synthetic reverb impulse response (no audio files needed)
function buildReverb(ctx, duration = 2.0, decay = 2.8) {
  const length = Math.floor(ctx.sampleRate * duration)
  const impulse = ctx.createBuffer(2, length, ctx.sampleRate)
  for (let c = 0; c < 2; c++) {
    const data = impulse.getChannelData(c)
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay)
    }
  }
  return impulse
}

// Fill a mono buffer with white noise
function makeNoiseBuffer(ctx, seconds = 2) {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1
  return buf
}

// ── The things in the room ────────────────────────────────────────────
// Every sound the game makes should be something on the desk: paper moving,
// a pin going into cork, a phone buzzing on a table. Chimes and arpeggios
// belong to a different game and made this one feel like a quiz show.
function noiseBurst(ctx, dest, { at, dur, freq, q = 1, type = 'bandpass', gain = 0.2, attack = 0.002 }) {
  const src = ctx.createBufferSource()
  src.buffer = makeNoiseBuffer(ctx, Math.max(0.05, dur))
  const filter = ctx.createBiquadFilter()
  filter.type = type; filter.frequency.value = freq; filter.Q.value = q
  const g = ctx.createGain()
  g.gain.setValueAtTime(0.0001, at)
  g.gain.linearRampToValueAtTime(gain, at + attack)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  src.connect(filter); filter.connect(g); g.connect(dest)
  src.start(at); src.stop(at + dur + 0.02)
  return g
}

// A knock, a footfall, a book set down: pitch falling away to nothing.
function bodyThud(ctx, dest, { at, from = 150, to = 45, dur = 0.22, gain = 0.3 }) {
  const osc = ctx.createOscillator()
  const g = ctx.createGain()
  osc.type = 'sine'
  osc.frequency.setValueAtTime(from, at)
  osc.frequency.exponentialRampToValueAtTime(to, at + dur)
  g.gain.setValueAtTime(gain, at)
  g.gain.exponentialRampToValueAtTime(0.0001, at + dur)
  osc.connect(g); g.connect(dest)
  osc.start(at); osc.stop(at + dur + 0.02)
}

class AudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.reverbNode = null
    this.compressor = null
    this.ambientNodes = new Map()
    // decoded room-tone beds, keyed by track name; see startAmbient
    this.bedBuffers = new Map()
    this.bedPending = new Map()
    this.initialized = false
    // recorded foley, keyed by SFX name; see loadSamples
    this.samples = new Map()
    this.samplesRequested = false
    // the score: one cue at a time, crossfaded (scripts/compose_score.py)
    this.score = null          // { name, src, gain }
    this.scoreBuffers = new Map()
    this.scoreWanted = null
    this.scoreVolume = 1
    this.duckLevel = 1
  }

  async loadScore(name) {
    if (this.scoreBuffers.has(name)) return this.scoreBuffers.get(name)
    const res = await fetch(`${import.meta.env.BASE_URL}audio/mus-${name}.mp4`)
    if (!res.ok) throw new Error(`${res.status}`)
    const buf = await this.ctx.decodeAudioData(await res.arrayBuffer())
    this.scoreBuffers.set(name, buf)
    return buf
  }

  // AAC puts a few thousand samples of silence in front of the music, and a
  // loop that includes them ticks at the seam. Start the loop at the first
  // real sample and end it exactly one written loop later.
  scoreLoop(buf, name) {
    const d = buf.getChannelData(0)
    let first = 0
    while (first < d.length && Math.abs(d[first]) < 1e-5 && first < buf.sampleRate) first++
    const start = first / buf.sampleRate
    const len = SCORE_LOOP_SECONDS[name] ?? (buf.duration - start)
    return { start, end: Math.min(buf.duration, start + len) }
  }

  playScore(name, volume = this.scoreVolume) {
    this.scoreVolume = volume
    this.scoreWanted = name
    if (!this.ctx) return
    if (this.score?.name === name) return
    this.fadeOutScore(2.5)
    if (!name) return
    this.loadScore(name).then(buf => {
      if (this.scoreWanted !== name || this.score?.name === name) return
      const { start, end } = this.scoreLoop(buf, name)
      const src = this.ctx.createBufferSource()
      src.buffer = buf
      src.loop = true
      src.loopStart = start
      src.loopEnd = end
      const gain = this.ctx.createGain()
      gain.gain.value = 0
      src.connect(gain); gain.connect(this.masterGain)
      src.start(0, start)
      gain.gain.setTargetAtTime(this.scoreTarget(), this.ctx.currentTime, 1.4)
      this.score = { name, src, gain }
    }).catch(() => { /* no score for this room; the bed carries it */ })
  }

  scoreTarget() { return this.scoreVolume * SCORE_LEVEL * this.duckLevel }

  fadeOutScore(seconds = 2) {
    const old = this.score
    if (!old) return
    this.score = null
    old.gain.gain.setTargetAtTime(0, this.ctx.currentTime, seconds / 3)
    setTimeout(() => { try { old.src.stop() } catch { /* already stopped */ } }, seconds * 1000 + 500)
  }

  // Pull the music down under something the player needs to hear — her voicemail.
  duckScore(on) {
    this.duckLevel = on ? 0.18 : 1
    if (this.score) this.score.gain.gain.setTargetAtTime(this.scoreTarget(), this.ctx.currentTime, on ? 0.25 : 1.2)
  }

  // Every effect used to be an oscillator or a filtered noise burst. They're
  // recordings now (scripts/build_sfx.py). Loaded once, after the first
  // gesture; until a file has decoded, the synthesised version stands in.
  loadSamples() {
    if (this.samplesRequested || !this.ctx) return
    this.samplesRequested = true
    for (const name of SAMPLE_SFX) {
      fetch(`${import.meta.env.BASE_URL}audio/sfx/${name}.wav`)
        .then(r => { if (!r.ok) throw new Error(r.status); return r.arrayBuffer() })
        .then(b => this.ctx.decodeAudioData(b))
        .then(buf => this.samples.set(name, buf))
        .catch(() => { /* the synth fallback carries it */ })
    }
  }

  playSample(name, volume, { rate = 1, room = 0 } = {}) {
    const buf = this.samples.get(name)
    if (!buf) return false
    const src = this.ctx.createBufferSource()
    src.buffer = buf
    src.playbackRate.value = rate
    const g = this.ctx.createGain()
    g.gain.value = volume
    src.connect(g); g.connect(this.masterGain)
    if (room > 0) {
      const wet = this.ctx.createGain()
      wet.gain.value = volume * room
      src.connect(wet); wet.connect(this.reverbNode)
    }
    src.start()
    return src
  }

  init() {
    if (this.initialized) return
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()

    // Compressor — smooth dynamics, prevents clipping
    this.compressor = this.ctx.createDynamicsCompressor()
    this.compressor.threshold.value = -18
    this.compressor.knee.value = 12
    this.compressor.ratio.value = 4
    this.compressor.attack.value = 0.05
    this.compressor.release.value = 0.3
    this.compressor.connect(this.ctx.destination)

    // Master gain
    this.masterGain = this.ctx.createGain()
    this.masterGain.gain.value = 0.7
    this.masterGain.connect(this.compressor)

    // Reverb send (shared by ambients + SFX)
    this.reverbNode = this.ctx.createConvolver()
    this.reverbNode.buffer = buildReverb(this.ctx, 2.0, 2.8)
    const reverbOut = this.ctx.createGain()
    reverbOut.gain.value = 0.38
    this.reverbNode.connect(reverbOut)
    reverbOut.connect(this.masterGain)

    this.initialized = true
    this.loadSamples()
  }

  resume() {
    if (this.ctx?.state === 'suspended') this.ctx.resume()
  }

  setMasterVolume(vol, muted) {
    if (!this.masterGain) return
    this.masterGain.gain.setTargetAtTime(muted ? 0 : vol, this.ctx.currentTime, 0.1)
  }

  // ── AMBIENT TRACK BUILDERS ─────────────────────────────────────────────

  // Rich noir drone — menu / ending
  createMenuDrone(rootHz = 55) {
    const ctx = this.ctx
    const out = ctx.createGain()
    out.gain.value = 0

    // Three stacked oscillators: root, perfect 5th (slightly flat), octave
    const osc1 = ctx.createOscillator()
    const osc2 = ctx.createOscillator()
    const osc3 = ctx.createOscillator()
    osc1.type = 'sine';     osc1.frequency.value = rootHz;        osc1.detune.value = 0
    osc2.type = 'sine';     osc2.frequency.value = rootHz * 1.5;  osc2.detune.value = -9
    osc3.type = 'triangle'; osc3.frequency.value = rootHz * 2;    osc3.detune.value = 11

    const g1 = ctx.createGain(); g1.gain.value = 0.60
    const g2 = ctx.createGain(); g2.gain.value = 0.28
    const g3 = ctx.createGain(); g3.gain.value = 0.10

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 280
    filter.Q.value = 1.3

    osc1.connect(g1); osc2.connect(g2); osc3.connect(g3)
    g1.connect(filter); g2.connect(filter); g3.connect(filter)
    filter.connect(out)

    // Slow filter-sweep LFO (12-second cycle) — gives it breathing quality
    const lfoFilter = ctx.createOscillator()
    const lfoFilterGain = ctx.createGain()
    lfoFilter.type = 'sine'; lfoFilter.frequency.value = 0.083
    lfoFilterGain.gain.value = 70
    lfoFilter.connect(lfoFilterGain)
    lfoFilterGain.connect(filter.frequency)
    lfoFilter.start()

    // Tremolo LFO (5-second pulse) — barely perceptible, just alive
    const tremolo = ctx.createOscillator()
    const tremoloGain = ctx.createGain()
    tremolo.type = 'sine'; tremolo.frequency.value = 0.2
    tremoloGain.gain.value = 0.012
    tremolo.connect(tremoloGain)
    tremoloGain.connect(out.gain)
    tremolo.start()

    // Dry + wet routing
    const dry = ctx.createGain(); dry.gain.value = 0.65
    const wet = ctx.createGain(); wet.gain.value = 0.55
    out.connect(dry); out.connect(wet)
    dry.connect(this.masterGain); wet.connect(this.reverbNode)

    osc1.start(); osc2.start(); osc3.start()
    return { oscillators: [osc1, osc2, osc3, lfoFilter, tremolo], gain: out }
  }

  // Layered cinematic rain — story / prologue
  createRain() {
    const ctx = this.ctx
    const out = ctx.createGain()
    out.gain.value = 0

    // Layer 1: High-frequency hiss (rain on glass)
    const hissSrc = ctx.createBufferSource()
    hissSrc.buffer = makeNoiseBuffer(ctx, 3); hissSrc.loop = true
    const hissFilter = ctx.createBiquadFilter()
    hissFilter.type = 'highpass'; hissFilter.frequency.value = 4500
    const hissGain = ctx.createGain(); hissGain.gain.value = 0.18
    hissSrc.connect(hissFilter); hissFilter.connect(hissGain); hissGain.connect(out)

    // Layer 2: Mid-band body (splash, movement)
    const midSrc = ctx.createBufferSource()
    midSrc.buffer = makeNoiseBuffer(ctx, 2); midSrc.loop = true
    const midFilter = ctx.createBiquadFilter()
    midFilter.type = 'bandpass'; midFilter.frequency.value = 900; midFilter.Q.value = 0.5
    const midGain = ctx.createGain(); midGain.gain.value = 0.38
    // LFO on mid gain — rain intensity variation
    const lfo = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'; lfo.frequency.value = 0.07
    lfoGain.gain.value = 0.07
    lfo.connect(lfoGain); lfoGain.connect(midGain.gain); lfo.start()
    midSrc.connect(midFilter); midFilter.connect(midGain); midGain.connect(out)

    // Layer 3: Sub rumble (distant, atmospheric)
    const rumble = ctx.createOscillator()
    rumble.type = 'sine'; rumble.frequency.value = 42
    const rumbleGain = ctx.createGain(); rumbleGain.gain.value = 0.10
    rumble.connect(rumbleGain); rumbleGain.connect(out)

    // Wet-heavy for immersion
    const dry = ctx.createGain(); dry.gain.value = 0.7
    const wet = ctx.createGain(); wet.gain.value = 0.4
    out.connect(dry); out.connect(wet)
    dry.connect(this.masterGain); wet.connect(this.reverbNode)

    hissSrc.start(); midSrc.start(); rumble.start()
    return { oscillators: [rumble, lfo], sources: [hissSrc, midSrc], gain: out }
  }

  // Sparse apartment room tone — intimate, still
  createApartmentTone() {
    const ctx = this.ctx
    const out = ctx.createGain()
    out.gain.value = 0

    // Sub-bass room presence
    const sub = ctx.createOscillator()
    sub.type = 'sine'; sub.frequency.value = 38
    const subGain = ctx.createGain(); subGain.gain.value = 0.55
    sub.connect(subGain); subGain.connect(out)

    // Electrical hum (60Hz — the sound of an inhabited space)
    const hum = ctx.createOscillator()
    hum.type = 'sine'; hum.frequency.value = 60
    const humGain = ctx.createGain(); humGain.gain.value = 0.07
    hum.connect(humGain); humGain.connect(out)

    // Air noise — almost inaudible, just warmth
    const airSrc = ctx.createBufferSource()
    airSrc.buffer = makeNoiseBuffer(ctx, 2); airSrc.loop = true
    const airFilter = ctx.createBiquadFilter()
    airFilter.type = 'lowpass'; airFilter.frequency.value = 350
    const airGain = ctx.createGain(); airGain.gain.value = 0.07
    airSrc.connect(airFilter); airFilter.connect(airGain); airGain.connect(out)

    const dry = ctx.createGain(); dry.gain.value = 0.5
    const wet = ctx.createGain(); wet.gain.value = 0.6
    out.connect(dry); out.connect(wet)
    dry.connect(this.masterGain); wet.connect(this.reverbNode)

    sub.start(); hum.start(); airSrc.start()
    return { oscillators: [sub, hum], sources: [airSrc], gain: out }
  }

  // Tense investigation drone — pulsing, unresolved
  createInvestigationDrone(isConvergence = false) {
    const ctx = this.ctx
    const rootHz = 65
    const out = ctx.createGain()
    out.gain.value = 0

    // Fundamental sine
    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'; osc1.frequency.value = rootHz

    // Sawtooth on tritone (dissonant interval — maximum tension)
    const osc2 = ctx.createOscillator()
    osc2.type = 'sawtooth'; osc2.frequency.value = rootHz * 1.414  // ~tritone
    osc2.detune.value = -18  // Even flatter for dread

    // Sub octave
    const osc3 = ctx.createOscillator()
    osc3.type = 'sine'; osc3.frequency.value = rootHz * 0.5

    const g1 = ctx.createGain(); g1.gain.value = 0.50
    const g2 = ctx.createGain(); g2.gain.value = 0.10
    const g3 = ctx.createGain(); g3.gain.value = 0.32

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = isConvergence ? 400 : 270
    filter.Q.value = 2.2

    osc1.connect(g1); osc2.connect(g2); osc3.connect(g3)
    g1.connect(filter); g2.connect(filter); g3.connect(filter)
    filter.connect(out)

    // Amplitude modulation — creates heartbeat-like pulse
    const am = ctx.createOscillator()
    const amGain = ctx.createGain()
    am.type = 'sine'
    am.frequency.value = isConvergence ? 5.2 : 7.6  // Slower for convergence — more dread
    amGain.gain.value = 0.020
    am.connect(amGain); amGain.connect(out.gain); am.start()

    // Noise hiss — adds grit and tension texture
    const noiseSrc = ctx.createBufferSource()
    noiseSrc.buffer = makeNoiseBuffer(ctx, 2); noiseSrc.loop = true
    const noiseFilter = ctx.createBiquadFilter()
    noiseFilter.type = 'highpass'; noiseFilter.frequency.value = 3500
    const noiseGain = ctx.createGain(); noiseGain.gain.value = 0.045
    noiseSrc.connect(noiseFilter); noiseFilter.connect(noiseGain); noiseGain.connect(out)

    // For convergence: add high harmonic that creates more urgency
    let extraOsc = null
    if (isConvergence) {
      extraOsc = ctx.createOscillator()
      extraOsc.type = 'sine'; extraOsc.frequency.value = rootHz * 3
      const extraGain = ctx.createGain(); extraGain.gain.value = 0.05
      extraOsc.connect(extraGain); extraGain.connect(filter)
      extraOsc.start()
    }

    const dry = ctx.createGain(); dry.gain.value = 0.62
    const wet = ctx.createGain(); wet.gain.value = 0.48
    out.connect(dry); out.connect(wet)
    dry.connect(this.masterGain); wet.connect(this.reverbNode)

    osc1.start(); osc2.start(); osc3.start(); noiseSrc.start()
    const oscs = [osc1, osc2, osc3, am]
    if (extraOsc) oscs.push(extraOsc)
    return { oscillators: oscs, sources: [noiseSrc], gain: out }
  }

  // ── SFX ────────────────────────────────────────────────────────────────

  playSFX(type, volume = 1) {
    if (!this.ctx) return
    // A recording if we have one. Small things a hand does over and over get
    // a touch of pitch drift so twenty pins in a row aren't one pin twenty times.
    if (SAMPLE_SFX.has(type)) {
      const drift = SAMPLE_DRIFT.has(type) ? 0.94 + Math.random() * 0.12 : 1
      if (this.playSample(type, volume, { rate: drift, room: SAMPLE_ROOM[type] ?? 0 })) return
    }
    const now = this.ctx.currentTime

    switch (type) {

      case 'typewriterKey': {
        // Percussive mechanical click — short noise burst, no pitch
        const src = this.ctx.createBufferSource()
        src.buffer = makeNoiseBuffer(this.ctx, 0.025)
        const filter = this.ctx.createBiquadFilter()
        filter.type = 'bandpass'; filter.frequency.value = 1800; filter.Q.value = 2.5
        const gain = this.ctx.createGain()
        gain.gain.setValueAtTime(volume * 0.14, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025)
        src.connect(filter); filter.connect(gain); gain.connect(this.masterGain)
        src.start(now)
        break
      }

      case 'notification': {
        // A phone face-down on a wooden table.
        bodyThud(this.ctx, this.masterGain, { at: now, from: 120, to: 55, dur: 0.12, gain: volume * 0.16 })
        for (let i = 0; i < 3; i++) {
          const t = now + i * 0.11
          noiseBurst(this.ctx, this.masterGain, { at: t, dur: 0.075, freq: 160, q: 0.8, gain: volume * 0.2 })
          bodyThud(this.ctx, this.masterGain, { at: t, from: 78, to: 60, dur: 0.07, gain: volume * 0.22 })
        }
        break
      }

      case 'discovery': {
        // Paper pulled out of a stack and set down: a rustle, then weight.
        noiseBurst(this.ctx, this.masterGain, { at: now, dur: 0.26, freq: 3200, q: 0.5, type: 'highpass', gain: volume * 0.16, attack: 0.03 })
        noiseBurst(this.ctx, this.masterGain, { at: now + 0.1, dur: 0.22, freq: 1800, q: 0.7, gain: volume * 0.12 })
        bodyThud(this.ctx, this.masterGain, { at: now + 0.16, from: 130, to: 48, dur: 0.3, gain: volume * 0.3 })
        const wet = this.ctx.createGain()
        wet.gain.value = volume * 0.25
        wet.connect(this.reverbNode)
        noiseBurst(this.ctx, wet, { at: now + 0.16, dur: 0.3, freq: 900, q: 0.6, gain: volume * 0.1 })
        break
      }

      case 'nodeComplete': {
        // A pen laid down on the desk, and the page turned.
        noiseBurst(this.ctx, this.masterGain, { at: now, dur: 0.05, freq: 2600, q: 2, gain: volume * 0.14 })
        bodyThud(this.ctx, this.masterGain, { at: now + 0.02, from: 190, to: 70, dur: 0.1, gain: volume * 0.14 })
        noiseBurst(this.ctx, this.masterGain, { at: now + 0.16, dur: 0.34, freq: 2400, q: 0.4, type: 'highpass', gain: volume * 0.13, attack: 0.05 })
        break
      }

      case 'error': {
        // Not a buzzer — a drawer shoved shut.
        noiseBurst(this.ctx, this.masterGain, { at: now, dur: 0.16, freq: 420, q: 0.7, gain: volume * 0.26 })
        bodyThud(this.ctx, this.masterGain, { at: now + 0.01, from: 105, to: 38, dur: 0.3, gain: volume * 0.32 })
        noiseBurst(this.ctx, this.masterGain, { at: now + 0.12, dur: 0.1, freq: 900, q: 1.4, gain: volume * 0.12 })
        break
      }

      case 'buzz': {
        // Phone vibrating on a desk — two pulses of low, rattly square wave
        ;[0, 0.32].forEach(offset => {
          const osc = this.ctx.createOscillator()
          const filter = this.ctx.createBiquadFilter()
          const gain = this.ctx.createGain()
          osc.type = 'square'; osc.frequency.value = 148
          filter.type = 'lowpass'; filter.frequency.value = 420
          const t = now + offset
          gain.gain.setValueAtTime(0, t)
          gain.gain.linearRampToValueAtTime(volume * 0.22, t + 0.02)
          gain.gain.setValueAtTime(volume * 0.22, t + 0.2)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26)
          osc.connect(filter); filter.connect(gain); gain.connect(this.masterGain)
          osc.start(t); osc.stop(t + 0.3)
        })
        break
      }

      case 'pin': {
        // Push-pin into cork — dull thock
        const src = this.ctx.createBufferSource()
        src.buffer = makeNoiseBuffer(this.ctx, 0.08)
        const filter = this.ctx.createBiquadFilter()
        filter.type = 'lowpass'; filter.frequency.value = 900
        const gain = this.ctx.createGain()
        gain.gain.setValueAtTime(volume * 0.5, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
        src.connect(filter); filter.connect(gain); gain.connect(this.masterGain)
        src.start(now)
        const thud = this.ctx.createOscillator()
        const tg = this.ctx.createGain()
        thud.type = 'sine'
        thud.frequency.setValueAtTime(180, now)
        thud.frequency.exponentialRampToValueAtTime(70, now + 0.1)
        tg.gain.setValueAtTime(volume * 0.35, now)
        tg.gain.exponentialRampToValueAtTime(0.001, now + 0.14)
        thud.connect(tg); tg.connect(this.masterGain)
        thud.start(now); thud.stop(now + 0.16)
        break
      }

      case 'deduction': {
        // Two strokes of a pencil under a line, and the board taking it.
        noiseBurst(this.ctx, this.masterGain, { at: now, dur: 0.13, freq: 2100, q: 0.9, gain: volume * 0.2, attack: 0.012 })
        noiseBurst(this.ctx, this.masterGain, { at: now + 0.17, dur: 0.15, freq: 1750, q: 0.9, gain: volume * 0.18, attack: 0.012 })
        bodyThud(this.ctx, this.masterGain, { at: now + 0.3, from: 140, to: 52, dur: 0.34, gain: volume * 0.26 })
        const room = this.ctx.createGain()
        room.gain.value = volume * 0.4
        room.connect(this.reverbNode)
        bodyThud(this.ctx, room, { at: now + 0.3, from: 140, to: 52, dur: 0.34, gain: volume * 0.2 })
        break
      }

      case 'tick': {
        // Clock penalty — two dry ticks
        ;[0, 0.14].forEach(offset => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'square'; osc.frequency.value = offset ? 1900 : 2400
          const t = now + offset
          gain.gain.setValueAtTime(volume * 0.08, t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03)
          osc.connect(gain); gain.connect(this.masterGain)
          osc.start(t); osc.stop(t + 0.04)
        })
        break
      }

      case 'stamp': {
        noiseBurst(this.ctx, this.masterGain, { at: now, dur: 0.07, freq: 1400, q: 0.6, gain: volume * 0.3 })
        bodyThud(this.ctx, this.masterGain, { at: now, from: 120, to: 40, dur: 0.3, gain: volume * 0.55 })
        const wet = this.ctx.createGain()
        wet.gain.value = volume * 0.4
        wet.connect(this.reverbNode)
        bodyThud(this.ctx, wet, { at: now, from: 120, to: 40, dur: 0.34, gain: volume * 0.3 })
        break
      }

      case 'heartbeat': {
        ;[0, 0.22].forEach((offset, i) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          osc.type = 'sine'
          const t = now + offset
          osc.frequency.setValueAtTime(i ? 55 : 62, t)
          osc.frequency.exponentialRampToValueAtTime(30, t + 0.18)
          gain.gain.setValueAtTime(volume * (i ? 0.4 : 0.55), t)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22)
          osc.connect(gain); gain.connect(this.masterGain)
          osc.start(t); osc.stop(t + 0.25)
        })
        break
      }

      case 'click': {
        // Minimal UI click — short sine blip
        const osc = this.ctx.createOscillator()
        const gain = this.ctx.createGain()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(900, now)
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.04)
        gain.gain.setValueAtTime(volume * 0.18, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.connect(gain); gain.connect(this.masterGain)
        osc.start(now); osc.stop(now + 0.06)
        break
      }

      default:
        break
    }
  }

  // ── AMBIENT MANAGEMENT ─────────────────────────────────────────────────

  // Four of the rooms have a produced bed on disk — filtered noise layers with
  // real movement, rendered by scripts/gen_ambience.py. The oscillator tracks
  // below are what the audio sub-score was measuring; they stay as the
  // fallback for anything that has no file, and for a failed fetch or decode.
  async loadBed(name) {
    if (this.bedBuffers.has(name)) return this.bedBuffers.get(name)
    if (this.bedPending.has(name)) return this.bedPending.get(name)
    const url = `${import.meta.env.BASE_URL}audio/amb-${name}.mp4`
    const job = (async () => {
      const res = await fetch(url)
      if (!res.ok) throw new Error(`${res.status} ${url}`)
      const buf = await this.ctx.decodeAudioData(await res.arrayBuffer())
      this.bedBuffers.set(name, buf)
      return buf
    })()
    this.bedPending.set(name, job)
    try {
      return await job
    } finally {
      this.bedPending.delete(name)
    }
  }

  startBed(name, buffer, volume) {
    // the track may have been switched away from while the file was decoding
    if (!this.ambientNodes.has(name)) return
    const slot = this.ambientNodes.get(name)
    if (slot.bedGain || slot.stopped) return
    const now = this.ctx.currentTime

    // The bed gets its own gain straight to master. The synth tracks run
    // through the convolver; a recorded room already has its own space, and
    // putting reverb on room tone just smears it.
    const bedGain = this.ctx.createGain()
    bedGain.gain.value = 0
    bedGain.connect(this.masterGain)

    const src = this.ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    src.connect(bedGain)
    src.start(0, Math.random() * buffer.duration)   // don't always open on the same second

    bedGain.gain.setTargetAtTime(volume * BED_LEVEL, now, 1.0)
    // and take the oscillator track out from under it
    slot.gain.gain.setTargetAtTime(0, now, 1.0)

    slot.sources = [...(slot.sources ?? []), src]
    slot.bedGain = bedGain
  }

  startAmbient(name, volume = 1) {
    if (this.ambientNodes.has(name)) return

    let nodes
    switch (name) {
      case 'drone':
      case 'menu':
        nodes = this.createMenuDrone(55)
        break
      case 'ending':
        nodes = this.createMenuDrone(52)  // Slightly lower root — resolution, not excitement
        break
      case 'rain':
      case 'story':
        nodes = this.createRain()
        break
      case 'apartment':
        nodes = this.createApartmentTone()
        break
      case 'investigation':
        nodes = this.createInvestigationDrone(false)
        break
      case 'convergence':
        nodes = this.createInvestigationDrone(true)
        break
      default:
        return
    }

    if (nodes) {
      // Slow fade in — 1.2s time constant for gentle entrance
      nodes.gain.gain.setTargetAtTime(volume * 0.15, this.ctx.currentTime, 1.2)
      this.ambientNodes.set(name, nodes)
      if (BED_TRACKS.has(name)) {
        this.loadBed(name)
          .then(buf => this.startBed(name, buf, volume))
          .catch(() => { /* no file, or decode failed — the synth track carries it */ })
      }
    }
  }

  // The music slider used to apply only to the next room tone you walked
  // into, so dragging it while one was playing appeared to do nothing.
  setAmbientVolume(volume) {
    if (!this.ctx) return
    this.scoreVolume = volume
    if (this.score) this.score.gain.gain.setTargetAtTime(this.scoreTarget(), this.ctx.currentTime, 0.25)
    for (const nodes of this.ambientNodes.values()) {
      // once a produced bed is playing it is the ambient layer, and the
      // oscillator track under it stays at zero
      if (nodes.bedGain) {
        nodes.bedGain.gain.setTargetAtTime(volume * BED_LEVEL, this.ctx.currentTime, 0.25)
      } else {
        nodes.gain?.gain.setTargetAtTime(volume * 0.15, this.ctx.currentTime, 0.25)
      }
    }
  }

  stopAmbient(name) {
    const nodes = this.ambientNodes.get(name)
    if (!nodes) return

    // Slow fade out, then kill oscillators
    nodes.stopped = true
    nodes.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.6)
    nodes.bedGain?.gain.setTargetAtTime(0, this.ctx.currentTime, 0.6)
    setTimeout(() => {
      // stop() throws if a node was never started or already stopped — safe to ignore
      const stopQuietly = (n) => { try { n.stop() } catch { /* already stopped */ } }
      nodes.oscillators?.forEach(stopQuietly)
      nodes.sources?.forEach(stopQuietly)
      this.ambientNodes.delete(name)
    }, 2500)
  }

  stopAllAmbient() {
    this.ambientNodes.forEach((_, name) => this.stopAmbient(name))
  }
}

// Rooms with a produced bed in public/audio. The beds sit a little louder than
// the oscillator tracks did: they are room tone rather than a drone, so they
// need to be audible to do anything at all.
// With a score on top, the room tone steps back to being a room.
const BED_LEVEL = 0.22
const SCORE_LEVEL = 0.62
// the written length of each cue, so the loop ignores the encoder's padding
const SCORE_LOOP_SECONDS = { theme: 80, apartment: 55.3846, investigation: 153.6, convergence: 75.7895, ending: 85.7143 }
const BED_TRACKS = new Set(['investigation', 'apartment', 'convergence', 'ending'])

// Recorded effects in public/audio/sfx, built by scripts/build_sfx.py
const SAMPLE_SFX = new Set([
  'click', 'pin', 'stamp', 'buzz', 'notification', 'discovery', 'nodeComplete', 'pageTurn',
  'error', 'deduction', 'tick', 'heartbeat', 'typewriterKey', 'typewriterKey2', 'pickup', 'hangup', 'ringback',
])
const SAMPLE_DRIFT = new Set(['click', 'pin', 'typewriterKey', 'typewriterKey2', 'pageTurn', 'notification'])
// how much of each goes to the shared room reverb
const SAMPLE_ROOM = { stamp: 0.25, deduction: 0.2, discovery: 0.15, heartbeat: 0.1 }

// Single shared engine instance
const audioEngine = new AudioEngine()

export function useAudio() {
  const { masterVolume, musicVolume, sfxVolume, muted } = useAudioStore()
  const engineRef = useRef(audioEngine)

  // Initialize engine on first user interaction (browser autoplay policy)
  const initAudio = useCallback(() => {
    engineRef.current.init()
    engineRef.current.resume()
  }, [])

  // Sync master volume / mute state to engine
  useEffect(() => {
    engineRef.current.setMasterVolume(masterVolume, muted)
  }, [masterVolume, muted])

  // and the music slider applies to whatever is already playing
  useEffect(() => {
    engineRef.current.setAmbientVolume(musicVolume)
  }, [musicVolume])

  const playAmbient = useCallback((track) => {
    engineRef.current.init()
    engineRef.current.startAmbient(track, musicVolume)
  }, [musicVolume])

  const stopAmbient = useCallback((track) => {
    if (track) {
      engineRef.current.stopAmbient(track)
    } else {
      engineRef.current.stopAllAmbient()
    }
  }, [])

  const playScore = useCallback((cue) => {
    engineRef.current.init()
    engineRef.current.playScore(cue, musicVolume)
  }, [musicVolume])

  const duckScore = useCallback((on) => engineRef.current.duckScore(on), [])

  const playSFX = useCallback((name) => {
    if (muted) return
    engineRef.current.init()
    engineRef.current.playSFX(name, sfxVolume)
  }, [sfxVolume, muted])

  return { initAudio, playAmbient, stopAmbient, playSFX, playScore, duckScore }
}
