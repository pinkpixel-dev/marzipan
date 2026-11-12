// Shared popover + small form helpers for the built-in plugins.
// Popovers live on <body> (so the editor's CSS reset can't touch them),
// copy the editor's theme variables, and close on outside click, Escape,
// resize, or scrolling anything outside the popover.

/** Theme variables copied from the editor container onto the popover */
const THEME_VARS = [
  '--bg-primary',
  '--bg-secondary',
  '--text',
  '--border',
  '--toolbar-bg',
  '--toolbar-hover',
  '--toolbar-border',
  '--toolbar-icon',
  '--h1',
  '--link',
];

export interface PopoverOptions {
  /** Accessible name for the dialog */
  label: string;
  /** Extra class names for plugin-specific styling */
  className?: string;
  /** Called after the popover closes, however it closed */
  onClose?: () => void;
}

export interface Popover {
  el: HTMLDivElement;
  close: () => void;
  /** Re-align under the anchor (call after the content changes size) */
  reposition: () => void;
}

const openPopovers = new WeakMap<HTMLElement, Popover>();

/**
 * Open a popover under `anchor`, or close it if it's already open.
 * `build` fills the popover before it's shown. Returns the popover, or null when it was closed.
 */
export function togglePopover(
  anchor: HTMLElement,
  options: PopoverOptions,
  build: (pop: Popover) => void,
): Popover | null {
  const existing = openPopovers.get(anchor);
  if (existing) {
    existing.close();
    return null;
  }

  const el = document.createElement('div');
  el.className = options.className ? `mz-pop ${options.className}` : 'mz-pop';
  el.setAttribute('role', 'dialog');
  el.setAttribute('aria-label', options.label);

  const host = anchor.closest<HTMLElement>('.marzipan-container');
  if (host) {
    const computed = getComputedStyle(host);
    for (const name of THEME_VARS) {
      const value = computed.getPropertyValue(name).trim();
      if (value) el.style.setProperty(name, value);
    }
    const theme = host.getAttribute('data-theme');
    if (theme) el.dataset.theme = theme;
  }

  let closed = false;

  const reposition = () => {
    const rect = anchor.getBoundingClientRect();
    const width = el.offsetWidth;
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8));
    el.style.left = `${Math.round(left)}px`;
    el.style.top = `${Math.round(rect.bottom + 6)}px`;
  };

  const onPointerDown = (e: Event) => {
    const target = e.target;
    if (target instanceof Node && (el.contains(target) || anchor.contains(target))) return;
    close();
  };
  const onScroll = (e: Event) => {
    if (e.target instanceof Node && el.contains(e.target)) return;
    close();
  };
  const onKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') return;
    e.preventDefault();
    e.stopPropagation();
    close();
  };

  function close() {
    if (closed) return;
    closed = true;
    const hadFocus = el.contains(document.activeElement);
    el.remove();
    openPopovers.delete(anchor);
    anchor.setAttribute('aria-expanded', 'false');
    document.removeEventListener('pointerdown', onPointerDown, true);
    window.removeEventListener('resize', close);
    window.removeEventListener('scroll', onScroll, true);
    options.onClose?.();
    if (hadFocus && anchor.isConnected) anchor.focus();
  }

  const pop: Popover = { el, close, reposition };
  openPopovers.set(anchor, pop);
  build(pop);

  document.body.appendChild(el);
  reposition();

  anchor.setAttribute('aria-haspopup', 'dialog');
  anchor.setAttribute('aria-expanded', 'true');
  el.addEventListener('keydown', onKeydown);
  document.addEventListener('pointerdown', onPointerDown, true);
  window.addEventListener('resize', close);
  window.addEventListener('scroll', onScroll, true);

  el.querySelector<HTMLElement>('[data-autofocus], input, select, button')?.focus();
  return pop;
}

/** A labelled input, styled to match the popover */
export function createField(
  label: string,
  attrs: { type?: string; value?: string; placeholder?: string; min?: number; max?: number } = {},
): { field: HTMLLabelElement; input: HTMLInputElement } {
  const field = document.createElement('label');
  field.className = 'mz-field';
  const text = document.createElement('span');
  text.textContent = label;
  const input = document.createElement('input');
  input.className = 'mz-input';
  input.type = attrs.type ?? 'text';
  if (attrs.value !== undefined) input.value = attrs.value;
  if (attrs.placeholder !== undefined) input.placeholder = attrs.placeholder;
  if (attrs.min !== undefined) input.min = String(attrs.min);
  if (attrs.max !== undefined) input.max = String(attrs.max);
  field.append(text, input);
  return { field, input };
}

/** A popover button. `primary` buttons submit their form. */
export function createButton(text: string, variant: 'primary' | 'default' = 'default'): HTMLButtonElement {
  const button = document.createElement('button');
  button.type = variant === 'primary' ? 'submit' : 'button';
  button.className = variant === 'primary' ? 'mz-button mz-button-primary' : 'mz-button';
  button.textContent = text;
  return button;
}

/** A status line for inline errors and hints, announced to screen readers */
export function createStatus(): HTMLDivElement {
  const status = document.createElement('div');
  status.className = 'mz-status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');
  return status;
}

/** Keep a file name from breaking the ![alt](url) syntax */
export function safeAlt(name: string): string {
  return name.replace(/[[\]\\\n\r]/g, '').trim() || 'image';
}
