import { useEffect, useRef, useState } from 'react'
import { Marzipan, tinyHighlightPlugin, imageManagerPlugin, imagePickerPlugin, tableGridPlugin } from '@pinkpixel/marzipan'
import type { MarzipanInstance } from '@pinkpixel/marzipan'

const IMAGE_PLUGINS_CONTENT = `# 🖼️ Image Plugins — Full Demo

Marzipan ships two complementary image plugins for inserting images into your markdown.

---

## 🗂️ Image Manager Plugin

The **imageManagerPlugin** adds a full-featured image management panel to your toolbar:

- **Upload** — Pick a file from your device  
- **URL** — Paste any image URL to add it  
- **Drag & Drop** — Drop images onto the editor or the panel's dropzone  
- **Clipboard Paste** — Paste images directly from your clipboard (Ctrl+V / Cmd+V)  
- **Recents Gallery** — Thumbnails of recently used images, click to re-insert  
- **Persistent Storage** — Small images (≤ 1 MB) are saved to localStorage as data-URLs  
- **Remote Upload** — Pass an optional \`uploader(file)\` callback for server-side storage  

Look for the **🗂️** button in the toolbar above!

### Try It

1. Click the **🗂️** button to open the image manager panel
2. Paste an image URL (e.g. \`https://via.placeholder.com/300x200\`)
3. Or click **Upload** to select a file from your device
4. Or drag and drop an image file directly onto this editor
5. Or copy an image and paste it here with Ctrl+V

### Example Markdown

![Placeholder](https://via.placeholder.com/600x300/db2777/ffffff?text=Marzipan+Image+Demo)

![A scenic landscape](https://via.placeholder.com/600x200/9333ea/ffffff?text=Purple+Dream)

---

## 🖼️ Image Picker Plugin

The **imagePickerPlugin** adds a simpler toolbar button for quick image insertion:

- Click the **🖼️** button in the toolbar
- Enter an image URL to insert it immediately
- Or type **"upload"** in the prompt to pick a file from your device
- Supports optional \`uploader()\` callback for remote storage

### Configuration

\`\`\`typescript
import { Marzipan, imagePickerPlugin } from '@pinkpixel/marzipan';

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    imagePickerPlugin({
      label: '🖼️',              // Toolbar button label
      title: 'Insert image',    // Tooltip text
      placeholder: '',          // Default prompt value
      promptMessage: 'Paste URL or type "upload":',
      uploader: async (file) => {
        // Optional: upload to your server
        const formData = new FormData();
        formData.append('file', file);
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });
        const { url } = await res.json();
        return url;
      },
    }),
  ],
});
\`\`\`

---

## 🗂️ Image Manager Configuration

\`\`\`typescript
import { Marzipan, imageManagerPlugin, imageManagerStyles } from '@pinkpixel/marzipan';

// Inject the companion CSS
const style = document.createElement('style');
style.textContent = imageManagerStyles;
document.head.appendChild(style);

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    imageManagerPlugin({
      label: '🗂️',                    // Toolbar button text
      title: 'Images',                // Tooltip
      maxRecent: 24,                  // Max thumbnails to keep
      persistThresholdBytes: 1048576, // 1 MB — files under this are saved as data-URLs
      onInsert: (url) => url,         // Transform URL before inserting
      uploader: async (file) => {
        // Upload to your backend and return the URL
        const form = new FormData();
        form.append('image', file);
        const res = await fetch('/api/images', {
          method: 'POST',
          body: form,
        });
        const data = await res.json();
        return data.url;
      },
    }),
  ],
});
\`\`\`

---

## Comparison

| Feature                  | Image Manager 🗂️ | Image Picker 🖼️ |
| :----------------------- | :---------------: | :--------------: |
| Toolbar button           | ✅                | ✅               |
| URL insertion             | ✅                | ✅               |
| File upload              | ✅                | ✅               |
| Drag & drop              | ✅                | ❌               |
| Clipboard paste          | ✅                | ❌               |
| Recents gallery          | ✅                | ❌               |
| localStorage persistence | ✅                | ❌               |
| Remote uploader callback | ✅                | ✅               |
| Panel UI                 | ✅ Full panel     | ❌ Prompt only   |
| Bundle size impact       | ~3 KB             | ~1 KB            |

### When to Use Which?

- Use **imageManagerPlugin** when you want a rich image management experience with drag & drop, paste support, and a recents gallery
- Use **imagePickerPlugin** for a lightweight, prompt-based image inserter
- You can use **both** together — they add separate toolbar buttons and work independently

---

## Live Test Area

Try the image features in this editor! The toolbar above has both the **🗂️** (Image Manager) and **🖼️** (Image Picker) buttons.

### Markdown Image Syntax

\`\`\`markdown
![Alt text](https://example.com/image.png)
![Photo caption](./local-image.jpg)
![](https://via.placeholder.com/400x200)
\`\`\`

### Rendered Images

Here are some example images rendered in the preview:

![Pink gradient](https://via.placeholder.com/500x150/ec4899/ffffff?text=Pink+Pixel+✨)

![Cave theme](https://via.placeholder.com/500x150/16161a/e5e7eb?text=Cave+Theme+🦇)

![Solar theme](https://via.placeholder.com/500x150/fefce8/1c1917?text=Solar+Theme+☀️)
`

export default function ImagePluginsDemo({ onBack }: { onBack: () => void }) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [editorInstance, setEditorInstance] = useState<MarzipanInstance | null>(null)
  const [isPreview, setIsPreview] = useState(true)

  useEffect(() => {
    if (!editorRef.current) return

    const [instance] = new Marzipan(editorRef.current, {
      value: IMAGE_PLUGINS_CONTENT,
      toolbar: true,
      showStats: true,
      smartLists: true,
      theme: 'cave',
      fontSize: '15px',
      lineHeight: 1.6,
      plugins: [
        tinyHighlightPlugin(),
        imageManagerPlugin(),
        imagePickerPlugin(),
        tableGridPlugin({ maxRows: 8, maxColumns: 8 }),
      ],
    })

    instance.showPreviewMode(true)
    setEditorInstance(instance)

    return () => {
      instance.destroy?.()
    }
  }, [])

  const togglePreview = () => {
    if (!editorInstance) return
    const next = !isPreview
    editorInstance.showPreviewMode(next)
    setIsPreview(next)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6">
        <div className="flex items-center gap-3 mb-4">
          <button
            onClick={onBack}
            className="text-sm px-3 py-1.5 rounded-lg border border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
          >
            ← Back to Plugins
          </button>
        </div>
        <div className="flex items-center gap-4 mb-3">
          <span className="text-3xl">🖼️</span>
          <div>
            <h2 className="text-3xl font-bold text-amber-300">Image Plugins</h2>
            <p className="text-slate-400 mt-1">
              Image Manager (🗂️) and Image Picker (🖼️) — drag, drop, paste, upload, and insert images
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <button
            onClick={togglePreview}
            className="text-sm px-4 py-2 rounded-lg border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 transition-colors"
          >
            {isPreview ? '✏️ Switch to Edit Mode' : '👁 Switch to Preview'}
          </button>
          <code className="text-sm bg-slate-800 border border-slate-600 px-3 py-2 rounded-lg text-amber-200">
            imageManagerPlugin() + imagePickerPlugin()
          </code>
        </div>
      </div>

      {/* Full-page editor */}
      <div className="card p-6">
        <div ref={editorRef} style={{ height: 'calc(100vh - 200px)', minHeight: '800px' }} />
      </div>

      {/* Usage snippet */}
      <div className="card p-6 bg-gradient-to-r from-amber-500/10 via-orange-500/5 to-yellow-500/10">
        <h3 className="text-lg font-bold text-amber-200 mb-4">💡 Usage</h3>
        <pre className="code-block">
{`import {
  Marzipan,
  imageManagerPlugin,
  imageManagerStyles,
  imagePickerPlugin,
} from '@pinkpixel/marzipan';

// Inject the image manager panel styles
const style = document.createElement('style');
style.textContent = imageManagerStyles;
document.head.appendChild(style);

new Marzipan('#editor', {
  toolbar: true,
  plugins: [
    imageManagerPlugin(),   // 🗂️ Full panel with gallery
    imagePickerPlugin(),    // 🖼️ Quick URL/upload prompt
  ],
});`}
        </pre>
      </div>
    </div>
  )
}
