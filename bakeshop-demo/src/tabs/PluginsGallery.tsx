import { useEffect, useRef } from 'react'
import { Marzipan, tinyHighlightPlugin, mermaidPlugin, tableGridPlugin, accentSwatchPlugin } from '@pinkpixel/marzipan'

const HIGHLIGHT_SAMPLE = `## 🎨 Syntax Highlighting

Powered by the **tinyHighlightPlugin** — zero dependencies, language-aware colorization.

\`\`\`typescript
import { Marzipan, tinyHighlightPlugin } from '@pinkpixel/marzipan';

const [editor] = new Marzipan('#editor', {
  toolbar: true,
  plugins: [tinyHighlightPlugin()],
});

// Get and set content
const value: string = editor.getValue();
editor.setValue('# Hello!');
\`\`\`

\`\`\`json
{
  "name": "marzipan",
  "version": "1.0.9",
  "description": "Pure TypeScript markdown editor",
  "keywords": ["markdown", "editor", "typescript"]
}
\`\`\`

\`\`\`css
.marzipan-container {
  border-radius: 0.75rem;
  background: var(--bg-primary);
  color: var(--text);
  font-size: 15px;
}
\`\`\``

const MERMAID_SAMPLE = `## 🔀 Mermaid Diagrams

The **mermaidPlugin** renders diagrams lazily — only when a \`mermaid\` code block is present.

\`\`\`mermaid
graph TD
    A[📝 Write Markdown] --> B{mermaid block?}
    B -->|Yes| C[🎨 Render Diagram]
    B -->|No| D[📄 Plain Preview]
    C --> E[✨ Beautiful Output]
    D --> E
\`\`\`

\`\`\`mermaid
sequenceDiagram
    participant U as User
    participant M as Marzipan
    participant P as Preview
    U->>M: Type markdown
    M->>P: Parse & render
    P-->>U: Live preview
\`\`\``

const TABLE_SAMPLE = `## ▦ Table Grid Plugin

Click the **▦** button in the toolbar to open a visual grid picker and insert a Markdown table.

| Feature | Status | Notes |
|---------|--------|-------|
| Grid picker | ✅ | Visual row/col selector |
| GFM output | ✅ | GitHub Flavored Markdown |
| Auto-focus | ✅ | Places cursor in first cell |

Try inserting a new table using the toolbar button above! 👆`

const ACCENT_SAMPLE = `## ⭘ Accent Swatch Plugin

The accent swatch toolbar button lets you pick and persist a custom accent color.

- Recent colors are saved to **localStorage**
- Supports the **EyeDropper API** (in compatible browsers)
- Broadcasts a \`marzipan:accent\` custom event

Try clicking the **⭘** button in the toolbar to choose an accent color!`

export default function PluginsGallery() {
  const highlightRef = useRef<HTMLDivElement>(null)
  const mermaidRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)
  const accentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const instances: Array<{ destroy?: () => void }> = []

    if (highlightRef.current) {
      const [inst] = new Marzipan(highlightRef.current, {
        value: HIGHLIGHT_SAMPLE,
        toolbar: true,
        theme: 'cave',
        minHeight: '380px',
        plugins: [tinyHighlightPlugin()],
      })
      instances.push(inst)
    }

    if (mermaidRef.current) {
      const [inst] = new Marzipan(mermaidRef.current, {
        value: MERMAID_SAMPLE,
        toolbar: true,
        theme: 'cave',
        minHeight: '380px',
        plugins: [mermaidPlugin({ theme: 'dark' })],
      })
      instances.push(inst)
    }

    if (tableRef.current) {
      const [inst] = new Marzipan(tableRef.current, {
        value: TABLE_SAMPLE,
        toolbar: true,
        theme: 'solar',
        minHeight: '300px',
        plugins: [tableGridPlugin({ maxRows: 8, maxColumns: 8 })],
      })
      instances.push(inst)
    }

    if (accentRef.current) {
      const [inst] = new Marzipan(accentRef.current, {
        value: ACCENT_SAMPLE,
        toolbar: true,
        theme: 'cave',
        minHeight: '260px',
        plugins: [accentSwatchPlugin({ defaults: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'] })],
      })
      instances.push(inst)
    }

    return () => {
      instances.forEach(inst => inst.destroy?.())
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          🧩 Plugins Gallery
        </h2>
        <p className="text-slate-300">
          Live demos of all available Marzipan plugins. Each editor below has a specific plugin enabled — try editing the content to see plugins in action!
        </p>
      </div>

      {/* Syntax Highlighting Plugin */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">✨</span>
          <div>
            <h3 className="text-xl font-bold text-emerald-300">Tiny Highlight Plugin</h3>
            <p className="text-slate-400 text-sm">Lightweight syntax highlighting — zero dependencies</p>
          </div>
          <code className="ml-auto text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded text-emerald-200 hidden md:block">
            tinyHighlightPlugin()
          </code>
        </div>
        <div ref={highlightRef} />
        <div className="mt-3 text-slate-400 text-sm">
          Supports: TypeScript, JavaScript, JSON, CSS, HTML, Bash, Markdown, INI
        </div>
      </div>

      {/* Mermaid Plugin */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🔀</span>
          <div>
            <h3 className="text-xl font-bold text-purple-300">Mermaid Plugin</h3>
            <p className="text-slate-400 text-sm">Render flowcharts, sequences, and more — lazy-loaded</p>
          </div>
          <code className="ml-auto text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded text-purple-200 hidden md:block">
            mermaidPlugin()
          </code>
        </div>
        <div ref={mermaidRef} />
        <div className="mt-3 text-slate-400 text-sm">
          Add a <code className="bg-slate-800 px-1 rounded">```mermaid</code> block and see it render live!
        </div>
      </div>

      {/* Table Grid Plugin */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">▦</span>
          <div>
            <h3 className="text-xl font-bold text-pink-300">Table Grid Plugin</h3>
            <p className="text-slate-400 text-sm">Visual grid picker for inserting GFM tables</p>
          </div>
          <code className="ml-auto text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded text-pink-200 hidden md:block">
            tableGridPlugin()
          </code>
        </div>
        <div ref={tableRef} />
        <div className="mt-3 text-slate-400 text-sm">
          Click the <strong>▦</strong> button in the toolbar to open the visual grid picker
        </div>
      </div>

      {/* Accent Swatch Plugin */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🎨</span>
          <div>
            <h3 className="text-xl font-bold text-amber-300">Accent Swatch Plugin</h3>
            <p className="text-slate-400 text-sm">Persistent color palette with EyeDropper support</p>
          </div>
          <code className="ml-auto text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded text-amber-200 hidden md:block">
            accentSwatchPlugin()
          </code>
        </div>
        <div ref={accentRef} />
      </div>

      {/* Block Handles info card */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-2xl">🔲</span>
          <div>
            <h3 className="text-xl font-bold text-blue-300">Block Handles (Built-in)</h3>
            <p className="text-slate-400 text-sm">Hover handles for selecting, copying, and deleting blocks</p>
          </div>
          <code className="ml-auto text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded text-blue-200 hidden md:block">
            blockHandles: true
          </code>
        </div>
        <p className="text-slate-300 mb-3">
          Block handles are a built-in feature enabled via the <code className="px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-200">blockHandles</code> option (not a plugin array entry).
          Hover over blocks in the <strong>Playground</strong> tab to see them in action!
        </p>
        <pre className="code-block">
{`new Marzipan('#editor', {
  blockHandles: true,   // simple enable
  // or with custom colors:
  blockHandles: {
    colors: {
      hover: 'rgba(236, 72, 153, 0.1)',
      selected: 'rgba(236, 72, 153, 0.2)',
      handle: 'rgba(236, 72, 153, 0.9)',
    }
  },
});`}
        </pre>
      </div>

      {/* Usage code */}
      <div className="card p-6 bg-gradient-to-r from-pink-500/10 via-fuchsia-500/5 to-amber-500/10">
        <h3 className="text-lg font-bold text-pink-200 mb-4">💡 Using Plugins</h3>
        <pre className="code-block">
{`import {
  Marzipan,
  tinyHighlightPlugin,
  mermaidPlugin,
  tableGridPlugin,
  accentSwatchPlugin,
} from '@pinkpixel/marzipan';

new Marzipan('#editor', {
  toolbar: true,
  blockHandles: true,
  plugins: [
    tinyHighlightPlugin(),
    mermaidPlugin({ theme: 'dark' }),
    tableGridPlugin({ maxRows: 8, maxColumns: 8 }),
    accentSwatchPlugin({ defaults: ['#ec4899', '#8b5cf6'] }),
  ],
});`}
        </pre>
      </div>
    </div>
  )
}
