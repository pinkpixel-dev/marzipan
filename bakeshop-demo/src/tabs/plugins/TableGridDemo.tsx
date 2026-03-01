import { useEffect, useRef, useState } from 'react'
import { Marzipan, tinyHighlightPlugin, tableGridPlugin } from '@pinkpixel/marzipan'
import type { MarzipanInstance } from '@pinkpixel/marzipan'

const TABLE_GRID_CONTENT = `# ▦ Table Grid Plugin — Full Table Showcase

The **tableGridPlugin** provides a visual grid picker in the toolbar for inserting
GFM-compliant tables with alignment and optional header styling.

---

## Basic Table

| Column A | Column B | Column C |
| -------- | -------- | -------- |
| Row 1    | Data     | Value    |
| Row 2    | Data     | Value    |
| Row 3    | Data     | Value    |

---

## Column Alignment

Tables support **left**, **center**, and **right** alignment:

| Left Aligned   | Center Aligned | Right Aligned |
| :------------- | :------------: | ------------: |
| Left           |    Center      |         Right |
| Text is left   |   Centered     |    Flush right|
| aligned        |   text here    |         value |

---

## Feature Comparison Table

| Feature               | Marzipan       | Editor A       | Editor B       |
| :-------------------- | :------------: | :------------: | :------------: |
| Zero Dependencies     | ✅             | ❌             | ❌             |
| Overlay Preview       | ✅             | ❌             | ✅             |
| Plugin System         | ✅             | ✅             | ❌             |
| Smart Lists           | ✅             | ✅             | ✅             |
| Syntax Highlighting   | ✅             | ✅             | ✅             |
| Mermaid Diagrams      | ✅             | ❌             | ❌             |
| Table Grid Picker     | ✅             | ❌             | ❌             |
| Custom Themes         | ✅             | ✅             | ❌             |
| Framework Agnostic    | ✅             | ❌             | ❌             |
| TypeScript Native     | ✅             | ❌             | ✅             |
| Bundle Size           | ~18kb          | ~250kb         | ~150kb         |

---

## Keyboard Shortcuts Reference

| Shortcut                | Action               | Notes                     |
| :---------------------- | :------------------- | :------------------------ |
| \`Cmd/Ctrl + B\`          | Toggle **Bold**      | Wraps with \`**\`           |
| \`Cmd/Ctrl + I\`          | Toggle *Italic*      | Wraps with \`_\`            |
| \`Cmd/Ctrl + K\`          | Insert Link          | Prompts for URL           |
| \`Cmd/Ctrl + Shift + X\`  | ~~Strikethrough~~    | Wraps with \`~~\`           |
| \`Tab\`                   | Indent               | Adds 2 spaces             |
| \`Shift + Tab\`           | Outdent              | Removes 2 spaces          |
| \`Enter\` (in list)      | Continue list        | Smart list continuation   |

---

## Plugin Configuration Options

| Option         | Type     | Default | Description                              |
| :------------- | :------: | :-----: | :--------------------------------------- |
| \`maxRows\`      | number   | 6       | Maximum rows in the grid picker          |
| \`maxColumns\`   | number   | 6       | Maximum columns in the grid picker       |

---

<!-- mz-table: header=pink -->
| Color Theme  | Background  | Text        | Accent      |
| :----------- | :---------: | :---------: | ----------: |
| Solar        | #fefce8     | #1c1917     | #ca8a04     |
| Cave         | #16161a     | #e5e7eb     | #db2777     |
| Custom       | Any color   | Any color   | Any color   |

---

## Data Table Example

| ID  | Name            | Role            | Status    | Score |
| :-: | :-------------- | :-------------- | :-------: | ----: |
| 1   | Alice Johnson   | Lead Developer  | ✅ Active |   98  |
| 2   | Bob Smith       | Designer        | ✅ Active |   87  |
| 3   | Carol Williams  | QA Engineer     | ⏸ Away   |   92  |
| 4   | Dave Brown      | DevOps          | ✅ Active |   85  |
| 5   | Eve Davis       | PM              | ✅ Active |   91  |
| 6   | Frank Miller    | Frontend Dev    | ❌ Offline|   79  |
| 7   | Grace Wilson    | Backend Dev     | ✅ Active |   94  |
| 8   | Henry Taylor    | Full Stack      | ✅ Active |   88  |

---

## Large Content Table

| Month     | Revenue   | Users  | Growth | Satisfaction |
| :-------- | --------: | -----: | -----: | :----------: |
| January   | $12,500   | 1,200  | +5.2%  | ⭐⭐⭐⭐       |
| February  | $14,200   | 1,450  | +13.6% | ⭐⭐⭐⭐       |
| March     | $15,800   | 1,680  | +11.3% | ⭐⭐⭐⭐⭐     |
| April     | $16,100   | 1,750  | +1.9%  | ⭐⭐⭐⭐       |
| May       | $18,900   | 2,100  | +17.4% | ⭐⭐⭐⭐⭐     |
| June      | $21,300   | 2,500  | +12.7% | ⭐⭐⭐⭐⭐     |
| July      | $20,100   | 2,400  | -5.6%  | ⭐⭐⭐⭐       |
| August    | $22,700   | 2,800  | +12.9% | ⭐⭐⭐⭐⭐     |
| September | $24,500   | 3,100  | +7.9%  | ⭐⭐⭐⭐⭐     |
| October   | $26,200   | 3,400  | +6.9%  | ⭐⭐⭐⭐⭐     |
| November  | $25,800   | 3,350  | -1.5%  | ⭐⭐⭐⭐       |
| December  | $28,400   | 3,700  | +10.1% | ⭐⭐⭐⭐⭐     |

---

Click the **▦** button in the toolbar to open the visual grid picker and insert a new table!
Use the **View** menu to toggle between edit and preview modes.
`

export default function TableGridDemo({ onBack }: { onBack: () => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorInstance, setEditorInstance] = useState<MarzipanInstance | null>(null)
  const [isPreview, setIsPreview] = useState(true)

  useEffect(() => {
    if (!editorRef.current) return

    const [instance] = new Marzipan(editorRef.current, {
      value: TABLE_GRID_CONTENT,
      toolbar: true,
      showStats: true,
      smartLists: true,
      theme: 'cave',
      fontSize: '15px',
      lineHeight: 1.6,
      plugins: [
        tinyHighlightPlugin(),
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
          <span className="text-3xl">▦</span>
          <div>
            <h2 className="text-3xl font-bold text-pink-300">Table Grid Plugin</h2>
            <p className="text-slate-400 mt-1">
              Visual grid picker with alignment, style presets, and border options
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={togglePreview}
            className="text-sm px-4 py-2 rounded-lg border border-pink-500/40 text-pink-300 hover:bg-pink-500/10 transition-colors"
          >
            {isPreview ? '✏️ Switch to Edit Mode' : '👁 Switch to Preview'}
          </button>
          <code className="text-sm bg-slate-800 border border-slate-600 px-3 py-2 rounded-lg text-pink-200">
            tableGridPlugin()
          </code>
        </div>
      </div>

      {/* Full-page editor */}
      <div className="card p-6">
        <div ref={editorRef} style={{ height: 'calc(100vh - 200px)', minHeight: '800px' }} />
      </div>

      {/* Usage snippet */}
      <div className="card p-6 bg-gradient-to-r from-pink-500/10 via-fuchsia-500/5 to-amber-500/10">
        <h3 className="text-lg font-bold text-pink-200 mb-4">💡 Usage</h3>
        <pre className="code-block">
{`import { Marzipan, tableGridPlugin, tableGridStyles } from '@pinkpixel/marzipan';

// Optional: inject the grid picker styles
const style = document.createElement('style');
style.textContent = tableGridStyles;
document.head.appendChild(style);

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    tableGridPlugin({
      maxRows: 8,       // Grid picker max rows
      maxColumns: 8,    // Grid picker max columns
    }),
  ],
});`}
        </pre>
      </div>
    </div>
  )
}
