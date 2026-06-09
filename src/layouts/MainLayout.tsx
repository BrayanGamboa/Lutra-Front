import { Outlet } from 'react-router-dom';

import { Navbar } from '@/layouts/Navbar';
import { Sidebar } from '@/layouts/Sidebar';

export const MainLayout = (): JSX.Element => (
  <div className="flex min-h-screen bg-slate-100">
    <Sidebar />

    <div className="flex min-h-screen flex-1 flex-col">
      <Navbar />

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  </div>
);
