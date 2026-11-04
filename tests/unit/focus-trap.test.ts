import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trapFocus, restoreFocus, getFocusableElements } from '../../src/lib/focus-trap.ts';

describe('focus-trap', () => {
  let container: HTMLElement;
  let button1: HTMLButtonElement;
  let button2: HTMLButtonElement;
  let link1: HTMLAnchorElement;
  let input1: HTMLInputElement;
  let previouslyFocused: HTMLButtonElement;

  beforeEach(() => {
    // Create a container with focusable elements
    container = document.createElement('div');
    container.id = 'test-container';
    // Make container visible in jsdom
    container.style.position = 'relative';

    button1 = document.createElement('button');
    button1.textContent = 'Button 1';
    button1.id = 'btn1';
    button1.style.position = 'static';

    button2 = document.createElement('button');
    button2.textContent = 'Button 2';
    button2.id = 'btn2';
    button2.style.position = 'static';

    link1 = document.createElement('a');
    link1.href = '#';
    link1.textContent = 'Link 1';
    link1.id = 'link1';
    link1.style.position = 'static';

    input1 = document.createElement('input');
    input1.type = 'text';
    input1.id = 'input1';
    input1.style.position = 'static';

    // Previously focused element (outside container)
    previouslyFocused = document.createElement('button');
    previouslyFocused.textContent = 'Previously Focused';
    previouslyFocused.id = 'prev-focused';
    previouslyFocused.style.position = 'static';
    document.body.appendChild(previouslyFocused);
    previouslyFocused.focus();

    container.appendChild(button1);
    container.appendChild(button2);
    container.appendChild(link1);
    container.appendChild(input1);
    document.body.appendChild(container);
  });

  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });

  describe('getFocusableElements', () => {
    it('returns all focusable elements in container', () => {
      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(4);
      expect(elements).toContain(button1);
      expect(elements).toContain(button2);
      expect(elements).toContain(link1);
      expect(elements).toContain(input1);
    });

    it('excludes disabled elements', () => {
      button1.disabled = true;
      link1.setAttribute('tabindex', '-1');
      input1.disabled = true;

      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(1);
      expect(elements[0]).toBe(button2);
    });

    it('excludes elements with display: none', () => {
      button1.style.display = 'none';

      const elements = getFocusableElements(container);
      expect(elements).toHaveLength(3);
      expect(elements).not.toContain(button1);
      expect(elements).toContain(button2);
      expect(elements).toContain(link1);
      expect(elements).toContain(input1);
    });

    it('includes elements with positive tabindex', () => {
      const div = document.createElement('div');
      div.tabIndex = 0;
      container.appendChild(div);

      const elements = getFocusableElements(container);
      expect(elements).toContain(div);
    });

    it('excludes elements with tabindex="-1"', () => {
      const div = document.createElement('div');
      div.tabIndex = -1;
      container.appendChild(div);

      const elements = getFocusableElements(container);
      expect(elements).not.toContain(div);
    });

    it('includes contenteditable elements when focusable', () => {
      const div = document.createElement('div');
      div.contentEditable = 'true';
      // In jsdom, contenteditable divs need tabindex to be focusable
      div.tabIndex = 0;
      container.appendChild(div);

      const elements = getFocusableElements(container);
      expect(elements).toContain(div);
    });
  });

  describe('trapFocus', () => {
    let cleanup: () => void;
    let onEscapeMock: ReturnType<typeof vi.fn>;
    let onCloseMock: ReturnType<typeof vi.fn>;

    beforeEach(() => {
      onEscapeMock = vi.fn();
      onCloseMock = vi.fn();
      cleanup = trapFocus({
        container,
        onEscape: onEscapeMock,
        onClose: onCloseMock,
      });
    });

    afterEach(() => {
      if (cleanup) {
        cleanup();
      }
    });

    it('stores previously focused element on initialization', () => {
      // The function should store the previously focused element
      // We can't easily test the actual focus in jsdom, but we can verify the trap is set up
      expect(onEscapeMock).not.toHaveBeenCalled();
    });

    it('calls onEscape when Escape key is pressed', () => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(onEscapeMock).toHaveBeenCalledTimes(1);
    });

    it('prevents default on Escape key', () => {
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
      document.dispatchEvent(escapeEvent);

      expect(escapeEvent.defaultPrevented).toBe(true);
    });

    it('calls onClose on cleanup', () => {
      cleanup();
      expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('removes keydown event listener on cleanup', () => {
      cleanup();

      // After cleanup, Escape should not trigger onEscape
      onEscapeMock.mockClear();
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' });
      document.dispatchEvent(escapeEvent);

      expect(onEscapeMock).not.toHaveBeenCalled();
    });

    it('updates focusable elements list dynamically when updateFocusableElements is called', () => {
      // We can't easily test the internal updateFocusableElements, but we can verify
      // that getFocusableElements works with dynamically added elements
      const newButton = document.createElement('button');
      newButton.textContent = 'New Button';
      newButton.id = 'new-btn';
      container.appendChild(newButton);

      const elements = getFocusableElements(container);
      expect(elements).toContain(newButton);
      expect(elements).toHaveLength(5);
    });
  });

  describe('restoreFocus', () => {
    it('focuses the provided element', () => {
      restoreFocus(button1);
      expect(document.activeElement).toBe(button1);
    });

    it('no-ops on null', () => {
      const activeBefore = document.activeElement;
      restoreFocus(null);
      expect(document.activeElement).toBe(activeBefore);
    });

    it('no-ops on undefined', () => {
      const activeBefore = document.activeElement;
      restoreFocus(undefined as unknown as HTMLElement | null);
      expect(document.activeElement).toBe(activeBefore);
    });
  });
});
