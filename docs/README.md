# Marzipan Documentation Portal

Welcome! This folder contains everything you need to install, configure, and extend the Marzipan markdown editor.

## 📚 Navigation

| Guide                            | Purpose                                                                                 |
| -------------------------------- | --------------------------------------------------------------------------------------- |
| [Quick Start](./quick-start.md)  | Install the library, render your first editor, and wire up bundled actions and plugins. |
| [API Reference](./api.md)        | Full class API, key options, utility methods, and action helper signatures.             |
| [Plugin Catalogue](./plugins.md) | Overview of the first-party plugins shipped from `src/plugins` with configuration tips. |
| [Type Definitions](./types.d.ts) | Generated TypeScript declarations for deep integration and tooling.                     |

## 🧭 Orientation

- **Actions live here now** – All formatting helpers are part of the core package (`@pinkpixel/marzipan`). Import them directly from `@pinkpixel/marzipan` to remove any external dependency.
- **Plugins ship in the box** – Every plugin in `src/plugins` is published under `@pinkpixel/marzipan/plugins/<name>`. Each guide explains how to tree-shake just the features you need.
- **Docs mirror the repo** – Content in `/docs` matches the current repository layout (as of October 4, 2025). When files move, update both the guide and [docs/TABLE_OF_CONTENTS.md](./TABLE_OF_CONTENTS.md).

## 🔖 Recommended Reading Order

1. **Quick Start** – get an editor running in under five minutes.
2. **API Reference** – understand the Marzipan class, events, and helper utilities.
3. **Plugin Catalogue** – explore optional capabilities like tables, Mermaid, media helpers, and syntax highlight.
4. **Type Definitions** – browse generated typings for IDE integration.

## 🧁 Related Resources

- Project overview and roadmap: [../OVERVIEW.md](../OVERVIEW.md)
- Repository changelog: [../CHANGELOG.md](../CHANGELOG.md)
- Demo playground guide: [../bakeshop-demo/README.md](../bakeshop-demo/README.md)

Have feedback? Open an issue or PR – documentation updates are always welcome.
