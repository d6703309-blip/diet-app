import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// This line fixes the "process is not defined" error during Vercel build
declare const process: any;

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  }
})
