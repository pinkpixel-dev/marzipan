// Shared Mermaid rendering for mermaidPlugin and mermaidExternalPlugin.
// The source <pre> stays in place so the edit-mode overlay keeps its alignment;
// the diagram goes right after it and only shows in preview mode.

import type { Mermaid, MermaidConfig } from 'mermaid';

type Rendered = { svg: string; bind?: (element: Element) => void };

// Mermaid renders through a temporary element looked up by id, so ids must be unique
// across every editor on the page, not just within one plugin instance.
let nextId = 0;

export interface MermaidRenderer {
  /** Render every ```mermaid block under `root` with the given Mermaid instance */
  render: (root: HTMLElement, mermaid: Mermaid) => Promise<void>;
}

export function createMermaidRenderer(config?: Record<string, unknown>): MermaidRenderer {
  let lastTheme: string | null = null;
  // Keyed by diagram source. bindFunctions is kept so click handlers
  // (`click A callback`) are re-attached when a cached diagram is shown again.
  const cache = new Map<string, Rendered>();

  return {
    async render(root, mermaid) {
      const nodes = root.querySelectorAll('pre code.language-mermaid');
      if (!nodes.length) return;

      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'default';
      if (theme !== lastTheme) {
        try {
          mermaid.initialize({ startOnLoad: false, theme, ...config } as MermaidConfig);
        } catch { /* a bad config shouldn't stop rendering with defaults */ }
        lastTheme = theme;
        cache.clear();
      }

      await Promise.all(Array.from(nodes).map(async (codeEl) => {
        const pre = codeEl.closest('pre');
        const code = (codeEl.textContent || '').trim();
        if (!pre || !code) return;
        try {
          let rendered = cache.get(code);
          if (!rendered) {
            const result = await mermaid.render(`mz-mermaid-${nextId++}`, code);
            rendered = { svg: result.svg, bind: result.bindFunctions };
            if (rendered.svg) cache.set(code, rendered);
          }
          if (!pre.isConnected) return; // the preview re-rendered meanwhile
          const wrapper = document.createElement('div');
          wrapper.className = 'marzipan-mermaid';
          wrapper.innerHTML = rendered.svg; // SVG from mermaid is sanitized by mermaid
          pre.classList.add('mz-mermaid-source');
          pre.after(wrapper);
          rendered.bind?.(wrapper);
        } catch (err) {
          console.error('[Marzipan] Mermaid render error:', err);
        }
      }));
    },
  };
}
