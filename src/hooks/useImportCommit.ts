import { useCallback, useState } from 'react';
import { getApiClient } from '../lib/api/client';
import type {
  ImportPreviewResponse,
  ImportCommitResponse,
  ImportProgress,
  ImportPolicy,
  DrawRowInput,
} from '../lib/schemas';

interface UseImportCommitReturn {
  preview: (rows: DrawRowInput[]) => Promise<ImportPreviewResponse | null>;
  commit: (
    importId: string,
    policy: ImportPolicy,
    onProgress?: ImportProgressCallback
  ) => Promise<ImportCommitResponse | null>;
  isLoading: boolean;
  error: Error | null;
  clearError: () => void;
}

type ImportProgressCallback = (progress: ImportProgress) => void;

export const useImportCommit = (): UseImportCommitReturn => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const clearError = useCallback(() => setError(null), []);

  const preview = useCallback(
    async (rows: DrawRowInput[]): Promise<ImportPreviewResponse | null> => {
      console.log('[useImportCommit] preview called with rows:', rows.length);
      setIsLoading(true);
      setError(null);
      try {
        const client = getApiClient();
        console.log('[useImportCommit] calling client.importPreview');
        const result = await client.importPreview(rows);
        console.log('[useImportCommit] preview result:', result);
        return result;
      } catch (err) {
        console.error('[useImportCommit] preview error:', err);
        const error = err instanceof Error ? err : new Error('Error desconocido en vista previa');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const commit = useCallback(
    async (
      importId: string,
      policy: ImportPolicy,
      onProgress?: ImportProgressCallback
    ): Promise<ImportCommitResponse | null> => {
      console.log('[useImportCommit] commit called with:', { importId, policy });
      setIsLoading(true);
      setError(null);
      try {
        const client = getApiClient();
        // Note: The actual progress polling would be handled at a higher level
        // This hook just calls the commit endpoint
        const options = onProgress ? { onProgress } : undefined;
        const result = await client.importCommit(importId, policy, options);
        console.log('[useImportCommit] commit result:', result);
        return result;
      } catch (err) {
        console.error('[useImportCommit] commit error:', err);
        const errWithResponse = err as { response?: unknown; body?: unknown };
        if (err instanceof Error && 'response' in err) {
          console.error('[useImportCommit] error response:', errWithResponse.response);
        }
        if (err instanceof Error && 'body' in err) {
          console.error('[useImportCommit] error body:', errWithResponse.body);
        }
        const error =
          err instanceof Error ? err : new Error('Error desconocido al confirmar importación');
        setError(error);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
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
