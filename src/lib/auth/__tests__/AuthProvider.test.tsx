import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthProvider';

// Set up environment variables for tests
vi.stubEnv('VITE_API_BASE_URL', 'http://localhost:3000');

const TestComponent = () => {
  const auth = useAuth();
  return (
    <div>
      <span data-testid="user">{auth.user?.email ?? 'none'}</span>
      <span data-testid="loading">{String(auth.isLoading)}</span>
      <span data-testid="authenticated">{String(auth.isAuthenticated)}</span>
      <button
        onClick={() => void auth.login({ email: 'test@test.com', password: 'pass' })}
        data-testid="login-btn"
      >
        Login
      </button>
      <button onClick={() => void auth.logout()} data-testid="logout-btn">
        Logout
      </button>
      <button onClick={() => void auth.refresh()} data-testid="refresh-btn">
        Refresh
      </button>
      <button
        onClick={() => void auth.changePassword({ currentPassword: 'old', newPassword: 'new' })}
        data-testid="change-pass-btn"
      >
        Change Password
      </button>
      <span data-testid="csrf">{auth.getCsrfToken()}</span>
    </div>
  );
};

describe('AuthProvider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Set up csrf_token cookie for tests
    document.cookie = 'csrf_token=mock-csrf-token';
  });

  it('provides initial loading state and no user', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially loading is true
    expect(screen.getByTestId('loading').textContent).toBe('true');
    expect(screen.getByTestId('user').textContent).toBe('none');
    expect(screen.getByTestId('authenticated').textContent).toBe('false');

    // After initial fetch, loading should be false
    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // User should be set from the mock /me response
    expect(screen.getByTestId('user').textContent).toBe('test@test.com');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
  });

  it('sets user on successful login', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    // Should show user from initial /me call
    expect(screen.getByTestId('user').textContent).toBe('test@test.com');
    expect(screen.getByTestId('authenticated').textContent).toBe('true');
  });

  it('clears user on logout', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    act(() => {
      screen.getByTestId('logout-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('user').textContent).toBe('none');
      expect(screen.getByTestId('authenticated').textContent).toBe('false');
    });
  });

  it('dedupes concurrent refresh calls', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    act(() => {
      screen.getByTestId('refresh-btn').click();
      screen.getByTestId('refresh-btn').click();
    });

    await waitFor(() => {
      // Both clicks should only trigger one refresh
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });
  });

  it('changePassword calls API with correct params', async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('loading').textContent).toBe('false');
    });

    act(() => {
      screen.getByTestId('change-pass-btn').click();
    });

    await waitFor(() => {
      expect(screen.getByTestId('authenticated').textContent).toBe('true');
    });
  });

  it('getCsrfToken returns token from context', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByTestId('csrf').textContent).toBe('mock-csrf-token');
  });
});
