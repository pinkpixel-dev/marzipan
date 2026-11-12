import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'

const pluginFiles = fs.readdirSync('src/plugins').filter(f => f.endsWith('.ts'))
const pluginEntries = Object.fromEntries(
  pluginFiles.map(file => [
    `plugins/${file.replace('.ts', '')}`,
    path.resolve(__dirname, `src/plugins/${file}`)
  ])
)

export default defineConfig({
  build: {
    emptyOutDir: true, // Declarations are emitted by tsc after the bundle
    lib: {
      entry: {
        index: path.resolve(__dirname, 'src/index.ts'),
        ...pluginEntries
      },
      formats: ['es']
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
        preserveModules: false
      }
    },
    sourcemap: true,
    target: 'es2020'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})