// tablePlugin.ts

import { buildTableMarkdown, resolvePositiveInteger } from './utils/table';
import type { MarzipanInstance } from '../types';

export interface TablePluginOptions {
  defaultRows?: number;
  defaultColumns?: number;
  label?: string;
  title?: string;
}

function insertAtCursor(editor: MarzipanInstance, text: string) {
  const ta = editor.textarea;
  const s = ta.selectionStart ?? 0;
  const e = ta.selectionEnd ?? 0;
  ta.setRangeText(text, s, e, 'end');
  editor.updatePreview();
  ta.focus();
}

export function tablePlugin(options: TablePluginOptions = {}) {
  const fallbackRows = Math.max(1, options.defaultRows ?? 2);
  const fallbackCols = Math.max(1, options.defaultColumns ?? 2);
  const label = options.label ?? '▦';
  const title = options.title ?? 'Insert table';

  return (editor: MarzipanInstance) => {
    const bar = editor.container.querySelector('.marzipan-toolbar') as HTMLElement;
    if (!bar) return;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.title = title;
    btn.textContent = label;
    btn.onclick = () => {
      const rowsInput = prompt('Rows (excluding header)?', String(fallbackRows));
      const rows = resolvePositiveInteger(rowsInput, fallbackRows);
      if (rows === null) return;

      const colsInput = prompt('Columns?', String(fallbackCols));
      const cols = resolvePositiveInteger(colsInput, fallbackCols);
      if (cols === null) return;

      const md = buildTableMarkdown(rows, cols);
      insertAtCursor(editor, `\n${md}\n`);
    };

    bar.appendChild(btn);
  };
}
