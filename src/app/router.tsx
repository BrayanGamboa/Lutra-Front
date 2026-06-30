import { createBrowserRouter, Navigate } from 'react-router-dom';

import { ProtectedRoute } from '@/app/ProtectedRoute';
import { useAuthStore, type AuthState } from '@/features/auth/authStore';
import { AuthLayout } from '@/layouts/AuthLayout';
import { MainLayout } from '@/layouts/MainLayout';
import { AccessDeniedPage } from '@/pages/AccessDeniedPage';
import { CatalogPage } from '@/pages/catalog/CatalogPage';
import { CustomerProfilePage } from '@/pages/customer/CustomerProfilePage';
import { HomePage } from '@/pages/HomePage';
import { CategoriesPage } from '@/pages/inventory/CategoriesPage';
import { SuppliersPage } from '@/pages/inventory/SuppliersPage';
import { LoginPage } from '@/pages/LoginPage';
import { ProductsPage } from '@/pages/products/ProductsPage';
import { SalesPage } from '@/pages/sales/SalesPage';

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
    path: '/sin-acceso',
    element: <AccessDeniedPage />,
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
      {
        path: 'sales',
        element: <SalesPage />,
      },
      {
        path: 'products',
        element: (
          <ProtectedRoute allowedRoles={['Administrador', 'Vendedor']}>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inventory/categories',
        element: (
          <ProtectedRoute allowedRoles={['Administrador', 'Inventario']}>
            <CategoriesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'inventory/suppliers',
        element: (
          <ProtectedRoute allowedRoles={['Administrador', 'Inventario']}>
            <SuppliersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: 'profile',
        element: <CustomerProfilePage />,
      },
      {
        path: 'catalog',
        element: <CatalogPage />,
      },
    ],
  },
]);
