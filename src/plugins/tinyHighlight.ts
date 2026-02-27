// plugins/tinyHighlight.ts
// A tiny, regex-based highlighter for common languages. Zero deps.
// Not spec-perfect; tuned for readability and speed.

export type MarzipanLike = {
  options: { hooks?: { afterPreviewRender?: (root: HTMLElement, editor: any) => void } };
};

type Rule = { pattern: RegExp; cls: string };

function escHtml(s: string) {
  return s.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]!));
}

function applyRules(code: string, rules: Rule[]) {
  // Collect all matches from raw (unescaped) source
  type Match = { start: number; end: number; cls: string };
  const matches: Match[] = [];

  for (const { pattern, cls } of rules) {
    const re = new RegExp(pattern.source, pattern.flags);
    let m: RegExpExecArray | null;
    while ((m = re.exec(code)) !== null) {
      matches.push({ start: m.index, end: m.index + m[0].length, cls });
      if (!re.global) break;
      if (m[0].length === 0) { re.lastIndex++; }
    }
  }

  // Sort by position; longer matches first for ties at same start
  matches.sort((a, b) => a.start - b.start || (b.end - b.start) - (a.end - a.start));

  // Filter overlapping: earlier/longer match wins
  const kept: Match[] = [];
  let cursor = 0;
  for (const m of matches) {
    if (m.start >= cursor) {
      kept.push(m);
      cursor = m.end;
    }
  }

  // Build HTML: escape plain text, wrap matched segments in spans
  let html = '';
  let pos = 0;
  for (const m of kept) {
    if (m.start > pos) html += escHtml(code.slice(pos, m.start));
    html += `<span class="tok ${m.cls}">${escHtml(code.slice(m.start, m.end))}</span>`;
    pos = m.end;
  }
  if (pos < code.length) html += escHtml(code.slice(pos));

  return html;
}

const JS_WORDS = String.raw`\b(abstract|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|false|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|true|try|typeof|var|void|while|with|yield)\b`;
const TYPES = String.raw`\b(string|number|boolean|any|unknown|never|void|null|undefined|Record|Partial|Readonly|Array|Promise|Map|Set)\b`;

const rulesByLang: Record<string, Rule[]> = {
  js: [
    { pattern: /\/\/.*/g, cls: 'com' },
    { pattern: /\/\*[\s\S]*?\*\//g, cls: 'com' },
    { pattern: /(['"`])(?:\\.|(?!\1)[\s\S])*\1/g, cls: 'str' },
    { pattern: /\b\d[\d_]*(?:\.[\d_]+)?\b/g, cls: 'num' },
    { pattern: new RegExp(JS_WORDS, 'g'), cls: 'kw' },
  ],
  ts: [
    { pattern: /\/\/.*/g, cls: 'com' },
    { pattern: /\/\*[\s\S]*?\*\//g, cls: 'com' },
    { pattern: /(['"`])(?:\\.|(?!\1)[\s\S])*\1/g, cls: 'str' },
    { pattern: new RegExp(`\\b\\d[\\d_]*(?:\\.[\\d_]+)?\\b`, 'g'), cls: 'num' },
    { pattern: new RegExp(JS_WORDS, 'g'), cls: 'kw' },
    { pattern: new RegExp(TYPES, 'g'), cls: 'type' },
  ],
  json: [
    { pattern: /"(?:\\.|[^"])*"(?=\s*:)/g, cls: 'prop' },
    { pattern: /"(?:\\.|[^"])*"/g, cls: 'str' },
    { pattern: /\b(true|false|null)\b/g, cls: 'kw' },
    { pattern: /-?\b\d[\d.]*\b/g, cls: 'num' },
  ],
  css: [
    { pattern: /\/\*[\s\S]*?\*\//g, cls: 'com' },
    { pattern: /#[0-9a-fA-F]{3,8}\b/g, cls: 'num' },
    { pattern: /\b\d+(\.\d+)?(px|em|rem|%|vh|vw)\b/g, cls: 'num' },
    { pattern: /:[a-z-]+(?=\s*:)/g, cls: 'prop' },
    { pattern: /\b(var|calc|clamp)\b/g, cls: 'kw' },
  ],
  html: [
    { pattern: /<!--[\s\S]*?-->/g, cls: 'com' },
    { pattern: /<\/?[a-zA-Z][\w:-]*/g, cls: 'tag' },
    { pattern: /\s+[a-zA-Z_:][\w:.-]*(?==)/g, cls: 'attr' },
    { pattern: /"[^"]*"|'[^']*'/g, cls: 'str' },
    { pattern: /\/?>/g, cls: 'tag' },
  ],
  bash: [
    { pattern: /#.*/g, cls: 'com' },
    { pattern: /\$[A-Za-z_]\w*/g, cls: 'var' },
    { pattern: /(['"`])(?:\\.|(?!\1)[\s\S])*\1/g, cls: 'str' },
    { pattern: /^\s*[a-zA-Z][\w-]*/gm, cls: 'kw' },
    { pattern: /\b\d+\b/g, cls: 'num' },
  ],
  ini: [
    { pattern: /;.*/g, cls: 'com' },
    { pattern: /^\s*\[[^\]]+\]/gm, cls: 'kw' },
    { pattern: /^\s*[A-Za-z0-9_.-]+\s*(?==)/gm, cls: 'prop' },
    { pattern: /=\s*".*?"|=\s*'.*?'|=\s*\S+/g, cls: 'str' },
  ],
  md: [
    { pattern: /^###[^\n]+/gm, cls: 'kw' },
    { pattern: /^##[^\n]+/gm, cls: 'kw' },
    { pattern: /^#[^\n]+/gm, cls: 'kw' },
    { pattern: /`[^`]+`/g, cls: 'code' },
    { pattern: /\*\*[^*]+\*\*/g, cls: 'strong' },
    { pattern: /\*[^*]+\*/g, cls: 'em' },
  ]
};

function langToRules(langClass: string): Rule[] {
  const lang = langClass.replace(/^language-/, '').toLowerCase();
  if (lang === 'ts' || lang === 'tsx') return rulesByLang.ts;
  if (lang === 'js' || lang === 'jsx' || lang === 'mjs' || lang === 'cjs') return rulesByLang.js;
  if (lang === 'json') return rulesByLang.json;
  if (lang === 'html' || lang === 'xml') return rulesByLang.html;
  if (lang === 'css') return rulesByLang.css;
  if (lang === 'bash' || lang === 'sh' || lang === 'shell') return rulesByLang.bash;
  if (lang === 'ini' || lang === 'conf') return rulesByLang.ini;
  if (lang === 'md' || lang === 'markdown') return rulesByLang.md;
  return []; // unknown -> no-op
}

export function tinyHighlightPlugin() {
  return (editor: MarzipanLike) => {
    const prev = editor.options.hooks?.afterPreviewRender;
    editor.options.hooks = editor.options.hooks || {};
    editor.options.hooks.afterPreviewRender = (root: HTMLElement, e: any) => {
      prev?.(root, e);

      const blocks = root.querySelectorAll('pre code[class*="language-"]');
      blocks.forEach((codeEl) => {
        const el = codeEl as HTMLElement;
        if (el.dataset.hl === '1') return;
        const cls = [...el.classList].find(c => c.startsWith('language-'))!;
        const rules = langToRules(cls);
        if (!rules.length) { el.dataset.hl = '1'; return; }

        const src = el.textContent || '';
        (el as HTMLElement).innerHTML = applyRules(src, rules);
        (el.closest('pre') as HTMLElement)?.classList.add('marzipan-highlight');
        el.dataset.hl = '1';
      });
    };
  };
}

// Optional styles — include once in your app:
export const tinyHighlightStyles = `
.marzipan-highlight { line-height: 1.5; overflow: auto; border-radius: 8px; }
.tok.kw { color: var(--mz-k, #c678dd); font-weight: 600; }
.tok.type { color: var(--mz-t, #56b6c2); }
.tok.prop { color: var(--mz-p, #e5c07b); }
.tok.num { color: var(--mz-n, #d19a66); }
.tok.str { color: var(--mz-s, #98c379); }
.tok.com { color: var(--mz-c, #7f848e); font-style: italic; }
.tok.tag { color: var(--mz-tag, #e06c75); }
.tok.attr { color: var(--mz-attr, #61afef); }
.tok.var { color: var(--mz-var, #61afef); }
.tok.code { color: var(--mz-code, #e5c07b); }
.tok.strong { font-weight: 700; }
.tok.em { font-style: italic; }
`;