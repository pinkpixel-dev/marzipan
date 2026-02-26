import { useEffect, useRef } from 'react'
import { Marzipan, actions, tinyHighlightPlugin } from '@pinkpixel/marzipan'

const ACTION_GROUPS = [
  {
    title: '✍️ Text Formatting',
    actions: [
      { name: 'Bold', icon: '𝐁', fn: 'toggleBold', shortcut: 'Cmd/Ctrl+B' },
      { name: 'Italic', icon: '𝐼', fn: 'toggleItalic', shortcut: 'Cmd/Ctrl+I' },
      { name: 'Code', icon: '</>', fn: 'toggleCode', shortcut: '' },
      { name: 'Strikethrough', icon: '~~', fn: 'toggleStrikethrough', shortcut: '' },
    ],
  },
  {
    title: '📋 Lists',
    actions: [
      { name: 'Bullet List', icon: '•', fn: 'toggleBulletList', shortcut: '' },
      { name: 'Numbered List', icon: '1.', fn: 'toggleNumberedList', shortcut: '' },
      { name: 'Task List', icon: '☐', fn: 'toggleTaskList', shortcut: '' },
    ],
  },
  {
    title: '📝 Headings',
    actions: [
      { name: 'H1', icon: 'H1', fn: 'toggleH1', shortcut: '' },
      { name: 'H2', icon: 'H2', fn: 'toggleH2', shortcut: '' },
      { name: 'H3', icon: 'H3', fn: 'toggleH3', shortcut: '' },
    ],
  },
  {
    title: '🔗 Other',
    actions: [
      { name: 'Link', icon: '🔗', fn: 'insertLink', shortcut: 'Cmd/Ctrl+K' },
      { name: 'Quote', icon: '❝', fn: 'toggleQuote', shortcut: '' },
      { name: 'Horizontal Rule', icon: '—', fn: 'insertHorizontalRule', shortcut: '' },
    ],
  },
]

export default function ActionsDemo() {
  const editorRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    if (!editorRef.current) return

    const [instance] = new Marzipan(editorRef.current, {
      value: 'Select some text and click an action button below to see it in action!\n\nTry selecting this text and making it bold, italic, or a heading.',
      toolbar: false,
      showStats: false,
      smartLists: true,
      theme: 'cave',
      plugins: [tinyHighlightPlugin()],
    })

    // Store textarea reference
    const textarea = editorRef.current.querySelector('textarea') as HTMLTextAreaElement
    textareaRef.current = textarea

    return () => {
      instance.destroy?.()
    }
  }, [])

  const handleAction = (actionName: string) => {
    if (!textareaRef.current) return

    const textarea = textareaRef.current
    const actionFn = (actions as any)[actionName]
    
    if (actionFn) {
      actionFn(textarea)
      textarea.focus()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          ⚡ Actions Showcase
        </h2>
        <p className="text-slate-300">
          Click any button below to apply formatting to selected text. All actions are available via the bundled <code className="px-2 py-1 rounded bg-pink-500/20 text-pink-200">actions</code> export.
        </p>
      </div>

      {/* Editor */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-200 mb-3">Try It Out:</h3>
        <div ref={editorRef} style={{ height: '200px' }} />
      </div>

      {/* Action Groups */}
      {ACTION_GROUPS.map((group) => (
        <div key={group.title} className="card p-6">
          <h3 className="text-xl font-bold text-pink-300 mb-4">{group.title}</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {group.actions.map((action) => (
              <button
                key={action.name}
                onClick={() => handleAction(action.fn)}
                className="action-button justify-center"
                title={action.shortcut || undefined}
              >
                <span className="text-xl">{action.icon}</span>
                <span>{action.name}</span>
                {action.shortcut && (
                  <span className="text-xs text-slate-400 block w-full text-center">
                    {action.shortcut}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      ))}

      {/* Code Example */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-3">💻 Code Example</h3>
        <pre className="code-block">
{`import { actions } from '@pinkpixel/marzipan';

const textarea = document.querySelector('textarea');

// Apply bold formatting
actions.toggleBold(textarea);

// Insert a link
actions.insertLink(textarea, {
  text: 'Pink Pixel',
  url: 'https://pinkpixel.dev'
});

// Toggle a bullet list
actions.toggleBulletList(textarea);`}
        </pre>
      </div>
    </div>
  )
}
