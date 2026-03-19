import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAudioStore = create(
  persist(
    (set) => ({
      masterVolume: 0.7,
      musicVolume: 0.6,
      sfxVolume: 0.8,
      muted: false,

      setMasterVolume: (volume) => set({ masterVolume: Math.max(0, Math.min(1, volume)) }),
      setMusicVolume: (volume) => set({ musicVolume: Math.max(0, Math.min(1, volume)) }),
      setSfxVolume: (volume) => set({ sfxVolume: Math.max(0, Math.min(1, volume)) }),
      toggleMute: () => set((state) => ({ muted: !state.muted })),
      setMuted: (muted) => set({ muted }),
    }),
    {
      name: 'maya-audio-settings',
    }
  )
)
