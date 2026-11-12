// @pinkpixel/marzipan - Pure TypeScript markdown editor library
import Marzipan from './marzipan'

// Export the main class
export default Marzipan
export { Marzipan }

// Export core modules for advanced usage
export { MarkdownParser } from './parser'
export { ShortcutsManager } from './shortcuts'
export { Toolbar } from './toolbar'
export { LinkTooltip } from './link-tooltip'
export * from './themes'
export { generateStyles } from './styles'
export * as actions from './actions'

// Export plugins
export { 
  imageManagerPlugin,
  imageManagerStyles,
  imagePickerPlugin,
  mermaidPlugin,
  mermaidExternalPlugin,
  tablePlugin,
  tableGridPlugin,
  tableGridStyles,
  tableGeneratorPlugin,
  tinyHighlightPlugin,
  tinyHighlightStyles,
  buildTableMarkdown,
  resolvePositiveInteger,
  coreImagePickerPlugin
} from './plugins'

export type { 
  ImagePickerOptions,
  TablePluginOptions,
  TableGridPluginOptions,
  MarzipanLike,
  CoreImagePickerOptions
} from './plugins'

// Export all plugins as a namespace for convenience
export * as plugins from './plugins'

// Export all types
export type { MarkdownActions } from './actions'
export type { MarzipanConstructor } from './marzipan'
export type {
  Options as MarzipanOptions,
  Options,
  MarzipanInstance,
  MarzipanPlugin,
  MarzipanTarget,
  Theme,
  ThemeColors,
  Stats,
  MobileOptions,
  ToolbarButtonConfig,
  ToolbarButtonShortcut,
  ToolbarButtonOption,
  ToolbarConfig,
  EditorHooks,
  RenderOptions
} from './types'
export type { ListContext, Sanctuary, TableAlignment } from './parser'
export type { LinkInfo } from './link-tooltip'
export type { StyleOptions } from './styles'
export type { MermaidPluginConfig } from './plugins/mermaidPlugin'

export type {
  FormatStyleOptions,
  ResolvedFormatStyle,
  TextTransformResult,
  UndoMethod,
  LineOperationAdjustment,
  LineOperationOptions
} from './actions/types'
