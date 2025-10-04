# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.6/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[Unreleased]: https://github.com/pinkpixel-dev/marzipan/compare/v1.0.8...HEAD
[1.0.8]: https://github.com/pinkpixel-dev/marzipan/compare/v1.0.7...v1.0.8
[1.0.8-release]: https://github.com/pinkpixel-dev/marzipan/releases/tag/v1.0.8
[1.0.7]: https://github.com/pinkpixel-dev/marzipan/compare/v1.0.6...v1.0.7
[1.0.7-release]: https://github.com/pinkpixel-dev/marzipan/releases/tag/v1.0.7
