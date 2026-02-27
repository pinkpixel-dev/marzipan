/**
 * Block Handles Plugin
 * 
 * Provides interactive handles on the left side of markdown blocks in the preview overlay.
 * Handles appear on hover and provide quick actions for block manipulation.
 * 
 * Features:
 * - Hover to show handles
 * - Click to select blocks
 * - Copy block content
 * - Delete blocks
 * - Visual feedback for selected blocks
 */

export interface BlockHandle {
  id: string;
  type: string;
  lineStart: number;
  lineEnd: number;
  element: HTMLElement;
  handleElement: HTMLElement | null;
}

export interface BlockHandlesConfig {
  enabled?: boolean;
  showOnHover?: boolean;
  handleOffset?: number;
  handleSize?: number;
  colors?: {
    hover?: string;
    selected?: string;
    handle?: string;
  };
}

export class BlockHandlesPlugin {
  private editor: HTMLTextAreaElement;
  private preview: HTMLElement;
  private config: Required<BlockHandlesConfig>;
  private blocks: Map<string, BlockHandle>;
  private selectedBlockId: string | null;
  private activeBlockId: string | null;
  private handleContainer: HTMLElement | null;

  // Stored bound handlers for proper cleanup
  private _boundMouseMove: (e: MouseEvent) => void;
  private _boundMouseLeave: (e: MouseEvent) => void;
  private _boundClick: (e: MouseEvent) => void;
  private _boundKeyDown: (e: KeyboardEvent) => void;
  private _boundCursorUpdate: () => void;

  constructor(editor: HTMLTextAreaElement, preview: HTMLElement, config: BlockHandlesConfig = {}) {
    this.editor = editor;
    this.preview = preview;
    this.config = {
      enabled: config.enabled ?? true,
      showOnHover: config.showOnHover ?? true,
      handleOffset: config.handleOffset ?? 4,
      handleSize: config.handleSize ?? 20,
      colors: {
        hover: config.colors?.hover ?? 'rgba(59, 130, 246, 0.1)',
        selected: config.colors?.selected ?? 'rgba(59, 130, 246, 0.2)',
        handle: config.colors?.handle ?? 'rgba(59, 130, 246, 0.8)',
      },
    };
    this.blocks = new Map();
    this.selectedBlockId = null;
    this.activeBlockId = null;
    this.handleContainer = null;

    // Bind handlers once for consistent add/remove
    this._boundMouseMove = this.handleMouseMove.bind(this);
    this._boundMouseLeave = this.handleMouseLeave.bind(this);
    this._boundClick = this.handleClick.bind(this);
    this._boundKeyDown = this.handleKeyDown.bind(this);
    this._boundCursorUpdate = this.updateActiveBlock.bind(this);

    this.initialize();
  }

  /**
   * Initialize the plugin
   */
  private initialize(): void {
    if (!this.config.enabled) return;

    // Create handle container
    this.createHandleContainer();

    // Set up event listeners
    this.setupEventListeners();

    // Initial scan for blocks
    this.scanBlocks();
  }

  /**
   * Create the container for block handles.
   * Appended to the wrapper (parent of preview) so it sits above the textarea
   * and is not subject to the preview's pointer-events: none rule.
   */
  private createHandleContainer(): void {
    this.handleContainer = document.createElement('div');
    this.handleContainer.className = 'mz-block-handles';
    this.handleContainer.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    `;
    // Attach to the wrapper (preview's parent), not the preview itself.
    // The preview has pointer-events: none which would prevent any interaction.
    const wrapper = this.preview.parentElement;
    if (wrapper) {
      wrapper.appendChild(this.handleContainer);
    }
  }

  /**
   * Set up event listeners for block interactions.
   * We listen on both the textarea (normal mode) and the preview (preview mode),
   * since in preview mode the textarea is display:none and the preview has pointer-events:auto.
   */
  private setupEventListeners(): void {
    // Normal overlay mode: textarea receives pointer events
    this.editor.addEventListener('mousemove', this._boundMouseMove);
    this.editor.addEventListener('mouseleave', this._boundMouseLeave);
    this.editor.addEventListener('click', this._boundClick);

    // Preview mode: preview has pointer-events:auto, textarea is display:none
    this.preview.addEventListener('mousemove', this._boundMouseMove);
    this.preview.addEventListener('mouseleave', this._boundMouseLeave);
    this.preview.addEventListener('click', this._boundClick);

    // Keyboard shortcuts
    document.addEventListener('keydown', this._boundKeyDown);

    // Cursor tracking for Notion-like active line handles
    this.editor.addEventListener('input', this._boundCursorUpdate);
    this.editor.addEventListener('mouseup', this._boundCursorUpdate);
    this.editor.addEventListener('keyup', this._boundCursorUpdate);
  }

  /**
   * Scan the preview for blocks and create handles
   */
  public scanBlocks(): void {
    this.blocks.clear();
    
    if (!this.handleContainer) return;

    // Clear existing handles
    this.handleContainer.innerHTML = '';

    // Find all elements with block metadata
    const blockElements = this.preview.querySelectorAll('[data-block-id]');
    
    blockElements.forEach((element) => {
      const el = element as HTMLElement;
      const blockId = el.getAttribute('data-block-id');
      const blockType = el.getAttribute('data-block-type');
      const lineStart = parseInt(el.getAttribute('data-line-start') || '0', 10);
      const lineEnd = parseInt(el.getAttribute('data-line-end') || '0', 10);

      if (!blockId) return;

      // Create handle for this block
      const handle = this.createHandle(blockId, blockType || 'paragraph');

      this.blocks.set(blockId, {
        id: blockId,
        type: blockType || 'paragraph',
        lineStart,
        lineEnd,
        element: el,
        handleElement: handle,
      });
    });

    // Now that all blocks are in the map, set their positions.
    // (updateHandlePosition looks up blocks by id, so it must run after blocks.set)
    this.updateAllHandlePositions();
  }

  /**
   * Create a handle element for a block
   */
  private createHandle(blockId: string, blockType: string): HTMLElement {
    const handle = document.createElement('div');
    handle.className = `mz-block-handle mz-block-handle-${blockType}`;
    handle.setAttribute('data-block-id', blockId);
    handle.style.cssText = `
      position: absolute;
      width: ${this.config.handleSize}px;
      height: ${this.config.handleSize}px;
      left: ${this.config.handleOffset}px;
      background: ${this.config.colors.handle};
      border-radius: 4px;
      cursor: pointer;
      opacity: 0;
      transition: opacity 0.2s ease;
      pointer-events: none;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 12px;
      user-select: none;
    `;

    // Add icon based on block type
    handle.innerHTML = this.getHandleIcon(blockType);

    // Handle click — select block and show action menu
    handle.addEventListener('click', (e) => {
      e.stopPropagation();
      e.preventDefault();
      this.selectBlock(blockId);
      this.showContextMenu(blockId, e);
    });

    // Show context menu on right click too
    handle.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.showContextMenu(blockId, e);
    });

    // When mouse leaves the handle, hide it (unless going back to editor)
    handle.addEventListener('mouseleave', (e: MouseEvent) => {
      const related = e.relatedTarget as HTMLElement | null;
      if (related === this.editor || related?.closest?.('.mz-block-handle') || related?.closest?.('.mz-block-handles')) {
        return;
      }
      this.hideAllHandles();
      this.unhighlightAll(true);
    });

    this.handleContainer?.appendChild(handle);

    return handle;
  }

  /**
   * Get icon for handle based on block type
   */
  private getHandleIcon(blockType: string): string {
    const icons: Record<string, string> = {
      heading: '⚡',
      paragraph: '¶',
      'list-item': '•',
      quote: '"',
      'code-fence': '{',
      'code-content': '{}',
      hr: '―',
      'table-row': '⊞',
      'table-separator': '═',
    };
    return icons[blockType] || '○';
  }

  /**
   * Update handle position based on block element position.
   * Uses viewport-relative coordinates so scrolling is automatically accounted for.
   */
  private updateHandlePosition(blockId: string): void {
    const block = this.blocks.get(blockId);
    if (!block || !block.handleElement) return;

    const blockRect = block.element.getBoundingClientRect();
    const previewRect = this.preview.getBoundingClientRect();

    // blockRect.top and previewRect.top are both viewport-relative,
    // so their difference gives the offset within the visible preview area.
    const top = blockRect.top - previewRect.top;

    block.handleElement.style.top = `${top}px`;
  }

  /**
   * Update all handle positions (call on scroll/resize)
   */
  public updateAllHandlePositions(): void {
    this.blocks.forEach((_block, blockId) => {
      this.updateHandlePosition(blockId);
    });
  }

  /**
   * Find the preview block element at a given viewport position.
   * Extends the hit rect to the left by handleOffset + handleSize so the
   * mouse can reach the handle without triggering a hide.
   */
  private findBlockAtPoint(clientX: number, clientY: number): HTMLElement | null {
    const handleReach = this.config.handleOffset + this.config.handleSize;
    for (const block of this.blocks.values()) {
      const rect = block.element.getBoundingClientRect();
      if (clientX >= rect.left - handleReach && clientX <= rect.right &&
          clientY >= rect.top  && clientY <= rect.bottom) {
        return block.element;
      }
    }
    return null;
  }

  /**
   * Handle mouse move for hover effects.
   * Listens on both the textarea (normal mode) and the preview (preview mode).
   */
  private handleMouseMove(e: MouseEvent): void {
    if (!this.config.showOnHover) return;

    // If the element actually under the cursor is a handle, keep it visible
    const elementUnder = document.elementFromPoint(e.clientX, e.clientY);
    if (elementUnder && (elementUnder as HTMLElement).closest?.('.mz-block-handle')) return;

    const blockElement = this.findBlockAtPoint(e.clientX, e.clientY);

    if (blockElement) {
      const blockId = blockElement.getAttribute('data-block-id');
      if (blockId) {
        this.showHandle(blockId);
        // Don't replace selected-color with hover-color on the selected block
        if (blockId !== this.selectedBlockId) {
          this.highlightBlock(blockId, false);
        }
      }
    } else {
      this.hideAllHandles();
      this.unhighlightAll(true); // keep selected block highlighted
    }
  }

  /**
   * Handle mouse leave event.
   * Checks relatedTarget so handles don't disappear when mouse moves to a handle.
   */
  private handleMouseLeave(e: MouseEvent): void {
    const related = e.relatedTarget as HTMLElement | null;
    // Don't hide handles if mouse moved to a block handle element
    if (related?.closest?.('.mz-block-handle') || related?.closest?.('.mz-block-handles')) {
      return;
    }
    this.hideAllHandles();
    this.unhighlightAll(true);
  }

  /**
   * Handle click events for block selection.
   * Clicks anywhere in the left handle-zone (the padding area left of block text)
   * select the block — no shift key required. Shift+click anywhere on the block
   * also selects it. Clicking in normal text area deselects.
   */
  private handleClick(e: MouseEvent): void {
    const blockElement = this.findBlockAtPoint(e.clientX, e.clientY);

    if (blockElement) {
      const blockId = blockElement.getAttribute('data-block-id');
      if (blockId) {
        const blockRect = blockElement.getBoundingClientRect();
        // A click in the handle zone (left of where text starts) or shift+click selects
        const inHandleZone = e.clientX < blockRect.left;
        if (inHandleZone || e.shiftKey) {
          e.preventDefault();
          this.selectBlock(blockId);
        } else {
          // Normal click inside block text — deselect if something was selected
          if (this.selectedBlockId) this.deselectBlock();
        }
      }
    } else if (!(e.target as HTMLElement).closest?.('.mz-block-handle')) {
      // Click outside all blocks — deselect
      this.deselectBlock();
    }
  }

  /**
   * Handle keyboard shortcuts
   */
  private handleKeyDown(e: KeyboardEvent): void {
    if (!this.selectedBlockId) return;

    // Copy block (Ctrl/Cmd + C when block is selected)
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && !this.editor.selectionStart) {
      e.preventDefault();
      this.copyBlock(this.selectedBlockId);
    }

    // Delete block (Delete or Backspace when block is selected)
    if ((e.key === 'Delete' || e.key === 'Backspace') && !this.editor.selectionStart) {
      e.preventDefault();
      this.deleteBlock(this.selectedBlockId);
    }

    // Escape to deselect
    if (e.key === 'Escape') {
      this.deselectBlock();
    }
  }

  /**
   * Update the active block handle based on the cursor position in the textarea.
   * Shows the handle for the block containing the current editing line (Notion-like behavior).
   */
  private updateActiveBlock(): void {
    const cursorPos = this.editor.selectionStart;
    const text = this.editor.value.substring(0, cursorPos);
    const lineIndex = text.split('\n').length - 1;

    // Find block containing this line
    let foundBlockId: string | null = null;
    for (const [blockId, block] of this.blocks) {
      if (lineIndex >= block.lineStart && lineIndex <= block.lineEnd) {
        foundBlockId = blockId;
        break;
      }
    }

    // If same as current active, nothing to do
    if (foundBlockId === this.activeBlockId) return;

    // Clear previous active handle (if it's not selected)
    if (this.activeBlockId && this.activeBlockId !== this.selectedBlockId) {
      const prevBlock = this.blocks.get(this.activeBlockId);
      if (prevBlock?.handleElement) {
        prevBlock.handleElement.style.opacity = '0';
        prevBlock.handleElement.style.pointerEvents = 'none';
      }
    }

    this.activeBlockId = foundBlockId;

    if (foundBlockId) {
      this.showHandle(foundBlockId);
    }
  }

  /**
   * Show a specific handle
   */
  private showHandle(blockId: string): void {
    const block = this.blocks.get(blockId);
    if (block?.handleElement) {
      block.handleElement.style.opacity = '1';
      block.handleElement.style.pointerEvents = 'auto';
    }
  }

  /**
   * Hide all handles except selected and active cursor block
   */
  private hideAllHandles(): void {
    this.blocks.forEach((block) => {
      if (block.handleElement && block.id !== this.selectedBlockId && block.id !== this.activeBlockId) {
        block.handleElement.style.opacity = '0';
        block.handleElement.style.pointerEvents = 'none';
      }
    });
  }

  /**
   * Highlight a block
   */
  private highlightBlock(blockId: string, selected: boolean): void {
    const block = this.blocks.get(blockId);
    if (!block) return;

    const color = selected ? this.config.colors.selected : this.config.colors.hover;
    block.element.style.backgroundColor = color ?? '';
  }

  /**
   * Remove highlight from all blocks
   */
  private unhighlightAll(keepSelected: boolean = false): void {
    this.blocks.forEach((block) => {
      if (!keepSelected || block.id !== this.selectedBlockId) {
        block.element.style.backgroundColor = '';
      }
    });
  }

  /**
   * Select a block
   */
  private selectBlock(blockId: string): void {
    // Deselect previous block
    if (this.selectedBlockId) {
      this.unhighlightAll();
      const prevBlock = this.blocks.get(this.selectedBlockId);
      if (prevBlock?.handleElement) {
        prevBlock.handleElement.style.opacity = '0';
        prevBlock.handleElement.style.pointerEvents = 'none';
      }
    }

    // Select new block
    this.selectedBlockId = blockId;
    this.highlightBlock(blockId, true);
    this.showHandle(blockId);

    // Dispatch selection event
    this.preview.dispatchEvent(new CustomEvent('blockSelected', {
      detail: { blockId, block: this.blocks.get(blockId) },
    }));
  }

  /**
   * Deselect current block
   */
  private deselectBlock(): void {
    if (!this.selectedBlockId) return;

    const blockId = this.selectedBlockId;
    this.selectedBlockId = null;
    this.unhighlightAll();
    this.hideAllHandles();

    // Dispatch deselection event
    this.preview.dispatchEvent(new CustomEvent('blockDeselected', {
      detail: { blockId },
    }));
  }

  /**
   * Copy block content to clipboard
   */
  private async copyBlock(blockId: string): Promise<void> {
    const block = this.blocks.get(blockId);
    if (!block) return;

    const content = this.getBlockContent(block);
    
    try {
      await navigator.clipboard.writeText(content);
      this.showToast('Block copied to clipboard');
    } catch (err) {
      console.error('Failed to copy block:', err);
      this.showToast('Failed to copy block', 'error');
    }
  }

  /**
   * Delete a block from the editor
   */
  private deleteBlock(blockId: string): void {
    const block = this.blocks.get(blockId);
    if (!block) return;

    const content = this.editor.value;
    const lines = content.split('\n');

    // Remove lines for this block
    lines.splice(block.lineStart, block.lineEnd - block.lineStart + 1);

    // Update editor
    this.editor.value = lines.join('\n');
    
    // Trigger input event to update preview
    this.editor.dispatchEvent(new Event('input', { bubbles: true }));

    // Deselect and rescan
    this.deselectBlock();
    this.showToast('Block deleted');
  }

  /**
   * Get the text content of a block from the editor
   */
  private getBlockContent(block: BlockHandle): string {
    const content = this.editor.value;
    const lines = content.split('\n');
    
    return lines
      .slice(block.lineStart, block.lineEnd + 1)
      .join('\n');
  }

  /**
   * Show context menu for block actions
   */
  private showContextMenu(blockId: string, e: MouseEvent): void {
    // Remove existing context menu if any
    const existingMenu = document.querySelector('.mz-block-context-menu');
    if (existingMenu) {
      existingMenu.remove();
    }

    const menu = document.createElement('div');
    menu.className = 'mz-block-context-menu';
    menu.style.cssText = `
      position: fixed;
      top: ${e.clientY}px;
      left: ${e.clientX}px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      min-width: 150px;
      padding: 4px 0;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
    `;

    const actions = [
      { label: 'Copy', action: () => this.copyBlock(blockId), icon: '📋' },
      { label: 'Delete', action: () => this.deleteBlock(blockId), icon: '🗑️' },
      { label: 'Select', action: () => this.selectBlock(blockId), icon: '✓' },
    ];

    actions.forEach(({ label, action, icon }) => {
      const item = document.createElement('div');
      item.className = 'mz-context-menu-item';
      item.textContent = `${icon} ${label}`;
      item.style.cssText = `
        padding: 8px 16px;
        cursor: pointer;
        user-select: none;
      `;

      item.addEventListener('mouseenter', () => {
        item.style.backgroundColor = '#f5f5f5';
      });

      item.addEventListener('mouseleave', () => {
        item.style.backgroundColor = '';
      });

      item.addEventListener('click', () => {
        action();
        menu.remove();
      });

      menu.appendChild(item);
    });

    document.body.appendChild(menu);

    // Close menu on click outside
    const closeMenu = (e: MouseEvent) => {
      if (!menu.contains(e.target as Node)) {
        menu.remove();
        document.removeEventListener('click', closeMenu);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', closeMenu);
    }, 0);
  }

  /**
   * Show a toast notification
   */
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    const toast = document.createElement('div');
    toast.className = 'mz-toast';
    toast.textContent = message;
    toast.style.cssText = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: ${type === 'success' ? '#10b981' : '#ef4444'};
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      z-index: 1000;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      font-size: 14px;
      animation: slideIn 0.3s ease;
    `;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideOut 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  /**
   * Enable the plugin
   */
  public enable(): void {
    if (this.config.enabled) return; // Already enabled
    this.config.enabled = true;
    this.initialize();
  }

  /**
   * Disable the plugin
   */
  public disable(): void {
    this.config.enabled = false;
    this.handleContainer?.remove();
    this.handleContainer = null;
    this.blocks.clear();
    this.selectedBlockId = null;
    this.activeBlockId = null;
    // Remove event listeners from both textarea and preview
    this.editor.removeEventListener('mousemove', this._boundMouseMove);
    this.editor.removeEventListener('mouseleave', this._boundMouseLeave);
    this.editor.removeEventListener('click', this._boundClick);
    this.preview.removeEventListener('mousemove', this._boundMouseMove);
    this.preview.removeEventListener('mouseleave', this._boundMouseLeave);
    this.preview.removeEventListener('click', this._boundClick);
    document.removeEventListener('keydown', this._boundKeyDown);
    // Remove cursor tracking listeners
    this.editor.removeEventListener('input', this._boundCursorUpdate);
    this.editor.removeEventListener('mouseup', this._boundCursorUpdate);
    this.editor.removeEventListener('keyup', this._boundCursorUpdate);
  }

  /**
   * Refresh the plugin (rescan blocks and update positions)
   */
  public refresh(): void {
    this.scanBlocks();
  }

  /**
   * Get the currently selected block
   */
  public getSelectedBlock(): BlockHandle | null {
    return this.selectedBlockId ? this.blocks.get(this.selectedBlockId) || null : null;
  }

  /**
   * Get all blocks
   */
  public getAllBlocks(): BlockHandle[] {
    return Array.from(this.blocks.values());
  }

  /**
   * Clean up and remove the plugin
   */
  public destroy(): void {
    this.disable();
  }
}
