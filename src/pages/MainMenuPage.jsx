import { useState, useMemo } from 'react'
import { useGameStore } from '../store/gameStore'
import OSINTGuide from '../components/OSINTGuide'
import { SaveLoadModal } from '../components/SaveLoadModal'
import { SettingsPanel } from '../components/SettingsPanel'

function getMenuItems(hasSaves) {
  const items = []

  if (hasSaves) {
    items.push({ id: 'continue', label: 'Continue', desc: 'Resume your investigation' })
  }

  items.push(
    { id: 'new',   label: 'New Game',    desc: 'Begin a new investigation' },
  )

  if (hasSaves) {
    items.push({ id: 'load', label: 'Load Game', desc: 'Choose a save slot' })
  }

  items.push(
    { id: 'guide', label: 'How to Play', desc: 'Learn OSINT basics before you start' },
    { id: 'settings', label: 'Settings', desc: 'Accessibility & performance options' },
    { id: 'about', label: 'About',       desc: 'Story & content warnings' },
  )

  return items
}

export default function MainMenuPage() {
  const { setPhase, saveSlots, loadGame, getMostRecentSave, resetGame } = useGameStore()
  const [selected, setSelected] = useState(0)
  const [showGuide, setShowGuide] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showLoadModal, setShowLoadModal] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showNewGameConfirm, setShowNewGameConfirm] = useState(false)

  const hasSaves = useMemo(() => saveSlots.some(s => s !== null), [saveSlots])
  const MENU_ITEMS = useMemo(() => getMenuItems(hasSaves), [hasSaves])

  const handleSelect = (id) => {
    if (id === 'continue') {
      const recentIndex = getMostRecentSave()
      if (recentIndex >= 0) {
        loadGame(recentIndex)
      }
    }
    if (id === 'new') {
      // Show confirmation if there are saves
      if (hasSaves) {
        setShowNewGameConfirm(true)
      } else {
        resetGame()
      }
    }
    if (id === 'load') setShowLoadModal(true)
    if (id === 'guide') setShowGuide(true)
    if (id === 'settings') setShowSettings(true)
    if (id === 'about') setShowAbout(true)
  }

  const confirmNewGame = () => {
    setShowNewGameConfirm(false)
    resetGame()
  }

  return (
    <div className="crt h-screen bg-[#08080e] flex flex-col overflow-hidden relative">

      {/* Atmospheric background noise */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Cfilter id='n'%3E%3CfeTurbulence baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='300' height='300' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse at 50% 40%, transparent 30%, rgba(0,0,0,0.85) 100%)' }}
      />

      {/* Content */}
      <div className="menu-content relative z-10 flex flex-col items-center justify-center h-full gap-0 px-4 md:px-8">

        {/* Case file stamp */}
        <div className="fade-in mb-4 md:mb-6" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="font-mono text-xs md:text-sm tracking-[0.2em] md:tracking-[0.3em] text-[#8a8078] uppercase text-center">
            Unofficial Investigation · Case No. 2026-0310
          </div>
        </div>

        {/* Title */}
        <div className="fade-in text-center mb-2" style={{ animationDelay: '0.5s', opacity: 0 }}>
          <h1
            className="menu-title font-black uppercase text-[#e8dcc8] leading-none tracking-tight flicker"
            style={{
              fontFamily: "'Barlow Condensed', sans-serif",
              fontSize: 'clamp(2.5rem, 10vw, 7rem)',
              textShadow: '0 0 40px rgba(192,57,43,0.15)',
            }}
          >
            WHAT MAYA KNEW
          </h1>
        </div>

        {/* Subtitle */}
        <div className="fade-in mb-12" style={{ animationDelay: '0.8s', opacity: 0 }}>
          <p className="font-mono text-sm text-[#a09888] tracking-[0.25em] uppercase text-center">
            An OSINT investigation game
          </p>
        </div>

        {/* Divider */}
        <div className="fade-in flex items-center gap-4 mb-10 w-64" style={{ animationDelay: '1s', opacity: 0 }}>
          <div className="flex-1 h-px bg-[#c0392b] opacity-30" />
          <div className="w-1 h-1 bg-[#c0392b] opacity-50 rotate-45" />
          <div className="flex-1 h-px bg-[#c0392b] opacity-30" />
        </div>

        {/* Menu */}
        <div className="fade-in flex flex-col gap-2 w-80" style={{ animationDelay: '1.1s', opacity: 0 }}>
          {MENU_ITEMS.map((item, i) => (
            <button
              key={item.id}
              onMouseEnter={() => setSelected(i)}
              onClick={() => handleSelect(item.id)}
              className={`
                group text-left px-6 py-4 border-2 transition-all duration-200 cursor-pointer
                ${selected === i
                  ? 'border-red-700 bg-red-950 bg-opacity-30'
                  : 'border-[#2a2a38] hover:border-[#4a4a58] bg-[#0c0c14] bg-opacity-50'
                }
              `}
            >
              <div className="flex items-center gap-4">
                <span className={`font-mono text-lg transition-colors ${selected === i ? 'text-red-500' : 'text-[#4a4a58]'}`}>
                  {selected === i ? '▶' : '○'}
                </span>
                <div>
                  <div className={`font-mono text-base tracking-wider uppercase transition-colors font-medium ${selected === i ? 'text-[#f0e8d8]' : 'text-[#a0a090]'}`}>
                    {item.label}
                  </div>
                  {selected === i && (
                    <div className="text-sm text-[#a09888] mt-1 slide-in" style={{ fontFamily: 'Crimson Pro, serif' }}>
                      {item.desc}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="fade-in mt-16 text-center" style={{ animationDelay: '1.4s', opacity: 0 }}>
          <p className="font-mono text-xs text-[#706868] tracking-wide uppercase">
            Contains themes of disappearance, manipulation & online harm
          </p>
        </div>
      </div>

      {/* OSINT Guide overlay */}
      {showGuide && (
        <OSINTGuide
          onClose={() => setShowGuide(false)}
          onStart={() => { setShowGuide(false); setPhase('story') }}
        />
      )}

      {/* About overlay */}
      {showAbout && (
        <div className="absolute inset-0 bg-[#08080e] bg-opacity-95 z-50 flex items-center justify-center p-8 fade-in">
          <div className="max-w-lg w-full border border-[#1e1e2a] bg-[#0c0c14] p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="font-mono text-xs text-red-800 tracking-widest uppercase">About</div>
              <button onClick={() => setShowAbout(false)} className="font-mono text-xs text-[#7a7068] hover:text-[#d5cdb8] cursor-pointer">✕</button>
            </div>
            <div className="space-y-4 text-[#9a9088] text-sm leading-relaxed">
              <p>
                <strong className="text-[#d5cdb8]">What Maya Knew</strong> is a noir investigation game about online safety, digital footprints, and what we unknowingly reveal about ourselves on the internet.
              </p>
              <p>
                You play as Thomas Reyes, a father searching for his missing daughter Maya — and uncovering the secret investigation she left behind.
              </p>
              <p className="font-mono text-[11px] text-[#5a4848] border-l-2 border-red-900 pl-3">
                Content warnings: Missing persons, stalking, online predators, emotional distress. This game is fictional but grounded in real OSINT techniques.
              </p>
              <p>
                All investigation tools in the game are <strong className="text-[#d5cdb8]">simulated</strong>. No real personal data is accessed or displayed.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Load game modal */}
      {showLoadModal && (
        <SaveLoadModal mode="load" onClose={() => setShowLoadModal(false)} />
      )}

      {/* Settings panel */}
      {showSettings && (
        <SettingsPanel onClose={() => setShowSettings(false)} />
      )}

      {/* New game confirmation */}
      {showNewGameConfirm && (
        <div className="absolute inset-0 bg-[#08080e] bg-opacity-95 z-50 flex items-center justify-center p-8 fade-in">
          <div className="max-w-sm w-full border border-[#c0392b] border-opacity-40 bg-[#0c0c14] p-8">
            <div className="font-mono text-xs text-red-800 tracking-widest uppercase mb-4">
              New Investigation
            </div>
            <p className="text-[#9a9088] text-sm leading-relaxed mb-6">
              This will start a new investigation. Your saved progress will remain in the save slots, but any unsaved progress will be lost.
            </p>
            <p className="text-[#7a7068] text-sm mb-6">
              Continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowNewGameConfirm(false)}
                className="flex-1 font-mono text-xs text-[#7a7068] border border-[#2a2a38] px-4 py-3 hover:border-[#4a4a58] hover:text-[#9a9088] transition-all cursor-pointer tracking-widest uppercase"
              >
                Cancel
              </button>
              <button
                onClick={confirmNewGame}
                className="flex-1 font-mono text-xs text-[#c0392b] border border-[#c0392b] px-4 py-3 hover:bg-[#c0392b] hover:text-white transition-all cursor-pointer tracking-widest uppercase"
              >
                Begin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
