import { useState, useEffect, useRef } from 'react'
import { useAccessibilityStore } from '../store/accessibilityStore'
import { useAudioStore } from '../store/audioStore'
import { resetTutorials } from './NodeTutorial'
import { OsintTipLibrary } from './OsintTipLibrary'

function VolumeSlider({ label, value, onChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="font-mono text-[10px] text-[#8a8a88] w-20">{label}</div>
      <input
        type="range"
        min="0"
        max="100"
        value={Math.round(value * 100)}
        onChange={(e) => onChange(parseInt(e.target.value) / 100)}
        className="flex-1 h-1 bg-[#2a2a38] appearance-none cursor-pointer"
        style={{
          background: `linear-gradient(to right, #c0392b 0%, #c0392b ${value * 100}%, #2a2a38 ${value * 100}%, #2a2a38 100%)`,
        }}
      />
      <div className="font-mono text-[9px] text-[#6a6868] w-8 text-right">
        {Math.round(value * 100)}%
      </div>
    </div>
  )
}

const FONT_SIZE_OPTIONS = [
  { value: 'normal', label: 'Normal' },
  { value: 'large', label: 'Large' },
  { value: 'larger', label: 'Larger' },
]

const GRAPHICS_OPTIONS = [
  { value: 'auto', label: 'Auto' },
  { value: 'high', label: 'High' },
  { value: 'low', label: 'Low' },
]

function Toggle({ label, checked, onChange, description }) {
  return (
    <label className="flex items-start gap-4 cursor-pointer group">
      <div className="relative mt-1">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <div
          className={`
            w-10 h-5 rounded-full transition-colors
            ${checked ? 'bg-red-900' : 'bg-[#2a2a38]'}
          `}
        >
          <div
            className={`
              absolute top-0.5 w-4 h-4 rounded-full bg-[#d5cdb8] transition-transform
              ${checked ? 'translate-x-5' : 'translate-x-0.5'}
            `}
          />
        </div>
      </div>
      <div className="flex-1">
        <div className="font-mono text-[11px] text-[#c8c0b0] tracking-wide group-hover:text-[#e8e0d0] transition-colors">
          {label}
        </div>
        {description && (
          <div className="font-mono text-[9px] text-[#6a6868] mt-1 leading-relaxed">
            {description}
          </div>
        )}
      </div>
    </label>
  )
}

function RadioGroup({ label, options, value, onChange }) {
  return (
    <div>
      <div className="font-mono text-[11px] text-[#c8c0b0] tracking-wide mb-2">
        {label}
      </div>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`
              font-mono text-[10px] px-3 py-1.5 border transition-all cursor-pointer
              ${value === opt.value
                ? 'border-red-800 text-red-500 bg-red-950/20'
                : 'border-[#2a2a38] text-[#6a6868] hover:border-[#3a3a48] hover:text-[#8a8888]'
              }
            `}
            aria-pressed={value === opt.value}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  )
}

export function SettingsPanel({ onClose }) {
  const {
    reducedMotion, setReducedMotion,
    highContrast, setHighContrast,
    fontSize, setFontSize,
    screenReaderMode, setScreenReaderMode,
    graphicsQuality, setGraphicsQuality,
  } = useAccessibilityStore()

  const {
    masterVolume, setMasterVolume,
    musicVolume, setMusicVolume,
    sfxVolume, setSfxVolume,
    muted, toggleMute,
  } = useAudioStore()

  const modalRef = useRef(null)
  const firstFocusRef = useRef(null)
  const [showTipLibrary, setShowTipLibrary] = useState(false)
  const [tutorialsReset, setTutorialsReset] = useState(false)

  const handleResetTutorials = () => {
    resetTutorials()
    setTutorialsReset(true)
    setTimeout(() => setTutorialsReset(false), 2000)
  }

  // Focus trap and escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKeyDown)
    firstFocusRef.current?.focus()
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  // Apply settings to document
  useEffect(() => {
    const root = document.documentElement

    // Reduced motion
    if (reducedMotion) {
      root.classList.add('reduced-motion')
    } else {
      root.classList.remove('reduced-motion')
    }

    // High contrast
    if (highContrast) {
      root.classList.add('high-contrast')
    } else {
      root.classList.remove('high-contrast')
    }

    // Font size
    root.classList.remove('font-large', 'font-larger')
    if (fontSize === 'large') root.classList.add('font-large')
    if (fontSize === 'larger') root.classList.add('font-larger')
  }, [reducedMotion, highContrast, fontSize])

  return (
    <div
      className="fixed inset-0 bg-[#08080e]/95 z-50 flex items-center justify-center p-4 fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settings-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md border border-[#1e1e2a] bg-[#0a0a12]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1a1a28]">
          <h2
            id="settings-title"
            className="font-mono text-xs text-red-800 tracking-[0.3em] uppercase"
          >
            Settings
          </h2>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="font-mono text-xs text-[#7a7068] hover:text-[#d5cdb8] cursor-pointer p-1"
            aria-label="Close settings"
          >
            Esc
          </button>
        </div>

        {/* Settings content */}
        <div className="p-6 space-y-6">
          {/* Accessibility Section */}
          <div>
            <div className="font-mono text-[9px] text-[#5a5858] tracking-[0.25em] uppercase mb-4">
              Accessibility
            </div>

            <div className="space-y-4">
              <Toggle
                label="Reduce Motion"
                checked={reducedMotion}
                onChange={setReducedMotion}
                description="Disable animations and visual effects"
              />

              <Toggle
                label="High Contrast"
                checked={highContrast}
                onChange={setHighContrast}
                description="Increase contrast for better visibility"
              />

              <Toggle
                label="Screen Reader Mode"
                checked={screenReaderMode}
                onChange={setScreenReaderMode}
                description="Optimize for screen readers with additional announcements"
              />

              <RadioGroup
                label="Font Size"
                options={FONT_SIZE_OPTIONS}
                value={fontSize}
                onChange={setFontSize}
              />
            </div>
          </div>

          {/* Audio Section */}
          <div>
            <div className="font-mono text-[9px] text-[#5a5858] tracking-[0.25em] uppercase mb-4">
              Audio
            </div>

            <div className="space-y-3">
              <Toggle
                label="Mute All Audio"
                checked={muted}
                onChange={toggleMute}
              />

              <VolumeSlider
                label="Master"
                value={masterVolume}
                onChange={setMasterVolume}
              />

              <VolumeSlider
                label="Music"
                value={musicVolume}
                onChange={setMusicVolume}
              />

              <VolumeSlider
                label="Sound FX"
                value={sfxVolume}
                onChange={setSfxVolume}
              />
            </div>
          </div>

          {/* Performance Section */}
          <div>
            <div className="font-mono text-[9px] text-[#5a5858] tracking-[0.25em] uppercase mb-4">
              Performance
            </div>

            <RadioGroup
              label="Graphics Quality"
              options={GRAPHICS_OPTIONS}
              value={graphicsQuality}
              onChange={setGraphicsQuality}
            />
            <p className="font-mono text-[9px] text-[#4a4848] mt-2">
              Lower quality improves performance on older devices
            </p>
          </div>

          {/* Game Section */}
          <div>
            <div className="font-mono text-[9px] text-[#5a5858] tracking-[0.25em] uppercase mb-4">
              Game
            </div>

            <div className="space-y-3">
              <button
                onClick={() => setShowTipLibrary(true)}
                className="w-full font-mono text-[10px] text-[#4a90d9] border border-[#2a4060] px-4 py-2 hover:bg-[#0a1020] transition-all cursor-pointer text-left flex items-center gap-3"
              >
                <span>📚</span>
                <span>OSINT Techniques Library</span>
              </button>

              <button
                onClick={handleResetTutorials}
                disabled={tutorialsReset}
                className="w-full font-mono text-[10px] text-[#7a7068] border border-[#2a2a38] px-4 py-2 hover:border-[#3a3a48] hover:text-[#9a9088] transition-all cursor-pointer text-left flex items-center gap-3 disabled:opacity-50"
              >
                <span>🔄</span>
                <span>{tutorialsReset ? 'Tutorials Reset!' : 'Reset Node Tutorials'}</span>
              </button>
              <p className="font-mono text-[9px] text-[#4a4848]">
                Show first-time tutorials again for each node type
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-[#1a1a28]">
          <p className="font-mono text-[9px] text-[#4a4848] text-center">
            Settings are saved automatically
          </p>
        </div>
      </div>

      {/* OSINT Tip Library Modal */}
      {showTipLibrary && (
        <OsintTipLibrary onClose={() => setShowTipLibrary(false)} />
      )}
    </div>
  )
}
