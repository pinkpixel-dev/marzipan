// plugins/tableGenerator.ts
// Kept so existing `tableGeneratorPlugin` imports keep working.
// It's the same plugin as tablePlugin now.

import { tablePlugin } from './tablePlugin';

/** @deprecated Use `tablePlugin()`, which this now wraps. */
export function tableGeneratorPlugin() {
  return tablePlugin();
}
