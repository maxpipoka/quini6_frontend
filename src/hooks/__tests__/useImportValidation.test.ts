import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { DrawRowInput } from '@/lib/schemas';
import { useImportValidation } from '../useImportValidation';

function validRow(officialNumber: number): DrawRowInput {
  return {
    officialNumber,
    drawDate: '2024-01-15T20:00:00.000Z',
    results: [
      { modality: 'TRADICIONAL', numbers: [1, 2, 3, 4, 5, 6] },
      { modality: 'LA_SEGUNDA', numbers: [7, 8, 9, 10, 11, 12] },
      { modality: 'REVANCHA', numbers: [13, 14, 15, 16, 17, 18] },
      { modality: 'SIEMPRE_SALE', numbers: [19, 20, 21, 22, 23, 24] },
    ],
  };
}

describe('useImportValidation', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => useImportValidation());

    expect(result.current.validRows).toEqual([]);
    expect(result.current.invalidRows).toEqual([]);
    expect(result.current.rowErrors.size).toBe(0);
  });

  it('separates valid from invalid rows and maps errors by index', () => {
    const { result } = renderHook(() => useImportValidation());

    const invalid = {
      ...validRow(1002),
      officialNumber: -5,
    } as DrawRowInput;

    act(() => {
      result.current.validateRows([validRow(1001), invalid, validRow(1003)]);
    });

    expect(result.current.validRows.map((row) => row.officialNumber)).toEqual([1001, 1003]);
    expect(result.current.invalidRows).toHaveLength(1);
    expect(result.current.invalidRows[0]?.isValid).toBe(false);
    expect(result.current.rowErrors.get(1)?.length).toBeGreaterThan(0);
    expect(result.current.rowErrors.has(0)).toBe(false);
    expect(result.current.rowErrors.has(2)).toBe(false);
  });

  it('reports duplicate numbers within a modality as invalid', () => {
    const { result } = renderHook(() => useImportValidation());

    const duplicated = validRow(1001);
    duplicated.results[0] = { modality: 'TRADICIONAL', numbers: [1, 1, 2, 3, 4, 5] };

    act(() => {
      result.current.validateRows([duplicated]);
    });

    expect(result.current.validRows).toHaveLength(0);
    expect(result.current.invalidRows).toHaveLength(1);
  });

  it('replaces the previous validation result on each run', () => {
    const { result } = renderHook(() => useImportValidation());

    act(() => {
      result.current.validateRows([validRow(1001), validRow(1002)]);
    });
    expect(result.current.validRows).toHaveLength(2);

    act(() => {
      result.current.validateRows([validRow(2000)]);
    });

    expect(result.current.validRows).toHaveLength(1);
    expect(result.current.validRows[0]?.officialNumber).toBe(2000);
  });

  it('clears all validation state', () => {
    const { result } = renderHook(() => useImportValidation());

    act(() => {
      result.current.validateRows([validRow(1001)]);
    });
    expect(result.current.validRows).toHaveLength(1);

    act(() => {
      result.current.clearValidation();
    });

    expect(result.current.validRows).toEqual([]);
    expect(result.current.invalidRows).toEqual([]);
    expect(result.current.rowErrors.size).toBe(0);
  });
});
