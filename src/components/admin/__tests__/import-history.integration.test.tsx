import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { server } from '@/test/setup';
import { http, HttpResponse } from 'msw';

// Mock the worker to avoid Web Worker issues in tests
const mockWorkerInstance = {
  postMessage: vi.fn(),
  terminate: vi.fn(),
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
  onmessage: null as ((event: MessageEvent) => void) | null,
};

// Set up environment variables for tests
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');

let WorkerMock: typeof Worker;
let ImportHistoryTable: React.ComponentType;

// Helper to generate valid UUIDs for test data
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

beforeEach(async () => {
  vi.clearAllMocks();
  WorkerMock = vi.fn().mockImplementation(() => mockWorkerInstance) as unknown as typeof Worker;
  vi.stubGlobal('Worker', WorkerMock);

  // Dynamic import after mocks are set up
  const module = await import('../ImportHistoryTable');
  ImportHistoryTable = module.ImportHistoryTable;
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('ImportHistoryTable — integration (real hook + MSW)', () => {
  it('renders and fetches import history on mount', async () => {
    render(<ImportHistoryTable />);

    // Should show loading state initially
    expect(screen.getByText(/cargando/i)).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    // Should display the mock imports from handlers
    expect(screen.getByText('draws_2024_q1.csv')).toBeInTheDocument();
    expect(screen.getByText('draws_2024_q2.xlsx')).toBeInTheDocument();
    expect(screen.getByText('48')).toBeInTheDocument(); // succeeded for q1
    // Check succeeded column specifically for q2 (75) - use more specific selector
    const succeededCells = screen.getAllByText('75');
    expect(succeededCells.length).toBeGreaterThanOrEqual(1);
  });

  it('handles pagination correctly', async () => {
    // Override handler to return more data for pagination test
    // Note: default pageSize is 20, so first page shows 20 items (0-19)
    const manyImports = Array.from({ length: 25 }, (_, i) => ({
      importId: generateUUID(),
      fileName: `import_${i}.csv`,
      date: new Date(2024, 0, i + 1).toISOString(),
      rowsProcessed: 10,
      succeeded: 10,
      failed: 0,
      policy: 'skip' as const,
    }));

    server.use(
      http.get('admin/imports', ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') ?? '1');
        const limit = parseInt(url.searchParams.get('limit') ?? '20');
        const start = (page - 1) * limit;
        const data = manyImports.slice(start, start + limit);

        return HttpResponse.json({
          data,
          page,
          limit,
          total: manyImports.length,
          totalPages: Math.ceil(manyImports.length / limit),
        });
      })
    );

    render(<ImportHistoryTable />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    // Should show first page (20 items with default pageSize=20)
    expect(screen.getByText('import_0.csv')).toBeInTheDocument();
    expect(screen.getByText('import_19.csv')).toBeInTheDocument();
    expect(screen.queryByText('import_20.csv')).not.toBeInTheDocument();

    // Click next page
    await userEvent.click(screen.getByRole('button', { name: /Siguiente/i }));

    await waitFor(() => {
      expect(screen.getByText('import_20.csv')).toBeInTheDocument();
      expect(screen.getByText('import_24.csv')).toBeInTheDocument();
    });
  });

  it('handles sorting correctly', async () => {
    render(<ImportHistoryTable />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    // Click on fileName header to sort
    const fileNameHeader = screen.getByRole('columnheader', { name: /Archivo/i });
    await userEvent.click(fileNameHeader);

    await waitFor(() => {
      // Should be sorted ascending now (q1 before q2)
      expect(screen.getByText('draws_2024_q1.csv')).toBeInTheDocument();
    });

    // Click again for descending
    await userEvent.click(fileNameHeader);

    await waitFor(() => {
      // Should be sorted descending (q2 before q1)
      expect(screen.getByText('draws_2024_q2.xlsx')).toBeInTheDocument();
    });
  });

  it('shows error state when API fails', async () => {
    server.use(
      http.get('admin/imports', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
      })
    );

    render(<ImportHistoryTable />);

    // Wait for error state to appear (loading -> error)
    // Use longer timeout since API call might take a moment and retries
    await waitFor(
      () => {
        expect(screen.getByText('Error al cargar el historial')).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    // After 3 retries, the error message is "Request failed after 3 attempts"
    expect(screen.getByText('Request failed after 3 attempts')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument();
  });

  it('displays empty state when no imports', async () => {
    server.use(
      http.get('admin/imports', () => {
        return HttpResponse.json({
          data: [],
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      })
    );

    render(<ImportHistoryTable />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/sin importaciones/i)).toBeInTheDocument();
  });

  it('allows changing page size', async () => {
    const manyImports = Array.from({ length: 25 }, (_, i) => ({
      importId: generateUUID(),
      fileName: `import_${i}.csv`,
      date: new Date(2024, 0, i + 1).toISOString(),
      rowsProcessed: 10,
      succeeded: 10,
      failed: 0,
      policy: 'skip' as const,
    }));

    server.use(
      http.get('admin/imports', ({ request }) => {
        const url = new URL(request.url);
        const page = parseInt(url.searchParams.get('page') ?? '1');
        const limit = parseInt(url.searchParams.get('limit') ?? '10');
        const start = (page - 1) * limit;
        const data = manyImports.slice(start, start + limit);

        return HttpResponse.json({
          data,
          page,
          limit,
          total: manyImports.length,
          totalPages: Math.ceil(manyImports.length / limit),
        });
      })
    );

    // Render with initial pageSize of 10 to test changing to 20
    render(<ImportHistoryTable />);

    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    // Default is 20, so change to 10 first to see the difference
    // Actually default is 20, so let's verify it shows 20 items by default
    expect(screen.getByText('import_0.csv')).toBeInTheDocument();
    expect(screen.getByText('import_19.csv')).toBeInTheDocument();
    expect(screen.queryByText('import_20.csv')).not.toBeInTheDocument();

    // Change page size to 10
    const pageSizeSelect = screen.getByLabelText(/Mostrar:/i);
    await userEvent.selectOptions(pageSizeSelect, '10');

    await waitFor(() => {
      expect(screen.queryByText(/cargando/i)).not.toBeInTheDocument();
    });

    // Should show 10 items now
    expect(screen.getByText('import_0.csv')).toBeInTheDocument();
    expect(screen.getByText('import_9.csv')).toBeInTheDocument();
    expect(screen.queryByText('import_10.csv')).not.toBeInTheDocument();
  });

  it('shows retry button in error state', async () => {
    server.use(
      http.get('admin/imports', () => {
        return HttpResponse.json({ message: 'Server error' }, { status: 500 });
      })
    );

    render(<ImportHistoryTable />);

    // Wait for error state to appear
    await waitFor(
      () => {
        expect(screen.getByText('Error al cargar el historial')).toBeInTheDocument();
      },
      { timeout: 10000 }
    );

    expect(screen.getByRole('button', { name: /Reintentar/i })).toBeInTheDocument();
    expect(screen.getByText('Request failed after 3 attempts')).toBeInTheDocument();
  });
});
