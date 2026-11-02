import React, { useEffect, useRef, useState } from 'react';
import { Progress } from '../ui/Progress';
import { SpinnerIcon, CheckIcon, ErrorIcon } from './icons';

import type { ImportProgressStage } from '../../lib/schemas';

interface Props {
  importId: string;
  stage: ImportProgressStage;
  progress: number;
  onComplete?: (success: boolean) => void;
  onError?: (error: Error) => void;
  pollInterval?: number;
}

export const ImportProgress: React.FC<Props> = ({
  importId,
  stage,
  progress,
  onComplete,
  onError,
  pollInterval = 2000,
}) => {
  const [currentStage, setCurrentStage] = useState(stage);
  const [currentProgress, setCurrentProgress] = useState(progress);
  const [_isPolling, setIsPolling] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const pollTimerRef = useRef<number | null>(null);
  const progressRef = useRef({ currentStage, currentProgress });
  const onCompleteRef = useRef(onComplete);
  const onErrorRef = useRef(onError);

  // Keep refs updated
  progressRef.current = { currentStage, currentProgress };
  onCompleteRef.current = onComplete;
  onErrorRef.current = onError;

  const stageLabels: Record<ImportProgressStage, string> = {
    processing: 'Procesando archivo...',
    committing: 'Guardando sorteos...',
    completed: 'Completado',
  };

  const pollStatus = () => {
    try {
      // Progress advances optimistically: there is no status endpoint yet.
      // Functional update avoids the stale-closure freeze of the old counter.
      setCurrentProgress((previous) => Math.min(100, previous + 10));
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Error al consultar progreso');
      setError(error);
      setCurrentStage('processing'); // Keep processing on error
      onErrorRef.current?.(error);
    }
  };

  const startPolling = () => {
    if (pollInterval <= 0) return;
    setIsPolling(true);
    pollTimerRef.current = window.setInterval(pollStatus, pollInterval);
  };

  const stopPolling = () => {
    setIsPolling(false);
    if (pollTimerRef.current) {
      clearInterval(pollTimerRef.current);
      pollTimerRef.current = null;
    }
  };

  useEffect(() => {
    if (currentProgress < 100) return;

    setCurrentStage('completed');
    stopPolling();
    onCompleteRef.current?.(true);
  }, [currentProgress]);

  useEffect(() => {
    if (stage === 'completed') {
      stopPolling();
      onCompleteRef.current?.(true);
    } else if (stage === 'processing' || stage === 'committing') {
      startPolling();
    }
  }, [stage]);

  useEffect(() => {
    return () => stopPolling();
  }, []);

  const isCompleted = currentStage === 'completed';
  const isError = !!error;

  return (
    <div className="space-y-4" role="status" aria-live="polite">
      <div className="flex items-center gap-3">
        {isCompleted ? (
          <CheckIcon className="size-6 text-success-600 dark:text-success-400" aria-hidden={true} />
        ) : isError ? (
          <ErrorIcon className="size-6 text-error-600 dark:text-error-400" aria-hidden={true} />
        ) : (
          <SpinnerIcon
            className="size-6 text-primary-600 dark:text-primary-400"
            aria-hidden={true}
          />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-medium text-neutral-900 dark:text-neutral-100">
            {isCompleted
              ? 'Importación completada'
              : isError
                ? 'Error en la importación'
                : stageLabels[currentStage]}
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            ID: <code className="font-mono">{importId.slice(0, 8)}...</code>
          </p>
        </div>
      </div>

      <Progress
        value={isCompleted ? 100 : currentProgress}
        stage={currentStage}
        label={isCompleted ? '' : `${currentProgress}%`}
        showPercentage={!isCompleted}
      />

      {isError && (
        <div className="text-sm text-error-600 dark:text-error-400" role="alert">
          {error?.message || 'Error desconocido'}
        </div>
      )}
    </div>
  );
};

export default ImportProgress;
