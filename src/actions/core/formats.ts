import type { FormatStyleOptions, ResolvedFormatStyle } from '../types';

export const FORMATS: Record<string, FormatStyleOptions> = {
  bold: {
    prefix: '**',
    suffix: '**',
    trimFirst: true,
  },
  italic: {
    prefix: '_',
    suffix: '_',
    trimFirst: true,
  },
  code: {
    prefix: '`',
    suffix: '`',
    blockPrefix: '```',
    blockSuffix: '```',
  },
  link: {
    prefix: '[',
    suffix: '](url)',
    replaceNext: 'url',
    scanFor: 'https?://',
  },
  bulletList: {
    prefix: '- ',
    multiline: true,
    unorderedList: true,
  },
  numberedList: {
    prefix: '1. ',
    multiline: true,
    orderedList: true,
  },
  quote: {
    prefix: '> ',
    multiline: true,
    surroundWithNewlines: true,
  },
  taskList: {
    prefix: '- [ ] ',
    multiline: true,
    surroundWithNewlines: true,
  },
  strikethrough: {
    prefix: '~~',
    suffix: '~~',
    trimFirst: true,
  },
  header1: { prefix: '# ' },
  header2: { prefix: '## ' },
  header3: { prefix: '### ' },
  header4: { prefix: '#### ' },
  header5: { prefix: '##### ' },
  header6: { prefix: '###### ' },
};

export function getDefaultStyle(): ResolvedFormatStyle {
  return {
    prefix: '',
    suffix: '',
    blockPrefix: '',
    blockSuffix: '',
    multiline: false,
    replaceNext: '',
    prefixSpace: false,
    scanFor: null,
    surroundWithNewlines: false,
    orderedList: false,
    unorderedList: false,
    trimFirst: false,
  };
}

export function mergeWithDefaults(format: FormatStyleOptions): ResolvedFormatStyle {
  const merged = {
    ...getDefaultStyle(),
    ...format,
  } as ResolvedFormatStyle;

  merged.scanFor = format.scanFor ?? null;

  return merged;
}
