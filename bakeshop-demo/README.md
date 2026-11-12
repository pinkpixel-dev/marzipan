# 🧁 Marzipan Bakeshop

The Bakeshop is the playground for the [Marzipan](../README.md) markdown editor. It's one workspace instead of a stack of separate pages: pick a sample on the left, edit it in the middle, and change how the editor is set up on the right. Every change shows up in the editor right away.

## 🗺️ What's in the workspace

| Area | What it does |
| --- | --- |
| **Samples** (left) | Five sample documents: Welcome, Tables, Code highlighting, Mermaid diagrams, and Images. Your edits are saved in the browser, and **Reset this sample** puts the original back. |
| **Editor** (middle) | A real Marzipan editor with whatever settings you picked. |
| **Setup** tab | Theme (Cave, Solar, and three custom palettes), toolbar, stats bar, smart lists, the raw cursor line (shows the markdown under the cursor without rendering), font size, and every built-in plugin as a toggle. |
| **Code** tab | The exact `new Marzipan()` setup for your current settings, ready to copy. |
| **Actions** tab | Buttons for the actions API (`actions.toggleBold(textarea)` and friends). The ones that match the cursor position light up. There's also a list of the keyboard shortcuts. |
| **API** tab | Runs real instance methods (`getValue`, `getStats`, `getCleanHTML`, `insertText`, the view modes) and shows the call next to what it returned. You can also download the document as clean HTML. |

The editor gets rebuilt when you change a setting, because plugins can't be removed from a live editor. Your text carries across, so you don't lose anything.

## 🚀 Running it

The demo imports the library straight from `../dist`, so build Marzipan first.

```bash
# From the repository root
npm install
npm run build
```

Then start the demo:

```bash
cd bakeshop-demo
npm install
npm run dev
```

It opens at `http://localhost:5173`. If you're changing the library at the same time, run `npm run dev` in the repository root too. That rebuilds `dist/` as you edit, and the demo picks up the changes on reload.

## 📁 How it's put together

```
bakeshop-demo/src/
├── App.tsx              # Workspace layout and state
├── config.ts            # Settings model, plugin list, and the code generator
├── samples.ts           # The sample documents
├── themes.ts            # Theme choices, including the custom palettes
├── storage.ts           # localStorage helpers (safe when storage is blocked)
├── cx.ts                # Class name helper
├── styles.css           # Tailwind 4 and the design tokens
└── components/
    ├── EditorPane.tsx   # Mounts Marzipan and rebuilds it on settings changes
    ├── Sidebar.tsx      # Sample list
    ├── Inspector.tsx    # Setup / Code / Actions / API tabs
    ├── SetupPanel.tsx
    ├── CodePanel.tsx
    ├── ActionsPanel.tsx
    ├── ApiPanel.tsx
    └── ui.tsx           # Button, Switch, Section
```

All colors and fonts come from the tokens at the top of `styles.css` (OKLCH colors on a charcoal base, with Geist and Geist Mono). If you want to restyle the demo, start there.

To add a sample, add it to `samples.ts` and give it an icon in `components/Sidebar.tsx`. To add a theme preset, add it to `themes.ts`.

## 🛠️ Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Type-check, then build for production |
| `npm run preview` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript only |

## 📄 License

Apache 2.0, same as Marzipan.

Made with 💖 by Pink Pixel
