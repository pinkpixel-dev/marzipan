import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Marzipan } from '../src/marzipan';
import type { Options } from '../src/types';

type Editor = Marzipan;

function makeEditor(options: Record<string, unknown> = {}, inner = '') {
  const host = document.createElement('div');
  host.innerHTML = inner;
  document.body.appendChild(host);
  const [editor] = new Marzipan(host, options as Options);
  return { host, editor };
}

const press = (editor: Editor, key: string, extra: KeyboardEventInit = {}) => {
  const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...extra });
  editor.textarea.dispatchEvent(event);
  return event;
};

beforeEach(() => {
  Marzipan.destroyAll();
  document.body.innerHTML = '';
});

describe('lifecycle', () => {
  it('destroyAll destroys every instance', () => {
    const a = makeEditor().editor;
    const b = makeEditor().editor;
    Marzipan.destroyAll();
    expect(a.isInitialized()).toBe(false);
    expect(b.isInitialized()).toBe(false);
  });

  it('uses options.value when the host only has whitespace', () => {
    const { editor } = makeEditor({ value: 'hello' }, '\n   \n');
    expect(editor.getValue()).toBe('hello');
  });

  it('passes the placeholder option to the textarea', () => {
    const { editor } = makeEditor({ placeholder: 'Write here' });
    expect(editor.textarea.placeholder).toBe('Write here');
  });
});

describe('onChange', () => {
  it('fires for content changes, not for re-renders', () => {
    const onChange = vi.fn();
    const { editor } = makeEditor({ value: 'abc', onChange });
    onChange.mockClear();
    editor.updatePreview();
    editor.updatePreview();
    expect(onChange).not.toHaveBeenCalled();
    editor.setValue('abcd');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});

describe('Tab key', () => {
  it('indents every selected line from the line start', () => {
    const { editor } = makeEditor({ value: 'one\ntwo\nthree' });
    editor.textarea.setSelectionRange(1, 6); // "ne\ntw"
    press(editor, 'Tab');
    expect(editor.getValue()).toBe('  one\n  two\nthree');
  });

  it('Shift+Tab outdents the current line with no selection', () => {
    const { editor } = makeEditor({ value: '    item' });
    editor.textarea.setSelectionRange(6, 6);
    press(editor, 'Tab', { shiftKey: true });
    expect(editor.getValue()).toBe('  item');
    expect(editor.textarea.selectionStart).toBe(4);
  });

  it('Escape then Tab lets focus leave the editor', () => {
    const { editor } = makeEditor({ value: 'x' });
    press(editor, 'Escape');
    const tab = press(editor, 'Tab');
    expect(tab.defaultPrevented).toBe(false);
    expect(editor.getValue()).toBe('x');
  });
});

describe('numbered lists', () => {
  it('renumbers only the list under the cursor and keeps its start', () => {
    const value = '3. a\n3. b\n\ntext\n\n1. x\n1. y';
    const { editor } = makeEditor({ value });
    editor.textarea.setSelectionRange(9, 9); // end of "3. b"
    editor.updateNumberedLists();
    expect(editor.getValue()).toBe('3. a\n4. b\n\ntext\n\n1. x\n1. y');
  });
});

describe('export', () => {
  it('getCleanHTML drops image syntax and editor metadata', () => {
    const { editor } = makeEditor({ value: '![alt text](a.png) [l](https://x.com)' });
    const html = editor.getCleanHTML();
    const el = document.createElement('div');
    el.innerHTML = html;
    expect(el.querySelector('img')?.getAttribute('alt')).toBe('alt text');
    expect(el.textContent).not.toContain('alt text');
    expect(html).not.toContain('data-mz-line');
  });
});
