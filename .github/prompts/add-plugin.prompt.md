---
description: Scaffold a new Marzipan plugin from a name and description, wire up all exports, and confirm the result.
---

Create a new Marzipan plugin called **`${input:pluginName}`**.

Brief description of what it does: **${input:description}**

## Steps

### 1. Confirm the pattern

Every plugin is a **factory function** exported from its own file in `src/plugins/`. It returns a function `(editor: any) => void`. Optionally it exports a companion `*Styles` string and an `*Options` interface.

Reference plugin: `src/plugins/tablePlugin.ts` — simple factory, no styles.
Reference plugin: `src/plugins/tinyHighlight.ts` — factory + exported styles string.

### 2. Create `src/plugins/${input:pluginName}.ts`

Follow this skeleton exactly:

```ts
// ${input:pluginName}.ts

export interface ${input:pluginName|capitalize}Options {
  // define constructor options here
}

export function ${input:pluginName}(options: ${input:pluginName|capitalize}Options = {}) {
  return (editor: any) => {
    // implement plugin logic here
    // editor.textarea    — the HTMLTextAreaElement
    // editor.container   — the wrapper element
    // editor.updatePreview?.() — call after mutating textarea.value
  };
}
```

If the plugin needs injected CSS, also export:

```ts
export const ${input:pluginName}Styles = `
  /* scoped CSS here */
`;
```

### 3. Register in `src/plugins/index.ts`

Add exports in the appropriate section (keep the `// @ts-nocheck` at the top intact):

```ts
export { ${input:pluginName} } from './${input:pluginName}';
export type { ${input:pluginName|capitalize}Options } from './${input:pluginName}';
// if styles: export { ${input:pluginName}Styles } from './${input:pluginName}';
```

### 4. Register in `src/index.ts`

Add named exports alongside the other plugin exports:

```ts
export { ${input:pluginName} } from './plugins';
export type { ${input:pluginName|capitalize}Options } from './plugins';
```

### 5. Verify Vite entry point auto-discovery

`vite.config.ts` uses a glob over `src/plugins/*.ts` to create one entry point per plugin — **no manual change needed**. After `npm run build`, `dist/plugins/${input:pluginName}.js` will be created automatically and available at:

```ts
import { ${input:pluginName} } from '@pinkpixel/marzipan/plugins/${input:pluginName}';
```

### 6. Run checks

```sh
npm run typecheck
npm run lint
```

Fix any errors before finishing.

### 7. Confirm

Show the user:

- The full content of the new `src/plugins/${input:pluginName}.ts`
- The diff for `src/plugins/index.ts`
- The diff for `src/index.ts`
- The import path consumers will use
