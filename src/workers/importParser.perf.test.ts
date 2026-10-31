// @vitest-environment node
/**
 * Performance test for the real bulk-import worker (no duplicated harness).
 * Verifies that a 10k-row CSV is parsed off the main thread, in chunks, within
 * a sane time budget, and that progress notifications arrive incrementally.
 */
import { describe, it, expect, beforeAll, vi } from 'vitest';
import type { ImportParserInput, ImportParserOutput } from '../lib/types/import-worker';

const ROW_COUNT = 10_000;
const CHUNK_SIZE = 1_000;
const TIME_BUDGET_MS = 15_000;

const posted: ImportParserOutput[] = [];

interface WorkerSelf {
  onmessage: ((event: { data: ImportParserInput }) => Promise<void>) | null;
  postMessage: (message: ImportParserOutput) => void;
}

function buildCsv(rowCount: number): string {
  const header = [
    'officialNumber',
    'drawDate',
    ...Array.from({ length: 24 }, (_, index) => `n${index + 1}`),
  ].join(',');

  const lines = [header];
  for (let row = 1; row <= rowCount; row++) {
    const numbers: number[] = [];
    for (let modality = 0; modality < 4; modality++) {
      for (let position = 0; position < 6; position++) {
        numbers.push(((row + modality * 6 + position - 1) % 45) + 1);
      }
    }
    lines.push([String(5000 + row), '2024-01-15', ...numbers.map(String)].join(','));
  }

  return lines.join('\n');
}

beforeAll(async () => {
  const postMessage = (message: ImportParserOutput) => {
    posted.push(message);
  };

  vi.stubGlobal('postMessage', postMessage);
  vi.stubGlobal('self', { onmessage: null, postMessage } as WorkerSelf);

  await import('./importParser');
});

describe('importParser worker — 10k rows', () => {
  it('parses 10k rows in chunks under the time budget', async () => {
    const workerSelf = globalThis.self as unknown as WorkerSelf;
    expect(workerSelf.onmessage).toBeTypeOf('function');

    const csv = buildCsv(ROW_COUNT);
    const buffer = new TextEncoder().encode(csv).buffer;

    posted.length = 0;
    const startedAt = performance.now();
    await workerSelf.onmessage!({
      data: { file: buffer, fileName: 'import-10k.csv', mimeType: 'text/csv' },
    });
    const elapsed = performance.now() - startedAt;

    const progress = posted.filter((message) => message.type === 'PROGRESS');
    const result = posted.find((message) => message.type === 'RESULT');

    expect(result).toBeDefined();
    expect(result?.type === 'RESULT' && result.rows).toHaveLength(ROW_COUNT);
    expect(result?.type === 'RESULT' && result.parseErrors).toHaveLength(0);

    expect(progress).toHaveLength(ROW_COUNT / CHUNK_SIZE);
    const parsedCounts = progress.map((message) =>
      message.type === 'PROGRESS' ? message.parsed : 0
    );
    expect(parsedCounts).toEqual([1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000]);
    expect(
      progress.every((message) => message.type === 'PROGRESS' && message.total === ROW_COUNT)
    ).toBe(true);

    // The final message is always the result, so the UI never sees a dangling progress.
    expect(posted.at(-1)?.type).toBe('RESULT');

    expect(elapsed).toBeLessThan(TIME_BUDGET_MS);
  }, 60_000);

  // eslint-disable-next-line @typescript-eslint/require-await
  it('emits progress before the result for the same run', async () => {
    const resultIndex = posted.findIndex((message) => message.type === 'RESULT');
    const lastProgressIndex = posted.map((message) => message.type).lastIndexOf('PROGRESS');

    expect(resultIndex).toBeGreaterThan(lastProgressIndex);
  });
});
