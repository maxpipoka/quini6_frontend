/**
 * Analytics Event Tracking - Plausible Integration
 * Typed event names and trackEvent helper with graceful fallback
 */

// Union of all tracked event names for type safety
export type EventName =
  | 'search_combination'
  | 'admin_login'
  | 'admin_login_failed'
  | 'import_start'
  | 'import_commit'
  | 'import_error'
  | 'health_check_view'
  | 'health_check_refresh';

// Event properties types for each event
export interface SearchCombinationProps {
  numbers: string; // formatted numbers like "01,05,12,23,34,45"
  hasResults: boolean;
  totalMatches: number;
}

export interface AdminLoginProps {
  success: boolean;
  errorType?: 'invalid_credentials' | 'network_error' | 'server_error' | 'unknown';
}

export interface ImportStartProps {
  fileName: string;
  fileSize: number;
  rowCount: number;
}

export interface ImportCommitProps {
  importId: string;
  policy: 'skip' | 'replace' | 'merge';
  selectedRows: number;
}

export interface ImportErrorProps {
  importId?: string;
  stage: 'preview' | 'commit' | 'parse';
  errorMessage: string;
}

export interface HealthCheckViewProps {
  apiStatus: 'ok' | 'degraded' | 'down';
  dbStatus: 'ok' | 'down';
}

// Union of all possible event properties
export type EventProps =
  | SearchCombinationProps
  | AdminLoginProps
  | ImportStartProps
  | ImportCommitProps
  | ImportErrorProps
  | HealthCheckViewProps
  | Record<string, unknown>;

/**
 * Track an event with Plausible Analytics.
 * Gracefully falls back if Plausible is not loaded.
 *
 * @param name - The event name (typed for safety)
 * @param props - Optional event properties
 */
export function trackEvent(name: EventName, props?: EventProps): void {
  if (typeof window === 'undefined') return;

  // Check if Plausible is available
  const plausible = window.plausible;

  if (!plausible) {
    // Plausible not loaded - graceful no-op
    if (import.meta.env?.DEV) {
      console.debug('[Analytics] Plausible not available, skipping event:', name, props);
    }
    return;
  }

  try {
    plausible(name, { props: (props as Record<string, unknown>) ?? {} });
  } catch (error) {
    // Fail silently - analytics should never break the app
    if (import.meta.env?.DEV) {
      console.warn('[Analytics] Failed to track event:', name, error);
    }
  }
}

// Type guard to check if Plausible is available
export function isPlausibleAvailable(): boolean {
  return typeof window !== 'undefined' && typeof window.plausible === 'function';
}
