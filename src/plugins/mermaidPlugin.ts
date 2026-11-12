// mermaidPlugin.ts
// Renders ```mermaid fences with the bundled-on-demand `mermaid` package.
// Mermaid is only loaded the first time a diagram shows up.

import type { Mermaid } from 'mermaid';
import type { MarzipanInstance } from '../types';
import { createMermaidRenderer } from './utils/mermaid';

/** Extra Mermaid config merged into mermaid.initialize() */
export type MermaidPluginConfig = Record<string, unknown>;

export function mermaidPlugin(config?: MermaidPluginConfig) {
  let mermaid: Mermaid | undefined;
  const renderer = createMermaidRenderer(config);

  return (editor: MarzipanInstance) => {
    editor.addHook('afterPreviewRender', async (root) => {
      if (!root.querySelector('pre code.language-mermaid')) return;
      mermaid ??= (await import('mermaid')).default;
      await renderer.render(root, mermaid);
    });
  };
}

// Write Markdown:
//
// ```mermaid
// graph TD
//  A[Start] --> B{Choice}
//  B -->|Yes| C[Path 1]
//  B -->|No|  D[Path 2]
// ```
