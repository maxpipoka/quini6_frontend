import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { getCsrfToken } from './csrf';
import type { AuthContextValue, User, LoginCredentials, ChangePasswordInput } from './types';

const AuthContext = createContext<AuthContextValue | null>(null);

let refreshPromise: Promise<void> | null = null;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;

  const refresh = useCallback(async () => {
    if (refreshPromise) return refreshPromise;

    refreshPromise = (async () => {
      try {
        const response = await fetch('/api/admin/auth/me', {
          credentials: 'include',
          headers: {
            'X-CSRF-Token': getCsrfToken() || '',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
        refreshPromise = null;
      }
    })();

    return refreshPromise;
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (creds: LoginCredentials) => {
    const response = await fetch('/api/admin/auth/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken() || '',
      },
      body: JSON.stringify(creds),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Login failed');
    }

    const data = await response.json();
    setUser(data.user);
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': getCsrfToken() || '',
      },
    });
    setUser(null);
  }, []);

  const changePassword = useCallback(async (data: ChangePasswordInput) => {
    const response = await fetch('/api/admin/auth/change-password', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken() || '',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Change password failed');
    }
  }, []);

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    changePassword,
    refresh,
    getCsrfToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}