// Type definitions for Marzipan
// Project: https://github.com/pinkpixel-dev/marzipan
// Definitions by: Pink Pixel <https://pinkpixel.dev>

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
  /** H3 header color */
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
  /** Font size for mobile devices */
  fontSize?: string;
  /** Padding for mobile devices */
  padding?: string;
  /** Line height for mobile devices */
  lineHeight?: string | number;
}

/**
 * Toolbar button configuration
 */
export interface ToolbarButtonConfig {
  /** Button identifier */
  name?: string;
  /** SVG icon content */
  icon?: string;
  /** Tooltip/title text */
  title?: string;
  /** Action to perform when clicked */
  action?: string;
  /** Whether this is a separator (not a button) */
  separator?: boolean;
  /** Whether button has a dropdown menu */
  hasDropdown?: boolean;
}

/**
 * Supported toolbar button shorthands
 */
export type ToolbarButtonShortcut =
  | 'bold'
  | 'italic'
  | 'code'
  | 'link'
  | 'quote'
  | 'bulletList'
  | 'orderedList'
  | 'taskList'
  | 'h1'
  | 'h2'
  | 'h3'
  | 'view'
  | 'plain'
  | '|'
  | 'separator'
  | 'divider';

export type ToolbarButtonOption = ToolbarButtonConfig | ToolbarButtonShortcut;

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

/**
 * Configuration options for Marzipan editor
 */
export interface Options {
  // Typography
  /** Font size for the editor */
  fontSize?: string;
  /** Line height */
  lineHeight?: string | number;
  /** Font family stack */
  fontFamily?: string;
  /** Padding around content */
  padding?: string;

  // Mobile responsive
  /** Mobile-specific style overrides */
  mobile?: MobileOptions;

  // Native textarea attributes
  /** Additional props to apply to the textarea element */
  textareaProps?: Record<string, any>;

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
  /** Show raw markdown for active line */
  showActiveLineRaw?: boolean;
  /** Show statistics bar */
  showStats?: boolean;
  /** Enable toolbar (true/false or configuration object) */
  toolbar?: boolean | ToolbarConfig;
  /** Enable smart list continuation */
  smartLists?: boolean;

  /** Custom formatter for statistics display */
  statsFormatter?: (stats: Stats) => string;

  // Theme (for instance-level theming)
  /** Theme name or custom theme object */
  theme?: string | Theme;
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
  /** Called on keydown events */
  onKeydown?: (event: KeyboardEvent, instance: MarzipanInstance) => void;
}

/**
 * Options for rendering HTML output
 */
export interface RenderOptions {
  /** Remove Marzipan-specific markup and classes */
  cleanHTML?: boolean;
}

/**
 * A Marzipan editor instance
 */
export interface MarzipanInstance {
  // Public properties
  /** Container element (includes toolbar and wrapper) */
  container: HTMLElement;
  /** Wrapper element (contains textarea and preview) */
  wrapper: HTMLElement;
  /** Textarea element */
  textarea: HTMLTextAreaElement;
  /** Preview overlay element */
  preview: HTMLElement;
  /** Statistics bar element (if enabled) */
  statsBar?: HTMLElement;
  /** Toolbar instance (if enabled) */
  toolbar?: any;
  /** Shortcuts manager instance */
  shortcuts?: any;
  /** Link tooltip manager instance */
  linkTooltip?: any;
  /** Current configuration options */
  options: Options;
  /** Whether editor is initialized */
  initialized: boolean;
  /** Unique instance identifier */
  instanceId: number;
  /** Original target element */
  element: Element;

  // Public methods
  /** Get current editor content */
  getValue(): string;
  
  /** Set editor content */
  setValue(value: string): void;
  
  /** Get content statistics */
  getStats(): Stats;
  
  /** Get container element */
  getContainer(): HTMLElement;
  
  /** Focus the editor */
  focus(): void;
  
  /** Blur the editor */
  blur(): void;
  
  /** Destroy the editor instance */
  destroy(): void;
  
  /** Check if editor is initialized */
  isInitialized(): boolean;
  
  /** Re-initialize with new options */
  reinit(options: Partial<Options>): void;
  
  /** Show or hide statistics bar */
  showStats(show: boolean): void;
  
  /** Update the preview */
  updatePreview(): void;
  
  // HTML output methods
  /** Get rendered HTML with optional clean mode */
  getRenderedHTML(options?: RenderOptions): string;
  
  /** Get clean HTML without Marzipan-specific markup */
  getCleanHTML(): string;
  
  /** Get current preview HTML (as displayed) */
  getPreviewHTML(): string;
  
  // View mode methods
  /** Toggle plain textarea mode (hide/show overlay). Call without arguments to get current state. */
  showPlainTextarea(show?: boolean): boolean;
  
  /** Toggle preview-only mode */
  showPreviewMode(show: boolean): boolean;
  
  // Smart list methods
  /** Handle smart list continuation */
  handleSmartListContinuation(): boolean;
  
  /** Delete list marker and exit list */
  deleteListMarker(context: any): void;
  
  /** Insert new list item */
  insertNewListItem(context: any): void;
  
  /** Split list item at cursor position */
  splitListItem(context: any, cursorPos: number): void;
  
  /** Schedule numbered list renumbering */
  scheduleNumberedListUpdate(): void;
  
  /** Update/renumber all numbered lists */
  updateNumberedLists(): void;
}

/**
 * Plugin function type
 */
export type MarzipanPlugin = (editor: MarzipanInstance) => void;

/**
 * Marzipan constructor interface
 */
export interface MarzipanConstructor {
  /**
   * Create Marzipan editor instance(s)
   * @param target - CSS selector, element, NodeList, or array of elements
   * @param options - Configuration options
   * @returns Array of Marzipan instances
   */
  new(target: string | Element | NodeList | Element[], options?: Options): MarzipanInstance[];
  
  // Static members
  /** WeakMap of element to instance mappings */
  instances: WeakMap<Element, MarzipanInstance>;
  
  /** Whether global styles have been injected */
  stylesInjected: boolean;
  
  /** Whether global event listeners have been initialized */
  globalListenersInitialized: boolean;
  
  /** Total number of instances created */
  instanceCount: number;
  
  /** Current global theme */
  currentTheme: Theme;
  
  /** Built-in themes */
  themes: {
    solar: Theme;
    cave: Theme;
    light: Theme;
    dark: Theme;
  };
  
  /** MarkdownParser class */
  MarkdownParser: typeof MarkdownParser;
  
  /** ShortcutsManager class */
  ShortcutsManager: any;
  
  /**
   * Initialize editor instance(s) (static convenience method)
   * @param target - CSS selector, element, NodeList, or array of elements
   * @param options - Configuration options
   * @returns Array of Marzipan instances
   */
  init(target: string | Element | NodeList | Element[], options?: Options): MarzipanInstance[];
  
  /**
   * Get instance from element
   * @param element - DOM element
   * @returns Marzipan instance or null
   */
  getInstance(element: Element): MarzipanInstance | null;
  
  /**
   * Destroy all editor instances
   */
  destroyAll(): void;
  
  /**
   * Inject global styles
   * @param force - Force re-injection
   */
  injectStyles(force?: boolean): void;
  
  /**
   * Set global theme for all instances
   * @param theme - Theme name or custom theme object
   * @param customColors - Optional color overrides
   */
  setTheme(theme: string | Theme, customColors?: Partial<ThemeColors>): void;
  
  /**
   * Initialize global event listeners
   */
  initGlobalListeners(): void;
  
  /**
   * Get theme by name
   * @param name - Theme name
   * @returns Theme object
   */
  getTheme(name: string): Theme;
}

/**
 * MarkdownParser static class
 */
export declare class MarkdownParser {
  /** Current link index for anchor naming */
  static linkIndex: number;
  
  /** Reset link index */
  static resetLinkIndex(): void;
  
  /** Escape HTML special characters */
  static escapeHtml(text: string): string;
  
  /** Preserve leading spaces as non-breaking spaces */
  static preserveIndentation(html: string, originalLine: string): string;
  
  /** Parse headers (h1-h3) */
  static parseHeader(html: string): string;
  
  /** Parse horizontal rules */
  static parseHorizontalRule(html: string): string | null;
  
  /** Parse blockquotes */
  static parseBlockquote(html: string): string;
  
  /** Parse bullet lists */
  static parseBulletList(html: string): string;
  
  /** Parse numbered lists */
  static parseNumberedList(html: string): string;
  
  /** Parse code blocks */
  static parseCodeBlock(html: string): string | null;
  
  /** Parse bold text */
  static parseBold(html: string): string;
  
  /** Parse italic text */
  static parseItalic(html: string): string;
  
  /** Parse strikethrough text */
  static parseStrikethrough(html: string): string;
  
  /** Check if line is a table row */
  static isTableRow(html: string): boolean;
  
  /** Check if line is a table separator */
  static isTableSeparator(html: string): boolean;
  
  /** Parse table row */
  static parseTableRow(html: string, tag?: 'td' | 'th'): string;
  
  /** Main parse method */
  static parse(markdown: string, activeLine?: number, showActiveLineRaw?: boolean): string;
  
  /** Get list context at cursor position */
  static getListContext(value: string, cursorPos: number): any;
  
  /** Create new list item */
  static createNewListItem(context: any): string;
  
  /** Renumber all numbered lists */
  static renumberLists(value: string): string;
}

// Declare the constructor
declare const Marzipan: MarzipanConstructor;

// Default and named exports are the constructor
export default Marzipan;
export { Marzipan };
