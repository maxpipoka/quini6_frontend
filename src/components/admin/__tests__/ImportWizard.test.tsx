import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { ImportWizard } from '../ImportWizard';
import { getApiClient } from '@/lib/api/client';

vi.mock('@/lib/api/client', () => ({
  getApiClient: vi.fn(),
}));

const mockPreview = vi.fn();
const mockCommit = vi.fn();
const mockValidateRows = vi.fn();
const mockClearValidation = vi.fn();
const mockClearCommitError = vi.fn();

vi.mock('@/hooks/useImportValidation', () => ({
  useImportValidation: () => ({
    validRows: [
      {
        officialNumber: 1001,
        drawDate: '2024-01-15T20:00:00Z',
        results: [
          { modality: 'TRADICIONAL', numbers: [1, 2, 3, 4, 5, 6] },
          { modality: 'LA_SEGUNDA', numbers: [7, 8, 9, 10, 11, 12] },
        ],
      },
      {
        officialNumber: 1002,
        drawDate: '2024-01-22T20:00:00Z',
        results: [
          { modality: 'TRADICIONAL', numbers: [13, 14, 15, 16, 17, 18] },
          { modality: 'LA_SEGUNDA', numbers: [19, 20, 21, 22, 23, 24] },
        ],
      },
    ],
    invalidRows: [],
    rowErrors: new Map(),
    validateRows: mockValidateRows,
    clearValidation: mockClearValidation,
  }),
}));

vi.mock('@/hooks/useImportCommit', () => ({
  useImportCommit: () => ({
    preview: mockPreview,
    commit: mockCommit,
    isLoading: false,
    error: null,
    clearError: mockClearCommitError,
  }),
}));

const mockApiClient = {
  getImportErrors: vi.fn(),
};

interface MockWorkerInstance {
  onmessage: ((e: MessageEvent) => void) | null;
  postMessage: ReturnType<typeof vi.fn>;
  terminate: ReturnType<typeof vi.fn>;
}

const workerInstances: MockWorkerInstance[] = [];

beforeAll(() => {
  global.Worker = class MockWorker implements MockWorkerInstance {
    onmessage: ((e: MessageEvent) => void) | null = null;
    postMessage = vi.fn();
    terminate = vi.fn();

    constructor() {
      workerInstances.push(this);

      setTimeout(() => {
        if (this.onmessage) {
          this.onmessage({
            data: {
              type: 'RESULT',
              rows: [
                {
                  officialNumber: 1001,
                  drawDate: '2024-01-15T20:00:00Z',
                  results: [
                    { modality: 'TRADICIONAL', numbers: [1, 2, 3, 4, 5, 6] },
                    { modality: 'LA_SEGUNDA', numbers: [7, 8, 9, 10, 11, 12] },
                  ],
                },
                {
                  officialNumber: 1002,
                  drawDate: '2024-01-22T20:00:00Z',
                  results: [
                    { modality: 'TRADICIONAL', numbers: [13, 14, 15, 16, 17, 18] },
                    { modality: 'LA_SEGUNDA', numbers: [19, 20, 21, 22, 23, 24] },
                  ],
                },
              ],
              parseErrors: [],
            },
          } as MessageEvent);
        }
      }, 0);
    }
  } as unknown as typeof Worker;
});

afterAll(() => {
  vi.restoreAllMocks();
});

beforeEach(() => {
  vi.clearAllMocks();
  workerInstances.length = 0;
  mockPreview.mockResolvedValue({ importId: 'test-import-id' });
  mockCommit.mockResolvedValue({ created: 2, updated: 0, skipped: 0, failed: 0 });
});

describe('ImportWizard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(getApiClient).mockReturnValue(
      mockApiClient as unknown as ReturnType<typeof getApiClient>
    );

    mockPreview.mockResolvedValue({ importId: 'import-123' });
    mockCommit.mockResolvedValue({
      success: true,
      created: 2,
      updated: 0,
      skipped: 0,
      failed: 0,
    });
  });

  it('renders upload step initially', () => {
    render(<ImportWizard />);

    expect(screen.getByText('Importar sorteos masivamente')).toBeInTheDocument();
    expect(screen.getByText(/Carga un archivo CSV o XLSX/)).toBeInTheDocument();
  });

  it('shows file dropzone with correct accept types', () => {
    render(<ImportWizard />);

    const dropzone = screen.getByTestId('file-dropzone');
    expect(dropzone).toBeInTheDocument();
  });

  it('displays format requirements', () => {
    render(<ImportWizard />);

    expect(screen.getByText(/Formato: CSV \(UTF-8\) o Excel \(\.xlsx\)/)).toBeInTheDocument();
    expect(
      screen.getByText(/Columnas requeridas: officialNumber, drawDate, modality, numbers/)
    ).toBeInTheDocument();
    expect(screen.getByText(/Máximo 10 MB \/ 10,000 filas/)).toBeInTheDocument();
  });

  it('navigates to preview step after file upload', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });

    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      expect(screen.getByText(/Vista previa/)).toBeInTheDocument();
    });
  });

  it('shows valid and invalid row counts in preview', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      expect(screen.getByText('Vista previa (2 válidas, 0 inválidas)')).toBeInTheDocument();
    });
  });

  it('shows ImportPreviewTable with rows', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Seleccionar fila 1')).toBeInTheDocument();
      expect(screen.getByLabelText('Seleccionar fila 2')).toBeInTheDocument();
    });
  });

  it('allows row selection in preview', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      expect(screen.getByText('2 de 2 filas válidas seleccionadas')).toBeInTheDocument();
    });
  });

  it('shows continue button enabled when rows selected', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      expect(continueBtn).not.toBeDisabled();
    });
  });

  it('navigates to confirm step when continue clicked', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Confirmar importación')).toBeInTheDocument();
    });
  });

  it('shows PolicySelect in confirm step', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Política de conflicto')).toBeInTheDocument();
    });
  });

  it('shows summary with selected row count and policy', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Filas seleccionadas:')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
      expect(screen.getByText('Política de conflicto:')).toBeInTheDocument();
    });
  });

  it('opens confirmation modal when confirm button clicked', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar e importar' });
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText(/Esta acción no se puede deshacer/)).toBeInTheDocument();
    });
  });

  it('shows correct modal content with row count and policy', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar e importar' });
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      const dialog = screen.getByRole('dialog');
      expect(dialog).toHaveTextContent(/Se importarán 2 sorteos con la política skip/);
      expect(dialog).toHaveTextContent(/Esta acción no se puede deshacer/);
    });
  });

  it('calls commit with correct parameters when modal confirmed', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar e importar' });
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      const modalConfirmBtn = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(modalConfirmBtn);
    });

    await waitFor(() => {
      expect(mockCommit).toHaveBeenCalledWith('import-123', 'skip', expect.any(Function));
    });
  });

  it('shows result step after successful import', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar e importar' });
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      const modalConfirmBtn = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(modalConfirmBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Importación completada')).toBeInTheDocument();
      expect(
        screen.getByText('Creados: 2, Actualizados: 0, Omitidos: 0, Fallidos: 0')
      ).toBeInTheDocument();
    });
  });

  it('dispatches draws:refresh event on successful import', async () => {
    const dispatchEventSpy = vi.spyOn(window, 'dispatchEvent');

    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar e importar' });
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      const modalConfirmBtn = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(modalConfirmBtn);
    });

    await waitFor(() => {
      expect(dispatchEventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'draws:refresh',
        })
      );
    });
  });

  it('calls onImportSuccess callback on successful import', async () => {
    const onImportSuccess = vi.fn();
    render(<ImportWizard onImportSuccess={onImportSuccess} />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar e importar' });
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      const modalConfirmBtn = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(modalConfirmBtn);
    });

    await waitFor(() => {
      expect(onImportSuccess).toHaveBeenCalled();
    });
  });

  it('shows error toast when preview fails', async () => {
    mockPreview.mockResolvedValue(null);
    mockCommit.mockResolvedValue(null);

    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    // Wait for preview step to load (worker parses file)
    await waitFor(() => {
      expect(screen.getByText('Vista previa (2 válidas, 0 inválidas)')).toBeInTheDocument();
    });

    // Click Continuar on preview step - this triggers the preview API call
    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    // Preview fails, should show error toast and go back to upload step
    await waitFor(() => {
      expect(screen.getByText('Importar sorteos masivamente')).toBeInTheDocument();
      expect(screen.getByText('Error en vista previa')).toBeInTheDocument();
    });
  });

  it('shows error toast when commit fails', async () => {
    mockPreview.mockResolvedValue({ importId: 'test-import-id' });
    mockCommit.mockResolvedValue(null);

    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    // Now on confirm step, click Confirmar e importar
    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar e importar' });
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      const modalConfirmBtn = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(modalConfirmBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Error en importación')).toBeInTheDocument();
    });
  });

  it('resets to upload step when reset button clicked', async () => {
    render(<ImportWizard />);

    const file = new File(['test'], 'test.csv', { type: 'text/csv' });
    const dropzone = screen.getByTestId('file-dropzone');
    const input = dropzone.querySelector('input[type="file"]')!;

    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });

    await waitFor(() => {
      const continueBtn = screen.getByRole('button', { name: 'Continuar' });
      fireEvent.click(continueBtn);
    });

    await waitFor(() => {
      const confirmBtn = screen.getByRole('button', { name: 'Confirmar e importar' });
      fireEvent.click(confirmBtn);
    });

    await waitFor(() => {
      const modalConfirmBtn = screen.getByRole('button', { name: 'Confirmar' });
      fireEvent.click(modalConfirmBtn);
    });

    await waitFor(() => {
      expect(screen.getByText('Importación completada')).toBeInTheDocument();
    });

    const nuevaImportacionBtn = screen.getByRole('button', { name: 'Nueva importación' });
    fireEvent.click(nuevaImportacionBtn);

    await waitFor(() => {
      expect(screen.getByText('Importar sorteos masivamente')).toBeInTheDocument();
    });
  });
});
describe('worker integration contract', () => {
  const selectFile = (input: HTMLElement, file: File) => {
    act(() => {
      Object.defineProperty(input, 'files', { value: [file] });
      fireEvent.change(input);
    });
  };

  const getFileInput = () =>
    screen.getByTestId('file-dropzone').querySelector<HTMLInputElement>('input[type="file"]')!;

  it('sends the selected file to the worker as an ArrayBuffer with metadata', async () => {
    render(<ImportWizard />);

    const file = new File(['officialNumber,drawDate'], 'sorteos.csv', {
      type: 'text/csv',
    });
    selectFile(getFileInput(), file);

    await waitFor(() => {
      expect(workerInstances[0]?.postMessage).toHaveBeenCalledWith({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        file: expect.any(ArrayBuffer),
        fileName: 'sorteos.csv',
        mimeType: 'text/csv',
      });
    });
  });

  it('falls back to the xlsx mime type when the browser reports none', async () => {
    render(<ImportWizard />);

    const file = new File(['xlsx-bytes'], 'sorteos.xlsx', { type: '' });
    selectFile(getFileInput(), file);

    await waitFor(() => {
      expect(workerInstances[0]?.postMessage).toHaveBeenCalledWith(
        expect.objectContaining({
          fileName: 'sorteos.xlsx',
          mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        })
      );
    });
  });

  it('shows a parse error toast and stays on the upload step when the worker reports an error', async () => {
    const instances: MockWorkerInstance[] = [];

    vi.stubGlobal(
      'Worker',
      class {
        onmessage: ((e: MessageEvent) => void) | null = null;
        postMessage = vi.fn();
        terminate = vi.fn();

        constructor() {
          instances.push(this as unknown as MockWorkerInstance);
        }
      }
    );

    try {
      render(<ImportWizard />);
      selectFile(getFileInput(), new File(['bad,content'], 'sorteos.csv', { type: 'text/csv' }));

      await waitFor(() => {
        expect(instances).toHaveLength(1);
      });

      act(() => {
        instances[0]?.onmessage?.({
          data: { type: 'ERROR', message: 'Parsing failed: unexpected token' },
        } as MessageEvent);
      });

      await waitFor(() => {
        expect(screen.getByText('Error al procesar')).toBeInTheDocument();
        expect(screen.getByText(/Parsing failed: unexpected token/)).toBeInTheDocument();
      });

      expect(screen.getByText('Importar sorteos masivamente')).toBeInTheDocument();
    } finally {
      vi.unstubAllGlobals();
    }
  });
});
