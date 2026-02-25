# Type Definitions

Marzipan ships full TypeScript declarations. These types are automatically available after installing the package; no separate `@types` package is needed.

## Installation

```bash
npm install @pinkpixel/marzipan
```

TypeScript users get autocompletion and type checking out of the box.

## Core Types

### `MarzipanOptions`

Configuration options passed to the `Marzipan` constructor.

```ts
import type { MarzipanOptions } from '@pinkpixel/marzipan';

const options: MarzipanOptions = {
  toolbar: true,
  theme: 'cave',
  showStats: true,
  smartLists: true,
  onChange: (value) => console.log(value),
};
```

### `MarzipanInstance`

The instance object returned by the constructor.

```ts
import type { MarzipanInstance } from '@pinkpixel/marzipan';

const [editor]: MarzipanInstance[] = new Marzipan('#editor', options);
editor.getValue();
editor.setValue('# Hello');
editor.destroy();
```

### `Theme` / `ThemeColors`

Used when creating custom themes.

```ts
import type { Theme, ThemeColors } from '@pinkpixel/marzipan';

const myTheme: Theme = {
  name: 'purple',
  colors: {
    bgPrimary: '#2d1b69',
    text: '#e1d5f7',
    h1: '#bb9af7',
  } satisfies ThemeColors,
};
```

### `Stats`

Returned by `editor.getStats()`.

```ts
import type { Stats } from '@pinkpixel/marzipan';

const stats: Stats = editor.getStats();
// { chars, words, lines, line, column }
```

### `ToolbarButtonConfig` / `ToolbarConfig`

For custom toolbar configuration.

```ts
import type { ToolbarConfig, ToolbarButtonConfig } from '@pinkpixel/marzipan';

const toolbar: ToolbarConfig = {
  buttons: [
    'bold', 'italic', 'code', '|', 'link', '|',
    { id: 'save', title: 'Save', icon: '💾', action: (ta) => save(ta) },
  ],
};
```

### `MarzipanPlugin`

Interface that all plugins implement.

```ts
import type { MarzipanPlugin } from '@pinkpixel/marzipan';
```

### `MarkdownActions`

Type for the bundled actions toolkit.

```ts
import type { MarkdownActions } from '@pinkpixel/marzipan';
import { actions } from '@pinkpixel/marzipan';

const myActions: MarkdownActions = actions;
```

## Plugin Types

### `BlockHandlesConfig`

```ts
import type { BlockHandlesConfig } from '@pinkpixel/marzipan';

const config: BlockHandlesConfig = {
  enabled: true,
  showOnHover: true,
  handleOffset: -30,
  handleSize: 20,
  colors: {
    hover: 'rgba(59, 130, 246, 0.1)',
    selected: 'rgba(59, 130, 246, 0.2)',
    handle: 'rgba(59, 130, 246, 0.8)',
  },
};
```

### `TablePluginOptions`

```ts
import type { TablePluginOptions } from '@pinkpixel/marzipan';

const options: TablePluginOptions = {
  defaultColumns: 3,
  defaultRows: 4,
};
```

### `ImagePickerOptions`

```ts
import type { ImagePickerOptions } from '@pinkpixel/marzipan';

const options: ImagePickerOptions = {
  placeholder: 'https://example.com/image.png',
  promptMessage: 'Enter the image URL:',
};
```

## Raw Type Declarations

The full TypeScript declarations are available in [`types.d.ts`](./types.d.ts) within this docs folder, and in `dist/index.d.ts` after building the package.
