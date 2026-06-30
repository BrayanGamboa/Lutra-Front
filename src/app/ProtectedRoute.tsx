import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore, type AuthState } from '@/features/auth/authStore';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children: ReactNode;
}

export const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps): JSX.Element => {
  const isAuthenticated = useAuthStore(
    (state: AuthState) => state.isAuthenticated,
  );
  const userRoles = useAuthStore((state: AuthState) => state.user?.roles ?? []);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  if (allowedRoles !== undefined && allowedRoles.length > 0) {
    const hasRole =
      allowedRoles.includes('*') ||
      allowedRoles.some((r) => userRoles.includes(r));

    if (!hasRole) {
      return <Navigate replace to="/sin-acceso" />;
    }
  }

  return <>{children}</>;
};
