import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '@/app/ProtectedRoute';
import { useAuthStore, type AuthState } from '@/features/auth/authStore';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { HomePage } from '@/pages/HomePage';
import { LoginPage } from '@/pages/LoginPage';
import { InvoicesPage } from '@/pages/billing/InvoicesPage';

const RootRedirect = (): JSX.Element => {
  const isAuthenticated = useAuthStore(
    (state: AuthState) => state.isAuthenticated,
  );

  return <Navigate replace to={isAuthenticated ? '/home' : '/login'} />;
};

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRedirect />,
  },
  {
    path: '/login',
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: 'home',
        element: <HomePage />,
      },
      // {
      //   path: 'invoices',
      //   element: <InvoicesPage />,
      // },
    ],
  },
]);
