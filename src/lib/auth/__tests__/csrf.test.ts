import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCsrfToken, setCsrfHeader } from '../csrf';

describe('csrf utilities', () => {
  let originalCookie: string;

  beforeEach(() => {
    vi.clearAllMocks();
    originalCookie = '';
    // Mock document.cookie getter/setter
    Object.defineProperty(document, 'cookie', {
      get: () => originalCookie,
      set: (value: string) => {
        // jsdom-like behavior: each set replaces or adds
        if (value.includes('=')) {
          const [name] = value.split('=');
          const existingIndex = originalCookie.indexOf(`${name}=`);
          if (existingIndex >= 0) {
            // Find end of this cookie
            const end = originalCookie.indexOf(';', existingIndex);
            if (end >= 0) {
              originalCookie = originalCookie.slice(0, existingIndex) + value + originalCookie.slice(end);
            } else {
              originalCookie = originalCookie.slice(0, existingIndex) + value;
            }
          } else {
            originalCookie = originalCookie ? `${originalCookie}; ${value}` : value;
          }
        }
      },
      configurable: true,
    });
  });

  describe('getCsrfToken', () => {
    it('returns null when document is undefined (SSR)', () => {
      // Simulate SSR by temporarily removing document
      const originalDoc = global.document;
      // @ts-expect-error - intentional for test
      global.document = undefined;

      expect(getCsrfToken()).toBeNull();

      global.document = originalDoc;
    });

    it('returns null when no csrf_token cookie exists', () => {
      document.cookie = 'other=value; another=thing';
      expect(getCsrfToken()).toBeNull();
    });

    it('extracts csrf_token from cookie', () => {
      document.cookie = 'csrf_token=abc123; other=value';
      expect(getCsrfToken()).toBe('abc123');
    });

    it('extracts csrf_token with special characters', () => {
      const token = 'token-with.special_chars~123';
      document.cookie = `csrf_token=${encodeURIComponent(token)}`;
      expect(getCsrfToken()).toBe(token);
    });

    it('handles csrf_token at start of cookie string', () => {
      document.cookie = 'csrf_token=first-token; other=value';
      expect(getCsrfToken()).toBe('first-token');
    });

    it('handles csrf_token at end of cookie string', () => {
      document.cookie = 'other=value; csrf_token=last-token';
      expect(getCsrfToken()).toBe('last-token');
    });

    it('handles multiple cookies with csrf_token in middle', () => {
      document.cookie = 'first=1; csrf_token=middle-token; last=3';
      expect(getCsrfToken()).toBe('middle-token');
    });
  });

  describe('setCsrfHeader', () => {
    it('returns new request with X-CSRF-Token header when token exists', () => {
      document.cookie = 'csrf_token=test-token';

      const request = new Request('http://localhost/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = setCsrfHeader(request);
      expect(result.headers.get('X-CSRF-Token')).toBe('test-token');
      expect(result.headers.get('Content-Type')).toBe('application/json');
    });

    it('returns original request when no csrf token', () => {
      document.cookie = '';
      const request = new Request('http://localhost/api/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const result = setCsrfHeader(request);
      expect(result.headers.get('X-CSRF-Token')).toBeNull();
      expect(result.headers.get('Content-Type')).toBe('application/json');
    });

    it('preserves other headers', () => {
      document.cookie = 'csrf_token=test-token';

      const request = new Request('http://localhost/api/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer token',
          'Custom-Header': 'value',
        },
      });

      const result = setCsrfHeader(request);
      expect(result.headers.get('X-CSRF-Token')).toBe('test-token');
      expect(result.headers.get('Authorization')).toBe('Bearer token');
      expect(result.headers.get('Custom-Header')).toBe('value');
    });

    it('creates new Request object (immutable)', () => {
      document.cookie = 'csrf_token=test-token';

      const request = new Request('http://localhost/api/test', {
        method: 'POST',
      });

      const result = setCsrfHeader(request);
      expect(result).not.toBe(request);
      expect(request.headers.get('X-CSRF-Token')).toBeNull();
    });
  });
});