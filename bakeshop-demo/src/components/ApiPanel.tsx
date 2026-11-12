import { useState } from 'react'
import { Download } from 'lucide-react'
import type { MarzipanInstance } from '@pinkpixel/marzipan'
import { Button, Section } from './ui'
import { cx } from '../cx'

interface Call {
  label: string
  code: string
  run: (editor: MarzipanInstance) => unknown
}

const CALLS: Call[] = [
  { label: 'getValue', code: 'editor.getValue()', run: (e) => e.getValue() },
  { label: 'getStats', code: 'editor.getStats()', run: (e) => e.getStats() },
  { label: 'getCleanHTML', code: 'editor.getCleanHTML()', run: (e) => e.getCleanHTML() },
  {
    label: 'insertText',
    code: "editor.insertText('**Marzipan** ')",
    run: (e) => {
      e.insertText('**Marzipan** ')
      return 'Inserted at the cursor. Ctrl+Z undoes it.'
    },
  },
]

function format(result: unknown): string {
  if (typeof result === 'string') return result
  return JSON.stringify(result, null, 2)
}

export function ApiPanel({ editor }: { editor: MarzipanInstance | null }) {
  const [output, setOutput] = useState<{ code: string; text: string } | null>(null)
  const [preview, setPreview] = useState(false)
  const [plain, setPlain] = useState(false)

  const call = (c: Call) => {
    if (!editor) return
    setOutput({ code: c.code, text: format(c.run(editor)) })
  }

  const togglePreview = () => {
    if (!editor) return
    const next = !preview
    editor.showPreviewMode(next)
    setPreview(next)
    setOutput({ code: `editor.showPreviewMode(${next})`, text: next ? 'Preview only (read-only).' : 'Back to editing.' })
  }

  const togglePlain = () => {
    if (!editor) return
    const next = !plain
    editor.showPlainTextarea(next)
    setPlain(next)
    setOutput({ code: `editor.showPlainTextarea(${next})`, text: next ? 'Plain textarea, no overlay.' : 'Overlay preview is back.' })
  }

  const exportHtml = () => {
    if (!editor) return
    const blob = new Blob([editor.getCleanHTML()], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'marzipan-export.html'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <Section title="Read and write">
        <div className="flex flex-wrap gap-1.5">
          {CALLS.map((c) => (
            <Button key={c.label} onClick={() => call(c)} disabled={!editor} className="font-mono text-[12px]">
              {c.label}()
            </Button>
          ))}
        </div>
      </Section>

      <Section title="View modes">
        <div className="flex flex-wrap gap-1.5">
          <Button onClick={togglePreview} disabled={!editor} aria-pressed={preview} className={cx('font-mono text-[12px]', preview && 'border-accent-strong text-accent')}>
            showPreviewMode()
          </Button>
          <Button onClick={togglePlain} disabled={!editor} aria-pressed={plain} className={cx('font-mono text-[12px]', plain && 'border-accent-strong text-accent')}>
            showPlainTextarea()
          </Button>
        </div>
      </Section>

      <Section title="Result">
        {output ? (
          <div className="overflow-hidden rounded-md border border-line bg-canvas">
            <div className="border-b border-line px-3 py-1.5 font-mono text-[12px] text-accent">{output.code}</div>
            <pre className="panel-scroll max-h-72 overflow-auto whitespace-pre-wrap break-words p-3 font-mono text-[12px] leading-relaxed text-muted">
              {output.text}
            </pre>
          </div>
        ) : (
          <p className="text-[13px] text-faint">Run a method to see what it returns.</p>
        )}
      </Section>

      <Section title="Export">
        <Button onClick={exportHtml} disabled={!editor}>
          <Download size={14} aria-hidden="true" />
          Download clean HTML
        </Button>
      </Section>
    </div>
  )
}
