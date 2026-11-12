import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Marzipan } from '../src/marzipan';
import type { Options } from '../src/types';
import { tablePlugin } from '../src/plugins/tablePlugin';
import { tableGeneratorPlugin } from '../src/plugins/tableGenerator';
import { imagePickerPlugin } from '../src/plugins/imagePicker';
import { imageManagerPlugin } from '../src/plugins/imageManagerPlugin';
import { tinyHighlightPlugin } from '../src/plugins/tinyHighlight';

function makeEditor(options: Options = {}) {
  const host = document.createElement('div');
  document.body.appendChild(host);
  const [editor] = new Marzipan(host, options);
  return editor;
}

const pluginButton = (editor: Marzipan, cls: string) =>
  editor.container.querySelector<HTMLButtonElement>(`.${cls}`)!;

const submit = (form: HTMLFormElement) =>
  form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));

let promptSpy: ReturnType<typeof vi.fn>;
let confirmSpy: ReturnType<typeof vi.fn>;

beforeEach(() => {
  Marzipan.destroyAll();
  document.body.innerHTML = '';
  // happy-dom has no prompt()/confirm(); stub them so a stray call fails loudly
  promptSpy = vi.fn(() => { throw new Error('prompt() should not be called'); });
  confirmSpy = vi.fn(() => { throw new Error('confirm() should not be called'); });
  vi.stubGlobal('prompt', promptSpy);
  vi.stubGlobal('confirm', confirmSpy);
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('editor plugin API', () => {
  it('addHook runs after each render and survives reinit()', () => {
    const editor = makeEditor({ value: 'a' });
    const hook = vi.fn();
    const remove = editor.addHook('afterPreviewRender', hook);

    editor.setValue('b');
    expect(hook).toHaveBeenCalledWith(editor.preview, editor);

    // Passing new hooks used to drop every plugin hook
    editor.reinit({ hooks: { afterPreviewRender: () => {} } });
    hook.mockClear();
    editor.setValue('c');
    expect(hook).toHaveBeenCalledTimes(1);

    remove();
    hook.mockClear();
    editor.setValue('d');
    expect(hook).not.toHaveBeenCalled();
  });

  it('a throwing hook does not stop the others', () => {
    const editor = makeEditor();
    const errors = vi.spyOn(console, 'error').mockImplementation(() => {});
    const after = vi.fn();
    editor.addHook('afterPreviewRender', () => { throw new Error('boom'); });
    editor.addHook('afterPreviewRender', after);
    editor.setValue('x');
    expect(after).toHaveBeenCalled();
    errors.mockRestore();
  });

  it('insertText replaces the selection and re-renders', () => {
    const editor = makeEditor({ value: 'hello world' });
    editor.textarea.setSelectionRange(6, 11);
    editor.insertText('**there**');
    expect(editor.getValue()).toBe('hello **there**');
    expect(editor.preview.querySelector('strong')).not.toBeNull();
  });

  it('addToolbarButton creates a plugin toolbar when the toolbar is off', () => {
    const editor = makeEditor({ toolbar: false });
    const onClick = vi.fn();
    const button = editor.addToolbarButton({ title: 'Do thing', label: '★', onClick });
    expect(button.closest('.marzipan-toolbar')).not.toBeNull();
    expect(button.getAttribute('aria-label')).toBe('Do thing');
    // Sits above the editor
    expect(editor.container.firstElementChild?.classList.contains('marzipan-toolbar')).toBe(true);
    button.click();
    expect(onClick).toHaveBeenCalledWith(button, editor);
  });

  it('plugin hooks keep working after reinit with new hooks', () => {
    const editor = makeEditor({ value: '```js\nconst a = 1;\n```', plugins: [tinyHighlightPlugin()] });
    editor.reinit({ hooks: { afterPreviewRender: () => {} } });
    editor.setValue('```js\nconst b = 2;\n```');
    expect(editor.preview.querySelector('.tok')).not.toBeNull();
  });
});

describe('popover behavior', () => {
  it('toggles, closes on Escape and returns focus to the button', () => {
    const editor = makeEditor({ toolbar: true, plugins: [tablePlugin()] });
    const button = pluginButton(editor, 'mz-btn-table');

    button.click();
    const pop = document.querySelector<HTMLElement>('.mz-pop')!;
    expect(pop.getAttribute('role')).toBe('dialog');
    expect(button.getAttribute('aria-expanded')).toBe('true');
    expect(document.activeElement).toBe(pop.querySelector('input'));

    pop.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(document.querySelector('.mz-pop')).toBeNull();
    expect(button.getAttribute('aria-expanded')).toBe('false');
    expect(document.activeElement).toBe(button);

    button.click();
    button.click();
    expect(document.querySelector('.mz-pop')).toBeNull();
  });

  it('closes on an outside pointerdown', () => {
    const editor = makeEditor({ toolbar: true, plugins: [tablePlugin()] });
    pluginButton(editor, 'mz-btn-table').click();
    document.body.dispatchEvent(new Event('pointerdown', { bubbles: true }));
    expect(document.querySelector('.mz-pop')).toBeNull();
  });
});

describe('table plugins', () => {
  it('tablePlugin inserts a table from the form, without prompt()', () => {
    const editor = makeEditor({ toolbar: true, plugins: [tablePlugin()] });
    pluginButton(editor, 'mz-btn-table').click();

    const [rows, cols] = Array.from(document.querySelectorAll<HTMLInputElement>('.mz-pop input'));
    rows.value = '3';
    cols.value = '2';
    submit(document.querySelector<HTMLFormElement>('.mz-pop form')!);

    const lines = editor.getValue().trim().split('\n');
    expect(lines[0]).toContain('Header 1');
    expect(lines[0]).toContain('Header 2');
    expect(lines).toHaveLength(2 + 3); // header + divider + 3 body rows
    expect(document.querySelector('.mz-pop')).toBeNull();
    expect(promptSpy).not.toHaveBeenCalled();
  });

  it('tableGeneratorPlugin is the same plugin', () => {
    const editor = makeEditor({ toolbar: false, plugins: [tableGeneratorPlugin()] });
    pluginButton(editor, 'mz-btn-table').click();
    submit(document.querySelector<HTMLFormElement>('.mz-pop form')!);
    expect(editor.getValue()).toContain('| Header 1 | Header 2 |');
  });
});

describe('image plugins', () => {
  it('imagePickerPlugin inserts a URL with alt text', () => {
    const editor = makeEditor({ toolbar: true, plugins: [imagePickerPlugin()] });
    pluginButton(editor, 'mz-btn-image').click();
    const [url, alt] = Array.from(document.querySelectorAll<HTMLInputElement>('.mz-pop input:not([type=file])'));
    url.value = 'https://example.com/cat.png';
    alt.value = 'A [cat]';
    submit(document.querySelector<HTMLFormElement>('.mz-pop form')!);
    expect(editor.getValue()).toBe('![A cat](https://example.com/cat.png)');
  });

  it('imagePickerPlugin shows an inline error for an empty URL', () => {
    const editor = makeEditor({ toolbar: true, plugins: [imagePickerPlugin()] });
    pluginButton(editor, 'mz-btn-image').click();
    submit(document.querySelector<HTMLFormElement>('.mz-pop form')!);
    expect(document.querySelector('.mz-status')?.textContent).toMatch(/URL/);
    expect(document.querySelector('.mz-pop')).not.toBeNull();
    expect(editor.getValue()).toBe('');
  });

  it('imageManagerPlugin clears recents only after a second click', () => {
    localStorage.setItem('mz-test-recents', JSON.stringify([
      { url: 'https://example.com/a.png', name: 'a.png', createdAt: 1, persistent: true },
    ]));
    const editor = makeEditor({ toolbar: true, plugins: [imageManagerPlugin({ storageKey: 'mz-test-recents' })] });
    pluginButton(editor, 'mz-btn-imagemgr').click();

    expect(document.querySelectorAll('.mz-im-card')).toHaveLength(1);
    const clear = document.querySelector<HTMLButtonElement>('.mz-im-clear')!;
    clear.click();
    expect(document.querySelectorAll('.mz-im-card')).toHaveLength(1);
    expect(clear.textContent).toBe('Confirm');
    clear.click();
    expect(document.querySelectorAll('.mz-im-card')).toHaveLength(0);
    expect(JSON.parse(localStorage.getItem('mz-test-recents') || '[]')).toEqual([]);
    expect(confirmSpy).not.toHaveBeenCalled();
  });

  it('imageManagerPlugin inserts a recent image', () => {
    localStorage.setItem('mz-test-recents-2', JSON.stringify([
      { url: 'https://example.com/b.png', name: 'b.png', createdAt: 1, persistent: true },
    ]));
    const editor = makeEditor({ toolbar: true, plugins: [imageManagerPlugin({ storageKey: 'mz-test-recents-2' })] });
    pluginButton(editor, 'mz-btn-imagemgr').click();
    document.querySelector<HTMLButtonElement>('.mz-im-actions button')!.click();
    expect(editor.getValue()).toBe('![b.png](https://example.com/b.png)');
    expect(document.querySelector('.mz-pop')).toBeNull();
  });
});
