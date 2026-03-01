import { useEffect, useRef, useState } from 'react'
import { Marzipan, tinyHighlightPlugin, mermaidPlugin, tableGridPlugin } from '@pinkpixel/marzipan'
import type { MarzipanInstance } from '@pinkpixel/marzipan'

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

Click the **▦** button in the toolbar to open the visual grid picker.

Choose how many rows & columns, pick a column **alignment** (⬅ ⬌ ➡), and optionally pick a **header color** — then click a cell to insert.

<!-- mz-table: header=purple -->
| Feature        | Status | Notes                        |
| -------------- | ------ | ---------------------------- |
| Grid picker    | ✅     | Visual row/col selector      |
| GFM output     | ✅     | GitHub Flavored Markdown     |
| Alignment      | ✅     | Left, center, or right       |
| Header color   | ✅     | Pink, purple, blue, and more |

Try inserting a new table using the toolbar button above! 👆`

export default function PluginsGallery() {
  const highlightRef = useRef<HTMLDivElement>(null)
  const mermaidRef = useRef<HTMLDivElement>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const [highlightInst, setHighlightInst] = useState<MarzipanInstance | null>(null)
  const [mermaidInst, setMermaidInst] = useState<MarzipanInstance | null>(null)
  const [tableInst, setTableInst] = useState<MarzipanInstance | null>(null)

  const [hlPreview, setHlPreview] = useState(true)
  const [mermaidPreview, setMermaidPreview] = useState(true)
  const [tablePreview, setTablePreview] = useState(true)

  const SHARED_PLUGINS = () => [
    tinyHighlightPlugin(),
    tableGridPlugin({ maxRows: 8, maxColumns: 8 }),
  ]

  useEffect(() => {
    const instances: MarzipanInstance[] = []

    if (highlightRef.current) {
      const [inst] = new Marzipan(highlightRef.current, {
        value: HIGHLIGHT_SAMPLE,
        toolbar: true,
        theme: 'cave',
        plugins: SHARED_PLUGINS(),
      })
      inst.showPreviewMode(true)
      instances.push(inst)
      setHighlightInst(inst)
    }

    if (mermaidRef.current) {
      const [inst] = new Marzipan(mermaidRef.current, {
        value: MERMAID_SAMPLE,
        toolbar: true,
        theme: 'cave',
        plugins: [...SHARED_PLUGINS(), mermaidPlugin({ theme: 'dark' })],
      })
      inst.showPreviewMode(true)
      instances.push(inst)
      setMermaidInst(inst)
    }

    if (tableRef.current) {
      const [inst] = new Marzipan(tableRef.current, {
        value: TABLE_SAMPLE,
        toolbar: true,
        theme: 'cave',
        plugins: SHARED_PLUGINS(),
      })
      inst.showPreviewMode(true)
      instances.push(inst)
      setTableInst(inst)
    }

    return () => {
      instances.forEach(inst => inst.destroy?.())
    }
  }, [])

  function togglePreview(
    inst: MarzipanInstance | null,
    current: boolean,
    setter: (v: boolean) => void
  ) {
    if (!inst) return
    const next = !current
    inst.showPreviewMode(next)
    setter(next)
  }

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          🧩 Plugins Gallery
        </h2>
        <p className="text-slate-300">
          Live demos of all available Marzipan plugins. Every editor has the full plugin suite in its toolbar — syntax highlighting and table grid picker. Toggle between edit and preview to see rendered output.
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
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => togglePreview(highlightInst, hlPreview, setHlPreview)}
              className="text-xs px-3 py-1 rounded border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 transition-colors"
            >
              {hlPreview ? '✏️ Edit' : '👁 Preview'}
            </button>
            <code className="text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded text-emerald-200 hidden md:block">
              tinyHighlightPlugin()
            </code>
          </div>
        </div>
        <div ref={highlightRef} style={{ height: '420px' }} />
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
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => togglePreview(mermaidInst, mermaidPreview, setMermaidPreview)}
              className="text-xs px-3 py-1 rounded border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition-colors"
            >
              {mermaidPreview ? '✏️ Edit' : '👁 Preview'}
            </button>
            <code className="text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded text-purple-200 hidden md:block">
              mermaidPlugin()
            </code>
          </div>
        </div>
        <div ref={mermaidRef} style={{ height: '420px' }} />
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
            <p className="text-slate-400 text-sm">Visual grid picker — alignment &amp; header color options</p>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => togglePreview(tableInst, tablePreview, setTablePreview)}
              className="text-xs px-3 py-1 rounded border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 transition-colors"
            >
              {tablePreview ? '✏️ Edit' : '👁 Preview'}
            </button>
            <code className="text-xs bg-slate-800 border border-slate-600 px-2 py-1 rounded text-pink-200 hidden md:block">
              tableGridPlugin()
            </code>
          </div>
        </div>
        <div ref={tableRef} style={{ height: '340px' }} />
        <div className="mt-3 text-slate-400 text-sm">
          Click the <strong>▦</strong> button in the toolbar · pick a size · choose alignment and an optional header color
        </div>
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
} from '@pinkpixel/marzipan';

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    tinyHighlightPlugin(),
    mermaidPlugin({ theme: 'dark' }),
    tableGridPlugin({ maxRows: 8, maxColumns: 8 }),
  ],
});`}
        </pre>
      </div>
    </div>
  )
}
