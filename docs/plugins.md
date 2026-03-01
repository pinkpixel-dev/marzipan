# Plugin Catalogue

Marzipan ships first-party plugins from the `src/plugins` directory. Each plugin exports a factory from `@pinkpixel/marzipan/plugins/<name>` so you can opt into only the code you need.

## Using a plugin

### Individual plugin imports (recommended)

```ts
import { Marzipan } from "@pinkpixel/marzipan";
import { tablePlugin } from "@pinkpixel/marzipan/plugins/tablePlugin";

new Marzipan("#editor", {
  toolbar: true,
  plugins: [
    tablePlugin({
      defaultColumns: 3,
      defaultRows: 4,
    }),
  ],
});
```

### Main package imports (convenience)

```ts
import { Marzipan, tablePlugin, mermaidPlugin } from "@pinkpixel/marzipan";

new Marzipan("#editor", {
  plugins: [tablePlugin(), mermaidPlugin()],
});
```

### Namespace imports (all plugins)

```ts
import { Marzipan, plugins } from "@pinkpixel/marzipan";

new Marzipan("#editor", {
  plugins: [plugins.tablePlugin(), plugins.mermaidPlugin()],
});
```

Every factory returns an object that Marzipan consumes internally. You can mix and match plugins freely.

## Available plugins

| Plugin                  | Import Path                                      | Description                                                                                       |
| ----------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `imageManagerPlugin`    | `@pinkpixel/marzipan/plugins/imageManagerPlugin` | Dropzone and gallery UI for inserting images and managing uploads.                                |
| `imagePickerPlugin`     | `@pinkpixel/marzipan/plugins/imagePickerPlugin`  | Toolbar button for inserting images via URL or optional uploader callback.                        |
| `mermaidPlugin`         | `@pinkpixel/marzipan/plugins/mermaidPlugin`      | Lazy-loads Mermaid from npm/ESM and renders diagrams inline.                                      |
| `mermaidExternalPlugin` | `@pinkpixel/marzipan/plugins/mermaidExternal`    | Mermaid integration that targets a CDN script tag—perfect for sandboxed playgrounds.              |
| `tablePlugin`           | `@pinkpixel/marzipan/plugins/tablePlugin`        | Toolbar-driven table generator with inline editing controls.                                      |
| `tableGridPlugin`       | `@pinkpixel/marzipan/plugins/tableGridPlugin`    | Grid popover with alignment and header color options (exports `tableGridStyles`).                 |
| `tableGeneratorPlugin`  | `@pinkpixel/marzipan/plugins/tableGenerator`     | Quick GFM table inserter with prompt-driven sizing.                                               |
| `tinyHighlightPlugin`   | `@pinkpixel/marzipan/plugins/tinyHighlight`      | Zero-runtime syntax highlighting for fenced code blocks (`tinyHighlightStyles` helper available). |

> 📝 The plugin names map 1:1 to files in `src/plugins`. Inspect those files for advanced configuration options.

## Table Plugin Enhancements

The table plugins support GFM alignment markers and an optional header color annotation.

### Column Alignment

GFM column alignment is fully supported. Use `:---` (left), `:---:` (center), or `---:` (right) in the separator row:

```markdown
| Left | Center | Right |
| :--- | :----: | ----: |
| A    |   B    |     C |
```

The `tableGridPlugin` popover includes alignment buttons (Left / Center / Right) that set the alignment for all columns.

### Header Color

The `tableGridPlugin` popover includes a **Header Color** row with six pastel swatches plus a “none” option:

| Color value | Appearance                   |
| ----------- | ---------------------------- |
| `pink`      | Soft pink header background  |
| `purple`    | Muted purple background      |
| `blue`      | Light blue background        |
| `cyan`      | Aqua/teal background         |
| `green`     | Sage green background        |
| `amber`     | Warm amber/yellow background |
| _(none)_    | No color — plain header      |

### Annotation Syntax

Place a hidden HTML comment immediately before the table to apply a header color:

```markdown
<!-- mz-table: header=purple -->

| Name  | Score |
| ----- | ----- |
| Alice | 95    |
| Bob   | 87    |
```

The comment is invisible to standard markdown renderers and is only parsed by Marzipan. In edit mode the raw pipe-text lines are shown directly in the overlay (preserving pixel-perfect cursor alignment); the styled `<table>` is rendered only in preview mode.

### `tableGridPlugin` Popover

The grid popover includes an options panel below the size grid with:

- **Align** – Left / Center / Right toggle buttons.
- **Header color** – Six pastel color swatches plus a “none” dot.

Preferences are persisted to `localStorage` (key `marzipan.table.prefs`) so they survive page reloads.

### `buildTableMarkdown` Utility

The `buildTableMarkdown()` helper (exported from `@pinkpixel/marzipan`) accepts a `TableBuildOptions` object:

```ts
import { buildTableMarkdown } from "@pinkpixel/marzipan";
import type { TableBuildOptions } from "@pinkpixel/marzipan";

const md = buildTableMarkdown({
  rows: 3,
  cols: 4,
  alignment: ["left", "center", "right", "left"],
  headerColor: "blue",
});
```

The original `(rows, cols)` signature remains supported for backward compatibility.

## Configuration tips

- **Tree shaking** – Import plugins individually; bundlers remove unused exports automatically.
- **Styling** – Some plugins inject their own CSS. Bakeshop demonstrates how to mirror the styling in your app.
- **Events** – Many plugins accept callbacks (e.g., image handlers). Pass your own upload or analytics hooks through the factory options.
- **Server-side rendering** – When using SSR, guard plugin usage behind `typeof window !== 'undefined'` if they rely on browser-only APIs.

## Demo coverage

The `bakeshop-demo` application renders every plugin in the “Plugin Gallery” panel. Launch it with:

```bash
cd bakeshop-demo
npm install
npm run dev
```

Use the panel toggles to see plugin behaviour before integrating it into your own project.

For change history and new additions, see the [CHANGELOG](../CHANGELOG.md).
