// Public types for @pinkpixel/marzipan.
// The editor instance type is the Marzipan class itself (see marzipan.ts).

import type { Marzipan } from './marzipan';
import type { ToolbarButtonConfig, ToolbarButtonEntry, ToolbarButtonPreset } from './toolbar';

export type { ToolbarButtonConfig };

/** A Marzipan editor instance */
export type MarzipanInstance = Marzipan;

/**
 * Theme color definitions
 */
export interface ThemeColors {
  /** Primary background color */
  bgPrimary?: string;
  /** Secondary background color (editor background) */
  bgSecondary?: string;
  /** Main text color */
  text?: string;
  /** Secondary text color */
  textSecondary?: string;
  /** H1 header color */
  h1?: string;
  /** H2 header color */
  h2?: string;
  /** H3 header color (also used for h4-h6) */
  h3?: string;
  /** Bold text color */
  strong?: string;
  /** Italic text color */
  em?: string;
  /** Link color */
  link?: string;
  /** Inline code text color */
  code?: string;
  /** Code block background color */
  codeBg?: string;
  /** Blockquote text color */
  blockquote?: string;
  /** Horizontal rule color */
  hr?: string;
  /** Syntax marker color */
  syntaxMarker?: string;
  /** List marker color */
  listMarker?: string;
  /** Cursor color */
  cursor?: string;
  /** Selection background color */
  selection?: string;
  /** Raw line indicator color */
  rawLine?: string;
  /** Toolbar background color */
  toolbarBg?: string;
  /** Toolbar border color */
  toolbarBorder?: string;
  /** Toolbar icon color */
  toolbarIcon?: string;
  /** Toolbar hover state color */
  toolbarHover?: string;
  /** Toolbar active button color */
  toolbarActive?: string;
  /** General border color */
  border?: string;
}

/**
 * Theme configuration for Marzipan editor
 */
export interface Theme {
  /** Theme identifier */
  name: string;
  /** Color palette for the theme */
  colors: ThemeColors;
}

/**
 * Statistics about the current editor content
 */
export interface Stats {
  /** Number of words */
  words: number;
  /** Number of characters */
  chars: number;
  /** Total number of lines */
  lines: number;
  /** Current line number (cursor position) */
  line: number;
  /** Current column number (cursor position) */
  column: number;
}

/**
 * Mobile-specific responsive options
 */
export interface MobileOptions {
  fontSize?: string;
  padding?: string;
  lineHeight?: string | number;
}

/** Supported toolbar button shorthands */
export type ToolbarButtonShortcut = ToolbarButtonPreset | '|' | 'separator' | 'divider';

/** A toolbar button: a shorthand string or a full config object */
export type ToolbarButtonOption = ToolbarButtonEntry;

/**
 * Toolbar configuration
 */
export interface ToolbarConfig {
  /** Custom button configuration */
  buttons?: ToolbarButtonOption[];
}

/**
 * Editor hooks for lifecycle events
 */
export interface EditorHooks {
  /** Called after preview is rendered */
  afterPreviewRender?: (root: HTMLElement, instance: MarzipanInstance) => void;
}

/** A plugin receives the editor instance once, when it is applied */
export type MarzipanPlugin = (editor: MarzipanInstance) => void;

/** Anything Marzipan can mount onto */
export type MarzipanTarget = string | Element | NodeList | Element[];

/**
 * Configuration options for Marzipan editor
 */
export interface Options {
  // Typography
  fontSize?: string;
  lineHeight?: string | number;
  fontFamily?: string;
  padding?: string;

  /** Mobile-specific style overrides */
  mobile?: MobileOptions;

  /** Additional attributes to apply to the textarea element */
  textareaProps?: Record<string, unknown>;

  // Behavior
  /** Automatically focus editor on initialization */
  autofocus?: boolean;
  /** Auto-expand height based on content */
  autoResize?: boolean;
  /** Minimum height when autoResize is enabled */
  minHeight?: string | number;
  /** Maximum height when autoResize is enabled */
  maxHeight?: string | number | null;
  /** Placeholder text */
  placeholder?: string;
  /** Initial content value */
  value?: string;

  // Features
  /** Show raw markdown for the active line */
  showActiveLineRaw?: boolean;
  /** Show statistics bar */
  showStats?: boolean;
  /** Enable toolbar (true/false or configuration object) */
  toolbar?: boolean | ToolbarConfig;
  /** Enable smart list continuation */
  smartLists?: boolean;
  /** Custom formatter for statistics display */
  statsFormatter?: (stats: Stats) => string;

  // Theme (instance-level)
  /** Theme name or custom theme object */
  theme?: string | Theme | null;
  /** Custom color overrides */
  colors?: Partial<ThemeColors>;

  // Extensibility
  /** Lifecycle hooks */
  hooks?: EditorHooks;
  /** Plugin functions */
  plugins?: MarzipanPlugin[];

  // Callbacks
  /** Called when content changes */
  onChange?: (value: string, instance: MarzipanInstance) => void;
  /** Called on keydown events the editor didn't handle */
  onKeydown?: (event: KeyboardEvent, instance: MarzipanInstance) => void;
}

/**
 * Options for rendering HTML output
 */
export interface RenderOptions {
  /** Remove Marzipan-specific markup and classes */
  cleanHTML?: boolean;
}
