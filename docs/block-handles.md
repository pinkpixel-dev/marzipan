# Block Handles Plugin

The **Block Handles Plugin** provides an interactive block manipulation system for Marzipan's preview overlay. It displays visual handles on the left side of markdown blocks, allowing users to easily select, copy, and delete blocks with mouse and keyboard interactions.

## Features

- 🎨 **Visual Handles**: Unique icons for each block type (headings, paragraphs, lists, quotes, code, tables, etc.)
- 🖱️ **Hover Interaction**: Handles appear when hovering over blocks
- ✨ **Selection System**: Click handles or Shift+Click blocks to select them
- 📋 **Context Menu**: Right-click handles for quick actions (copy, delete, select)
- ⌨️ **Keyboard Shortcuts**: Ctrl/Cmd+C to copy, Delete/Backspace to delete selected blocks
- 🎯 **Visual Feedback**: Highlight effects for hover and selection states
- 🔔 **Toast Notifications**: User-friendly feedback for actions
- 📡 **Event System**: Custom events for block selection and deselection

## Installation

The plugin is included with Marzipan by default. Simply enable it in your editor configuration:

```javascript
import Marzipan from "@pinkpixel/marzipan";

const editor = new Marzipan("#editor", {
  blockHandles: true, // Enabled by default
});
```

## Configuration

You can customize the plugin's behavior and appearance:

```javascript
const editor = new Marzipan("#editor", {
  blockHandles: {
    enabled: true, // Enable/disable the plugin
    showOnHover: true, // Show handles on hover
    handleOffset: 4, // Horizontal offset from block's left edge (px)
    handleSize: 20, // Handle size (px)
    colors: {
      hover: "rgba(59, 130, 246, 0.1)", // Hover highlight color
      selected: "rgba(59, 130, 246, 0.2)", // Selection highlight color
      handle: "rgba(59, 130, 246, 0.8)", // Handle background color
    },
  },
});
```

### Configuration Options

| Option            | Type      | Default                     | Description                                                         |
| ----------------- | --------- | --------------------------- | ------------------------------------------------------------------- |
| `enabled`         | `boolean` | `true`                      | Enable or disable the plugin                                        |
| `showOnHover`     | `boolean` | `true`                      | Show handles when hovering over blocks                              |
| `handleOffset`    | `number`  | `4`                         | Horizontal offset of handles from the block's left edge (in pixels) |
| `handleSize`      | `number`  | `20`                        | Size of handle buttons (in pixels)                                  |
| `colors.hover`    | `string`  | `'rgba(59, 130, 246, 0.1)'` | Background color when hovering over blocks                          |
| `colors.selected` | `string`  | `'rgba(59, 130, 246, 0.2)'` | Background color for selected blocks                                |
| `colors.handle`   | `string`  | `'rgba(59, 130, 246, 0.8)'` | Background color of handle buttons                                  |

## Usage

### Basic Interactions

#### Mouse Interactions

1. **Hover**: Move your mouse over any markdown block to see its handle appear on the left
2. **Click Handle**: Click a handle to select the block
3. **Right-Click Handle**: Right-click to open the context menu with available actions
4. **Shift+Click Block**: Hold Shift and click anywhere on a block to select it

#### Keyboard Shortcuts

- **Escape**: Deselect the currently selected block
- **Ctrl/Cmd+C**: Copy the selected block to clipboard
- **Delete** or **Backspace**: Delete the selected block

### Context Menu Actions

Right-click any handle to access these actions:

- **Copy**: Copy the block's content to clipboard
- **Delete**: Remove the block from the document
- **Select**: Select the block (same as clicking the handle)

### Block Types and Icons

Each markdown block type has a unique icon:

| Block Type      | Icon | Description                |
| --------------- | ---- | -------------------------- |
| Heading         | ⚡   | H1-H6 headers              |
| Paragraph       | ¶    | Regular text paragraphs    |
| List Item       | •    | Bullet and numbered lists  |
| Quote           | "    | Blockquotes                |
| Code Fence      | {    | Code fence markers         |
| Code Content    | {}   | Content inside code blocks |
| Horizontal Rule | ―    | Horizontal lines           |
| Table Row       | ⊞    | Table data rows            |
| Table Separator | ═    | Table header separators    |

## Programmatic API

Access the plugin instance through your Marzipan editor:

```javascript
const editor = new Marzipan("#editor", {
  blockHandles: true,
});

const plugin = editor[0].blockHandlesPlugin;
```

### Methods

#### `refresh()`

Rescan blocks and update handle positions.

```javascript
plugin.refresh();
```

#### `updateAllHandlePositions()`

Update positions of all handles (useful after scroll or resize).

```javascript
plugin.updateAllHandlePositions();
```

#### `getSelectedBlock()`

Get the currently selected block.

```javascript
const block = plugin.getSelectedBlock();
if (block) {
  console.log("Selected block:", block.type, block.lineStart, block.lineEnd);
}
```

#### `getAllBlocks()`

Get all blocks tracked by the plugin.

```javascript
const blocks = plugin.getAllBlocks();
console.log(`Found ${blocks.length} blocks`);
```

#### `enable()`

Enable the plugin.

```javascript
plugin.enable();
```

#### `disable()`

Disable the plugin and remove all handles.

```javascript
plugin.disable();
```

#### `destroy()`

Clean up and remove the plugin completely.

```javascript
plugin.destroy();
```

### Events

Listen for block selection events:

```javascript
const preview = editor[0].preview;

preview.addEventListener("blockSelected", (e) => {
  console.log("Block selected:", e.detail.blockId, e.detail.block);
});

preview.addEventListener("blockDeselected", (e) => {
  console.log("Block deselected:", e.detail.blockId);
});
```

### Block Object Structure

Each block object contains:

```typescript
interface BlockHandle {
  id: string; // Unique block identifier
  type: string; // Block type (heading, paragraph, etc.)
  lineStart: number; // Starting line number in editor
  lineEnd: number; // Ending line number in editor
  element: HTMLElement; // DOM element for the block
  handleElement: HTMLElement | null; // Handle DOM element
}
```

## Advanced Usage

### Custom Handle Styling

You can override handle styles with CSS:

```css
/* Customize handle appearance */
.mz-block-handle {
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Style specific block types */
.mz-block-handle-heading {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.mz-block-handle-quote {
  background: #10b981;
}
```

### Conditional Enable/Disable

Enable handles only for certain conditions:

```javascript
const editor = new Marzipan("#editor", {
  blockHandles: {
    enabled: window.innerWidth > 768, // Only on desktop
  },
});

// Toggle based on user preference
window.addEventListener("resize", () => {
  if (window.innerWidth > 768) {
    editor[0].blockHandlesPlugin?.enable();
  } else {
    editor[0].blockHandlesPlugin?.disable();
  }
});
```

### Integrate with Custom Actions

```javascript
const preview = editor[0].preview;

preview.addEventListener("blockSelected", (e) => {
  const block = e.detail.block;

  // Add custom toolbar for selected block
  showCustomToolbar(block);

  // Highlight corresponding line in editor
  highlightEditorLines(block.lineStart, block.lineEnd);
});

preview.addEventListener("blockDeselected", () => {
  hideCustomToolbar();
  clearEditorHighlights();
});
```

## Browser Compatibility

The Block Handles Plugin requires:

- Modern browser with ES6+ support
- `navigator.clipboard` API for copy functionality
- CSS Grid support for handle positioning

Supported browsers:

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Troubleshooting

### Handles Not Appearing

1. Verify the plugin is enabled:

   ```javascript
   console.log(editor[0].blockHandlesPlugin);
   ```

2. Check if block metadata is present:

   ```javascript
   const blocks = editor[0].preview.querySelectorAll("[data-block-id]");
   console.log("Blocks found:", blocks.length);
   ```

3. Ensure preview has relative positioning:
   ```javascript
   console.log(getComputedStyle(editor[0].preview).position);
   ```

### Handles Misaligned

Call `updateAllHandlePositions()` after DOM changes:

```javascript
editor[0].blockHandlesPlugin.updateAllHandlePositions();
```

### Performance Issues

If you notice performance issues with many blocks:

1. Disable hover effects:

   ```javascript
   blockHandles: {
     showOnHover: false;
   }
   ```

2. Throttle position updates on scroll

## License

Apache 2.0

## Credits

Created by **Pink Pixel** as part of the Marzipan markdown editor.

- Website: [pinkpixel.dev](https://pinkpixel.dev)
- GitHub: [@pinkpixel-dev](https://github.com/pinkpixel-dev)
