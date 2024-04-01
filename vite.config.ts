import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

const srcPath: string = path.resolve(__dirname, 'src')

// https://vitejs.dev/config/
export default defineConfig({
  base: '/gilles-game/',
  resolve: {
    alias: {
      '@/': `${srcPath}/`
    }
  },
  plugins: [
    react(),
    tsConfigPaths()
  ]
})
