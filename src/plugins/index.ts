// @ts-nocheck
/**
 * Marzipan Plugins
 * 
 * Collection of plugins that extend Marzipan's functionality.
 */

export { BlockHandlesPlugin } from './block-handles';
export type { BlockHandle, BlockHandlesConfig } from './block-handles';

// Accent Swatch Plugin
export { accentSwatchPlugin, accentSwatchStyles } from './accentSwatchPlugin';

// Image Plugins
export { imageManagerPlugin, imageManagerStyles } from './imageManagerPlugin';
export { imagePickerPlugin } from './imagePickerPlugin';
export type { ImagePickerOptions } from './imagePicker';

// Mermaid Plugins
export { mermaidPlugin } from './mermaidPlugin';
export { mermaidExternalPlugin } from './mermaidExternal';

// Table Plugins
export { tablePlugin } from './tablePlugin';
export type { TablePluginOptions } from './tablePlugin';
export { tableGridPlugin, tableGridStyles } from './tableGridPlugin';
export type { TableGridPluginOptions } from './tableGridPlugin';
export { tableGeneratorPlugin } from './tableGenerator';

// Syntax Highlighting Plugin
export { tinyHighlightPlugin, tinyHighlightStyles } from './tinyHighlight';
export type { MarzipanLike } from './tinyHighlight';

// Table Utilities (for advanced usage)
export { buildTableMarkdown, resolvePositiveInteger } from './utils/table';

// Re-export core imagePicker for direct access
export { imagePickerPlugin as coreImagePickerPlugin } from './imagePicker';
export type { ImagePickerOptions as CoreImagePickerOptions } from './imagePicker';
