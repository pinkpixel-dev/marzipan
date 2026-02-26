// plugins/tableGridPlugin.ts
// Zero-dep "grid popover" table inserter (like Notion). GFM markdown output.

import { buildTableMarkdown } from './utils/table';

type MzEditor = {
  container: HTMLElement;
  textarea: HTMLTextAreaElement;
  updatePreview: () => void;
};

export interface TableGridPluginOptions {
  maxRows?: number;
  maxColumns?: number;
  maxCols?: number;
  label?: string;
  title?: string;
}

function insertAtCursor(editor: MzEditor, text: string) {
  const ta = editor.textarea;
  const s = ta.selectionStart ?? 0;
  const e = ta.selectionEnd ?? 0;
  ta.setRangeText(text, s, e, 'end');
  editor.updatePreview();
  ta.focus();
}

export function tableGridPlugin(opts: TableGridPluginOptions = {}) {
  const resolvedMaxRows = Math.max(1, opts.maxRows ?? 10);
  const resolvedMaxCols = Math.max(1, opts.maxColumns ?? opts.maxCols ?? 10);
  const label = opts.label ?? '▦';
  const title = opts.title ?? 'Insert table';

  return (editor: MzEditor) => {
    const bar = editor.container.querySelector('.marzipan-toolbar') as HTMLElement ?? editor.container;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'marzipan-toolbar-button mz-btn-tablegrid';
    btn.title = title;
    btn.textContent = label;
    btn.setAttribute('aria-label', title);

    let pop: HTMLElement | null = null;

    function closePop() {
      pop?.remove();
      pop = null;
      document.removeEventListener('click', outsideClose, true);
      window.removeEventListener('resize', closePop);
      window.removeEventListener('scroll', closePop, true);
    }

    function outsideClose(e: MouseEvent) {
      if (!pop) return;
      if (e.target instanceof Node && (pop.contains(e.target) || btn.contains(e.target))) return;
      closePop();
    }

    function openPop() {
      if (pop) { closePop(); return; }

      pop = document.createElement('div');
      pop.className = 'mz-pop mz-tablegrid-pop';

      const grid = document.createElement('div');
      grid.className = 'mz-tablegrid';
      grid.style.setProperty('--r', String(resolvedMaxRows));
      grid.style.setProperty('--c', String(resolvedMaxCols));

      const status = document.createElement('div');
      status.className = 'mz-tablegrid-status';
      status.textContent = '0 × 0';

      for (let r = 1; r <= resolvedMaxRows; r++) {
        for (let c = 1; c <= resolvedMaxCols; c++) {
          const cell = document.createElement('div');
          cell.className = 'mz-cell';
          cell.dataset.r = String(r);
          cell.dataset.c = String(c);
          cell.onmouseenter = () => {
            status.textContent = `${r} × ${c}`;
            // highlight
            grid.querySelectorAll<HTMLElement>('.mz-cell').forEach(el => {
              const rr = Number(el.dataset.r), cc = Number(el.dataset.c);
              el.classList.toggle('sel', rr <= r && cc <= c);
            });
          };
          cell.onclick = () => {
            insertAtCursor(editor, `\n${buildTableMarkdown(r, c)}\n`);
            closePop();
          };
          grid.appendChild(cell);
        }
      }

      pop.appendChild(grid);
      pop.appendChild(status);
      document.body.appendChild(pop);

      // position under button
      const br = btn.getBoundingClientRect();
      pop.style.left = `${Math.round(window.scrollX + br.left)}px`;
      pop.style.top  = `${Math.round(window.scrollY + br.bottom + 6)}px`;

      setTimeout(() => {
        document.addEventListener('click', outsideClose, true);
        window.addEventListener('resize', closePop);
        window.addEventListener('scroll', closePop, true);
      }, 0);
    }

    btn.onclick = openPop;
    bar.appendChild(btn);
  };
}

// Minimal styles (inject once in your app)
export const tableGridStyles = `
.mz-pop {
  position: absolute; z-index: 9999; user-select: none;
  background: var(--mz-pop-bg, #111); color: var(--mz-pop-fg, #eee);
  border: 1px solid var(--mz-pop-bd, #333); border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0,0,0,.35); padding: 10px;
}
.mz-tablegrid {
  display: grid; grid-template-rows: repeat(var(--r), 16px);
  grid-template-columns: repeat(var(--c), 16px);
  gap: 4px; margin: 4px;
}
.mz-tablegrid .mz-cell {
  width: 16px; height: 16px; border-radius: 4px;
  background: var(--mz-cell-bg, #1d1f23); border: 1px solid var(--mz-cell-bd, #2b2f36);
}
.mz-tablegrid .mz-cell.sel {
  background: var(--mz-cell-sel-bg, #2f6feb); border-color: var(--mz-cell-sel-bd, #3b82f6);
}
.mz-tablegrid-status { font-size: 12px; opacity: .8; padding: 6px 4px 2px; text-align: center; }
.mz-btn { cursor: pointer; }
`;
