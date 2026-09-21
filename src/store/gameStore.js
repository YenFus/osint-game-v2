import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  DEDUCTIONS, RAY_BEATS, WRONG_THEORY_COST, HINT_COST, SUSPICION_STEPS,
  wrongCost, pinComplete, pinCorrect, NAME_CLUES,
} from '../data/caseData'

// Ray's unease is clamped 0–100. Crossing a step makes him leave earlier;
// the step's text is returned so the caller can surface it.
function shiftSuspicion(current, delta) {
  const next = Math.max(0, Math.min(100, current + delta))
  const crossed = SUSPICION_STEPS.filter(s => current < s.at && next >= s.at)
  return { next, crossed }
}

const freshPaths = () => ({
  A: { started: false, completed: false, unlockedNodes: ['A1'], completedNodes: [] },
  B: { started: false, completed: false, unlockedNodes: ['B1'], completedNodes: [] },
  C: { started: false, completed: false, unlockedNodes: ['C1'], completedNodes: [] },
})

// Everything that makes up one playthrough. Used by reset, save and load.
const freshRun = () => ({
  phase: 'story',
  prevPhase: 'menu',
  paths: freshPaths(),
  perfectPaths: { A: true, B: true, C: true },
  hintsUsed: 0,
  wrongGuesses: 0,
  activePath: null,
  currentNodeId: null,
  endingChoice: null,
  evidenceScore: 0,
  journalistUnlocked: false,
  systemAlertShown: false,
  caseSummaries: { A: [], B: [], C: [] },
  // Time pressure — in-game minutes since Thomas walked into the apartment
  clock: 0,
  lastTimeDelta: null,
  // Ray
  raySuspicion: 0,
  rayLog: [],
  rayBeatPending: null,
  // Case board
  clues: [],
  lastClue: null,
  // notes the player hasn't looked at in the drawer yet
  unreadClues: [],
  theory: {},       // tentative pins { dedId: clueId }
  deductions: {},   // confirmed pins
  theoryTests: 0,
  finalCase: { suspect: null, slots: {} },
  seenBoardTutorial: false,
  rayGoneSeen: false,
  // the moment a record first puts a surname to the handle
  nameRevealSeen: false,
  namePending: false,
  // Half-finished work inside leads: { [nodeId]: { tagged: [...], ... } }
  nodeProgress: {},
})

const RUN_KEYS = Object.keys(freshRun())

export const useGameStore = create(
  persist(
    (set, get) => ({
      ...freshRun(),
      phase: 'menu',
      notifications: [],
      saveSlots: [null, null, null],
      lastSaved: null,

      setPhase: (phase) => set((state) => ({ phase, prevPhase: state.phase })),
      goBack: () => set((state) => ({ phase: state.prevPhase || 'menu' })),
      // Stepping out to the menu used to strand a run: Continue only appeared
      // if you had written an explicit slot save, so a whole night's work was
      // reachable only by the browser's back button. The live state is
      // persisted anyway — this is what resumes it.
      resumeGame: () => set((state) => {
        const playable = ['story', 'apartment', 'investigation', 'convergence', 'ending']
        const to = playable.includes(state.prevPhase) ? state.prevPhase
          : Object.values(state.paths ?? {}).some(p => p?.started) ? 'investigation' : 'apartment'
        return { phase: to, prevPhase: 'menu' }
      }),

      // Enter the case board, optionally focused on one thread
      beginInvestigation: (pathKey) => set((state) => ({
        phase: 'investigation',
        prevPhase: state.phase,
        activePath: pathKey ?? state.activePath,
        currentNodeId: null,
        paths: pathKey
          ? { ...state.paths, [pathKey]: { ...state.paths[pathKey], started: true } }
          : state.paths,
      })),

      openNode: (pathKey, nodeId) => set((state) => ({
        activePath: pathKey,
        currentNodeId: nodeId,
        paths: { ...state.paths, [pathKey]: { ...state.paths[pathKey], started: true } },
      })),
      closeNode: () => set({ currentNodeId: null }),

      setLeadProgress: (nodeId, key, value) => set((state) => ({
        nodeProgress: {
          ...state.nodeProgress,
          [nodeId]: { ...state.nodeProgress[nodeId], [key]: value },
        },
      })),

      completeNode: (pathKey, nodeId, unlocks = []) => set((state) => {
        const path = state.paths[pathKey]
        if (path.completedNodes.includes(nodeId)) return state
        const newUnlocked = unlocks.filter(id =>
          !path.unlockedNodes.includes(id) && !path.completedNodes.includes(id)
        )
        return {
          paths: {
            ...state.paths,
            [pathKey]: {
              ...path,
              completedNodes: [...path.completedNodes, nodeId],
              unlockedNodes: [...path.unlockedNodes, ...newUnlocked],
            },
          },
        }
      }),

      // ── Time ─────────────────────────────────────────────────────
      addTime: (minutes, reason = null) => set((state) => ({
        clock: state.clock + minutes,
        lastTimeDelta: { amount: minutes, reason, at: Date.now() },
      })),

      // Wrong flags cost 15 minutes the first time, 30 every time after.
      // A flat cost made clicking every item cheaper than reading them.
      markWrongGuess: (pathKey, nth = 1) => set((state) => {
        const cost = wrongCost(nth)
        return {
          wrongGuesses: state.wrongGuesses + 1,
          perfectPaths: pathKey ? { ...state.perfectPaths, [pathKey]: false } : state.perfectPaths,
          clock: state.clock + cost,
          lastTimeDelta: { amount: cost, reason: 'wrong', at: Date.now() },
        }
      }),

      buyHint: (pathKey) => set((state) => ({
        hintsUsed: state.hintsUsed + 1,
        perfectPaths: pathKey ? { ...state.perfectPaths, [pathKey]: false } : state.perfectPaths,
        clock: state.clock + HINT_COST,
        lastTimeDelta: { amount: HINT_COST, reason: 'hint', at: Date.now() },
      })),

      // ── Clues & deductions ───────────────────────────────────────
      addClue: (clueId) => set((state) => {
        if (!clueId || state.clues.includes(clueId)) return state
        return {
          clues: [...state.clues, clueId],
          lastClue: { id: clueId, at: Date.now() },
          unreadClues: [...(state.unreadClues ?? []), clueId],
          // the surname stops the game wherever it is found, not only in the
          // records viewer that happened to implement it first
          namePending: state.nameRevealSeen ? false : (NAME_CLUES.includes(clueId) || state.namePending),
        }
      }),

      readClue: (clueId) => set((state) => ({
        unreadClues: (state.unreadClues ?? []).filter(id => id !== clueId),
      })),

      // Tentative pin — no feedback. clueId null clears the slot.
      // Paired questions hold two pins; pinning a third pushes the oldest out.
      pinTheory: (dedId, clueId) => set((state) => {
        if (state.deductions[dedId]) return state
        const ded = Object.values(DEDUCTIONS).flat().find(d => d.id === dedId)
        if (!ded) return state
        const theory = { ...state.theory }
        if (!clueId) { delete theory[dedId]; return { theory } }

        if (ded.pairAnswer) {
          const current = Array.isArray(theory[dedId]) ? theory[dedId] : theory[dedId] ? [theory[dedId]] : []
          const next = current.includes(clueId)
            ? current.filter(c => c !== clueId)
            : [...current, clueId].slice(-2)
          if (next.length) theory[dedId] = next
          else delete theory[dedId]
        } else {
          theory[dedId] = clueId
        }
        return { theory }
      }),

      // Test all three pins of a thread at once. Only the count is revealed.
      // Returns { ok, correct, total }
      testTheory: (pathKey) => {
        const state = get()
        const deds = DEDUCTIONS[pathKey]
        const pinned = deds.filter(d => pinComplete(d, state.theory[d.id]))
        if (pinned.length < deds.length) return { ok: false, correct: 0, total: deds.length, incomplete: true }
        const correct = deds.filter(d => pinCorrect(d, state.theory[d.id])).length
        if (correct < deds.length) {
          set({
            theoryTests: state.theoryTests + 1,
            wrongGuesses: state.wrongGuesses + 1,
            clock: state.clock + WRONG_THEORY_COST,
            lastTimeDelta: { amount: WRONG_THEORY_COST, reason: 'theory', at: Date.now() },
          })
          return { ok: false, correct, total: deds.length }
        }
        const deductions = { ...state.deductions }
        deds.forEach(d => { deductions[d.id] = state.theory[d.id] })
        const paths = { ...state.paths, [pathKey]: { ...state.paths[pathKey], completed: true } }
        set({
          deductions, paths, theoryTests: state.theoryTests + 1,
          evidenceScore: Object.values(paths).filter(p => p.completed).length,
        })
        return { ok: true, correct, total: deds.length }
      },

      setFinalSuspect: (suspect) => set((state) => ({
        finalCase: { ...state.finalCase, suspect },
      })),
      setFinalSlot: (slotId, clueId) => set((state) => {
        // A clue can only sit in one slot at a time
        const slots = Object.fromEntries(
          Object.entries(state.finalCase.slots).filter(([, v]) => v !== clueId)
        )
        if (clueId) slots[slotId] = clueId
        else delete slots[slotId]
        return { finalCase: { ...state.finalCase, slots } }
      }),

      // ── Ray ──────────────────────────────────────────────────────
      addSuspicion: (amount) => {
        const { next, crossed } = shiftSuspicion(get().raySuspicion, amount)
        set({ raySuspicion: next })
        crossed.forEach((s, i) => setTimeout(() => get().addNotification(s.text, 'warning'), 1200 + i * 1500))
      },

      // Called after a lead completes — queues the next message if due
      checkRayBeat: () => {
        const state = get()
        if (state.rayBeatPending) return
        const done = Object.values(state.paths).reduce((n, p) => n + p.completedNodes.length, 0)
        // Sort by threshold, not declaration order: Ray has to escalate in
        // sequence. A beat whose `after` was lowered below the one before it
        // used to fire first, so he threatened to come over and then went
        // back to asking polite questions.
        const next = [...RAY_BEATS]
          .sort((a, b) => a.after - b.after)
          .find(b => done >= b.after && !state.rayLog.some(l => l.id === b.id))
        if (next) set({ rayBeatPending: next.id })
      },

      answerRayBeat: (beatId, optionIndex) => {
        const state = get()
        const beat = RAY_BEATS.find(b => b.id === beatId)
        const option = beat?.options[optionIndex]
        if (!option) { set({ rayBeatPending: null }); return }
        const { next, crossed } = shiftSuspicion(state.raySuspicion, option.suspicion)
        set({
          rayBeatPending: null,
          rayLog: [...state.rayLog, { id: beatId, choice: optionIndex }],
          raySuspicion: next,
        })
        crossed.forEach((s, i) => setTimeout(() => get().addNotification(s.text, 'warning'), 1200 + i * 1500))
      },

      // ── Journal ──────────────────────────────────────────────────
      addCaseSummary: (pathKey, summary) => set((state) => {
        if (state.caseSummaries[pathKey].some(s => s.id === summary.id)) return state
        return {
          caseSummaries: {
            ...state.caseSummaries,
            [pathKey]: [...state.caseSummaries[pathKey], summary],
          },
        }
      }),

      addNotification: (msg, type = 'info') => {
        const id = Date.now() + Math.random()
        set((state) => ({ notifications: [...state.notifications, { id, msg, type }] }))
        setTimeout(() => {
          set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) }))
        }, 5000)
      },

      getCompletedPathCount: () => Object.values(get().paths).filter(p => p.completed).length,

      unlockJournalist: () => set({ journalistUnlocked: true }),
      setEndingChoice: (choice) => set({ endingChoice: choice }),
      markSystemAlert: () => set({ systemAlertShown: true }),
      markBoardTutorialSeen: () => set({ seenBoardTutorial: true }),
      markRayGoneSeen: () => set({ rayGoneSeen: true }),
      markNameRevealSeen: () => set({ nameRevealSeen: true, namePending: false }),
      flagNameSeen: () => set((st) => (st.nameRevealSeen ? {} : { namePending: true })),

      isPerfectInvestigation: () => {
        const { perfectPaths, paths } = get()
        return Object.keys(paths).every(key => !paths[key].completed || perfectPaths[key])
      },

      // ── Save / load ──────────────────────────────────────────────
      saveGame: (slotIndex) => {
        const state = get()
        const saveData = Object.fromEntries(RUN_KEYS.map(k => [k, state[k]]))
        saveData.currentNodeId = null
        saveData.savedAt = Date.now()
        const newSlots = [...state.saveSlots]
        newSlots[slotIndex] = saveData
        set({ saveSlots: newSlots, lastSaved: Date.now() })
      },

      loadGame: (slotIndex) => {
        const saveData = get().saveSlots[slotIndex]
        if (!saveData) return false
        const base = freshRun()
        // Older saves predate most of these fields — fall back to fresh values
        const restored = Object.fromEntries(RUN_KEYS.map(k => [k, saveData[k] ?? base[k]]))
        if (!saveData.clues) restored.phase = saveData.phase === 'story' ? 'story' : 'apartment'
        set({ ...restored, currentNodeId: null })
        return true
      },

      deleteSave: (slotIndex) => {
        const newSlots = [...get().saveSlots]
        newSlots[slotIndex] = null
        set({ saveSlots: newSlots })
      },

      getMostRecentSave: () => {
        let mostRecentIndex = -1
        let mostRecentTime = 0
        get().saveSlots.forEach((slot, i) => {
          if (slot && slot.savedAt > mostRecentTime) {
            mostRecentTime = slot.savedAt
            mostRecentIndex = i
          }
        })
        return mostRecentIndex
      },

      continueGame: () => {
        const i = get().getMostRecentSave()
        return i >= 0 ? get().loadGame(i) : false
      },

      hasSavedGame: () => get().saveSlots.some(slot => slot !== null),

      resetGame: () => set({ ...freshRun() }),
    }),
    {
      name: 'maya-game-v3-storage',
      partialize: (state) => ({
        saveSlots: state.saveSlots,
        lastSaved: state.lastSaved,
        ...Object.fromEntries(RUN_KEYS.map(k => [k, state[k]])),
        currentNodeId: null,
        rayBeatPending: state.rayBeatPending,
      }),
    }
  )
)
