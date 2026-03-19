import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useGameStore = create(
  persist(
    (set, get) => ({
  // phases: 'menu' | 'osint-guide' | 'story' | 'apartment' | 'investigation' | 'convergence' | 'ending'
  phase: 'menu',
  prevPhase: null,

  paths: {
    A: { started: false, completed: false, nodesFound: [], taggedClues: [] },
    B: { started: false, completed: false, nodesFound: [], taggedClues: [] },
    C: { started: false, completed: false, nodesFound: [], taggedClues: [] },
  },

  // Perfect investigation tracking (no wrong guesses)
  perfectPaths: { A: true, B: true, C: true },
  hintsUsed: 0,
  lastCompletedPath: null,

  evidence: [],
  activePath: null,
  endingChoice: null,
  notifications: [],

  // Investigation progress
  evidenceScore: 0,
  journalistUnlocked: false,
  systemAlertShown: false,
  seenOsintTips: [],
  nodeProgress: {},
  currentNodeId: null,
  currentNodeIndex: 0,  // Track position in current path

  // Case notes summaries - auto-updated after each node
  caseSummaries: {
    A: [],
    B: [],
    C: [],
  },

  setPhase: (phase) => set((state) => ({ phase, prevPhase: state.phase })),

  goBack: () => set((state) => ({ phase: state.prevPhase || 'menu' })),

  startPath: (pathKey) => set((state) => ({
    activePath: pathKey,
    currentNodeId: null,
    currentNodeIndex: 0,
    paths: {
      ...state.paths,
      [pathKey]: { ...state.paths[pathKey], started: true }
    }
  })),

  beginInvestigation: (pathKey) => set((state) => ({
    phase: 'investigation',
    prevPhase: state.phase,
    activePath: pathKey,
    currentNodeId: null,
    currentNodeIndex: state.paths[pathKey].started ? (state.nodeProgress[`${pathKey}_index`] ?? 0) : 0,
    paths: {
      ...state.paths,
      [pathKey]: { ...state.paths[pathKey], started: true }
    }
  })),

  // Save current node index when progressing
  setCurrentNodeIndex: (index) => {
    const { activePath } = get()
    set({
      currentNodeIndex: index,
      nodeProgress: {
        ...get().nodeProgress,
        [`${activePath}_index`]: index,
      }
    })
  },

  findNode: (pathKey, nodeId) => set((state) => {
    const path = state.paths[pathKey]
    if (path.nodesFound.includes(nodeId)) return state
    return {
      paths: {
        ...state.paths,
        [pathKey]: { ...path, nodesFound: [...path.nodesFound, nodeId] }
      }
    }
  }),

  tagClue: (pathKey, clueId) => set((state) => {
    const path = state.paths[pathKey]
    if (path.taggedClues.includes(clueId)) return state
    return {
      paths: {
        ...state.paths,
        [pathKey]: { ...path, taggedClues: [...path.taggedClues, clueId] }
      }
    }
  }),

  completePath: (pathKey) => set((state) => {
    const updatedPaths = {
      ...state.paths,
      [pathKey]: { ...state.paths[pathKey], completed: true }
    }
    const score = Object.values(updatedPaths).filter(p => p.completed).length
    return { paths: updatedPaths, evidenceScore: score, lastCompletedPath: pathKey }
  }),

  // Add evidence item
  addEvidence: (item) => set((state) => {
    if (state.evidence.find(e => e.id === item.id)) return state
    return { evidence: [...state.evidence, item] }
  }),

  // Add case summary for a path (called after completing each node)
  addCaseSummary: (pathKey, summary) => set((state) => ({
    caseSummaries: {
      ...state.caseSummaries,
      [pathKey]: [...state.caseSummaries[pathKey], summary]
    }
  })),

  addNotification: (msg, type = 'info') => {
    const id = Date.now()
    set((state) => ({ notifications: [...state.notifications, { id, msg, type }] }))
    setTimeout(() => {
      set((state) => ({ notifications: state.notifications.filter(n => n.id !== id) }))
    }, 5000)
  },

  getCompletedPathCount: () => {
    const { paths } = get()
    return Object.values(paths).filter(p => p.completed).length
  },

  setCurrentNodeIdOnly: (id) => set({ currentNodeId: id }),

  setNodeProgress: (nodeId, progress) => set((state) => ({
    nodeProgress: {
      ...state.nodeProgress,
      [nodeId]: { ...state.nodeProgress[nodeId], ...progress }
    }
  })),

  markNodeComplete: (nodeId) => set((state) => ({
    nodeProgress: {
      ...state.nodeProgress,
      [nodeId]: { ...state.nodeProgress[nodeId], complete: true }
    }
  })),

  unlockJournalist: () => set({ journalistUnlocked: true }),

  setEndingChoice: (choice) => set({ endingChoice: choice }),

  markSystemAlert: () => set({ systemAlertShown: true }),

  markOsintTipSeen: (tipId) => set((state) => ({
    seenOsintTips: state.seenOsintTips.includes(tipId)
      ? state.seenOsintTips
      : [...state.seenOsintTips, tipId]
  })),

  // Perfect investigation tracking
  markWrongGuess: (pathKey) => set((state) => ({
    perfectPaths: { ...state.perfectPaths, [pathKey]: false }
  })),

  incrementHintsUsed: () => set((state) => ({
    hintsUsed: state.hintsUsed + 1,
    perfectPaths: state.activePath
      ? { ...state.perfectPaths, [state.activePath]: false }
      : state.perfectPaths
  })),

  setLastCompletedPath: (pathKey) => set({ lastCompletedPath: pathKey }),

  clearLastCompletedPath: () => set({ lastCompletedPath: null }),

  isPerfectInvestigation: () => {
    const { perfectPaths, paths } = get()
    return Object.keys(paths).every(key =>
      !paths[key].completed || perfectPaths[key]
    )
  },

  // ─── SAVE/LOAD SYSTEM ────────────────────────────────────
  saveSlots: [null, null, null],
  lastSaved: null,

  saveGame: (slotIndex) => {
    const state = get()
    const saveData = {
      phase: state.phase,
      paths: state.paths,
      activePath: state.activePath,
      evidenceScore: state.evidenceScore,
      journalistUnlocked: state.journalistUnlocked,
      systemAlertShown: state.systemAlertShown,
      seenOsintTips: state.seenOsintTips,
      nodeProgress: state.nodeProgress,
      currentNodeId: state.currentNodeId,
      currentNodeIndex: state.currentNodeIndex,
      evidence: state.evidence,
      caseSummaries: state.caseSummaries,
      perfectPaths: state.perfectPaths,
      hintsUsed: state.hintsUsed,
      savedAt: Date.now(),
    }
    const newSlots = [...state.saveSlots]
    newSlots[slotIndex] = saveData
    set({ saveSlots: newSlots, lastSaved: Date.now() })
  },

  loadGame: (slotIndex) => {
    const { saveSlots } = get()
    const saveData = saveSlots[slotIndex]
    if (!saveData) return false
    set({
      phase: saveData.phase,
      paths: saveData.paths,
      activePath: saveData.activePath,
      evidenceScore: saveData.evidenceScore,
      journalistUnlocked: saveData.journalistUnlocked,
      systemAlertShown: saveData.systemAlertShown,
      seenOsintTips: saveData.seenOsintTips,
      nodeProgress: saveData.nodeProgress,
      currentNodeId: saveData.currentNodeId,
      currentNodeIndex: saveData.currentNodeIndex ?? 0,
      evidence: saveData.evidence ?? [],
      caseSummaries: saveData.caseSummaries ?? { A: [], B: [], C: [] },
      perfectPaths: saveData.perfectPaths ?? { A: true, B: true, C: true },
      hintsUsed: saveData.hintsUsed ?? 0,
    })
    return true
  },

  deleteSave: (slotIndex) => {
    const newSlots = [...get().saveSlots]
    newSlots[slotIndex] = null
    set({ saveSlots: newSlots })
  },

  getMostRecentSave: () => {
    const { saveSlots } = get()
    let mostRecent = null
    let mostRecentIndex = -1
    saveSlots.forEach((slot, i) => {
      if (slot && (!mostRecent || slot.savedAt > mostRecent.savedAt)) {
        mostRecent = slot
        mostRecentIndex = i
      }
    })
    return mostRecentIndex
  },

  // Continue from most recent save
  continueGame: () => {
    const { saveSlots, loadGame } = get()
    let mostRecentIndex = -1
    let mostRecentTime = 0
    saveSlots.forEach((slot, i) => {
      if (slot && slot.savedAt > mostRecentTime) {
        mostRecentTime = slot.savedAt
        mostRecentIndex = i
      }
    })
    if (mostRecentIndex >= 0) {
      return loadGame(mostRecentIndex)
    }
    return false
  },

  // Check if there's a save to continue from
  hasSavedGame: () => {
    const { saveSlots } = get()
    return saveSlots.some(slot => slot !== null)
  },

  // Reset game state for new game
  resetGame: () => set({
    phase: 'story',
    prevPhase: 'menu',
    paths: {
      A: { started: false, completed: false, nodesFound: [], taggedClues: [] },
      B: { started: false, completed: false, nodesFound: [], taggedClues: [] },
      C: { started: false, completed: false, nodesFound: [], taggedClues: [] },
    },
    evidence: [],
    activePath: null,
    endingChoice: null,
    evidenceScore: 0,
    journalistUnlocked: false,
    systemAlertShown: false,
    seenOsintTips: [],
    nodeProgress: {},
    currentNodeId: null,
    currentNodeIndex: 0,
    perfectPaths: { A: true, B: true, C: true },
    hintsUsed: 0,
    lastCompletedPath: null,
    caseSummaries: { A: [], B: [], C: [] },
  }),
    }),
    {
      name: 'maya-game-storage',
      // Persist everything important for save/load
      partialize: (state) => ({
        saveSlots: state.saveSlots,
        lastSaved: state.lastSaved,
        // Also persist current game state so continue works after refresh
        phase: state.phase,
        paths: state.paths,
        activePath: state.activePath,
        evidenceScore: state.evidenceScore,
        journalistUnlocked: state.journalistUnlocked,
        systemAlertShown: state.systemAlertShown,
        seenOsintTips: state.seenOsintTips,
        nodeProgress: state.nodeProgress,
        currentNodeIndex: state.currentNodeIndex,
        evidence: state.evidence,
        caseSummaries: state.caseSummaries,
        perfectPaths: state.perfectPaths,
        hintsUsed: state.hintsUsed,
      }),
    }
  )
)
