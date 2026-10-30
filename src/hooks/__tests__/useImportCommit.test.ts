import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import type { DrawRowInput, ImportCommitResponse, ImportPreviewResponse } from '@/lib/schemas';

vi.mock('@/lib/api/client', () => ({
  getApiClient: vi.fn(),
}));

import { getApiClient } from '@/lib/api/client';
import { useImportCommit } from '../useImportCommit';

const previewResponse: ImportPreviewResponse = {
  importId: '3f2b8c1e-5a4d-4f6e-8b7a-1c2d3e4f5a6b',
  validCount: 2,
  invalidCount: 0,
};

const commitResponse: ImportCommitResponse = {
  created: 2,
  updated: 0,
  skipped: 0,
  failed: 0,
  errors: [],
};

const rows: DrawRowInput[] = [
  {
    officialNumber: 1001,
    drawDate: '2024-01-15T20:00:00.000Z',
    results: [
      { modality: 'TRADICIONAL', numbers: [1, 2, 3, 4, 5, 6] },
      { modality: 'LA_SEGUNDA', numbers: [7, 8, 9, 10, 11, 12] },
      { modality: 'REVANCHA', numbers: [13, 14, 15, 16, 17, 18] },
      { modality: 'SIEMPRE_SALE', numbers: [19, 20, 21, 22, 23, 24] },
    ],
  },
];

const importPreview = vi.fn();
const importCommit = vi.fn();
const mockClient = { importPreview, importCommit };

const setup = () => renderHook(() => useImportCommit());

describe('useImportCommit', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getApiClient).mockReturnValue(
      mockClient as unknown as ReturnType<typeof getApiClient>
    );
  });

  it('returns the preview response on success', async () => {
    importPreview.mockResolvedValue(previewResponse);
    const { result } = setup();

    let value: ImportPreviewResponse | null = null;
    await act(async () => {
      value = await result.current.preview(rows);
    });

    expect(importPreview).toHaveBeenCalledWith(rows);
    expect(value).toEqual(previewResponse);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('returns null and exposes the error when preview rejects', async () => {
    importPreview.mockRejectedValue(new Error('preview boom'));
    const { result } = setup();

    let value: ImportPreviewResponse | null = previewResponse;
    await act(async () => {
      value = await result.current.preview(rows);
    });

    expect(value).toBeNull();
    expect(result.current.error?.message).toBe('preview boom');
    expect(result.current.isLoading).toBe(false);
  });

  it('wraps non-Error preview rejections in a descriptive error', async () => {
    importPreview.mockRejectedValue('nope');
    const { result } = setup();

    await act(async () => {
      await result.current.preview(rows);
    });

    expect(result.current.error?.message).toBe('Error desconocido en vista previa');
  });

  it('flags loading while preview is in flight', async () => {
    let resolvePreview!: (value: ImportPreviewResponse) => void;
    importPreview.mockReturnValue(
      new Promise<ImportPreviewResponse>((resolve) => {
        resolvePreview = resolve;
      })
    );

    const { result } = setup();
    act(() => {
      void result.current.preview(rows);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(true));

    act(() => {
      resolvePreview(previewResponse);
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
  });

  it('commits with the given import id, policy and progress callback', async () => {
    importCommit.mockResolvedValue(commitResponse);
    const { result } = setup();
    const onProgress = vi.fn();

    let value: ImportCommitResponse | null = null;
    await act(async () => {
      value = await result.current.commit(previewResponse.importId, 'replace', onProgress);
    });

    expect(importCommit).toHaveBeenCalledWith(previewResponse.importId, 'replace', {
      onProgress,
    });
    expect(value).toEqual(commitResponse);
  });

  it('omits options when no progress callback is provided', async () => {
    importCommit.mockResolvedValue(commitResponse);
    const { result } = setup();

    await act(async () => {
      await result.current.commit(previewResponse.importId, 'skip');
    });

    expect(importCommit).toHaveBeenCalledWith(previewResponse.importId, 'skip', undefined);
  });

  it('returns null and exposes the error when commit rejects', async () => {
    importCommit.mockRejectedValue(new Error('commit boom'));
    const { result } = setup();

    let value: ImportCommitResponse | null = commitResponse;
    await act(async () => {
      value = await result.current.commit(previewResponse.importId, 'merge');
    });

    expect(value).toBeNull();
    expect(result.current.error?.message).toBe('commit boom');
  });

  it('wraps non-Error commit rejections in a descriptive error', async () => {
    importCommit.mockRejectedValue(42);
    const { result } = setup();

    await act(async () => {
      await result.current.commit(previewResponse.importId, 'skip');
    });

    expect(result.current.error?.message).toBe('Error desconocido al confirmar importación');
  });

  it('clears the error', async () => {
    importCommit.mockRejectedValue(new Error('commit boom'));
    const { result } = setup();

    await act(async () => {
      await result.current.commit(previewResponse.importId, 'skip');
    });
    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
