import { Marzipan } from '@pinkpixel/marzipan'
import type { Theme } from '@pinkpixel/marzipan'
import { FONT_SIZES, PLUGINS } from '../config'
import type { DemoConfig, PluginId } from '../config'
import { THEMES } from '../themes'
import { Section, Switch } from './ui'
import { cx } from '../cx'

interface Props {
  config: DemoConfig
  onChange: (next: DemoConfig) => void
}

function swatchColors(theme: string | Theme): string[] {
  const resolved = typeof theme === 'string' ? Marzipan.getTheme(theme) : theme
  const c = resolved.colors
  return [c.bgSecondary, c.h1, c.h2, c.strong].filter((v): v is string => Boolean(v))
}

export function SetupPanel({ config, onChange }: Props) {
  const set = <K extends keyof DemoConfig>(key: K, value: DemoConfig[K]) => onChange({ ...config, [key]: value })
  const setPlugin = (id: PluginId, on: boolean) => onChange({ ...config, plugins: { ...config.plugins, [id]: on } })

  return (
    <div>
      <Section title="Theme">
        <div role="radiogroup" aria-label="Editor theme" className="flex flex-col gap-0.5">
          {THEMES.map((t) => {
            const active = t.id === config.themeId
            return (
              <button
                key={t.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => set('themeId', t.id)}
                className={cx(
                  'flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors duration-150',
                  active ? 'bg-raised text-fg' : 'text-muted hover:bg-raised hover:text-fg',
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cx('size-1.5 rounded-full', active ? 'bg-accent' : 'bg-transparent')}
                  />
                  {t.label}
                </span>
                <span aria-hidden="true" className="flex overflow-hidden rounded border border-line">
                  {swatchColors(t.theme).map((color, i) => (
                    <span key={i} className="h-3.5 w-3" style={{ background: color }} />
                  ))}
                </span>
              </button>
            )
          })}
        </div>
      </Section>

      <Section title="Editor">
        <div className="flex flex-col gap-0.5">
          <Switch label="Toolbar" checked={config.toolbar} onChange={(v) => set('toolbar', v)} />
          <Switch label="Stats bar" checked={config.showStats} onChange={(v) => set('showStats', v)} />
          <Switch label="Smart lists" checked={config.smartLists} onChange={(v) => set('smartLists', v)} />
          <Switch
            label="Raw cursor line"
            checked={config.showActiveLineRaw}
            onChange={(v) => set('showActiveLineRaw', v)}
          />
        </div>
        <div className="mt-3 flex items-center justify-between gap-3 px-2">
          <span id="font-size-label" className="text-[13px] text-fg">Font size</span>
          <div role="radiogroup" aria-labelledby="font-size-label" className="flex rounded-md border border-line p-0.5">
            {FONT_SIZES.map((size) => {
              const active = size === config.fontSize
              return (
                <button
                  key={size}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => set('fontSize', size)}
                  className={cx(
                    'h-6 min-w-7 rounded px-1.5 font-mono text-[12px] transition-colors duration-150',
                    active ? 'bg-raised text-fg' : 'text-faint hover:text-fg',
                  )}
                >
                  {size}
                </button>
              )
            })}
          </div>
        </div>
      </Section>

      <Section title="Plugins">
        <div className="flex flex-col gap-0.5">
          {PLUGINS.map((p) => (
            <Switch key={p.id} label={p.label} checked={config.plugins[p.id]} onChange={(v) => setPlugin(p.id, v)} />
          ))}
        </div>
      </Section>
    </div>
  )
}
