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
| `imagePickerPlugin`     | `@pinkpixel/marzipan/plugins/imagePickerPlugin`  | Toolbar button that opens a small form: paste a URL or upload a file, plus optional alt text.     |
| `mermaidPlugin`         | `@pinkpixel/marzipan/plugins/mermaidPlugin`      | Lazy-loads Mermaid from npm/ESM and renders diagrams inline.                                      |
| `mermaidExternalPlugin` | `@pinkpixel/marzipan/plugins/mermaidExternal`    | Mermaid integration that targets a CDN script tag—perfect for sandboxed playgrounds.              |
| `tablePlugin`           | `@pinkpixel/marzipan/plugins/tablePlugin`        | Toolbar button that opens a rows + columns form and inserts a GFM table.                          |
| `tableGridPlugin`       | `@pinkpixel/marzipan/plugins/tableGridPlugin`    | Grid popover with alignment and header color options (exports `tableGridStyles`).                 |
| `tableGeneratorPlugin`  | `@pinkpixel/marzipan/plugins/tableGenerator`     | Deprecated alias for `tablePlugin()`. Old imports keep working.                                   |
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

- **Size grid** – Hover and click, or use the keyboard: the grid gets focus when the popover opens, arrow keys change rows and columns, and Enter inserts.
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

## Writing your own plugin

A plugin is just a function that gets the editor once, when it's applied. The editor gives plugins three helpers, so you don't have to poke at the DOM or chain hooks by hand:

- `editor.addToolbarButton({ title, label, icon, className, onClick })` adds a button to the toolbar. If the built-in toolbar is off, Marzipan creates a small plugin toolbar above the editor, so your button always has somewhere to live.
- `editor.insertText(text)` replaces the selection (or inserts at the cursor). It goes through the browser's editing commands, so **Ctrl+Z undoes it** like normal typing, and the preview re-renders on its own.
- `editor.addHook('afterPreviewRender', fn)` runs `fn(previewElement, editor)` after every render. These hooks survive `reinit()`, unlike ones you set on `options.hooks`. It returns a function that removes the hook.

```ts
import type { MarzipanPlugin } from "@pinkpixel/marzipan";

const datePlugin: MarzipanPlugin = (editor) => {
  editor.addToolbarButton({
    title: "Insert today's date",
    label: "📅",
    onClick: () => editor.insertText(new Date().toISOString().slice(0, 10)),
  });

  editor.addHook("afterPreviewRender", (root) => {
    root.querySelectorAll("a[href^='http']").forEach((a) => a.setAttribute("rel", "noopener"));
  });
};

new Marzipan("#editor", { toolbar: true, plugins: [datePlugin] });
```

None of the built-in plugins use `prompt()`, `alert()` or `confirm()` anymore. They open small popovers instead, which close on Escape or an outside click and hand focus back to the button.

## Configuration tips

- **Tree shaking** – Import plugins individually; bundlers remove unused exports automatically.
- **Styling** – Plugin popovers are styled by Marzipan's own stylesheet and pick up the editor's theme colors, so they match Solar, Cave, or your custom theme. `tableGridStyles`, `imageManagerStyles` and `tinyHighlightStyles` still add the extra bits those plugins need (inject them once).
- **Events** – Many plugins accept callbacks (e.g., image handlers). Pass your own upload or analytics hooks through the factory options.
- **Server-side rendering** – When using SSR, guard plugin usage behind `typeof window !== 'undefined'` if they rely on browser-only APIs.

## Demo coverage

The `bakeshop-demo` app has every built-in plugin as a toggle in its **Setup** tab, and the **Code** tab shows the matching setup code. Build the library first (`npm run build` in the repository root), then launch it with:

```bash
cd bakeshop-demo
npm install
npm run dev
```

Flip plugins on and off to see how they behave before you add them to your own project.

For change history and new additions, see the [CHANGELOG](../CHANGELOG.md).
