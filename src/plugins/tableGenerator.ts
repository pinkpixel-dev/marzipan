// plugins/tableGenerator.ts
// Quick GFM table inserter.

import { buildTableMarkdown, resolvePositiveInteger } from './utils/table';
import type { MarzipanInstance } from '../types';

function insertAtCursor(editor: MarzipanInstance, text: string) {
  const ta = editor.textarea;
  const s = ta.selectionStart ?? 0;
  const e = ta.selectionEnd ?? 0;
  ta.setRangeText(text, s, e, 'end');
  editor.updatePreview();
  ta.focus();
}

export function tableGeneratorPlugin() {
  return (editor: MarzipanInstance) => {
    const bar = editor.container.querySelector<HTMLElement>('.marzipan-toolbar')
      ?? editor.container;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = 'Insert table';
    btn.className = 'mz-btn mz-btn-table';
    btn.textContent = '▦';

    btn.onclick = () => {
      const rowInput = resolvePositiveInteger(prompt('Rows (excluding header)?'), 2);
      if (rowInput === null) return;

      const colInput = resolvePositiveInteger(prompt('Columns?'), 2);
      if (colInput === null) return;

      const md = buildTableMarkdown(rowInput, colInput);
      insertAtCursor(editor, `\n${md}\n`);
    };

    bar?.appendChild(btn);
  };
}
