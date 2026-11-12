import { useCallback, useState } from 'react'
import { BookOpen, ExternalLink } from 'lucide-react'
import type { MarzipanInstance } from '@pinkpixel/marzipan'
import { version } from '../../package.json'
import { DEFAULT_CONFIG } from './config'
import type { DemoConfig } from './config'
import { SAMPLES } from './samples'
import { load, loadText, remove, save } from './storage'
import { EditorPane } from './components/EditorPane'
import { Sidebar } from './components/Sidebar'
import { Inspector } from './components/Inspector'
import type { InspectorTab } from './components/Inspector'
import { SetupPanel } from './components/SetupPanel'
import { CodePanel } from './components/CodePanel'
import { ActionsPanel } from './components/ActionsPanel'
import { ApiPanel } from './components/ApiPanel'

const sampleById = (id: string) => SAMPLES.find((s) => s.id === id) ?? SAMPLES[0]
const docKey = (id: string) => `doc:${id}`

export default function App() {
  const [config, setConfigState] = useState<DemoConfig>(() => load('config', DEFAULT_CONFIG))
  const [sampleId, setSampleId] = useState(() => loadText('sample') ?? SAMPLES[0].id)
  const [tab, setTab] = useState<InspectorTab>('setup')
  const [editor, setEditor] = useState<MarzipanInstance | null>(null)
  // Bumped on reset so the editor rebuilds from the original sample
  const [docVersion, setDocVersion] = useState(0)
  const [edited, setEdited] = useState(() => loadText(docKey(sampleId)) !== null)

  const sample = sampleById(sampleId)
  const initialValue = loadText(docKey(sample.id)) ?? sample.content

  const setConfig = (next: DemoConfig) => {
    setConfigState(next)
    save('config', next)
  }

  const chooseSample = (id: string) => {
    setSampleId(id)
    save('sample', id)
    setEdited(loadText(docKey(id)) !== null)
  }

  const onChange = useCallback(
    (value: string) => {
      if (value === sampleById(sampleId).content) return
      save(docKey(sampleId), value)
      setEdited(true)
    },
    [sampleId],
  )

  const reset = () => {
    remove(docKey(sampleId))
    setEdited(false)
    setDocVersion((v) => v + 1)
  }

  return (
    <div className="grid h-full grid-rows-[48px_minmax(0,1fr)]">
      <header className="flex items-center justify-between gap-4 border-b border-line bg-surface px-4">
        <div className="flex items-center gap-2.5">
          <img src="/logo.png" alt="" className="size-7" />
          <span className="text-[15px] font-semibold tracking-tight text-fg">Marzipan</span>
          <span className="rounded border border-line px-1.5 py-px font-mono text-[11px] text-faint">v{version}</span>
          <span className="ml-1 hidden text-[13px] text-faint md:inline">Bakeshop</span>
        </div>
        <nav aria-label="Project links" className="flex items-center gap-1">
          <a
            href="https://marzipan.pinkpixel.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[13px] text-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
          >
            <BookOpen size={14} aria-hidden="true" />
            Docs
          </a>
          <a
            href="https://github.com/pinkpixel-dev/marzipan"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-md px-3 text-[13px] text-muted transition-colors duration-150 hover:bg-raised hover:text-fg"
          >
            GitHub
            <ExternalLink size={13} aria-hidden="true" />
          </a>
        </nav>
      </header>

      <div className="grid min-h-0 grid-cols-[176px_minmax(0,1fr)_296px] xl:grid-cols-[200px_minmax(0,1fr)_340px]">
        <Sidebar sampleId={sampleId} onSample={chooseSample} edited={edited} onReset={reset} />

        <main className="dot-texture min-h-0 p-4" aria-label={`${sample.label} sample`}>
          <div className="h-full min-h-0 overflow-hidden rounded-lg border border-line">
            <EditorPane
              key={`${sample.id}:${docVersion}`}
              config={config}
              initialValue={initialValue}
              onChange={onChange}
              onEditor={setEditor}
            />
          </div>
        </main>

        <Inspector tab={tab} onTab={setTab}>
          {tab === 'setup' && <SetupPanel config={config} onChange={setConfig} />}
          {tab === 'code' && <CodePanel config={config} />}
          {tab === 'actions' && <ActionsPanel editor={editor} />}
          {tab === 'api' && <ApiPanel key={editor?.instanceId ?? 0} editor={editor} />}
        </Inspector>
      </div>
    </div>
  )
}
