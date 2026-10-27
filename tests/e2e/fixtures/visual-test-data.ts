// Deterministic test data for visual regression and Storybook stories
// All values are fixed - no timestamps, random IDs, or dynamic content

import type { ImportPreviewRow } from '@/components/admin/ImportPreviewTable';
import type { ImportProgressStage } from '@/lib/schemas';

export const sampleImportRows: ImportPreviewRow[] = [
  { rowNumber: 1, date: '2024-01-15', modality: 'TRADICIONAL', tradicional: [5, 12, 23, 34, 41, 45], laSegunda: [7, 14, 21, 28, 35, 42], revancha: [3, 10, 17, 24, 31, 38], siempreSale: [1, 8, 15, 22, 29, 36], reintegro: 7, isValid: true, errors: [] },
  { rowNumber: 2, date: '2024-01-22', modality: 'TRADICIONAL', tradicional: [2, 18, 29, 31, 38, 44], laSegunda: [4, 11, 18, 25, 32, 39], revancha: [6, 13, 20, 27, 34, 41], siempreSale: [2, 9, 16, 23, 30, 37], reintegro: 4, isValid: true, errors: [] },
  { rowNumber: 3, date: '2024-01-29', modality: 'TRADICIONAL', tradicional: [11, 20, 25, 33, 40, 42], laSegunda: [5, 12, 19, 26, 33, 40], revancha: [7, 14, 21, 28, 35, 42], siempreSale: [3, 10, 17, 24, 31, 38], reintegro: 2, isValid: true, errors: [] },
  { rowNumber: 4, date: '2024-02-05', modality: 'TRADICIONAL', tradicional: [8, 14, 27, 30, 36, 43], laSegunda: [6, 13, 20, 27, 34, 41], revancha: [2, 9, 16, 23, 30, 37], siempreSale: [4, 11, 18, 25, 32, 39], reintegro: 6, isValid: false, errors: [{ rowNumber: 4, field: 'date', message: 'Duplicate draw date', rawValue: '2024-02-05' }] },
  { rowNumber: 5, date: '2024-02-12', modality: 'TRADICIONAL', tradicional: [3, 17, 24, 32, 39, 46], laSegunda: [8, 15, 22, 29, 36, 43], revancha: [4, 11, 18, 25, 32, 39], siempreSale: [6, 13, 20, 27, 34, 41], reintegro: 8, isValid: true, errors: [] },
];

export const largeImportRows: ImportPreviewRow[] = [
  ...sampleImportRows,
  { rowNumber: 6, date: '2024-02-19', modality: 'TRADICIONAL', tradicional: [6, 13, 26, 35, 37, 47], laSegunda: [1, 8, 15, 22, 29, 36], revancha: [5, 12, 19, 26, 33, 40], siempreSale: [7, 14, 21, 28, 35, 42], reintegro: 1, isValid: true, errors: [] },
  { rowNumber: 7, date: '2024-02-26', modality: 'TRADICIONAL', tradicional: [9, 16, 28, 34, 44, 48], laSegunda: [3, 10, 17, 24, 31, 38], revancha: [7, 14, 21, 28, 35, 42], siempreSale: [1, 8, 15, 22, 29, 36], reintegro: 3, isValid: true, errors: [] },
];

export const sampleHistoryData = [
  { importId: '11111111-1111-4111-8111-111111111111', fileName: 'draws-jan.csv', date: '2024-01-20T10:00:00Z', rowsProcessed: 10, succeeded: 10, failed: 0, policy: 'skip' as const },
  { importId: '22222222-2222-4222-8222-222222222222', fileName: 'draws-feb.csv', date: '2024-02-15T14:30:00Z', rowsProcessed: 15, succeeded: 12, failed: 3, policy: 'replace' as const },
  { importId: '33333333-3333-4333-8333-333333333333', fileName: 'draws-mar.csv', date: '2024-03-10T09:15:00Z', rowsProcessed: 8, succeeded: 8, failed: 0, policy: 'merge' as const },
  { importId: '44444444-4444-4444-8444-444444444444', fileName: 'draws-apr.csv', date: '2024-04-05T16:45:00Z', rowsProcessed: 20, succeeded: 18, failed: 2, policy: 'skip' as const },
  { importId: '55555555-5555-4555-8555-555555555555', fileName: 'draws-may.csv', date: '2024-05-01T11:20:00Z', rowsProcessed: 12, succeeded: 12, failed: 0, policy: 'replace' as const },
];

export const largeHistoryData = [
  ...sampleHistoryData,
  { importId: '66666666-6666-4666-8666-666666666666', fileName: 'draws-jun.csv', date: '2024-06-15T10:00:00Z', rowsProcessed: 10, succeeded: 9, failed: 1, policy: 'skip' as const },
  { importId: '77777777-7777-4777-8777-777777777777', fileName: 'draws-jul.csv', date: '2024-07-20T14:30:00Z', rowsProcessed: 15, succeeded: 15, failed: 0, policy: 'merge' as const },
  { importId: '88888888-8888-4888-8888-888888888888', fileName: 'draws-aug.csv', date: '2024-08-10T09:15:00Z', rowsProcessed: 8, succeeded: 7, failed: 1, policy: 'skip' as const },
  { importId: '99999999-9999-4999-8999-999999999999', fileName: 'draws-sep.csv', date: '2024-09-05T16:45:00Z', rowsProcessed: 20, succeeded: 20, failed: 0, policy: 'replace' as const },
  { importId: 'aaaaaaaa-aaaa-4aaa-aaaa-aaaaaaaaaaaa', fileName: 'draws-oct.csv', date: '2024-10-01T11:20:00Z', rowsProcessed: 12, succeeded: 10, failed: 2, policy: 'skip' as const },
  { importId: 'bbbbbbbb-bbbb-4bbb-bbbb-bbbbbbbbbbbb', fileName: 'draws-nov.csv', date: '2024-11-15T10:00:00Z', rowsProcessed: 10, succeeded: 10, failed: 0, policy: 'merge' as const },
  { importId: 'cccccccc-cccc-4ccc-cccc-cccccccccccc', fileName: 'draws-dec.csv', date: '2024-12-20T14:30:00Z', rowsProcessed: 15, succeeded: 14, failed: 1, policy: 'skip' as const },
];

export const sampleProps = {
  FileDropzone: {
    default: { accept: '.csv,.xlsx', maxSize: 1048576 },
    hover: { accept: '.csv,.xlsx', maxSize: 1048576 },
    focus: { accept: '.csv,.xlsx', maxSize: 1048576 },
    error: { accept: '.csv,.xlsx', maxSize: 1048576 },
    loading: { accept: '.csv,.xlsx', maxSize: 1048576 },
    disabled: { accept: '.csv,.xlsx', maxSize: 1048576, disabled: true },
  },
  ImportPreviewTable: {
    default: { rows: sampleImportRows },
    empty: { rows: [] },
    error: { rows: sampleImportRows }, // row with error is in sampleImportRows[3]
    loading: { rows: [], isLoading: true },
  },
  ImportHistoryTable: {
    default: {}, // Uses internal hook - no props
    empty: {}, // Uses internal hook - no props
    loading: {}, // Uses internal hook - no props
    pagination: {}, // Uses internal hook - no props
  },
  ImportProgress: {
    default: { importId: '11111111-1111-4111-8111-111111111111', stage: 'processing' as ImportProgressStage, progress: 0 },
    inProgress: { importId: '22222222-2222-4222-8222-222222222222', stage: 'processing' as ImportProgressStage, progress: 45 },
    success: { importId: '33333333-3333-4333-8333-333333333333', stage: 'completed' as ImportProgressStage, progress: 100 },
    error: { importId: '44444444-4444-4444-8444-444444444444', stage: 'processing' as ImportProgressStage, progress: 67 },
  },
  Progress: {
    default: { value: 0, stage: 'processing' as const },
    partial: { value: 50, stage: 'processing' as const },
    complete: { value: 100, stage: 'completed' as const },
    indeterminate: { value: undefined, stage: 'processing' as const },
    error: { value: 30, stage: 'error' as const },
  },
};

export const viewports = [
  { name: 'desktop', width: 1280, height: 720 },
  { name: 'mobile', width: 375, height: 667 },
];

export const components = [
  { name: 'FileDropzone', states: ['default', 'hover', 'focus', 'error', 'loading', 'disabled'] },
  { name: 'ImportPreviewTable', states: ['default', 'empty', 'error', 'loading'] },
  { name: 'ImportHistoryTable', states: ['default', 'empty', 'loading', 'pagination'] },
  { name: 'ImportProgress', states: ['default', 'inProgress', 'success', 'error'] },
  { name: 'Progress', states: ['default', 'partial', 'complete', 'indeterminate', 'error'] },
];