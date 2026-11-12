// plugins/mermaidExternal.ts
// Renders ```mermaid fences when window.mermaid is available (CDN script).
// Does nothing otherwise.

import type { Mermaid, MermaidConfig } from 'mermaid';
import type { MarzipanInstance } from '../types';

type MermaidWindow = Window & { mermaid?: Mermaid; __mzMermaidWarned?: boolean };
const win = () => window as MermaidWindow;

export function mermaidExternalPlugin(init?: Record<string, unknown>) {
  let id = 0;
  let lastTheme: string | null = null;
  const cache = new Map<string, string>();

  function getMermaid(): Mermaid | null {
    return win().mermaid || null;
  }

  async function ensureInit(theme: 'dark' | 'default', config?: Record<string, unknown>) {
    const m = getMermaid();
    if (!m) return null;
    // Mermaid v10+: initialize({ startOnLoad: false, theme })
    if (theme !== lastTheme) {
      try {
        m.initialize?.({ startOnLoad: false, theme, ...config } as MermaidConfig);
      } catch { /* ignore */ }
      lastTheme = theme;
      cache.clear();
    }
    return m;
  }

  return (editor: MarzipanInstance) => {
    const prev = editor.options.hooks?.afterPreviewRender;
    editor.options.hooks = editor.options.hooks || {};

    editor.options.hooks.afterPreviewRender = async (root: HTMLElement, e: MarzipanInstance) => {
      prev?.(root, e);

      const nodes = root.querySelectorAll('pre code.language-mermaid');
      if (!nodes.length) return;

      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'default';
      const m = await ensureInit(theme, init);
      if (!m) {
        // Optional: visible hint once per session
        if (!win().__mzMermaidWarned) {
          console.warn('[Marzipan] Mermaid block found, but window.mermaid is not loaded.');
          win().__mzMermaidWarned = true;
        }
        return;
      }

      for (const codeEl of Array.from(nodes)) {
        const parentPre = (codeEl as HTMLElement).closest('pre') as HTMLElement;
        const code = (codeEl.textContent || '').trim();
        if (!code) { continue; }
        try {
          // Mermaid v10: render(id, code) -> { svg, bindFunctions }
          let svg = cache.get(code);
          let bind: ((el: Element) => void) | undefined;
          if (!svg) {
            const res = await m.render(`mz-mermaid-${id++}`, code);
            svg = res?.svg || '';
            bind = res?.bindFunctions;
            cache.set(code, svg);
          }
          if (!parentPre.isConnected) continue; // preview re-rendered meanwhile
          // Keep the source <pre> for edit-mode alignment; the diagram shows in preview mode
          const wrapper = document.createElement('div');
          wrapper.className = 'marzipan-mermaid';
          wrapper.innerHTML = svg;
          parentPre.classList.add('mz-mermaid-source');
          parentPre.after(wrapper);
          bind?.(wrapper);
        } catch (err) {
          console.error('Mermaid render error:', err);
        }
      }
    };
  };
}