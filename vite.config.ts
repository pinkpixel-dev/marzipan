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
  // public/ holds the README logo; it isn't part of the package
  publicDir: false,
  build: {
    // Declarations are emitted by tsc into dist/ too, so watch mode (scripts/dev.mjs) must keep them
    emptyOutDir: process.env.MARZIPAN_WATCH !== '1',
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