/**
 * Focus Trap Utility
 * Extracted from Modal.astro for reuse in Header mobile menu and other overlays
 * Framework-agnostic vanilla TypeScript
 */

export interface FocusTrapOptions {
  /** The container element to trap focus within */
  container: HTMLElement;
  /** Called when Escape key is pressed while trap is active */
  onEscape?: () => void;
  /** Called when the trap is deactivated (optional cleanup) */
  onClose?: () => void;
}

/**
 * Returns all focusable elements within a container
 * Matches the selector from Modal.astro
 * Filters out elements that are not visually focusable (display: none, visibility: hidden)
 */
export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'button:not([disabled]):not([tabindex="-1"])',
    '[href]:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]:not([tabindex="-1"])',
  ].join(', ');

  const elements = Array.from(container.querySelectorAll<HTMLElement>(selector));

  // Filter out elements that are not visually focusable
  // In production: check offsetParent !== null
  // In test environments (jsdom): offsetParent is always null, so check computed style
  const isTestEnv = document.body?.offsetParent === null;

  return elements.filter((el) => {
    if (isTestEnv) {
      const style = window.getComputedStyle(el);
      return style.display !== 'none' && style.visibility !== 'hidden';
    }
    return el.offsetParent !== null;
  });
}

/**
 * Traps focus within the given container
 * Cycles Tab/Shift+Tab within the container
 * Calls onEscape callback on Escape key
 * Returns a cleanup function to restore focus and remove listeners
 */
export function trapFocus(options: FocusTrapOptions): () => void {
  const { container, onEscape, onClose } = options;
  let previouslyFocusedElement: HTMLElement | null = null;
  let focusableElements: HTMLElement[] = [];

  function updateFocusableElements(): void {
    focusableElements = getFocusableElements(container);
  }

  function handleKeydown(event: KeyboardEvent): void {
    // Handle Escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Handle Tab cycling
    if (event.key !== 'Tab') return;

    updateFocusableElements();

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    if (event.shiftKey) {
      // Shift+Tab: moving backwards
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      // Tab: moving forwards
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  }

  function initialize(): void {
    // Store previously focused element
    previouslyFocusedElement = document.activeElement as HTMLElement;

    // Get initial focusable elements
    updateFocusableElements();

    // Focus first focusable element
    const firstFocusable = focusableElements[0];
    firstFocusable?.focus();

    // Add event listeners
    document.addEventListener('keydown', handleKeydown);
  }

  function cleanup(): void {
    document.removeEventListener('keydown', handleKeydown);

    // Return focus to previously focused element
    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
    focusableElements = [];

    onClose?.();
  }

  // Initialize immediately
  initialize();

  // Return cleanup function
  return cleanup;
}

/**
 * Restores focus to the provided element
 * No-ops if element is null
 */
export function restoreFocus(element: HTMLElement | null): void {
  element?.focus();
}