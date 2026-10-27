import React, { useEffect, useState } from 'react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  requestId?: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  'aria-live'?: 'polite' | 'assertive';
}

const Toast: React.FC<ToastProps> = ({
  type,
  title,
  message,
  requestId,
  duration = 5000,
  action,
  onClose,
  'aria-live': ariaLive = 'polite',
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 200);
      }, duration);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [duration, onClose]);

  if (!isVisible) return null;

  const typeConfig = {
    success: {
      icon: (
        <svg
          className="size-5 text-success-600 dark:text-success-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bg: 'bg-success-50 dark:bg-success-900/20',
      border: 'border-success-200 dark:border-success-800',
      text: 'text-success-800 dark:text-success-200',
      titleText: 'text-success-900 dark:text-success-100',
      ariaLabel: 'Éxito',
    },
    error: {
      icon: (
        <svg
          className="size-5 text-error-600 dark:text-error-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-7a1 1 0 10-2 0v4a1 1 0 102 0V11zm1-9a1 1 0 100 2 1 1 0 000-2z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bg: 'bg-error-50 dark:bg-error-900/20',
      border: 'border-error-200 dark:border-error-800',
      text: 'text-error-800 dark:text-error-200',
      titleText: 'text-error-900 dark:text-error-100',
      ariaLabel: 'Error',
    },
    warning: {
      icon: (
        <svg
          className="size-5 text-warning-600 dark:text-warning-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bg: 'bg-warning-50 dark:bg-warning-900/20',
      border: 'border-warning-200 dark:border-warning-800',
      text: 'text-warning-800 dark:text-warning-200',
      titleText: 'text-warning-900 dark:text-warning-100',
      ariaLabel: 'Advertencia',
    },
    info: {
      icon: (
        <svg
          className="size-5 text-info-600 dark:text-info-400"
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
            clipRule="evenodd"
          />
        </svg>
      ),
      bg: 'bg-info-50 dark:bg-info-900/20',
      border: 'border-info-200 dark:border-info-800',
      text: 'text-info-800 dark:text-info-200',
      titleText: 'text-info-900 dark:text-info-100',
      ariaLabel: 'Información',
    },
  };

  const config = typeConfig[type];

  return (
    <div
      className={`
        flex items-start gap-3 rounded-lg border p-4 shadow-lg
        ${config.bg} ${config.border} ${config.text}
        slide-in-from-top-2 fade-in min-w-[300px] max-w-md
        animate-in duration-300
        ${duration === 0 ? '' : 'animate-out duration-200'}
      `}
      role="alert"
      aria-live={ariaLive}
      aria-label={config.ariaLabel}
      data-toast
      data-duration={duration}
    >
      <div className="mt-0.5 flex-shrink-0" aria-hidden="true">
        {config.icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className={`font-semibold ${config.titleText} ${message ? 'mb-1' : ''}`}>{title}</p>

        {message && <p className="text-sm opacity-90">{message}</p>}

        {requestId && (
          <details className="mt-2" data-request-id>
            <summary className="text-current/60 cursor-pointer select-none font-mono text-xs hover:text-current">
              Request ID: {requestId}
            </summary>
            <pre className="bg-neutral-900/50 dark:bg-neutral-100/50 text-current/80 mt-1 overflow-x-auto rounded p-2 font-mono text-xs">
              {requestId}
            </pre>
          </details>
        )}
      </div>

      <div className="flex flex-shrink-0 items-start gap-2">
        {action && (
          <button
            className="text-sm font-medium underline hover:no-underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
            onClick={action.onClick}
          >
            {action.label}
          </button>
        )}
        <button
          className="text-current/60 hover:text-current focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current"
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 200);
          }}
          aria-label="Cerrar"
        >
          <svg
            className="size-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes slide-in-from-top-2 {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes fade-out {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        .slide-in-from-top-2 { animation: slide-in-from-top-2 300ms ease-out; }
        .fade-in { animation: fade-in 300ms ease-out; }
        .animate-out { animation: fade-out 200ms ease-in forwards; }

        @media (prefers-reduced-motion: reduce) {
          .slide-in-from-top-2, .fade-in, .animate-out { animation: none; }
        }

        @media (forced-colors: active) {
          [data-toast] {
            forced-color-adjust: none;
            border-color: CanvasText;
            background-color: Canvas;
            color: CanvasText;
          }
          [data-toast] svg { stroke: CanvasText; }
          [data-toast] summary { color: CanvasText; }
          [data-toast] pre { background-color: Canvas; border: 1px solid CanvasText; }
        }
      `}</style>
    </div>
  );
};

export default Toast;
