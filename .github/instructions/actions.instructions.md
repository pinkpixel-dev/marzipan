---
applyTo: "src/actions/**"
---

# Actions System Guidelines

The actions system lives in `src/actions/` and is **zero-dependency** — never import from outside this folder (except types from `src/actions/types.ts`).

## Adding a New Action

### 1. Register a format (if needed)

Add a descriptor to the `FORMATS` object in `src/actions/core/formats.ts`:

```ts
myFormat: {
  prefix: '==',
  suffix: '==',
  trimFirst: true,
},
```

**`FormatStyleOptions` fields:**

| Field                  | Type               | Effect                                                  |
| ---------------------- | ------------------ | ------------------------------------------------------- |
| `prefix`               | `string`           | Token prepended to selected text                        |
| `suffix`               | `string`           | Token appended to selected text                         |
| `blockPrefix`          | `string`           | Prefix for fenced block (e.g. ` ``` `)                  |
| `blockSuffix`          | `string`           | Suffix for fenced block                                 |
| `multiline`            | `boolean`          | Apply prefix to every line in selection                 |
| `replaceNext`          | `string`           | Placeholder text to replace next (e.g. `'url'`)         |
| `prefixSpace`          | `boolean`          | Ensure a space before the prefix                        |
| `scanFor`              | `string \| RegExp` | Auto-select next match of this pattern                  |
| `surroundWithNewlines` | `boolean`          | Add blank lines around the block                        |
| `orderedList`          | `boolean`          | Increment numeric prefix on each line                   |
| `unorderedList`        | `boolean`          | Apply unordered list toggle logic                       |
| `trimFirst`            | `boolean`          | Trim whitespace from edges of selection before wrapping |

Only include fields that differ from the defaults (all default to `false` / `''` / `null`).

### 2. Write the action function in `src/actions/index.ts`

All action functions must follow this exact signature:

```ts
export function toggleMyFormat(textarea: HTMLTextAreaElement | null): void {
  if (!ensureEditable(textarea)) return;
  const style = mergeWithDefaults(FORMATS.myFormat);
  const result = blockStyle(textarea, style); // or applyListStyle / multilineStyle / applyLineOperation
  insertText(textarea, result);
}
```

- Always call `ensureEditable(textarea)` as the first guard.
- Use `blockStyle` for inline/code-span/fenced-block toggle formats.
- Use `applyListStyle` for `orderedList` or `unorderedList` formats.
- Use `applyLineOperation` wrapping `multilineStyle` for `quote` / `taskList` style formats.
- Use `satisfies ResolvedFormatStyle` when constructing an ad-hoc style object inline (see `insertLink`).

### 3. Export from `src/index.ts`

The barrel `src/index.ts` uses `export * as actions from './actions'`. Individual named exports are also listed — add your function explicitly:

```ts
export { toggleMyFormat } from "./actions";
```

## Operation Chooser

| Format type                            | Operation function                             |
| -------------------------------------- | ---------------------------------------------- |
| Inline wrap (`**`, `_`, `` ` ``, `~~`) | `blockStyle`                                   |
| Fenced block (` ``` ... ``` `)         | `blockStyle` (set `blockPrefix`/`blockSuffix`) |
| Line prefix (`# `, `> `, `- [ ] `)     | `multilineStyle` via `applyLineOperation`      |
| Ordered/unordered list                 | `applyListStyle`                               |
| Raw insertion (e.g. `---`)             | `insertText` directly                          |

## Debug Logging

For complex actions, wrap key steps with the debug helpers (see `src/actions/debug.ts`):

```ts
debugLog("toggleMyFormat", "Starting");
debugSelection(textarea, "Before");
// ... action logic ...
debugResult(result);
debugSelection(textarea, "After");
```

These are no-ops unless `setDebugMode(true)` has been called.
