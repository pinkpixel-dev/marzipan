# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.6/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
