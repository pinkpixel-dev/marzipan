1. Move each plugin demo to its own page of the playground with a large markdown window that displays a full page of text. This way users can see full tables, full markdown charts, etc to really demo the library.

2. Add code snippets to the tiny highlight plugin demo window for all supported languages for testing purposes and so users can see all code languages work properly.

3. Check all the plugins from the plugins list in the docs and make sure all are fully implemented in the Marzipan code and work properly. List below.

Available plugins according to docs:
imageManagerPlugin - Dropzone and gallery UI for inserting images and managing uploads.
imagePickerPlugin - Toolbar button for inserting images via URL or optional uploader callback.
mermaidPlugin - Lazy-loads Mermaid from npm/ESM and renders diagrams inline.
mermaidExternalPlugin - Mermaid integration that targets a CDN script tag—perfect for sandboxed playgrounds.
tablePlugin - Toolbar-driven table generator with inline editing controls.
tableGridPlugin - Grid popover with alignment, style presets, and border options (exports tableGridStyles).
tableGeneratorPlugin - Quick GFM table inserter with prompt-driven sizing.
tinyHighlightPlugin - Zero-runtime syntax highlighting for fenced code blocks (tinyHighlightStyles helper available).

4. Add all toolbar buttons that are included in marzipan and plugins to all the toolbars on the bake-shop demo. Current;y missing image manager and image picker buttons at least. Possibly more options are not there in the toolbar that should be.

5. Create a demo page for the image plugins - image manager and image picker. These are not in the playground for some reason and should be.

6. Note that Marzipan is supposed to be dependency free... however we have mermaid being used as a dependency on the bakeshop-demo package.json, which makes me wonder if mermaid is needed as a dependency to use mermaid charts or if we are capable of adding that to our code without needed a dependency in our demo. Please explain if that is possible or if not.

7. Update the CHANGELOG.md with all of your changes, then deploy the new bake-shop demo to cloudflare with wrangler.
