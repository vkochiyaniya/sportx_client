import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config() // Load environment variables

export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env': import.meta.env
  }
})