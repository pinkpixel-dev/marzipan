import type { ReactNode } from 'react'
import { CodeXml, FileText, Image, RotateCcw, Table2, Workflow } from 'lucide-react'
import { SAMPLES } from '../samples'
import { Button } from './ui'
import { cx } from '../cx'

const ICONS: Record<string, ReactNode> = {
  welcome: <FileText size={15} aria-hidden="true" />,
  tables: <Table2 size={15} aria-hidden="true" />,
  code: <CodeXml size={15} aria-hidden="true" />,
  mermaid: <Workflow size={15} aria-hidden="true" />,
  images: <Image size={15} aria-hidden="true" />,
}

interface Props {
  sampleId: string
  onSample: (id: string) => void
  edited: boolean
  onReset: () => void
}

export function Sidebar({ sampleId, onSample, edited, onReset }: Props) {
  return (
    <nav aria-label="Sample documents" className="flex min-h-0 flex-col border-r border-line bg-surface">
      <h2 className="px-4 pb-2 pt-4 text-[12px] font-medium text-faint">Samples</h2>
      <ul className="flex flex-col gap-0.5 px-2">
        {SAMPLES.map((s) => {
          const active = s.id === sampleId
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSample(s.id)}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex h-8 w-full items-center gap-2.5 whitespace-nowrap rounded-md px-2 text-left text-[13px] transition-colors duration-150',
                  active ? 'bg-raised text-fg' : 'text-muted hover:bg-raised hover:text-fg',
                )}
              >
                <span className={active ? 'text-accent' : 'text-faint'}>{ICONS[s.id]}</span>
                {s.label}
              </button>
            </li>
          )
        })}
      </ul>

      <div className="mt-auto border-t border-line p-3">
        <Button variant="ghost" className="w-full justify-start" onClick={onReset} disabled={!edited}>
          <RotateCcw size={14} aria-hidden="true" />
          Reset this sample
        </Button>
        <p className="mt-2 px-1 text-[12px] leading-snug text-faint">Edits are saved in this browser.</p>
      </div>
    </nav>
  )
}
