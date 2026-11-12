// plugins/imageManagerPlugin.ts` — recents, upload, URL add, drag-drop, paste
// =====================================================
// Persists “recents” in `localStorage` (data-URLs for small files ≤ default 1 MB).
// Optional `uploader(file) => Promise<string>` to store remotely and return a URL.
// Drag files onto the editor, or paste images from clipboard—instant preview and insert.
// Tiny panel with thumbnails; click to insert; remove/clear as needed.

import { createStatus, safeAlt, togglePopover } from './utils/popover';
import type { Popover } from './utils/popover';
import type { MarzipanInstance } from '../types';

type RecentImage = { url: string; name: string; createdAt: number; persistent: boolean };

const LS_KEY = 'marzipan.images';

function loadRecents(key: string): RecentImage[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]'); }
  catch { return []; }
}
function saveRecents(key: string, list: RecentImage[]) {
  // blob: URLs die with the page, so only persistent entries are stored
  const persistent = list.filter(r => r.persistent).slice(0, 50);
  try { localStorage.setItem(key, JSON.stringify(persistent)); } catch { /* localStorage not available or full */ }
}

async function fileToDataURL(file: File): Promise<string> {
  const fr = new FileReader();
  return new Promise((res, rej) => {
    fr.onerror = () => rej(fr.error);
    fr.onload = () => res(String(fr.result));
    fr.readAsDataURL(file);
  });
}

export function imageManagerPlugin(opts?: {
  label?: string;            // toolbar label
  title?: string;            // tooltip
  maxRecent?: number;        // default 24
  persistThresholdBytes?: number; // default 1 MiB
  uploader?: (file: File) => Promise<string>; // optional remote upload
  onInsert?: (url: string) => string; // transform URL before insert
  storageKey?: string;       // localStorage key for recents (default 'marzipan.images')
}) {
  const label = opts?.label ?? '🗂️';
  const title = opts?.title ?? 'Images';
  const maxRecent = Math.max(1, opts?.maxRecent ?? 24);
  const threshold = opts?.persistThresholdBytes ?? (1 * 1024 * 1024);
  const storageKey = opts?.storageKey ?? LS_KEY;

  return (editor: MarzipanInstance) => {
    let panel: Popover | null = null;
    let recents: RecentImage[] = loadRecents(storageKey);

    const insertImage = (url: string, name: string) => {
      const finalUrl = opts?.onInsert ? opts.onInsert(url) : url;
      editor.insertText(`![${safeAlt(name)}](${finalUrl})`);
    };

    function showError(message: string) {
      const status = panel?.el.querySelector<HTMLElement>('.mz-status');
      if (!status) return;
      status.classList.add('mz-status-error');
      status.textContent = message;
    }

    function renderGrid() {
      const grid = panel?.el.querySelector<HTMLElement>('.mz-im-grid');
      if (!grid) return;
      grid.innerHTML = '';
      recents.slice(0, maxRecent).forEach((img, idx) => {
        const card = document.createElement('div');
        card.className = 'mz-im-card';

        const image = document.createElement('img');
        image.decoding = 'async';
        image.loading = 'lazy';
        image.src = img.url;
        image.alt = img.name;

        const row = document.createElement('div');
        row.className = 'mz-im-actions';

        const insertBtn = document.createElement('button');
        insertBtn.type = 'button';
        insertBtn.textContent = 'Insert';
        insertBtn.setAttribute('aria-label', `Insert ${img.name}`);
        insertBtn.onclick = () => {
          panel?.close();
          insertImage(img.url, img.name);
        };

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = '✕';
        delBtn.title = 'Remove from recents';
        delBtn.setAttribute('aria-label', `Remove ${img.name} from recents`);
        delBtn.onclick = () => {
          recents.splice(idx, 1);
          saveRecents(storageKey, recents);
          renderGrid();
        };

        row.append(insertBtn, delBtn);
        card.append(image, row);
        grid.appendChild(card);
      });
    }

    async function addFromFile(file: File) {
      try {
        let url: string;
        if (opts?.uploader) {
          url = await opts.uploader(file);
        } else if (file.size <= threshold) {
          url = await fileToDataURL(file); // persist across reload
        } else {
          url = URL.createObjectURL(file); // session-only
        }
        const item: RecentImage = { url, name: file.name, createdAt: Date.now(), persistent: !url.startsWith('blob:') };
        recents = [item, ...recents.filter(r => r.url !== url)];
        saveRecents(storageKey, recents);
        renderGrid();
        insertImage(url, file.name);
      } catch (e) {
        console.error('[Marzipan] Image add failed:', e);
        showError(`Could not add ${file.name}.`);
      }
    }

    function addFromUrl(url: string, name = 'image') {
      const item: RecentImage = { url, name, createdAt: Date.now(), persistent: true };
      recents = [item, ...recents.filter(r => r.url !== url)];
      saveRecents(storageKey, recents);
      renderGrid();
      insertImage(url, name);
    }

    function openPanel(button: HTMLButtonElement) {
      togglePopover(button, { label: title, className: 'mz-im-panel', onClose: () => { panel = null; } }, (pop) => {
        panel = pop;
        pop.el.innerHTML = `
          <div class="mz-im-row">
            <input class="mz-im-url" type="url" placeholder="https://example.com/image.png" aria-label="Image URL" />
            <button class="mz-im-addurl" type="button">Add URL</button>
            <input class="mz-im-file" type="file" accept="image/*" hidden />
            <button class="mz-im-upload" type="button">Upload</button>
            <button class="mz-im-clear" type="button" title="Clear recents">Clear</button>
          </div>
          <div class="mz-im-drop">Drop images here, or paste into the editor.</div>
          <div class="mz-im-grid"></div>
        `;
        pop.el.querySelector('.mz-im-drop')!.after(createStatus());

        const urlIn  = pop.el.querySelector('.mz-im-url') as HTMLInputElement;
        const addUrl = pop.el.querySelector('.mz-im-addurl') as HTMLButtonElement;
        const fileIn = pop.el.querySelector('.mz-im-file') as HTMLInputElement;
        const upBtn  = pop.el.querySelector('.mz-im-upload') as HTMLButtonElement;
        const clrBtn = pop.el.querySelector('.mz-im-clear') as HTMLButtonElement;
        const drop   = pop.el.querySelector('.mz-im-drop') as HTMLElement;

        const submitUrl = () => {
          const val = urlIn.value.trim();
          if (!val) return;
          urlIn.value = '';
          pop.close();
          addFromUrl(val);
        };
        addUrl.onclick = submitUrl;
        urlIn.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') { e.preventDefault(); submitUrl(); }
        });

        upBtn.onclick = () => fileIn.click();
        fileIn.onchange = () => { const f = fileIn.files?.[0]; if (f) addFromFile(f); };

        // Clearing takes a second click to confirm, instead of a blocking confirm() dialog
        let armed: ReturnType<typeof setTimeout> | null = null;
        const disarm = () => {
          if (armed) clearTimeout(armed);
          armed = null;
          clrBtn.textContent = 'Clear';
          clrBtn.classList.remove('mz-armed');
        };
        clrBtn.onclick = () => {
          if (!armed) {
            clrBtn.textContent = 'Confirm';
            clrBtn.classList.add('mz-armed');
            armed = setTimeout(disarm, 3000);
            return;
          }
          disarm();
          recents = [];
          saveRecents(storageKey, recents);
          renderGrid();
        };

        // Drag & drop
        ;['dragenter','dragover'].forEach(ev =>
          drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('on'); })
        );
        ;['dragleave','drop'].forEach(ev =>
          drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('on'); })
        );
        drop.addEventListener('drop', (e: DragEvent) => {
          const files = e.dataTransfer?.files;
          if (!files || !files.length) return;
          Array.from(files).forEach(addFromFile);
        });

        renderGrid();
      });
    }

    // Paste support (into the editor textarea)
    editor.textarea.addEventListener('paste', (e: ClipboardEvent) => {
      const item = e.clipboardData?.items && Array.from(e.clipboardData.items)
        .find(i => i.kind === 'file' && i.type.startsWith('image/'));
      if (!item) return;
      const file = item.getAsFile();
      if (file) {
        e.preventDefault();
        addFromFile(file);
      }
    });

    // Drag & drop onto the editor container
    editor.container.addEventListener('dragover', e => {
      if (Array.from(e.dataTransfer?.items || []).some(i => i.kind === 'file')) e.preventDefault();
    });
    editor.container.addEventListener('drop', (e: DragEvent) => {
      const files = e.dataTransfer?.files;
      if (!files || !files.length) return;
      e.preventDefault();
      Array.from(files).forEach(addFromFile);
    });

    editor.addToolbarButton({ title, label, className: 'mz-btn-imagemgr', onClick: openPanel });
  };
}

// Minimal styles (inject once in your app)
export const imageManagerStyles = `
.mz-im-panel { width: 440px; max-width: calc(100vw - 24px); }
.mz-im-row .mz-armed { border-color: #e5484d; color: #e5484d; }
.mz-im-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 6px; margin-bottom: 8px; }
.mz-im-row input[type="url"] {
  background: var(--mz-ip-bg, var(--bg-primary, #0f1216)); color: var(--mz-ip-fg, inherit);
  border: 1px solid var(--mz-ip-bd, var(--border, #2b2f36)); border-radius: 8px; padding: 6px 8px;
}
.mz-im-row button {
  padding: 6px 10px; border-radius: 8px; border: 1px solid var(--mz-bd, var(--border, #2b2f36));
  background: var(--mz-btn-bg, transparent); color: var(--mz-btn-fg, inherit); cursor: pointer;
}
.mz-im-drop {
  border: 1px dashed var(--mz-drop-bd, var(--border, #3b4350)); border-radius: 8px;
  padding: 10px; text-align: center; font-size: 12px; margin-bottom: 8px;
  background: var(--mz-drop-bg, var(--bg-primary, #0e1116));
}
.mz-im-drop.on { background: var(--mz-drop-on, var(--toolbar-hover, #172033)); }
.mz-im-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 8px; max-height: 320px; overflow: auto; padding: 2px;
}
.mz-im-card { border: 1px solid var(--mz-card-bd, var(--border, #2b2f36)); border-radius: 8px; overflow: hidden;
  background: var(--mz-card-bg, var(--bg-primary, #12151a)); display: flex; flex-direction: column; }
.mz-im-card img { width: 100%; height: 82px; object-fit: cover; display: block; }
.mz-im-actions { display: flex; gap: 6px; padding: 6px; justify-content: space-between; }
.mz-im-actions button {
  flex: 1; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--mz-bd, var(--border, #2b2f36));
  background: var(--mz-btn2-bg, transparent); color: var(--mz-btn2-fg, inherit); cursor: pointer; font-size: 12px;
}
`;