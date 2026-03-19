import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAccessibilityStore = create(
  persist(
    (set, get) => ({
      // Settings
      reducedMotion: false,      // manual override (system preference detected separately)
      highContrast: false,
      fontSize: 'normal',        // 'normal' | 'large' | 'larger'
      screenReaderMode: false,
      graphicsQuality: 'auto',   // 'auto' | 'high' | 'low'

      // Actions
      setReducedMotion: (val) => set({ reducedMotion: val }),
      setHighContrast: (val) => set({ highContrast: val }),
      setFontSize: (size) => set({ fontSize: size }),
      setScreenReaderMode: (val) => set({ screenReaderMode: val }),
      setGraphicsQuality: (q) => set({ graphicsQuality: q }),

      // Computed: should reduce motion based on user setting OR system preference
      shouldReduceMotion: () => {
        const { reducedMotion } = get()
        if (reducedMotion) return true
        if (typeof window !== 'undefined') {
          return window.matchMedia('(prefers-reduced-motion: reduce)').matches
        }
        return false
      },

      // Computed: effective graphics quality
      getEffectiveGraphicsQuality: () => {
        const { graphicsQuality } = get()
        if (graphicsQuality !== 'auto') return graphicsQuality

        // Auto-detect based on hardware
        if (typeof navigator !== 'undefined') {
          const cores = navigator.hardwareConcurrency || 4
          if (cores <= 2) return 'low'
          if (cores <= 4) return 'low'
        }
        return 'high'
      },
    }),
    {
      name: 'maya-accessibility',
    }
  )
)
