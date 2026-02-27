import { useEffect, useRef, useState } from 'react'
import { Marzipan, tinyHighlightPlugin, mermaidPlugin, tableGridPlugin, accentSwatchPlugin } from '@pinkpixel/marzipan'
import type { MarzipanInstance } from '@pinkpixel/marzipan'

const SAMPLE_CONTENT = `# 🧁 Welcome to Marzipan!

A **pure TypeScript** markdown editor with _zero runtime dependencies_.

## ✨ Features

- **Overlay Preview** - See your markdown rendered in real-time
- **Smart Lists** - Auto-continuation of lists
- **Keyboard Shortcuts** - Cmd/Ctrl+B for bold, Cmd/Ctrl+I for italic
- **Themes** - Built-in Solar (light) and Cave (dark) themes
- **Plugins** - Tables, Mermaid diagrams, syntax highlighting, and more!

### Try the toolbar above! 👆

Click the formatting buttons or use keyboard shortcuts to format your text.

## 📝 Markdown Examples

### Lists

- Unordered list item
- Another item
  - Nested item
  - Another nested item

1. Ordered list item
2. Second item
3. Third item

### Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

### Code Blocks

\`\`\`typescript
import { Marzipan, tinyHighlightPlugin, mermaidPlugin } from '@pinkpixel/marzipan';

const [editor] = new Marzipan('#editor', {
  toolbar: true,
  theme: 'cave',
  smartLists: true,
  plugins: [tinyHighlightPlugin(), mermaidPlugin()],
});
\`\`\`

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > Nested quotes work too!

### Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Overlay Preview | ✅ | Real-time rendering |
| Smart Lists | ✅ | Auto-continuation |
| Plugins | ✅ | Extensible architecture |
| Themes | ✅ | Solar, Cave, and custom |

### Mermaid Diagram

\`\`\`mermaid
graph LR
    A[📝 Write] --> B[🔍 Preview]
    B --> C[✅ Done]
\`\`\`

---

## 🎨 Try Different Views

Use the **View** menu in the toolbar to switch between:
- **Normal** - Edit mode with overlay preview
- **Plain** - Plain textarea without markdown rendering
- **Preview** - Read-only preview mode

**💡 Tip:** Enable the stats bar in the toolbar to see character, word, and line counts!

Made with ❤️ by Pink Pixel
`

export default function Playground() {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorInstance, setEditorInstance] = useState<MarzipanInstance | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const [instance] = new Marzipan(editorRef.current, {
      value: SAMPLE_CONTENT,
      toolbar: true,
      showStats: true,
      smartLists: true,
      theme: 'cave',
      fontSize: '15px',
      lineHeight: 1.6,
      plugins: [
        tinyHighlightPlugin(),
        mermaidPlugin(),
        tableGridPlugin({ maxRows: 8, maxColumns: 8 }),
        accentSwatchPlugin({ defaults: ['#ec4899', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'] }),
      ],
      onChange: (value) => {
        // Auto-save to localStorage
        localStorage.setItem('marzipan-playground-content', value)
      },
    })

    setEditorInstance(instance)

    // Load saved content if available
    const savedContent = localStorage.getItem('marzipan-playground-content')
    if (savedContent) {
      instance.setValue(savedContent)
    }

    return () => {
      instance.destroy?.()
    }
  }, [])

  const handleReset = () => {
    if (editorInstance) {
      editorInstance.setValue(SAMPLE_CONTENT)
      localStorage.removeItem('marzipan-playground-content')
    }
  }

  const handleExportHTML = () => {
    if (editorInstance) {
      const html = editorInstance.getCleanHTML()
      const blob = new Blob([html], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'export.html'
      a.click()
      URL.revokeObjectURL(url)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          🎨 Full-Featured Playground
        </h2>
        <p className="text-slate-300 mb-4">
          Experience Marzipan with all features enabled. The overlay preview updates <strong>live as you type</strong> — rendered markdown appears directly beneath the transparent text, keeping every character in perfect alignment. Use the <strong>View</strong> menu in the toolbar to switch modes.
        </p>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="action-button"
          >
            🔄 Reset Content
          </button>
          <button
            onClick={handleExportHTML}
            className="action-button"
          >
            📥 Export HTML
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="card p-6">
        <div ref={editorRef} style={{ height: '600px' }} />
      </div>

      {/* Features Guide */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-xl font-bold text-pink-300 mb-3">⌨️ Keyboard Shortcuts</h3>
          <ul className="space-y-2 text-slate-200">
            <li><kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded font-mono text-sm text-slate-100">Cmd/Ctrl+B</kbd> - Toggle bold</li>
            <li><kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded font-mono text-sm text-slate-100">Cmd/Ctrl+I</kbd> - Toggle italic</li>
            <li><kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded font-mono text-sm text-slate-100">Cmd/Ctrl+K</kbd> - Insert link</li>
            <li><kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded font-mono text-sm text-slate-100">Tab</kbd> - Indent</li>
            <li><kbd className="px-2 py-1 bg-slate-800 border border-slate-600 rounded font-mono text-sm text-slate-100">Shift+Tab</kbd> - Outdent</li>
          </ul>
        </div>

        <div className="card p-6">
          <h3 className="text-xl font-bold text-pink-300 mb-3">✨ Smart Features</h3>
          <ul className="space-y-2 text-slate-200">
            <li>✅ <strong>Smart Lists</strong> — Auto-continue lists on Enter</li>
            <li>✅ <strong>Live Overlay Preview</strong> — Renders markdown beneath transparent text in real-time, always on</li>
            <li>✅ <strong>Stats Bar</strong> — Real-time character/word/line counts</li>
            <li>✅ <strong>View Modes</strong> — Normal (live overlay), Plain (raw textarea), Preview-only (read-only rendered)</li>
            <li>✅ <strong>Auto-save</strong> — Content saved to localStorage</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
