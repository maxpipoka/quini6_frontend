import { beforeAll, afterAll, afterEach, vi } from 'vitest';
import { setupServer } from 'msw/node';
import { handlers } from '../mock/handlers';
import '@testing-library/jest-dom';

// MSW server for API mocking
export const server = setupServer(...handlers);

beforeAll(() => {
  // MSW's SharedOptions type doesn't include onUnhandledRequest in its type definition
  // but it's a valid runtime option
  server.listen({ onUnhandledRequest: 'error' } as Parameters<typeof server.listen>[0]);
});
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
function MockAbortSignal(): AbortSignal {
  // Create object with NO native prototype to avoid read-only getter issue
  // We'll set up the prototype chain manually after creation
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const signal = Object.create(null);

  // Add required properties as own properties (writable)
  Object.defineProperty(signal, 'aborted', { value: false, writable: true, configurable: true });
  Object.defineProperty(signal, 'reason', { value: undefined, writable: true, configurable: true });
  Object.defineProperty(signal, 'onabort', { value: null, writable: true, configurable: true });

  // Methods
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  signal.addEventListener = (
    _type: string,
    _listener: EventListenerOrEventListenerObject | null,
    _options?: boolean | AddEventListenerOptions
  ): void => {
    // no-op
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  signal.removeEventListener = (
    _type: string,
    _listener: EventListenerOrEventListenerObject | null,
    _options?: boolean | EventListenerOptions
  ): void => {
    // no-op
  };
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  signal.dispatchEvent = (_event: Event): boolean => {
    return true;
  };

  // Set prototype AFTER defining properties to satisfy instanceof
  if (NativeAbortSignal) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    Object.setPrototypeOf(signal, NativeAbortSignal.prototype);
  }

  return signal as unknown as AbortSignal;
}

// Copy static methods
MockAbortSignal.abort = function (reason?: unknown): AbortSignal {
  const signal = MockAbortSignal();
  Object.defineProperty(signal, 'aborted', { value: true, writable: true, configurable: true });
  Object.defineProperty(signal, 'reason', { value: reason, writable: true, configurable: true });
  return signal;
};

MockAbortSignal.timeout = function (ms: number): AbortSignal {
  const signal = MockAbortSignal();
  setTimeout(() => {
    Object.defineProperty(signal, 'aborted', { value: true, writable: true, configurable: true });
    Object.defineProperty(signal, 'reason', {
      value: new DOMException('Timeout', 'TimeoutError'),
      writable: true,
      configurable: true,
    });
    signal.dispatchEvent(new Event('abort'));
  }, ms);
  return signal;
};

global.AbortSignal = MockAbortSignal as unknown as typeof AbortSignal;

// Mock AbortController to use our AbortSignal
global.AbortController = class AbortController {
  signal = MockAbortSignal();
  abort(reason?: unknown): void {
    Object.defineProperty(this.signal, 'aborted', {
      value: true,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(this.signal, 'reason', {
      value: reason,
      writable: true,
      configurable: true,
    });
    this.signal.dispatchEvent(new Event('abort'));
  }
};

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
