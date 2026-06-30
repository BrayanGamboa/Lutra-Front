import {
  BookOpen,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  Package,
  Receipt,
  Tag,
  Truck,
  User,
  Warehouse,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { cn } from '@/components/ui/cn';
import { useAuthStore, type AuthState } from '@/features/auth/authStore';

interface NavItem {
  label: string;
  path: string;
  icon: LucideIcon;
  /** Roles allowed to see this item. Use ['*'] for any authenticated user. */
  roles: string[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio',     path: '/home',                  icon: LayoutDashboard, roles: ['*'] },
  { label: 'Ventas',     path: '/sales',                 icon: Receipt,         roles: ['Administrador', 'Vendedor', 'Supervisor', 'Contador', 'Cliente'] },
  { label: 'Productos',  path: '/products',              icon: Package,         roles: ['Administrador', 'Vendedor'] },
  { label: 'Catálogos',  path: '/catalog',               icon: BookOpen,        roles: ['Administrador'] },
  { label: 'Mi Perfil',  path: '/profile',               icon: User,            roles: ['*'] },
];

const INVENTORY_ITEMS: NavItem[] = [
  { label: 'Categorías', path: '/inventory/categories', icon: Tag,  roles: ['Administrador', 'Inventario'] },
  { label: 'Proveedores', path: '/inventory/suppliers', icon: Truck, roles: ['Administrador', 'Inventario'] },
];

const navLinkClass = ({ isActive }: { isActive: boolean }): string =>
  cn(
    'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors',
    isActive ? 'bg-sky-600 text-white' : 'hover:bg-slate-900 hover:text-white',
  );

function hasAccess(itemRoles: string[], userRoles: string[]): boolean {
  return itemRoles.includes('*') || itemRoles.some((r) => userRoles.includes(r));
}

export const Sidebar = (): JSX.Element => {
  const navigate = useNavigate();
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const userRoles = useAuthStore((s: AuthState) => s.user?.roles ?? []);

  const handleLogout = (): void => {
    useAuthStore.getState().logout();
    navigate('/login', { replace: true });
  };

  const visibleInventoryItems = INVENTORY_ITEMS.filter((item) =>
    hasAccess(item.roles, userRoles),
  );
  const showInventory = visibleInventoryItems.length > 0;

  return (
    <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-950 px-6 py-8 text-white lg:flex">
      <div className="mb-10">
        <p className="text-lg uppercase tracking-[0.3em] text-sky-300 font-semibold">Lutra</p>
        <h1 className="mt-2 text-xl font-semibold">Facturación electrónica</h1>
      </div>

      <nav className="flex flex-1 flex-col space-y-1">
        {NAV_ITEMS.filter((item) => hasAccess(item.roles, userRoles)).map((item) => (
          <NavLink key={item.path} to={item.path} className={navLinkClass}>
            <item.icon className="h-4 w-4" />
            <span>{item.label}</span>
          </NavLink>
        ))}

        {showInventory ? (
          <div>
            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-900 hover:text-white"
              onClick={() => setInventoryOpen((prev) => !prev)}
            >
              <Warehouse className="h-4 w-4" />
              <span className="flex-1 text-left">Inventario</span>
              {inventoryOpen ? (
                <ChevronDown className="h-3.5 w-3.5" />
              ) : (
                <ChevronRight className="h-3.5 w-3.5" />
              )}
            </button>

            {inventoryOpen ? (
              <div className="ml-7 mt-1 space-y-1">
                {visibleInventoryItems.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors',
                        isActive ? 'bg-sky-600 text-white' : 'hover:bg-slate-900 hover:text-white',
                      )
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            ) : null}
          </div>
        ) : null}

        <div className="flex-1" />

        <button
          type="button"
          className="mt-4 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-900 hover:text-rose-400"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </button>
      </nav>
    </aside>
  );
};
