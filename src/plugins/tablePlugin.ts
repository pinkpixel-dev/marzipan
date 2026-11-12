// tablePlugin.ts
// Toolbar button that opens a small form (rows + columns) and inserts a GFM table.
// tableGeneratorPlugin is an alias for this plugin.

import { buildTableMarkdown, resolvePositiveInteger } from './utils/table';
import { createButton, createField, togglePopover } from './utils/popover';
import type { MarzipanInstance } from '../types';

export interface TablePluginOptions {
  /** Body rows filled in when the form opens (default 2) */
  defaultRows?: number;
  /** Columns filled in when the form opens (default 2) */
  defaultColumns?: number;
  /** Button label (default ▦) */
  label?: string;
  /** Button tooltip (default "Insert table") */
  title?: string;
}

export function tablePlugin(options: TablePluginOptions = {}) {
  const fallbackRows = Math.max(1, options.defaultRows ?? 2);
  const fallbackCols = Math.max(1, options.defaultColumns ?? 2);
  const label = options.label ?? '▦';
  const title = options.title ?? 'Insert table';

  return (editor: MarzipanInstance) => {
    editor.addToolbarButton({
      title,
      label,
      className: 'mz-btn-table',
      onClick: (button) => {
        togglePopover(button, { label: title, className: 'mz-table-pop' }, (pop) => {
          const form = document.createElement('form');
          form.className = 'mz-form';

          const rows = createField('Rows', { type: 'number', value: String(fallbackRows), min: 1 });
          const cols = createField('Columns', { type: 'number', value: String(fallbackCols), min: 1 });
          const sizeRow = document.createElement('div');
          sizeRow.className = 'mz-field-row';
          sizeRow.append(rows.field, cols.field);

          const actions = document.createElement('div');
          actions.className = 'mz-actions';
          const cancel = createButton('Cancel');
          cancel.addEventListener('click', () => pop.close());
          actions.append(cancel, createButton('Insert', 'primary'));

          form.addEventListener('submit', (event) => {
            event.preventDefault();
            const rowCount = resolvePositiveInteger(rows.input.value, fallbackRows) ?? fallbackRows;
            const colCount = resolvePositiveInteger(cols.input.value, fallbackCols) ?? fallbackCols;
            pop.close();
            editor.insertText(`\n${buildTableMarkdown(rowCount, colCount)}\n`);
          });

          form.append(sizeRow, actions);
          pop.el.appendChild(form);
        });
      },
    });
  };
}
