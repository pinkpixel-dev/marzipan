# Marzipan API Reference

A comprehensive guide to the core Marzipan class, bundled action toolkit, and first-party plugin exports.

## Table of Contents

- [Quick Start](#quick-start)
- [Constructor](#constructor)
- [Instance Methods](#instance-methods)
- [Static Methods](#static-methods)
- [Actions API](#actions-api)
- [Options](#options)
- [Themes](#themes)
- [Plugin Exports](#plugin-exports)
- [Events](#events)
- [Examples](#examples)

## Quick Start

```javascript
// Import Marzipan
import { Marzipan } from '@pinkpixel/marzipan';

// Initialize single editor
const [editor] = new Marzipan('#my-editor');

// Or use the static helper for multiple elements
const editors = Marzipan.init('.markdown-editor');
```

## Constructor

### `new Marzipan(target, options)`

Creates one or more Marzipan editor instances.

**Parameters:**
- `target` *(string|Element|NodeList|Array)* - Target element(s) to initialize
  - `string` - CSS selector
  - `Element` - Single DOM element
  - `NodeList` - Collection of DOM elements
  - `Array` - Array of DOM elements
- `options` *(Object)* - Configuration options (see [Options](#options))

**Returns:** `Array<Marzipan>` - Array of Marzipan instances

**Example:**
```javascript
// Single element by selector
const editors = new Marzipan('#editor');

// Multiple elements
const editors = new Marzipan('.markdown-editor');

// With options
const editors = new Marzipan('#editor', {
  fontSize: '16px',
  toolbar: true,
  showStats: true
});
```

## Instance Methods

### Content Management

#### `getValue()`
Get the current markdown content from the editor.

**Returns:** `string` - Current markdown content

```javascript
const content = editor.getValue();
console.log(content); // "# Hello World\n\nThis is markdown content"
```

#### `setValue(value)`
Set the markdown content in the editor.

**Parameters:**
- `value` *(string)* - Markdown content to set

```javascript
editor.setValue('# New Content\n\nThis replaces the existing content.');
```

#### `getStats()`
Return live statistics for the current document.

**Returns:** `{ chars: number, words: number, lines: number, line: number, column: number }`

```javascript
const stats = editor.getStats();
console.log(`${stats.words} words • line ${stats.line}:${stats.column}`);
```

#### `getRenderedHTML(options)`
Get the rendered HTML of the current content.

**Parameters:**
- `options` *(Object)* - Rendering options
  - `cleanHTML` *(boolean)* - Remove syntax markers and Marzipan-specific classes

**Returns:** `string` - Rendered HTML

```javascript
// Get HTML with syntax highlighting
const html = editor.getRenderedHTML();

// Get clean HTML for export
const cleanHtml = editor.getRenderedHTML({ cleanHTML: true });
```

#### `getPreviewHTML()`
Get the current preview element's HTML (includes all syntax markers).

**Returns:** `string` - Current preview HTML as displayed

#### `getCleanHTML()`
Get clean HTML without any Marzipan-specific markup. Shorthand for `getRenderedHTML({ cleanHTML: true })`.

**Returns:** `string` - Clean HTML suitable for export

### Focus Management

#### `focus()`
Focus the editor textarea.

```javascript
editor.focus();
```

#### `blur()`
Blur the editor textarea.

```javascript
editor.blur();
```

### DOM Helpers

#### `getContainer()`
Return the root container element that wraps the toolbar, textarea, and preview.

```javascript
const container = editor.getContainer();
container.classList.add('rounded');
```

### Display Modes

#### `showPlainTextarea(show?)`
Toggle between plain textarea and overlay markdown preview.

**Parameters:**
- `show` *(boolean | undefined)* - `true` to show plain textarea, `false` to show overlay. Call without arguments to read the current state.

**Returns:** `boolean` - Current plain textarea state

```javascript
// Show plain textarea (hide markdown preview)
editor.showPlainTextarea(true);

// Show markdown overlay
editor.showPlainTextarea(false);

// Check current mode without changing it
const isPlain = editor.showPlainTextarea();
```

#### `showPreviewMode(show)`
Toggle between edit and preview-only modes.

**Parameters:**
- `show` *(boolean)* - `true` for preview mode, `false` for edit mode

**Returns:** `boolean` - Current preview mode state

```javascript
// Switch to preview-only mode
editor.showPreviewMode(true);

// Switch back to edit mode
editor.showPreviewMode(false);
```

#### `showStats(show)`
Show or hide the statistics bar.

**Parameters:**
- `show` *(boolean)* - Whether to show statistics

```javascript
editor.showStats(true);  // Show character/word/line counts
editor.showStats(false); // Hide statistics
```

### Editor State

#### `updatePreview()`
Manually update the markdown preview. Usually called automatically.

```javascript
editor.updatePreview();
```

#### `isInitialized()`
Check if the editor is fully initialized.

**Returns:** `boolean` - Initialization status

```javascript
if (editor.isInitialized()) {
  console.log('Editor is ready!');
}
```

#### `reinit(options)`
Re-initialize the editor with new options.

**Parameters:**
- `options` *(Object)* - New options to apply (merged with existing options)

```javascript
editor.reinit({
  fontSize: '18px',
  toolbar: false
});
```

#### `destroy()`
Destroy the editor instance and cleanup resources.

```javascript
editor.destroy();
```

## Static Methods

### `Marzipan.init(target, options)`
Convenience method to create new instances. Equivalent to `new Marzipan()`.

**Parameters:**
- `target` *(string|Element|NodeList|Array)* - Target element(s)
- `options` *(Object)* - Configuration options

**Returns:** `Array<Marzipan>` - Array of instances

### `Marzipan.getInstance(element)`
Get existing Marzipan instance from a DOM element.

**Parameters:**
- `element` *(Element)* - DOM element

**Returns:** `Marzipan|null` - Instance or null if not found

```javascript
const element = document.getElementById('my-editor');
const instance = Marzipan.getInstance(element);
```

### `Marzipan.destroyAll()`
Destroy all existing Marzipan instances.

```javascript
Marzipan.destroyAll();
```

### `Marzipan.setTheme(theme, customColors)`
Set global theme for all Marzipan instances.

**Parameters:**
- `theme` *(string|Object)* - Theme name or custom theme object
- `customColors` *(Object)* - Optional color overrides

```javascript
// Use built-in theme
Marzipan.setTheme('cave');

// Use custom theme
Marzipan.setTheme({
  name: 'custom',
  colors: {
    bgPrimary: '#1a1a1a',
    bgSecondary: '#121212',
    text: '#ffffff',
    toolbarBg: '#141414'
  }
});

// Override colors
Marzipan.setTheme('solar', {
  bgPrimary: '#002b36'
});
```

### `Marzipan.injectStyles(force)`
Manually inject Marzipan styles into the document.

**Parameters:**
- `force` *(boolean)* - Force re-injection even if already injected

```javascript
Marzipan.injectStyles(true); // Force style re-injection
```

## Actions API

Marzipan ships a zero-dependency markdown action toolkit alongside the core class. Import the helpers from `@pinkpixel/marzipan` and pass the target `HTMLTextAreaElement`.

```ts
import { actions } from '@pinkpixel/marzipan';

const textarea = document.querySelector('textarea');
if (textarea) {
  actions.toggleBold(textarea);
}
```

Available helpers include:
- `toggleBold(textarea)`
- `toggleItalic(textarea)`
- `toggleCode(textarea)`
- `insertLink(textarea, options?)`
- `toggleBulletList(textarea)`
- `toggleNumberedList(textarea)`
- `toggleQuote(textarea)`
- `toggleTaskList(textarea)`
- `insertHeader(textarea, level?, toggle?)`
- `toggleH1(textarea)` / `toggleH2(textarea)` / `toggleH3(textarea)`
- `applyCustomFormat(textarea, format)`
- `getActiveFormats(textarea)` / `hasFormat(textarea, format)`
- `expandSelection(textarea)` / `preserveSelection(textarea, fn)`
- `setUndoMethod(method)` / `getUndoMethod()`
- `setDebugMode(enabled)` / `getDebugMode()`

These functions mirror the toolbar and keyboard shortcut behaviour, making it easy to build custom UI without extra dependencies.

## Options

Default options and their descriptions:

```javascript
const defaultOptions = {
  // Typography
  fontSize: '14px',           // Font size
  lineHeight: 1.6,            // Line height multiplier
  fontFamily: '...',          // Monospace font stack
  padding: '16px',            // Internal padding
  
  // Mobile-specific styles
  mobile: {
    fontSize: '16px',         // Font size on mobile (prevents zoom)
    padding: '12px',          // Reduced padding on mobile
    lineHeight: 1.5           // Adjusted line height
  },
  
  // Textarea properties
  textareaProps: {},          // Native textarea attributes
  
  // Behavior
  autofocus: false,           // Auto-focus on initialization
  autoResize: false,          // Auto-expand height with content
  minHeight: '100px',         // Minimum height (autoResize mode)
  maxHeight: null,            // Maximum height (autoResize mode)
  placeholder: 'Start typing...', // Placeholder text
  value: '',                  // Initial content
  
  // Callbacks
  onChange: null,             // Content change callback
  onKeydown: null,            // Keydown event callback
  
  // Features
  showActiveLineRaw: false,   // Show active line without markdown rendering
  showStats: false,           // Show statistics bar
  toolbar: false,             // Show toolbar (true/false or config object)
  statsFormatter: null,       // Custom stats formatter function
  smartLists: true,           // Enable smart list continuation
  
  // Themes (applied per-instance)
  theme: null                 // Instance-specific theme override
};
```

### Option Details

#### `textareaProps`
Apply native textarea attributes:

```javascript
new Marzipan('#editor', {
  textareaProps: {
    'data-testid': 'markdown-input',
    'aria-label': 'Markdown editor',
    maxlength: 5000,
    style: { border: '2px solid blue' }
  }
});
```

#### `onChange(value, instance)`
Called when content changes:

```javascript
new Marzipan('#editor', {
  onChange: (value, instance) => {
    console.log('Content changed:', value.length, 'characters');
    // Save to localStorage, send to server, etc.
  }
});
```

#### `onKeydown(event, instance)`
Called for keydown events:

```javascript
new Marzipan('#editor', {
  onKeydown: (event, instance) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      console.log('Ctrl+Enter pressed');
      // Custom save logic
    }
  }
});
```

#### `statsFormatter(stats)`
Custom statistics display:

```javascript
new Marzipan('#editor', {
  showStats: true,
  statsFormatter: (stats) => {
    return `📝 ${stats.words} words • 📏 ${stats.chars} chars • 📄 ${stats.lines} lines`;
  }
});
```

Stats object contains:
- `chars` *(number)* - Character count
- `words` *(number)* - Word count  
- `lines` *(number)* - Line count
- `line` *(number)* - Current line number
- `column` *(number)* - Current column number

#### `toolbar`
Enable toolbar with default buttons:

```javascript
// Enable with defaults
new Marzipan('#editor', { toolbar: true });

// Custom button configuration
new Marzipan('#editor', {
  toolbar: {
    buttons: ['bold', 'italic', 'code', '|', 'link', 'quote', '|', 'bulletList', 'orderedList', '|', 'plain', 'view']
  }
});
```

Available button shorthands:
- `bold`, `italic`, `code`
- `link`, `quote`
- `h1`, `h2`, `h3`
- `bulletList`, `orderedList`, `taskList`
- `view` – Opens the view dropdown (plain/preview/overlay)
- `plain` – Toggles the overlay on/off directly
- `|`, `separator`, `divider` – Visual separators

Pass full `ToolbarButtonConfig` objects if you need to customise icons, titles, or actions beyond the built-in presets.

## Themes

Marzipan includes built-in themes and supports custom themes.

### Built-in Themes

- `solar` / `light` - Light theme with warm colors (default)
- `cave` / `dark` - Dark theme with cool colors

### Using Themes

```javascript
// Global theme (affects all instances)
Marzipan.setTheme('cave');

// Instance-specific theme
new Marzipan('#editor', {
  theme: 'cave'  // Only this instance uses cave theme
});

// Custom theme
const myTheme = {
  name: 'purple',
  colors: {
    bgPrimary: '#2d1b69',
    bgSecondary: '#24124f',
    text: '#e1d5f7',
    textSecondary: '#c9b4e8',
    h1: '#bb9af7',
    h2: '#9ece6a',
    h3: '#ff9e64',
    link: '#a1c4ff',
    codeBg: 'rgba(155, 136, 196, 0.2)',
    toolbarBg: '#1b0f47'
  }
};

Marzipan.setTheme(myTheme);

// Per-instance tweaks can also be merged with the `colors` option
new Marzipan('#editor', {
  theme: 'solar',
  colors: {
    toolbarActive: '#ffe066',
    cursor: '#ff8c00'
  }
});
```

### Theme Color Properties

```javascript
const themeColors = {
  // Base appearance
  bgPrimary: '#ffffff',
  bgSecondary: '#f8f9fa',
  text: '#333333',
  textSecondary: '#666666',

  // Typography accents
  h1: '#1a73e8',
  h2: '#0f9d58',
  h3: '#fbbc05',
  strong: '#1a73e8',
  em: '#d93025',
  link: '#1a73e8',
  code: '#d93025',
  codeBg: 'rgba(26, 115, 232, 0.1)',

  // Block elements
  blockquote: '#5f6368',
  hr: '#dadce0',
  syntaxMarker: 'rgba(95, 99, 104, 0.5)',
  listMarker: '#1a73e8',

  // Caret & selection
  cursor: '#1a73e8',
  selection: 'rgba(26, 115, 232, 0.2)',

  // Toolbar styling
  toolbarBg: '#ffffff',
  toolbarBorder: 'rgba(0, 0, 0, 0.08)',
  toolbarIcon: '#1a73e8',
  toolbarHover: '#f1f3f4',
  toolbarActive: '#e8f0fe',
  border: '#dadce0'
};
```

## Events

### Content Events

#### Change Event
Triggered when content changes via the `onChange` callback:

```javascript
new Marzipan('#editor', {
  onChange: (value, instance) => {
    console.log('Content:', value);
    console.log('Instance ID:', instance.instanceId);
  }
});
```

#### Input Events
Access native textarea events through the `textarea` property:

```javascript
const editor = new Marzipan('#editor')[0];

editor.textarea.addEventListener('focus', () => {
  console.log('Editor focused');
});

editor.textarea.addEventListener('blur', () => {
  console.log('Editor blurred');
});
```

### Keyboard Events

#### Global Keyboard Handler
Use the `onKeydown` callback:

```javascript
new Marzipan('#editor', {
  onKeydown: (event, instance) => {
    // Handle custom shortcuts
    if (event.ctrlKey && event.key === 's') {
      event.preventDefault();
      saveContent(instance.getValue());
    }
  }
});
```

#### Built-in Shortcuts
Marzipan includes built-in keyboard shortcuts:

- `Tab` / `Shift+Tab` - Indent/outdent text
- `Enter` - Smart list continuation
- `Ctrl+B` / `Cmd+B` - Toggle bold (with toolbar)
- `Ctrl+I` / `Cmd+I` - Toggle italic (with toolbar)
- `Ctrl+K` / `Cmd+K` - Insert link (with toolbar)

## Examples

### Basic Editor

```javascript
// Simple editor
const editors = new Marzipan('#editor', {
  placeholder: 'Write your markdown here...',
  value: '# Hello World\n\nStart writing!'
});
```

### Full-Featured Editor

```javascript
// Editor with all features
const editors = new Marzipan('#advanced-editor', {
  // Appearance
  fontSize: '16px',
  lineHeight: 1.7,
  theme: 'cave',
  
  // Features
  toolbar: true,
  showStats: true,
  autoResize: true,
  minHeight: '200px',
  maxHeight: '600px',
  
  // Behavior
  autofocus: true,
  smartLists: true,
  showActiveLineRaw: true,
  
  // Events
  onChange: (value, instance) => {
    localStorage.setItem('markdown-content', value);
  },
  
  // Custom stats
  statsFormatter: ({ words, chars, lines, line, column }) => {
    const readingTime = Math.ceil(words / 200);
    return `${words} words (${readingTime} min read) • Line ${line}:${column}`;
  }
});

const editor = editors[0];
```

### Multiple Editors

```javascript
// Initialize multiple editors with different configs
const editors = Marzipan.init('.editor', {
  toolbar: true,
  showStats: true
});

// Customize individual editors
editors[0].reinit({ theme: 'solar' });
editors[1].reinit({ theme: 'cave' });

// Handle all editors
editors.forEach((editor, index) => {
  editor.setValue(`# Editor ${index + 1}\n\nContent here...`);
});
```

### Custom Theme

```javascript
// Create custom theme
const darkTheme = {
  name: 'dark-purple',
  colors: {
    background: '#1a1a2e',
    text: '#eee',
    comment: '#888',
    keyword: '#9d65ff',
    string: '#5fb3d4',
    number: '#f093a3',
    selection: '#2d2d4d',
    border: '#333',
    toolbar: '#16213e'
  }
};

// Apply globally
Marzipan.setTheme(darkTheme);

// Or per instance
new Marzipan('#editor', {
  theme: darkTheme
});
```

### Integration Example

```javascript
// Complete integration example
class MarkdownApp {
  constructor() {
    this.editors = new Marzipan('.markdown-editor', {
      toolbar: true,
      showStats: true,
      autoResize: true,
      onChange: this.handleChange.bind(this)
    });
    
    this.editor = this.editors[0];
    this.setupCustomButtons();
  }
  
  handleChange(value, instance) {
    // Auto-save
    clearTimeout(this.saveTimeout);
    this.saveTimeout = setTimeout(() => {
      this.saveToServer(value);
    }, 1000);
    
    // Update word count display
    this.updateWordCount(value);
  }
  
  setupCustomButtons() {
    // Add custom save button
    const toolbar = this.editor.container.querySelector('.marzipan-toolbar');
    const saveBtn = document.createElement('button');
    saveBtn.textContent = '💾 Save';
    saveBtn.onclick = () => this.saveToServer(this.editor.getValue());
    toolbar.appendChild(saveBtn);
  }
  
  saveToServer(content) {
    fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content })
    });
  }
  
  updateWordCount(content) {
    const words = content.split(/\s+/).filter(w => w.length > 0).length;
    document.getElementById('word-count').textContent = `${words} words`;
  }
}

// Initialize app
const app = new MarkdownApp();
```

## Plugin Exports

Every plugin located in `src/plugins` publishes as `@pinkpixel/marzipan/plugins/<name>`. Each export is a factory so you can configure behaviour before passing it to the editor:

```ts
import { tablePlugin } from '@pinkpixel/marzipan/plugins/tablePlugin';
import { mermaidPlugin } from '@pinkpixel/marzipan/plugins/mermaidPlugin';

new Marzipan('#editor', {
  plugins: [tablePlugin(), mermaidPlugin({ theme: 'dark' })],
});
```

Refer to [docs/plugins.md](./plugins.md) for the full catalogue and configuration options.

## Browser Support

Marzipan supports modern browsers:

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

Key requirements:
- CSS Custom Properties (CSS Variables)
- ES6 Classes
- Template Literals
- Modern DOM APIs

For older browser support, consider using appropriate polyfills and transpilation.
