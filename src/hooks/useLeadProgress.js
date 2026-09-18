import { useState, useCallback } from 'react'
import { useGameStore } from '../store/gameStore'

// Like useState, but persisted per lead in the game store, so stepping
// back to the board (or reloading) doesn't wipe half-finished work.
// Pass nodeId = null to keep it local (e.g. when reviewing a finished lead).
export function useLeadProgress(nodeId, key, initial) {
  const stored = useGameStore(s => (nodeId ? s.nodeProgress?.[nodeId]?.[key] : undefined))
  const setLeadProgress = useGameStore(s => s.setLeadProgress)
  const [init] = useState(initial) // pin the first value; callers pass fresh literals each render
  const [local, setLocal] = useState(init)
  const value = nodeId ? (stored ?? init) : local

  const set = useCallback((next) => {
    if (!nodeId) { setLocal(next); return }
    const current = useGameStore.getState().nodeProgress?.[nodeId]?.[key]
    setLeadProgress(nodeId, key, typeof next === 'function' ? next(current ?? init) : next)
  }, [nodeId, key, init, setLeadProgress])

  return [value, set]
}
