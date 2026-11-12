# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.6/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

---

## [1.3.1] - 2026-11-11

### 🐛 Fixes

- Mermaid click handlers (`click A callback`) work again after a re-render. Cached diagrams now re-attach `bindFunctions`, and `mermaidPlugin` binds them at all (it never did before).
- The `fontFamily` option works now. It used to be ignored, so the editor always used the default monospace stack.
- In preview mode, the Mermaid source block is hidden again and only the diagram shows. A later code-block rule was overriding the hide rule.
- Mermaid diagrams no longer come out blank when two editors render at the same moment (React StrictMode does this). Render ids are unique across the page now, and an empty render is never cached.
- `npm run dev` keeps the `.d.ts` files up to date. It does one clean build, then runs the Vite and `tsc` watchers side by side, and the watching build no longer empties `dist/`.

### ♿ Accessibility

- The `tableGridPlugin` size picker works from the keyboard. The grid gets focus when it opens, arrow keys change rows and columns, and Enter inserts.

### 🧹 Maintenance

- `mermaidPlugin` and `mermaidExternalPlugin` share one renderer (`src/plugins/utils/mermaid.ts`) instead of two copies of the same loop.
- The npm package no longer ships `logo.png`, `favicon.png`, or the docs site's images and VitePress config (about 1.1 MB smaller).
- `docs-site/` (VitePress build output) is no longer committed. Run `npm run docs:build` before deploying, like the README says. Removed the unused `.npmignore`.
- Removed the old Bakeshop pages, `tailwind.config.js` and `SETUP.md` (covered by the new demo README).

### 🧁 Bakeshop demo

- Rebuilt as one full-screen workspace: samples on the left, a live editor in the middle, and an inspector with Setup, Code, Actions and API tabs on the right.
- Every option, theme and plugin is a toggle, and the Code tab writes the matching `new Marzipan()` setup for you.
- The API tab runs real instance methods and shows what they return. The Actions tab highlights the formats under the cursor.
- New look: a charcoal base, a softer pink accent, Geist and Geist Mono, lucide icons, and no gradient text. Tailwind moved from a 4.0 alpha to 4.3.5.

---

## [1.3.0] - 2026-11-11

### 🔌 Plugin API

- `editor.insertText(text)` replaces the selection or inserts at the cursor. It goes through the browser's editing commands, so Ctrl+Z undoes it.
- `editor.addToolbarButton({ title, label, icon, className, onClick })` adds a toolbar button. With the toolbar turned off, Marzipan creates a small plugin toolbar above the editor instead of dropping the button somewhere odd.
- `editor.addHook('afterPreviewRender', fn)` registers a render hook and returns a function to remove it. Async hooks are fine, and one throwing hook no longer stops the rest.
- New exported types: `PreviewHook`, `HookName` and `PluginButtonOptions`.

### ✨ Plugins

- No more `prompt()`, `alert()` or `confirm()`. Plugins open small popovers that match the editor theme, close on Escape or an outside click, and hand focus back to their button.
- `tablePlugin` opens a rows + columns form. `tableGeneratorPlugin` is now an alias for it, so old imports still work.
- `imagePickerPlugin` opens a form with an image URL, alt text, and an upload button. Upload errors show up inline instead of in an alert.
- `imageManagerPlugin` asks for a second click before clearing recents, and shows errors inside the panel.
- Every built-in plugin inserts text through `insertText()`, so plugin inserts are undoable now. They used to wipe the undo history.
- `tableGridStyles` and `imageManagerStyles` fall back to the editor's theme colors instead of hard-coded dark ones, so they look right in Solar too.

### 🐛 Fixes

- `reinit({ hooks })` no longer drops the hooks that plugins like Mermaid and tinyHighlight rely on. Plugins register through `addHook()` now, which `reinit()` doesn't touch.

### 🧪 Tests

- Added `tests/plugins.test.ts` covering the plugin API, popover behavior, and the table and image plugins.

---

## [1.2.5] - 2026-11-11

### 🏷️ Types

- The `.d.ts` files are generated from the real source now, instead of a hand-written `marzipan.d.ts` that could quietly drift from the code. `@ts-nocheck` is gone from every file, and the whole library is checked under `strict`.
- `MarzipanInstance` is the editor class itself, so every public property and method is typed exactly as it behaves. `new Marzipan(target, options)` is still typed as returning an array of editors.
- New exported types: `Options`, `MarzipanTarget`, `ToolbarButtonShortcut`, `ToolbarButtonOption`, `ListContext`, `Sanctuary`, `TableAlignment`, `LinkInfo`, `StyleOptions` and `MermaidPluginConfig`. `MarzipanOptions` still works as an alias for `Options`.
- Built-in plugins take the real editor type instead of `any`.

### 📦 Build

- `dist/` is emptied on every build. Old builds were leaving stale plugin files and a second copy of every Mermaid chunk behind, which nearly doubled the package (28 MB down to 16 MB).
- The build is now `vite build` followed by `tsc -p tsconfig.build.json`, which only emits declarations. `scripts/post-build.js` is gone.
- The package `exports` list `types` first, so TypeScript resolves them reliably.

### 🧹 Maintenance

- `npm run lint` passes with zero errors. The root lint no longer reaches into `bakeshop-demo/` or `docs-site/`, which have their own setup.
- Removed the preview's "Start typing..." fallback, which could never show (the textarea placeholder handles it).
- Removed `content.txt` and `docs/types.d.ts`, and moved `OVERVIEW.md` to `DOCS/`.

---

## [1.2.4] - 2026-11-11

### 🔒 Security

- Table cells no longer render raw HTML. Something like `| <img src=x onerror=alert(1)> |` used to come out as a live element, even in edit mode where the table is only hidden with CSS. Cells are escaped now, just like every other line.
- The link tooltip runs the URL through `sanitizeUrl()` before opening it, and opens it with `noopener,noreferrer`.
- `data:image/` URLs are only allowed as image sources now, not as link targets.

### 🐛 Fixes

- Inline code, link URLs, and image alt text were being escaped twice, so `a < b` or `?a=1&b=2` showed up as `&lt;` and `&amp;` in the overlay and pushed the cursor out of line.
- `* item with *emphasis*` renders correctly. The bullet's `*` used to pair up with the italic marker.
- `####` through `######` headings and `+` bullets render now.
- `Marzipan.destroyAll()` actually destroys instances. It was looking them up on the wrong element.
- `onChange` only fires when the content changes. It used to fire on every cursor move, and moving the cursor re-rendered the whole preview (mermaid included). Now it only re-renders on cursor moves when `showActiveLineRaw` is on.
- Tab and Shift+Tab indent or outdent whole lines from the line start. Shift+Tab with no selection outdents the current line instead of inserting spaces. Press Escape and then Tab to move focus out of the editor.
- Smart list renumbering only touches the list you're in, keeps the number the list starts at, and goes through the undo stack instead of overwriting the textarea.
- Checkbox items accept `[X]` and any bullet marker, and handle extra spaces after the marker.
- The link tooltip anchors to the right link when the line has images or links inside inline code.
- `getCleanHTML()` no longer leaves image alt text sitting next to the `<img>`.
- `options.value` is used when the host element only contains whitespace.
- The server-side (no DOM) post-processing path groups lists and code blocks again.
- Toolbar and shortcut actions don't render the preview twice anymore.
- Ctrl+` (Cmd+` on Mac) toggles inline code, like the toolbar tooltip always said it did.
- The view-mode dropdown belongs to its own toolbar, so it works with more than one editor on the page. It also supports the arrow keys, Escape, and `aria-expanded` now.
- Mermaid diagrams no longer throw off the edit-mode overlay. The source code block stays in place and the diagram only shows in preview mode. Rendered diagrams are cached, so they don't redraw on every keystroke.
- `imageManagerPlugin`: scrolling the thumbnail grid doesn't close the panel anymore, session-only `blob:` URLs aren't saved to localStorage, filenames can't break the `![alt](url)` syntax, and a new `storageKey` option lets each editor keep its own recents.

### 🧪 Tests

- Added a vitest + happy-dom suite (`npm test`) covering the parser and the editor fixes above.

---

## [1.2.3] - 2026-03-01

### Fixed

- **Image `blob:` and `data:` URL Support**: `sanitizeUrl()` now allows `blob:` URLs (created by `URL.createObjectURL()`) and `data:image/` URLs (created by `FileReader.readAsDataURL()`). Previously these were blocked as unsafe protocols, causing image uploads via `imagePickerPlugin` and `imageManagerPlugin` to render as broken images showing only alt text.
- **Image Rendering in Overlay Mode**: Images no longer replace the full `![alt](url)` markdown syntax with a bare `<img>` tag in the overlay, which broke character-by-character alignment. The parser now renders both the visible markdown syntax (for overlay alignment) and a hidden `<img>` tag. In preview mode, the syntax text is hidden and the rendered image is shown instead.

---

## [1.2.2] - 2026-02-28

### Changed

- **`tableGridPlugin` Popover**: Simplified the options panel — removed the Style Presets row and Border Style row entirely. Replaced with a single **Header Color** row offering six pastel swatches (pink, purple, blue, cyan, green, amber) plus a "none" option. Preferences continue to be persisted to `localStorage`.
- **`TableBuildOptions` Interface**: Removed `style` (`TableStyle`) and `borderStyle` (`BorderStyle`) fields. Added `headerColor?: string` — one of `'pink' | 'purple' | 'blue' | 'cyan' | 'green' | 'amber'` (or omit for no color).
- **Table Annotation Syntax**: Simplified from `<!-- mz-table: style=<preset> border=<style> -->` to `<!-- mz-table: header=<color> -->`. Only the header color is configurable via annotation.

### Fixed

- **Table Body Cell Text Insertion**: Typing inside body cells of a newly inserted table now correctly places the cursor within the cell. Body cell text was previously inserted after the row because cells were too narrow (9 chars) while the header row was wider, causing click offsets past the end of the line. `buildTableMarkdown()` now pads body cells to match the header column widths.
- **Table Edit-Mode Overlay Alignment**: The `<table>` element is now hidden (`display: none`) in edit mode. The raw pipe-text `<div>` lines are used as the overlay so the browser `<table>` layout engine can no longer cause cursor row misalignment. The styled `<table>` is shown only in preview mode. Annotation and separator lines are dimmed (`opacity: 0.45`) in edit mode so they remain legible but clearly secondary.

### Removed

- **`TableStyle` and `BorderStyle` types**: Both type aliases and all associated CSS classes (`mz-style-striped`, `mz-style-rainbow`, `mz-style-minimal`, `mz-border-dashed`, etc.) are removed. Migrate any `style` / `borderStyle` options in `buildTableMarkdown()` calls to the new `headerColor` option.

---

## [1.2.1] - 2026-02-28

### Added

- **Table Column Alignment**: GFM column alignment support (`:---`, `:---:`, `---:`) is now parsed and rendered with correct `text-align` styles in the preview.
- **Table Style Presets**: Four built-in table style presets — `default`, `striped` (alternating row backgrounds), `rainbow` (six-colour row cycling), and `minimal` (reduced-chrome borders).
- **Table Border Styles**: Configurable border styles — `solid`, `dashed`, `dotted`, `double`, and `none` — applied via CSS classes.
- **Table Annotation Syntax**: New `<!-- mz-table: style=<preset> border=<style> -->` HTML comment convention that Marzipan parses to apply style/border classes. Invisible to other renderers.
- **Enhanced `tableGridPlugin` Popover**: Options panel below the grid with Align, Style, and Border toggle buttons. Preferences persist to `localStorage`.
- **`TableBuildOptions` Interface**: `buildTableMarkdown()` now accepts a typed options object (`rows`, `cols`, `headers`, `alignment`, `style`, `borderStyle`) in addition to the original `(rows, cols)` signature.
- **New type exports**: `ColumnAlignment`, `TableStyle`, `BorderStyle`, `TableBuildOptions` exported from the plugins barrel.

### Fixed

- **Table Width**: Tables no longer stretch to full page width. Changed from `width: 100%` to `width: auto` so tables size naturally to their content.

### Removed

- **accentSwatchPlugin**: Removed the accent color swatch plugin and all related code (`accentSwatchPlugin`, `accentSwatchStyles`). The plugin has been pulled from the core library. All references removed from documentation, demos, and type declarations.

---

## [1.1.2] - 2025-02-27

### Fixed

- **tinyHighlightPlugin**: Rewrote the `applyRules` tokenizer to fix double-escaping bug. Regex patterns now run against raw source code instead of pre-escaped HTML, so strings, comments, HTML tags, and all other token types highlight correctly. Overlapping matches are properly filtered.
- **tinyHighlightPlugin**: Added missing language aliases — `javascript`, `typescript`, `jsonc`, `svg`, `scss`, `less`, `zsh`, `fish`, and `toml` are now recognised in fenced code blocks alongside existing short aliases (`js`, `ts`, etc.).
- **accentSwatchPlugin**: Added missing base styles for the color-picker popover (`background`, `border`, `border-radius`, `box-shadow`, `z-index`, `padding`, `font-family`, `color`). The popover was rendering as an invisible transparent element.
- **accentSwatchPlugin**: Popover and swatch elements now apply critical visual styles inline to survive CSS framework resets (e.g. Tailwind v4 preflight).

### Removed

- **Block Handles Plugin**: Removed the `BlockHandlesPlugin` and all related code (`blockHandles` option, `BlockHandle`/`BlockHandlesConfig` types, `docs/block-handles.md`). The feature was not functioning correctly and has been pulled pending a future redesign. Parser block metadata attributes (`data-block-id`, `data-block-type`, etc.) remain in place for future plugin use.

---

## [1.1.0] - 2025-02-25

### Added

- **`toggleStrikethrough` Action**: New built-in formatting action supporting both `~~text~~` (double-tilde) and `~text~` (single-tilde) strikethrough syntax; available from the main package alongside the existing action toolkit
- **`insertHorizontalRule` Action**: New built-in action that inserts a `---` horizontal divider at the cursor position, automatically adding surrounding newlines for correct markdown output
- **Link Tooltip**: Context-aware URL preview tooltip that appears when the cursor is positioned inside a markdown link in the editor
  - Uses the modern CSS Anchor Positioning API (`position-anchor` / `position-area`) for pixel-accurate placement below the link
  - Gracefully degrades in browsers without CSS anchor support — silently disabled with no impact on the editor
  - Implemented as a `LinkTooltip` class instance attached automatically to every editor and cleaned up on `destroy()`

### Fixed

- **Plugin Exports**: Added missing plugin exports to `src/plugins/index.ts` and main package
  - All plugins now properly exported: `accentSwatchPlugin`, `imageManagerPlugin`, `imagePickerPlugin`, `mermaidPlugin`, `mermaidExternalPlugin`, `tablePlugin`, `tableGridPlugin`, `tableGeneratorPlugin`, `tinyHighlightPlugin`
  - Added corresponding TypeScript type exports for all plugin options and interfaces
  - Plugins can now be imported both individually (`@pinkpixel/marzipan/plugins/tablePlugin`) and from the main package (`import { tablePlugin } from '@pinkpixel/marzipan'`)
  - Added convenience namespace export (`import { plugins } from '@pinkpixel/marzipan'`)
  - Resolves issue where documented plugins were not accessible via standard import paths
- **Block Handles `handleOffset` default**: Documentation corrected — the actual runtime default is `4`, not `-30`
- **Syntax Highlighting**: `tinyHighlightPlugin` recognises `md` and `markdown` as valid language identifiers for fenced code blocks

---

## [1.0.9] - 2025-01-05

### Added

- **Block Handles Plugin**: Interactive block manipulation system for the preview overlay
  - Visual handles appear on hover for each markdown block
  - Click handles to select blocks with visual feedback
  - Right-click handles for context menu with copy/delete actions
  - Keyboard shortcuts: Ctrl/Cmd+C to copy, Delete/Backspace to delete selected blocks
  - Shift+Click on any block to select it instantly
  - Block metadata tracking in parser (`data-block-id`, `data-block-type`, `data-line-start`, `data-line-end`)
  - Customizable handle appearance, colors, and positioning
  - Event system for block selection (`blockSelected`, `blockDeselected` events)
  - Toast notifications for user feedback
  - Full demo page showcasing all features (`examples/block-handles-demo.html`)
  - Comprehensive documentation in `docs/block-handles.md`
- Parser now adds block metadata attributes to all rendered elements for plugin integration
- Exported `BlockHandlesPlugin` and related types from main package
- Added `npm run serve` script for running examples locally

### Changed

- Block handles plugin is enabled by default (can be disabled with `blockHandles: false`)

---

## [1.0.8] - 2025-10-04

### Added

- Toolbar button shorthands (`plain`, `view`, and separators) so custom toolbars can be composed quickly with strings instead of verbose config objects.
- Prompt customization for the image picker plugin via `placeholder` and `promptMessage` options.

### Changed

- Restored per-instance theme overrides and shipped `light`/`dark` aliases alongside `solar`/`cave`, ensuring `colors` merges reliably.
- Exposed `getStats()` and `getContainer()` on editor instances and made `showPlainTextarea()` return the current state when called without arguments.
- Refreshed documentation (core docs + VitePress site) to cover the new toolbar presets, theme color tokens, and expanded preview examples.

### Fixed

- Table styling now respects themed secondary backgrounds for consistent appearance across custom palettes.

---

## [1.0.7] - 2025-10-04

### Added

- Bundled the full markdown action suite under `src/actions` and exported it from the core package so projects no longer need the external `markdown-actions` dependency.
- Documented the plugin collection now published from `src/plugins`, including usage guides in the main README, docs, and demo walkthroughs.
- Introduced a comprehensive documentation refresh covering the new action utilities, plugin APIs, and demo workflows across `/docs`, `README.md`, `OVERVIEW.md`, and `bakeshop-demo/README.md`.
- **Comprehensive TypeScript declarations** for better developer experience and IDE autocomplete support
  - Enhanced `marzipan.d.ts` with detailed JSDoc comments and full API documentation
  - Generated `index.d.ts` with complete type exports for all modules
  - Added type exports for actions, themes, plugins, and all public APIs
  - Improved type safety with proper interface definitions for `MarkdownParser`, themes, and configuration options

### Changed

- Updated contribution guidance and quick-start instructions to reflect the streamlined package layout and Node.js 20+ support.
- Refined the documentation structure, aligning the table of contents with the shipped guides and clarifying how to access bundled plugins and formatting helpers.
- Enhanced post-build script to automatically generate comprehensive type declarations

### Fixed

- Corrected TypeScript type usage in bakeshop demo (using `MarzipanInstance` instead of `typeof Marzipan`)
- Resolved type inference issues in demo application

---

## [1.0.6] - 2025-09-26

### Added

- Initial public release of the Marzipan core editor library and Bakeshop demo application.
- Live overlay preview, theming system, toolbar, keyboard shortcuts, stats panel, and plugin foundation.
- TypeScript declarations, documentation set, and contribution guide.

[Unreleased]: https://github.com/pinkpixel-dev/marzipan/compare/v1.1.1...HEAD
[1.1.1]: https://github.com/pinkpixel-dev/marzipan/compare/v1.1.0...v1.1.1
[1.1.0]: https://github.com/pinkpixel-dev/marzipan/compare/v1.0.9...v1.1.0
[1.0.9]: https://github.com/pinkpixel-dev/marzipan/compare/v1.0.8...v1.0.9
[1.0.8]: https://github.com/pinkpixel-dev/marzipan/compare/v1.0.7...v1.0.8
[1.0.8-release]: https://github.com/pinkpixel-dev/marzipan/releases/tag/v1.0.8
[1.0.7]: https://github.com/pinkpixel-dev/marzipan/compare/v1.0.6...v1.0.7
[1.0.7-release]: https://github.com/pinkpixel-dev/marzipan/releases/tag/v1.0.7
