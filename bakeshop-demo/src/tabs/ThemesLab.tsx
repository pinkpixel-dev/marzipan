import { useEffect, useRef, useState } from 'react'
import { Marzipan, tinyHighlightPlugin, tableGridPlugin, accentSwatchPlugin } from '@pinkpixel/marzipan'

const getSampleText = (themeName: string) => `# Theme Preview: ${themeName}

This editor demonstrates the **${themeName}** theme.

## Text Styles

Regular text with **bold**, _italic_, ~~strikethrough~~, and \`inline code\`.

> Blockquotes look great with any theme!

## Code Block

\`\`\`typescript
// Code blocks with theme colors
const greeting = "Hello, Marzipan!";
const version: number = 1;
console.log(greeting);
\`\`\`

### Lists

- First item
- Second item with **bold**
- Third item with \`code\`

1. Ordered first
2. Ordered second
3. Ordered third`

const CUSTOM_THEME_SAMPLE = `# 💜 Purple Dream Theme

A custom theme using Marzipan's \`colors\` API.

## How it looks

Text in **bold** and _italic_ with \`inline code\`.

> A styled blockquote block

\`\`\`typescript
const theme = {
  name: 'purple-dream',
  colors: { bgPrimary: '#2d1b69' },
};
Marzipan.setTheme(theme);
\`\`\``

const purpleDreamTheme = {
  name: 'purple-dream',
  colors: {
    bgPrimary: '#1e1130',
    bgSecondary: '#2d1b69',
    text: '#e1d5f7',
    h1: '#c084fc',
    h2: '#a78bfa',
    h3: '#818cf8',
    strong: '#f0abfc',
    em: '#c084fc',
    link: '#a78bfa',
    code: '#e1d5f7',
    codeBg: '#3b2a6e',
    blockquote: '#c084fc',
    hr: '#4d3d79',
    syntaxMarker: 'rgba(167, 139, 250, 0.5)',
    listMarker: '#a78bfa',
    cursor: '#ec4899',
    selection: 'rgba(139, 92, 246, 0.3)',
    toolbarBg: '#2d1b69',
    toolbarBorder: 'rgba(167, 139, 250, 0.2)',
    toolbarIcon: '#c4b5fd',
    toolbarHover: '#3d2880',
    toolbarActive: '#4c3494',
  }
}

export default function ThemesLab() {
  const solarRef = useRef<HTMLDivElement>(null)
  const caveRef = useRef<HTMLDivElement>(null)
  const customRef = useRef<HTMLDivElement>(null)
  const [activeCustomTheme, setActiveCustomTheme] = useState<'purple' | 'ocean' | 'forest'>('purple')

  const customThemes = {
    purple: purpleDreamTheme,
    ocean: {
      name: 'ocean-deep',
      colors: {
        bgPrimary: '#0a1628',
        bgSecondary: '#0d2137',
        text: '#a8d8ea',
        h1: '#7ecfde',
        h2: '#5bbdd1',
        h3: '#3daac4',
        strong: '#f0c57e',
        em: '#7ecfde',
        link: '#7ecfde',
        code: '#a8d8ea',
        codeBg: '#071020',
        blockquote: '#5bbdd1',
        hr: '#1a3550',
        syntaxMarker: 'rgba(94, 189, 209, 0.5)',
        listMarker: '#f0c57e',
        cursor: '#f0c57e',
        selection: 'rgba(94, 189, 209, 0.25)',
        toolbarBg: '#0d2137',
        toolbarBorder: 'rgba(94, 189, 209, 0.15)',
        toolbarIcon: '#a8d8ea',
        toolbarHover: '#122840',
        toolbarActive: '#173354',
      }
    },
    forest: {
      name: 'forest-mist',
      colors: {
        bgPrimary: '#0d1f0d',
        bgSecondary: '#162316',
        text: '#c8e6c9',
        h1: '#81c784',
        h2: '#a5d6a7',
        h3: '#c8e6c9',
        strong: '#ffcc80',
        em: '#80cbc4',
        link: '#80cbc4',
        code: '#c8e6c9',
        codeBg: '#071407',
        blockquote: '#80cbc4',
        hr: '#2a3d2a',
        syntaxMarker: 'rgba(129, 199, 132, 0.5)',
        listMarker: '#ffcc80',
        cursor: '#ff8a65',
        selection: 'rgba(129, 199, 132, 0.25)',
        toolbarBg: '#162316',
        toolbarBorder: 'rgba(129, 199, 132, 0.15)',
        toolbarIcon: '#c8e6c9',
        toolbarHover: '#1e2e1e',
        toolbarActive: '#243824',
      }
    }
  }

  useEffect(() => {
    if (!solarRef.current || !caveRef.current) return

    const [solarInstance] = new Marzipan(solarRef.current, {
      value: getSampleText('Solar (Light)'),
      toolbar: true,
      theme: 'solar',
      showStats: true,
      plugins: [tinyHighlightPlugin(), tableGridPlugin({ maxRows: 8, maxColumns: 8 }), accentSwatchPlugin({ defaults: ['#ec4899', '#8b5cf6', '#06b6d4'] })],
    })

    const [caveInstance] = new Marzipan(caveRef.current, {
      value: getSampleText('Cave (Dark)'),
      toolbar: true,
      theme: 'cave',
      showStats: true,
      plugins: [tinyHighlightPlugin(), tableGridPlugin({ maxRows: 8, maxColumns: 8 }), accentSwatchPlugin({ defaults: ['#ec4899', '#8b5cf6', '#06b6d4'] })],
    })

    return () => {
      solarInstance.destroy?.()
      caveInstance.destroy?.()
    }
  }, [])

  useEffect(() => {
    if (!customRef.current) return

    const theme = customThemes[activeCustomTheme]
    const [inst] = new Marzipan(customRef.current, {
      value: CUSTOM_THEME_SAMPLE,
      toolbar: true,
      theme: theme as any,
      plugins: [tinyHighlightPlugin(), tableGridPlugin({ maxRows: 8, maxColumns: 8 }), accentSwatchPlugin({ defaults: ['#ec4899', '#8b5cf6', '#06b6d4'] })],
    })

    return () => {
      inst.destroy?.()
    }
  }, [activeCustomTheme])

  return (
    <div className="space-y-6">
      <div className="card p-6">
        <h2 className="text-3xl font-bold gradient-text mb-3">
          🎭 Themes Laboratory
        </h2>
        <p className="text-slate-300">
          Marzipan includes built-in Solar (light) and Cave (dark) themes, plus full support for custom themes via the <code className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-200">theme</code> and <code className="px-1.5 py-0.5 rounded bg-pink-500/20 text-pink-200">colors</code> options.
        </p>
      </div>

      {/* Solar Theme */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-amber-300">☀️ Solar Theme (Light)</h3>
          <span className="px-3 py-1 bg-amber-500/20 text-amber-200 rounded-full text-sm font-medium">
            theme: 'solar'
          </span>
        </div>
        <div ref={solarRef} style={{ height: '340px' }} />
      </div>

      {/* Cave Theme */}
      <div className="card p-6 bg-slate-900/70">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-blue-400">🌙 Cave Theme (Dark)</h3>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-200 rounded-full text-sm font-medium">
            theme: 'cave'
          </span>
        </div>
        <div ref={caveRef} style={{ height: '340px' }} />
      </div>

      {/* Custom Theme Live Demo */}
      <div className="card p-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <h3 className="text-xl font-bold text-pink-300">🎨 Custom Themes (Live)</h3>
          <div className="flex gap-2 ml-auto">
            {([
              { key: 'purple', label: '💜 Purple Dream', color: 'bg-purple-500/20 text-purple-200 border-purple-400/50' },
              { key: 'ocean', label: '🌊 Ocean Deep', color: 'bg-blue-500/20 text-blue-200 border-blue-400/50' },
              { key: 'forest', label: '🌿 Forest Mist', color: 'bg-green-500/20 text-green-200 border-green-400/50' },
            ] as const).map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setActiveCustomTheme(key)}
                className={`px-3 py-1 rounded-full text-sm font-medium border transition-all ${color} ${
                  activeCustomTheme === key ? 'ring-2 ring-offset-1 ring-offset-transparent ring-pink-400/60' : 'opacity-70 hover:opacity-100'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        <div ref={customRef} style={{ height: '300px' }} />
      </div>

      {/* Theme Usage */}
      <div className="card p-6">
        <h3 className="text-xl font-bold text-pink-300 mb-4">🎨 Using Themes</h3>

        <div className="space-y-4">
          <div>
            <h4 className="font-bold text-slate-100 mb-2">Built-in Themes</h4>
            <pre className="code-block">
{`import { Marzipan } from '@pinkpixel/marzipan';

// Use built-in themes by name
new Marzipan('#editor', { theme: 'solar' }); // light
new Marzipan('#editor', { theme: 'cave' });  // dark

// Set globally for all instances
Marzipan.setTheme('cave');`}
            </pre>
          </div>

          <div>
            <h4 className="font-bold text-slate-100 mb-2">Custom Theme Object</h4>
            <pre className="code-block">
{`const customTheme = {
  name: 'purple-dream',
  colors: {
    bgPrimary: '#1e1130',     // main background
    bgSecondary: '#2d1b69',   // editor background
    text: '#e1d5f7',          // main text
    h1: '#c084fc',            // heading 1
    h2: '#a78bfa',            // heading 2
    h3: '#818cf8',            // heading 3
    strong: '#f0abfc',        // bold text
    em: '#c084fc',            // italic text
    link: '#a78bfa',          // links
    code: '#e1d5f7',          // inline code
    codeBg: '#3b2a6e',        // code block background
    blockquote: '#c084fc',    // blockquotes
    listMarker: '#a78bfa',    // list bullets
    cursor: '#ec4899',        // cursor color
    selection: 'rgba(139, 92, 246, 0.3)',
    toolbarBg: '#2d1b69',
    toolbarIcon: '#c4b5fd',
  }
};

new Marzipan('#editor', { theme: customTheme });
// or set globally:
Marzipan.setTheme(customTheme);`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  )
}
