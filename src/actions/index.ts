import { FORMATS, mergeWithDefaults } from './core/formats';
import { insertText, setUndoMethod, getUndoMethod } from './core/insertion';
import { applyLineOperation, isMultipleLines, preserveSelection } from './core/selection';
import { blockStyle, multilineStyle } from './operations/block';
import { applyListStyle } from './operations/list';
import { expandSelection, getActiveFormats, hasFormat } from './core/detection';
import {
  debugLog,
  debugResult,
  debugSelection,
  getDebugMode,
  setDebugMode,
} from './debug';
import type { FormatStyleOptions, ResolvedFormatStyle, TextTransformResult } from './types';

export interface LinkOptions {
  url?: string;
  text?: string;
}

function ensureEditable(textarea: HTMLTextAreaElement | null): textarea is HTMLTextAreaElement {
  return !!textarea && !textarea.disabled && !textarea.readOnly;
}

export function toggleBold(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;

  debugLog('toggleBold', 'Starting');
  debugSelection(textarea, 'Before');

  const style = mergeWithDefaults(FORMATS.bold);
  const result = blockStyle(textarea, style);

  debugResult(result);
  insertText(textarea, result);
  debugSelection(textarea, 'After');
}

export function toggleItalic(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;
  const style = mergeWithDefaults(FORMATS.italic);
  const result = blockStyle(textarea, style);
  insertText(textarea, result);
}

export function toggleCode(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;

  const style = mergeWithDefaults(FORMATS.code);
  const result = blockStyle(textarea, style);
  insertText(textarea, result);
}

export function insertLink(textarea: HTMLTextAreaElement | null, options: LinkOptions = {}): void {
  if (!ensureEditable(textarea)) return;

  const selectedText = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
  let style = mergeWithDefaults(FORMATS.link);

  const isURL = selectedText && /^https?:\/\//.test(selectedText);

  if (isURL && !options.url) {
    style = {
      ...style,
      suffix: `](${selectedText})`,
      replaceNext: '',
    } satisfies ResolvedFormatStyle;
  } else if (options.url) {
    style = {
      ...style,
      suffix: `](${options.url})`,
      replaceNext: '',
    } satisfies ResolvedFormatStyle;
  }

  if (options.text && !selectedText) {
    const pos = textarea.selectionStart;
    textarea.value = textarea.value.slice(0, pos) + options.text + textarea.value.slice(pos);
    textarea.selectionStart = pos;
    textarea.selectionEnd = pos + options.text.length;
  }

  const result = blockStyle(textarea, style);
  insertText(textarea, result);
}

export function toggleBulletList(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;
  const style = mergeWithDefaults(FORMATS.bulletList);
  applyListStyle(textarea, style);
}

export function toggleNumberedList(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;
  const style = mergeWithDefaults(FORMATS.numberedList);
  applyListStyle(textarea, style);
}

export function toggleQuote(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;

  debugLog('toggleQuote', 'Starting');
  debugSelection(textarea, 'Initial');

  const style = mergeWithDefaults(FORMATS.quote);

  const result = applyLineOperation(
    textarea,
    (ta) => multilineStyle(ta, style),
    { prefix: style.prefix },
  );

  debugResult(result);
  insertText(textarea, result);
  debugSelection(textarea, 'Final');
}

export function toggleTaskList(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;

  const style = mergeWithDefaults(FORMATS.taskList);

  const result = applyLineOperation(
    textarea,
    (ta) => multilineStyle(ta, style),
    { prefix: style.prefix },
  );

  insertText(textarea, result);
}

export function toggleStrikethrough(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;
  const style = mergeWithDefaults(FORMATS.strikethrough);
  const result = blockStyle(textarea, style);
  insertText(textarea, result);
}

export function insertHorizontalRule(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;
  const pos = textarea.selectionStart;
  const val = textarea.value;
  const before = val.slice(0, pos);
  const prefix = before.length > 0 && !before.endsWith('\n') ? '\n' : '';
  const text = prefix + '\n---\n\n';
  textarea.setRangeText(text, pos, textarea.selectionEnd, 'end');
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
}

function findLineBoundaries(value: string, start: number, end: number): { lineStart: number; lineEnd: number } {
  let lineStart = start;
  while (lineStart > 0 && value[lineStart - 1] !== '\n') {
    lineStart -= 1;
  }

  let lineEnd = end;
  while (lineEnd < value.length && value[lineEnd] !== '\n') {
    lineEnd += 1;
  }

  return { lineStart, lineEnd };
}

export function insertHeader(
  textarea: HTMLTextAreaElement | null,
  level: number = 1,
  toggle = false,
): void {
  if (!ensureEditable(textarea)) return;
  if (level < 1 || level > 6) level = 1;

  debugLog('insertHeader', '============ START ============');
  debugLog('insertHeader', `Level: ${level}, Toggle: ${toggle}`);
  debugLog('insertHeader', `Initial cursor: ${textarea.selectionStart}-${textarea.selectionEnd}`);

  const headerKey = `header${level === 1 ? '1' : level}` as keyof typeof FORMATS;
  const style = mergeWithDefaults(FORMATS[headerKey] || FORMATS.header1);
  debugLog('insertHeader', `Style prefix: "${style.prefix}"`);

  const value = textarea.value;
  const originalStart = textarea.selectionStart;
  const originalEnd = textarea.selectionEnd;

  const { lineStart, lineEnd } = findLineBoundaries(value, originalStart, originalEnd);

  const currentLineContent = value.slice(lineStart, lineEnd);
  debugLog('insertHeader', `Current line (before): "${currentLineContent}"`);

  const existingHeaderMatch = currentLineContent.match(/^(#{1,6})\s*/);
  const existingLevel = existingHeaderMatch ? existingHeaderMatch[1]!.length : 0;
  const existingPrefixLength = existingHeaderMatch ? existingHeaderMatch[0]!.length : 0;

  debugLog('insertHeader', `Existing header match: ${existingHeaderMatch ? existingHeaderMatch[0] : 'none'}`);
  debugLog('insertHeader', `Existing level: ${existingLevel}`);
  debugLog('insertHeader', `Target level: ${level}`);

  const shouldToggleOff = toggle && existingLevel === level;
  debugLog('insertHeader', `Should toggle OFF: ${shouldToggleOff}`);

  const result = applyLineOperation(
    textarea,
    (ta) => {
      const currentLine = ta.value.slice(ta.selectionStart, ta.selectionEnd);
      debugLog('insertHeader', `Line in operation: "${currentLine}"`);

      const cleanedLine = currentLine.replace(/^#{1,6}\s*/, '');
      debugLog('insertHeader', `Cleaned line: "${cleanedLine}"`);

      let newLine: string;

      if (shouldToggleOff) {
        debugLog('insertHeader', 'ACTION: Toggling OFF - removing header');
        newLine = cleanedLine;
      } else if (existingLevel > 0) {
        debugLog('insertHeader', `ACTION: Replacing H${existingLevel} with H${level}`);
        newLine = style.prefix + cleanedLine;
      } else {
        debugLog('insertHeader', 'ACTION: Adding new header');
        newLine = style.prefix + cleanedLine;
      }

      debugLog('insertHeader', `New line: "${newLine}"`);

      return {
        text: newLine,
        selectionStart: ta.selectionStart,
        selectionEnd: ta.selectionEnd,
      } satisfies TextTransformResult;
    },
    {
      prefix: style.prefix,
      adjustSelection: (_isRemoving, selStart, selEnd) => {
        debugLog('insertHeader', `Adjusting selection with existing prefix length ${existingPrefixLength}`);

        if (shouldToggleOff) {
          const adjustment = Math.max(selStart - existingPrefixLength, lineStart);
          return {
            start: adjustment,
            end: selStart === selEnd
              ? adjustment
              : Math.max(selEnd - existingPrefixLength, lineStart),
          };
        }

        if (existingPrefixLength > 0) {
          const prefixDiff = style.prefix.length - existingPrefixLength;
          return {
            start: selStart + prefixDiff,
            end: selEnd + prefixDiff,
          };
        }

        return {
          start: selStart + style.prefix.length,
          end: selEnd + style.prefix.length,
        };
      },
    },
  );

  debugResult(result);
  debugLog('insertHeader', `============ END ============`);

  insertText(textarea, result);
}

export function toggleH1(textarea: HTMLTextAreaElement | null): void {
  insertHeader(textarea, 1, true);
}

export function toggleH2(textarea: HTMLTextAreaElement | null): void {
  insertHeader(textarea, 2, true);
}

export function toggleH3(textarea: HTMLTextAreaElement | null): void {
  insertHeader(textarea, 3, true);
}

export { getActiveFormats, hasFormat, expandSelection, preserveSelection, setDebugMode, getDebugMode, setUndoMethod, getUndoMethod };

export function applyCustomFormat(textarea: HTMLTextAreaElement | null, format: FormatStyleOptions): void {
  if (!ensureEditable(textarea)) return;

  const style = mergeWithDefaults(format);
  let result: TextTransformResult;

  if (style.multiline) {
    const selectedText = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd);
    if (isMultipleLines(selectedText)) {
      result = multilineStyle(textarea, style);
    } else {
      result = blockStyle(textarea, style);
    }
  } else {
    result = blockStyle(textarea, style);
  }

  insertText(textarea, result);
}

export const actions = {
  toggleBold,
  toggleItalic,
  toggleCode,
  toggleStrikethrough,
  insertLink,
  insertHorizontalRule,
  toggleBulletList,
  toggleNumberedList,
  toggleQuote,
  toggleTaskList,
  insertHeader,
  toggleH1,
  toggleH2,
  toggleH3,
  getActiveFormats,
  hasFormat,
  expandSelection,
  applyCustomFormat,
  preserveSelection,
  setUndoMethod,
  setDebugMode,
  getDebugMode,
};

export type MarkdownActions = typeof actions;

export default actions;
