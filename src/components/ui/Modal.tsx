import React, { useEffect, useRef } from 'react';
import { XIcon } from '../admin/icons';
import './Modal.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
}

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  closeOnBackdrop = true,
  closeOnEscape = true,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const previouslyFocusedRef = useRef<HTMLElement | null>(null);
  const focusableElementsRef = useRef<HTMLElement[]>([]);

  const getFocusableElements = (container: HTMLElement): HTMLElement[] => {
    const selector = [
      'button:not([disabled]):not([tabindex="-1"])',
      '[href]:not([disabled]):not([tabindex="-1"])',
      'input:not([disabled]):not([tabindex="-1"])',
      'select:not([disabled]):not([tabindex="-1"])',
      'textarea:not([disabled]):not([tabindex="-1"])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]:not([tabindex="-1"])',
    ].join(', ');

    return Array.from(container.querySelectorAll<HTMLElement>(selector)).filter(
      (el) => el.offsetParent !== null
    );
  };

  const trapFocus = (event: KeyboardEvent) => {
    if (event.key !== 'Tab') return;

    const firstElement = focusableElementsRef.current[0];
    const lastElement = focusableElementsRef.current[focusableElementsRef.current.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement?.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement?.focus();
      }
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (closeOnEscape && event.key === 'Escape') {
      onClose();
    }
    trapFocus(event);
  };

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (!closeOnBackdrop) return;
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      previouslyFocusedRef.current = document.activeElement as HTMLElement;

      const panel = modalRef.current?.querySelector('[data-modal-panel]');
      if (panel) {
        focusableElementsRef.current = getFocusableElements(panel as HTMLElement);
        const firstFocusable = focusableElementsRef.current[0];
        const closeBtn = modalRef.current?.querySelector(
          '[data-modal-close]'
        ) as HTMLElement | null;
        ((firstFocusable as HTMLElement | null) ?? closeBtn)?.focus();
      }

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
      previouslyFocusedRef.current?.focus();
    };
  }, [isOpen, closeOnEscape]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
  };

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
      tabIndex={-1}
      onKeyDown={(e) => e.key === 'Escape' && closeOnEscape && onClose()}
    >
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-200"
        aria-hidden="true"
        onClick={handleBackdropClick}
      />
      <div
        ref={modalRef}
        className={`relative w-full ${sizeClasses[size]} max-h-[90vh] transform animate-fade-in animate-in animate-zoom-in-95 overflow-hidden rounded-xl bg-white shadow-xl transition-all duration-200 ease-out focus:outline-none dark:bg-neutral-900`}
        data-modal-panel
      >
        {title && (
          <header className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
            <h2
              id="modal-title"
              className="text-lg font-semibold text-neutral-900 dark:text-neutral-100"
            >
              {title}
            </h2>
            <button
              type="button"
              className="rounded-lg p-1 text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 dark:hover:bg-neutral-800"
              aria-label="Cerrar modal"
              data-modal-close
              onClick={onClose}
            >
              <XIcon className="size-5" aria-hidden={true} />
            </button>
          </header>
        )}

        <div className="max-h-[calc(90vh-80px)] overflow-y-auto px-6 py-4" data-modal-content>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
