import { useEffect, useRef, useState } from 'react'
import { useModalFocus } from '../hooks/useModalFocus'
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

// Mobile-friendly save slots
function SaveSlot({ slot, index, mode, onSave, onLoad, onDelete }) {
  // Deleting a slot used to be a single click with nothing between it and a
  // wiped save. Arm it first; it disarms itself after five seconds.
  const [armed, setArmed] = useState(false)
  useEffect(() => {
    if (!armed) return undefined
    const t = setTimeout(() => setArmed(false), 5000)
    return () => clearTimeout(t)
  }, [armed])
  const isEmpty = !slot
  const canSave = mode === 'save' || mode === 'both'
  const isDisabled = !canSave && isEmpty

  const handleAction = () => {
    if (canSave) onSave(index)
    else if (!isEmpty) onLoad(index)
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
                        ? 'border-[#4a7a52] text-[#86c48e] bg-[#0d1a0f]'
                        : slot.paths[p]?.started
                        ? 'border-[#7a5a2a] text-[#d4a84b] bg-[#1a1408]'
                        : 'border-[#3a2c20] text-[#6a5a48]'
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
              ${isEmpty && !canSave
                ? 'border-[#2a2a38] text-[#4a4858] cursor-not-allowed'
                : 'border-[#5a4430] text-[#d8c49c] hover:bg-[#241a10] hover:border-[#8a6a44]'
              }
            `}
            aria-label={canSave ? `Save to slot ${index + 1}` : `Load from slot ${index + 1}`}
          >
            {canSave ? (isEmpty ? 'Save' : 'Overwrite') : 'Load'}
          </button>

          {/* Loading used to live on the main menu only — which is the screen
              you could not reach without risking the run you were playing. */}
          {mode === 'both' && !isEmpty && (
            <button
              onClick={() => onLoad(index)}
              className="font-mono text-sm tracking-[0.1em] uppercase py-3 px-4 border-2 border-[#3a5a8a] text-[#9ab8e0] hover:bg-[#101a2a] hover:border-[#5a7aaa] transition-all cursor-pointer rounded min-h-[48px]"
              aria-label={`Load the save in slot ${index + 1}`}
            >
              Load
            </button>
          )}

          {!isEmpty && (
            <button
              onClick={() => { if (armed) { setArmed(false); onDelete(index) } else setArmed(true) }}
              onBlur={() => setArmed(false)}
              className={`font-mono text-sm px-4 py-3 border-2 transition-all cursor-pointer rounded min-h-[48px] ${armed
                ? 'text-[#f0d8d4] border-[#b4584c] bg-[#3a1512]'
                : 'text-[#b4584c] border-[#5c2a24] hover:bg-[#241010] hover:border-[#8a3a30]'}`}
              aria-label={armed
                ? `Confirm deleting the save in slot ${index + 1}. This cannot be undone.`
                : `Delete save in slot ${index + 1}`}
            >
              {armed ? 'Confirm?' : 'Delete'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export function SaveLoadModal({ mode = 'save', onClose }) {
  const dialogRef = useRef(null)
  useModalFocus(dialogRef)
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

  // Mobile-friendly modal
  return (
    <div ref={dialogRef}
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
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[#3a2c20]">
          <h2
            id="save-load-title"
            className="font-mono text-base text-[#c96a54] tracking-[0.2em] uppercase font-medium"
          >
            {mode === 'load' ? 'Load Game' : mode === 'both' ? 'Save or Load' : 'Save Game'}
          </h2>
          <button
            ref={firstFocusRef}
            onClick={onClose}
            className="font-mono text-base text-[#b8a88a] hover:text-[#f0e0c0] cursor-pointer p-2 border border-[#3a2c20] hover:border-[#7a5a3a] min-w-[48px] min-h-[48px] flex items-center justify-center"
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
        <div className="px-4 sm:px-6 py-4 border-t border-[#3a2c20]">
          <p className="font-mono text-sm text-[#7d7b7b] text-center">
            {mode === 'load'
              ? 'Select a save slot to continue your investigation.'
              : 'Saves are stored in your browser. Clearing browser data will erase saves. Your current run is kept even without saving.'
            }
          </p>
        </div>
      </div>
    </div>
  )
}
