import { AuthProvider } from '../../lib/auth/AuthProvider';
import { Sidebar } from './Sidebar';

export function SidebarWrapper() {
  return (
    <AuthProvider>
      <Sidebar client:visible />
    </AuthProvider>
  );
}