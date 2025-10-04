// plugins/mermaidExternal.ts
// Renders ```mermaid fences when window.mermaid is available (CDN script).
// Does nothing otherwise.

export function mermaidExternalPlugin(init?: Parameters<any["initialize"]>[0]) {
  let id = 0;

  function getMermaid(): any | null {
    return (window as any).mermaid || null;
  }

  async function ensureInit(theme: 'dark' | 'light', config?: any) {
    const m = getMermaid();
    if (!m) return null;
    // Mermaid v10+: initialize({ startOnLoad: false, theme })
    try {
      m.initialize?.({ startOnLoad: false, theme, ...config });
    } catch { /* ignore */ }
    return m;
  }

  return (editor: any) => {
    const prev = editor.options.hooks?.afterPreviewRender;
    editor.options.hooks = editor.options.hooks || {};

    editor.options.hooks.afterPreviewRender = async (root: HTMLElement, e: any) => {
      prev?.(root, e);

      const nodes = root.querySelectorAll('pre code.language-mermaid');
      if (!nodes.length) return;

      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'default';
      const m = await ensureInit(theme as any, init);
      if (!m) {
        // Optional: visible hint once per session
        if (!(window as any).__mzMermaidWarned) {
          console.warn('[Marzipan] Mermaid block found, but window.mermaid is not loaded.');
          (window as any).__mzMermaidWarned = true;
        }
        return;
      }

      for (const codeEl of Array.from(nodes)) {
        const parentPre = (codeEl as HTMLElement).closest('pre') as HTMLElement;
        const code = (codeEl.textContent || '').trim();
        if (!code) { continue; }
        const domId = `mz-mermaid-${id++}`;
        try {
          // Mermaid v10: render(id, code) -> { svg, bindFunctions }
          const res = await m.render(domId, code);
          const wrapper = document.createElement('div');
          wrapper.className = 'marzipan-mermaid';
          wrapper.innerHTML = res?.svg || '';
          parentPre.replaceWith(wrapper);
          res?.bindFunctions?.(wrapper);
        } catch (err) {
          console.error('Mermaid render error:', err);
        }
      }
    };
  };
}