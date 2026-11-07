import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { trackEvent, isPlausibleAvailable, type EventName, type EventProps } from './analytics';

// Store original window.plausible
const originalPlausible = (globalThis as unknown as { plausible?: unknown }).plausible;

describe('Analytics - trackEvent', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    // Clear window.plausible
    delete (globalThis as unknown as { plausible?: unknown }).plausible;
  });

  afterEach(() => {
    // Restore original
    if (originalPlausible !== undefined) {
      (globalThis as unknown as { plausible?: unknown }).plausible = originalPlausible;
    } else {
      delete (globalThis as unknown as { plausible?: unknown }).plausible;
    }
  });

  describe('when Plausible is available', () => {
    const mockPlausible = vi.fn();

    beforeEach(() => {
      (globalThis as unknown as { plausible?: unknown }).plausible = mockPlausible;
    });

    it('calls plausible with correct event name and props', () => {
      trackEvent('search_combination', {
        numbers: '01,05,12,23,34,45',
        hasResults: true,
        totalMatches: 3,
      });

      expect(mockPlausible).toHaveBeenCalledTimes(1);
      expect(mockPlausible).toHaveBeenCalledWith('search_combination', {
        props: {
          numbers: '01,05,12,23,34,45',
          hasResults: true,
          totalMatches: 3,
        },
      });
    });

    it('calls plausible with admin_login event', () => {
      trackEvent('admin_login', { success: true });

      expect(mockPlausible).toHaveBeenCalledWith('admin_login', {
        props: { success: true },
      });
    });

    it('calls plausible with admin_login_failed event with errorType', () => {
      trackEvent('admin_login_failed', {
        success: false,
        errorType: 'invalid_credentials',
      });

      expect(mockPlausible).toHaveBeenCalledWith('admin_login_failed', {
        props: { success: false, errorType: 'invalid_credentials' },
      });
    });

    it('calls plausible with import_start event', () => {
      trackEvent('import_start', {
        fileName: 'draws.csv',
        fileSize: 1024,
        rowCount: 50,
      });

      expect(mockPlausible).toHaveBeenCalledWith('import_start', {
        props: { fileName: 'draws.csv', fileSize: 1024, rowCount: 50 },
      });
    });

    it('calls plausible with import_commit event', () => {
      trackEvent('import_commit', {
        importId: 'abc-123',
        policy: 'skip',
        selectedRows: 48,
      });

      expect(mockPlausible).toHaveBeenCalledWith('import_commit', {
        props: { importId: 'abc-123', policy: 'skip', selectedRows: 48 },
      });
    });

    it('calls plausible with import_error event', () => {
      trackEvent('import_error', {
        importId: 'abc-123',
        stage: 'preview',
        errorMessage: 'Validation failed',
      });

      expect(mockPlausible).toHaveBeenCalledWith('import_error', {
        props: { importId: 'abc-123', stage: 'preview', errorMessage: 'Validation failed' },
      });
    });

    it('calls plausible with health_check_view event', () => {
      trackEvent('health_check_view', {
        apiStatus: 'ok',
        dbStatus: 'ok',
      });

      expect(mockPlausible).toHaveBeenCalledWith('health_check_view', {
        props: { apiStatus: 'ok', dbStatus: 'ok' },
      });
    });

    it('calls plausible with health_check_refresh event', () => {
      trackEvent('health_check_refresh', {});

      expect(mockPlausible).toHaveBeenCalledWith('health_check_refresh', {
        props: {},
      });
    });

    it('handles empty props object', () => {
      trackEvent('health_check_refresh');

      expect(mockPlausible).toHaveBeenCalledWith('health_check_refresh', {
        props: {},
      });
    });

    it('handles undefined props', () => {
      trackEvent('search_combination', undefined);

      expect(mockPlausible).toHaveBeenCalledWith('search_combination', {
        props: {},
      });
    });

    it('catches and logs errors without throwing', () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      mockPlausible.mockImplementationOnce(() => {
        throw new Error('Plausible error');
      });

      expect(() =>
        trackEvent('search_combination', {
          numbers: '01,02,03,04,05,06',
          hasResults: true,
          totalMatches: 1,
        })
      ).not.toThrow();

      expect(consoleWarnSpy).toHaveBeenCalledWith(
        '[Analytics] Failed to track event:',
        'search_combination',
        expect.any(Error)
      );

      consoleWarnSpy.mockRestore();
    });
  });

  describe('when Plausible is NOT available', () => {
    it('does not throw and returns early', () => {
      // Ensure plausible is not defined
      delete (globalThis as unknown as { plausible?: unknown }).plausible;

      expect(() =>
        trackEvent('search_combination', {
          numbers: '01,02,03,04,05,06',
          hasResults: true,
          totalMatches: 1,
        })
      ).not.toThrow();
    });

    it('logs debug in development mode when Plausible not available', () => {
      const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {});

      const originalDev = import.meta.env.DEV;
      Object.defineProperty(import.meta, 'env', {
        value: { ...import.meta.env, DEV: true },
        writable: true,
        configurable: true,
      });

      trackEvent('admin_login', { success: true });

      expect(consoleSpy).toHaveBeenCalledWith(
        '[Analytics] Plausible not available, skipping event:',
        'admin_login',
        { success: true }
      );

      consoleSpy.mockRestore();
      Object.defineProperty(import.meta, 'env', {
        value: { ...import.meta.env, DEV: originalDev },
        writable: true,
        configurable: true,
      });
    });

    it('does nothing when window is undefined (SSR)', () => {
      // Simulate SSR by removing window
      const originalWindow = globalThis.window;
      delete (globalThis as unknown as { window?: unknown }).window;

      expect(() =>
        trackEvent('search_combination', {
          numbers: '01,02,03,04,05,06',
          hasResults: true,
          totalMatches: 1,
        })
      ).not.toThrow();

      // Restore window
      globalThis.window = originalWindow;
    });
  });

  describe('isPlausibleAvailable', () => {
    it('returns true when Plausible is a function', () => {
      (globalThis as unknown as { plausible?: unknown }).plausible = vi.fn();
      expect(isPlausibleAvailable()).toBe(true);
    });

    it('returns false when Plausible is undefined', () => {
      delete (globalThis as unknown as { plausible?: unknown }).plausible;
      expect(isPlausibleAvailable()).toBe(false);
    });

    it('returns false when Plausible is not a function', () => {
      (globalThis as unknown as { plausible?: unknown }).plausible = 'not a function';
      expect(isPlausibleAvailable()).toBe(false);
    });

    it('returns false when window is undefined', () => {
      const originalWindow = globalThis.window;
      delete (globalThis as unknown as { window?: unknown }).window;

      expect(isPlausibleAvailable()).toBe(false);

      globalThis.window = originalWindow;
    });
  });

  describe('EventName type safety', () => {
    it('accepts all valid event names', () => {
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

      // This is a compile-time check - if it compiles, types are correct
      events.forEach((event) => {
        expect(typeof event).toBe('string');
      });
    });
  });

  describe('EventProps type safety', () => {
    it('accepts all valid event property types', () => {
      const props: EventProps[] = [
        { numbers: '01,02,03,04,05,06', hasResults: true, totalMatches: 1 },
        { success: true },
        { success: false, errorType: 'network_error' },
        { fileName: 'test.csv', fileSize: 100, rowCount: 10 },
        { importId: 'abc', policy: 'replace', selectedRows: 5 },
        { importId: 'abc', stage: 'commit', errorMessage: 'Failed' },
        { apiStatus: 'ok', dbStatus: 'down' },
        { customProp: 'value' }, // Record<string, unknown> fallback
      ];

      props.forEach((prop) => {
        expect(typeof prop).toBe('object');
      });
    });
  });
});
