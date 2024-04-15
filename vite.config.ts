import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

const srcPath: string = path.resolve(__dirname, 'src')
// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/gilles-game/' : '/',
  build: {
    target: 'esnext'
  },
  define: {
    'import.meta.env.VITE_VERSION': `"${process.env.npm_package_version}"`
  },
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
