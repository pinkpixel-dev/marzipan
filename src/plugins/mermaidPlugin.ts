// mermaidPlugin.ts
// Renders ```mermaid fences with the bundled-on-demand `mermaid` package.
// The source <pre> stays in place so the edit-mode overlay keeps its alignment;
// the diagram sits next to it and only shows in preview mode.
import type { Mermaid, MermaidConfig } from 'mermaid';
import type { MarzipanInstance } from '../types';

/** Extra Mermaid config merged into mermaid.initialize() */
export type MermaidPluginConfig = Record<string, unknown>;

export function mermaidPlugin(config?: MermaidPluginConfig) {
  let mermaid: Mermaid | undefined;
  let id = 0;
  let lastTheme: string | null = null;
  const cache = new Map<string, string>();

  return (editor: MarzipanInstance) => {
    const render = async (root: HTMLElement) => {
      const nodes = root.querySelectorAll('pre code.language-mermaid');
      if (!nodes.length) return;

      const mod = await import('mermaid');
      mermaid ??= mod.default;
      const m = mermaid;
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'default';
      if (theme !== lastTheme) {
        m.initialize({ startOnLoad: false, theme, ...config } as MermaidConfig);
        lastTheme = theme;
        cache.clear();
      }

      await Promise.all(Array.from(nodes).map(async (codeEl) => {
        const parentPre = codeEl.closest('pre') as HTMLElement | null;
        const code = (codeEl.textContent || '').trim();
        if (!parentPre || !code) return;
        try {
          let svg = cache.get(code);
          if (!svg) {
            ({ svg } = await m.render(`m-${id++}`, code));
            cache.set(code, svg);
          }
          if (!parentPre.isConnected) return; // preview re-rendered meanwhile
          const wrapper = document.createElement('div');
          wrapper.className = 'marzipan-mermaid';
          wrapper.innerHTML = svg; // SVG from mermaid is safe-by-design
          parentPre.classList.add('mz-mermaid-source');
          parentPre.after(wrapper);
        } catch (err) {
          console.error('[Marzipan] Mermaid render error:', err);
        }
      }));
    };

    const prev = editor.options.hooks?.afterPreviewRender;
    editor.options.hooks = editor.options.hooks || {};
    editor.options.hooks.afterPreviewRender = (root: HTMLElement, e: MarzipanInstance) => {
      prev?.(root, e);
      render(root);
    };
  };
}

// Write Markdown:

// ````md
// ```mermaid
// graph TD
//  A[Start] --> B{Choice}
//  B -->|Yes| C[Path 1]
//  B -->|No|  D[Path 2]
//````
//````
