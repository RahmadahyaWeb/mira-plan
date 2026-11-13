import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

export default defineConfig({
  // relative asset paths so dist/ works from any folder (routing is hash-based)
  base: './',
  plugins: [react(), tailwindcss()],
})
