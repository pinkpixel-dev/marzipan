# 🧁 Marzipan Features Wishlist

> Last reviewed: February 27, 2025 (v1.1.0)
> ✅ = Implemented | 🟡 = Partially implemented | ⬜ = Not yet implemented

---

## Markdown Core (Block Elements)

- [x] **Headings (Levels 1-6)** 🟡

  > ✅ Actions `insertHeader(level)` supports 1–6 with toggle. Convenience functions `toggleH1`/`toggleH2`/`toggleH3` exist.
  > 🟡 Parser only renders h1–h3 visually. Need to extend parser regex to support h4–h6 and add `toggleH4`/`toggleH5`/`toggleH6` convenience actions + toolbar buttons.

- [x] **Paragraphs and Hard Line Breaks** 🟡

  > ✅ Parser wraps lines in `<div>` blocks and handles empty lines.
  > 🟡 No explicit hard line break support (two trailing spaces → `<br>` or `\` at end of line). Add detection in `parseLine()` for trailing `  ` or `\` and emit `<br>`.

- [x] **Nested Blockquotes** 🟡

  > ✅ `toggleQuote` action exists. Parser has `parseBlockquote` for single-level `>`.
  > 🟡 No nested blockquote support (`>>`, `> > >`). Extend parser regex to handle multi-level quoting and render nested `<blockquote>` elements.

- [x] **Unordered Lists (`*`, `+`, `-`) and Ordered Lists (`1.`)** ✅

  > ✅ `toggleBulletList` and `toggleNumberedList` actions. Full smart list continuation on Enter via `handleSmartListContinuation()`. Empty item exits list. Tab indents, Shift+Tab outdents.
  > 💡 Shift+Tab does generic 2-space indent removal rather than list-specific marker level change — could be improved.

- [x] **Interactive Task Lists (Checkboxes)** 🟡

  > ✅ `toggleTaskList` action with `- [ ] ` format. Smart continuation supports checkboxes.
  > 🟡 Checkboxes are not interactive/clickable in the preview overlay. Would need click events on rendered checkbox elements to toggle `- [ ]` ↔ `- [x]` in the source.

- [x] **Fenced Code Blocks with Syntax Highlighting** 🟡

  > ✅ Code blocks parsed and rendered. `tinyHighlightPlugin` provides zero-dependency syntax highlighting (JS/TS/JSON/CSS/HTML/Bash/INI/Markdown).
  > 🟡 **No copy button**. Plan: Add hover-only "Copy" button via CSS positioning on `<pre>` blocks, using `navigator.clipboard.writeText()`. Could be a standalone plugin or built into tinyHighlight.

- [x] **Tables (UI for rows/cols and alignment)** 🟡

  > ✅ Three table plugins: `tablePlugin` (prompt-based), `tableGridPlugin` (Notion-style grid picker), `tableGeneratorPlugin`. Parser renders tables with `<thead>`/`<tbody>`.
  > 🟡 Missing: Tab-to-next-cell navigation, auto-alignment of ASCII pipes while typing, floating table toolbar for column operations. Plan: Intercept Tab key when cursor is in a table region, auto-format pipe alignment in `handleInput`, add context toolbar.

- [ ] **Auto-Pairing & Wrap-Selection** ⬜

  > Not implemented. Plan: In `shortcuts.ts` or as a plugin, intercept keydown for `[`, `` ` ``, `*`, `"`, `'`, `(`. If text is selected, wrap it. If no selection, auto-insert the closing pair and position cursor between. Use `document.execCommand('insertText')` or manual selection manipulation. Consider a configuration option to enable/disable individual pairs.

- [ ] **Math Blocks (LaTeX/MathJax support) with Live Preview** ⬜

  > Not implemented. Plan: Add `$...$` (inline) and `$$...$$` (block) detection to parser. Render via KaTeX (lightweight, zero-dependency-friendly — could bundle a minimal build or use dynamic ESM import like Mermaid). A `mathPlugin` factory would lazy-load KaTeX and hook into `afterPreviewRender`.

- [x] **Horizontal Rules (`\***`, `---`)\*\* ✅

  > ✅ `insertHorizontalRule` action. Parser's `parseHorizontalRule` supports `---`, `***`, and `___` patterns.

- [ ] **YAML Front Matter support** ⬜

  > Not implemented. Plan: Detect `---` fences at top of document in parser. Render as a collapsible metadata block or dimmed display in the overlay. Expose parsed fields via `editor.getFrontMatter()`. Could use a simple regex-based YAML parser to avoid dependencies.

- [ ] **Table of Contents (`[TOC]`) generation** ⬜

  > Not implemented. Plan: During parsing, collect heading levels/text. When `[TOC]` marker is detected, replace with an auto-generated linked list. Also expose `editor.getTOC()` API method. Would need anchor IDs on heading elements for in-page navigation.

- [ ] **Footnotes and Hover Previews** ⬜

  > Not implemented. Plan: Detect `[^id]` references and `[^id]: content` definitions. Render references as superscript links. Add hover tooltip (similar approach to `LinkTooltip`) showing the footnote content. Collect footnotes at bottom of rendered output.

- [ ] **Beautiful call-outs** ⬜
  > Not implemented. Plan: Detect GitHub-style syntax `> [!NOTE]`, `> [!TIP]`, `> [!WARNING]`, `> [!CAUTION]`, `> [!IMPORTANT]` in parser. Render with styled containers, icons, and background colors. Pure CSS styling, no dependencies needed. Add corresponding toolbar button or slash command.

---

## Inline Elements

- [x] **Italic, Bold, Strikethrough, and Underline Support** 🟡

  > ✅ `toggleBold` (`**`/`__`), `toggleItalic` (`*`/`_`), `toggleStrikethrough` (`~~`/`~`) — all with parser rendering.
  > 🟡 **Underline not implemented**. Plan: Add `toggleUnderline` action with `<u>` tag or custom syntax like `++text++`. Add format to `FORMATS` object, parser detection, and toolbar button.

- [x] **Inline Code, Math, and Text Highlighting (`==text==`)** 🟡

  > ✅ `toggleCode` for inline code with backticks — fully working.
  > 🟡 Inline math (`$...$`) not implemented — see Math Blocks above.
  > 🟡 Text highlighting (`==text==`) not implemented. The action system already supports the format pattern. Plan: Add `toggleHighlight` action with `==` prefix/suffix, parser regex for `==...==` → `<mark>`, and toolbar button.

- [x] **Hyperlinks (Inline and Reference style)** 🟡

  > ✅ `insertLink` action with smart URL detection. Parser `parseLinks` renders inline links. Link tooltip shows URL preview on cursor hover.
  > 🟡 Reference-style links (`[text][id]` / `[id]: url`) not supported in parser. Plan: Collect reference definitions, resolve references during parsing.

- [x] **Image Support (Local, Web, Resizing, and Drag/Drop)** ✅

  > ✅ Parser `parseImages` renders images. `imagePickerPlugin` for URL/upload insertion. `imageManagerPlugin` provides dropzone, drag-and-drop, paste from clipboard, and recent images gallery.
  > 💡 Image resizing in the preview is not supported — images render at natural size. Future: Add resize handles or markdown width syntax.

- [ ] **Emoji Auto-complete (`:emoji:`)** ⬜

  > Not implemented. Plan: Build an autocomplete popup that triggers on `:` character. Maintain a curated emoji map (JSON object — zero dependencies). Show filtered results as user types, insert on selection. Could be a plugin with toolbar shortcut. Use native Unicode emoji to avoid image dependencies.

- [ ] **Subscript and Superscript support** ⬜
  > Not implemented. Plan: Detect `~subscript~` and `^superscript^` in parser (or `<sub>`/`<sup>` HTML). Add `toggleSubscript`/`toggleSuperscript` actions and toolbar buttons.

---

## Editor Modes & Experience

- [x] **Live Preview (WYSIWYG) Editor Canvas and Engine** ✅

  > ✅ Core architecture: textarea with perfectly aligned HTML overlay. Preview updates on every input. Three view modes: Normal (overlay), Plain (raw textarea), Preview-only (read-only rendered). Marzipan's signature feature.

- [x] **Source Code Mode View and Toggle** 🟡

  > ✅ `showPlainTextarea(true)` hides overlay, shows raw textarea. Togglable via toolbar View menu.
  > 🟡 No syntax highlighting of the raw markdown source in plain mode — it's a bare textarea. Plan: Apply lightweight markdown syntax coloring to the textarea text (e.g., color `#` headers, `**bold**` etc.) using a canvas overlay or span-based approach. This is a significant engineering challenge for a textarea.

- [ ] **Focus Mode (Dimming Background/Lines)** ⬜

  > Not implemented. Plan: Add a "focus mode" CSS class that dims all lines except the current paragraph. Use `showActiveLineRaw` style approach extended to dim surrounding content. Toggle via toolbar or keyboard shortcut. Pure CSS + JS, no dependencies.

- [ ] **Typewriter Mode (Auto-scrolling/Vertical Centering)** ⬜

  > Not implemented. Plan: On cursor movement or input, scroll the textarea so the current line is vertically centered. Calculate offset from cursor line to viewport center, apply `scrollTop`. Toggle via option or toolbar.

- [ ] **Tabbed Interface (Multiple file support)** ⬜

  > Not implemented — Marzipan is currently a single-editor component. Plan: This is a higher-level feature. Create a `MarzipanTabs` wrapper that manages multiple Marzipan instances with a tab bar UI. Each tab holds an independent editor. Would need file naming, dirty indicators, close buttons. Consider this as a separate companion package.

- [ ] **Seamless/Minimal Window Frames (OS Native)** ⬜
  > Not applicable to the library itself — this would be for a standalone desktop app (e.g., Electron/Tauri wrapper). Plan: Provide guidance for embedding Marzipan in frameless Electron/Tauri apps with custom title bars.

---

## UI, Sidebar & Navigation

> 💡 These features are desktop-app-level concerns. Marzipan is a library/component, not a full application. These would belong in a standalone app built with Marzipan.

- [ ] **Collapsible Sidebar (File Tree / Outline toggle)** ⬜

  > App-level feature. Plan: If building a Marzipan app, create a sidebar component alongside the editor. Not part of the core library scope.

- [ ] **File Tree Workspace View and Folder Management** ⬜

  > App-level feature. Would require File System Access API or Node.js backend. Not library scope.

- [ ] **Outline Navigation Panel** ⬜

  > Could be a plugin! Plan: Parse headings from content, render a floating outline panel with clickable links that scroll to the corresponding position. Expose `editor.getOutline()` API method.

- [ ] **Global Search Sidebar and Results Panel** ⬜

  > App-level feature for multi-document search. Not library scope.

- [ ] **Quick Open Dialog (`Ctrl/Cmd + P`)** ⬜

  > App-level feature. Not library scope.

- [x] **Status Bar (Word Count, Encoding, Line Endings, Reading Time)** 🟡

  > ✅ `showStats` option creates a stats bar displaying characters, words, lines, current line, column. Custom `statsFormatter` callback supported.
  > 🟡 Missing: Reading time estimate, encoding info, line endings display. Plan: Add reading time calculation (words ÷ 200 wpm), expose in stats object.

- [ ] **Context Menu (Markdown-specific actions)** ⬜
  > Not implemented. Plan: Intercept `contextmenu` event on the editor. Show a custom dropdown with relevant actions (formatting, insert link/image, copy block, etc.). Use same action functions from the actions system. Pure DOM, no dependencies.

---

## Diagrams & Advanced Content

- [x] **Mermaid Diagrams (Flowcharts, Gantt, etc.)** ✅

  > ✅ Two plugins: `mermaidPlugin` (ESM dynamic import) and `mermaidExternalPlugin` (CDN-based). Both render ` ```mermaid ` blocks via `afterPreviewRender` hook.

- [ ] **Flowchart.js, Sequence.js, and Vega Visualizations** ⬜

  > Not implemented. Plan: Similar plugin pattern to Mermaid — detect ` ```flowchart `, ` ```sequence `, ` ```vega ` blocks and lazy-load the corresponding library. Each would be a separate plugin.

- [ ] **Slash Commands** ⬜

  > Not implemented. Plan: Intercept `/` at the start of a line (or after whitespace). Show a floating panel with categorized markdown actions, each with an icon and description. Filter as user types. On selection, insert the corresponding syntax. Use absolute positioning relative to cursor. Pure DOM + CSS. This would be a high-impact UX feature.

- [x] **Custom Actions** 🟡

  > ✅ `applyCustomFormat()` accepts any `FormatStyleOptions` object for custom formatting rules.
  > 🟡 No way to add custom toolbar buttons with user-chosen icons from config alone — requires Plugin API. Plan: Extend toolbar `buttons` config to accept `{ name, icon, title, action: (editor) => void }` where `action` is a callback.

- [x] **Plugin System** 🟡

  > ✅ Working plugin architecture: plugins receive editor instance, have DOM access, can hook into `afterPreviewRender`. Nine plugins ship.
  > 🟡 Limited API surface — only one hook (`afterPreviewRender`). Plan: Add lifecycle hooks: `onInit`, `onDestroy`, `beforeParse`, `afterParse`, `onSelectionChange`. Add event bus for plugin-to-plugin communication. Expose more internal state (selection, active formats, parsed AST) via read-only API.

- [ ] **Internal Linking (Wiki-links)** ⬜
  > Not implemented. Plan: Detect `[[filename]]` syntax in parser. Render as clickable links that emit a custom event (`marzipan:wikilink`) with the target filename. The consuming app handles navigation. Also support `[[filename|display text]]` syntax. Could autocomplete filenames if a file list is provided.

---

## System, Settings & Export

- [x] **Theming System (CSS-based) with Custom CSS Overrides** 🟡

  > ✅ Two themes: Solar (light) and Cave (dark) with `light`/`dark` aliases. Full CSS variable system. `mergeTheme()` for custom color overrides.
  > 🟡 Only 2 themes exist — need more. Plan: Add Dracula, Catppuccin (Mocha, Latte), Tokyo Night, Nord, Solarized, One Dark, Gruvbox. Each theme is just a `ThemeColors` object — quick to create. Ship as optional imports: `import { dracula } from '@pinkpixel/marzipan/themes/dracula'`.

- [ ] **Preferences Dialog (Settings UI)** ⬜

  > Not implemented — app-level feature. Plan: Could be a plugin that renders a modal with grouped settings (typography, behavior, keybindings, default folder). Settings would map to Marzipan options and persist to localStorage. Hotkey editor would integrate with a future custom keybinding system.

- [ ] **Export Options (PDF, HTML, Word)** 🟡

  > ✅ `getCleanHTML()` method already exists — produces clean HTML output.
  > 🟡 No PDF or Word export. Plan: HTML export works. PDF could use `window.print()` with a print stylesheet, or a server-side solution. Word/docx would need a library (or Pandoc CLI). "Copy as Rich Text" is achievable by writing HTML to clipboard via `ClipboardItem`. That last option is dependency-free and high-value.

- [ ] **Custom Keybindings (JSON config)** ⬜

  > Not implemented. Keybindings are hardcoded in shortcuts.ts. Plan: Accept a `keybindings` option in the constructor: `{ 'mod+b': 'bold', 'mod+shift+s': 'strikethrough', ... }`. Map key combos to action names. Allow users to override defaults and add custom combos. Store/load from JSON or localStorage.

- [ ] **Spell Check and Grammar UI indicators** ⬜
  > Not implemented. Plan: The textarea natively supports browser spell check (`spellcheck="true"`). Marzipan could enhance this by leveraging the browser's built-in checker and ensuring `spellcheck` attribute is configurable. Grammar would require an external API.

---

## Notes

- Block handles support was removed in v1.1.0 (unreleased). Parser block metadata attributes (`data-block-id`, `data-block-type`, etc.) remain in place for future plugin use.
- Marzipan is a zero-dependency library. All new features should follow this principle — use lazy-loading ESM imports (like Mermaid) or pure TypeScript implementations.
- Features marked as "app-level" (sidebar, file tree, search, tabs, window frames) are outside the core library scope but could be addressed by a companion "Marzipan Studio" application.
