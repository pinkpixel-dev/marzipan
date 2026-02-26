// plugins/accentSwatchPlugin.ts
// Tiny recent-colors palette with Eyedropper support (if available).
// Persists to localStorage. No deps.

type MzEditor = {
  container: HTMLElement;
  textarea: HTMLTextAreaElement;
  updatePreview: () => void;
  // Optional if your core exposes it
  setAccent?: (hex: string) => void;
};

const LS_KEY = 'marzipan.accent.colors';

function normHex(hex: string): string | null {
  if (!hex) return null;
  let h = hex.trim().toLowerCase();
  if (!h.startsWith('#')) h = '#' + h;
  if (!/^#([0-9a-f]{3}|[0-9a-f]{6}|[0-9a-f]{8})$/.test(h)) return null;
  // Expand #abc -> #aabbcc
  if (h.length === 4) h = '#' + [...h.slice(1)].map(c => c + c).join('');
  return h;
}

function load(): string[] {
  try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); } catch { return []; }
}
function save(arr: string[]) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch { /* localStorage not available */ }
}

async function pickWithEyedropper(): Promise<string | null> {
  const anyWin = window as any;
  if (!anyWin.EyeDropper) return null;
  try {
    const eye = new anyWin.EyeDropper();
    const res = await eye.open();
    return normHex(res.sRGBHex);
  } catch { return null; }
}

function setAccent(editor: MzEditor, hex: string) {
  // Prefer core hook if you have one
  if (typeof editor.setAccent === 'function') editor.setAccent(hex);
  // Always set CSS var as a fallback
  document.documentElement.style.setProperty('--mz-accent', hex);
  editor.container.style.setProperty('--mz-accent', hex);
  // Broadcast (optional) for any listeners
  editor.container.dispatchEvent(new CustomEvent('marzipan:accent', { detail: { color: hex } }));
}

export function accentSwatchPlugin(opts?: {
  max?: number;              // max swatches to keep (default 12)
  defaults?: string[];       // seed colors if none saved
  title?: string;            // toolbar tooltip
  label?: string;            // toolbar button label/icon
}) {
  const max = Math.max(1, opts?.max ?? 12);
  const title = opts?.title ?? 'Accent color';
  const label = opts?.label ?? '⭘';

  return (editor: MzEditor) => {
    const bar = editor.container.querySelector('.marzipan-toolbar') as HTMLElement ?? editor.container;

    // Button that opens the palette popover
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'marzipan-toolbar-button mz-btn-accent';
    btn.title = title;
    btn.textContent = label;
    btn.setAttribute('aria-label', title);

    // Popover elements
    let pop: HTMLElement | null = null;
    let colors: string[] = load();
    if (!colors.length && opts?.defaults?.length) {
      colors = opts.defaults
        .map(normHex)
        .filter((x): x is string => !!x)
        .slice(0, max);
      save(colors);
    }

    function currentAccent(): string {
      const css = getComputedStyle(editor.container);
      const v = css.getPropertyValue('--mz-accent').trim() ||
                getComputedStyle(document.documentElement).getPropertyValue('--mz-accent').trim();
      return normHex(v) || '#8b5cf6'; // fallback purple
    }

    function ensureFront(hex: string) {
      colors = [hex, ...colors.filter(c => c !== hex)].slice(0, max);
      save(colors);
    }

    function closePop() {
      if (!pop) return;
      pop.remove(); pop = null;
      document.removeEventListener('click', outsideClose, true);
      window.removeEventListener('resize', closePop);
      window.removeEventListener('scroll', closePop, true);
    }

    function outsideClose(e: MouseEvent) {
      if (!pop) return;
      if (e.target instanceof Node && (pop.contains(e.target) || btn.contains(e.target))) return;
      closePop();
    }

    function render() {
      if (!pop) return;
      const grid = pop.querySelector('.mz-accent-grid') as HTMLElement;
      grid.innerHTML = '';

      const cur = currentAccent();

      // Existing swatches
      colors.forEach((hex, i) => {
        const sw = document.createElement('button');
        sw.type = 'button';
        sw.className = 'mz-swatch';
        sw.style.setProperty('--sw', hex);
        sw.title = hex;
        if (hex === cur) sw.classList.add('sel');
        sw.onclick = () => {
          setAccent(editor, hex);
          ensureFront(hex);
          render();
        };
        sw.oncontextmenu = (e) => {
          e.preventDefault();
          colors.splice(i, 1);
          save(colors);
          render();
        };
        grid.appendChild(sw);
      });

      // “+” swatch to add new color
      const plus = document.createElement('button');
      plus.type = 'button';
      plus.className = 'mz-swatch mz-swatch-add';
      plus.textContent = '+';
      plus.title = 'Add color (click to pick, ⇧click to type, ⌥click eyedropper)';
      plus.onclick = async (e) => {
        let hex: string | null = null;

        if (e.shiftKey) {
          hex = normHex(prompt('Enter hex color (#RRGGBB or RRGGBB):') || '');
        } else if (e.altKey) {
          hex = await pickWithEyedropper();
          if (!hex) hex = normHex(prompt('Enter hex color:') || '');
        } else {
          // Native color input for broad support
          const input = document.createElement('input');
          input.type = 'color';
          input.value = currentAccent();
          input.onchange = () => {
            const v = normHex(input.value);
            if (!v) return;
            setAccent(editor, v);
            ensureFront(v);
            render();
          };
          input.click();
          return;
        }

        if (hex) {
          setAccent(editor, hex);
          ensureFront(hex);
          render();
        }
      };
      grid.appendChild(plus);

      // Controls: “Use current”, “Reset”
      const useCur = pop.querySelector('.mz-accent-usecur') as HTMLButtonElement;
      useCur.onclick = () => {
        const hex = currentAccent();
        ensureFront(hex);
        render();
      };

      const reset = pop.querySelector('.mz-accent-reset') as HTMLButtonElement;
      reset.onclick = () => {
        if (!opts?.defaults?.length) { colors = []; save(colors); render(); return; }
        colors = opts.defaults.map(normHex).filter(Boolean) as string[];
        save(colors);
        render();
      };
    }

    function openPop() {
      if (pop) { closePop(); return; }

      pop = document.createElement('div');
      pop.className = 'mz-pop mz-accent-pop';
      pop.innerHTML = `
        <div class="mz-accent-grid"></div>
        <div class="mz-accent-row">
          <button type="button" class="mz-accent-usecur">Add current</button>
          <button type="button" class="mz-accent-reset">Reset</button>
        </div>
        <div class="mz-accent-hint">Tip: Right-click a swatch to remove. Alt-click “+” for eyedropper.</div>
      `;
      document.body.appendChild(pop);

      const r = btn.getBoundingClientRect();
      pop.style.position = 'absolute';
      pop.style.left = `${Math.round(window.scrollX + r.left)}px`;
      pop.style.top  = `${Math.round(window.scrollY + r.bottom + 6)}px`;

      render();

      setTimeout(() => {
        document.addEventListener('click', outsideClose, true);
        window.addEventListener('resize', closePop);
        window.addEventListener('scroll', closePop, true);
      }, 0);
    }

    btn.onclick = openPop;
    bar.appendChild(btn);

    // Initialize CSS var if missing
    if (!getComputedStyle(editor.container).getPropertyValue('--mz-accent').trim()) {
      const seed = colors[0] || opts?.defaults?.[0] || '#8b5cf6';
      setAccent(editor, seed);
    }
  };
}

// Minimal CSS you can inject once in your app
export const accentSwatchStyles = `
.mz-accent-pop { width: 280px; max-width: calc(100vw - 24px); }
.mz-accent-grid { display: grid; grid-template-columns: repeat(8, 28px); gap: 8px; padding: 6px; }
.mz-swatch {
  width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--mz-pop-bd, #333);
  background: var(--sw, #777); cursor: pointer; box-shadow: inset 0 0 0 2px rgba(0,0,0,.2);
}
.mz-swatch.sel { outline: 2px solid var(--mz-accent, #8b5cf6); outline-offset: 2px; }
.mz-swatch-add { background: linear-gradient(135deg, #222, #2b2f36); color: #e7e7e7;
  display:flex; align-items:center; justify-content:center; font-weight:700; }
.mz-accent-row { display:flex; gap:8px; padding: 6px; }
.mz-accent-row button {
  flex:1; padding:6px 8px; border-radius:8px; border:1px solid var(--mz-bd, #2b2f36);
  background: var(--mz-btn-bg, #1a1e24); color: var(--mz-btn-fg, #e7e7e7); cursor:pointer;
}
.mz-accent-hint { font-size: 12px; opacity: .7; padding: 0 6px 6px; }
`;