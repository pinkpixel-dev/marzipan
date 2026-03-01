import { useEffect, useRef, useState } from 'react'
import { Marzipan, tinyHighlightPlugin, tableGridPlugin } from '@pinkpixel/marzipan'
import type { MarzipanInstance } from '@pinkpixel/marzipan'

const TINY_HIGHLIGHT_CONTENT = `# ✨ Tiny Highlight Plugin — Full Language Demo

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

export default function TinyHighlightDemo({ onBack }: { onBack: () => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorInstance, setEditorInstance] = useState<MarzipanInstance | null>(null)
  const [isPreview, setIsPreview] = useState(true)

  useEffect(() => {
    if (!editorRef.current) return

    const [instance] = new Marzipan(editorRef.current, {
      value: TINY_HIGHLIGHT_CONTENT,
      toolbar: true,
      showStats: true,
      smartLists: true,
      theme: 'cave',
      fontSize: '15px',
      lineHeight: 1.6,
      plugins: [
        tinyHighlightPlugin(),
        tableGridPlugin({ maxRows: 8, maxColumns: 8 }),
      ],
    })

    instance.showPreviewMode(true)
    setEditorInstance(instance)

    return () => {
      instance.destroy?.()
    }
  }, [])

  const togglePreview = () => {
    if (!editorInstance) return
    const next = !isPreview
    editorInstance.showPreviewMode(next)
    setIsPreview(next)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            ← Back to Plugins
          </button>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">✨</span>
          <div>
            <h2 className="text-3xl font-bold text-emerald-300">Tiny Highlight Plugin</h2>
            <p className="text-slate-400 mt-1">
              Zero-dependency, regex-based syntax highlighting for fenced code blocks
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={togglePreview}
            className="text-sm px-4 py-2 rounded-lg border border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/10 transition-colors"
          >
            {isPreview ? '✏️ Switch to Edit Mode' : '👁 Switch to Preview'}
          </button>
          <code className="text-sm bg-slate-800 border border-slate-600 px-3 py-2 rounded-lg text-emerald-200">
            tinyHighlightPlugin()
          </code>
        </div>
      </div>

      {/* Full-page editor */}
      <div className="card p-6">
        <div ref={editorRef} style={{ height: 'calc(100vh - 200px)', minHeight: '800px' }} />
      </div>

      {/* Usage snippet */}
      <div className="card p-6 bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-cyan-500/10">
        <h3 className="text-lg font-bold text-emerald-200 mb-4">💡 Usage</h3>
        <pre className="code-block">
{`import { Marzipan, tinyHighlightPlugin, tinyHighlightStyles } from '@pinkpixel/marzipan';

// Optional: inject the default styles
const style = document.createElement('style');
style.textContent = tinyHighlightStyles;
document.head.appendChild(style);

new Marzipan('#editor', {
  toolbar: true,
  plugins: [tinyHighlightPlugin()],
});`}
        </pre>
      </div>
    </div>
  )
}
