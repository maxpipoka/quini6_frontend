/**
 * Focus Trap Utility
 * Extracted from Modal.astro for reuse in Header mobile menu and other overlays
 * Framework-agnostic vanilla JavaScript
 */

export const FocusTrapOptions = {
  /** The container element to trap focus within */
  container: null,
  /** Called when Escape key is pressed while trap is active */
  onEscape: undefined,
  /** Called when the trap is deactivated (optional cleanup) */
  onClose: undefined,
};

/**
 * Returns all focusable elements within a container
 * Matches the selector from Modal.astro
 * Filters out elements that are not visually focusable (display: none, visibility: hidden)
 */
export function getFocusableElements(container) {
  const selector = [
    'button:not([disabled]):not([tabindex="-1"])',
    '[href]:not([disabled]):not([tabindex="-1"])',
    'input:not([disabled]):not([tabindex="-1"])',
    'select:not([disabled]):not([tabindex="-1"])',
    'textarea:not([disabled]):not([tabindex="-1"])',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]:not([tabindex="-1"])',
  ].join(', ');

  const elements = Array.from(container.querySelectorAll(selector));

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
export function trapFocus(options) {
  const { container, onEscape, onClose } = options;
  let previouslyFocusedElement = null;
  let focusableElements = [];

  function updateFocusableElements() {
    focusableElements = getFocusableElements(container);
  }

  function handleKeydown(event) {
    // Handle Escape key
    if (event.key === 'Escape' && onEscape) {
      event.preventDefault();
      onEscape();
      return;
    }

    // Handle Tab cycling - ALWAYS prevent default and manually manage focus
    if (event.key !== 'Tab') return;

    updateFocusableElements();

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (!firstElement || !lastElement) return;

    // Always prevent default to keep focus in container
    event.preventDefault();

    if (event.shiftKey) {
      // Shift+Tab: moving backwards
      const currentIndex = focusableElements.indexOf(document.activeElement);
      if (currentIndex <= 0) {
        // At first element or not in list - focus last

        lastElement.focus();
      } else {
        // Focus previous

        focusableElements[currentIndex - 1].focus();
      }
    } else {
      // Tab: moving forwards
      const currentIndex = focusableElements.indexOf(document.activeElement);
      if (currentIndex === -1 || currentIndex === focusableElements.length - 1) {
        // Not in list or at last element - focus first

        firstElement.focus();
      } else {
        // Focus next

        focusableElements[currentIndex + 1].focus();
      }
    }
  }

  function initialize() {
    // Store previously focused element
    previouslyFocusedElement = document.activeElement;

    // Get initial focusable elements
    updateFocusableElements();

    // Focus first focusable element
    const firstFocusable = focusableElements[0];
    firstFocusable?.focus();

    // Add event listeners
    document.addEventListener('keydown', handleKeydown);
  }

  function cleanup() {
    document.removeEventListener('keydown', handleKeydown);

    // Return focus to previously focused element
    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
    focusableElements = [];

    if (onClose) onClose();
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
export function restoreFocus(element) {
  element?.focus();
}
