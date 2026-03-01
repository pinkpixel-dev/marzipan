import { useEffect, useRef, useState } from 'react'
import { Marzipan, tinyHighlightPlugin, mermaidPlugin, tableGridPlugin } from '@pinkpixel/marzipan'
import type { MarzipanInstance } from '@pinkpixel/marzipan'

const MERMAID_CONTENT = `# 🔀 Mermaid Plugin — Diagram Showcase

Render beautiful diagrams directly in your markdown using **Mermaid** syntax.
The plugin lazy-loads the Mermaid library only when a \`mermaid\` code block is detected.

---

## Flowchart

\`\`\`mermaid
graph TD
    A[📝 Write Markdown] --> B{Contains mermaid block?}
    B -->|Yes| C[🔄 Lazy-load Mermaid]
    C --> D[🎨 Render Diagram]
    B -->|No| E[📄 Standard Preview]
    D --> F[✨ Beautiful Output]
    E --> F
    F --> G[👀 User sees result]
\`\`\`

---

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Editor as Marzipan Editor
    participant Parser as Markdown Parser
    participant Plugin as Mermaid Plugin
    participant Renderer as Diagram Renderer

    User->>Editor: Type mermaid code block
    Editor->>Parser: Parse markdown content
    Parser->>Plugin: Detected mermaid block
    Plugin->>Renderer: Lazy-load & render
    Renderer-->>Plugin: SVG diagram
    Plugin-->>Editor: Insert into preview
    Editor-->>User: Display rendered diagram
\`\`\`

---

## Pie Chart

\`\`\`mermaid
pie title Marzipan Feature Usage
    "Overlay Preview" : 35
    "Smart Lists" : 20
    "Syntax Highlighting" : 25
    "Mermaid Diagrams" : 10
    "Table Generation" : 10
\`\`\`

---

## Gantt Chart

\`\`\`mermaid
gantt
    title Marzipan Development Timeline
    dateFormat  YYYY-MM-DD
    section Core
    Parser & Overlay      :done, p1, 2025-01-01, 30d
    Toolbar System         :done, p2, after p1, 20d
    Theme Engine           :done, p3, after p2, 15d
    section Plugins
    tinyHighlight          :done, pl1, after p3, 10d
    Table Plugins          :done, pl2, after pl1, 15d
    Mermaid Plugin         :done, pl3, after pl2, 10d
    Image Plugins          :active, pl4, after pl3, 12d
    section Demo
    Bakeshop Demo          :active, d1, after pl3, 20d
    Documentation          :d2, after d1, 15d
\`\`\`

---

## Class Diagram

\`\`\`mermaid
classDiagram
    class Marzipan {
        -options: MarzipanOptions
        -textarea: HTMLTextAreaElement
        -overlay: HTMLElement
        +getValue() string
        +setValue(value: string) void
        +showPreviewMode(show: boolean) void
        +destroy() void
    }
    class MarkdownParser {
        +parse(markdown: string) string
        +renderInline(text: string) string
    }
    class Toolbar {
        -buttons: ToolbarButton[]
        +addButton(btn: ToolbarButton) void
        +render() HTMLElement
    }
    class Plugin {
        <<interface>>
        +install(editor: Marzipan) void
    }
    Marzipan --> MarkdownParser
    Marzipan --> Toolbar
    Marzipan ..> Plugin : uses
\`\`\`

---

## State Diagram

\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Editing : User types
    Editing --> Parsing : Input changed
    Parsing --> Rendering : Parse complete
    Rendering --> Preview : Render complete
    Preview --> Editing : User types again
    Preview --> Idle : No changes
    Editing --> Idle : Blur / unfocus

    state Rendering {
        [*] --> Markdown
        Markdown --> Mermaid : Has mermaid blocks
        Markdown --> Tables : Has tables
        Markdown --> CodeBlocks : Has code blocks
        Mermaid --> [*]
        Tables --> [*]
        CodeBlocks --> [*]
    }
\`\`\`

---

## Git Graph

\`\`\`mermaid
gitGraph
    commit id: "init"
    commit id: "core parser"
    branch feature/toolbar
    commit id: "toolbar UI"
    commit id: "button actions"
    checkout main
    merge feature/toolbar id: "merge toolbar"
    branch feature/plugins
    commit id: "plugin system"
    commit id: "tinyHighlight"
    commit id: "mermaid plugin"
    checkout main
    merge feature/plugins id: "merge plugins"
    commit id: "v1.0 release"
\`\`\`

---

## 🎯 Supported Diagram Types

| Diagram         | Syntax Keyword      | Description                          |
| --------------- | -------------------- | ------------------------------------ |
| Flowchart       | \`graph\` / \`flowchart\` | Directional flow diagrams            |
| Sequence        | \`sequenceDiagram\`    | Interaction between participants     |
| Class           | \`classDiagram\`       | UML class relationships              |
| State           | \`stateDiagram-v2\`    | State machine transitions            |
| Gantt           | \`gantt\`              | Project timeline charts              |
| Pie             | \`pie\`                | Proportional data visualization      |
| Git Graph       | \`gitGraph\`           | Branch and merge visualization       |

Toggle between **Edit** and **Preview** modes to see the raw mermaid syntax and rendered output.
`

export default function MermaidDemo({ onBack }: { onBack: () => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorInstance, setEditorInstance] = useState<MarzipanInstance | null>(null)
  const [isPreview, setIsPreview] = useState(true)

  useEffect(() => {
    if (!editorRef.current) return

    const [instance] = new Marzipan(editorRef.current, {
      value: MERMAID_CONTENT,
      toolbar: true,
      showStats: true,
      smartLists: true,
      theme: 'cave',
      fontSize: '15px',
      lineHeight: 1.6,
      plugins: [
        tinyHighlightPlugin(),
        mermaidPlugin({ theme: 'dark' }),
        tableGridPlugin({ maxRows: 8, maxColumns: 8 }),
      ],
    })

    instance.showPreviewMode(true)
    setEditorInstance(instance)

    return () => {
      instance.destroy?.()
    }
  }, [])

  const togglePreview = () => {
    if (!editorInstance) return
    const next = !isPreview
    editorInstance.showPreviewMode(next)
    setIsPreview(next)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            ← Back to Plugins
          </button>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">🔀</span>
          <div>
            <h2 className="text-3xl font-bold text-purple-300">Mermaid Plugin</h2>
            <p className="text-slate-400 mt-1">
              Lazy-loaded diagram rendering for flowcharts, sequences, Gantt charts, and more
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={togglePreview}
            className="text-sm px-4 py-2 rounded-lg border border-purple-500/40 text-purple-300 hover:bg-purple-500/10 transition-colors"
          >
            {isPreview ? '✏️ Switch to Edit Mode' : '👁 Switch to Preview'}
          </button>
          <code className="text-sm bg-slate-800 border border-slate-600 px-3 py-2 rounded-lg text-purple-200">
            mermaidPlugin()
          </code>
        </div>
      </div>

      {/* Full-page editor */}
      <div className="card p-6">
        <div ref={editorRef} style={{ height: 'calc(100vh - 200px)', minHeight: '800px' }} />
      </div>

      {/* Usage snippet */}
      <div className="card p-6 bg-gradient-to-r from-purple-500/10 via-fuchsia-500/5 to-indigo-500/10">
        <h3 className="text-lg font-bold text-purple-200 mb-4">💡 Usage</h3>
        <pre className="code-block">
{`import { Marzipan, mermaidPlugin } from '@pinkpixel/marzipan';

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    mermaidPlugin({
      theme: 'dark',        // 'default' | 'dark' | 'forest' | 'neutral'
    }),
  ],
});

// The plugin lazy-loads Mermaid only when a
// \`\`\`mermaid block is detected in the content.`}
        </pre>
      </div>
    </div>
  )
}
