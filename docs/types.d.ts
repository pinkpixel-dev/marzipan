/**
 * TypeScript definitions for Marzipan markdown editor
 * @version 1.0.9
 * @author Pink Pixel
 */

export interface MarzipanTheme {
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
  toolbarBg?: string;
  toolbarBorder?: string;
  toolbarIcon?: string;
  toolbarHover?: string;
  toolbarActive?: string;
  border?: string;
}

export interface MarzipanMobileOptions {
  fontSize: string;
  padding: string;
  lineHeight: number;
}

export interface StatsData {
  chars: number;
  words: number;
  lines: number;
  line: number;
  column: number;
}

export type StatsFormatter = (stats: StatsData) => string;

export type ChangeHandler = (value: string, instance: Marzipan) => void;

export type KeydownHandler = (event: KeyboardEvent, instance: Marzipan) => void;

export interface ToolbarButtonConfig {
  name?: string;
  icon?: string;
  title?: string;
  action?: string;
  separator?: boolean;
  hasDropdown?: boolean;
}

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

export type ToolbarButton = ToolbarButtonOption;

export interface ToolbarConfig {
  buttons: ToolbarButtonOption[];
}

export interface TextareaProps {
  [key: string]: any;
  className?: string;
  class?: string;
  style?: Partial<CSSStyleDeclaration> | string;
  'aria-label'?: string;
  'data-testid'?: string;
  maxlength?: number;
  rows?: number;
  cols?: number;
}

export interface MarzipanOptions {
  // Typography
  fontSize?: string;
  lineHeight?: number;
  fontFamily?: string;
  padding?: string;
  
  // Mobile-specific styles
  mobile?: Partial<MarzipanMobileOptions>;
  
  // Textarea properties
  textareaProps?: TextareaProps;
  
  // Behavior
  autofocus?: boolean;
  autoResize?: boolean;
  minHeight?: string;
  maxHeight?: string | null;
  placeholder?: string;
  value?: string;
  
  // Callbacks
  onChange?: ChangeHandler;
  onKeydown?: KeydownHandler;
  
  // Features
  showActiveLineRaw?: boolean;
  showStats?: boolean;
  toolbar?: boolean | ToolbarConfig;
  statsFormatter?: StatsFormatter;
  smartLists?: boolean;
  
  // Themes (per-instance)
  theme?: string | MarzipanTheme;
  colors?: Partial<ThemeColors>;
}

export interface RenderOptions {
  cleanHTML?: boolean;
}

export type TargetElement = string | Element | NodeList | Array<Element>;

export declare class Marzipan {
  // Static properties
  static instances: WeakMap<Element, Marzipan>;
  static stylesInjected: boolean;
  static globalListenersInitialized: boolean;
  static instanceCount: number;
  static currentTheme: MarzipanTheme;
  
  // Static attached utilities
  static MarkdownParser: any;
  static ShortcutsManager: any;
  static themes: { [key: string]: MarzipanTheme };
  static getTheme: (name: string) => MarzipanTheme | null;

  // Instance properties
  element: Element;
  container: HTMLElement;
  wrapper: HTMLElement;
  textarea: HTMLTextAreaElement;
  preview: HTMLElement;
  statsBar?: HTMLElement;
  toolbar?: any;
  shortcuts: any;
  linkTooltip: any;
  
  options: Required<MarzipanOptions>;
  instanceId: number;
  initialized: boolean;
  instanceTheme: string | MarzipanTheme | null;

  // Constructor
  constructor(target: TargetElement, options?: MarzipanOptions);

  // Instance methods - Content Management
  getValue(): string;
  setValue(value: string): void;
  getRenderedHTML(options?: RenderOptions): string;
  getPreviewHTML(): string;
  getCleanHTML(): string;

  // Instance methods - Focus Management
  focus(): void;
  blur(): void;

  // Instance methods - Display Modes
  showPlainTextarea(show: boolean): boolean;
  showPreviewMode(show: boolean): boolean;
  showStats(show: boolean): void;

  // Instance methods - Editor State
  updatePreview(): void;
  isInitialized(): boolean;
  reinit(options?: Partial<MarzipanOptions>): void;
  destroy(): void;

  // Instance methods - Event Handlers (typically internal)
  handleInput(event: Event): void;
  handleKeydown(event: KeyboardEvent): void;
  handleScroll(event: Event): void;
  handleSmartListContinuation(): boolean;

  // Static methods
  static init(target: TargetElement, options?: MarzipanOptions): Array<Marzipan>;
  static getInstance(element: Element): Marzipan | null;
  static destroyAll(): void;
  static setTheme(theme: string | MarzipanTheme, customColors?: Partial<ThemeColors>): void;
  static injectStyles(force?: boolean): void;
  static initGlobalListeners(): void;
}

// Default export
export default Marzipan;

// Module declaration for environments that need it
declare module '@pinkpixel/marzipan' {
  export default Marzipan;
  export { 
    Marzipan, 
    MarzipanOptions, 
    MarzipanTheme, 
    ThemeColors, 
    StatsData, 
    StatsFormatter,
    ChangeHandler,
    KeydownHandler,
    ToolbarConfig,
    ToolbarButton,
    TextareaProps,
    RenderOptions,
    TargetElement
  };
}

// Global declaration for browser environments
declare global {
  interface Window {
    Marzipan: typeof Marzipan;
  }
  
  interface Element {
    MarzipanInstance?: Marzipan;
  }
}
