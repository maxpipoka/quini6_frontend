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
