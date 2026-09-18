import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/osint-game-v2/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    rollupOptions: {
      output: {
        // The whole game used to ship as one 518 kB chunk, so the title
        // screen paid for the case board, the endings and every lead.
        // React is split out because it never changes between deploys, and
        // the lead renderers + case data are split because nothing before
        // the apartment needs them.
        manualChunks: {
          react: ['react', 'react-dom', 'react-dom/client', 'react/jsx-runtime'],
          state: ['zustand', 'zustand/middleware', 'zustand/react/shallow'],
        },
      },
    },
  },
  resolve: {
    // Deduplicate three.js — postprocessing would otherwise bundle a second copy
    dedupe: ['three'],
  },
})
