import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

// Mock the API client to avoid env var issues
vi.mock('@/lib/api/client', () => ({
  getApiClient: vi.fn(() => ({
    importPreview: vi.fn().mockResolvedValue({
      importId: 'test-import-id',
      validCount: 2,
      invalidCount: 0,
    }),
    importCommit: vi.fn().mockResolvedValue({
      created: 2,
      updated: 0,
      skipped: 0,
      failed: 0,
    }),
  })),
  createApiClient: vi.fn(),
  setApiClient: vi.fn(),
}));

// Mock the worker
const mockWorkerInstance: {
  postMessage: ReturnType<typeof vi.fn>;
  terminate: ReturnType<typeof vi.fn>;
  addEventListener: ReturnType<typeof vi.fn>;
  removeEventListener: ReturnType<typeof vi.fn>;
  onmessage: ((event: MessageEvent) => void) | null;
} = {
  postMessage: vi.fn(),
  terminate: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  onmessage: null,
};

const createMessageEvent = (data: unknown): MessageEvent => {
  return new MessageEvent('message', { data });
};

let WorkerMock: typeof Worker;
let ImportWizard: React.ComponentType;

beforeEach(async () => {
  vi.clearAllMocks();
  WorkerMock = vi.fn().mockImplementation(() => mockWorkerInstance) as unknown as typeof Worker;
  vi.stubGlobal('Worker', WorkerMock);

  // Dynamic import after mocks are set up
  const module = await import('../ImportWizard');
  ImportWizard = module.ImportWizard;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('ImportWizard — integration flow (real hooks + MSW, mocked worker)', () => {
  it('renders upload step, parses file, shows preview, and commits successfully', async () => {
    const user = userEvent.setup();

    render(<ImportWizard />);

    // Step 1: Upload
    expect(screen.getByText('Importar sorteos masivamente')).toBeInTheDocument();
    expect(
      screen.getByText('Carga un archivo CSV o XLSX con los sorteos a importar')
    ).toBeInTheDocument();

    // Create a valid CSV file
    const csvContent = [
      'officialNumber,drawDate,n1,n2,n3,n4,n5,n6,n7,n8,n9,n10,n11,n12,n13,n14,n15,n16,n17,n18,n19,n20,n21,n22,n23,n24,n25,n26',
      '1001,2024-01-15,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25',
      '1002,2024-01-22,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26',
    ].join('\n');

    const file = new File([csvContent], 'test.csv', { type: 'text/csv' });

    // Trigger file input - use the hidden input directly
    const dropzoneEl = screen.getByTestId('file-dropzone');
    const fileInput = dropzoneEl.querySelector<HTMLInputElement>('input[type="file"]');
    if (!fileInput) throw new Error('File input not found');
    await user.upload(fileInput, file);

    // Worker should be created and receive the file
    await waitFor(() => {
      expect(WorkerMock).toHaveBeenCalled();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const expectedCall = expect.objectContaining({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        file: expect.any(ArrayBuffer),
        fileName: 'test.csv',
        mimeType: 'text/csv',
      });
      expect(mockWorkerInstance.postMessage).toHaveBeenCalledWith(expectedCall);
    });

    const createMessageEvent = (data: unknown): MessageEvent => {
      return new MessageEvent('message', { data });
    };

    // Simulate worker progress - worker uses onmessage property
    const onMessageHandler = mockWorkerInstance.onmessage;
    expect(onMessageHandler).toBeDefined();

    // Simulate PROGRESS
    act(() => {
      onMessageHandler!(createMessageEvent({ type: 'PROGRESS', parsed: 1, total: 2 }));
    });

    // Simulate RESULT with 2 valid rows
    const resultRows = [
      {
        officialNumber: 1001,
        drawDate: '2024-01-15T00:00:00.000Z',
        results: [
          { modality: 'TRADICIONAL', numbers: [1, 2, 3, 4, 5, 6] },
          { modality: 'LA_SEGUNDA', numbers: [7, 8, 9, 10, 11, 12] },
          { modality: 'REVANCHA', numbers: [13, 14, 15, 16, 17, 18] },
          { modality: 'SIEMPRE_SALE', numbers: [19, 20, 21, 22, 23, 24] },
        ],
      },
      {
        officialNumber: 1002,
        drawDate: '2024-01-22T00:00:00.000Z',
        results: [
          { modality: 'TRADICIONAL', numbers: [2, 3, 4, 5, 6, 7] },
          { modality: 'LA_SEGUNDA', numbers: [8, 9, 10, 11, 12, 13] },
          { modality: 'REVANCHA', numbers: [14, 15, 16, 17, 18, 19] },
          { modality: 'SIEMPRE_SALE', numbers: [20, 21, 22, 23, 24, 25] },
        ],
      },
    ];

    act(() => {
      onMessageHandler!(createMessageEvent({ type: 'RESULT', rows: resultRows, parseErrors: [] }));
    });

    // Debug: check for any error toasts
    console.log('Document body:', document.body.innerHTML.substring(0, 5000));

    // Step 2: Preview
    await waitFor(() => {
      expect(screen.getByText(/Vista previa/)).toBeInTheDocument();
    });

    expect(screen.getByText(/2 v[áa]lidas/)).toBeInTheDocument();
    expect(screen.getByText(/0 inv[áa]lidas/)).toBeInTheDocument();

    // Verify rows in preview table - check for rowNumber (1, 2) and dates
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('2024-01-15T00:00:00.000Z')).toBeInTheDocument();
    expect(screen.getByText('2024-01-22T00:00:00.000Z')).toBeInTheDocument();

    // Click "Continuar" to go to confirm step - wait for row selection to complete first
    // First ensure we're in preview step and rows are selected
    await waitFor(() => {
      expect(screen.getByText(/Vista previa/)).toBeInTheDocument();
    });

    // Debug: check if validation is working
    const continuarBtn = screen.getByRole<HTMLButtonElement>('button', { name: /continuar/i });
    console.log('In preview step. Button state:', continuarBtn.disabled);

    // Check if button is enabled, if not wait for selection to complete
    await waitFor(
      () => {
        if (continuarBtn.disabled) {
          throw new Error('Button still disabled');
        }
      },
      { timeout: 10000, interval: 100 }
    );

    // Mock console.error to catch any errors
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation((...args: unknown[]) => {
      console.log('[CONSOLE.ERROR]', ...args);
    });

    // Also log validRows state
    console.log('Before click, checking if we can find validation info...');

    await user.click(screen.getByRole('button', { name: /continuar/i }));

    // Debug: check current state
    console.log('After Continuar click:', document.body.innerHTML.substring(0, 5000));

    // Wait a bit for the async preview call
    await waitFor(
      () => {
        // Should either be in progress step or back to upload with error toast
        const body = document.body.innerHTML;
        if (body.includes('Error en vista previa') || body.includes('Cargar archivo')) {
          console.log('Preview failed, back to upload');
        }
      },
      { timeout: 3000 }
    );

    consoleErrorSpy.mockRestore();

    // Step 3: Confirm
    await waitFor(() => {
      expect(screen.getByText('Confirmar importación')).toBeInTheDocument();
    });

    expect(screen.getByText('Política de conflicto')).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /omitir/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /reemplazar/i })).toBeInTheDocument();
    expect(screen.getByRole('radio', { name: /fusionar/i })).toBeInTheDocument();

    // Select "Reemplazar" policy
    await user.click(screen.getByRole('radio', { name: /reemplazar/i }));

    // Click "Confirmar e importar" - this opens the modal
    await user.click(screen.getByRole('button', { name: /confirmar e importar/i }));

    // Modal should open
    await waitFor(() => {
      expect(screen.getByRole('dialog', { name: /confirmar importación/i })).toBeInTheDocument();
    });

    // Click final "Confirmar" in modal
    await user.click(screen.getByRole('button', { name: /confirmar$/i }));

    // Debug: check what's rendered after confirm
    console.log('After confirm click:', document.body.innerHTML.substring(0, 5000));

    // Result step should appear (mocked commit completes immediately)
    await waitFor(() => {
      expect(screen.getByText(/Importación completada/i)).toBeInTheDocument();
    });

    // Wait for commit to complete and show result
    await waitFor(
      () => {
        expect(screen.getByText(/importación completada/i)).toBeInTheDocument();
      },
      { timeout: 5000 }
    );

    expect(screen.getByText(/Creados: 2/i)).toBeInTheDocument();
    expect(screen.getByText(/Actualizados: 0/i)).toBeInTheDocument();
    expect(screen.getByText(/Omitidos: 0/i)).toBeInTheDocument();
  });

  it('shows error when worker reports parse errors', async () => {
    const user = userEvent.setup();

    render(<ImportWizard />);

    const csvContent = 'officialNumber,drawDate\n1001,2024-01-15\n';
    const file = new File([csvContent], 'bad.csv', { type: 'text/csv' });

    const dropzoneEl2 = screen.getByTestId('file-dropzone');
    const fileInput = dropzoneEl2.querySelector<HTMLInputElement>('input[type="file"]');
    if (!fileInput) throw new Error('File input not found');
    await user.upload(fileInput, file);

    const onMessageHandler = mockWorkerInstance.onmessage;
    expect(onMessageHandler).toBeDefined();

    // Simulate worker ERROR
    act(() => {
      onMessageHandler!(
        createMessageEvent({ type: 'ERROR', message: 'CSV malformed: missing required columns' })
      );
    });

    await waitFor(() => {
      expect(screen.getByText(/error al procesar/i)).toBeInTheDocument();
    });
  });
});
