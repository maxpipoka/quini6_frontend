import React, { useState, useEffect, useCallback } from 'react';
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  RefreshCw,
  Clock,
  Database,
  Server,
  Activity,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { HealthCheck, HealthDb } from '../../lib/schemas';

const HISTORY_KEY = 'health-check-history';
const MAX_HISTORY_ENTRIES = 50;
const AUTO_REFRESH_INTERVAL = 30000; // 30 seconds

export interface HealthHistoryEntry {
  timestamp: string;
  apiHealth: HealthCheck | null;
  dbHealth: HealthDb | null;
}

interface HealthDashboardProps {
  initialApiHealth?: HealthCheck | null;
  initialDbHealth?: HealthDb | null;
}

function getStatusColor(status: string): string {
  switch (status) {
    case 'ok':
      return 'text-success-600 bg-success-100 dark:bg-success-900/30 dark:text-success-400';
    case 'degraded':
      return 'text-warning-600 bg-warning-100 dark:bg-warning-900/30 dark:text-warning-400';
    case 'down':
      return 'text-error-600 bg-error-100 dark:bg-error-900/30 dark:text-error-400';
    default:
      return 'text-neutral-600 bg-neutral-100 dark:bg-neutral-900/30 dark:text-neutral-400';
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case 'ok':
      return <CheckCircle className="size-4" aria-hidden="true" />;
    case 'degraded':
      return <AlertCircle className="size-4" aria-hidden="true" />;
    case 'down':
      return <XCircle className="size-4" aria-hidden="true" />;
    default:
      return <Clock className="size-4" aria-hidden="true" />;
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case 'ok':
      return 'Saludable';
    case 'degraded':
      return 'Degradado';
    case 'down':
      return 'Caído';
    default:
      return 'Desconocido';
  }
}

function formatTimestamp(isoString: string): string {
  try {
    return new Date(isoString).toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  } catch {
    return isoString;
  }
}

function loadHistory(): HealthHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      return JSON.parse(stored) as HealthHistoryEntry[];
    }
  } catch {
    // Ignore parsing errors
  }
  return [];
}

function saveHistory(history: HealthHistoryEntry[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY_ENTRIES)));
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
}

export const HealthDashboard: React.FC<HealthDashboardProps> = ({
  initialApiHealth,
  initialDbHealth,
}) => {
  const [apiHealth, setApiHealth] = useState<HealthCheck | null>(initialApiHealth ?? null);
  const [dbHealth, setDbHealth] = useState<HealthDb | null>(initialDbHealth ?? null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [history, setHistory] = useState<HealthHistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load history from localStorage on mount
  useEffect(() => {
    const loadedHistory = loadHistory();
    setHistory(loadedHistory);
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    const interval = setInterval(() => {
      void fetchHealthData();
    }, AUTO_REFRESH_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const fetchHealthData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Use the same API client that the app uses
      const baseUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseUrl) {
        throw new Error('VITE_API_BASE_URL is not configured');
      }

      const [apiResponse, dbResponse] = await Promise.allSettled([
        fetch(`${baseUrl}/health`, { credentials: 'include' }),
        fetch(`${baseUrl}/health/db`, { credentials: 'include' }),
      ]);

      let newApiHealth: HealthCheck | null = null;
      let newDbHealth: HealthDb | null = null;
      let hasError = false;
      const errorMessages: string[] = [];

      if (apiResponse.status === 'fulfilled') {
        if (apiResponse.value.ok) {
          newApiHealth = (await apiResponse.value.json()) as HealthCheck;
        } else {
          hasError = true;
          errorMessages.push(`API health check failed: ${apiResponse.value.status}`);
          console.warn('API health check failed:', apiResponse.value.status);
        }
      } else {
        hasError = true;
        errorMessages.push(`API health check network error: ${apiResponse.reason}`);
        console.warn('API health check network error:', apiResponse.reason);
      }

      if (dbResponse.status === 'fulfilled') {
        if (dbResponse.value.ok) {
          newDbHealth = (await dbResponse.value.json()) as HealthDb;
        } else {
          hasError = true;
          errorMessages.push(`DB health check failed: ${dbResponse.value.status}`);
          console.warn('DB health check failed:', dbResponse.value.status);
        }
      } else {
        hasError = true;
        errorMessages.push(`DB health check network error: ${dbResponse.reason}`);
        console.warn('DB health check network error:', dbResponse.reason);
      }

      // Set error state if any health check failed
      if (hasError) {
        setError(errorMessages.join('; '));
      }

      setApiHealth(newApiHealth);
      setDbHealth(newDbHealth);
      setLastRefresh(new Date());

      // Add to history
      const newEntry: HealthHistoryEntry = {
        timestamp: new Date().toISOString(),
        apiHealth: newApiHealth,
        dbHealth: newDbHealth,
      };

      setHistory((prev) => {
        const updated = [newEntry, ...prev].slice(0, MAX_HISTORY_ENTRIES);
        saveHistory(updated);
        return updated;
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error desconocido';
      setError(message);
      console.error('Health check failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleManualRefresh = () => {
    void fetchHealthData();
  };

  const getOverallStatus = () => {
    if (!apiHealth && !dbHealth) return 'unknown';
    if (apiHealth?.status === 'down' || dbHealth?.status === 'down') {
      return 'down';
    }
    if (apiHealth?.status === 'degraded') {
      return 'degraded';
    }
    return 'ok';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="space-y-6" data-testid="health-dashboard">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`rounded-lg p-2 ${getStatusColor(overallStatus)}`}>
            <Activity className="size-5" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
              Salud del sistema
            </h2>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Monitoreo de API y base de datos
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              Última actualización: {formatTimestamp(lastRefresh.toISOString())}
            </span>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={isLoading}
            className="btn btn-secondary flex items-center gap-2"
            data-testid="refresh-button"
          >
            <RefreshCw
              className={`size-4 ${isLoading ? 'animate-spin' : ''}`}
              aria-hidden="true"
              data-testid="refresh-spinner"
            />
            <span>Actualizar</span>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          className="border-error-200 flex items-center gap-3 rounded-lg border bg-error-50 px-4 py-3 text-error-700"
          role="alert"
          data-testid="error-alert"
        >
          <XCircle className="size-5 flex-shrink-0" aria-hidden="true" />
          <span className="text-sm">Error al obtener datos de salud: {error}</span>
          <button
            onClick={handleManualRefresh}
            className="ml-auto text-sm underline hover:no-underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Status Cards */}
      <div className="grid gap-4 md:grid-cols-2" data-testid="status-cards">
        {/* API Status Card */}
        <div
          className={`rounded-xl border p-5 transition-all ${
            apiHealth
              ? getStatusColor(apiHealth.status)
                  .replace('text-', 'bg-')
                  .replace('dark:bg-', 'dark:bg-')
              : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800'
          }`}
          data-testid="api-status-card"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-3 ${getStatusColor(apiHealth?.status ?? 'unknown')}`}>
                <Server className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  API Backend
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Estado del servicio principal
                </p>
              </div>
            </div>
            <div className="text-right">
              {apiHealth ? (
                <>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(apiHealth.status)}`}
                  >
                    {getStatusIcon(apiHealth.status)}
                    {getStatusLabel(apiHealth.status)}
                  </span>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    v{apiHealth.version} · Uptime: {Math.floor(apiHealth.uptime)}s
                  </p>
                </>
              ) : isLoading ? (
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
                  <span className="text-sm">Comprobando...</span>
                </div>
              ) : (
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Sin datos</span>
              )}
            </div>
          </div>

          {apiHealth && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Timestamp</span>
                <p className="mt-1 font-mono text-neutral-900 dark:text-neutral-100">
                  {formatTimestamp(apiHealth.timestamp)}
                </p>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Versión</span>
                <p className="mt-1 font-mono text-neutral-900 dark:text-neutral-100">
                  {apiHealth.version}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Database Status Card */}
        <div
          className={`rounded-xl border p-5 transition-all ${
            dbHealth
              ? getStatusColor(dbHealth.status)
                  .replace('text-', 'bg-')
                  .replace('dark:bg-', 'dark:bg-')
              : 'border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800'
          }`}
          data-testid="db-status-card"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-3 ${getStatusColor(dbHealth?.status ?? 'unknown')}`}>
                <Database className="size-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
                  Base de Datos
                </h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Conexión y latencia
                </p>
              </div>
            </div>
            <div className="text-right">
              {dbHealth ? (
                <>
                  <span
                    className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ${getStatusColor(dbHealth.status)}`}
                  >
                    {getStatusIcon(dbHealth.status)}
                    {getStatusLabel(dbHealth.status)}
                  </span>
                  <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                    Latencia: {dbHealth.latency.toFixed(1)}ms
                  </p>
                </>
              ) : isLoading ? (
                <div className="flex items-center gap-2 text-neutral-500 dark:text-neutral-400">
                  <RefreshCw className="size-4 animate-spin" aria-hidden="true" />
                  <span className="text-sm">Comprobando...</span>
                </div>
              ) : (
                <span className="text-sm text-neutral-500 dark:text-neutral-400">Sin datos</span>
              )}
            </div>
          </div>

          {dbHealth && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Timestamp</span>
                <p className="mt-1 font-mono text-neutral-900 dark:text-neutral-100">
                  {formatTimestamp(dbHealth.timestamp)}
                </p>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400">Latencia</span>
                <p className="mt-1 font-mono text-neutral-900 dark:text-neutral-100">
                  {dbHealth.latency.toFixed(1)}ms
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* History Table */}
      <div className="overflow-hidden rounded-xl border border-neutral-200 dark:border-neutral-700">
        <button
          onClick={() => setShowHistory(!showHistory)}
          className="flex w-full items-center justify-between bg-neutral-50 px-5 py-3 transition-colors hover:bg-neutral-100 dark:bg-neutral-800 dark:hover:bg-neutral-700"
          data-testid="history-toggle"
        >
          <span className="font-medium text-neutral-900 dark:text-neutral-100">
            Historial de comprobaciones
          </span>
          <span className="flex items-center gap-2">
            <span className="text-sm text-neutral-500 dark:text-neutral-400">
              {history.length} registros
            </span>
            {showHistory ? (
              <ChevronUp className="size-5" aria-hidden="true" />
            ) : (
              <ChevronDown className="size-5" aria-hidden="true" />
            )}
          </span>
        </button>

        {showHistory && (
          <div className="overflow-x-auto">
            <table className="w-full" data-testid="history-table">
              <thead>
                <tr className="border-b border-neutral-200 bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-800">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Fecha y hora
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    API
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Base de datos
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    Detalles
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {history.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-4 py-8 text-center text-neutral-500 dark:text-neutral-400"
                    >
                      No hay historial disponible
                    </td>
                  </tr>
                ) : (
                  history.map((entry, index) => (
                    <tr key={index} className="dark:hover:bg-neutral-800/50 hover:bg-neutral-50">
                      <td className="px-4 py-3 font-mono text-sm text-neutral-900 dark:text-neutral-100">
                        {formatTimestamp(entry.timestamp)}
                      </td>
                      <td className="px-4 py-3">
                        {entry.apiHealth ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(entry.apiHealth.status)}`}
                          >
                            {getStatusIcon(entry.apiHealth.status)}
                            {getStatusLabel(entry.apiHealth.status)}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400 dark:text-neutral-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {entry.dbHealth ? (
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(entry.dbHealth.status)}`}
                          >
                            {getStatusIcon(entry.dbHealth.status)}
                            {getStatusLabel(entry.dbHealth.status)}
                          </span>
                        ) : (
                          <span className="text-sm text-neutral-400 dark:text-neutral-500">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">
                        {entry.apiHealth && entry.dbHealth ? (
                          <>
                            API v{entry.apiHealth.version} · DB {entry.dbHealth.latency.toFixed(1)}
                            ms
                          </>
                        ) : entry.apiHealth ? (
                          <>API v{entry.apiHealth.version}</>
                        ) : entry.dbHealth ? (
                          <>DB {entry.dbHealth.latency.toFixed(1)}ms</>
                        ) : (
                          '-'
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Auto-refresh indicator */}
      <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
        <span className="flex items-center gap-1">
          <span className="size-2 animate-pulse rounded-full bg-success-500" aria-hidden="true" />
          Auto-actualización cada 30s
        </span>
        {lastRefresh && (
          <span>
            Próxima en ~{Math.max(0, 30 - Math.floor((Date.now() - lastRefresh.getTime()) / 1000))}s
          </span>
        )}
      </div>
    </div>
  );
};

export default HealthDashboard;
