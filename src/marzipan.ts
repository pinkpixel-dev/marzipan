// @ts-nocheck
/**
 * Marzipan - A lightweight markdown editor and viewer
 * @version 1.1.0
 * @license Apache-2.0
 */

import { MarkdownParser } from './parser';
import { ShortcutsManager } from './shortcuts';
import { generateStyles } from './styles';
import { getTheme, mergeTheme, solar } from './themes';
import { Toolbar } from './toolbar';
import { LinkTooltip } from './link-tooltip';
import { BlockHandlesPlugin } from './plugins';

/**
 * Marzipan Editor Class
 */
class Marzipan {
    [key: string]: any;
    // Static properties
    static instances = new WeakMap();
    static stylesInjected = false;
    static globalListenersInitialized = false;
    static instanceCount = 0;

    /**
     * Constructor - Always returns an array of instances
     * @param {string|Element|NodeList|Array} target - Target element(s)
     * @param {Object} options - Configuration options
     * @returns {Array} Array of Marzipan instances
     */
    constructor(target, options = {}) {
      // Convert target to array of elements
      let elements;
      
      if (typeof target === 'string') {
        elements = document.querySelectorAll(target);
        if (elements.length === 0) {
          throw new Error(`No elements found for selector: ${target}`);
        }
        elements = Array.from(elements);
      } else if (target instanceof Element) {
        elements = [target];
      } else if (target instanceof NodeList) {
        elements = Array.from(target);
      } else if (Array.isArray(target)) {
        elements = target;
      } else {
        throw new Error('Invalid target: must be selector string, Element, NodeList, or Array');
      }

      // Initialize all elements and return array
      const instances = elements.map(element => {
        // Check for existing instance
        if (element.MarzipanInstance) {
          // Re-init existing instance
          element.MarzipanInstance.reinit(options);
          return element.MarzipanInstance;
        }

        // Create new instance
        const instance = Object.create(Marzipan.prototype);
        instance._init(element, options);
        element.MarzipanInstance = instance;
        Marzipan.instances.set(element, instance);
        return instance;
      });

      return instances;
    }

    /**
     * Internal initialization
     * @private
     */
    _init(element, options = {}) {
      this.element = element;
      
      // Store the original theme option before merging
      this.options = this._mergeOptions(options);

      this.instanceTheme = this.options.theme ?? null;
      this.instanceColors = this.options.colors ? { ...this.options.colors } : null;
      this._appliedThemeColorKeys = new Set();
      this.instanceId = ++Marzipan.instanceCount;
      this.initialized = false;
      this._autoResizeInputHandler = null;
      this._autoResizeResizeHandler = null;
      this._minAutoHeight = null;
      this._maxAutoHeight = null;

      // Inject styles if needed
      Marzipan.injectStyles();

      // Initialize global listeners
      Marzipan.initGlobalListeners();

      // Check for existing Marzipan DOM structure
      const container = element.querySelector('.marzipan-container');
      const wrapper = element.querySelector('.marzipan-wrapper');
      if (container || wrapper) {
        this._recoverFromDOM(container, wrapper);
      } else {
        this._buildFromScratch();
      }

      // Setup shortcuts manager
      this.shortcuts = new ShortcutsManager(this);
      
      // Setup link tooltip
      this.linkTooltip = new LinkTooltip(this);

      // Setup toolbar if enabled
      if (this.options.toolbar) {
        const toolbarButtons = typeof this.options.toolbar === 'object' ? this.options.toolbar.buttons : null;
        this.toolbar = new Toolbar(this, toolbarButtons);
        this.toolbar.create();
        
        // Update toolbar states on selection change
        this.textarea.addEventListener('selectionchange', () => {
          this.toolbar?.updateButtonStates?.();
        });
        this.textarea.addEventListener('input', () => {
          this.toolbar?.updateButtonStates?.();
        });
      }
      
      // Setup block handles plugin if enabled
      if (this.options.blockHandles !== false) {
        this.blockHandlesPlugin = new BlockHandlesPlugin(
          this.textarea,
          this.preview,
          typeof this.options.blockHandles === 'object' ? this.options.blockHandles : {}
        );
        
        // Update handle positions on scroll — listen on the textarea since it
        // scrolls first; the preview's scrollTop is synced from handleScroll().
        this.textarea.addEventListener('scroll', () => {
          this.blockHandlesPlugin?.updateAllHandlePositions?.();
        });
      }

      const pluginsApplied = this._applyPlugins();
      if (pluginsApplied) {
        this.updatePreview();
      }

      // Mark as initialized
      this.initialized = true;

      // Call onChange if provided
      if (this.options.onChange) {
        this.options.onChange(this.getValue(), this);
      }
    }

    /**
     * Merge user options with defaults
     * @private
     */
    _mergeOptions(options = {}) {
      const defaults = {
        // Typography
        fontSize: '14px',
        lineHeight: 1.6,
        /* System-first, guaranteed monospaced; avoids Android 'ui-monospace' pitfalls */
        fontFamily: '"SF Mono", SFMono-Regular, Menlo, Monaco, "Cascadia Code", Consolas, "Roboto Mono", "Noto Sans Mono", "Droid Sans Mono", "Ubuntu Mono", "DejaVu Sans Mono", "Liberation Mono", "Courier New", Courier, monospace',
        padding: '16px',
        
        // Mobile styles
        mobile: {
          fontSize: '16px',  // Prevent zoom on iOS
          padding: '12px',
          lineHeight: 1.5
        },
        
        // Native textarea properties
        textareaProps: {},
        
        // Behavior
        autofocus: false,
        autoResize: false,  // Auto-expand height with content
        minHeight: '100px', // Minimum height for autoResize mode
        maxHeight: null,    // Maximum height for autoResize mode (null = unlimited)
        placeholder: 'Start typing...',
        value: '',
        
        // Callbacks
        onChange: null,
        onKeydown: null,
        
        // Features
        showActiveLineRaw: false,
        showStats: false,
        toolbar: false,
        statsFormatter: null,
        smartLists: true,  // Enable smart list continuation
        blockHandles: true, // Enable block handles plugin

        // Theme overrides
        theme: null,
        colors: undefined
      };
      
      const { hooks, plugins, ...cleanOptions } = options;

      const merged = {
        ...defaults,
        ...cleanOptions
      };

      if (hooks) {
        merged.hooks = { ...hooks };
      }

      if (Array.isArray(plugins)) {
        merged.plugins = [...plugins];
      }

      if (merged.theme && typeof merged.theme === 'object') {
        merged.theme = { ...merged.theme };
      }

      if (merged.colors) {
        merged.colors = { ...merged.colors };
      }

      return merged;
    }

    /**
     * Apply plugins attached to this editor instance
     * @private
     */
    _applyPlugins() {
      if (!Array.isArray(this.options?.plugins) || !this.options.plugins.length) {
        return false;
      }

      if (!this._appliedPlugins) {
        this._appliedPlugins = new Set();
      }

      let applied = false;

      for (const plugin of this.options.plugins) {
        if (typeof plugin !== 'function') continue;
        if (this._appliedPlugins.has(plugin)) continue;
        this._appliedPlugins.add(plugin);
        try {
          plugin(this);
        } catch (error) {
          console.error('[Marzipan] Plugin error:', error);
        }
        applied = true;
      }

      return applied;
    }

    _resolveTheme() {
      let baseTheme = this.instanceTheme;

      if (typeof baseTheme === 'string') {
        baseTheme = getTheme(baseTheme);
      }

      if (!baseTheme) {
        baseTheme = Marzipan.currentTheme || solar;
      }

      if (typeof baseTheme === 'string') {
        baseTheme = getTheme(baseTheme);
      }

      if (this.instanceColors) {
        return mergeTheme(baseTheme, this.instanceColors);
      }

      return baseTheme;
    }

    _applyTheme(target) {
      if (!target) return;

      const themeConfig = this._resolveTheme();
      const themeName = (typeof this.instanceTheme === 'string')
        ? this.instanceTheme
        : themeConfig?.name;

      if (themeName) {
        target.setAttribute('data-theme', themeName);
      }

      if (!this._appliedThemeColorKeys) {
        this._appliedThemeColorKeys = new Set();
      }

      for (const key of this._appliedThemeColorKeys) {
        target.style.removeProperty(key);
      }
      this._appliedThemeColorKeys.clear();

      const colors = themeConfig?.colors;
      if (!colors) return;

      for (const [colorKey, value] of Object.entries(colors)) {
        if (value == null) continue;
        const cssVar = `--${colorKey.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        target.style.setProperty(cssVar, String(value));
        this._appliedThemeColorKeys.add(cssVar);
      }
    }

    /**
     * Recover from existing DOM structure
     * @private
     */
    _recoverFromDOM(container, wrapper) {
      // Handle old structure (wrapper only) or new structure (container + wrapper)
      if (container && container.classList.contains('marzipan-container')) {
        this.container = container;
        this.wrapper = container.querySelector('.marzipan-wrapper');
      } else if (wrapper) {
        // Old structure - just wrapper, no container
        this.wrapper = wrapper;
        // Wrap it in a container for consistency
        this.container = document.createElement('div');
        this.container.className = 'marzipan-container';
        wrapper.parentNode.insertBefore(this.container, wrapper);
        this.container.appendChild(wrapper);
      }

      if (this.container) {
        this.container.setAttribute('data-marzipan-instance', String(this.instanceId));
        this._applyTheme(this.container);
      }

      if (!this.wrapper) {
        // No valid structure found
        if (container) container.remove();
        if (wrapper) wrapper.remove();
        this._buildFromScratch();
        return;
      }
      
      this.textarea = this.wrapper.querySelector('.marzipan-input');
      this.preview = this.wrapper.querySelector('.marzipan-preview');

      if (!this.textarea || !this.preview) {
        // Partial DOM - clear and rebuild
        this.container.remove();
        this._buildFromScratch();
        return;
      }

      // Store reference on wrapper
      this.wrapper._instance = this;

      // Apply instance-specific styles via CSS custom properties
      if (this.options.fontSize) {
        this.wrapper.style.setProperty('--instance-font-size', this.options.fontSize);
      }
      if (this.options.lineHeight) {
        this.wrapper.style.setProperty('--instance-line-height', String(this.options.lineHeight));
      }
      if (this.options.padding) {
        this.wrapper.style.setProperty('--instance-padding', this.options.padding);
      }

      // Disable autofill, spellcheck, and extensions
      this._configureTextarea();

      // Apply any new options
      this._applyOptions();
    }

    /**
     * Build editor from scratch
     * @private
     */
    _buildFromScratch() {
      // Extract any existing content
      const content = this._extractContent();

      // Clear element
      this.element.innerHTML = '';

      // Create DOM structure
      this._createDOM();

      // Set initial content
      if (content || this.options.value) {
        this.setValue(content || this.options.value);
      }

      // Apply options
      this._applyOptions();
    }

    /**
     * Extract content from element
     * @private
     */
    _extractContent() {
      // Look for existing Marzipan textarea
      const textarea = this.element.querySelector('.marzipan-input');
      if (textarea) return textarea.value;

      // Use element's text content as fallback
      return this.element.textContent || '';
    }

    /**
     * Create DOM structure
     * @private
     */
    _createDOM() {
      // Create container that will hold toolbar and editor
      this.container = document.createElement('div');
      this.container.className = 'marzipan-container';
      this.container.setAttribute('data-marzipan-instance', String(this.instanceId));
      
      this._applyTheme(this.container);

      // Create wrapper for editor
      this.wrapper = document.createElement('div');
      this.wrapper.className = 'marzipan-wrapper';
      
      
      // Apply instance-specific styles via CSS custom properties
      if (this.options.fontSize) {
        this.wrapper.style.setProperty('--instance-font-size', this.options.fontSize);
      }
      if (this.options.lineHeight) {
        this.wrapper.style.setProperty('--instance-line-height', String(this.options.lineHeight));
      }
      if (this.options.padding) {
        this.wrapper.style.setProperty('--instance-padding', this.options.padding);
      }
      
      this.wrapper._instance = this;

      // Create textarea
      this.textarea = document.createElement('textarea');
      this.textarea.className = 'marzipan-input';
      this.textarea.placeholder = this.options.placeholder;
      this._configureTextarea();
      
      // Apply any native textarea properties
      if (this.options.textareaProps) {
        Object.entries(this.options.textareaProps).forEach(([key, value]) => {
          if (key === 'className' || key === 'class') {
            this.textarea.className += ' ' + value;
          } else if (key === 'style' && typeof value === 'object') {
            Object.assign(this.textarea.style, value);
          } else {
            this.textarea.setAttribute(key, value);
          }
        });
      }

      // Create preview div
      this.preview = document.createElement('div');
      this.preview.className = 'marzipan-preview';
      this.preview.setAttribute('aria-hidden', 'true');

      // Assemble DOM
      this.wrapper.appendChild(this.textarea);
      this.wrapper.appendChild(this.preview);
      
      // No need to prevent link clicks - pointer-events handles this
      
      // Add wrapper to container first
      this.container.appendChild(this.wrapper);
      
      // Add stats bar at the end (bottom) if enabled
      if (this.options.showStats) {
        this.statsBar = document.createElement('div');
        this.statsBar.className = 'marzipan-stats';
        this.container.appendChild(this.statsBar);
        this._updateStats();
      }
      
      // Add container to element
      this.element.appendChild(this.container);
      
      // Setup auto-resize if enabled
      if (this.options.autoResize) {
        this._setupAutoResize();
      } else {
        // Ensure auto-resize class is removed if not using auto-resize
        this.container.classList.remove('marzipan-auto-resize');
      }
    }

    /**
     * Configure textarea attributes
     * @private
     */
    _configureTextarea() {
      this.textarea.setAttribute('autocomplete', 'off');
      this.textarea.setAttribute('autocorrect', 'off');
      this.textarea.setAttribute('autocapitalize', 'off');
      this.textarea.setAttribute('spellcheck', 'false');
      this.textarea.setAttribute('data-gramm', 'false');
      this.textarea.setAttribute('data-gramm_editor', 'false');
      this.textarea.setAttribute('data-enable-grammarly', 'false');
    }

    /**
     * Apply options to the editor
     * @private
     */
    _applyOptions() {
      // Apply autofocus
      if (this.options.autofocus) {
        this.textarea.focus();
      }
      
      // Setup or remove auto-resize
      if (this.options.autoResize) {
        this._setupAutoResize();
      } else {
        this._teardownAutoResize();
      }

      // Update preview with initial content
      this.updatePreview();
    }

    /**
     * Update preview with parsed markdown
     */
    updatePreview() {
      const text = this.textarea.value;
      const cursorPos = this.textarea.selectionStart;
      const activeLine = this._getCurrentLine(text, cursorPos);
      
      // Parse markdown
      const html = MarkdownParser.parse(text, activeLine, this.options.showActiveLineRaw);
      this.preview.innerHTML = html || '<span style="color: #808080;">Start typing...</span>';
      
      if (this.options?.hooks?.afterPreviewRender) {
        try {
          this.options.hooks.afterPreviewRender(this.preview, this);
        } catch (error) {
          console.error('[Marzipan] afterPreviewRender hook error:', error);
        }
      }
      
      // Refresh block handles plugin if enabled
      if (this.blockHandlesPlugin) {
        this.blockHandlesPlugin.refresh();
      }

      // Apply code block backgrounds
      this._applyCodeBlockBackgrounds();
      
      // Links always have real hrefs now - no need to update them
      
      // Update stats if enabled
      if (this.options.showStats && this.statsBar) {
        this._updateStats();
      }
      
      // Trigger onChange callback
      if (this.options.onChange && this.initialized) {
        this.options.onChange(text, this);
      }
    }

    /**
     * Apply background styling to code blocks
     * @private
     */
    _applyCodeBlockBackgrounds() {
      // Find all code fence elements
      const codeFences = this.preview.querySelectorAll('.code-fence');
      
      // Process pairs of code fences
      for (let i = 0; i < codeFences.length - 1; i += 2) {
        const openFence = codeFences[i];
        const closeFence = codeFences[i + 1];
        
        // Get parent divs
        const openParent = openFence.parentElement;
        const closeParent = closeFence.parentElement;
        
        if (!openParent || !closeParent) continue;
        
        // Make fences display: block
        openFence.style.display = 'block';
        closeFence.style.display = 'block';
        
        // Apply class to parent divs
        openParent.classList.add('code-block-line');
        closeParent.classList.add('code-block-line');
        
        // With the new structure, there's a <pre> block between fences, not DIVs
        // We don't need to process anything between the fences anymore
        // The <pre><code> structure already handles the content correctly
      }
    }

    /**
     * Get current line number from cursor position
     * @private
     */
    _getCurrentLine(text, cursorPos) {
      const lines = text.substring(0, cursorPos).split('\n');
      return lines.length - 1;
    }

    /**
     * Handle input events
     * @private
     */
    handleInput() {
      this.updatePreview();
    }

    /**
     * Handle keydown events
     * @private
     */
    handleKeydown(event) {
      // Handle Tab key to prevent focus loss and insert spaces
      if (event.key === 'Tab') {
        event.preventDefault();
        
        const start = this.textarea.selectionStart;
        const end = this.textarea.selectionEnd;
        const value = this.textarea.value;
        
        // If there's a selection, indent/outdent based on shift key
        if (start !== end && event.shiftKey) {
          // Outdent: remove 2 spaces from start of each selected line
          const before = value.substring(0, start);
          const selection = value.substring(start, end);
          const after = value.substring(end);
          
          const lines = selection.split('\n');
          const outdented = lines.map(line => line.replace(/^ {2}/, '')).join('\n');
          
          // Try to use execCommand first to preserve undo history
          if (document.execCommand) {
            // Select the text that needs to be replaced
            this.textarea.setSelectionRange(start, end);
            document.execCommand('insertText', false, outdented);
          } else {
            // Fallback to direct manipulation
            this.textarea.value = before + outdented + after;
            this.textarea.selectionStart = start;
            this.textarea.selectionEnd = start + outdented.length;
          }
        } else if (start !== end) {
          // Indent: add 2 spaces to start of each selected line
          const before = value.substring(0, start);
          const selection = value.substring(start, end);
          const after = value.substring(end);
          
          const lines = selection.split('\n');
          const indented = lines.map(line => '  ' + line).join('\n');
          
          // Try to use execCommand first to preserve undo history
          if (document.execCommand) {
            // Select the text that needs to be replaced
            this.textarea.setSelectionRange(start, end);
            document.execCommand('insertText', false, indented);
          } else {
            // Fallback to direct manipulation
            this.textarea.value = before + indented + after;
            this.textarea.selectionStart = start;
            this.textarea.selectionEnd = start + indented.length;
          }
        } else {
          // No selection: just insert 2 spaces
          // Use execCommand to preserve undo history
          if (document.execCommand) {
            document.execCommand('insertText', false, '  ');
          } else {
            // Fallback to direct manipulation
            this.textarea.value = value.substring(0, start) + '  ' + value.substring(end);
            this.textarea.selectionStart = this.textarea.selectionEnd = start + 2;
          }
        }
        
        // Trigger input event to update preview
        this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
        return;
      }
      
      // Handle Enter key for smart list continuation
      if (event.key === 'Enter' && !event.shiftKey && !event.metaKey && !event.ctrlKey && this.options.smartLists) {
        if (this.handleSmartListContinuation()) {
          event.preventDefault();
          return;
        }
      }
      
      // Let shortcuts manager handle other keys
      const handled = this.shortcuts.handleKeydown(event);
      
      // Call user callback if provided
      if (!handled && this.options.onKeydown) {
        this.options.onKeydown(event, this);
      }
    }

    /**
     * Handle smart list continuation
     * @returns {boolean} Whether the event was handled
     */
    handleSmartListContinuation() {
      const textarea = this.textarea;
      const cursorPos = textarea.selectionStart;
      const context = MarkdownParser.getListContext(textarea.value, cursorPos);
      
      if (!context || !context.inList) return false;
      
      // Handle empty list item (exit list)
      if (context.content.trim() === '' && cursorPos >= context.markerEndPos) {
        this.deleteListMarker(context);
        return true;
      }
      
      // Handle text splitting if cursor is in middle of content
      if (cursorPos > context.markerEndPos && cursorPos < context.lineEnd) {
        this.splitListItem(context, cursorPos);
      } else {
        // Just add new item after current line
        this.insertNewListItem(context);
      }
      
      // Handle numbered list renumbering
      if (context.listType === 'numbered') {
        this.scheduleNumberedListUpdate();
      }
      
      return true;
    }
    
    /**
     * Delete list marker and exit list
     * @private
     */
    deleteListMarker(context) {
      // Select from line start to marker end
      this.textarea.setSelectionRange(context.lineStart, context.markerEndPos);
      document.execCommand('delete');
      
      // Trigger input event
      this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    /**
     * Insert new list item
     * @private
     */
    insertNewListItem(context) {
      const newItem = MarkdownParser.createNewListItem(context);
      document.execCommand('insertText', false, '\n' + newItem);
      
      // Trigger input event
      this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    /**
     * Split list item at cursor position
     * @private
     */
    splitListItem(context, cursorPos) {
      // Get text after cursor
      const textAfterCursor = context.content.substring(cursorPos - context.markerEndPos);
      
      // Delete text after cursor
      this.textarea.setSelectionRange(cursorPos, context.lineEnd);
      document.execCommand('delete');
      
      // Insert new list item with remaining text
      const newItem = MarkdownParser.createNewListItem(context);
      document.execCommand('insertText', false, '\n' + newItem + textAfterCursor);
      
      // Position cursor after new list marker
      const newCursorPos = this.textarea.selectionStart - textAfterCursor.length;
      this.textarea.setSelectionRange(newCursorPos, newCursorPos);
      
      // Trigger input event
      this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
    }
    
    /**
     * Schedule numbered list renumbering
     * @private
     */
    scheduleNumberedListUpdate() {
      // Clear any pending update
      if (this.numberUpdateTimeout) {
        clearTimeout(this.numberUpdateTimeout);
      }
      
      // Schedule update after current input cycle
      this.numberUpdateTimeout = setTimeout(() => {
        this.updateNumberedLists();
      }, 10);
    }
    
    /**
     * Update/renumber all numbered lists
     * @private
     */
    updateNumberedLists() {
      const value = this.textarea.value;
      const cursorPos = this.textarea.selectionStart;
      
      const newValue = MarkdownParser.renumberLists(value);
      
      if (newValue !== value) {
        // Calculate cursor offset
        let offset = 0;
        const oldLines = value.split('\n');
        const newLines = newValue.split('\n');
        let charCount = 0;
        
        for (let i = 0; i < oldLines.length && charCount < cursorPos; i++) {
          if (oldLines[i] !== newLines[i]) {
            const diff = newLines[i].length - oldLines[i].length;
            if (charCount + oldLines[i].length < cursorPos) {
              offset += diff;
            }
          }
          charCount += oldLines[i].length + 1; // +1 for newline
        }
        
        // Update textarea
        this.textarea.value = newValue;
        const newCursorPos = cursorPos + offset;
        this.textarea.setSelectionRange(newCursorPos, newCursorPos);
        
        // Trigger update
        this.textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }

    /**
     * Handle scroll events
     * @private
     */
    handleScroll() {
      // Sync preview scroll with textarea
      this.preview.scrollTop = this.textarea.scrollTop;
      this.preview.scrollLeft = this.textarea.scrollLeft;
    }

    /**
     * Get editor content
     * @returns {string} Current markdown content
     */
    getValue() {
      return this.textarea.value;
    }

    /**
     * Set editor content
     * @param {string} value - Markdown content to set
     */
    setValue(value) {
      this.textarea.value = value;
      this.updatePreview();
      
      // Update height if auto-resize is enabled
      if (this.options.autoResize) {
        this._updateAutoHeight();
      }
    }

    /**
     * Get calculated editor statistics
     * @returns {object} Stats object
     */
    getStats() {
      return this._computeStats();
    }

    /**
     * Get the container element hosting the editor
     * @returns {HTMLElement} Container element
     */
    getContainer() {
      return this.container;
    }


    /**
     * Get the rendered HTML of the current content
     * @param {Object} options - Rendering options
     * @param {boolean} options.cleanHTML - If true, removes syntax markers and Marzipan-specific classes
     * @returns {string} Rendered HTML
     */
    getRenderedHTML(options = {}) {
      const markdown = this.getValue();
      let html = MarkdownParser.parse(markdown);
      
      if (options.cleanHTML) {
        // Remove all syntax marker spans for clean HTML export
        html = html.replace(/<span class="syntax-marker[^"]*">.*?<\/span>/g, '');
        // Remove Marzipan-specific classes
        html = html.replace(/\sclass="(bullet-list|ordered-list|code-fence|hr-marker|blockquote|url-part)"/g, '');
        // Clean up empty class attributes
        html = html.replace(/\sclass=""/g, '');
      }
      
      return html;
    }

    /**
     * Get the current preview element's HTML
     * This includes all syntax markers and Marzipan styling
     * @returns {string} Current preview HTML (as displayed)
     */
    getPreviewHTML() {
      return this.preview.innerHTML;
    }
    
    /**
     * Get clean HTML without any Marzipan-specific markup
     * Useful for exporting to other formats or storage
     * @returns {string} Clean HTML suitable for export
     */
    getCleanHTML() {
      return this.getRenderedHTML({ cleanHTML: true });
    }

    /**
     * Focus the editor
     */
    focus() {
      this.textarea.focus();
    }

    /**
     * Blur the editor
     */
    blur() {
      this.textarea.blur();
    }

    /**
     * Check if editor is initialized
     * @returns {boolean}
     */
    isInitialized() {
      return this.initialized;
    }

    /**
     * Re-initialize with new options
     * @param {Object} options - New options to apply
     */
    reinit(options = {}) {
      this.options = this._mergeOptions({ ...this.options, ...options });
      this.instanceTheme = this.options.theme ?? null;
      this.instanceColors = this.options.colors ? { ...this.options.colors } : null;
      this._applyTheme(this.container);
      this._applyOptions();
      this._applyPlugins();
      this.updatePreview();
    }

    /**
     * Update stats bar
     * @private
     */
    _computeStats() {
      if (!this.textarea) {
        return {
          chars: 0,
          words: 0,
          lines: 0,
          line: 0,
          column: 0
        };
      }

      const value = this.textarea.value;
      const lines = value.split('\n');
      const chars = value.length;
      const words = value.split(/\s+/).filter(w => w.length > 0).length;

      const selectionStart = this.textarea.selectionStart;
      const beforeCursor = value.substring(0, selectionStart);
      const linesBeforeCursor = beforeCursor.split('\n');
      const currentLine = linesBeforeCursor.length;
      const currentColumn = linesBeforeCursor[linesBeforeCursor.length - 1].length + 1;

      return {
        chars,
        words,
        lines: lines.length,
        line: currentLine,
        column: currentColumn
      };
    }

    _updateStats() {
      if (!this.statsBar) return;

      const stats = this._computeStats();

      if (this.options.statsFormatter) {
        this.statsBar.innerHTML = this.options.statsFormatter(stats);
      } else {
        this.statsBar.innerHTML = `
          <div class="marzipan-stat">
            <span class="live-dot"></span>
            <span>${stats.chars} chars, ${stats.words} words, ${stats.lines} lines</span>
          </div>
          <div class="marzipan-stat">Line ${stats.line}, Col ${stats.column}</div>
        `;
      }
    }
    
    /**
     * Setup auto-resize functionality
     * @private
     */
    _setupAutoResize() {
      if (!this.container || !this.textarea || !this.preview || !this.wrapper) {
        return;
      }

      this._teardownAutoResize();

      this.container.classList.add('marzipan-auto-resize');
      this.previousHeight = null;
      this._refreshAutoResizeConstraints();

      this._autoResizeInputHandler = () => this._updateAutoHeight();
      this.textarea.addEventListener('input', this._autoResizeInputHandler);

      if (typeof window !== 'undefined') {
        this._autoResizeResizeHandler = () => this._updateAutoHeight();
        window.addEventListener('resize', this._autoResizeResizeHandler);
      } else {
        this._autoResizeResizeHandler = null;
      }

      this._updateAutoHeight();
    }

    _teardownAutoResize() {
      if (this.container) {
        this.container.classList.remove('marzipan-auto-resize');
      }

      if (this._autoResizeInputHandler && this.textarea) {
        this.textarea.removeEventListener('input', this._autoResizeInputHandler);
      }
      this._autoResizeInputHandler = null;

      if (this._autoResizeResizeHandler && typeof window !== 'undefined') {
        window.removeEventListener('resize', this._autoResizeResizeHandler);
      }
      this._autoResizeResizeHandler = null;

      if (this.textarea) {
        this.textarea.style.removeProperty('height');
        this.textarea.style.removeProperty('overflow-y');
      }
      if (this.preview) {
        this.preview.style.removeProperty('height');
        this.preview.style.removeProperty('overflow-y');
      }
      if (this.wrapper) {
        this.wrapper.style.removeProperty('height');
      }

      this.previousHeight = null;
      this._minAutoHeight = null;
      this._maxAutoHeight = null;
    }

    /**
     * Update height based on scrollHeight
     * @private
     */
    _updateAutoHeight() {
      if (!this.options.autoResize) return;
      
      const textarea = this.textarea;
      const preview = this.preview;
      const wrapper = this.wrapper;
      
      // Store scroll positions
      const scrollTop = textarea.scrollTop;
      
      // Reset height to get accurate scrollHeight
      textarea.style.setProperty('height', 'auto', 'important');
      
      // Calculate new height based on scrollHeight
      let newHeight = textarea.scrollHeight;
      
      let overflow = 'hidden';
      const minHeight = this._minAutoHeight;
      if (typeof minHeight === 'number' && minHeight > 0) {
        newHeight = Math.max(newHeight, minHeight);
      }

      const maxHeight = this._maxAutoHeight;
      if (typeof maxHeight === 'number' && maxHeight > 0 && newHeight > maxHeight) {
        newHeight = maxHeight;
        overflow = 'auto';
      }
      
      // Apply the new height to all elements with !important to override base styles
      const heightPx = newHeight + 'px';
      textarea.style.setProperty('height', heightPx, 'important');
      textarea.style.setProperty('overflow-y', overflow, 'important');
      
      preview.style.setProperty('height', heightPx, 'important');
      preview.style.setProperty('overflow-y', overflow, 'important');
      
      wrapper.style.setProperty('height', heightPx, 'important');
      
      // Restore scroll position
      textarea.scrollTop = scrollTop;
      preview.scrollTop = scrollTop;
      
      // Track if height changed
      if (this.previousHeight !== newHeight) {
        this.previousHeight = newHeight;
        // Could dispatch a custom event here if needed
      }
    }

    _refreshAutoResizeConstraints() {
      this._minAutoHeight = this._resolveSizeToPixels(this.options.minHeight);
      this._maxAutoHeight = this._resolveSizeToPixels(this.options.maxHeight);
    }

    _resolveSizeToPixels(value) {
      if (value == null || value === '') {
        return null;
      }

      if (typeof value === 'number') {
        return value > 0 ? value : null;
      }

      const trimmed = String(value).trim();
      if (!trimmed) {
        return null;
      }

      const numeric = Number(trimmed);
      if (Number.isFinite(numeric) && numeric > 0) {
        return numeric;
      }

      if (typeof document === 'undefined' || !document.body) {
        return null;
      }

      const probe = document.createElement('div');
      probe.style.position = 'absolute';
      probe.style.visibility = 'hidden';
      probe.style.height = trimmed;
      probe.style.pointerEvents = 'none';
      document.body.appendChild(probe);
      const pixels = probe.getBoundingClientRect().height;
      probe.remove();

      if (!Number.isFinite(pixels) || pixels <= 0) {
        return null;
      }

      return pixels;
    }
    
    /**
     * Show or hide stats bar
     * @param {boolean} show - Whether to show stats
     */
    showStats(show) {
      this.options.showStats = show;
      
      if (show && !this.statsBar) {
        // Create stats bar (add to container, not wrapper)
        this.statsBar = document.createElement('div');
        this.statsBar.className = 'marzipan-stats';
        this.container.appendChild(this.statsBar);
        this._updateStats();
      } else if (!show && this.statsBar) {
        // Remove stats bar
        this.statsBar.remove();
        this.statsBar = null;
      }
    }
    
    /**
     * Show or hide the plain textarea (toggle overlay visibility)
     * @param {boolean} show - true to show plain textarea (hide overlay), false to show overlay
     * @returns {boolean} Current plain textarea state
     */
    showPlainTextarea(show) {
      if (typeof show === 'undefined') {
        return this.container.classList.contains('plain-mode');
      }

      if (show) {
        // Show plain textarea mode (hide overlay)
        this.container.classList.add('plain-mode');
      } else {
        // Show overlay mode (hide plain textarea text)
        this.container.classList.remove('plain-mode');
      }
      
      // Update toolbar button if exists
      if (this.toolbar) {
        const toggleBtn = this.container.querySelector('[data-action="toggle-plain"]');
        if (toggleBtn) {
          // Button is active when showing overlay (not plain mode)
          toggleBtn.classList.toggle('active', !show);
          toggleBtn.title = show ? 'Show markdown preview' : 'Show plain textarea';
        }
      }
      
      return show;
    }

    /**
     * Show/hide preview mode
     * @param {boolean} show - Show preview mode if true, edit mode if false
     * @returns {boolean} Current preview mode state
     */
    showPreviewMode(show) {
      if (show) {
        // Show preview mode (hide textarea, make preview interactive)
        this.container.classList.add('preview-mode');
      } else {
        // Show edit mode
        this.container.classList.remove('preview-mode');
      }
      
      return show;
    }

    /**
     * Destroy the editor instance
     */
    destroy() {
      // Remove instance reference
      this.element.MarzipanInstance = null;
      Marzipan.instances.delete(this.element);

      if (this.numberUpdateTimeout) {
        clearTimeout(this.numberUpdateTimeout);
        this.numberUpdateTimeout = null;
      }

      this._teardownAutoResize();

      if (this.blockHandlesPlugin) {
        this.blockHandlesPlugin.destroy();
        this.blockHandlesPlugin = null;
      }

      if (this.linkTooltip) {
        this.linkTooltip.destroy();
        this.linkTooltip = null;
      }

      if (this.toolbar) {
        this.toolbar.destroy();
        this.toolbar = null;
      }

      // Cleanup shortcuts
      if (this.shortcuts) {
        this.shortcuts.destroy();
      }

      // Remove DOM if created by us
      if (this.wrapper) {
        const content = this.getValue();
        this.wrapper.remove();
        
        // Restore original content
        this.element.textContent = content;
      }

      if (this.container) {
        this.container.removeAttribute('data-marzipan-instance');
      }

      if (this._appliedThemeColorKeys && this.container) {
        for (const key of this._appliedThemeColorKeys) {
          this.container.style.removeProperty(key);
        }
        this._appliedThemeColorKeys.clear();
      }

      this.initialized = false;
    }

    // ===== Static Methods =====

    /**
     * Initialize multiple editors (static convenience method)
     * @param {string|Element|NodeList|Array} target - Target element(s)
     * @param {Object} options - Configuration options
     * @returns {Array} Array of Marzipan instances
     */
    static init(target, options = {}) {
      return new Marzipan(target, options);
    }

    /**
     * Get instance from element
     * @param {Element} element - DOM element
     * @returns {Marzipan|null} Marzipan instance or null
     */
    static getInstance(element) {
      return element.MarzipanInstance || Marzipan.instances.get(element) || null;
    }

    /**
     * Destroy all instances
     */
    static destroyAll() {
      const elements = document.querySelectorAll('[data-marzipan-instance]');
      elements.forEach(element => {
        const instance = Marzipan.getInstance(element);
        if (instance) {
          instance.destroy();
        }
      });
    }

    /**
     * Inject styles into the document
     * @param {boolean} force - Force re-injection
     */
    static injectStyles(force = false) {
      if (Marzipan.stylesInjected && !force) return;

      // Remove any existing Marzipan styles
      const existing = document.querySelector('style.marzipan-styles');
      if (existing) {
        existing.remove();
      }

      // Generate and inject new styles with current theme
      const theme = Marzipan.currentTheme || solar;
      const styles = generateStyles({ theme });
      const styleEl = document.createElement('style');
      styleEl.className = 'marzipan-styles';
      styleEl.textContent = styles;
      document.head.appendChild(styleEl);

      Marzipan.stylesInjected = true;
    }
    
    /**
     * Set global theme for all Marzipan instances
     * @param {string|Object} theme - Theme name or custom theme object
     * @param {Object} customColors - Optional color overrides
     */
    static setTheme(theme, customColors = null) {
      // Process theme
      let themeObj = typeof theme === 'string' ? getTheme(theme) : theme;
      
      // Apply custom colors if provided
      if (customColors) {
        themeObj = mergeTheme(themeObj, customColors);
      }
      
      // Store as current theme
      Marzipan.currentTheme = themeObj;
      
      // Re-inject styles with new theme
      Marzipan.injectStyles(true);
      const themeName = typeof theme === 'string' ? theme : themeObj?.name;
      
      // Update all existing instances - update container theme attribute
      document.querySelectorAll('.marzipan-container').forEach(container => {
        const wrapper = container.querySelector('.marzipan-wrapper');
        const instance = wrapper?._instance;
        if (instance) {
          instance._applyTheme(container);
          instance.updatePreview();
        } else if (themeName) {
          container.setAttribute('data-theme', themeName);
        }
      });
      
      // Also handle any old-style wrappers without containers
      document.querySelectorAll('.marzipan-wrapper').forEach(wrapper => {
        if (!wrapper.closest('.marzipan-container')) {
          const instance = wrapper._instance;
          if (instance) {
            instance._applyTheme(wrapper);
            instance.updatePreview();
          } else if (themeName) {
            wrapper.setAttribute('data-theme', themeName);
          }
        }
      });
    }

    /**
     * Initialize global event listeners
     */
    static initGlobalListeners() {
      if (Marzipan.globalListenersInitialized) return;

      // Input event
      document.addEventListener('input', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('marzipan-input')) {
          const wrapper = e.target.closest('.marzipan-wrapper');
          const instance = wrapper?._instance;
          if (instance) instance.handleInput(e);
        }
      });

      // Keydown event
      document.addEventListener('keydown', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('marzipan-input')) {
          const wrapper = e.target.closest('.marzipan-wrapper');
          const instance = wrapper?._instance;
          if (instance) instance.handleKeydown(e);
        }
      });

      // Scroll event
      document.addEventListener('scroll', (e) => {
        if (e.target && e.target.classList && e.target.classList.contains('marzipan-input')) {
          const wrapper = e.target.closest('.marzipan-wrapper');
          const instance = wrapper?._instance;
          if (instance) instance.handleScroll(e);
        }
      }, true);

      // Selection change event
      document.addEventListener('selectionchange', () => {
        const activeElement = document.activeElement;
        if (activeElement && activeElement.classList.contains('marzipan-input')) {
          const wrapper = activeElement.closest('.marzipan-wrapper');
          const instance = wrapper?._instance;
          if (instance) {
            // Update stats bar for cursor position
            if (instance.options.showStats && instance.statsBar) {
              instance._updateStats();
            }
            // Debounce updates
            clearTimeout(instance._selectionTimeout);
            instance._selectionTimeout = setTimeout(() => {
              instance.updatePreview();
            }, 50);
          }
        }
      });

      Marzipan.globalListenersInitialized = true;
    }
}

// Export classes for advanced usage
Marzipan.MarkdownParser = MarkdownParser;
Marzipan.ShortcutsManager = ShortcutsManager;

// Export theme utilities
Marzipan.themes = {
  solar,
  cave: getTheme('cave'),
  light: getTheme('light'),
  dark: getTheme('dark')
};
Marzipan.getTheme = getTheme;

// Set default theme
Marzipan.currentTheme = solar;

// Export for module systems
export default Marzipan;
export { Marzipan };
