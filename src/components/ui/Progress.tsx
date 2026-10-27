import React, { useEffect, useRef, useState } from 'react';

type ProgressStage = 'processing' | 'committing' | 'completed' | 'error';

interface ProgressProps {
  value?: number;
  stage?: ProgressStage;
  label?: string;
  showPercentage?: boolean;
  'aria-live'?: 'polite' | 'assertive';
  className?: string;
}

const stageLabels: Record<ProgressStage, string> = {
  processing: 'Procesando archivo...',
  committing: 'Guardando sorteos...',
  completed: 'Completado',
  error: 'Error',
};

const stageColors: Record<ProgressStage, string> = {
  processing: 'bg-primary-600',
  committing: 'bg-blue-600',
  completed: 'bg-success-600',
  error: 'bg-error-600',
};

export const Progress: React.FC<ProgressProps> = ({
  value,
  stage = 'processing',
  label,
  showPercentage = true,
  'aria-live': ariaLive = 'polite',
  className = '',
}) => {
  const progressIdRef = useRef(`progress-${Math.random().toString(36).slice(2, 9)}`);
  const [isIndeterminate, setIsIndeterminate] = useState(value === undefined);

  useEffect(() => {
    setIsIndeterminate(value === undefined);
  }, [value]);

  const currentLabel = label || stageLabels[stage];
  const currentColor = stageColors[stage];
  const percentage = isIndeterminate
    ? ''
    : `${Math.round(Math.max(0, Math.min(100, value || 0)))}%`;

  const indeterminateStyle: React.CSSProperties = {
    animation: 'indeterminate 1.5s infinite ease-in-out',
  };

  return (
    <div
      id={progressIdRef.current}
      className={`w-full ${className}`}
      role="progressbar"
      aria-valuenow={
        isIndeterminate ? undefined : Math.round(Math.max(0, Math.min(100, value || 0)))
      }
      aria-valuemin={0}
      aria-valuemax={100}
      aria-live={ariaLive}
      aria-label={currentLabel}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span
          className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          id={`${progressIdRef.current}-label`}
        >
          {currentLabel}
        </span>
        {showPercentage && !isIndeterminate && (
          <span
            className="font-mono text-sm text-neutral-500 dark:text-neutral-400"
            id={`${progressIdRef.current}-percentage`}
          >
            {percentage}
          </span>
        )}
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
        {isIndeterminate ? (
          <div
            className={`${currentColor} h-full w-1/4`}
            style={indeterminateStyle}
            aria-hidden={true}
          />
        ) : (
          <div
            id={`${progressIdRef.current}-bar`}
            className={`${currentColor} h-full transition-all duration-300 ease-out`}
            style={{ width: percentage }}
            role="presentation"
          />
        )}
      </div>

      {label && (
        <p
          className="mt-1 text-xs text-neutral-500 dark:text-neutral-400"
          id={`${progressIdRef.current}-detail`}
        >
          {label}
        </p>
      )}

      <style>{`
        @keyframes indeterminate {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(400%);
          }
        }

        @media (forced-colors: active) {
          .progress-container > div:last-child {
            forced-color-adjust: none;
            background-color: Canvas;
            border: 1px solid CanvasText;
          }
          .progress-bar,
          .animate-pulse {
            forced-color-adjust: none;
            background-color: Highlight;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .progress-bar {
            transition: none;
          }
          .animate-pulse {
            animation: none;
            width: 50%;
          }
        }
      `}</style>
    </div>
  );
};

export default Progress;
