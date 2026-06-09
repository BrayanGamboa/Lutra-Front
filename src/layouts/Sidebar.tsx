import { FileText, LayoutDashboard } from 'lucide-react';
import { NavLink } from 'react-router-dom';

import { cn } from '@/components/ui/cn';

const navigationItems = [
  {
    to: '/home',
    label: 'Inicio',
    icon: LayoutDashboard,
  },
  // {
  //   to: '/invoices',
  //   label: 'Facturas',
  //   icon: FileText,
  // },
];

export const Sidebar = (): JSX.Element => (
  <aside className="hidden w-72 flex-col border-r border-slate-200 bg-slate-950 px-6 py-8 text-white lg:flex">
    <div className="mb-10">
      <p className="text-xs uppercase tracking-[0.3em] text-sky-300">Lutra</p>
      <h1 className="mt-2 text-2xl font-semibold">Billing Console</h1>
      <p className="mt-2 text-sm text-slate-300">
        Operación front para facturación electrónica orientada a microservicios.
      </p>
    </div>

    <nav className="space-y-2">
      {navigationItems.map(({ icon: Icon, label, to }) => (
        <NavLink
          key={to}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-300 transition-colors',
              isActive ? 'bg-sky-600 text-white' : 'hover:bg-slate-900 hover:text-white',
            )
          }
          to={to}
        >
          <Icon className="h-4 w-4" />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  </aside>
);
