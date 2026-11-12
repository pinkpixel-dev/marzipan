import { useRef } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Braces, SlidersHorizontal, Terminal, Wand } from 'lucide-react'
import { cx } from '../cx'

export type InspectorTab = 'setup' | 'code' | 'actions' | 'api'

const TABS: { id: InspectorTab; label: string; icon: ReactNode }[] = [
  { id: 'setup', label: 'Setup', icon: <SlidersHorizontal size={14} aria-hidden="true" /> },
  { id: 'code', label: 'Code', icon: <Braces size={14} aria-hidden="true" /> },
  { id: 'actions', label: 'Actions', icon: <Wand size={14} aria-hidden="true" /> },
  { id: 'api', label: 'API', icon: <Terminal size={14} aria-hidden="true" /> },
]

interface Props {
  tab: InspectorTab
  onTab: (tab: InspectorTab) => void
  children: ReactNode
}

export function Inspector({ tab, onTab, children }: Props) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Arrow keys move between tabs, per the WAI-ARIA tabs pattern
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const index = TABS.findIndex((t) => t.id === tab)
    const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0
    if (!step) return
    e.preventDefault()
    const next = (index + step + TABS.length) % TABS.length
    onTab(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  return (
    <aside className="flex min-h-0 flex-col border-l border-line bg-surface" aria-label="Inspector">
      <div role="tablist" aria-label="Inspector sections" onKeyDown={onKeyDown} className="flex shrink-0 gap-1 border-b border-line px-2 py-2">
        {TABS.map((t, i) => {
          const active = t.id === tab
          return (
            <button
              key={t.id}
              ref={(el) => { tabRefs.current[i] = el }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={active}
              aria-controls="inspector-panel"
              tabIndex={active ? 0 : -1}
              onClick={() => onTab(t.id)}
              className={cx(
                'flex h-8 flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-md text-[13px] font-medium transition-colors duration-150',
                active ? 'bg-raised text-fg' : 'text-faint hover:text-fg',
              )}
            >
              {t.icon}
              {t.label}
            </button>
          )
        })}
      </div>
      <div id="inspector-panel" role="tabpanel" aria-labelledby={`tab-${tab}`} className="panel-scroll min-h-0 flex-1 overflow-y-auto">
        {children}
      </div>
    </aside>
  )
}
