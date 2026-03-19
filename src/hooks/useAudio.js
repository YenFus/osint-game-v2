import { useRef, useCallback, useEffect } from 'react'
import { useAudioStore } from '../store/audioStore'

// Web Audio API-based sound synthesis for noir atmosphere
class AudioEngine {
  constructor() {
    this.ctx = null
    this.ambientNodes = new Map()
    this.initialized = false
  }

  init() {
    if (this.initialized) return
    this.ctx = new (window.AudioContext || window.webkitAudioContext)()
    this.masterGain = this.ctx.createGain()
    this.masterGain.connect(this.ctx.destination)
    this.initialized = true
  }

  resume() {
    if (this.ctx?.state === 'suspended') {
      this.ctx.resume()
    }
  }

  setMasterVolume(vol, muted) {
    if (!this.masterGain) return
    this.masterGain.gain.setTargetAtTime(muted ? 0 : vol, this.ctx.currentTime, 0.1)
  }

  // Generate dark synth drone
  createDrone(frequency = 55, detune = 5) {
    if (!this.ctx) return null
    const osc1 = this.ctx.createOscillator()
    const osc2 = this.ctx.createOscillator()
    const gain = this.ctx.createGain()
    const filter = this.ctx.createBiquadFilter()

    osc1.type = 'sine'
    osc1.frequency.value = frequency
    osc2.type = 'triangle'
    osc2.frequency.value = frequency * 1.5
    osc2.detune.value = detune

    filter.type = 'lowpass'
    filter.frequency.value = 200
    filter.Q.value = 1

    gain.gain.value = 0

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)

    osc1.start()
    osc2.start()

    return { oscillators: [osc1, osc2], gain, filter }
  }

  // Generate rain noise
  createRain() {
    if (!this.ctx) return null
    const bufferSize = 2 * this.ctx.sampleRate
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const output = noiseBuffer.getChannelData(0)

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1
    }

    const noise = this.ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true

    const filter = this.ctx.createBiquadFilter()
    filter.type = 'bandpass'
    filter.frequency.value = 1000
    filter.Q.value = 0.5

    const gain = this.ctx.createGain()
    gain.gain.value = 0

    noise.connect(filter)
    filter.connect(gain)
    gain.connect(this.masterGain)
    noise.start()

    return { source: noise, gain, filter }
  }

  // Play one-shot SFX
  playSFX(type, volume = 1) {
    if (!this.ctx) return

    const now = this.ctx.currentTime
    const osc = this.ctx.createOscillator()
    const gain = this.ctx.createGain()

    gain.connect(this.masterGain)
    osc.connect(gain)

    switch (type) {
      case 'click':
        osc.type = 'sine'
        osc.frequency.setValueAtTime(800, now)
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05)
        gain.gain.setValueAtTime(volume * 0.3, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
        osc.start(now)
        osc.stop(now + 0.05)
        break

      case 'notification':
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.setValueAtTime(554, now + 0.1)
        gain.gain.setValueAtTime(volume * 0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3)
        osc.start(now)
        osc.stop(now + 0.3)
        break

      case 'discovery':
        // Magical aha sound
        osc.type = 'sine'
        osc.frequency.setValueAtTime(440, now)
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.15)
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.3)
        gain.gain.setValueAtTime(0, now)
        gain.gain.linearRampToValueAtTime(volume * 0.3, now + 0.05)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5)
        osc.start(now)
        osc.stop(now + 0.5)
        break

      case 'typewriter':
        osc.type = 'square'
        osc.frequency.setValueAtTime(1200, now)
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.02)
        gain.gain.setValueAtTime(volume * 0.1, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03)
        osc.start(now)
        osc.stop(now + 0.03)
        break

      case 'error':
        osc.type = 'sawtooth'
        osc.frequency.setValueAtTime(200, now)
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.15)
        gain.gain.setValueAtTime(volume * 0.2, now)
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2)
        osc.start(now)
        osc.stop(now + 0.2)
        break

      default:
        osc.stop()
    }
  }

  startAmbient(name, volume = 1) {
    if (this.ambientNodes.has(name)) return

    let nodes
    if (name === 'drone' || name === 'menu' || name === 'investigation') {
      nodes = this.createDrone(name === 'investigation' ? 65 : 55)
    } else if (name === 'rain' || name === 'story') {
      nodes = this.createRain()
    } else if (name === 'apartment') {
      // Room tone - very low drone
      nodes = this.createDrone(40, 2)
    }

    if (nodes) {
      nodes.gain.gain.setTargetAtTime(volume * 0.15, this.ctx.currentTime, 0.5)
      this.ambientNodes.set(name, nodes)
    }
  }

  stopAmbient(name) {
    const nodes = this.ambientNodes.get(name)
    if (!nodes) return

    nodes.gain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.3)
    setTimeout(() => {
      if (nodes.oscillators) {
        nodes.oscillators.forEach(o => o.stop())
      }
      if (nodes.source) {
        nodes.source.stop()
      }
      this.ambientNodes.delete(name)
    }, 500)
  }

  stopAllAmbient() {
    this.ambientNodes.forEach((_, name) => this.stopAmbient(name))
  }
}

const audioEngine = new AudioEngine()

export function useAudio() {
  const { masterVolume, musicVolume, sfxVolume, muted } = useAudioStore()
  const engineRef = useRef(audioEngine)

  // Initialize on first user interaction
  const initAudio = useCallback(() => {
    engineRef.current.init()
    engineRef.current.resume()
  }, [])

  // Update master volume when settings change
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

  return {
    initAudio,
    playAmbient,
    stopAmbient,
    playSFX,
  }
}
