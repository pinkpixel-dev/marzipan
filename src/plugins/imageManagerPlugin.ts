// plugins/imageManagerPlugin.ts` — recents, upload, URL add, drag-drop, paste
// =====================================================
// Persists “recents” in `localStorage` (data-URLs for small files ≤ default 1 MB).
// Optional `uploader(file) => Promise<string>` to store remotely and return a URL.
// Drag files onto the editor, or paste images from clipboard—instant preview and insert.
// Tiny panel with thumbnails; click to insert; remove/clear as needed.

type MzEditor = {
  container: HTMLElement;
  textarea: HTMLTextAreaElement;
  updatePreview: () => void;
};

type RecentImage = { url: string; name: string; createdAt: number; persistent: boolean };

const LS_KEY = 'marzipan.images';

function insertAtCursor(editor: MzEditor, text: string) {
  const ta = editor.textarea;
  const s = ta.selectionStart ?? 0, e = ta.selectionEnd ?? 0;
  ta.setRangeText(text, s, e, 'end');
  editor.updatePreview();
  ta.focus();
}

function loadRecents(): RecentImage[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
  catch { return []; }
}
function saveRecents(list: RecentImage[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 50))); } catch { /* localStorage not available */ }
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
}) {
  const label = opts?.label ?? '🗂️';
  const title = opts?.title ?? 'Images';
  const maxRecent = Math.max(1, opts?.maxRecent ?? 24);
  const threshold = opts?.persistThresholdBytes ?? (1 * 1024 * 1024);

  return (editor: MzEditor) => {
    const bar = editor.container.querySelector('.marzipan-toolbar') as HTMLElement ?? editor.container;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mz-btn mz-btn-imagemgr';
    btn.title = title;
    btn.textContent = label;

    let panel: HTMLElement | null = null;
    let recents: RecentImage[] = loadRecents();

    function closePanel() {
      panel?.remove(); panel = null;
      document.removeEventListener('click', outsideClose, true);
      window.removeEventListener('resize', closePanel);
      window.removeEventListener('scroll', closePanel, true);
    }
    function outsideClose(e: MouseEvent) {
      if (!panel) return;
      if (e.target instanceof Node && (panel.contains(e.target) || btn.contains(e.target))) return;
      closePanel();
    }

    function renderGrid(root: HTMLElement) {
      const grid = root.querySelector('.mz-im-grid') as HTMLElement;
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
        insertBtn.onclick = () => {
          const url = opts?.onInsert ? opts.onInsert(img.url) : img.url;
          insertAtCursor(editor, `![${img.name}](${url})`);
          closePanel();
        };

        const delBtn = document.createElement('button');
        delBtn.type = 'button';
        delBtn.textContent = '✕';
        delBtn.title = 'Remove from recents';
        delBtn.onclick = () => {
          recents.splice(idx, 1);
          saveRecents(recents);
          renderGrid(root);
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
        saveRecents(recents);
        if (panel) renderGrid(panel);
        const finalUrl = opts?.onInsert ? opts.onInsert(url) : url;
        insertAtCursor(editor, `![${file.name}](${finalUrl})`);
      } catch (e) {
        console.error('Image add failed:', e);
        alert('Could not add image.');
      }
    }

    async function addFromUrl(url: string, name = 'image') {
      const item: RecentImage = { url, name, createdAt: Date.now(), persistent: true };
      recents = [item, ...recents.filter(r => r.url !== url)];
      saveRecents(recents);
      if (panel) renderGrid(panel);
      const finalUrl = opts?.onInsert ? opts.onInsert(url) : url;
      insertAtCursor(editor, `![${name}](${finalUrl})`);
    }

    function openPanel() {
      if (panel) { closePanel(); return; }

      panel = document.createElement('div');
      panel.className = 'mz-pop mz-im-panel';
      panel.innerHTML = `
        <div class="mz-im-row">
          <input class="mz-im-url" type="url" placeholder="https://example.com/image.png" />
          <button class="mz-im-addurl" type="button">Add URL</button>
          <input class="mz-im-file" type="file" accept="image/*" hidden />
          <button class="mz-im-upload" type="button">Upload</button>
          <button class="mz-im-clear" type="button" title="Clear recents">Clear</button>
        </div>
        <div class="mz-im-drop">Drop images here, or paste into the editor.</div>
        <div class="mz-im-grid"></div>
      `;
      document.body.appendChild(panel);

      // position panel
      const br = btn.getBoundingClientRect();
      panel.style.left = `${Math.round(window.scrollX + br.left)}px`;
      panel.style.top  = `${Math.round(window.scrollY + br.bottom + 6)}px`;

      // Wire buttons
      const urlIn  = panel.querySelector('.mz-im-url') as HTMLInputElement;
      const addUrl = panel.querySelector('.mz-im-addurl') as HTMLButtonElement;
      const fileIn = panel.querySelector('.mz-im-file') as HTMLInputElement;
      const upBtn  = panel.querySelector('.mz-im-upload') as HTMLButtonElement;
      const clrBtn = panel.querySelector('.mz-im-clear') as HTMLButtonElement;
      const drop   = panel.querySelector('.mz-im-drop') as HTMLElement;

      addUrl.onclick = () => {
        const val = urlIn.value.trim();
        if (!val) return;
        addFromUrl(val);
        urlIn.value = '';
      };

      upBtn.onclick = () => fileIn.click();
      fileIn.onchange = () => { const f = fileIn.files?.[0]; if (f) addFromFile(f); };

      clrBtn.onclick = () => {
        if (confirm('Clear recent images?')) {
          recents = [];
          saveRecents(recents);
          renderGrid(panel!);
        }
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

      // Render
      renderGrid(panel);

      // Close management
      setTimeout(() => {
        document.addEventListener('click', outsideClose, true);
        window.addEventListener('resize', closePanel);
        window.addEventListener('scroll', closePanel, true);
      }, 0);
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

    btn.onclick = openPanel;
    bar.appendChild(btn);
  };
}

// Minimal styles (inject once in your app)
export const imageManagerStyles = `
.mz-im-panel { width: 440px; max-width: calc(100vw - 24px); }
.mz-im-row { display: grid; grid-template-columns: 1fr auto auto auto; gap: 6px; margin-bottom: 8px; }
.mz-im-row input[type="url"] {
  background: var(--mz-ip-bg, #0f1216); color: var(--mz-ip-fg, #e7e7e7);
  border: 1px solid var(--mz-ip-bd, #2b2f36); border-radius: 8px; padding: 6px 8px;
}
.mz-im-row button {
  padding: 6px 10px; border-radius: 8px; border: 1px solid var(--mz-bd, #2b2f36);
  background: var(--mz-btn-bg, #1a1e24); color: var(--mz-btn-fg, #e7e7e7); cursor: pointer;
}
.mz-im-drop {
  border: 1px dashed var(--mz-drop-bd, #3b4350); border-radius: 8px;
  padding: 10px; text-align: center; font-size: 12px; margin-bottom: 8px;
  background: var(--mz-drop-bg, #0e1116);
}
.mz-im-drop.on { background: var(--mz-drop-on, #172033); }
.mz-im-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(92px, 1fr));
  gap: 8px; max-height: 320px; overflow: auto; padding: 2px;
}
.mz-im-card { border: 1px solid var(--mz-card-bd, #2b2f36); border-radius: 8px; overflow: hidden;
  background: var(--mz-card-bg, #12151a); display: flex; flex-direction: column; }
.mz-im-card img { width: 100%; height: 82px; object-fit: cover; display: block; }
.mz-im-actions { display: flex; gap: 6px; padding: 6px; justify-content: space-between; }
.mz-im-actions button {
  flex: 1; padding: 4px 6px; border-radius: 6px; border: 1px solid var(--mz-bd, #2b2f36);
  background: var(--mz-btn2-bg, #1b2027); color: var(--mz-btn2-fg, #e7e7e7); cursor: pointer; font-size: 12px;
}
`;