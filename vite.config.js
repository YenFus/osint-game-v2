import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/osint-game-v2/',
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    // Deduplicate three.js — postprocessing would otherwise bundle a second copy
    dedupe: ['three'],
  },
})
