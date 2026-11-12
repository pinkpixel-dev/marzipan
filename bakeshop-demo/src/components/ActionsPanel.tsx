import { useEffect, useState } from 'react'
import { actions } from '@pinkpixel/marzipan'
import type { MarzipanInstance } from '@pinkpixel/marzipan'
import { Button, Section } from './ui'
import { cx } from '../cx'

type ActionName =
  | 'toggleBold' | 'toggleItalic' | 'toggleCode' | 'toggleStrikethrough'
  | 'toggleH1' | 'toggleH2' | 'toggleH3'
  | 'toggleBulletList' | 'toggleNumberedList' | 'toggleTaskList'
  | 'toggleQuote' | 'insertLink' | 'insertHorizontalRule'

const GROUPS: { title: string; items: { label: string; fn: ActionName; format?: string }[] }[] = [
  {
    title: 'Text',
    items: [
      { label: 'Bold', fn: 'toggleBold', format: 'bold' },
      { label: 'Italic', fn: 'toggleItalic', format: 'italic' },
      { label: 'Code', fn: 'toggleCode', format: 'code' },
      { label: 'Strike', fn: 'toggleStrikethrough' },
    ],
  },
  {
    title: 'Headings',
    items: [
      { label: 'H1', fn: 'toggleH1', format: 'header' },
      { label: 'H2', fn: 'toggleH2', format: 'header-2' },
      { label: 'H3', fn: 'toggleH3', format: 'header-3' },
    ],
  },
  {
    title: 'Blocks',
    items: [
      { label: 'Bullets', fn: 'toggleBulletList', format: 'bullet-list' },
      { label: 'Numbers', fn: 'toggleNumberedList', format: 'numbered-list' },
      { label: 'Tasks', fn: 'toggleTaskList', format: 'task-list' },
      { label: 'Quote', fn: 'toggleQuote', format: 'quote' },
      { label: 'Link', fn: 'insertLink', format: 'link' },
      { label: 'Rule', fn: 'insertHorizontalRule' },
    ],
  },
]

const SHORTCUTS: [string, string][] = [
  ['Ctrl/⌘ B', 'Bold'],
  ['Ctrl/⌘ I', 'Italic'],
  ['Ctrl/⌘ K', 'Link'],
  ['Ctrl/⌘ `', 'Inline code'],
  ['Ctrl/⌘ ⇧ 7 / 8', 'Numbered / bullet list'],
  ['Tab / ⇧ Tab', 'Indent / outdent'],
  ['Esc, then Tab', 'Move focus out of the editor'],
]

export function ActionsPanel({ editor }: { editor: MarzipanInstance | null }) {
  const [active, setActive] = useState<string[]>([])

  // Track which formats the cursor is inside, like the toolbar does
  useEffect(() => {
    if (!editor) return
    const textarea = editor.textarea
    const update = () => setActive(actions.getActiveFormats(textarea))
    update()
    document.addEventListener('selectionchange', update)
    textarea.addEventListener('input', update)
    return () => {
      document.removeEventListener('selectionchange', update)
      textarea.removeEventListener('input', update)
    }
  }, [editor])

  const run = (fn: ActionName) => {
    if (!editor) return
    const textarea = editor.textarea
    textarea.focus()
    // Actions fire their own input event when they edit; re-render only if none did
    let fired = false
    const mark = () => { fired = true }
    textarea.addEventListener('input', mark, { once: true })
    actions[fn](textarea)
    textarea.removeEventListener('input', mark)
    if (!fired) textarea.dispatchEvent(new Event('input', { bubbles: true }))
  }

  return (
    <div>
      {GROUPS.map((group) => (
        <Section key={group.title} title={group.title}>
          <div className="flex flex-wrap gap-1.5">
            {group.items.map((item) => {
              const on = item.format ? active.includes(item.format) : false
              return (
                <Button
                  key={item.fn}
                  onClick={() => run(item.fn)}
                  disabled={!editor}
                  aria-pressed={item.format ? on : undefined}
                  className={cx(on && 'border-accent-strong text-accent')}
                >
                  {item.label}
                </Button>
              )
            })}
          </div>
        </Section>
      ))}

      <Section title="Shortcuts">
        <dl className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2 text-[13px]">
          {SHORTCUTS.map(([keys, what]) => (
            <div key={keys} className="contents">
              <dt><span className="kbd">{keys}</span></dt>
              <dd className="text-muted">{what}</dd>
            </div>
          ))}
        </dl>
      </Section>
    </div>
  )
}
