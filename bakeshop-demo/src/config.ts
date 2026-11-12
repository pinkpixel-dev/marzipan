import {
  tinyHighlightPlugin,
  mermaidPlugin,
  tableGridPlugin,
  tablePlugin,
  imageManagerPlugin,
  imagePickerPlugin,
} from '@pinkpixel/marzipan'
import type { MarzipanOptions, MarzipanPlugin } from '@pinkpixel/marzipan'
import { THEMES } from './themes'

export type PluginId = 'highlight' | 'mermaid' | 'tableGrid' | 'table' | 'imageManager' | 'imagePicker'

export interface PluginInfo {
  id: PluginId
  label: string
  /** The factory call as it appears in the generated code */
  call: string
  /** Companion stylesheet export, if the plugin has one */
  styles?: 'tinyHighlightStyles' | 'tableGridStyles' | 'imageManagerStyles'
  make: () => MarzipanPlugin
}

export const PLUGINS: PluginInfo[] = [
  { id: 'highlight', label: 'Syntax highlighting', call: 'tinyHighlightPlugin()', styles: 'tinyHighlightStyles', make: () => tinyHighlightPlugin() },
  { id: 'mermaid', label: 'Mermaid diagrams', call: 'mermaidPlugin()', make: () => mermaidPlugin() },
  { id: 'tableGrid', label: 'Table grid', call: 'tableGridPlugin()', styles: 'tableGridStyles', make: () => tableGridPlugin() },
  { id: 'table', label: 'Table form', call: 'tablePlugin()', make: () => tablePlugin() },
  { id: 'imageManager', label: 'Image manager', call: 'imageManagerPlugin()', styles: 'imageManagerStyles', make: () => imageManagerPlugin() },
  { id: 'imagePicker', label: 'Image picker', call: 'imagePickerPlugin()', make: () => imagePickerPlugin() },
]

export interface DemoConfig {
  themeId: string
  toolbar: boolean
  showStats: boolean
  smartLists: boolean
  showActiveLineRaw: boolean
  fontSize: number
  plugins: Record<PluginId, boolean>
}

export const DEFAULT_CONFIG: DemoConfig = {
  themeId: 'cave',
  toolbar: true,
  showStats: true,
  smartLists: true,
  showActiveLineRaw: false,
  fontSize: 15,
  plugins: {
    highlight: true,
    mermaid: true,
    tableGrid: true,
    table: false,
    imageManager: true,
    imagePicker: true,
  },
}

export const FONT_SIZES = [13, 14, 15, 16, 18]

export const EDITOR_FONT =
  '"Geist Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace'

export function themeFor(config: DemoConfig) {
  return THEMES.find(t => t.id === config.themeId) ?? THEMES[0]
}

/** Options for `new Marzipan()`, built from the inspector settings */
export function buildOptions(config: DemoConfig): MarzipanOptions {
  return {
    theme: themeFor(config).theme,
    toolbar: config.toolbar,
    showStats: config.showStats,
    smartLists: config.smartLists,
    showActiveLineRaw: config.showActiveLineRaw,
    fontSize: `${config.fontSize}px`,
    fontFamily: EDITOR_FONT,
    plugins: PLUGINS.filter(p => config.plugins[p.id]).map(p => p.make()),
  }
}

/** The setup code a user would write for the current settings */
export function buildCode(config: DemoConfig): string {
  const enabled = PLUGINS.filter(p => config.plugins[p.id])
  const theme = themeFor(config)
  const styles = enabled.flatMap(p => (p.styles ? [p.styles] : []))
  const imports = ['Marzipan', ...enabled.map(p => p.call.replace('()', '')), ...styles]

  const lines: string[] = []
  lines.push('import {', ...imports.map(name => `  ${name},`), "} from '@pinkpixel/marzipan'")
  if (typeof theme.theme !== 'string') {
    lines.push(`import { ${camel(theme.id)}Theme } from './themes' // your palette`)
  }
  lines.push('')

  if (styles.length) {
    lines.push('// Plugin stylesheets (inject once)')
    lines.push(`const css = document.createElement('style')`)
    lines.push(`css.textContent = [${styles.join(', ')}].join('\\n')`)
    lines.push('document.head.append(css)')
    lines.push('')
  }

  const opts: string[] = []
  opts.push(`  theme: ${typeof theme.theme === 'string' ? `'${theme.theme}'` : `${camel(theme.id)}Theme`},`)
  if (config.toolbar) opts.push('  toolbar: true,')
  if (config.showStats) opts.push('  showStats: true,')
  if (!config.smartLists) opts.push('  smartLists: false,')
  if (config.showActiveLineRaw) opts.push('  showActiveLineRaw: true,')
  if (config.fontSize !== 14) opts.push(`  fontSize: '${config.fontSize}px',`)
  if (enabled.length) {
    opts.push('  plugins: [')
    enabled.forEach(p => opts.push(`    ${p.call},`))
    opts.push('  ],')
  }

  lines.push(`const [editor] = new Marzipan('#editor', {`)
  lines.push(...opts)
  lines.push('})')
  return lines.join('\n')
}

function camel(id: string) {
  return id.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())
}
