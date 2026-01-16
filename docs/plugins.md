# Plugin Catalogue

Marzipan ships first-party plugins from the `src/plugins` directory. Each plugin exports a factory from `@pinkpixel/marzipan/plugins/<name>` so you can opt into only the code you need.

## Using a plugin

### Individual plugin imports (recommended)
```ts
import { Marzipan } from '@pinkpixel/marzipan';
import { tablePlugin } from '@pinkpixel/marzipan/plugins/tablePlugin';

new Marzipan('#editor', {
  toolbar: true,
  plugins: [tablePlugin({
    defaultColumns: 3,
    defaultRows: 4,
  })],
});
```

### Main package imports (convenience)
```ts
import { Marzipan, tablePlugin, mermaidPlugin } from '@pinkpixel/marzipan';

new Marzipan('#editor', {
  plugins: [tablePlugin(), mermaidPlugin()],
});
```

### Namespace imports (all plugins)
```ts
import { Marzipan, plugins } from '@pinkpixel/marzipan';

new Marzipan('#editor', {
  plugins: [
    plugins.tablePlugin(),
    plugins.mermaidPlugin(),
    plugins.accentSwatchPlugin(),
  ],
});
```

Every factory returns an object that Marzipan consumes internally. You can mix and match plugins freely.

## Available plugins

| Plugin | Import Path | Description |
|--------|-------------|-------------|
| `accentSwatchPlugin` | `@pinkpixel/marzipan/plugins/accentSwatchPlugin` | Adds a palette picker for accent colours and syncs with the toolbar + stats bar. |
| `imageManagerPlugin` | `@pinkpixel/marzipan/plugins/imageManagerPlugin` | Dropzone and gallery UI for inserting images and managing uploads. |
| `imagePickerPlugin` | `@pinkpixel/marzipan/plugins/imagePickerPlugin` | Toolbar button for inserting images via URL or optional uploader callback. |
| `mermaidPlugin` | `@pinkpixel/marzipan/plugins/mermaidPlugin` | Lazy-loads Mermaid from npm/ESM and renders diagrams inline. |
| `mermaidExternalPlugin` | `@pinkpixel/marzipan/plugins/mermaidExternal` | Mermaid integration that targets a CDN script tag—perfect for sandboxed playgrounds. |
| `tablePlugin` | `@pinkpixel/marzipan/plugins/tablePlugin` | Toolbar-driven table generator with inline editing controls. |
| `tableGridPlugin` | `@pinkpixel/marzipan/plugins/tableGridPlugin` | Grid overlay for rapid column/row creation (exports `tableGridStyles`). |
| `tableGeneratorPlugin` | `@pinkpixel/marzipan/plugins/tableGenerator` | Quick GFM table inserter with prompt-driven sizing. |
| `tinyHighlightPlugin` | `@pinkpixel/marzipan/plugins/tinyHighlight` | Zero-runtime syntax highlighting for fenced code blocks (`tinyHighlightStyles` helper available). |

> 📝 The plugin names map 1:1 to files in `src/plugins`. Inspect those files for advanced configuration options.

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
