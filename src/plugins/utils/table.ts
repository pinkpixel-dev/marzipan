export type ColumnAlignment = 'left' | 'center' | 'right';

export interface TableBuildOptions {
  rows: number;
  cols: number;
  headers?: string[];
  alignment?: ColumnAlignment[];
  /** Optional header row color, e.g. 'pink' | 'purple' | 'blue' | 'cyan' | 'green' | 'amber' */
  headerColor?: string;
}

export function buildTableMarkdown(rowsOrOpts: number | TableBuildOptions, colsArg?: number): string {
  let opts: TableBuildOptions;
  if (typeof rowsOrOpts === 'number') {
    opts = { rows: rowsOrOpts, cols: colsArg ?? 2 };
  } else {
    opts = rowsOrOpts;
  }

  const safeRows = Math.max(1, Math.floor(opts.rows));
  const safeCols = Math.max(1, Math.floor(opts.cols));
  const headers = opts.headers ?? Array.from({ length: safeCols }, (_, i) => `Header ${i + 1}`);
  const alignment = opts.alignment ?? Array(safeCols).fill('left' as ColumnAlignment);

  const headerRow = headers.slice(0, safeCols).map(h => h || ' ').join(' | ');

  // Compute per-column widths so body rows match the header row width.
  // This ensures clicks in the overlay correctly land inside cell text in the textarea.
  const cellWidths = headers.slice(0, safeCols).map(h => Math.max(3, (h || ' ').length));

  const divider = Array.from({ length: safeCols }, (_, i) => {
    const align = alignment[i] ?? 'left';
    const w = cellWidths[i];
    if (align === 'center') return ':' + '-'.repeat(Math.max(1, w - 2)) + ':';
    if (align === 'right') return '-'.repeat(Math.max(2, w - 1)) + ':';
    return '-'.repeat(w);
  }).join(' | ');

  const body = Array.from({ length: safeRows }, () =>
    cellWidths.map(w => ' '.repeat(w)).join(' | '),
  )
    .map((row) => `| ${row} |`)
    .join('\n');

  // Build annotation comment when a non-default header color is chosen.
  const annotation = opts.headerColor ? `<!-- mz-table: header=${opts.headerColor} -->\n` : '';

  return `${annotation}| ${headerRow} |\n| ${divider} |\n${body}\n`;
}

export function resolvePositiveInteger(value: string | null, fallback: number): number | null {
  if (value === null) {
    return null;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return Math.max(1, fallback);
  }

  const parsed = Number.parseInt(trimmed, 10);
  if (Number.isNaN(parsed) || parsed < 1) {
    return Math.max(1, fallback);
  }

  return parsed;
}
