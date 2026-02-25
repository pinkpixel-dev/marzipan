// @ts-nocheck
/**
 * CSS styles for Marzipan editor
 * Embedded in JavaScript to ensure single-file distribution
 */

import { themeToCSSVars } from './themes';

/**
 * Generate the complete CSS for the editor
 * @param {Object} options - Configuration options
 * @returns {string} Complete CSS string
 */
export function generateStyles(options: any = {}) {
  const {
    fontSize = '14px',
    lineHeight = 1.6,
    /* System-first, guaranteed monospaced; avoids Android 'ui-monospace' pitfalls */
    fontFamily = '"SF Mono", SFMono-Regular, Menlo, Monaco, "Cascadia Code", Consolas, "Roboto Mono", "Noto Sans Mono", "Droid Sans Mono", "Ubuntu Mono", "DejaVu Sans Mono", "Liberation Mono", "Courier New", Courier, monospace',
    padding = '20px',
    theme = null,
    mobile = {}
  } = options;

  // Generate mobile overrides
  const mobileStyles = Object.keys(mobile).length > 0 ? `
    @media (max-width: 640px) {
      .marzipan-wrapper .marzipan-input,
      .marzipan-wrapper .marzipan-preview {
        ${Object.entries(mobile)
          .map(([prop, val]) => {
            const cssProp = prop.replace(/([A-Z])/g, '-$1').toLowerCase();
            return `${cssProp}: ${val} !important;`;
          })
          .join('\n        ')}
      }
    }
  ` : '';

  // Generate theme variables if provided
  const themeVars = theme && theme.colors ? themeToCSSVars(theme.colors) : '';

  return `
    /* Marzipan Editor Styles */
    
    /* Middle-ground CSS Reset - Prevent parent styles from leaking in */
    .marzipan-container * {
      /* Box model - these commonly leak */
      margin: 0 !important;
      padding: 0 !important;
      border: 0 !important;
      
      /* Layout - these can break our layout */
      /* Don't reset position - it breaks dropdowns */
      float: none !important;
      clear: none !important;
      
      /* Typography - only reset decorative aspects */
      text-decoration: none !important;
      text-transform: none !important;
      letter-spacing: normal !important;
      
      /* Visual effects that can interfere */
      box-shadow: none !important;
      text-shadow: none !important;
      
      /* Ensure box-sizing is consistent */
      box-sizing: border-box !important;
      
      /* Keep inheritance for these */
      /* font-family, color, line-height, font-size - inherit */
    }
    
    /* Container base styles after reset */
    .marzipan-container {
      display: grid !important;
      grid-template-rows: auto 1fr auto !important;
      width: 100% !important;
      height: 100% !important;
      position: relative !important; /* Override reset - needed for absolute children */
      overflow: visible !important; /* Allow dropdown to overflow container */
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      text-align: left !important;
      ${themeVars ? `
      /* Theme Variables */
      ${themeVars}` : ''}
    }
    
    /* Force left alignment for all elements in the editor */
    .marzipan-container .marzipan-wrapper * {
      text-align: left !important;
    }
    
    /* Auto-resize mode styles */
    .marzipan-container.marzipan-auto-resize {
      height: auto !important;
      grid-template-rows: auto auto auto !important;
    }
    
    .marzipan-container.marzipan-auto-resize .marzipan-wrapper {
      height: auto !important;
      min-height: 60px !important;
      overflow: visible !important;
    }
    
    .marzipan-wrapper {
      position: relative !important; /* Override reset - needed for absolute children */
      width: 100% !important;
      height: 100% !important; /* Take full height of grid cell */
      min-height: 60px !important; /* Minimum usable height */
      overflow: hidden !important;
      background: var(--bg-secondary, #ffffff) !important;
      grid-row: 2 !important; /* Always second row in grid */
      z-index: 1; /* Below toolbar and dropdown */
    }

    /* Critical alignment styles - must be identical for both layers */
    .marzipan-wrapper .marzipan-input,
    .marzipan-wrapper .marzipan-preview {
      /* Positioning - must be identical */
      position: absolute !important; /* Override reset - required for overlay */
      top: 0 !important;
      left: 0 !important;
      width: 100% !important;
      height: 100% !important;
      
      /* Font properties - any difference breaks alignment */
      font-family: ${fontFamily} !important;
      font-variant-ligatures: none !important; /* keep metrics stable for code */
      font-size: var(--instance-font-size, ${fontSize}) !important;
      line-height: var(--instance-line-height, ${lineHeight}) !important;
      font-weight: normal !important;
      font-style: normal !important;
      font-variant: normal !important;
      font-stretch: normal !important;
      font-kerning: none !important;
      font-feature-settings: normal !important;
      
      /* Box model - must match exactly */
      padding: var(--instance-padding, ${padding}) !important;
      margin: 0 !important;
      border: none !important;
      outline: none !important;
      box-sizing: border-box !important;
      
      /* Text layout - critical for character positioning */
      white-space: pre-wrap !important;
      word-wrap: break-word !important;
      word-break: normal !important;
      overflow-wrap: break-word !important;
      tab-size: 2 !important;
      -moz-tab-size: 2 !important;
      text-align: left !important;
      text-indent: 0 !important;
      letter-spacing: normal !important;
      word-spacing: normal !important;
      
      /* Text rendering */
      text-transform: none !important;
      text-rendering: auto !important;
      -webkit-font-smoothing: auto !important;
      -webkit-text-size-adjust: 100% !important;
      
      /* Direction and writing */
      direction: ltr !important;
      writing-mode: horizontal-tb !important;
      unicode-bidi: normal !important;
      text-orientation: mixed !important;
      
      /* Visual effects that could shift perception */
      text-shadow: none !important;
      filter: none !important;
      transform: none !important;
      zoom: 1 !important;
      
      /* Vertical alignment */
      vertical-align: baseline !important;
      
      /* Size constraints */
      min-width: 0 !important;
      min-height: 0 !important;
      max-width: none !important;
      max-height: none !important;
      
      /* Overflow */
      overflow-y: auto !important;
      overflow-x: auto !important;
      /* overscroll-behavior removed to allow scroll-through to parent */
      scrollbar-width: auto !important;
      scrollbar-gutter: auto !important;
      
      /* Animation/transition - disabled to prevent movement */
      animation: none !important;
      transition: none !important;
    }

    /* Input layer styles */
    .marzipan-wrapper .marzipan-input {
      /* Layer positioning */
      z-index: 1 !important;
      
      /* Text visibility */
      color: transparent !important;
      caret-color: var(--cursor, #f95738) !important;
      background-color: transparent !important;
      
      /* Textarea-specific */
      resize: none !important;
      appearance: none !important;
      -webkit-appearance: none !important;
      -moz-appearance: none !important;
      
      /* Prevent mobile zoom on focus */
      touch-action: manipulation !important;
      
      /* Disable autofill and spellcheck */
      autocomplete: off !important;
      autocorrect: off !important;
      autocapitalize: off !important;
      spellcheck: false !important;
    }

    .marzipan-wrapper .marzipan-input::selection {
      background-color: var(--selection, rgba(244, 211, 94, 0.4));
    }

    /* Preview layer styles */
    .marzipan-wrapper .marzipan-preview {
      /* Layer positioning */
      z-index: 0 !important;
      pointer-events: none !important;
      color: var(--text, #0d3b66) !important;
      background-color: transparent !important;
      
      /* Prevent text selection */
      user-select: none !important;
      -webkit-user-select: none !important;
      -moz-user-select: none !important;
      -ms-user-select: none !important;
    }

    /* Defensive styles for preview child divs */
    .marzipan-wrapper .marzipan-preview div {
      /* Reset any inherited styles */
      margin: 0 !important;
      padding: 0 !important;
      border: none !important;
      text-align: left !important;
      text-indent: 0 !important;
      display: block !important;
      position: static !important;
      transform: none !important;
      min-height: 0 !important;
      max-height: none !important;
      line-height: inherit !important;
      font-size: inherit !important;
      font-family: inherit !important;
    }

    /* Markdown element styling - NO SIZE CHANGES */
    .marzipan-wrapper .marzipan-preview .header {
      font-weight: bold !important;
    }

    /* Header colors */
    .marzipan-wrapper .marzipan-preview .h1 { 
      color: var(--h1, #f95738) !important; 
    }
    .marzipan-wrapper .marzipan-preview .h2 { 
      color: var(--h2, #ee964b) !important; 
    }
    .marzipan-wrapper .marzipan-preview .h3 { 
      color: var(--h3, #3d8a51) !important; 
    }

    /* Semantic headers - flatten in edit mode */
    .marzipan-wrapper .marzipan-preview h1,
    .marzipan-wrapper .marzipan-preview h2,
    .marzipan-wrapper .marzipan-preview h3 {
      font-size: inherit !important;
      font-weight: bold !important;
      margin: 0 !important;
      padding: 0 !important;
      display: inline !important;
      line-height: inherit !important;
    }

    /* Header colors for semantic headers */
    .marzipan-wrapper .marzipan-preview h1 { 
      color: var(--h1, #f95738) !important; 
    }
    .marzipan-wrapper .marzipan-preview h2 { 
      color: var(--h2, #ee964b) !important; 
    }
    .marzipan-wrapper .marzipan-preview h3 { 
      color: var(--h3, #3d8a51) !important; 
    }

    /* Lists - remove styling in edit mode */
    .marzipan-wrapper .marzipan-preview ul,
    .marzipan-wrapper .marzipan-preview ol {
      list-style: none !important;
      margin: 0 !important;
      padding: 0 !important;
      display: block !important; /* Lists need to be block for line breaks */
    }

    .marzipan-wrapper .marzipan-preview li {
      display: block !important; /* Each item on its own line */
      margin: 0 !important;
      padding: 0 !important;
      /* Don't set list-style here - let ul/ol control it */
    }

    /* Bold text */
    .marzipan-wrapper .marzipan-preview strong {
      color: var(--strong, #ee964b) !important;
      font-weight: bold !important;
    }

    /* Italic text */
    .marzipan-wrapper .marzipan-preview em {
      color: var(--em, #f95738) !important;
      text-decoration-color: var(--em, #f95738) !important;
      text-decoration-thickness: 1px !important;
      font-style: italic !important;
    }

    /* Strikethrough text */
    .marzipan-wrapper .marzipan-preview del {
      color: var(--del, #ee964b) !important;
      text-decoration: line-through !important;
      text-decoration-color: var(--del, #ee964b) !important;
      text-decoration-thickness: 1px !important;
    }

    /* Inline code */
    .marzipan-wrapper .marzipan-preview code {
      background: var(--code-bg, rgba(244, 211, 94, 0.4)) !important;
      color: var(--code, #0d3b66) !important;
      padding: 0 !important;
      border-radius: 2px !important;
      font-family: inherit !important;
      font-size: inherit !important;
      line-height: inherit !important;
      font-weight: normal !important;
    }

    /* Code blocks - consolidated pre blocks */
    .marzipan-wrapper .marzipan-preview pre {
      padding: 0 !important;
      margin: 0 !important;
      border-radius: 4px !important;
      overflow-x: auto !important;
    }
    
    /* Code block styling in normal mode - yellow background */
    .marzipan-wrapper .marzipan-preview pre.code-block {
      background: var(--code-bg, rgba(244, 211, 94, 0.4)) !important;
    }

    /* Code inside pre blocks - remove background */
    .marzipan-wrapper .marzipan-preview pre code {
      background: transparent !important;
      color: var(--code, #0d3b66) !important;
    }

    /* Blockquotes */
    .marzipan-wrapper .marzipan-preview .blockquote {
      color: var(--blockquote, #5a7a9b) !important;
      padding: 0 !important;
      margin: 0 !important;
      border: none !important;
    }

    /* Links */
    .marzipan-wrapper .marzipan-preview a {
      color: var(--link, #0d3b66) !important;
      text-decoration: underline !important;
      font-weight: normal !important;
    }

    .marzipan-wrapper .marzipan-preview a:hover {
      text-decoration: underline !important;
      color: var(--link, #0d3b66) !important;
    }

    /* Lists - no list styling */
    .marzipan-wrapper .marzipan-preview ul,
    .marzipan-wrapper .marzipan-preview ol {
      list-style: none !important;
      margin: 0 !important;
      padding: 0 !important;
    }


    /* Horizontal rules */
    .marzipan-wrapper .marzipan-preview hr {
      border: none !important;
      color: var(--hr, #5a7a9b) !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    .marzipan-wrapper .marzipan-preview .hr-marker {
      color: var(--hr, #5a7a9b) !important;
      opacity: 0.6 !important;
    }

    /* Code fence markers - with background when not in code block */
    .marzipan-wrapper .marzipan-preview .code-fence {
      color: var(--code, #0d3b66) !important;
      background: var(--code-bg, rgba(244, 211, 94, 0.4)) !important;
    }
    
    /* Code block lines - background for entire code block */
    .marzipan-wrapper .marzipan-preview .code-block-line {
      background: var(--code-bg, rgba(244, 211, 94, 0.4)) !important;
    }
    
    /* Remove background from code fence when inside code block line */
    .marzipan-wrapper .marzipan-preview .code-block-line .code-fence {
      background: transparent !important;
    }

    /* Raw markdown line */
    .marzipan-wrapper .marzipan-preview .raw-line {
      color: var(--raw-line, #5a7a9b) !important;
      font-style: normal !important;
      font-weight: normal !important;
    }

    /* Syntax markers */
    .marzipan-wrapper .marzipan-preview .syntax-marker {
      color: var(--syntax-marker, rgba(13, 59, 102, 0.52)) !important;
      opacity: 0.7 !important;
    }

    /* List markers */
    .marzipan-wrapper .marzipan-preview .list-marker {
      color: var(--list-marker, #ee964b) !important;
    }

    /* Stats bar */
    
    /* Stats bar - positioned by grid, not absolute */
    .marzipan-stats {
      height: 40px !important;
      padding: 0 20px !important;
      background: var(--bg-primary, #f8f9fa) !important;
      border-top: 1px solid var(--toolbar-border, #e0e0e0) !important;
      display: flex !important;
      justify-content: space-between !important;
      align-items: center !important;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
      font-size: 0.85rem !important;
      color: var(--text, #666) !important;
      grid-row: 3 !important; /* Always third row in grid */
    }
    
    .marzipan-stats .marzipan-stat {
      display: flex !important;
      align-items: center !important;
      gap: 5px !important;
      white-space: nowrap !important;
    }
    
    .marzipan-stats .live-dot {
      width: 8px !important;
      height: 8px !important;
      background: #4caf50 !important;
      border-radius: 50% !important;
      animation: marzipan-pulse 2s infinite !important;
    }
    
    @keyframes marzipan-pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(1.2); }
    }
    

    /* Toolbar Styles */
    .marzipan-toolbar {
      display: flex !important;
      align-items: center !important;
      gap: 4px !important;
      padding: 8px !important; /* Override reset */
      background: var(--toolbar-bg, var(--bg-primary, #f8f9fa)) !important; /* Override reset */
      border-bottom: 1px solid var(--toolbar-border, rgba(0, 0, 0, 0.08)) !important;
      overflow-x: auto !important; /* Allow horizontal scrolling */
      overflow-y: hidden !important; /* Hide vertical overflow */
      -webkit-overflow-scrolling: touch !important;
      flex-shrink: 0 !important;
      height: auto !important;
      grid-row: 1 !important; /* Always first row in grid */
      position: relative !important; /* Override reset */
      z-index: 100 !important; /* Ensure toolbar is above wrapper */
      scrollbar-width: thin; /* Thin scrollbar on Firefox */
    }
    
    /* Thin scrollbar styling */
    .marzipan-toolbar::-webkit-scrollbar {
      height: 4px;
    }
    
    .marzipan-toolbar::-webkit-scrollbar-track {
      background: transparent;
    }
    
    .marzipan-toolbar::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 2px;
    }

    .marzipan-toolbar-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      padding: 0;
      border: none;
      border-radius: 6px;
      background: transparent;
      color: var(--toolbar-icon, var(--text-secondary, #666));
      cursor: pointer;
      transition: all 0.2s ease;
      flex-shrink: 0;
    }

    .marzipan-toolbar-button svg {
      width: 20px;
      height: 20px;
      fill: currentColor;
    }

    .marzipan-toolbar-button:hover {
      background: var(--toolbar-hover, var(--bg-secondary, #e9ecef));
      color: var(--toolbar-icon, var(--text-primary, #333));
    }

    .marzipan-toolbar-button:active {
      transform: scale(0.95);
    }

    .marzipan-toolbar-button.active {
      background: var(--toolbar-active, var(--primary, #007bff));
      color: var(--toolbar-icon, var(--text-primary, #333));
    }

    .marzipan-toolbar-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .marzipan-toolbar-separator {
      width: 1px;
      height: 24px;
      background: var(--border, #e0e0e0);
      margin: 0 4px;
      flex-shrink: 0;
    }

    /* Adjust wrapper when toolbar is present */
    .marzipan-container .marzipan-toolbar + .marzipan-wrapper {
    }

    /* Mobile toolbar adjustments */
    @media (max-width: 640px) {
      .marzipan-toolbar {
        padding: 6px;
        gap: 2px;
      }

      .marzipan-toolbar-button {
        width: 36px;
        height: 36px;
      }

      .marzipan-toolbar-separator {
        margin: 0 2px;
      }
    }
    
    /* Plain mode - hide preview and show textarea text */
    .marzipan-container.plain-mode .marzipan-preview {
      display: none !important;
    }
    
    .marzipan-container.plain-mode .marzipan-input {
      color: var(--text, #0d3b66) !important;
      /* Use system font stack for better plain text readability */
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, 
                   "Helvetica Neue", Arial, sans-serif !important;
    }
    
    /* Ensure textarea remains transparent in overlay mode */
    .marzipan-container:not(.plain-mode) .marzipan-input {
      color: transparent !important;
    }

    /* Dropdown menu styles */
    .marzipan-toolbar-button {
      position: relative !important; /* Override reset - needed for dropdown */
    }

    .marzipan-toolbar-button.dropdown-active {
      background: var(--toolbar-active, var(--hover-bg, #f0f0f0));
    }

    .marzipan-dropdown-menu {
      position: fixed !important; /* Fixed positioning relative to viewport */
      background: var(--bg-secondary, white) !important; /* Override reset */
      border: 1px solid var(--border, #e0e0e0) !important; /* Override reset */
      border-radius: 6px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important; /* Override reset */
      z-index: 10000; /* Very high z-index to ensure visibility */
      min-width: 150px;
      padding: 4px 0 !important; /* Override reset */
      /* Position will be set via JavaScript based on button position */
    }

    .marzipan-dropdown-item {
      display: flex;
      align-items: center;
      width: 100%;
      padding: 8px 12px;
      border: none;
      background: none;
      text-align: left;
      cursor: pointer;
      font-size: 14px;
      color: var(--text, #333);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }

    .marzipan-dropdown-item:hover {
      background: var(--hover-bg, #f0f0f0);
    }

    .marzipan-dropdown-item.active {
      font-weight: 600;
    }

    .marzipan-dropdown-check {
      width: 16px;
      margin-right: 8px;
      color: var(--h1, #007bff);
    }

    /* Preview mode styles */
    .marzipan-container.preview-mode .marzipan-input {
      display: none !important;
    }

    .marzipan-container.preview-mode .marzipan-preview {
      pointer-events: auto !important;
      user-select: text !important;
      cursor: text !important;
    }

    /* Hide syntax markers in preview mode */
    .marzipan-container.preview-mode .syntax-marker {
      display: none !important;
    }
    
    /* Hide URL part of links in preview mode - extra specificity */
    .marzipan-container.preview-mode .syntax-marker.url-part,
    .marzipan-container.preview-mode .url-part {
      display: none !important;
    }
    
    /* Hide all syntax markers inside links too */
    .marzipan-container.preview-mode a .syntax-marker {
      display: none !important;
    }

    /* Headers - restore proper sizing in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview h1, 
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview h2, 
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview h3 {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
      font-weight: 600 !important;
      margin: 0 !important;
      display: block !important;
      color: inherit !important; /* Use parent text color */
      line-height: 1 !important; /* Tight line height for headings */
    }
    
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview h1 { 
      font-size: 2em !important; 
    }
    
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview h2 { 
      font-size: 1.5em !important; 
    }
    
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview h3 { 
      font-size: 1.17em !important; 
    }

    /* Lists - restore list styling in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview ul {
      display: block !important;
      list-style: disc !important;
      padding-left: 2em !important;
      margin: 1em 0 !important;
    }

    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview ol {
      display: block !important;
      list-style: decimal !important;
      padding-left: 2em !important;
      margin: 1em 0 !important;
    }
    
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview li {
      display: list-item !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    /* Links - make clickable in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview a {
      pointer-events: auto !important;
      cursor: pointer !important;
      color: var(--link, #0066cc) !important;
      text-decoration: underline !important;
    }

    /* Code blocks - proper pre/code styling in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview pre.code-block {
      background: #2d2d2d !important;
      color: #f8f8f2 !important;
      padding: 1.2em !important;
      border-radius: 3px !important;
      overflow-x: auto !important;
      margin: 0 !important;
      display: block !important;
    }
    
    /* Cave theme code block background in preview mode */
    .marzipan-container[data-theme="cave"].preview-mode .marzipan-wrapper .marzipan-preview pre.code-block {
      background: #11171F !important;
    }

    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview pre.code-block code {
      background: transparent !important;
      color: inherit !important;
      padding: 0 !important;
      font-family: ${fontFamily} !important;
      font-size: 0.9em !important;
      line-height: 1.4 !important;
    }

    /* Hide old code block lines and fences in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview .code-block-line {
      display: none !important;
    }

    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview .code-fence {
      display: none !important;
    }

    /* Blockquotes - enhanced styling in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview .blockquote {
      display: block !important;
      border-left: 4px solid var(--blockquote, #ddd) !important;
      padding-left: 1em !important;
      margin: 1em 0 !important;
      font-style: italic !important;
    }

    /* Typography improvements in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview {
      font-family: Georgia, 'Times New Roman', serif !important;
      font-size: 16px !important;
      line-height: 1.8 !important;
      color: var(--text, #333) !important; /* Consistent text color */
    }

    /* Inline code in preview mode - keep monospace */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview code {
      font-family: ${fontFamily} !important;
      font-size: 0.9em !important;
      background: rgba(135, 131, 120, 0.15) !important;
      padding: 0.2em 0.4em !important;
      border-radius: 3px !important;
    }

    /* Strong and em elements in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview strong {
      font-weight: 700 !important;
      color: inherit !important; /* Use parent text color */
    }

    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview em {
      font-style: italic !important;
      color: inherit !important; /* Use parent text color */
    }

    /* HR in preview mode */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview .hr-marker {
      display: block !important;
      border-top: 2px solid var(--hr, #ddd) !important;
      text-indent: -9999px !important;
      height: 2px !important;
    }
    
    /* Tables - GFM-style table rendering */
    .marzipan-preview .marzipan-table {
      border-collapse: collapse;
      margin: 1em 0;
      width: 100%;
      overflow: auto;
    }
    
    .marzipan-preview .marzipan-table th,
    .marzipan-preview .marzipan-table td {
      border: 1px solid var(--border, #ddd);
      padding: 0.5em 1em;
      text-align: left;
    }
    
    .marzipan-preview .marzipan-table th {
      background: var(--bg-secondary, #f5f5f5);
      font-weight: 600;
    }
    
    .marzipan-preview .marzipan-table tr:nth-child(even) {
      background: var(--bg-secondary, #f9f9f9);
    }
    
    /* In preview mode - hide table syntax markers */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview .table-row,
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview .table-separator {
      display: none !important;
    }
    
    /* Images - responsive and styled */
    .marzipan-preview .marzipan-image {
      max-width: 100%;
      height: auto;
      display: inline-block;
      border-radius: 4px;
      margin: 0.5em 0;
    }
    
    /* In preview mode - make images fully visible */
    .marzipan-container.preview-mode .marzipan-wrapper .marzipan-preview .marzipan-image {
      display: block;
      margin: 1em auto;
    }

    ${mobileStyles}
  `;
}
