// plugins/tableGridPlugin.ts
// Zero-dep "grid popover" table inserter (like Notion). GFM markdown output.

import { buildTableMarkdown } from './utils/table';
import type { ColumnAlignment } from './utils/table';
import { togglePopover } from './utils/popover';
import type { Popover } from './utils/popover';
import type { MarzipanInstance } from '../types';

export interface TableGridPluginOptions {
  maxRows?: number;
  maxColumns?: number;
  maxCols?: number;
  label?: string;
  title?: string;
}

const LS_KEY = 'marzipan.table.prefs';

interface TablePrefs {
  alignment: ColumnAlignment;
  headerColor: string;
}

function loadPrefs(): TablePrefs {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) return { ...defaultPrefs(), ...JSON.parse(raw) };
  } catch { /* noop */ }
  return defaultPrefs();
}

function savePrefs(p: TablePrefs) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(p)); } catch { /* noop */ }
}

function defaultPrefs(): TablePrefs {
  return { alignment: 'left', headerColor: 'default' };
}

export function tableGridPlugin(opts: TableGridPluginOptions = {}) {
  const resolvedMaxRows = Math.max(1, opts.maxRows ?? 10);
  const resolvedMaxCols = Math.max(1, opts.maxColumns ?? opts.maxCols ?? 10);
  const label = opts.label ?? '▦';
  const title = opts.title ?? 'Insert table';

  return (editor: MarzipanInstance) => {
    const prefs = loadPrefs();

    let pop: Popover | null = null;
    let selectedRows = 0;
    let selectedCols = 0;

    function doInsert() {
      if (selectedRows < 1 || selectedCols < 1) return;
      const alignArr: ColumnAlignment[] = Array(selectedCols).fill(prefs.alignment);
      const md = buildTableMarkdown({
        rows: selectedRows,
        cols: selectedCols,
        alignment: alignArr,
        headerColor: prefs.headerColor !== 'default' ? prefs.headerColor : undefined,
      });
      pop?.close();
      editor.insertText(`\n${md}\n`);
    }

    function buildPop(el: HTMLElement) {
      selectedRows = 0;
      selectedCols = 0;

      // --- Grid section ---
      // The grid is one focusable control: arrow keys grow or shrink the selection,
      // Enter inserts. Hovering and clicking work as before.
      const grid = document.createElement('div');
      grid.className = 'mz-tablegrid';
      grid.tabIndex = 0;
      grid.dataset.autofocus = '';
      grid.setAttribute('role', 'slider');
      grid.setAttribute('aria-label', 'Table size. Arrow keys change rows and columns, Enter inserts.');
      grid.style.setProperty('--r', String(resolvedMaxRows));
      grid.style.setProperty('--c', String(resolvedMaxCols));

      const status = document.createElement('div');
      status.className = 'mz-tablegrid-status';
      status.setAttribute('aria-hidden', 'true');
      status.textContent = 'Hover or use arrow keys';

      const select = (r: number, c: number) => {
        selectedRows = Math.min(resolvedMaxRows, Math.max(1, r));
        selectedCols = Math.min(resolvedMaxCols, Math.max(1, c));
        const text = `${selectedRows} × ${selectedCols}`;
        status.textContent = text;
        grid.setAttribute('aria-valuetext', `${selectedRows} rows by ${selectedCols} columns`);
        grid.querySelectorAll<HTMLElement>('.mz-cell').forEach(cell => {
          const rr = Number(cell.dataset.r), cc = Number(cell.dataset.c);
          cell.classList.toggle('sel', rr <= selectedRows && cc <= selectedCols);
        });
      };

      for (let r = 1; r <= resolvedMaxRows; r++) {
        for (let c = 1; c <= resolvedMaxCols; c++) {
          const cell = document.createElement('div');
          cell.className = 'mz-cell';
          cell.dataset.r = String(r);
          cell.dataset.c = String(c);
          cell.onmouseenter = () => select(r, c);
          cell.onclick = () => doInsert();
          grid.appendChild(cell);
        }
      }

      grid.addEventListener('focus', () => {
        if (!selectedRows) select(2, 2);
      });
      grid.addEventListener('keydown', (e) => {
        const moves: Record<string, [number, number]> = {
          ArrowDown: [1, 0], ArrowUp: [-1, 0], ArrowRight: [0, 1], ArrowLeft: [0, -1],
        };
        const move = moves[e.key];
        if (move) {
          e.preventDefault();
          select((selectedRows || 1) + move[0], (selectedCols || 1) + move[1]);
        } else if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          doInsert();
        }
      });

      el.appendChild(grid);
      el.appendChild(status);

      // --- Options section ---
      const optionsSection = document.createElement('div');
      optionsSection.className = 'mz-table-options';

      // Alignment row
      const alignRow = makeOptionRow('Align');
      const alignBtns: HTMLButtonElement[] = [];
      (['left', 'center', 'right'] as ColumnAlignment[]).forEach(a => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mz-opt-btn' + (prefs.alignment === a ? ' active' : '');
        b.textContent = a === 'left' ? '⬅' : a === 'center' ? '⬌' : '➡';
        b.title = a.charAt(0).toUpperCase() + a.slice(1) + ' align';
        b.onclick = () => {
          prefs.alignment = a;
          savePrefs(prefs);
          alignBtns.forEach(x => x.classList.toggle('active', x === b));
        };
        alignBtns.push(b);
        alignRow.content.appendChild(b);
      });
      optionsSection.appendChild(alignRow.row);

      // Header color row
      const colorRow = makeOptionRow('Header');
      const colorBtns: HTMLButtonElement[] = [];
      const headerColors: { key: string; color: string; title: string }[] = [
        { key: 'default', color: '',                       title: 'Default' },
        { key: 'pink',    color: 'rgba(236,72,153,0.7)',   title: 'Pink' },
        { key: 'purple',  color: 'rgba(139,92,246,0.7)',   title: 'Purple' },
        { key: 'blue',    color: 'rgba(59,130,246,0.7)',   title: 'Blue' },
        { key: 'cyan',    color: 'rgba(6,182,212,0.7)',    title: 'Cyan' },
        { key: 'green',   color: 'rgba(16,185,129,0.7)',   title: 'Green' },
        { key: 'amber',   color: 'rgba(245,158,11,0.7)',   title: 'Amber' },
      ];
      headerColors.forEach(hc => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'mz-opt-btn mz-opt-color' + (prefs.headerColor === hc.key ? ' active' : '');
        b.title = hc.title + ' header';
        if (hc.key === 'default') {
          b.textContent = '∅';
        } else {
          b.textContent = '●';
          b.style.color = hc.color;
        }
        b.onclick = () => {
          prefs.headerColor = hc.key;
          savePrefs(prefs);
          colorBtns.forEach(x => x.classList.toggle('active', x === b));
        };
        colorBtns.push(b);
        colorRow.content.appendChild(b);
      });
      optionsSection.appendChild(colorRow.row);

      el.appendChild(optionsSection);
    }

    editor.addToolbarButton({
      title,
      label,
      className: 'mz-btn-tablegrid',
      onClick: (button) => {
        togglePopover(
          button,
          { label: title, className: 'mz-tablegrid-pop', onClose: () => { pop = null; } },
          (p) => { pop = p; buildPop(p.el); },
        );
      },
    });
  };
}

function makeOptionRow(label: string) {
  const row = document.createElement('div');
  row.className = 'mz-opt-row';
  const lbl = document.createElement('span');
  lbl.className = 'mz-opt-label';
  lbl.textContent = label;
  const content = document.createElement('div');
  content.className = 'mz-opt-group';
  row.appendChild(lbl);
  row.appendChild(content);
  return { row, content };
}

// Minimal styles (inject once in your app)
export const tableGridStyles = `
.mz-tablegrid-pop { user-select: none; }
.mz-tablegrid {
  display: grid; grid-template-rows: repeat(var(--r), 16px);
  grid-template-columns: repeat(var(--c), 16px);
  gap: 4px; margin: 4px;
}
.mz-tablegrid .mz-cell {
  width: 16px; height: 16px; border-radius: 4px;
  background: var(--mz-cell-bg, var(--bg-primary, #1d1f23)); border: 1px solid var(--mz-cell-bd, var(--border, #2b2f36));
}
.mz-tablegrid .mz-cell.sel {
  background: var(--mz-cell-sel-bg, var(--h1, #2f6feb)); border-color: var(--mz-cell-sel-bd, var(--h1, #3b82f6));
}
.mz-tablegrid:focus-visible { outline: 2px solid var(--h1, #3b82f6); outline-offset: 3px; border-radius: 6px; }
.mz-tablegrid-status { font-size: 12px; opacity: .8; padding: 6px 4px 2px; text-align: center; }
.mz-btn { cursor: pointer; }
.mz-table-options {
  border-top: 1px solid var(--mz-pop-bd, var(--border, #333));
  margin-top: 8px; padding-top: 8px;
  display: flex; flex-direction: column; gap: 6px;
}
.mz-opt-row {
  display: flex; align-items: center; gap: 8px;
}
.mz-opt-label {
  font-size: 11px; font-weight: 600; opacity: 0.6;
  min-width: 42px; text-transform: uppercase; letter-spacing: 0.5px;
}
.mz-opt-group {
  display: flex; gap: 3px; flex-wrap: wrap;
}
.mz-opt-btn {
  background: var(--mz-cell-bg, var(--bg-primary, #1d1f23));
  border: 1px solid var(--mz-cell-bd, var(--border, #2b2f36));
  color: var(--mz-pop-fg, inherit);
  border-radius: 5px; padding: 2px 7px; font-size: 11px;
  cursor: pointer; transition: all 0.15s ease;
  font-family: inherit; line-height: 1.4;
}
.mz-opt-btn:hover {
  border-color: var(--text, #555); background: var(--toolbar-hover, #252830);
}
.mz-opt-btn.active {
  background: var(--accent, var(--h1, #2f6feb));
  border-color: var(--accent, var(--h1, #3b82f6));
  color: #fff; font-weight: 600;
}
.mz-opt-color { font-size: 14px; padding: 2px 5px; min-width: 22px; }
`;
