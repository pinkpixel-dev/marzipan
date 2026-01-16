// @pinkpixel/marzipan-core - Pure TypeScript markdown editor library
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
  BlockHandlesPlugin,
  accentSwatchPlugin,
  accentSwatchStyles,
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
  BlockHandle, 
  BlockHandlesConfig,
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
export type { 
  Options as MarzipanOptions, 
  MarzipanInstance, 
  MarzipanConstructor, 
  MarzipanPlugin,
  Theme,
  ThemeColors,
  Stats,
  MobileOptions,
  ToolbarButtonConfig,
  ToolbarConfig,
  EditorHooks,
  RenderOptions
} from './marzipan.d'

export type {
  FormatStyleOptions,
  ResolvedFormatStyle,
  TextTransformResult,
  UndoMethod,
  LineOperationAdjustment,
  LineOperationOptions
} from './actions/types'
