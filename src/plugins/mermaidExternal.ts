// plugins/mermaidExternal.ts
// Renders ```mermaid fences when window.mermaid is available (CDN script).
// Does nothing otherwise.

import type { Mermaid } from 'mermaid';
import type { MarzipanInstance } from '../types';
import { createMermaidRenderer } from './utils/mermaid';

type MermaidWindow = Window & { mermaid?: Mermaid; __mzMermaidWarned?: boolean };
const win = () => window as MermaidWindow;

export function mermaidExternalPlugin(init?: Record<string, unknown>) {
  const renderer = createMermaidRenderer(init);

  return (editor: MarzipanInstance) => {
    editor.addHook('afterPreviewRender', async (root) => {
      if (!root.querySelector('pre code.language-mermaid')) return;
      const mermaid = win().mermaid;
      if (!mermaid) {
        // Visible hint once per page
        if (!win().__mzMermaidWarned) {
          console.warn('[Marzipan] Mermaid block found, but window.mermaid is not loaded.');
          win().__mzMermaidWarned = true;
        }
        return;
      }
      await renderer.render(root, mermaid);
    });
  };
}
