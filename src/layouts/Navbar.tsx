import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
import { useAuthStore, type AuthState } from '@/features/auth/authStore';

export const Navbar = (): JSX.Element => {
  const navigate = useNavigate();
  const logout = useAuthStore((state: AuthState) => state.logout);
  const user = useAuthStore((state: AuthState) => state.user);

  const handleLogout = (): void => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <header className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900"></h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-slate-900">
              {user?.name ? `${user.name} ${user.lastName ?? ''}`.trim() : (user?.username ?? '—')}
            </p>
            <p className="text-xs text-slate-500">
              {user?.roles?.[0] ?? user?.email ?? ''}
            </p>
          </div>

          <Button variant="ghost" tooltip='Salir' onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
};
