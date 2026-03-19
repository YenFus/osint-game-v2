import { useEffect, useRef } from 'react'
import { useGameStore } from '../store/gameStore'

const PHASE_NAMES = {
  menu: 'Main Menu',
  'osint-guide': 'OSINT Guide',
  story: 'Prologue',
  apartment: 'Apartment',
  investigation: 'Investigation',
  convergence: 'Convergence',
  ending: 'Ending',
}

const PATH_NAMES = {
  A: 'Digital Trail',
  B: 'Private Notes',
  C: 'Public Record',
}

function formatDate(timestamp) {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now - date

  if (diff < 60000) return 'Just now'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// NEW FEATURE: Mobile-friendly save slots
function SaveSlot({ slot, index, mode, onSave, onLoad, onDelete }) {
  const isEmpty = !slot
  const isDisabled = mode === 'load' && isEmpty

  const handleAction = () => {
    if (mode === 'save') {
      onSave(index)
    } else if (!isEmpty) {
      onLoad(index)
    }
  }

  const completedPaths = slot ? Object.entries(slot.paths).filter(([, p]) => p.completed).map(([k]) => k) : []
  const inProgressPath = slot?.activePath

  return (
    <div
      className={`
        border-2 transition-all duration-200 rounded-lg
        ${isEmpty
          ? 'border-[#2a2a38] bg-[#08080c]'
          : 'border-[#3a3a4a] bg-[#0c0c14]'
        }
        ${isDisabled ? 'opacity-40' : ''}
      `}
    >
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="font-mono text-sm text-[#8a8888] tracking-[0.15em] uppercase">
            Slot {index + 1}
          </div>
          {slot && (
            <div className="font-mono text-xs text-[#6a6878]">
              {formatDate(slot.savedAt)}
            </div>
          )}
        </div>

        {isEmpty ? (
          <div className="text-[#5a5868] text-base italic py-4 text-center">
            Empty slot
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-[#d8d0c0] text-base font-medium">
              {PHASE_NAMES[slot.phase] || slot.phase}
              {inProgressPath && slot.phase === 'investigation' && (
                <span className="text-[#8a8a98] ml-2">
                  ({PATH_NAMES[inProgressPath]})
                </span>
              )}
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex gap-2">
                {['A', 'B', 'C'].map(p => (
                  <div
                    key={p}
                    className={`
                      w-8 h-8 flex items-center justify-center font-mono text-sm border
                      ${completedPaths.includes(p)
                        ? 'border-green-600 text-green-500 bg-green-950/30'
                        : slot.paths[p]?.started
                        ? 'border-amber-600 text-amber-500 bg-amber-950/30'
                        : 'border-[#3a3a48] text-[#5a5a68]'
                      }
                    `}
                  >
                    {p}
                  </div>
                ))}
              </div>
              <div className="font-mono text-sm text-[#7a7888]">
                Evidence: {slot.evidenceScore}/3
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-5">
          <button
            onClick={handleAction}
            disabled={isDisabled}
            className={`
              flex-1 font-mono text-sm tracking-[0.1em] uppercase py-3 px-4
              border-2 transition-all cursor-pointer rounded min-h-[48px]
              ${mode === 'save'
                ? 'border-blue-600 text-blue-400 hover:bg-blue-950/30'
                : isEmpty
                ? 'border-[#2a2a38] text-[#4a4858] cursor-not-allowed'
                : 'border-green-600 text-green-400 hover:bg-green-950/30'
              }
            `}
            aria-label={mode === 'save' ? `Save to slot ${index + 1}` : `Load from slot ${index + 1}`}
          >
            {mode === 'save' ? (isEmpty ? 'Save' : 'Overwrite') : 'Load'}
          </button>

          {!isEmpty && (
            <button
              onClick={() => onDelete(index)}
              className="font-mono text-sm text-red-500 border-2 border-red-700 px-4 py-3 hover:bg-red-950/30 transition-all cursor-pointer rounded min-h-[48px]"
              aria-label={`Delete save in slot ${index + 1}`}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function SaveLoadModal({ mode = 'save', onClose }) {
  const { saveSlots, saveGame, loadGame, deleteSave, addNotification } = useGameStore()
  const modalRef = useRef(null)
  const firstFocusRef = useRef(null)

  // Focus trap and escape key handling
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    firstFocusRef.current?.focus()

    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const handleSave = (index) => {
    saveGame(index)
    addNotification(`Game saved to slot ${index + 1}`, 'success')
    onClose()
  }

  const handleLoad = (index) => {
    const success = loadGame(index)
    if (success) {
      addNotification(`Game loaded from slot ${index + 1}`, 'success')
      onClose()
    }
  }

  const handleDelete = (index) => {
    deleteSave(index)
    addNotification(`Save slot ${index + 1} deleted`, 'info')
  }

  // NEW FEATURE: Mobile-friendly modal
  return (
    <div
      className="fixed inset-0 bg-[#08080e]/95 z-50 flex items-center justify-center p-2 sm:p-4 fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="save-load-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={modalRef}
        className="modal-content w-full max-w-lg border border-[#2a2a3a] bg-[#0a0a12] max-h-[90vh] overflow-y-auto rounded-lg sm:rounded-none"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#2a2a38]">
          <h2
            id="save-load-title"
            className="font-mono text-base text-red-500 tracking-[0.2em] uppercase font-medium"
          >
            {mode === 'save' ? 'Save Game' : 'Load Game'}
          </h2>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="font-mono text-base text-[#9a9898] hover:text-[#e8e0d8] cursor-pointer p-2 border border-[#3a3a48] hover:border-[#5a5a68] min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Close modal (press Escape)"
          >
            ✕
          </button>
        </div>

        {/* Slots */}
        <div className="p-4 sm:p-6 space-y-4">
          {saveSlots.map((slot, i) => (
            <SaveSlot
              key={i}
              slot={slot}
              index={i}
              mode={mode}
              onSave={handleSave}
              onLoad={handleLoad}
              onDelete={handleDelete}
            />
          ))}
        </div>

        {/* Footer hint */}
        <div className="px-4 sm:px-6 py-4 border-t border-[#2a2a38]">
          <p className="font-mono text-sm text-[#6a6868] text-center">
            {mode === 'save'
              ? 'Saves are stored in your browser. Clearing browser data will erase saves.'
              : 'Select a save slot to continue your investigation.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
