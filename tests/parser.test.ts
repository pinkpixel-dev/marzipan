import { describe, it, expect } from 'vitest';
import { MarkdownParser } from '../src/parser';

const parse = (md: string) => MarkdownParser.parse(md);
const dom = (md: string) => {
  const el = document.createElement('div');
  el.innerHTML = parse(md);
  return el;
};

describe('security', () => {
  it('does not turn raw HTML in table cells into elements', () => {
    const el = dom('| <img src=x onerror=alert(1)> | b |\n| --- | --- |\n| <script>x</script> | c |');
    expect(el.querySelector('img')).toBeNull();
    expect(el.querySelector('script')).toBeNull();
    expect(el.querySelector('th')?.textContent).toContain('<img src=x onerror=alert(1)>');
  });

  it('does not render raw HTML in paragraphs', () => {
    const el = dom('<img src=x onerror=alert(1)>');
    expect(el.querySelector('img')).toBeNull();
  });

  it('neutralizes javascript: links', () => {
    const el = dom('[x](javascript:alert(1))');
    expect(el.querySelector('a')?.getAttribute('href')).toBe('#');
  });

  it('allows data:image only as an image source', () => {
    expect(MarkdownParser.sanitizeUrl('data:image/png;base64,AAA', 'image')).not.toBe('#');
    expect(MarkdownParser.sanitizeUrl('data:image/svg+xml,<svg/>')).toBe('#');
  });
});

describe('escaping keeps the overlay text identical to the source', () => {
  const cases = [
    '`a < b && c`',
    '[q](https://x.com/?a=1&b=2)',
    '![a&b](pic.png)',
    'plain "quotes" & <angles>',
  ];
  for (const md of cases) {
    it(md, () => {
      expect(dom(md).textContent).toBe(md);
    });
  }

  it('keeps table rows identical in the overlay and escaped in cells', () => {
    const el = dom('| a & b | `<x>` |');
    expect(el.querySelector('.table-row')?.textContent).toBe('| a & b | `<x>` |');
    expect(Array.from(el.querySelectorAll('th')).map(c => c.textContent)).toEqual(['a & b', '`<x>`']);
  });

  it('keeps query strings intact in href', () => {
    expect(dom('[q](https://x.com/?a=1&b=2)').querySelector('a')?.getAttribute('href'))
      .toBe('https://x.com/?a=1&b=2');
  });
});

describe('lists and emphasis', () => {
  it('does not pair a * bullet with an italic marker', () => {
    const el = dom('* item with *emphasis*');
    const li = el.querySelector('ul > li');
    expect(li).not.toBeNull();
    expect(li!.querySelectorAll('em')).toHaveLength(1);
    expect(li!.querySelector('em')!.textContent).toBe('*emphasis*');
    expect(el.textContent).toBe('* item with *emphasis*');
  });

  it('renders + bullets as list items', () => {
    expect(dom('+ one\n+ two').querySelectorAll('ul > li')).toHaveLength(2);
  });

  it('renders h4 through h6', () => {
    const el = dom('#### four\n##### five\n###### six');
    expect(el.querySelector('h4')).not.toBeNull();
    expect(el.querySelector('h5')).not.toBeNull();
    expect(el.querySelector('h6')).not.toBeNull();
  });
});

describe('links', () => {
  it('stamps links with their source line', () => {
    const el = dom('![img](a.png) [one](1)\n\n`[no](x)` [two](2)');
    const links = el.querySelectorAll('a[data-mz-line]');
    expect(Array.from(links).map(a => a.getAttribute('data-mz-line'))).toEqual(['0', '2']);
  });
});

describe('list helpers', () => {
  it('keeps the starting number when renumbering', () => {
    expect(MarkdownParser.renumberLists('5. a\n9. b\n2. c')).toBe('5. a\n6. b\n7. c');
  });

  it('finds the marker end with extra spaces and uppercase X', () => {
    const text = '-  [X]  done';
    const ctx = MarkdownParser.getListContext(text, text.length);
    expect(ctx.listType).toBe('checkbox');
    expect(ctx.checked).toBe(true);
    expect(text.slice(ctx.markerEndPos)).toBe('done');
  });
});

describe('server-side post-processing', () => {
  it('groups list items without a DOM', () => {
    const html = MarkdownParser.parse.call(
      Object.assign(Object.create(MarkdownParser), { postProcessHTML: MarkdownParser.postProcessHTMLManual }),
      '- a\n- b'
    );
    expect(html).toMatch(/^<ul>.*<\/ul>$/s);
  });
});
