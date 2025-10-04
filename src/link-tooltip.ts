// @ts-nocheck
/**
 * Link Tooltip - CSS Anchor Positioning with index-based anchors
 * Shows a clickable tooltip when cursor is within a link
 * Uses CSS anchor positioning with dynamically selected anchor
 */

export class LinkTooltip {
  [key: string]: any;
  constructor(editor: any) {
    this.editor = editor;
    this.tooltip = null;
    this.currentLink = null;
    this.hideTimeout = null;
    
    this.init();
  }
  
  init() {
    // Check for CSS anchor positioning support
    const supportsAnchor = 
      CSS.supports('position-anchor: --x') &&
      CSS.supports('position-area: center');
    
    if (!supportsAnchor) {
      // Don't show anything if not supported
      return;
    }
    
    // Create tooltip element
    this.createTooltip();
    
    // Listen for cursor position changes
    this.editor.textarea.addEventListener('selectionchange', () => this.checkCursorPosition());
    this.editor.textarea.addEventListener('keyup', (e) => {
      if (e.key.includes('Arrow') || e.key === 'Home' || e.key === 'End') {
        this.checkCursorPosition();
      }
    });
    
    // Hide tooltip when typing or scrolling
    this.editor.textarea.addEventListener('input', () => this.hide());
    this.editor.textarea.addEventListener('scroll', () => this.hide());
    
    // Keep tooltip visible on hover
    this.tooltip.addEventListener('mouseenter', () => this.cancelHide());
    this.tooltip.addEventListener('mouseleave', () => this.scheduleHide());
  }
  
  createTooltip() {
    // Create tooltip element
    this.tooltip = document.createElement('div');
    this.tooltip.className = 'marzipan-link-tooltip';
    
    // Add CSS anchor positioning styles
    const tooltipStyles = document.createElement('style');
    tooltipStyles.textContent = `
      @supports (position-anchor: --x) and (position-area: center) {
        .marzipan-link-tooltip {
          position: absolute;
          position-anchor: var(--target-anchor, --link-0);
          position-area: block-end center;
          margin-top: 8px !important;
          
          background: #333 !important;
          color: white !important;
          padding: 6px 10px !important;
          border-radius: 16px !important;
          font-size: 12px !important;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
          display: none !important;
          z-index: 10000 !important;
          cursor: pointer !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important;
          max-width: 300px !important;
          white-space: nowrap !important;
          overflow: hidden !important;
          text-overflow: ellipsis !important;
          
          position-try: most-width block-end inline-end, flip-inline, block-start center;
          position-visibility: anchors-visible;
        }
        
        .marzipan-link-tooltip.visible {
          display: flex !important;
        }
      }
    `;
    document.head.appendChild(tooltipStyles);
    
    // Add link icon and text container
    this.tooltip.innerHTML = `
      <span style="display: flex; align-items: center; gap: 6px;">
        <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor" style="flex-shrink: 0;">
          <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"></path>
          <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"></path>
        </svg>
        <span class="marzipan-link-tooltip-url"></span>
      </span>
    `;
    
    // Click handler to open link
    this.tooltip.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (this.currentLink) {
        window.open(this.currentLink.url, '_blank');
        this.hide();
      }
    });
    
    // Append tooltip to editor container
    this.editor.container.appendChild(this.tooltip);
  }
  
  checkCursorPosition() {
    const cursorPos = this.editor.textarea.selectionStart;
    const text = this.editor.textarea.value;
    
    // Find if cursor is within a markdown link
    const linkInfo = this.findLinkAtPosition(text, cursorPos);
    
    if (linkInfo) {
      if (!this.currentLink || this.currentLink.url !== linkInfo.url || this.currentLink.index !== linkInfo.index) {
        this.show(linkInfo);
      }
    } else {
      this.scheduleHide();
    }
  }
  
  findLinkAtPosition(text, position) {
    // Regex to find markdown links: [text](url)
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    let linkIndex = 0;
    
    while ((match = linkRegex.exec(text)) !== null) {
      const start = match.index;
      const end = match.index + match[0].length;
      
      if (position >= start && position <= end) {
        return {
          text: match[1],
          url: match[2],
          index: linkIndex,
          start: start,
          end: end
        };
      }
      linkIndex++;
    }
    
    return null;
  }
  
  show(linkInfo) {
    this.currentLink = linkInfo;
    this.cancelHide();
    
    // Update tooltip content
    const urlSpan = this.tooltip.querySelector('.marzipan-link-tooltip-url');
    urlSpan.textContent = linkInfo.url;
    
    // Set the CSS variable to point to the correct anchor
    this.tooltip.style.setProperty('--target-anchor', `--link-${linkInfo.index}`);
    
    // Show tooltip (CSS anchor positioning handles the rest)
    this.tooltip.classList.add('visible');
  }
  
  hide() {
    this.tooltip.classList.remove('visible');
    this.currentLink = null;
  }
  
  scheduleHide() {
    this.cancelHide();
    this.hideTimeout = setTimeout(() => this.hide(), 300);
  }
  
  cancelHide() {
    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = null;
    }
  }
  
  destroy() {
    this.cancelHide();
    if (this.tooltip && this.tooltip.parentNode) {
      this.tooltip.parentNode.removeChild(this.tooltip);
    }
    this.tooltip = null;
    this.currentLink = null;
  }
}
