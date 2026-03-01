// plugins/tableGridPlugin.ts
// Zero-dep "grid popover" table inserter (like Notion). GFM markdown output.

import { buildTableMarkdown } from './utils/table';
import type { ColumnAlignment } from './utils/table';

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
    const prefs = loadPrefs();

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'marzipan-toolbar-button mz-btn-tablegrid';
    btn.title = title;
    btn.textContent = label;
    btn.setAttribute('aria-label', title);

    let pop: HTMLElement | null = null;
    let selectedRows = 0;
    let selectedCols = 0;

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

    function doInsert() {
      if (selectedRows < 1 || selectedCols < 1) return;
      const alignArr: ColumnAlignment[] = Array(selectedCols).fill(prefs.alignment);
      const md = buildTableMarkdown({
        rows: selectedRows,
        cols: selectedCols,
        alignment: alignArr,
        headerColor: prefs.headerColor !== 'default' ? prefs.headerColor : undefined,
      });
      insertAtCursor(editor, `\n${md}\n`);
      closePop();
    }

    function openPop() {
      if (pop) { closePop(); return; }

      pop = document.createElement('div');
      pop.className = 'mz-pop mz-tablegrid-pop';

      // --- Grid section ---
      const grid = document.createElement('div');
      grid.className = 'mz-tablegrid';
      grid.style.setProperty('--r', String(resolvedMaxRows));
      grid.style.setProperty('--c', String(resolvedMaxCols));

      const status = document.createElement('div');
      status.className = 'mz-tablegrid-status';
      status.textContent = 'Hover to select size';

      for (let r = 1; r <= resolvedMaxRows; r++) {
        for (let c = 1; c <= resolvedMaxCols; c++) {
          const cell = document.createElement('div');
          cell.className = 'mz-cell';
          cell.dataset.r = String(r);
          cell.dataset.c = String(c);
          cell.onmouseenter = () => {
            selectedRows = r;
            selectedCols = c;
            status.textContent = `${r} × ${c}`;
            grid.querySelectorAll<HTMLElement>('.mz-cell').forEach(el => {
              const rr = Number(el.dataset.r), cc = Number(el.dataset.c);
              el.classList.toggle('sel', rr <= r && cc <= c);
            });
          };
          cell.onclick = () => doInsert();
          grid.appendChild(cell);
        }
      }

      pop.appendChild(grid);
      pop.appendChild(status);

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

      pop.appendChild(optionsSection);

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
.mz-table-options {
  border-top: 1px solid var(--mz-pop-bd, #333);
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
  background: var(--mz-cell-bg, #1d1f23);
  border: 1px solid var(--mz-cell-bd, #2b2f36);
  color: var(--mz-pop-fg, #ccc);
  border-radius: 5px; padding: 2px 7px; font-size: 11px;
  cursor: pointer; transition: all 0.15s ease;
  font-family: inherit; line-height: 1.4;
}
.mz-opt-btn:hover {
  border-color: #555; background: #252830;
}
.mz-opt-btn.active {
  background: var(--accent, #2f6feb);
  border-color: var(--accent, #3b82f6);
  color: #fff; font-weight: 600;
}
.mz-opt-color { font-size: 14px; padding: 2px 5px; min-width: 22px; }
`;
