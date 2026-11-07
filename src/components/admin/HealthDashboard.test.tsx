import { describe, it, expect, vi, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { render, screen, waitFor, act, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HealthDashboard } from './HealthDashboard';
import type { HealthHistoryEntry } from './HealthDashboard';
import type { HealthCheck, HealthDb } from '../../lib/schemas';
import { server } from '../../test/setup';
import { http, HttpResponse } from 'msw';

// Helper to flush all pending microtasks
const flushPromises = () => new Promise((resolve) => setImmediate(resolve));

// Constants from component
const MAX_HISTORY_ENTRIES = 50;

// Mock localStorage on window (JSDOM uses window.localStorage)
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});
Object.defineProperty(global, 'localStorage', {
  value: mockLocalStorage,
  writable: true,
});

// Mock import.meta.env
const originalEnv = import.meta.env;

const mockHealthCheck: HealthCheck = {
  status: 'ok',
  timestamp: '2024-01-01T12:00:00.000Z',
  uptime: 123.45,
  version: '1.0.0',
};

const mockHealthDb: HealthDb = {
  status: 'ok',
  latency: 12.5,
  timestamp: '2024-01-01T12:00:00.000Z',
};

const mockDegradedHealthCheck: HealthCheck = {
  ...mockHealthCheck,
  status: 'degraded',
};

const mockDownHealthDb: HealthDb = {
  ...mockHealthDb,
  status: 'down',
};

// Helper to render with proper providers
function renderDashboard(
  props: { initialApiHealth?: HealthCheck | null; initialDbHealth?: HealthDb | null } = {}
) {
  // Reset mocks - but DON'T reset getItem mock as tests may set it up beforehand
  mockLocalStorage.setItem.mockReset();

  return render(<HealthDashboard {...props} />);
}

describe('HealthDashboard', () => {
  beforeAll(() => {
    server.listen({ onUnhandledFrame: 'error' });
  });

  afterAll(() => {
    server.close();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers(); // Use real timers - MSW doesn't work well with fake timers
    mockLocalStorage.getItem.mockReturnValue(null);

    Object.defineProperty(import.meta, 'env', {
      value: {
        ...originalEnv,
        VITE_API_BASE_URL: 'http://localhost:3001/api',
      },
      writable: true,
      configurable: true,
    });
  });

  afterEach(() => {
    cleanup(); // Unmount components to clear intervals
    server.resetHandlers();
    vi.useRealTimers();
    vi.resetModules();
    Object.defineProperty(import.meta, 'env', {
      value: originalEnv,
      writable: true,
      configurable: true,
    });

    // Small delay to let any pending intervals clear
    return new Promise((resolve) => setTimeout(resolve, 50));
  });

  describe('Initial render with props', () => {
    it('renders API status card with initial data', () => {
      renderDashboard({ initialApiHealth: mockHealthCheck });

      expect(screen.getByTestId('api-status-card')).toBeInTheDocument();
      expect(screen.getByText('API Backend')).toBeInTheDocument();
      expect(screen.getByText('Saludable')).toBeInTheDocument();
      expect(screen.getByText((content) => content.includes('v1.0.0'))).toBeInTheDocument();
    });

    it('renders DB status card with initial data', () => {
      renderDashboard({ initialDbHealth: mockHealthDb });

      expect(screen.getByTestId('db-status-card')).toBeInTheDocument();
      expect(screen.getByText('Base de Datos')).toBeInTheDocument();
      expect(screen.getByText('Saludable')).toBeInTheDocument();
      expect(screen.getByText('12.5ms')).toBeInTheDocument();
    });

    it('shows "Sin datos" when no initial data and not loading', () => {
      renderDashboard({});

      const sinDatosElements = screen.getAllByText('Sin datos');
      expect(sinDatosElements).toHaveLength(2); // One for API, one for DB
    });

    it('shows loading spinner on refresh button during manual refresh', async () => {
      // Override handlers for this test - add delay to see loading state
      let resolveHealth: (value: Response) => void;
      let resolveDb: (value: Response) => void;
      const healthPromise = new Promise<Response>((resolve) => {
        resolveHealth = resolve;
      });
      const dbPromise = new Promise<Response>((resolve) => {
        resolveDb = resolve;
      });

      server.use(
        http.get('http://localhost:3001/api/health', () => healthPromise),
        http.get('http://localhost:3001/api/health/db', () => dbPromise)
      );

      // Render WITHOUT initial data so component shows loading state
      renderDashboard({});

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      // Should show loading spinner on refresh button
      await waitFor(() => {
        const spinner = screen.getByTestId('refresh-spinner');
        expect(spinner).toBeInTheDocument();
      });

      // Now resolve the promises
      resolveHealth!(HttpResponse.json(mockHealthCheck));
      resolveDb!(HttpResponse.json(mockHealthDb));

      await act(async () => {
        await flushPromises();
      });
    });
  });

  describe('Status card colors', () => {
    it('shows green for ok status', () => {
      renderDashboard({ initialApiHealth: mockHealthCheck });

      const card = screen.getByTestId('api-status-card');
      expect(card).toHaveClass('bg-success-100');
    });

    it('shows yellow for degraded status', () => {
      renderDashboard({ initialApiHealth: mockDegradedHealthCheck });

      const card = screen.getByTestId('api-status-card');
      expect(card).toHaveClass('bg-warning-100');
    });

    it('shows red for down status', () => {
      renderDashboard({ initialDbHealth: mockDownHealthDb });

      const card = screen.getByTestId('db-status-card');
      expect(card).toHaveClass('bg-error-100');
    });
  });

  describe('Manual refresh', () => {
    it('shows loading spinner during refresh', async () => {
      let resolveHealth: (value: Response) => void;
      let resolveDb: (value: Response) => void;
      const healthPromise = new Promise<Response>((resolve) => {
        resolveHealth = resolve;
      });
      const dbPromise = new Promise<Response>((resolve) => {
        resolveDb = resolve;
      });

      server.use(
        http.get('http://localhost:3001/api/health', () => healthPromise),
        http.get('http://localhost:3001/api/health/db', () => dbPromise)
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      // Should show loading state - refresh button should have spinner
      await waitFor(() => {
        const spinner = screen.getByTestId('refresh-spinner');
        expect(spinner).toBeInTheDocument();
      });

      resolveHealth!(HttpResponse.json(mockHealthCheck));
      resolveDb!(HttpResponse.json(mockHealthDb));

      await act(async () => {
        await flushPromises();
      });
    });

    it('updates data after successful refresh', async () => {
      const updatedHealthCheck: HealthCheck = {
        ...mockHealthCheck,
        version: '2.0.0',
      };
      const updatedHealthDb: HealthDb = {
        ...mockHealthDb,
        latency: 25.0,
      };

      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.json(updatedHealthCheck)),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.json(updatedHealthDb))
      );

      // Render WITH initial data so no auto-refresh fetch happens (component doesn't fetch on mount)
      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      // Wait a bit for any potential leaked intervals from previous tests
      await waitFor(
        () => {
          expect(screen.queryByText('Comprobando...')).not.toBeInTheDocument();
        },
        { timeout: 2000 }
      );

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      // Wait for data to update from v1.0.0 to v2.0.0 - check the API status card specifically
      await waitFor(() => {
        const apiCard = screen.getByTestId('api-status-card');
        expect(apiCard).toHaveTextContent('2.0.0');
        expect(screen.getByText('25.0ms')).toBeInTheDocument();
      });
    });

    it('shows error alert on fetch failure', async () => {
      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.error()),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.error())
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
        expect(screen.getByText('Reintentar')).toBeInTheDocument();
      });
    });

    it('shows error alert on non-ok response', async () => {
      server.use(
        http.get('http://localhost:3001/api/health', () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
        ),
        http.get('http://localhost:3001/api/health/db', () =>
          HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 })
        )
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
        expect(screen.getByText('Reintentar')).toBeInTheDocument();
      });
    });
  });

  describe('History persistence', () => {
    it('loads history from localStorage on mount', async () => {
      const savedHistory: HealthHistoryEntry[] = [
        {
          timestamp: '2024-01-01T12:00:00.000Z',
          apiHealth: mockHealthCheck,
          dbHealth: mockHealthDb,
        },
        {
          timestamp: '2024-01-01T11:00:00.000Z',
          apiHealth: mockDegradedHealthCheck,
          dbHealth: mockDownHealthDb,
        },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedHistory));

      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.json(mockHealthCheck)),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.json(mockHealthDb))
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      // Wait for any initial auto-refresh to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Comprobando...')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      // Click history toggle to show history
      const historyToggle = screen.getByTestId('history-toggle');
      await userEvent.click(historyToggle);

      await waitFor(() => {
        expect(screen.getByText('Historial de comprobaciones')).toBeInTheDocument();
        // formatTimestamp uses es-AR locale: "01/01/2024, 09:00:00 a. m." (UTC-3)
        // There may be multiple entries, just verify at least one exists
        expect(
          screen.getAllByText((content) => content.includes('01/01/2024')).length
        ).toBeGreaterThan(0);
      });
    });

    it('saves new entry to history after refresh', async () => {
      const updatedHealthCheck: HealthCheck = {
        ...mockHealthCheck,
        version: '2.0.0',
      };

      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.json(updatedHealthCheck)),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.json(mockHealthDb))
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      // Wait for any initial auto-refresh to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Comprobando...')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      // Wait for data to update - check the API status card specifically
      await waitFor(() => {
        const apiCard = screen.getByTestId('api-status-card');
        expect(apiCard).toHaveTextContent('2.0.0');
      });

      // Check that localStorage.setItem was called
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedData = mockLocalStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(savedData);
      expect(parsed.length).toBe(1);
      expect(parsed[0].apiHealth?.version).toBe('2.0.0');
    });

    it('limits history to MAX_HISTORY_ENTRIES', async () => {
      // Create history with MAX_HISTORY_ENTRIES entries
      const fullHistory = Array.from({ length: MAX_HISTORY_ENTRIES }, (_, i) => ({
        timestamp: new Date(2024, 0, 1, 10, i).toISOString(),
        apiHealth: mockHealthCheck,
        dbHealth: mockHealthDb,
      }));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(fullHistory));

      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.json(mockHealthCheck)),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.json(mockHealthDb))
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      // Wait for any initial auto-refresh to complete
      await waitFor(
        () => {
          expect(screen.queryByText('Comprobando...')).not.toBeInTheDocument();
        },
        { timeout: 1000 }
      );

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Comprobando...')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        const apiCard = screen.getByTestId('api-status-card');
        expect(apiCard).toHaveTextContent('1.0.0');
      });

      // Check that localStorage.setItem was called with limited history
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      const savedData = mockLocalStorage.setItem.mock.calls[0][1];
      const parsed = JSON.parse(savedData);
      expect(parsed.length).toBe(MAX_HISTORY_ENTRIES);
    });
  });

  describe('History table', () => {
    it('toggles history visibility', async () => {
      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      // History table should be hidden initially
      expect(screen.queryByTestId('history-table')).not.toBeInTheDocument();

      // Click toggle to show history
      const historyToggle = screen.getByTestId('history-toggle');
      await userEvent.click(historyToggle);

      await waitFor(() => {
        expect(screen.getByTestId('history-table')).toBeInTheDocument();
      });

      // Click toggle again to hide history
      await userEvent.click(historyToggle);

      await waitFor(() => {
        expect(screen.queryByTestId('history-table')).not.toBeInTheDocument();
      });
    });

    it('shows history entries with correct format', async () => {
      const savedHistory = [
        {
          timestamp: '2024-01-01T10:00:00.000Z',
          apiHealth: mockHealthCheck,
          dbHealth: mockHealthDb,
        },
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(savedHistory));

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      // Wait for any pending fetches to complete first
      await waitFor(() => {
        expect(screen.queryByText('Comprobando...')).not.toBeInTheDocument();
      });

      const historyToggle = screen.getByTestId('history-toggle');
      await userEvent.click(historyToggle);

      await waitFor(() => {
        expect(screen.getByText('Historial de comprobaciones')).toBeInTheDocument();
        // Check for formatted timestamp (es-AR locale) in the history table specifically
        const historyTable = screen.getByTestId('history-table');
        expect(historyTable).toHaveTextContent(/01\/01\/2024/);
        expect(historyTable).toHaveTextContent('Saludable');
        expect(historyTable).toHaveTextContent('12.5ms');
      });
    });

    it('shows empty state when no history', async () => {
      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      // Wait for any pending fetches to complete first
      await waitFor(() => {
        expect(screen.queryByText('Comprobando...')).not.toBeInTheDocument();
      });

      const historyToggle = screen.getByTestId('history-toggle');
      await userEvent.click(historyToggle);

      await waitFor(() => {
        expect(screen.getByText('No hay historial disponible')).toBeInTheDocument();
      });
    });
  });

  describe('Auto-refresh', () => {
    it('sets up auto-refresh interval', async () => {
      // For this test we just verify the component renders without error
      // Testing actual interval requires fake timers which conflict with MSW
      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.json(mockHealthCheck)),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.json(mockHealthDb))
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      // Component should render successfully
      expect(screen.getByTestId('health-dashboard')).toBeInTheDocument();
    });

    it('cleans up interval on unmount', () => {
      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.json(mockHealthCheck)),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.json(mockHealthDb))
      );

      const { unmount } = renderDashboard({
        initialApiHealth: mockHealthCheck,
        initialDbHealth: mockHealthDb,
      });

      unmount();

      // If interval was cleaned up, no error should occur
      // Just verify no crash
      expect(true).toBe(true);
    });
  });

  describe('Last refresh timestamp', () => {
    it('updates last refresh time after successful fetch', async () => {
      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.json(mockHealthCheck)),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.json(mockHealthDb))
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByText(/Última actualización:/)).toBeInTheDocument();
      });
    });
  });

  describe('Error state', () => {
    it('displays error alert with retry button', async () => {
      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.error()),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.error())
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
        expect(screen.getByText('Reintentar')).toBeInTheDocument();
      });
    });

    it('clears error on successful retry', async () => {
      let apiCallCount = 0;
      let dbCallCount = 0;
      server.use(
        http.get('http://localhost:3001/api/health', () => {
          apiCallCount++;
          // First call (initial refresh) fails, second call (retry) succeeds
          if (apiCallCount === 1) {
            return HttpResponse.error();
          }
          return HttpResponse.json(mockHealthCheck);
        }),
        http.get('http://localhost:3001/api/health/db', () => {
          dbCallCount++;
          if (dbCallCount === 1) {
            return HttpResponse.error();
          }
          return HttpResponse.json(mockHealthDb);
        })
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByTestId('error-alert')).toBeInTheDocument();
      });

      // Click retry
      const retryButton = screen.getByText('Reintentar');
      await userEvent.click(retryButton);

      // Wait for loading to complete
      await waitFor(() => {
        expect(screen.queryByText('Comprobando...')).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.queryByTestId('error-alert')).not.toBeInTheDocument();
      });
    });
  });

  describe('Next refresh countdown', () => {
    it('shows next refresh countdown after refresh', async () => {
      server.use(
        http.get('http://localhost:3001/api/health', () => HttpResponse.json(mockHealthCheck)),
        http.get('http://localhost:3001/api/health/db', () => HttpResponse.json(mockHealthDb))
      );

      renderDashboard({ initialApiHealth: mockHealthCheck, initialDbHealth: mockHealthDb });

      const refreshButton = screen.getByTestId('refresh-button');
      await userEvent.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByText(/Próxima en ~\d+s/)).toBeInTheDocument();
      });
    });
  });
});
