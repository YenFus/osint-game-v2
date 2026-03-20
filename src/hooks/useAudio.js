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

class AudioEngine {
  constructor() {
    this.ctx = null
    this.masterGain = null
    this.reverbNode = null
    this.compressor = null
    this.ambientNodes = new Map()
    this.initialized = false
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
        // Two-tone ascending chime — gentle, musical (C5 → E5)
        ;[523.25, 659.25].forEach((freq, i) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          const wet = this.ctx.createGain()
          osc.type = 'sine'; osc.frequency.value = freq
          const t = now + i * 0.13
          gain.gain.setValueAtTime(0, t)
          gain.gain.linearRampToValueAtTime(volume * 0.20, t + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45)
          wet.gain.value = volume * 0.35
          osc.connect(gain); gain.connect(this.masterGain)
          osc.connect(wet); wet.connect(this.reverbNode)
          osc.start(t); osc.stop(t + 0.55)
        })
        break
      }

      case 'discovery': {
        // Eureka: sub thump + rising arpeggio + high shimmer
        // Sub thump — physical impact
        const sub = this.ctx.createOscillator()
        const subGain = this.ctx.createGain()
        sub.type = 'sine'
        sub.frequency.setValueAtTime(90, now)
        sub.frequency.exponentialRampToValueAtTime(38, now + 0.25)
        subGain.gain.setValueAtTime(volume * 0.45, now)
        subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
        sub.connect(subGain); subGain.connect(this.masterGain)
        sub.start(now); sub.stop(now + 0.4)

        // Rising arpeggio (A4 → C#5 → E5 → A5)
        ;[440, 554, 659, 880].forEach((freq, i) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          const wet = this.ctx.createGain()
          osc.type = 'sine'; osc.frequency.value = freq
          const t = now + i * 0.09
          gain.gain.setValueAtTime(0, t)
          gain.gain.linearRampToValueAtTime(volume * 0.22, t + 0.02)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.5)
          wet.gain.value = volume * 0.45
          osc.connect(gain); gain.connect(this.masterGain)
          osc.connect(wet); wet.connect(this.reverbNode)
          osc.start(t); osc.stop(t + 0.6)
        })

        // Air shimmer — noise burst at top
        const shimSrc = this.ctx.createBufferSource()
        shimSrc.buffer = makeNoiseBuffer(this.ctx, 0.12)
        const shimFilter = this.ctx.createBiquadFilter()
        shimFilter.type = 'highpass'; shimFilter.frequency.value = 6000
        const shimGain = this.ctx.createGain()
        shimGain.gain.setValueAtTime(volume * 0.10, now + 0.08)
        shimGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28)
        shimSrc.connect(shimFilter); shimFilter.connect(shimGain); shimGain.connect(this.masterGain)
        shimSrc.start(now + 0.08)
        break
      }

      case 'nodeComplete': {
        // Soft two-note confirmation — G4 → B4 (gentle major third)
        ;[392, 494].forEach((freq, i) => {
          const osc = this.ctx.createOscillator()
          const gain = this.ctx.createGain()
          const wet = this.ctx.createGain()
          osc.type = 'sine'; osc.frequency.value = freq
          const t = now + i * 0.16
          gain.gain.setValueAtTime(0, t)
          gain.gain.linearRampToValueAtTime(volume * 0.16, t + 0.03)
          gain.gain.exponentialRampToValueAtTime(0.001, t + 0.55)
          wet.gain.value = volume * 0.38
          osc.connect(gain); gain.connect(this.masterGain)
          osc.connect(wet); wet.connect(this.reverbNode)
          osc.start(t); osc.stop(t + 0.65)
        })
        break
      }

      case 'error': {
        // Harsh descending buzz with distortion
        const osc = this.ctx.createOscillator()
        const distortion = this.ctx.createWaveShaper()
        const gain = this.ctx.createGain()
        // Waveshaper curve for soft clipping distortion
        const curve = new Float32Array(256)
        for (let i = 0; i < 256; i++) {
          const x = (i * 2) / 256 - 1
          curve[i] = (Math.PI + 80) * x / (Math.PI + 80 * Math.abs(x))
        }
        distortion.curve = curve
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(290, now)
        osc.frequency.exponentialRampToValueAtTime(105, now + 0.28)
        gain.gain.setValueAtTime(volume * 0.28, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35)
        osc.connect(distortion); distortion.connect(gain); gain.connect(this.masterGain)
        osc.start(now); osc.stop(now + 0.4)
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
    }
  }

  stopAmbient(name) {
    const nodes = this.ambientNodes.get(name)
    if (!nodes) return

    // Slow fade out, then kill oscillators
    nodes.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.6)
    setTimeout(() => {
      try {
        if (nodes.oscillators) nodes.oscillators.forEach(o => { try { o.stop() } catch (_) {} })
        if (nodes.sources) nodes.sources.forEach(s => { try { s.stop() } catch (_) {} })
      } catch (_) {}
      this.ambientNodes.delete(name)
    }, 2500)
  }

  stopAllAmbient() {
    this.ambientNodes.forEach((_, name) => this.stopAmbient(name))
  }
}

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

  const playSFX = useCallback((name) => {
    if (muted) return
    engineRef.current.init()
    engineRef.current.playSFX(name, sfxVolume)
  }, [sfxVolume, muted])

  return { initAudio, playAmbient, stopAmbient, playSFX }
}
