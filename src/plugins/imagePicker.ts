// plugins/imagePicker.ts
// Toolbar button that opens a small form: paste an image URL, or upload a file.
// Optional uploader(file) => Promise<string> stores the file and returns a real URL;
// without one, uploads become session-only blob: URLs.

import { createButton, createField, createStatus, safeAlt, togglePopover } from './utils/popover';
import type { MarzipanInstance } from '../types';

export type ImagePickerOptions = {
  uploader?: (file: File) => Promise<string>;
  label?: string; // button label or emoji
  title?: string; // tooltip
  placeholder?: string; // starting value for the URL field
  promptMessage?: string; // label for the URL field
};

export function imagePickerPlugin(opts: ImagePickerOptions = {}) {
  const label = opts.label ?? '🖼️';
  const title = opts.title ?? 'Insert image';

  return (editor: MarzipanInstance) => {
    editor.addToolbarButton({
      title,
      label,
      className: 'mz-btn-image',
      onClick: (button) => {
        togglePopover(button, { label: title, className: 'mz-image-pop' }, (pop) => {
          const form = document.createElement('form');
          form.className = 'mz-form';

          const url = createField(opts.promptMessage ?? 'Image URL', {
            type: 'url',
            value: opts.placeholder ?? '',
            placeholder: 'https://example.com/image.png',
          });
          const alt = createField('Alt text', { placeholder: 'Describe the image' });
          const status = createStatus();

          const fileInput = document.createElement('input');
          fileInput.type = 'file';
          fileInput.accept = 'image/*';
          fileInput.hidden = true;

          const upload = createButton('Upload file');
          upload.addEventListener('click', () => fileInput.click());

          fileInput.addEventListener('change', async () => {
            const file = fileInput.files?.[0];
            if (!file) return;
            status.classList.remove('mz-status-error');
            status.textContent = 'Uploading...';
            pop.reposition();
            try {
              const src = opts.uploader ? await opts.uploader(file) : URL.createObjectURL(file);
              const altText = alt.input.value.trim() || file.name;
              pop.close();
              editor.insertText(`![${safeAlt(altText)}](${src})`);
            } catch (e) {
              console.error('[Marzipan] Image upload failed:', e);
              status.classList.add('mz-status-error');
              status.textContent = 'Upload failed. Try again or paste a URL.';
              pop.reposition();
            }
          });

          const actions = document.createElement('div');
          actions.className = 'mz-actions';
          actions.append(upload, createButton('Insert', 'primary'));

          form.addEventListener('submit', (event) => {
            event.preventDefault();
            const src = url.input.value.trim();
            if (!src) {
              status.classList.add('mz-status-error');
              status.textContent = 'Paste an image URL first, or upload a file.';
              url.input.focus();
              pop.reposition();
              return;
            }
            const altText = alt.input.value.trim() || 'alt text';
            pop.close();
            editor.insertText(`![${safeAlt(altText)}](${src})`);
          });

          form.append(url.field, alt.field, status, actions, fileInput);
          pop.el.appendChild(form);
        });
      },
    });
  };
}
