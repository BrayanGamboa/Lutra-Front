import type { PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

import { useAuthStore, type AuthState } from '@/features/auth/authStore';

export const ProtectedRoute = ({
  children,
}: PropsWithChildren): JSX.Element => {
  const isAuthenticated = useAuthStore(
    (state: AuthState) => state.isAuthenticated,
  );
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location }} to="/login" />;
  }

  return <>{children}</>;
};
