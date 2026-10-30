import { useState, useEffect } from 'react';
import { LayoutDashboard, Settings, LogOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
}

const NAV_ITEMS = [
  { href: '/admin/draws', label: 'Sorteos', icon: LayoutDashboard },
  { href: '/admin/change-password', label: 'Cambiar contraseña', icon: Settings },
];

export function Sidebar({ isCollapsed = false, onToggle }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(isCollapsed);
  const [currentPath, setCurrentPath] = useState('');
  const STORAGE_KEY = 'sidebar-collapsed';

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      setCollapsed(saved === 'true');
    }
    setCurrentPath(window.location.pathname);
  }, []);

  const toggle = () => {
    const newCollapsed = !collapsed;
    setCollapsed(newCollapsed);
    localStorage.setItem(STORAGE_KEY, String(newCollapsed));
    onToggle?.();
  };

  const handleLogout = () => {
    fetch('/api/admin/auth/logout', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': getCsrfToken() ?? '',
      },
    })
      .then((response) => {
        if (response.ok) {
          window.location.href = '/admin/login';
        } else {
          window.location.href = '/admin/login';
        }
      })
      .catch(() => {
        window.location.href = '/admin/login';
      });
  };

  function getCsrfToken(): string | null {
    const match = document.cookie.match(/(?:^|; )csrf_token=([^;]*)/);
    return match?.[1] ? decodeURIComponent(match[1]) : null;
  }

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 border-r border-border bg-surface transition-all duration-300 ${collapsed ? 'w-16' : ''}`}
      style={{ width: collapsed ? 'var(--sidebar-w-16-width)' : 'var(--sidebar-width)' }}
      aria-label="Navegación principal"
    >
      <nav
        className="flex-1 space-y-1 overflow-y-auto p-4"
        style={{ minWidth: 'var(--sidebar-w-16-width)' }}
      >
        <ul className="space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
            <li key={href}>
              <a
                href={href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary ${
                  currentPath === href ? 'bg-primary-500/10 text-primary-500' : ''
                }`}
                title={collapsed ? label : undefined}
              >
                <Icon className="size-5 flex-shrink-0" aria-hidden="true" />
                {!collapsed && <span className="font-medium">{label}</span>}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t border-border p-4">
        {!collapsed && (
          <button
            onClick={handleLogout}
            className="bg-error-500/10 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-text-secondary transition-colors hover:text-error-500"
          >
            <LogOut className="size-5 flex-shrink-0" aria-hidden="true" />
            <span className="font-medium">Cerrar sesión</span>
          </button>
        )}

        <button
          onClick={toggle}
          className={`flex w-full items-center justify-center rounded-lg px-3 py-2 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary ${
            collapsed ? 'ml-auto' : ''
          }`}
          aria-label={collapsed ? 'Expandir menú' : 'Colapsar menú'}
          aria-expanded={!collapsed}
        >
          {collapsed ? (
            <ChevronRight className="size-5" aria-hidden="true" />
          ) : (
            <ChevronLeft className="size-5" aria-hidden="true" />
          )}
        </button>
      </div>
    </aside>
  );
}
