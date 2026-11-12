import { useEffect, useRef } from 'react'
import { Marzipan } from '@pinkpixel/marzipan'
import type { MarzipanInstance } from '@pinkpixel/marzipan'
import { buildOptions, themeFor } from '../config'
import type { DemoConfig } from '../config'

interface Props {
  config: DemoConfig
  /** Text to start with. Later edits are tracked internally, so this is only read on (re)build. */
  initialValue: string
  onChange: (value: string) => void
  onEditor: (editor: MarzipanInstance | null) => void
}

/**
 * Hosts one Marzipan editor. Plugins can't be removed from a live editor,
 * so any settings change rebuilds it, carrying the current text across.
 */
export function EditorPane({ config, initialValue, onChange, onEditor }: Props) {
  const host = useRef<HTMLDivElement>(null)
  const latest = useRef(initialValue)
  const onChangeRef = useRef(onChange)
  const onEditorRef = useRef(onEditor)
  onChangeRef.current = onChange
  onEditorRef.current = onEditor

  const configKey = JSON.stringify(config)

  useEffect(() => {
    const el = host.current
    if (!el) return

    // Mermaid picks its palette from a `dark` class on <html>; color-scheme keeps
    // the textarea's native scrollbar matching the theme
    const tone = themeFor(config).tone
    document.documentElement.classList.toggle('dark', tone === 'dark')
    el.style.colorScheme = tone

    el.textContent = ''
    const [editor] = new Marzipan(el, {
      ...buildOptions(config),
      value: latest.current,
      onChange: (value) => {
        latest.current = value
        onChangeRef.current(value)
      },
    })
    onEditorRef.current(editor)

    return () => {
      editor.destroy()
      el.textContent = ''
      onEditorRef.current(null)
    }
    // configKey captures every setting; `config` itself changes identity on each render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [configKey])

  return <div ref={host} className="h-full min-h-0" />
}
