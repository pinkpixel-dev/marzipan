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

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function setAccent(editor: MzEditor, hex: string, btnIndicator?: HTMLElement | null) {
  // Prefer core hook if you have one
  if (typeof editor.setAccent === 'function') editor.setAccent(hex);
  // Always set CSS var
  document.documentElement.style.setProperty('--mz-accent', hex);
  editor.container.style.setProperty('--mz-accent', hex);
  // Bridge accent to actual editor CSS variables for visible effect
  editor.container.style.setProperty('--cursor', hex);
  editor.container.style.setProperty('--selection', hexToRgba(hex, 0.25));
  editor.container.style.setProperty('--toolbar-active', hexToRgba(hex, 0.2));
  editor.container.style.setProperty('--link', hex);
  // Update toolbar button indicator
  if (btnIndicator) btnIndicator.style.background = hex;
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

  return (editor: MzEditor) => {
    const bar = editor.container.querySelector('.marzipan-toolbar') as HTMLElement ?? editor.container;

    // Button that opens the palette popover
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'marzipan-toolbar-button mz-btn-accent';
    btn.title = title;
    btn.setAttribute('aria-label', title);
    // Colored dot indicator instead of plain text
    const indicator = document.createElement('span');
    indicator.className = 'mz-accent-indicator';
    Object.assign(indicator.style, {
      display: 'block',
      width: '16px',
      height: '16px',
      borderRadius: '50%',
      border: '2px solid rgba(255,255,255,0.25)',
      background: '#8b5cf6',
      boxSizing: 'border-box',
      flexShrink: '0',
    });
    btn.appendChild(indicator);

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
        Object.assign(sw.style, {
          width: '28px', height: '28px', borderRadius: '50%',
          border: '1px solid #333', background: hex, cursor: 'pointer',
          boxShadow: 'inset 0 0 0 2px rgba(0,0,0,.2)',
          padding: '0', margin: '0', boxSizing: 'border-box',
        });
        if (hex === cur) sw.style.outline = '2px solid var(--mz-accent, #8b5cf6)';
        sw.title = hex;
        sw.onclick = () => {
          setAccent(editor, hex, indicator);
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
      Object.assign(plus.style, {
        width: '28px', height: '28px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #222, #2b2f36)', color: '#e7e7e7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontWeight: '700', fontSize: '16px', cursor: 'pointer',
        border: '1px solid #333', padding: '0', margin: '0', boxSizing: 'border-box',
      });
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
            setAccent(editor, v, indicator);
            ensureFront(v);
            render();
          };
          input.click();
          return;
        }

        if (hex) {
          setAccent(editor, hex, indicator);
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

      // Apply critical styles inline to avoid CSS framework resets (e.g. Tailwind)
      const r = btn.getBoundingClientRect();
      Object.assign(pop.style, {
        position: 'absolute',
        left: `${Math.round(window.scrollX + r.left)}px`,
        top: `${Math.round(window.scrollY + r.bottom + 6)}px`,
        width: '280px',
        maxWidth: 'calc(100vw - 24px)',
        background: '#1a1e24',
        border: '1px solid #333',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0,0,0,.35)',
        zIndex: '10000',
        padding: '8px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '14px',
        color: '#e7e7e7',
        boxSizing: 'border-box',
      });

      // Style inner elements inline to survive CSS resets
      const grid = pop.querySelector('.mz-accent-grid') as HTMLElement;
      if (grid) Object.assign(grid.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, 28px)',
        gap: '8px',
        padding: '6px',
      });
      const row = pop.querySelector('.mz-accent-row') as HTMLElement;
      if (row) Object.assign(row.style, { display: 'flex', gap: '8px', padding: '6px' });
      pop.querySelectorAll('.mz-accent-row button').forEach(b => {
        Object.assign((b as HTMLElement).style, {
          flex: '1',
          padding: '6px 8px',
          borderRadius: '8px',
          border: '1px solid #2b2f36',
          background: '#1a1e24',
          color: '#e7e7e7',
          cursor: 'pointer',
          fontSize: '13px',
          fontFamily: 'inherit',
        });
      });
      const hint = pop.querySelector('.mz-accent-hint') as HTMLElement;
      if (hint) Object.assign(hint.style, { fontSize: '12px', opacity: '0.7', padding: '0 6px 6px' });

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
      setAccent(editor, seed, indicator);
    }
    // Always sync the indicator to the current accent
    indicator.style.background = currentAccent();
  };
}

// Minimal CSS you can inject once in your app
export const accentSwatchStyles = `
.mz-accent-pop {
  width: 280px; max-width: calc(100vw - 24px);
  background: var(--mz-pop-bg, #1a1e24);
  border: 1px solid var(--mz-pop-bd, #333);
  border-radius: 10px;
  box-shadow: 0 4px 16px rgba(0,0,0,.35);
  z-index: 10000;
  padding: 8px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 14px;
  color: var(--mz-pop-fg, #e7e7e7);
}
.mz-accent-grid { display: grid; grid-template-columns: repeat(auto-fill, 28px); gap: 8px; padding: 6px; }
.mz-swatch {
  width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--mz-pop-bd, #333);
  background: var(--sw, #777); cursor: pointer; box-shadow: inset 0 0 0 2px rgba(0,0,0,.2);
  transition: transform .1s;
}
.mz-swatch:hover { transform: scale(1.15); }
.mz-swatch.sel { outline: 2px solid var(--mz-accent, #8b5cf6); outline-offset: 2px; }
.mz-swatch-add { background: linear-gradient(135deg, #222, #2b2f36); color: #e7e7e7;
  display:flex; align-items:center; justify-content:center; font-weight:700; font-size:16px; }
.mz-accent-row { display:flex; gap:8px; padding: 6px; }
.mz-accent-row button {
  flex:1; padding:6px 8px; border-radius:8px; border:1px solid var(--mz-bd, #2b2f36);
  background: var(--mz-btn-bg, #1a1e24); color: var(--mz-btn-fg, #e7e7e7); cursor:pointer;
  font-size: 13px; transition: background .15s;
}
.mz-accent-row button:hover { background: var(--mz-btn-hover, #2b2f36); }
.mz-accent-hint { font-size: 12px; opacity: .7; padding: 0 6px 6px; }
`;