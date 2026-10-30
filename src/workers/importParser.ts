/**
 * Web Worker for parsing CSV/XLSX files for bulk import
 * Runs off the main thread to keep UI responsive
 */

// Types for worker messages
interface ParseInput {
  file: ArrayBuffer;
  fileName: string;
  mimeType: string;
}

interface ParseOutputProgress {
  type: 'PROGRESS';
  parsed: number;
  total: number;
}

interface ParseOutputResult {
  type: 'RESULT';
  rows: DrawRowInput[];
  parseErrors: ParseError[];
}

interface ParseOutputError {
  type: 'ERROR';
  message: string;
}

type WorkerOutput = ParseOutputProgress | ParseOutputResult | ParseOutputError;

interface DrawRowInput {
  officialNumber: number;
  drawDate: string; // ISO datetime string
  results: {
    modality: 'TRADICIONAL' | 'LA_SEGUNDA' | 'REVANCHA' | 'SIEMPRE_SALE';
    numbers: number[];
  }[];
}

interface ParseError {
  row: number;
  field?: string | undefined;
  message: string;
  rawValue?: unknown;
}

// Helper to post messages
function postMessage(message: WorkerOutput): void {
  self.postMessage(message);
}

// CSV parsing with PapaParse-like logic (native implementation)
function parseCSV(text: string): { rows: string[][]; errors: ParseError[] } {
  const rows: string[][] = [];
  const errors: ParseError[] = [];

  // Simple CSV parser - handles quoted fields, commas in quotes
  const lines = text.split(/\r?\n/);

  for (const lineRaw of lines) {
    const line = lineRaw?.trim() ?? '';
    if (!line) continue;

    const fields: string[] = [];
    let field = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const nextChar = line[j + 1] ?? '';

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          field += '"';
          j++; // Skip next quote
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
    fields.push(field.trim()); // Last field

    rows.push(fields);
  }

  return { rows, errors };
}

// Parse XLSX using SheetJS (dynamically imported)
async function parseXLSX(buffer: ArrayBuffer): Promise<{ rows: string[][]; errors: ParseError[] }> {
  const errors: ParseError[] = [];

  try {
    // Dynamic import for XLSX - only loaded when needed
    const XLSXModule = await import('xlsx');
    const XLSX = XLSXModule.default ?? XLSXModule;
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0] ?? '';
    const worksheet = workbook.Sheets[sheetName];

    if (!worksheet) {
      errors.push({
        row: 0,
        message: 'No worksheet found in XLSX file',
      });
      return { rows: [], errors };
    }

    // Convert to array of arrays
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false });

    return { rows: jsonData as string[][], errors };
  } catch (error) {
    errors.push({
      row: 0,
      message: `Failed to parse XLSX: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
    return { rows: [], errors };
  }
}

// Validate and transform a parsed row to DrawRowInput
function validateAndTransformRow(
  row: string[],
  rowIndex: number,
  _headers: string[]
): { row: DrawRowInput | null; errors: ParseError[] } {
  const errors: ParseError[] = [];

  // Expected columns: officialNumber, drawDate, and 4 modalities with 6 numbers each
  // Format: officialNumber, drawDate, modality1_num1, modality1_num2, ..., modality4_num6
  // Or: officialNumber, drawDate, modality1_nums, modality2_nums, modality3_nums, modality4_nums
  // where modality_nums is "1,2,3,4,5,6"

  if (row.length < 2) {
    errors.push({
      row: rowIndex,
      message: 'Row has insufficient columns (minimum 2 required: officialNumber, drawDate)',
    });
    return { row: null, errors };
  }

  // Parse official number
  const officialNumber = parseInt(row[0] ?? '', 10);
  if (isNaN(officialNumber) || officialNumber <= 0) {
    errors.push({
      row: rowIndex,
      field: 'officialNumber',
      message: 'Official number must be a positive integer',
      rawValue: row[0] ?? '',
    });
  }

  // Parse draw date
  let drawDate: string;
  const drawDateRaw = row[1] ?? '';
  try {
    const date = new Date(drawDateRaw);
    if (isNaN(date.getTime())) {
      throw new Error('Invalid date');
    }
    drawDate = date.toISOString();
  } catch {
    errors.push({
      row: rowIndex,
      field: 'drawDate',
      message: 'Invalid date format (use ISO 8601: YYYY-MM-DD or YYYY-MM-DDTHH:mm:ss)',
      rawValue: drawDateRaw,
    });
    drawDate = new Date().toISOString(); // Fallback
  }

  // Parse modalities - expect 4 modalities with 6 numbers each
  const modalities: ('TRADICIONAL' | 'LA_SEGUNDA' | 'REVANCHA' | 'SIEMPRE_SALE')[] = [
    'TRADICIONAL',
    'LA_SEGUNDA',
    'REVANCHA',
    'SIEMPRE_SALE',
  ];
  const results: DrawRowInput['results'] = [];

  for (let m = 0; m < 4; m++) {
    const modality = modalities[m]!;
    const startIdx = 2 + m * 6;
    const numbers: number[] = [];

    // Check if we have 6 numbers for this modality
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

      const cellValue = row[cellIndex] ?? '';
      const num = parseInt(cellValue, 10);
      if (isNaN(num) || num < 0 || num > 45) {
        errors.push({
          row: rowIndex,
          field: `${modality}_number_${n + 1}`,
          message: 'Number must be between 0 and 45',
          rawValue: cellValue,
        });
      }
      numbers.push(num);
    }

    // Check for duplicates within modality
    if (numbers.length === 6 && new Set(numbers).size !== 6) {
      errors.push({
        row: rowIndex,
        field: modality,
        message: 'Numbers cannot repeat within a modality',
      });
    }

    results.push({ modality: modality, numbers });
  }

  // If we have errors, still return the row but mark it as invalid
  const drawRow: DrawRowInput = {
    officialNumber: isNaN(officialNumber) ? 0 : officialNumber,
    drawDate,
    results,
  };

  return { row: drawRow, errors };
}

// Main worker message handler
self.onmessage = async (event: MessageEvent<ParseInput>) => {
  const data = event.data;
  if (!data) return;
  const { file, fileName, mimeType } = data;

  try {
    let text = '';
    let rows: string[][] = [];
    const allErrors: ParseError[] = [];

    if (mimeType === 'text/csv' || fileName.endsWith('.csv')) {
      // Parse CSV
      const decoder = new TextDecoder('utf-8');
      text = decoder.decode(file);
      const parsed = parseCSV(text);
      rows = parsed.rows;
      allErrors.push(...parsed.errors);
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileName.endsWith('.xlsx')
    ) {
      // Parse XLSX
      const parsed = await parseXLSX(file);
      rows = parsed.rows;
      allErrors.push(...parsed.errors);
    } else {
      postMessage({
        type: 'ERROR',
        message: 'Unsupported file type. Only CSV and XLSX are supported.',
      } as ParseOutputError);
      return;
    }

    if (rows.length === 0) {
      postMessage({
        type: 'RESULT',
        rows: [],
        parseErrors: [{ row: 0, message: 'File is empty or has no data rows' }],
      } as ParseOutputResult);
      return;
    }

    // First row is headers
    const headers = rows[0] ?? [];
    const dataRows = rows.slice(1);

    const validRows: DrawRowInput[] = [];
    const parseErrors: ParseError[] = [...allErrors];

    // Process in chunks for large files
    const CHUNK_SIZE = 1000;
    for (let i = 0; i < dataRows.length; i += CHUNK_SIZE) {
      const chunk = dataRows.slice(i, i + CHUNK_SIZE);

      for (let j = 0; j < chunk.length; j++) {
        const rowIndex = i + j + 1; // +1 for header row
        const currentRow = chunk[j] ?? [];
        const { row, errors } = validateAndTransformRow(currentRow, rowIndex, headers);
        parseErrors.push(...errors);
        if (row) {
          validRows.push(row);
        }
      }

      // Report progress
      postMessage({
        type: 'PROGRESS',
        parsed: Math.min(i + CHUNK_SIZE, dataRows.length),
        total: dataRows.length,
      } as ParseOutputProgress);
    }

    postMessage({
      type: 'RESULT',
      rows: validRows,
      parseErrors,
    } as ParseOutputResult);
  } catch (error) {
    postMessage({
      type: 'ERROR',
      message: `Parsing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
    } as ParseOutputError);
  }
};

// Export for TypeScript (not used at runtime)
export {};
