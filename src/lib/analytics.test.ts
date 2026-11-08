import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent, isPlausibleAvailable, type EventName } from './analytics';

describe('analytics.ts', () => {
  const _originalWindow = global.window;
  const originalConsoleDebug = console.debug;
  const originalConsoleWarn = console.warn;

  beforeEach(() => {
    vi.stubGlobal('window', {});
    console.debug = vi.fn();
    console.warn = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    console.debug = originalConsoleDebug;
    console.warn = originalConsoleWarn;
  });

  describe('trackEvent', () => {
    it('calls plausible when available with correct event name and props', () => {
      const mockPlausible = vi.fn();
      vi.stubGlobal('window', { plausible: mockPlausible });

      trackEvent('search_combination', { numbers: '01,05,12', hasResults: true, totalMatches: 1 });

      expect(mockPlausible).toHaveBeenCalledTimes(1);
      expect(mockPlausible).toHaveBeenCalledWith('search_combination', {
        props: { numbers: '01,05,12', hasResults: true, totalMatches: 1 },
      });
    });

    it('calls plausible with empty props when props is undefined', () => {
      const mockPlausible = vi.fn();
      vi.stubGlobal('window', { plausible: mockPlausible });

      trackEvent('admin_login', undefined);

      expect(mockPlausible).toHaveBeenCalledTimes(1);
      expect(mockPlausible).toHaveBeenCalledWith('admin_login', { props: {} });
    });

    it('does not call plausible when not available (no-op)', () => {
      vi.stubGlobal('window', { plausible: undefined });

      trackEvent('import_start', { fileName: 'test.csv', fileSize: 100, rowCount: 5 });

      expect(console.debug).toHaveBeenCalledWith(
        '[Analytics] Plausible not available, skipping event:',
        'import_start',
        { fileName: 'test.csv', fileSize: 100, rowCount: 5 }
      );
    });

    it('logs warning when window.plausible is not a function (throws on call)', () => {
      vi.stubGlobal('window', { plausible: 'not a function' });

      trackEvent('import_commit', { importId: '123', policy: 'skip', selectedRows: 10 });

      // Code tries to call plausible, it throws, caught and warns
      expect(console.warn).toHaveBeenCalledWith(
        '[Analytics] Failed to track event:',
        'import_commit',
        expect.any(Error)
      );
    });

    it('fails silently and logs warning when plausible throws', () => {
      const mockPlausible = vi.fn(() => {
        throw new Error('Plausible error');
      });
      vi.stubGlobal('window', { plausible: mockPlausible });

      trackEvent('import_error', { importId: '456', stage: 'parse', errorMessage: 'Invalid CSV' });

      expect(mockPlausible).toHaveBeenCalledTimes(1);
      expect(console.warn).toHaveBeenCalledWith(
        '[Analytics] Failed to track event:',
        'import_error',
        expect.any(Error)
      );
    });

    it('works for all valid EventName types', () => {
      const mockPlausible = vi.fn();
      vi.stubGlobal('window', { plausible: mockPlausible });

      const events: EventName[] = [
        'search_combination',
        'admin_login',
        'admin_login_failed',
        'import_start',
        'import_commit',
        'import_error',
        'health_check_view',
        'health_check_refresh',
      ];

      events.forEach((event) => {
        trackEvent(event);
      });

      expect(mockPlausible).toHaveBeenCalledTimes(events.length);
      events.forEach((event, index) => {
        expect(mockPlausible).toHaveBeenNthCalledWith(index + 1, event, { props: {} });
      });
    });

    it('works with HealthCheckViewProps', () => {
      const mockPlausible = vi.fn();
      vi.stubGlobal('window', { plausible: mockPlausible });

      trackEvent('health_check_view', { apiStatus: 'ok', dbStatus: 'down' });

      expect(mockPlausible).toHaveBeenCalledWith('health_check_view', {
        props: { apiStatus: 'ok', dbStatus: 'down' },
      });
    });

    it('works with AdminLoginProps including errorType', () => {
      const mockPlausible = vi.fn();
      vi.stubGlobal('window', { plausible: mockPlausible });

      trackEvent('admin_login_failed', { success: false, errorType: 'invalid_credentials' });

      expect(mockPlausible).toHaveBeenCalledWith('admin_login_failed', {
        props: { success: false, errorType: 'invalid_credentials' },
      });
    });

    it('works with ImportStartProps', () => {
      const mockPlausible = vi.fn();
      vi.stubGlobal('window', { plausible: mockPlausible });

      trackEvent('import_start', { fileName: 'data.csv', fileSize: 2048, rowCount: 50 });

      expect(mockPlausible).toHaveBeenCalledWith('import_start', {
        props: { fileName: 'data.csv', fileSize: 2048, rowCount: 50 },
      });
    });

    it('works with ImportCommitProps', () => {
      const mockPlausible = vi.fn();
      vi.stubGlobal('window', { plausible: mockPlausible });

      trackEvent('import_commit', { importId: 'abc', policy: 'merge', selectedRows: 25 });

      expect(mockPlausible).toHaveBeenCalledWith('import_commit', {
        props: { importId: 'abc', policy: 'merge', selectedRows: 25 },
      });
    });

    it('works with ImportErrorProps', () => {
      const mockPlausible = vi.fn();
      vi.stubGlobal('window', { plausible: mockPlausible });

      trackEvent('import_error', {
        importId: 'xyz',
        stage: 'commit',
        errorMessage: 'Duplicate key',
      });

      expect(mockPlausible).toHaveBeenCalledWith('import_error', {
        props: { importId: 'xyz', stage: 'commit', errorMessage: 'Duplicate key' },
      });
    });

    it('returns early when window is undefined (SSR)', () => {
      vi.unstubAllGlobals();
      // @ts-expect-error - deleting window for SSR simulation
      delete global.window;

      trackEvent('search_combination', { numbers: '01,02,03', hasResults: false, totalMatches: 0 });

      // Should not throw and should return early
      expect(true).toBe(true);
    });
  });

  describe('isPlausibleAvailable', () => {
    it('returns true when window.plausible is a function', () => {
      vi.stubGlobal('window', { plausible: vi.fn() });
      expect(isPlausibleAvailable()).toBe(true);
    });

    it('returns false when window.plausible is undefined', () => {
      vi.stubGlobal('window', { plausible: undefined });
      expect(isPlausibleAvailable()).toBe(false);
    });

    it('returns false when window.plausible is not a function', () => {
      vi.stubGlobal('window', { plausible: 'not a function' });
      expect(isPlausibleAvailable()).toBe(false);
    });

    it('returns false when window is undefined (SSR)', () => {
      vi.unstubAllGlobals();
      // @ts-expect-error - deleting window for SSR simulation
      delete global.window;
      expect(isPlausibleAvailable()).toBe(false);
    });
  });
});
