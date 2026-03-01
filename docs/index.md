---
layout: home

hero:
  name: "🧁 Marzipan"
  text: "Framework-agnostic markdown editor"
  tagline: "Live overlay preview, zero runtime dependencies, and batteries-included formatting actions."
  image:
    src: /logo.png
    alt: Marzipan Logo
  actions:
    - theme: brand
      text: Get Started
      link: /quick-start
    - theme: alt
      text: API Reference
      link: /api
    - theme: alt
      text: 🛝 Playground
      link: https://bakeshop.pinkpixel.dev
    - theme: alt
      text: View on GitHub
      link: https://github.com/pinkpixel-dev/marzipan

features:
  - icon: 🔷
    title: Pure TypeScript Core
    details: Ships typed ESM builds and declaration files with zero runtime dependencies.
  - icon: ⚡
    title: First-Party Actions
    details: Formatting helpers live in src/actions and export with the library — no extra installs needed.
  - icon: 🧩
    title: Plugin Library
    details: Production-ready plugins for tables (with alignment, style presets & borders), Mermaid, syntax highlighting, media helpers, and more.
  - icon: 👁️
    title: Overlay Preview
    details: Renders markdown directly over the textarea so alignment never drifts.
  - icon: 🎨
    title: Themeable UI
    details: Includes Solar (light) and Cave (dark) themes with full CSS variable customization.
  - icon: 🛝
    title: Demo Bakeshop
    details: A Vite + React playground that exercises every option and plugin in a live environment.
---

## Quick Install

```bash
npm install @pinkpixel/marzipan
```

## Create Your First Editor

```ts
import { Marzipan } from "@pinkpixel/marzipan";

const [editor] = new Marzipan("#my-textarea", {
  toolbar: true,
  theme: "cave",
  smartLists: true,
});
```

## Use the Bundled Actions

```ts
import { actions } from "@pinkpixel/marzipan";

const textarea = document.querySelector("textarea")!;
actions.toggleBold(textarea);
```

## Add a Plugin

```ts
import { tablePlugin } from "@pinkpixel/marzipan/plugins/tablePlugin";

new Marzipan("#editor", {
  plugins: [tablePlugin()],
});
```

## Bundled Plugins

| Plugin                  | Description                                                                               |
| ----------------------- | ----------------------------------------------------------------------------------------- |
| `tablePlugin`           | Toolbar-driven table generator with inline editing controls                               |
| `tableGridPlugin`       | Grid overlay for rapid column/row creation                                                |
| `tableGeneratorPlugin`  | Quick GFM table inserter with prompt-driven sizing                                        |
| `tinyHighlightPlugin`   | Zero-runtime syntax highlighting for fenced code blocks                                   |
| `imageManagerPlugin`    | Dropzone and gallery UI for inserting images and managing uploads                         |
| `imagePickerPlugin`     | Toolbar button for inserting images via URL or optional uploader callback                 |
| `mermaidPlugin`         | Diagram rendering via ESM import                                                          |
| `mermaidExternalPlugin` | Mermaid integration via CDN script tag                                                    |
| `BlockHandlesPlugin`    | Interactive block manipulation with visual handles, context menus, and keyboard shortcuts |

See the full [Plugin Catalogue](/plugins) for configuration details.
