// Sample documents for the workspace sidebar.
// Carried over from the old per-page demos.

export interface Sample {
  id: string
  label: string
  content: string
}

const welcome = `# 🧁 Welcome to Marzipan!

A **pure TypeScript** markdown editor with _zero runtime dependencies_.

## ✨ Features

- **Overlay Preview** - See your markdown rendered in real-time
- **Smart Lists** - Auto-continuation of lists
- **Keyboard Shortcuts** - Cmd/Ctrl+B for bold, Cmd/Ctrl+I for italic
- **Themes** - Built-in Solar (light) and Cave (dark) themes
- **Plugins** - Tables, Mermaid diagrams, syntax highlighting, and more!

### Try the toolbar above! 👆

Click the formatting buttons or use keyboard shortcuts to format your text.

## 📝 Markdown Examples

### Lists

- Unordered list item
- Another item
  - Nested item
  - Another nested item

1. Ordered list item
2. Second item
3. Third item

### Task Lists

- [x] Completed task
- [ ] Incomplete task
- [ ] Another task

### Code Blocks

\`\`\`typescript
import { Marzipan, tinyHighlightPlugin, mermaidPlugin } from '@pinkpixel/marzipan';

const [editor] = new Marzipan('#editor', {
  toolbar: true,
  theme: 'cave',
  smartLists: true,
  plugins: [tinyHighlightPlugin(), mermaidPlugin()],
});
\`\`\`

### Blockquotes

> This is a blockquote.
> It can span multiple lines.
>
> > Nested quotes work too!

### Tables

| Feature | Status | Notes |
|---------|--------|-------|
| Overlay Preview | ✅ | Real-time rendering |
| Smart Lists | ✅ | Auto-continuation |
| Plugins | ✅ | Extensible architecture |
| Themes | ✅ | Solar, Cave, and custom |

### Mermaid Diagram

\`\`\`mermaid
graph LR
    A[📝 Write] --> B[🔍 Preview]
    B --> C[✅ Done]
\`\`\`

---

## 🎨 Try Different Views

Use the **View** menu in the toolbar to switch between:
- **Normal** - Edit mode with overlay preview
- **Plain** - Plain textarea without markdown rendering
- **Preview** - Read-only preview mode

**💡 Tip:** Enable the stats bar in the toolbar to see character, word, and line counts!

Made with ❤️ by Pink Pixel
`

const tables = `# ▦ Table Grid Plugin — Full Table Showcase

The **tableGridPlugin** provides a visual grid picker in the toolbar for inserting
GFM-compliant tables with alignment and optional header styling.

---

## Basic Table

| Column A | Column B | Column C |
| -------- | -------- | -------- |
| Row 1    | Data     | Value    |
| Row 2    | Data     | Value    |
| Row 3    | Data     | Value    |

---

## Column Alignment

Tables support **left**, **center**, and **right** alignment:

| Left Aligned   | Center Aligned | Right Aligned |
| :------------- | :------------: | ------------: |
| Left           |    Center      |         Right |
| Text is left   |   Centered     |    Flush right|
| aligned        |   text here    |         value |

---

## Feature Comparison Table

| Feature               | Marzipan       | Editor A       | Editor B       |
| :-------------------- | :------------: | :------------: | :------------: |
| Zero Dependencies     | ✅             | ❌             | ❌             |
| Overlay Preview       | ✅             | ❌             | ✅             |
| Plugin System         | ✅             | ✅             | ❌             |
| Smart Lists           | ✅             | ✅             | ✅             |
| Syntax Highlighting   | ✅             | ✅             | ✅             |
| Mermaid Diagrams      | ✅             | ❌             | ❌             |
| Table Grid Picker     | ✅             | ❌             | ❌             |
| Custom Themes         | ✅             | ✅             | ❌             |
| Framework Agnostic    | ✅             | ❌             | ❌             |
| TypeScript Native     | ✅             | ❌             | ✅             |
| Bundle Size           | ~18kb          | ~250kb         | ~150kb         |

---

## Keyboard Shortcuts Reference

| Shortcut                | Action               | Notes                     |
| :---------------------- | :------------------- | :------------------------ |
| \`Cmd/Ctrl + B\`          | Toggle **Bold**      | Wraps with \`**\`           |
| \`Cmd/Ctrl + I\`          | Toggle *Italic*      | Wraps with \`_\`            |
| \`Cmd/Ctrl + K\`          | Insert Link          | Prompts for URL           |
| \`Cmd/Ctrl + Shift + X\`  | ~~Strikethrough~~    | Wraps with \`~~\`           |
| \`Tab\`                   | Indent               | Adds 2 spaces             |
| \`Shift + Tab\`           | Outdent              | Removes 2 spaces          |
| \`Enter\` (in list)      | Continue list        | Smart list continuation   |

---

## Plugin Configuration Options

| Option         | Type     | Default | Description                              |
| :------------- | :------: | :-----: | :--------------------------------------- |
| \`maxRows\`      | number   | 6       | Maximum rows in the grid picker          |
| \`maxColumns\`   | number   | 6       | Maximum columns in the grid picker       |

---

<!-- mz-table: header=pink -->
| Color Theme  | Background  | Text        | Accent      |
| :----------- | :---------: | :---------: | ----------: |
| Solar        | #fefce8     | #1c1917     | #ca8a04     |
| Cave         | #16161a     | #e5e7eb     | #db2777     |
| Custom       | Any color   | Any color   | Any color   |

---

## Data Table Example

| ID  | Name            | Role            | Status    | Score |
| :-: | :-------------- | :-------------- | :-------: | ----: |
| 1   | Alice Johnson   | Lead Developer  | ✅ Active |   98  |
| 2   | Bob Smith       | Designer        | ✅ Active |   87  |
| 3   | Carol Williams  | QA Engineer     | ⏸ Away   |   92  |
| 4   | Dave Brown      | DevOps          | ✅ Active |   85  |
| 5   | Eve Davis       | PM              | ✅ Active |   91  |
| 6   | Frank Miller    | Frontend Dev    | ❌ Offline|   79  |
| 7   | Grace Wilson    | Backend Dev     | ✅ Active |   94  |
| 8   | Henry Taylor    | Full Stack      | ✅ Active |   88  |

---

## Large Content Table

| Month     | Revenue   | Users  | Growth | Satisfaction |
| :-------- | --------: | -----: | -----: | :----------: |
| January   | $12,500   | 1,200  | +5.2%  | ⭐⭐⭐⭐       |
| February  | $14,200   | 1,450  | +13.6% | ⭐⭐⭐⭐       |
| March     | $15,800   | 1,680  | +11.3% | ⭐⭐⭐⭐⭐     |
| April     | $16,100   | 1,750  | +1.9%  | ⭐⭐⭐⭐       |
| May       | $18,900   | 2,100  | +17.4% | ⭐⭐⭐⭐⭐     |
| June      | $21,300   | 2,500  | +12.7% | ⭐⭐⭐⭐⭐     |
| July      | $20,100   | 2,400  | -5.6%  | ⭐⭐⭐⭐       |
| August    | $22,700   | 2,800  | +12.9% | ⭐⭐⭐⭐⭐     |
| September | $24,500   | 3,100  | +7.9%  | ⭐⭐⭐⭐⭐     |
| October   | $26,200   | 3,400  | +6.9%  | ⭐⭐⭐⭐⭐     |
| November  | $25,800   | 3,350  | -1.5%  | ⭐⭐⭐⭐       |
| December  | $28,400   | 3,700  | +10.1% | ⭐⭐⭐⭐⭐     |

---

Click the **▦** button in the toolbar to open the visual grid picker and insert a new table!
Use the **View** menu to toggle between edit and preview modes.
`

const code = `# ✨ Tiny Highlight Plugin — Full Language Demo

Zero-dependency, regex-based syntax highlighting for fenced code blocks.
Supports **TypeScript**, **JavaScript**, **JSON**, **CSS**, **HTML**, **Bash**, **INI/TOML**, and **Markdown**.

---

## TypeScript

\`\`\`typescript
import { Marzipan, tinyHighlightPlugin } from '@pinkpixel/marzipan';
import type { MarzipanInstance, MarzipanOptions } from '@pinkpixel/marzipan';

interface EditorConfig {
  theme: 'solar' | 'cave';
  fontSize: number;
  plugins: Array<(editor: MarzipanInstance) => void>;
}

class MarkdownEditor {
  private instance: MarzipanInstance | null = null;
  private readonly config: EditorConfig;

  constructor(config: Partial<EditorConfig> = {}) {
    this.config = {
      theme: config.theme ?? 'cave',
      fontSize: config.fontSize ?? 15,
      plugins: config.plugins ?? [tinyHighlightPlugin()],
    };
  }

  async initialize(selector: string): Promise<void> {
    const [editor] = new Marzipan(selector, {
      toolbar: true,
      theme: this.config.theme,
      fontSize: \`\${this.config.fontSize}px\`,
      plugins: this.config.plugins,
    });
    this.instance = editor;
  }

  getValue(): string {
    return this.instance?.getValue() ?? '';
  }

  destroy(): void {
    this.instance?.destroy?.();
    this.instance = null;
  }
}

// Generic utility function
function debounce<T extends (...args: unknown[]) => void>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

const editor = new MarkdownEditor({ theme: 'cave', fontSize: 16 });
await editor.initialize('#my-editor');
console.log(editor.getValue());
\`\`\`

---

## JavaScript

\`\`\`javascript
import { Marzipan } from '@pinkpixel/marzipan';

// Factory function with default options
function createEditor(element, options = {}) {
  const defaults = {
    toolbar: true,
    showStats: true,
    smartLists: true,
    placeholder: 'Start writing markdown...',
  };

  const merged = { ...defaults, ...options };
  const [instance] = new Marzipan(element, merged);

  // Auto-save with debounce
  let saveTimer = null;
  instance.onChange = (value) => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      localStorage.setItem('draft', value);
      console.log('Draft saved at', new Date().toISOString());
    }, 500);
  };

  return instance;
}

// Array manipulation examples
const items = [1, 2, 3, 4, 5];
const doubled = items.map(n => n * 2);
const evens = items.filter(n => n % 2 === 0);
const sum = items.reduce((acc, n) => acc + n, 0);

// Async/Await pattern
async function fetchAndRender(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Network error');
    const markdown = await response.text();
    return markdown;
  } catch (err) {
    console.error('Failed to load:', err.message);
    return '# Error loading content';
  }
}

// Destructuring and spread
const { toolbar, ...rest } = merged;
const allOptions = { ...rest, newOption: true };
\`\`\`

---

## JSON

\`\`\`json
{
  "name": "@pinkpixel/marzipan",
  "version": "1.0.9",
  "description": "Pure TypeScript markdown editor with overlay preview",
  "type": "module",
  "main": "dist/marzipan.js",
  "types": "dist/marzipan.d.ts",
  "license": "Apache-2.0",
  "keywords": ["markdown", "editor", "typescript", "overlay", "preview"],
  "author": {
    "name": "Pink Pixel",
    "url": "https://pinkpixel.dev",
    "email": "admin@pinkpixel.dev"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/pinkpixel-dev/marzipan"
  },
  "scripts": {
    "build": "tsc && vite build",
    "dev": "vite build --watch",
    "typecheck": "tsc --noEmit",
    "lint": "eslint ."
  },
  "devDependencies": {
    "typescript": "^5.7.0",
    "vite": "^6.2.0",
    "vite-plugin-dts": "^4.5.0"
  },
  "peerDependencies": {},
  "exports": {
    ".": {
      "import": "./dist/marzipan.js",
      "types": "./dist/marzipan.d.ts"
    }
  },
  "publishConfig": {
    "access": "public"
  },
  "files": ["dist"],
  "engines": {
    "node": ">=18"
  },
  "browserslist": [
    "defaults",
    "not IE 11"
  ]
}
\`\`\`

---

## CSS

\`\`\`css
/* Marzipan custom theme variables */
:root {
  --bg-primary: #1e1e2e;
  --bg-secondary: #27273a;
  --text: #e2e8f0;
  --accent: #db2777;
  --radius: 0.75rem;
}

.marzipan-container {
  border-radius: var(--radius);
  background: var(--bg-primary);
  color: var(--text);
  font-size: 15px;
  line-height: 1.6;
  transition: all 0.3s ease;
}

.marzipan-container:focus-within {
  box-shadow: 0 0 0 2px var(--accent),
              0 20px 45px -20px rgba(0, 0, 0, 0.7);
}

/* Toolbar styling */
.marzipan-toolbar {
  display: flex;
  gap: 0.25rem;
  padding: 0.5rem;
  background: var(--bg-secondary);
  border-bottom: 1px solid rgba(148, 163, 184, 0.16);
}

.marzipan-toolbar button {
  padding: 0.375rem 0.5rem;
  border-radius: calc(var(--radius) / 2);
  border: none;
  background: transparent;
  color: var(--text);
  cursor: pointer;
}

.marzipan-toolbar button:hover {
  background: rgba(219, 39, 119, 0.15);
  color: #f9a8d4;
}

/* Responsive */
@media (max-width: 768px) {
  .marzipan-container {
    font-size: 14px;
    border-radius: 0.5rem;
  }
}
\`\`\`

---

## HTML

\`\`\`html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Marzipan Editor</title>
  <link rel="stylesheet" href="./styles.css" />
  <style>
    #editor-wrapper {
      max-width: 800px;
      margin: 2rem auto;
      padding: 1rem;
    }
  </style>
</head>
<body>
  <header>
    <h1>My Markdown Editor</h1>
    <nav>
      <a href="#editor">Editor</a>
      <a href="#preview">Preview</a>
    </nav>
  </header>

  <main id="editor-wrapper">
    <div id="editor"></div>
    <button id="save-btn" type="button">Save Document</button>
  </main>

  <footer>
    <p>Powered by <strong>Marzipan</strong> &mdash; Made with &hearts; by Pink Pixel</p>
  </footer>

  <script type="module">
    import { Marzipan, tinyHighlightPlugin } from '@pinkpixel/marzipan';
    const [editor] = new Marzipan('#editor', {
      toolbar: true,
      plugins: [tinyHighlightPlugin()],
    });
  </script>
</body>
</html>
\`\`\`

---

## Bash / Shell

\`\`\`bash
#!/usr/bin/env bash
# Marzipan project setup script

set -euo pipefail

PROJECT_DIR="my-marzipan-app"
NODE_VERSION="18"

echo "Setting up Marzipan project..."

# Check Node.js version
if ! command -v node &> /dev/null; then
  echo "Node.js is required. Please install Node.js >= $NODE_VERSION"
  exit 1
fi

CURRENT_NODE=$(node -v | sed 's/v//' | cut -d. -f1)
if [ "$CURRENT_NODE" -lt "$NODE_VERSION" ]; then
  echo "Node.js $NODE_VERSION+ required, found v$CURRENT_NODE"
  exit 1
fi

# Create project
mkdir -p "$PROJECT_DIR/src"
cd "$PROJECT_DIR"

npm init -y
npm install @pinkpixel/marzipan
npm install -D typescript vite

# Write a basic index
cat > src/index.ts << 'EOF'
import { Marzipan } from '@pinkpixel/marzipan';
new Marzipan('#editor', { toolbar: true });
EOF

echo "Project created in $PROJECT_DIR"
echo "Run: cd $PROJECT_DIR && npx vite"
\`\`\`

---

## INI / TOML Configuration

\`\`\`ini
; Marzipan editor configuration
; Settings for the deployment environment

[general]
name = marzipan-editor
version = 1.0.9
debug = false
log_level = info

[editor]
theme = cave
font_size = 15
line_height = 1.6
toolbar = true
smart_lists = true
show_stats = true

[editor.plugins]
tiny_highlight = true
mermaid = false
table_grid = true
max_rows = 8
max_columns = 8

[deployment]
platform = cloudflare
region = auto
minify = true
sourcemaps = false

[paths]
dist = "./dist"
public = "./public"
assets = "./src/assets"
\`\`\`

---

## Markdown

\`\`\`markdown
# Project README

A **pure TypeScript** markdown editor with _zero_ dependencies.

## Installation

Install via npm:

\\\`\\\`\\\`
npm install @pinkpixel/marzipan
\\\`\\\`\\\`

## Features

- **Overlay Preview** — real-time rendering
- **Smart Lists** — auto-continuation
- **Keyboard Shortcuts** — bold, italic, links
- **Themes** — Solar and Cave built-in

### Quick Links

- [Documentation](https://marzipan.pinkpixel.dev)
- [GitHub](https://github.com/pinkpixel-dev/marzipan)

> Made with love by Pink Pixel
\`\`\`

---

## 🎯 Supported Language Aliases

| Language       | Aliases                                  |
| -------------- | ---------------------------------------- |
| TypeScript     | \`ts\`, \`tsx\`, \`typescript\`                  |
| JavaScript     | \`js\`, \`jsx\`, \`mjs\`, \`cjs\`, \`javascript\`   |
| JSON           | \`json\`, \`jsonc\`                           |
| CSS            | \`css\`, \`scss\`, \`less\`                     |
| HTML           | \`html\`, \`xml\`, \`svg\`                      |
| Bash           | \`bash\`, \`sh\`, \`shell\`, \`zsh\`, \`fish\`      |
| INI            | \`ini\`, \`conf\`, \`toml\`                     |
| Markdown       | \`md\`, \`markdown\`                          |

All highlighting is done with **zero external dependencies** — just regex-based tokenization.
Use the **View** menu to toggle between edit and preview modes.
`

const mermaid = `# 🔀 Mermaid Plugin — Diagram Showcase

Render beautiful diagrams directly in your markdown using **Mermaid** syntax.
The plugin lazy-loads the Mermaid library only when a \`mermaid\` code block is detected.

---

## Flowchart

\`\`\`mermaid
graph TD
    A[📝 Write Markdown] --> B{Contains mermaid block?}
    B -->|Yes| C[🔄 Lazy-load Mermaid]
    C --> D[🎨 Render Diagram]
    B -->|No| E[📄 Standard Preview]
    D --> F[✨ Beautiful Output]
    E --> F
    F --> G[👀 User sees result]
\`\`\`

---

## Sequence Diagram

\`\`\`mermaid
sequenceDiagram
    participant User
    participant Editor as Marzipan Editor
    participant Parser as Markdown Parser
    participant Plugin as Mermaid Plugin
    participant Renderer as Diagram Renderer

    User->>Editor: Type mermaid code block
    Editor->>Parser: Parse markdown content
    Parser->>Plugin: Detected mermaid block
    Plugin->>Renderer: Lazy-load & render
    Renderer-->>Plugin: SVG diagram
    Plugin-->>Editor: Insert into preview
    Editor-->>User: Display rendered diagram
\`\`\`

---

## Pie Chart

\`\`\`mermaid
pie title Marzipan Feature Usage
    "Overlay Preview" : 35
    "Smart Lists" : 20
    "Syntax Highlighting" : 25
    "Mermaid Diagrams" : 10
    "Table Generation" : 10
\`\`\`

---

## Gantt Chart

\`\`\`mermaid
gantt
    title Marzipan Development Timeline
    dateFormat  YYYY-MM-DD
    section Core
    Parser & Overlay      :done, p1, 2025-01-01, 30d
    Toolbar System         :done, p2, after p1, 20d
    Theme Engine           :done, p3, after p2, 15d
    section Plugins
    tinyHighlight          :done, pl1, after p3, 10d
    Table Plugins          :done, pl2, after pl1, 15d
    Mermaid Plugin         :done, pl3, after pl2, 10d
    Image Plugins          :active, pl4, after pl3, 12d
    section Demo
    Bakeshop Demo          :active, d1, after pl3, 20d
    Documentation          :d2, after d1, 15d
\`\`\`

---

## Class Diagram

\`\`\`mermaid
classDiagram
    class Marzipan {
        -options: MarzipanOptions
        -textarea: HTMLTextAreaElement
        -overlay: HTMLElement
        +getValue() string
        +setValue(value: string) void
        +showPreviewMode(show: boolean) void
        +destroy() void
    }
    class MarkdownParser {
        +parse(markdown: string) string
        +renderInline(text: string) string
    }
    class Toolbar {
        -buttons: ToolbarButton[]
        +addButton(btn: ToolbarButton) void
        +render() HTMLElement
    }
    class Plugin {
        <<interface>>
        +install(editor: Marzipan) void
    }
    Marzipan --> MarkdownParser
    Marzipan --> Toolbar
    Marzipan ..> Plugin : uses
\`\`\`

---

## State Diagram

\`\`\`mermaid
stateDiagram-v2
    [*] --> Idle
    Idle --> Editing : User types
    Editing --> Parsing : Input changed
    Parsing --> Rendering : Parse complete
    Rendering --> Preview : Render complete
    Preview --> Editing : User types again
    Preview --> Idle : No changes
    Editing --> Idle : Blur / unfocus

    state Rendering {
        [*] --> Markdown
        Markdown --> Mermaid : Has mermaid blocks
        Markdown --> Tables : Has tables
        Markdown --> CodeBlocks : Has code blocks
        Mermaid --> [*]
        Tables --> [*]
        CodeBlocks --> [*]
    }
\`\`\`

---

## Git Graph

\`\`\`mermaid
gitGraph
    commit id: "init"
    commit id: "core parser"
    branch feature/toolbar
    commit id: "toolbar UI"
    commit id: "button actions"
    checkout main
    merge feature/toolbar id: "merge toolbar"
    branch feature/plugins
    commit id: "plugin system"
    commit id: "tinyHighlight"
    commit id: "mermaid plugin"
    checkout main
    merge feature/plugins id: "merge plugins"
    commit id: "v1.0 release"
\`\`\`

---

## 🎯 Supported Diagram Types

| Diagram         | Syntax Keyword      | Description                          |
| --------------- | -------------------- | ------------------------------------ |
| Flowchart       | \`graph\` / \`flowchart\` | Directional flow diagrams            |
| Sequence        | \`sequenceDiagram\`    | Interaction between participants     |
| Class           | \`classDiagram\`       | UML class relationships              |
| State           | \`stateDiagram-v2\`    | State machine transitions            |
| Gantt           | \`gantt\`              | Project timeline charts              |
| Pie             | \`pie\`                | Proportional data visualization      |
| Git Graph       | \`gitGraph\`           | Branch and merge visualization       |

Toggle between **Edit** and **Preview** modes to see the raw mermaid syntax and rendered output.
`

const images = `# 🖼️ Image Plugins — Full Demo

Marzipan ships two complementary image plugins for inserting images into your markdown.

---

## 🗂️ Image Manager Plugin

The **imageManagerPlugin** adds a full-featured image management panel to your toolbar:

- **Upload** — Pick a file from your device  
- **URL** — Paste any image URL to add it  
- **Drag & Drop** — Drop images onto the editor or the panel's dropzone  
- **Clipboard Paste** — Paste images directly from your clipboard (Ctrl+V / Cmd+V)  
- **Recents Gallery** — Thumbnails of recently used images, click to re-insert  
- **Persistent Storage** — Small images (≤ 1 MB) are saved to localStorage as data-URLs  
- **Remote Upload** — Pass an optional \`uploader(file)\` callback for server-side storage  

Look for the **🗂️** button in the toolbar above!

### Try It

1. Click the **🗂️** button to open the image manager panel
2. Paste an image URL (e.g. \`https://via.placeholder.com/300x200\`)
3. Or click **Upload** to select a file from your device
4. Or drag and drop an image file directly onto this editor
5. Or copy an image and paste it here with Ctrl+V

### Example Markdown

![Placeholder](https://via.placeholder.com/600x300/db2777/ffffff?text=Marzipan+Image+Demo)

![A scenic landscape](https://via.placeholder.com/600x200/9333ea/ffffff?text=Purple+Dream)

---

## 🖼️ Image Picker Plugin

The **imagePickerPlugin** adds a simpler toolbar button for quick image insertion:

- Click the **🖼️** button in the toolbar to open a small form
- Paste an image URL and add alt text, then press **Enter** or **Insert**
- Or hit **Upload file** to pick an image from your device
- Supports an optional \`uploader()\` callback for remote storage

### Configuration

\`\`\`typescript
import { Marzipan, imagePickerPlugin } from '@pinkpixel/marzipan';

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    imagePickerPlugin({
      label: '🖼️',              // Toolbar button label
      title: 'Insert image',    // Tooltip text
      placeholder: '',          // Starting value for the URL field
      promptMessage: 'Image URL', // Label for the URL field
      uploader: async (file) => {
        // Optional: upload to your server
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const { url } = await res.json();
        return url;
      },
    }),
  ],
});
\`\`\`

---

## 🗂️ Image Manager Configuration

\`\`\`typescript
import { Marzipan, imageManagerPlugin, imageManagerStyles } from '@pinkpixel/marzipan';

// Inject the companion CSS
const style = document.createElement('style');
style.textContent = imageManagerStyles;
document.head.appendChild(style);

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    imageManagerPlugin({
      label: '🗂️',                    // Toolbar button text
      title: 'Images',                // Tooltip
      maxRecent: 24,                  // Max thumbnails to keep
      persistThresholdBytes: 1048576, // 1 MB — files under this are saved as data-URLs
      onInsert: (url) => url,         // Transform URL before inserting
      uploader: async (file) => {
        // Upload to your backend and return the URL
        const form = new FormData();
        form.append('image', file);
        const res = await fetch('/api/images', {
          method: 'POST',
          body: form,
        });
        const data = await res.json();
        return data.url;
      },
    }),
  ],
});
\`\`\`

---

## Comparison

| Feature                  | Image Manager 🗂️ | Image Picker 🖼️ |
| :----------------------- | :---------------: | :--------------: |
| Toolbar button           | ✅                | ✅               |
| URL insertion             | ✅                | ✅               |
| File upload              | ✅                | ✅               |
| Drag & drop              | ✅                | ❌               |
| Clipboard paste          | ✅                | ❌               |
| Recents gallery          | ✅                | ❌               |
| localStorage persistence | ✅                | ❌               |
| Remote uploader callback | ✅                | ✅               |
| Panel UI                 | ✅ Full panel     | ✅ Small form    |
| Bundle size impact       | ~3 KB             | ~1 KB            |

### When to Use Which?

- Use **imageManagerPlugin** when you want a rich image management experience with drag & drop, paste support, and a recents gallery
- Use **imagePickerPlugin** for a lightweight URL-or-upload form
- You can use **both** together — they add separate toolbar buttons and work independently

---

## Live Test Area

Try the image features in this editor! The toolbar above has both the **🗂️** (Image Manager) and **🖼️** (Image Picker) buttons.

### Markdown Image Syntax

\`\`\`markdown
![Alt text](https://example.com/image.png)
![Photo caption](./local-image.jpg)
![](https://via.placeholder.com/400x200)
\`\`\`

### Rendered Images

Here are some example images rendered in the preview:

![Pink gradient](https://via.placeholder.com/500x150/ec4899/ffffff?text=Pink+Pixel+✨)

![Cave theme](https://via.placeholder.com/500x150/16161a/e5e7eb?text=Cave+Theme+🦇)

![Solar theme](https://via.placeholder.com/500x150/fefce8/1c1917?text=Solar+Theme+☀️)
`

export const SAMPLES: Sample[] = [
  { id: 'welcome', label: 'Welcome', content: welcome },
  { id: 'tables', label: 'Tables', content: tables },
  { id: 'code', label: 'Code highlighting', content: code },
  { id: 'mermaid', label: 'Mermaid diagrams', content: mermaid },
  { id: 'images', label: 'Images', content: images },
]
