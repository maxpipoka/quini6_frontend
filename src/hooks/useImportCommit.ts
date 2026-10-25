import { useCallback, useState } from 'react';
import { getApiClient } from '../lib/api/client';
import type { ImportPreviewResponse, ImportCommitResponse, ImportProgress, ImportPolicy } from '../lib/schemas';

interface UseImportCommitReturn {
  preview: (rows: any[]) => Promise<ImportPreviewResponse | null>;
  commit: (importId: string, policy: ImportPolicy, onProgress?: ImportProgressCallback) => Promise<ImportCommitResponse | null>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
}

type ImportProgressCallback = (progress: ImportProgress) => void;

export const useImportCommit = (): UseImportCommitReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const client = getApiClient();

  const clearError = useCallback(() => setError(null), []);

  const preview = useCallback(
    async (rows: any[]): Promise<ImportPreviewResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await client.importPreview(rows);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido en vista previa');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  const commit = useCallback(
    async (
      importId: string,
      policy: ImportPolicy,
      onProgress?: ImportProgressCallback
    ): Promise<ImportCommitResponse | null> => {
      setIsLoading(true);
      setError(null);
      try {
        // Note: The actual progress polling would be handled at a higher level
        // This hook just calls the commit endpoint
        const options = onProgress ? { onProgress } : undefined;
        const result = await client.importCommit(importId, policy, options);
        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error('Error desconocido al confirmar importación');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [client]
  );

  return {
    preview,
    commit,
    isLoading,
    error,
    clearError,
  };
};

export default useImportCommit;