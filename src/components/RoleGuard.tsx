import type { ReactNode } from 'react';

import { useAuthStore, type AuthState } from '@/features/auth/authStore';

export interface RoleGuardProps {
  // Roles permitidos para acceder a los hijos. 
  allow: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export const RoleGuard = ({
  allow,
  fallback = null,
  children,
}: RoleGuardProps): JSX.Element => {
  const userRoles = useAuthStore((s: AuthState) => s.user?.roles ?? []);

  const hasAccess =
    allow.includes('*') || allow.some((r) => userRoles.includes(r));

  return <>{hasAccess ? children : fallback}</>;
};
