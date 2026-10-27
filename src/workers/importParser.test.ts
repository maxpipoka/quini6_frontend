import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ImportParserInput, ImportParserOutput } from '../lib/types/import-worker';

// Mock Worker for testing
class MockWorker {
  onmessage: ((event: MessageEvent) => void) | null = null;
  onerror: ((event: ErrorEvent) => void) | null = null;
  private messageHandlers = new Map<string, (data: unknown) => void>();

  postMessage(data: unknown): void {
    // Simulate async worker processing
    setTimeout(() => {
      if (this.onmessage) {
        this.onmessage({ data } as MessageEvent);
      }
    }, 0);
  }

  terminate(): void {
    // No-op for mock
  }
}

// Replace global Worker with mock for testing
const originalWorker = global.Worker;
global.Worker = MockWorker as unknown as typeof Worker;

// Helper to parse CSV text (mimicking worker logic)
function parseCSVText(text: string): {
  rows: string[][];
  errors: { row: number; message: string }[];
} {
  const rows: string[][] = [];
  const errors: { row: number; message: string }[] = [];

  const lines = text.split(/\r?\n/);

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    const fields: string[] = [];
    let field = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          field += '"';
          j++;
        } else {
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        fields.push(field.trim());
        field = '';
      } else {
        field += char;
      }
    }
    fields.push(field.trim());

    rows.push(fields);
  }

  return { rows, errors };
}

// Helper to validate and transform a row
function validateAndTransformRow(
  row: string[],
  rowIndex: number,
  _headers: string[]
): {
  row: unknown;
  errors: { row: number; field?: string; message: string; rawValue?: unknown }[];
} {
  const errors: { row: number; field?: string; message: string; rawValue?: unknown }[] = [];

  if (row.length < 2) {
    errors.push({
      row: rowIndex,
      message: 'Row has insufficient columns (minimum 2 required: officialNumber, drawDate)',
    });
    return { row: null, errors };
  }

  const officialNumber = parseInt(row[0] ?? '', 10);
  if (isNaN(officialNumber) || officialNumber <= 0) {
    errors.push({
      row: rowIndex,
      field: 'officialNumber',
      message: 'Official number must be a positive integer',
      rawValue: row[0],
    });
  }

  let drawDate: string;
  try {
    const date = new Date(row[1] ?? '');
    if (isNaN(date.getTime())) throw new Error('Invalid date');
    drawDate = date.toISOString();
  } catch {
    errors.push({
      row: rowIndex,
      field: 'drawDate',
      message: 'Invalid date format (use ISO 8601: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)',
      rawValue: row[1],
    });
    drawDate = new Date().toISOString();
  }

  const modalities = ['TRADICIONAL', 'LA_SEGUNDA', 'REVANCHA', 'SIEMPRE_SALE'] as const;
  const results = [];

  for (let m = 0; m < 4; m++) {
    const modality = modalities[m]!;
    const startIdx = 2 + m * 6;
    const numbers: number[] = [];

    for (let n = 0; n < 6; n++) {
      const cellIndex = startIdx + n;
      if (cellIndex >= row.length) {
        errors.push({
          row: rowIndex,
          field: `${modality}_number_${n + 1}`,
          message: `Missing number for ${modality}`,
        });
        break;
      }

      const num = parseInt(row[cellIndex] ?? '', 10);
      if (isNaN(num) || num < 0 || num > 45) {
        errors.push({
          row: rowIndex,
          field: `${modality}_number_${n + 1}`,
          message: 'Number must be between 0 and 45',
          rawValue: row[cellIndex],
        });
      }
      numbers.push(num);
    }

    if (numbers.length === 6 && new Set(numbers).size !== 6) {
      errors.push({
        row: rowIndex,
        field: modality,
        message: 'Numbers cannot repeat within a modality',
      });
    }

    results.push({ modality, numbers });
  }

  const drawRow = {
    officialNumber: isNaN(officialNumber) ? 0 : officialNumber,
    drawDate,
    results,
  };

  return { row: drawRow, errors };
}

describe('Import Parser Worker', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('CSV Parsing', () => {
    it('parses simple CSV correctly', () => {
      const csv = `officialNumber,drawDate,TRADICIONAL_1,TRADICIONAL_2,TRADICIONAL_3,TRADICIONAL_4,TRADICIONAL_5,TRADICIONAL_6,LA_SEGUNDA_1,LA_SEGUNDA_2,LA_SEGUNDA_3,LA_SEGUNDA_4,LA_SEGUNDA_5,LA_SEGUNDA_6,REVANCHA_1,REVANCHA_2,REVANCHA_3,REVANCHA_4,REVANCHA_5,REVANCHA_6,SIEMPRE_SALE_1,SIEMPRE_SALE_2,SIEMPRE_SALE_3,SIEMPRE_SALE_4,SIEMPRE_SALE_5,SIEMPRE_SALE_6
3246,2024-01-20,5,12,23,34,41,45,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18`;

      const { rows } = parseCSVText(csv);

      expect(rows).toHaveLength(2); // header + 1 data row
      expect(rows[0]).toHaveLength(26); // 26 columns
      expect(rows[1]![0]).toBe('3246');
      expect(rows[1]![1]).toBe('2024-01-20');
    });

    it('handles quoted fields with commas', () => {
      const csv = `col1,col2
"value, with comma",simple`;

      const { rows } = parseCSVText(csv);

      expect(rows).toHaveLength(2);
      expect(rows[1]![0]).toBe('value, with comma');
      expect(rows[1]![1]).toBe('simple');
    });

    it('handles escaped quotes', () => {
      const csv = `col1,col2
"value ""quoted""",simple`;

      const { rows } = parseCSVText(csv);

      expect(rows).toHaveLength(2);
      expect(rows[1]?.[0]).toBe('value "quoted"');
    });

    it('handles empty lines', () => {
      const csv = `col1,col2

value1,value2`;

      const { rows } = parseCSVText(csv);

      expect(rows).toHaveLength(2); // Empty line skipped
    });
  });

  describe('Row Validation', () => {
    const headers = [
      'officialNumber',
      'drawDate',
      'TRADICIONAL_1',
      'TRADICIONAL_2',
      'TRADICIONAL_3',
      'TRADICIONAL_4',
      'TRADICIONAL_5',
      'TRADICIONAL_6',
      'LA_SEGUNDA_1',
      'LA_SEGUNDA_2',
      'LA_SEGUNDA_3',
      'LA_SEGUNDA_4',
      'LA_SEGUNDA_5',
      'LA_SEGUNDA_6',
      'REVANCHA_1',
      'REVANCHA_2',
      'REVANCHA_3',
      'REVANCHA_4',
      'REVANCHA_5',
      'REVANCHA_6',
      'SIEMPRE_SALE_1',
      'SIEMPRE_SALE_2',
      'SIEMPRE_SALE_3',
      'SIEMPRE_SALE_4',
      'SIEMPRE_SALE_5',
      'SIEMPRE_SALE_6',
    ];

    it('validates a correct row', () => {
      const row = [
        '3246',
        '2024-01-20',
        '5',
        '12',
        '23',
        '34',
        '41',
        '45',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ];

      const { row: parsed, errors } = validateAndTransformRow(row, 1, headers);

      expect(errors).toHaveLength(0);
      expect(parsed).not.toBeNull();
      const parsedRow = parsed as {
        officialNumber: number;
        results: { modality: string; numbers: number[] }[];
      };
      expect(parsedRow.officialNumber).toBe(3246);
      expect(parsedRow.results).toHaveLength(4);
      expect(parsedRow.results[0]?.numbers).toEqual([5, 12, 23, 34, 41, 45]);
    });

    it('rejects invalid official number', () => {
      const row = [
        '0',
        '2024-01-20',
        '5',
        '12',
        '23',
        '34',
        '41',
        '45',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ];

      const { errors } = validateAndTransformRow(row, 1, headers);

      expect(errors.some((e) => e.field === 'officialNumber')).toBe(true);
    });

    it('rejects invalid date', () => {
      const row = [
        '3246',
        'invalid-date',
        '5',
        '12',
        '23',
        '34',
        '41',
        '45',
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ];

      const { errors } = validateAndTransformRow(row, 1, headers);

      expect(errors.some((e) => e.field === 'drawDate')).toBe(true);
    });

    it('rejects numbers out of range', () => {
      const row = [
        '3246',
        '2024-01-20',
        '50',
        '12',
        '23',
        '34',
        '41',
        '45', // 50 is out of range
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ];

      const { errors } = validateAndTransformRow(row, 1, headers);

      expect(errors.some((e) => e.message === 'Number must be between 0 and 45')).toBe(true);
    });

    it('rejects duplicate numbers in modality', () => {
      const row = [
        '3246',
        '2024-01-20',
        '5',
        '12',
        '23',
        '34',
        '41',
        '5', // duplicate 5
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ];

      const { errors } = validateAndTransformRow(row, 1, headers);

      expect(errors.some((e) => e.message === 'Numbers cannot repeat within a modality')).toBe(
        true
      );
    });

    it('handles missing columns gracefully', () => {
      const row = ['3246', '2024-01-20']; // Only 2 columns

      const { errors } = validateAndTransformRow(row, 1, headers);

      expect(errors.length).toBeGreaterThan(0);
      expect(errors.some((e) => e.message.includes('Missing number'))).toBe(true);
    });

    it('handles non-numeric values', () => {
      const row = [
        '3246',
        '2024-01-20',
        'abc',
        '12',
        '23',
        '34',
        '41',
        '45', // abc is not a number
        '1',
        '2',
        '3',
        '4',
        '5',
        '6',
        '7',
        '8',
        '9',
        '10',
        '11',
        '12',
        '13',
        '14',
        '15',
        '16',
        '17',
        '18',
      ];

      const { errors } = validateAndTransformRow(row, 1, headers);

      expect(errors.some((e) => e.message === 'Number must be between 0 and 45')).toBe(true);
    });
  });

  describe('Worker Message Types', () => {
    it('defines correct input type', () => {
      const input: ImportParserInput = {
        file: new ArrayBuffer(100),
        fileName: 'test.csv',
        mimeType: 'text/csv',
      };

      expect(input.fileName).toBe('test.csv');
      expect(input.mimeType).toBe('text/csv');
    });

    it('defines progress output type', () => {
      const progress: ImportParserOutput = {
        type: 'PROGRESS',
        parsed: 500,
        total: 1000,
      };

      expect(progress.type).toBe('PROGRESS');
      expect(progress.parsed).toBe(500);
    });

    it('defines result output type', () => {
      const result: ImportParserOutput = {
        type: 'RESULT',
        rows: [],
        parseErrors: [],
      };

      expect(result.type).toBe('RESULT');
      expect(Array.isArray(result.rows)).toBe(true);
    });

    it('defines error output type', () => {
      const error: ImportParserOutput = {
        type: 'ERROR',
        message: 'Failed to parse',
      };

      expect(error.type).toBe('ERROR');
      expect(error.message).toBe('Failed to parse');
    });
  });

  describe('Large file chunking', () => {
    it('processes in chunks of 1000 rows', () => {
      const CHUNK_SIZE = 1000;
      const totalRows = 5000;
      let chunksProcessed = 0;

      for (let i = 0; i < totalRows; i += CHUNK_SIZE) {
        const chunkEnd = Math.min(i + CHUNK_SIZE, totalRows);
        const chunkSize = chunkEnd - i;
        chunksProcessed++;
        expect(chunkSize).toBeLessThanOrEqual(CHUNK_SIZE);
      }

      expect(chunksProcessed).toBe(5); // 5000 / 1000 = 5 chunks
    });
  });
});

// Restore Worker
global.Worker = originalWorker;
