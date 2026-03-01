import { useState } from 'react'
import TinyHighlightDemo from './plugins/TinyHighlightDemo'
import MermaidDemo from './plugins/MermaidDemo'
import TableGridDemo from './plugins/TableGridDemo'

type PluginView = 'gallery' | 'tinyHighlight' | 'mermaid' | 'tableGrid'

const PLUGIN_CARDS = [
  {
    id: 'tinyHighlight' as PluginView,
    icon: '✨',
    title: 'Tiny Highlight Plugin',
    description: 'Zero-dependency, regex-based syntax highlighting for fenced code blocks. Supports TypeScript, JavaScript, JSON, CSS, HTML, Bash, INI, and Markdown.',
    color: 'emerald',
    code: 'tinyHighlightPlugin()',
  },
  {
    id: 'mermaid' as PluginView,
    icon: '🔀',
    title: 'Mermaid Plugin',
    description: 'Lazy-loads Mermaid and renders diagrams inline — flowcharts, sequence diagrams, Gantt charts, pie charts, class diagrams, and more.',
    color: 'purple',
    code: 'mermaidPlugin()',
  },
  {
    id: 'tableGrid' as PluginView,
    icon: '▦',
    title: 'Table Grid Plugin',
    description: 'Visual grid popover for inserting GFM tables with alignment presets, header color options, and border controls.',
    color: 'pink',
    code: 'tableGridPlugin()',
  },
]

const colorMap: Record<string, { border: string; text: string; hover: string; badge: string }> = {
  emerald: {
    border: 'border-emerald-500/30',
    text: 'text-emerald-300',
    hover: 'hover:border-emerald-400/60 hover:shadow-emerald-500/10',
    badge: 'bg-emerald-500/10 text-emerald-200 border-emerald-500/30',
  },
  purple: {
    border: 'border-purple-500/30',
    text: 'text-purple-300',
    hover: 'hover:border-purple-400/60 hover:shadow-purple-500/10',
    badge: 'bg-purple-500/10 text-purple-200 border-purple-500/30',
  },
  pink: {
    border: 'border-pink-500/30',
    text: 'text-pink-300',
    hover: 'hover:border-pink-400/60 hover:shadow-pink-500/10',
    badge: 'bg-pink-500/10 text-pink-200 border-pink-500/30',
  },
}

export default function PluginsGallery() {
  const [view, setView] = useState<PluginView>('gallery')

  if (view === 'tinyHighlight') return <TinyHighlightDemo onBack={() => setView('gallery')} />
  if (view === 'mermaid') return <MermaidDemo onBack={() => setView('gallery')} />
  if (view === 'tableGrid') return <TableGridDemo onBack={() => setView('gallery')} />

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          🧩 Plugins Gallery
        </h2>
        <p className="text-slate-300">
          Explore each plugin with a dedicated full-page demo. Click a card below to open its interactive playground with comprehensive sample content.
        </p>
      </div>

      {/* Plugin cards */}
      <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-6">
        {PLUGIN_CARDS.map((plugin) => {
          const colors = colorMap[plugin.color]
          return (
            <button
              key={plugin.id}
              onClick={() => setView(plugin.id)}
              className={`card p-6 text-left transition-all duration-300 cursor-pointer ${colors.border} ${colors.hover} hover:shadow-2xl hover:scale-[1.02]`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{plugin.icon}</span>
                <h3 className={`text-xl font-bold ${colors.text}`}>{plugin.title}</h3>
              </div>
              <p className="text-slate-400 text-sm mb-4 leading-relaxed">
                {plugin.description}
              </p>
              <div className="flex items-center justify-between">
                <code className={`text-xs px-2 py-1 rounded border ${colors.badge}`}>
                  {plugin.code}
                </code>
                <span className={`text-sm font-medium ${colors.text}`}>
                  Open Demo →
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Usage code */}
      <div className="card p-6 bg-gradient-to-r from-pink-500/10 via-fuchsia-500/5 to-amber-500/10">
        <h3 className="text-lg font-bold text-pink-200 mb-4">💡 Using Plugins</h3>
        <pre className="code-block">
{`import {
  Marzipan,
  tinyHighlightPlugin,
  mermaidPlugin,
  tableGridPlugin,
} from '@pinkpixel/marzipan';

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    tinyHighlightPlugin(),
    mermaidPlugin({ theme: 'dark' }),
    tableGridPlugin({ maxRows: 8, maxColumns: 8 }),
  ],
});`}
        </pre>
      </div>
    </div>
  )
}
