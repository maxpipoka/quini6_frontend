import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../mock/handlers';
import '@testing-library/jest-dom';

// MSW server for API mocking
export const server = setupServer(...handlers);

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterAll(() => server.close());
afterEach(() => server.resetHandlers());

// Mock matchMedia (jsdom only)
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
}

// Mock ResizeObserver
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

// Mock IntersectionObserver
if (typeof global.IntersectionObserver === 'undefined') {
  global.IntersectionObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));
}

// Mock AbortController/AbortSignal - jsdom's implementation doesn't pass instanceof checks
// Replace unconditionally to ensure proper instanceof behavior

// Store native for prototype chain
const NativeAbortSignal = globalThis.AbortSignal;

// Create a proper constructor that passes instanceof
function MockAbortSignal() {
  // Create object with NO native prototype to avoid read-only getter issue
  // We'll set up the prototype chain manually after creation
  const signal = Object.create(null);

  // Add required properties as own properties (writable)
  Object.defineProperty(signal, 'aborted', { value: false, writable: true, configurable: true });
  Object.defineProperty(signal, 'reason', { value: undefined, writable: true, configurable: true });
  Object.defineProperty(signal, 'onabort', { value: null, writable: true, configurable: true });

  // Methods
  signal.addEventListener = function () {};
  signal.removeEventListener = function () {};
  signal.dispatchEvent = function () {
    return true;
  };

  // Set prototype AFTER defining properties to satisfy instanceof
  if (NativeAbortSignal) {
    Object.setPrototypeOf(signal, NativeAbortSignal.prototype);
  }

  return signal;
}

// Copy static methods
MockAbortSignal.abort = function (reason?: any) {
  const signal = MockAbortSignal();
  signal.aborted = true;
  signal.reason = reason;
  return signal;
};

MockAbortSignal.timeout = function (ms: number) {
  const signal = MockAbortSignal();
  setTimeout(() => {
    signal.aborted = true;
    signal.reason = new DOMException('Timeout', 'TimeoutError');
    signal.dispatchEvent(new Event('abort'));
  }, ms);
  return signal;
};

global.AbortSignal = MockAbortSignal as unknown as typeof AbortSignal;

// Mock AbortController to use our AbortSignal
global.AbortController = class AbortController {
  signal = MockAbortSignal();
  abort(reason?: any) {
    this.signal.aborted = true;
    this.signal.reason = reason;
    this.signal.dispatchEvent(new Event('abort'));
  }
} as unknown as typeof AbortController;

// Suppress console.error in tests unless explicitly needed
const originalError = console.error;
beforeAll(() => {
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
