#!/usr/bin/env node
import { copyFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '..');

// Copy the manually maintained marzipan.d.ts to dist
// This ensures the correct type definitions are used
copyFileSync(
  join(rootDir, 'src', 'marzipan.d.ts'),
  join(rootDir, 'dist', 'marzipan.d.ts')
);

// Create index.d.ts that re-exports from marzipan.d.ts and other modules
const indexDts = `// Type definitions for @pinkpixel/marzipan
// Project: https://github.com/pinkpixel-dev/marzipan
// Definitions by: Pink Pixel <https://pinkpixel.dev>

// Re-export all types from main declarations
export * from './marzipan.d';

// Re-export default
export { default } from './marzipan.d';

// Action types (these should match actions/types.ts exports)
export interface FormatStyleOptions {
  prefix?: string;
  suffix?: string;
  blockPrefix?: string;
  blockSuffix?: string;
  multiline?: boolean;
  replaceNext?: string;
  prefixSpace?: boolean;
  scanFor?: string | RegExp;
  surroundWithNewlines?: boolean;
  orderedList?: boolean;
  unorderedList?: boolean;
  trimFirst?: boolean;
}

export interface ResolvedFormatStyle {
  prefix: string;
  suffix: string;
  blockPrefix: string;
  blockSuffix: string;
  multiline: boolean;
  replaceNext: string;
  prefixSpace: boolean;
  scanFor: string | RegExp | null;
  surroundWithNewlines: boolean;
  orderedList: boolean;
  unorderedList: boolean;
  trimFirst: boolean;
}

export interface TextTransformResult {
  text: string;
  selectionStart: number;
  selectionEnd: number;
}

export type UndoMethod = 'native' | 'manual' | 'auto';

export interface LineOperationAdjustment {
  start: number;
  end: number;
}

export interface LineOperationOptions {
  prefix?: string;
  adjustSelection?: (
    isRemoving: boolean,
    selectionStart: number,
    selectionEnd: number,
    lineStart: number
  ) => LineOperationAdjustment;
}

// Theme utilities
export interface Theme {
  name: string;
  colors: ThemeColors;
}

export interface ThemeColors {
  bgPrimary?: string;
  bgSecondary?: string;
  text?: string;
  textSecondary?: string;
  h1?: string;
  h2?: string;
  h3?: string;
  strong?: string;
  em?: string;
  link?: string;
  code?: string;
  codeBg?: string;
  blockquote?: string;
  hr?: string;
  syntaxMarker?: string;
  listMarker?: string;
  cursor?: string;
  selection?: string;
  rawLine?: string;
  toolbarBg?: string;
  toolbarBorder?: string;
  toolbarIcon?: string;
  toolbarHover?: string;
  toolbarActive?: string;
  border?: string;
}

// Built-in themes
export declare const solar: Theme;
export declare const cave: Theme;
export declare const themes: {
  solar: Theme;
  cave: Theme;
  light: Theme;
  dark: Theme;
};

// Theme utility functions
export declare function getTheme(theme: string | Theme): Theme;
export declare function themeToCSSVars(colors: ThemeColors): string;
export declare function mergeTheme(baseTheme: Theme, customColors?: Partial<ThemeColors>): Theme;

// Markdown actions
export interface LinkOptions {
  url?: string;
  text?: string;
}

export interface MarkdownActions {
  toggleBold(textarea: HTMLTextAreaElement | null): void;
  toggleItalic(textarea: HTMLTextAreaElement | null): void;
  toggleCode(textarea: HTMLTextAreaElement | null): void;
  toggleStrikethrough(textarea: HTMLTextAreaElement | null): void;
  insertLink(textarea: HTMLTextAreaElement | null, options?: LinkOptions): void;
  insertHorizontalRule(textarea: HTMLTextAreaElement | null): void;
  toggleBulletList(textarea: HTMLTextAreaElement | null): void;
  toggleNumberedList(textarea: HTMLTextAreaElement | null): void;
  toggleQuote(textarea: HTMLTextAreaElement | null): void;
  toggleTaskList(textarea: HTMLTextAreaElement | null): void;
  insertHeader(textarea: HTMLTextAreaElement | null, level?: number, toggle?: boolean): void;
  toggleH1(textarea: HTMLTextAreaElement | null): void;
  toggleH2(textarea: HTMLTextAreaElement | null): void;
  toggleH3(textarea: HTMLTextAreaElement | null): void;
  getActiveFormats(textarea: HTMLTextAreaElement): string[];
  hasFormat(textarea: HTMLTextAreaElement, format: string): boolean;
  expandSelection(textarea: HTMLTextAreaElement): void;
  applyCustomFormat(textarea: HTMLTextAreaElement | null, format: FormatStyleOptions): void;
  preserveSelection(textarea: HTMLTextAreaElement, fn: () => void): void;
  setUndoMethod(method: UndoMethod): void;
  setDebugMode(enabled: boolean): void;
  getDebugMode(): boolean;
}

export declare const actions: MarkdownActions;

// Plugin function type
export type MarzipanPlugin = (editor: MarzipanInstance) => void;

// Plugin type declarations
export interface TablePluginOptions {
  defaultRows?: number;
  defaultColumns?: number;
  label?: string;
  title?: string;
}

export interface TableGridPluginOptions {
  maxRows?: number;
  maxColumns?: number;
  maxCols?: number;
  label?: string;
  title?: string;
}

export interface ImagePickerOptions {
  accept?: string;
  multiple?: boolean;
}

export type MarzipanLike = {
  options: { hooks?: { afterPreviewRender?: (root: HTMLElement, editor: any) => void } };
};

// Plugin factory functions
export declare function tablePlugin(options?: TablePluginOptions): MarzipanPlugin;
export declare function tableGridPlugin(options?: TableGridPluginOptions): MarzipanPlugin;
export declare const tableGridStyles: string;
export declare function tableGeneratorPlugin(): MarzipanPlugin;
export declare function mermaidPlugin(config?: Record<string, any>): MarzipanPlugin;
export declare function mermaidExternalPlugin(config?: Record<string, any>): MarzipanPlugin;
export declare function tinyHighlightPlugin(): MarzipanPlugin;
export declare const tinyHighlightStyles: string;
export declare function accentSwatchPlugin(opts?: {
  max?: number;
  defaults?: string[];
  title?: string;
  label?: string;
}): MarzipanPlugin;
export declare const accentSwatchStyles: string;
export declare function imageManagerPlugin(opts?: Record<string, any>): MarzipanPlugin;
export declare function imagePickerPlugin(opts?: ImagePickerOptions): MarzipanPlugin;
`;

writeFileSync(
  join(rootDir, 'dist', 'index.d.ts'),
  indexDts
);

console.log('✓ Copied correct type definitions to dist');
console.log('✓ Generated index.d.ts');
